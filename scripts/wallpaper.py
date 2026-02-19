# import ctypes
# import requests


# file_path = 'D:/vcode/V/k.jpg'

# ctypes.windll.user32.SystemParametersInfoW(20, 0, file_path , 0)

import time
import random
import sys
import requests #download image from url
import ctypes #change wallpaper
import os

from PIL import Image #proceed image
from io import BytesIO #save image to file
import pyautogui #move mouse

def mouse_trap():
    x = 0
    while x < 10:
        time.sleep(1)
        pyautogui.moveTo(random.randint(0, 1920), random.randint(0, 1080))
        x+= 1


def change_wallpaper():
    image_url = "https://img.freepik.com/vector-gratis/lapiz-amarillo-divertido-dibujos-animados-aislado-sobre-fondo-blanco-profesor-caracter-lindo_105738-1234.jpg"
    response = requests.get(image_url)
    if response.status_code == 200:
        image = Image.open(BytesIO(response.content))
        image_path = "downloaded_image.jpg"
        image.save(image_path)
        SPI_SETDESKWALLPAPER = 20
        ctypes.windll.user32.SystemParametersInfoW(SPI_SETDESKWALLPAPER, 0, os.path.abspath(image_path), 3)
    else:
        print(response.status_code)
        
def erase_text():
    time.sleep(random.randint(0, 3))
    sys.stdout.write("\033[F")
    sys.stdout.write("\033[K")

print(f"-----\n\nInstaller\nPlease wait while we install the program..\n\n")
print(f"░░░░░░░░░░░░░░░░░░░░")

erase_text()
print(f"█░░░░░░░░░░░░░░░░░░░")

erase_text()
print(f"██░░░░░░░░░░░░░░░░░░")
change_wallpaper()

erase_text()
print(f"███░░░░░░░░░░░░░░░░░")
mouse_trap()

erase_text()
print(f"████░░░░░░░░░░░░░░░░")
browser_popup()

erase_text()
print(f"█████░░░░░░░░░░░░░░░")
font_change()

chinese_keyboard()
erase_text()
print(f"██████░░░░░░░░░░░░░░")
reset()

erase_text()
print(f"███████░░░░░░░░░░░░░")
show_notification("Virus!", "Tohle je důležité oznámení!")

erase_text()
print(f"████████░░░░░░░░░░░░")

erase_text()
print(f"█████████░░░░░░░░░░░")

erase_text()
print(f"██████████░░░░░░░░░░")

browser_popup()
erase_text()
print(f"███████████░░░░░░░░░")

erase_text()
print(f"████████████░░░░░░░░")

erase_text()
print(f"█████████████░░░░░░░")

erase_text()
print(f"██████████████░░░░░░")

erase_text()
print(f"███████████████░░░░░")

erase_text()
print(f"████████████████░░░░")

erase_text()
print(f"█████████████████░░░")

erase_text()
print(f"██████████████████░░")

erase_text()
print(f"███████████████████░")

erase_text()
print(f"████████████████████")
erase_text()
