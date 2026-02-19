import requests
import json

def get_auth_token():
    """
    Authenticate and retrieve the access token from the auth endpoint.
    
    Returns:
        str: The access token if successful, None otherwise
    """
    auth_url = "https://auth.harbour.space/auth/realms/HS/protocol/openid-connect/token"
    
    # Prepare the authentication data
    auth_data = {
        'client_id': 'AcademiX',
        'grant_type': 'password',
        'username': 'academics@harbour.space',
        'password': 'academics.space'
    }
    
    try:
        # Make POST request to get token
        response = requests.post(auth_url, data=auth_data)
        response.raise_for_status()  # Raise exception for bad status codes
        
        # Extract token from response
        token_data = response.json()
        access_token = token_data.get('access_token')
        
        if access_token:
            print("✓ Authentication successful")
            return access_token
        else:
            print("✗ No access token found in response")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"✗ Authentication failed: {e}")
        return None


def get_students_data(auth_token):
    """
    Fetch all students data using the authenticated token.
    
    Args:
        auth_token (str): The Bearer token for authentication
        
    Returns:
        dict: The students data if successful, None otherwise
    """
    students_url = "https://pre-prod-student-admin.harbour.space/api/v1/users-list"
    
    # Set up parameters and headers
    params = {
        'page': 1,
        'per_page': -1  # -1 typically means "get all records"
    }
    
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    
    try:
        # Make GET request to fetch students
        response = requests.get(students_url, params=params, headers=headers)
        response.raise_for_status()
        
        students_data = response.json()
        print(f"✓ Successfully retrieved students data")
        
        return students_data
        
    except requests.exceptions.RequestException as e:
        print(f"✗ Failed to retrieve students data: {e}")
        return None


def main():
    """
    Main function to orchestrate the API calls.
    """
    print("Starting API data retrieval...\n")
    
    # Step 1: Get authentication token
    print("Step 1: Authenticating...")
    auth_token = get_auth_token()
    
    if not auth_token:
        print("\nProcess terminated: Authentication failed")
        return
    
    # Step 2: Get students data
    print("\nStep 2: Fetching students data...")
    students_data = get_students_data(auth_token)
    
    if students_data:
        print(f"\n{'='*50}")
        print("DATA RETRIEVAL COMPLETE")
        print(f"{'='*50}")
        
        # Display summary information
        if isinstance(students_data, dict):
            total = students_data.get('total', 'Unknown')
            print(f"Total records: {total}")
        
        # Optionally save to file
        with open('students_data.json', 'w', encoding='utf-8') as f:
            json.dump(students_data, f, indent=2, ensure_ascii=False)
        print("✓ Data saved to 'students_data.json'")
        
        return students_data
    else:
        print("\nProcess terminated: Failed to retrieve students data")
        return None


if __name__ == "__main__":
    # Run the main function
    result = main()
