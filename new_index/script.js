// ============================================
// DATA & CONFIGURATION
// ============================================

const courseColorConfigs = Object.freeze({
  blue: {
    icon: 'var(--course-blue-icon)',
    button: 'var(--course-blue-btn)',
    particles: ['rgba(59,130,246,', 'rgba(96,165,250,'],
  },
  green: {
    icon: 'var(--course-green-icon)',
    button: 'var(--course-green-btn)',
    particles: ['rgba(16,185,129,', 'rgba(52,211,153,'],
  },
  orange: {
    icon: 'var(--course-orange-icon)',
    button: 'var(--course-orange-btn)',
    particles: ['rgba(245,158,11,', 'rgba(251,191,36,'],
  },
  purple: {
    icon: 'var(--course-purple-icon)',
    button: 'var(--course-purple-btn)',
    particles: ['rgba(139,92,246,', 'rgba(167,139,250,'],
  },
  grey: {
    icon: 'var(--course-grey-icon)',
    button: 'var(--course-grey-btn)',
    particles: ['rgba(107,114,128,', 'rgba(156,163,175,'],
  },
  cyan: {
    icon: 'var(--course-cyan-icon)',
    button: 'var(--course-cyan-btn)',
    particles: ['rgba(6,182,212,', 'rgba(34,211,238,'],
  },
});

const courses = {
  python1: {
    moodleId: 297,
    name: 'Python 1',
    level: 'Beginner',
    description: 'Master the fundamentals of Python programming with hands-on projects and interactive coding exercises.',
    icon: '🐍',
    color: 'blue',
    stats: { exercises: 260, lessons: 25, duration: '30h' },
  },
  python2: {
    moodleId: 308,
    name: 'Python 2',
    level: 'Advanced',
    description: 'Advanced Python concepts including OOP, web frameworks, and real-world application development.',
    icon: '🚀',
    color: 'green',
    stats: { exercises: 196, lessons: 10, duration: '36h' },
  },
  math101: {
    moodleId: 220,
    name: 'Math 101',
    level: 'Foundation',
    description: 'Build a strong mathematical foundation with interactive problem-solving and visual learning tools.',
    icon: '📐',
    color: 'orange',
    stats: { exercises: 377, lessons: 16, duration: '25h' },
  },
  'math-ml': {
    moodleId: null,
    name: 'Math for ML',
    level: 'Advanced',
    description: 'Learn data analysis, visualization, and machine learning fundamentals with Python and popular libraries.',
    icon: '🤖',
    color: 'purple',
    stats: { exercises: 100, lessons: 0, duration: '48h' },
    comingSoon: true,
  },
  // All other platform courses grouped into one particle cluster — no card rendered
  other: {
    moodleId: null,
    color: 'cyan',
    noCard: true,
  },
};

// Default progress for guests (will be updated with real data for logged-in users)
const courseProgress = {
  python1: 0,
  python2: 0,
  math101: 0,
  'math-ml': 0,
  other: 0,
};

const BANNER_STORAGE_KEY = 'loc-banner-dismissed';
const PHYSICS_EPSILON = 1e-6;

const telemetryState = {
  fps: 0,
  particles: 0,
  apiStatus: 'idle',
  lastSyncAt: null,
  timerId: null,
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getSafeProgress(progress, total) {
  const safeProgress = Math.max(0, Number(progress) || 0);
  const safeTotal = Math.max(0, Number(total) || 0);
  return {
    progress: safeTotal > 0 ? Math.min(safeProgress, safeTotal) : safeProgress,
    total: safeTotal,
  };
}

function getProgressPercentage(progress, total) {
  const normalized = getSafeProgress(progress, total);
  if (normalized.total === 0) return 0;
  return clamp(Math.round((normalized.progress / normalized.total) * 100), 0, 100);
}

function getApiStatusLabel(status) {
  if (status === 'online') return 'ONLINE';
  if (status === 'syncing') return 'SYNCING';
  if (status === 'degraded') return 'DEGRADED';
  return 'IDLE';
}

function formatLastSync(lastSyncAt) {
  if (!lastSyncAt) return 'Waiting';
  const ageSeconds = Math.max(0, Math.floor((Date.now() - lastSyncAt) / 1000));
  if (ageSeconds < 3) return 'Just now';
  if (ageSeconds < 60) return `${ageSeconds}s ago`;
  if (ageSeconds < 3600) return `${Math.floor(ageSeconds / 60)}m ago`;
  return `${Math.floor(ageSeconds / 3600)}h ago`;
}

function renderTelemetryHud() {
  const statsEl = document.getElementById('perf-stats');
  if (!statsEl) return;

  const base = `FPS: ${telemetryState.fps || 0} | Particles: ${telemetryState.particles || 0}`;
  if (telemetryState.apiStatus === 'idle') {
    statsEl.textContent = base;
    return;
  }

  statsEl.textContent = `${base} | API: ${getApiStatusLabel(telemetryState.apiStatus)} | Sync: ${formatLastSync(telemetryState.lastSyncAt)}`;
}

function setTelemetryApiStatus(status) {
  telemetryState.apiStatus = status;
  renderTelemetryHud();
}

function startTelemetryHud() {
  renderTelemetryHud();
  if (telemetryState.timerId) clearInterval(telemetryState.timerId);
  telemetryState.timerId = setInterval(renderTelemetryHud, 1000);
}


// ============================================
// PARTICLE SYSTEM
// ============================================

const NODE_SIZE = 4;
const LINE_COLOR = "rgba(240,240,240,1)";
const NODES_DISTANCE = 35;
const SPEED_DAMPING = 0.8;
const EMPTY_COURSE_NODES_COUNT = 30;

// Scale configuration: tune these to control how particle sizes/padding
// respond to particle density. `referenceArea` expresses a baseline
// canvas area (in CSS pixels) used to normalize density so zooming is stable.
const SCALE_CONFIG = {
  constant: 12,
  min: 0.1,
  max: 1.0,
  referenceArea: 1000000
};

class Particle {
  constructor(x, y, size, colorPrefix, opacity, group) {
    this.x = x;
    this.y = y;
    this.baseSize = size;
    this.opacity = opacity;
    this.colorPrefix = colorPrefix;
    this.size = this.baseSize;
    this.timeOffset = Math.random() * Math.PI * 2;
    this.velocityX = 0;
    this.velocityY = 0;
    this.group = group;
    this.pulse = 1;
  }
  
  update(time) {
    this.pulse = Math.sin(time * 0.01 + this.timeOffset);
    this.size = this.baseSize * (1 + this.pulse * 0.1);
    this.velocityX *= SPEED_DAMPING;
    this.velocityY *= SPEED_DAMPING;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx) {
    ctx.fillStyle = this.colorPrefix + this.opacity.toFixed(2) + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  drawEdge(ctx, particle) {
    if (particle === null) return;
    ctx.strokeStyle = LINE_COLOR;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(particle.x, particle.y);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.particles = [];
    this.animationFrame = null;
    this.time = 0;
    this.mouse = { x: -1000, y: -1000 };
    this.mouseClick = false;
    this.scale = 1;
    this.initialized = false;
    this.lastCenterX = 0;
    this.lastCenterY = 0;
    this.frames = 0;
    this.fps = 0;
    this.lastFpsTime = performance.now();
    
    this.init();
  }

  init() {
    this.ctx.globalCompositeOperation = 'source-over';
    this.setupEventListeners();
    this.resize();
    this.animate();
  }

  setupEventListeners() {
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        this.mouse.x = x;
        this.mouse.y = y;
      } else {
        this.mouse.x = -1000;
        this.mouse.y = -1000;
      }
    });

    window.addEventListener('mousedown', () => {
      this.mouseClick = true;
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.resize(), 150);
    }, { passive: true });
  }

  resize() {
    const hero = this.canvas.parentElement;
    if (!hero) return;
    
    // prefer last known centers in CSS pixels (set after first init),
    // fallback to current canvas dimensions
    const oldCenterX = (this.lastCenterX && this.lastCenterX > 0) ? this.lastCenterX : (this.canvas.width / 2);
    const oldCenterY = (this.lastCenterY && this.lastCenterY > 0) ? this.lastCenterY : (this.canvas.height / 2);
    
    const width = hero.clientWidth;
    const height = hero.clientHeight;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    if (!this.initialized) {
      this.createParticles(width, height);
      this.initialized = true;
      this.lastCenterX = width / 2;
      this.lastCenterY = height / 2;
    } else {
      this.updateScale(oldCenterX, oldCenterY, width, height);
      this.lastCenterX = width / 2;
      this.lastCenterY = height / 2;
    }
  }

  scaleCoefficient(nodesCount, width, height) {
    // Use particle density (nodes / area) so visual scale remains consistent
    // when page zoom or devicePixelRatio changes.
    if (!nodesCount || nodesCount <= 0) return SCALE_CONFIG.max;

    const w = width || (this.canvas ? this.canvas.width : 1);
    const h = height || (this.canvas ? this.canvas.height : 1);
    const area = Math.max(1, w * h);

    const normalizedNodes = (nodesCount * SCALE_CONFIG.referenceArea) / area;
    const raw = SCALE_CONFIG.constant / Math.sqrt(Math.max(1, normalizedNodes));
    return Math.max(SCALE_CONFIG.min, Math.min(SCALE_CONFIG.max, raw));
  }

  updateScale(oldCenterX, oldCenterY, newWidth, newHeight) {
    const nonEmptyCourses = Object.entries(courseProgress)
      .filter(([_, progress]) => progress > 0);

    let nodesCount = nonEmptyCourses.reduce((sum, [_, progress]) => sum + progress, 0);
    const fakeNodesCount = Math.max(0, 100 - nodesCount);
    nodesCount += fakeNodesCount;
    
    // Use CSS pixel width/height passed from resize so density is stable across zoom
    const newScale = this.scaleCoefficient(nodesCount, newWidth || this.canvas.width, newHeight || this.canvas.height);
    const scaleRatio = newScale / this.scale;
    this.scale = newScale;

    const newCenterX = (newWidth || this.canvas.width) / 2;
    const newCenterY = (newHeight || this.canvas.height) / 2;

    this.particles.forEach(particle => {
      particle.baseSize *= scaleRatio;
      particle.size = particle.baseSize;
      
      const offsetX = particle.x - oldCenterX;
      const offsetY = particle.y - oldCenterY;
      
      particle.x = newCenterX + offsetX;
      particle.y = newCenterY + offsetY;
    });
  }

  createParticles(width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const particles = [];

    const nodesCount = Object.entries(courseProgress).reduce((sum, [id, progress]) => {
      if (courses[id]?.comingSoon) return sum; // skip coming soon
      return sum + (progress === 0 ? EMPTY_COURSE_NODES_COUNT : progress);
    }, 0);

    this.scale = this.scaleCoefficient(nodesCount, width, height);

    Object.entries(courseProgress).forEach(([courseId, progress], index) => {
      if (courses[courseId].comingSoon) return; // skip coming soon — no particles
      // noCard courses (like 'other') still get a particle cluster, just no card

      const count = progress === 0 ? EMPTY_COURSE_NODES_COUNT : progress;
      const grey = "rgba(230,230,230,";
      const config = progress > 0 ? courseColorConfigs[courses[courseId].color] : null;
      const randomColor = () => config.particles[Math.floor(Math.random() * config.particles.length)];

      // Hub particle: colored if progress, grey if empty
      const hubColor = config ? randomColor() : grey;
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 30;
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      const courseParticle = new Particle(x, y, 3 * NODE_SIZE * this.scale, hubColor, 1, index);
      particles.push(courseParticle);

      // Child particles
      for (let i = 0; i < count; i++) {
        const color = config ? randomColor() : grey;
        const a = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100;
        const px = courseParticle.x + Math.cos(a) * distance;
        const py = courseParticle.y + Math.sin(a) * distance;
        particles.push(new Particle(px, py, NODE_SIZE * this.scale, color, 1, index));
      }
    });
    
    this.particles = particles;
  }

  animate() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.time += 1;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    if (width === 0 || height === 0) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
      return;
    }

    this.ctx.clearRect(0, 0, width, height);
    
    const particles = this.particles;
    const mouse = this.mouse;
    let repulsionForce = 3;
    let repulsionRadius = 80;
    
    if (this.mouseClick) {
      repulsionRadius = 160;
      repulsionForce = 40;
      this.mouseClick = false;
    }

    const basePadding = NODES_DISTANCE * this.scale;
    const gridSize = NODE_SIZE * 6 * this.scale + basePadding * 3;
    const gridSizeInv = 1 / gridSize;
    const grid = new Map();

    const posHash = (x, y) => x * 1e9 + y;

    // Build spatial grid
    particles.forEach((particle, index) => {
      const gridX = Math.floor(particle.x * gridSizeInv);
      const gridY = Math.floor(particle.y * gridSizeInv);
      const pos = posHash(gridX, gridY);
      if (!grid.has(pos)) {
        grid.set(pos, [index]);
      } else {
        grid.get(pos).push(index);
      }
    });

    // Update particles
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i];
      let fx = 0;
      let fy = 0;
      
      // Attraction to center
      const attractionCoefficient = 0.0005;
      const targetX = centerX;
      const targetY = centerY;
      fx += attractionCoefficient * (targetX - particle.x);
      fy += attractionCoefficient * (targetY - particle.y);
      
      // Mouse repulsion
      const mouseDistance2 = (mouse.x - particle.x) ** 2 + (mouse.y - particle.y) ** 2;
      const mouseDistance = Math.sqrt(mouseDistance2);
      if (mouseDistance > PHYSICS_EPSILON && mouseDistance < repulsionRadius) {
        const force = repulsionForce * (repulsionRadius - mouseDistance) / repulsionRadius;
        fx += (particle.x - mouse.x) / mouseDistance * force;
        fy += (particle.y - mouse.y) / mouseDistance * force;
      }
      
      let drawCnt = 0;
      const gridX = Math.floor(particle.x * gridSizeInv);
      const gridY = Math.floor(particle.y * gridSizeInv);
      
      // Check neighboring grid cells
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const pos = posHash(gridX + dx, gridY + dy);
          if (!grid.has(pos)) continue;
          
          grid.get(pos).forEach(j => {
            if (i === j) return;
            
            const particle2 = particles[j];
            const dist2 = (particle.x - particle2.x) ** 2 + (particle.y - particle2.y) ** 2;
            const sameGroup = particle.group === particle2.group;
            const padding = basePadding * (sameGroup ? 1 : 3);
            let wantedDistance = padding + particle.size + particle2.size;
            
            // Repulsion between particles
            if (dist2 > PHYSICS_EPSILON && dist2 < wantedDistance ** 2) {
              const dist = Math.sqrt(dist2);
              const t = (wantedDistance - dist) / wantedDistance;
              const force = 6 * t;
              const relativeForce = (force * particle2.size) / (particle.size + particle2.size);
              fx += (particle.x - particle2.x) / dist * relativeForce;
              fy += (particle.y - particle2.y) / dist * relativeForce;
            }
            
            // Draw edges between same group particles
            if (sameGroup && drawCnt < 5 && dist2 < (wantedDistance + 1) ** 2) {
              particle.drawEdge(this.ctx, particle2);
              drawCnt++;
            }
          });
        }
      }
      
      particle.velocityX += fx;
      particle.velocityY += fy;
    }
    
    // Update particle positions
    particles.forEach(particle => particle.update(this.time));
    
    // Draw particles
    particles.forEach(particle => particle.draw(this.ctx));

    telemetryState.particles = particles.length;

    // FPS counter
    this.frames++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastFpsTime = now;
      telemetryState.fps = this.fps;
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

}

// ============================================
// COURSE CARD RENDERING
// ============================================

function renderCourseCards() {
  const grid = document.getElementById('courses-grid');

  Object.entries(courses).forEach(([id, course]) => {
    if (course.noCard) return;
    const config = courseColorConfigs[course.color];
    // progress is now actual question count, not percentage (0-100)
    const progress = courseProgress[id] || 0;
    const normalized = getSafeProgress(progress, course.stats.exercises);
    const progressPercentage = getProgressPercentage(progress, course.stats.exercises);

    const card = document.createElement('div');
    card.className = `course-card${course.comingSoon ? ' coming-soon' : ''}`;

    card.innerHTML = `
      <div class="card-header">
        <div class="course-icon" style="background: ${config.icon}">
          ${course.icon}
        </div>
        <div class="course-info">
          <h3>${course.name}</h3>
          <span class="course-level">${course.level}</span>
        </div>
      </div>

      <div class="card-body">
        <p class="course-description">${course.description}</p>

        <div class="course-progress">
          <div class="progress-label">
            <span>Progress</span>
            <span class="progress-percentage">${normalized.progress}/${normalized.total}</span>
          </div>
          <div class="progress-bar-container">
            <div 
              class="progress-bar-fill"
              style="width: ${progressPercentage}%; background: ${config.button}"
            ></div>
          </div>
        </div>
        
        <div class="course-stats">
          <div class="stat">
            <div class="stat-value">${course.stats.lessons}</div>
            <div class="stat-label">Lessons</div>
          </div>
          <div class="stat">
            <div class="stat-value">${course.stats.duration}</div>
            <div class="stat-label">Duration</div>
          </div>
        </div>
        
        ${course.comingSoon
          ? '<span class="course-btn" style="background: #9ca3af">Coming Soon</span>'
          : `<a href="/course/view.php?id=${course.moodleId}" class="course-btn" style="background: ${config.button}">Start Learning</a>`
        }
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// ============================================
// MOODLE API INTEGRATION
// ============================================

async function fetchMoodleProgress() {
  try {
    // Get all Moodle course IDs
    const moodleIds = Object.values(courses)
      .filter(c => c.moodleId !== null)
      .map(c => c.moodleId)
      .join(',');

    // Use questionprogress.php for exercise-level tracking
    const response = await fetch(`/local/questionprogress.php?courses=${moodleIds}&all=1`);
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        setTelemetryApiStatus('idle');
        telemetryState.lastSyncAt = null;
        return false;
      }
      throw new Error(`Progress API request failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.success || !data.data) {
      throw new Error('Progress API returned an unexpected payload');
    }

    Object.entries(courses).forEach(([id, course]) => {
      if (!course.stats) return; // skip stat-less entries like 'other'
      if (course.moodleId && data.data[course.moodleId]) {
        const moodleData = data.data[course.moodleId];
        courseProgress[id] = moodleData.correct || 0;

        if (moodleData.total > 0) {
          course.stats.exercises = moodleData.total;
        }
        if (moodleData.lessons > 0) {
          course.stats.lessons = moodleData.lessons;
        }
      }
    });

    if (data.data.other) {
      courseProgress.other = data.data.other.correct || 0;
    }

    updateCourseCardsProgress();
    updateHeader(data.userid, data.firstname);
    if (data.userid) {
      telemetryState.lastSyncAt = Date.now();
      setTelemetryApiStatus('online');
    } else {
      telemetryState.lastSyncAt = null;
      setTelemetryApiStatus('idle');
    }
    return true;
  } catch (error) {
    console.error('Unable to fetch Moodle progress:', error);
    setTelemetryApiStatus('idle');
    telemetryState.lastSyncAt = null;
    return false;
  }
}

// ============================================
// HEADER AUTH STATE
// ============================================

function updateHeader(userid, firstname) {
  const nav = document.getElementById('header-nav');
  if (!nav || !userid) return;

  const name = typeof firstname === 'string' && firstname.trim() ? firstname.trim() : 'User';
  const initial = (name.charAt(0) || 'U').toUpperCase();

  // Keep the logo, only replace the right-side links
  const logo = nav.querySelector('.site-nav-logo');
  if (!logo) return;

  const links = document.createElement('div');
  links.className = 'nav-links';

  const greeting = document.createElement('span');
  greeting.className = 'nav-greeting';
  greeting.textContent = `Hi, ${name}`;

  const avatar = document.createElement('span');
  avatar.className = 'nav-avatar';
  avatar.textContent = initial;

  const coursesLink = document.createElement('a');
  coursesLink.href = '/my/';
  coursesLink.className = 'nav-link';
  coursesLink.textContent = 'My Courses';

  const logoutLink = document.createElement('a');
  logoutLink.href = '/login/logout.php';
  logoutLink.className = 'nav-link nav-link--logout';
  logoutLink.textContent = 'Log out';

  links.append(greeting, avatar, coursesLink, logoutLink);
  nav.replaceChildren(logo, links);
}

function updateCourseCardsProgress() {
  const cards = document.querySelectorAll('.course-card');
  let cardIndex = 0;
  Object.entries(courses).forEach(([id, course]) => {
    if (course.noCard || !course.stats) return; // skip non-card entries
    const progress = courseProgress[id] || 0;
    const normalized = getSafeProgress(progress, course.stats.exercises);
    const progressPercentage = getProgressPercentage(progress, course.stats.exercises);

    const card = cards[cardIndex];
    cardIndex++;
    if (!card) return;

    const progressLabel = card.querySelector('.progress-percentage');
    const progressBar = card.querySelector('.progress-bar-fill');
    const lessonsEl = [...card.querySelectorAll('.stat')]
      .find(s => s.querySelector('.stat-label')?.textContent === 'Lessons')
      ?.querySelector('.stat-value');

    if (progressLabel) {
      progressLabel.textContent = `${normalized.progress}/${normalized.total}`;
    }
    if (progressBar) {
      progressBar.style.width = `${progressPercentage}%`;
    }
    if (lessonsEl) {
      lessonsEl.textContent = course.stats.lessons;
    }
  });
}

// ============================================
// TYPEWRITER
// ============================================

const TYPEWRITER_MESSAGES = [
  {
    text: 'Grow your Net by solving exercises',
    pauseEnd: 20000,
    link: null,
  },
  {
    text: 'Join our community on Telegram  ⌯⌲ ',
    pauseEnd: 30000,
    link: 'https://t.me/+kzlIFQy-XrwxODI8',
  },
];

function startTypewriter(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = TYPEWRITER_MESSAGES[0].text;
    return;
  }

  // Build inner structure: [text node] [cursor span]
  // Cursor is always present in the DOM — no absolute positioning tricks
  el.innerHTML = '';
  const textEl = document.createElement('span');
  textEl.className = 'tagline-text';
  const cursor = document.createElement('span');
  cursor.className = 'tagline-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  cursor.textContent = '|';
  el.appendChild(textEl);
  el.appendChild(cursor);

  let msgIndex = 0;
  let charIndex = 0;
  let erasing = false;
  let timer = null;
  let linkShown = false;

  function currentMsg() { return TYPEWRITER_MESSAGES[msgIndex]; }
  function currentText() { return currentMsg().text; }

  function showLink() {
    if (linkShown || !currentMsg().link) return;
    linkShown = true;
    textEl.innerHTML = '';
    const a = document.createElement('a');
    a.href = currentMsg().link;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'tagline-link';
    a.textContent = currentText();
    // fade in
    a.style.opacity = '0';
    textEl.appendChild(a);
    requestAnimationFrame(() => requestAnimationFrame(() => { a.style.opacity = '1'; }));
  }

  function hideLink() {
    if (!linkShown) return;
    linkShown = false;
    textEl.textContent = currentText().slice(0, charIndex);
  }

  function type() {
    if (!erasing) {
      charIndex++;
      textEl.textContent = currentText().slice(0, charIndex);
      if (charIndex === currentText().length) {
        showLink();
        timer = setTimeout(() => { erasing = true; tick(); }, currentMsg().pauseEnd);
        return;
      }
    } else {
      hideLink();
      charIndex--;
      textEl.textContent = currentText().slice(0, charIndex);
      if (charIndex === 0) {
        msgIndex = (msgIndex + 1) % TYPEWRITER_MESSAGES.length;
        erasing = false;
        timer = setTimeout(tick, 420);
        return;
      }
    }
    tick();
  }

  function tick() {
    const interval = erasing ? 28 : 52;
    timer = setTimeout(type, interval);
  }

  timer = setTimeout(tick, 900);
}

// ============================================
// INITIALIZATION
// ============================================

function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  ta.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(ta);
  return Promise.resolve();
}

function showCopyTooltip(el) {
  const tip = el.querySelector('.copy-tooltip');
  if (!tip) return;
  tip.classList.add('show');
  setTimeout(() => tip.classList.remove('show'), 1400);
}

function setupCopyableFooterItems() {
  document.querySelectorAll('.copyable').forEach(el => {
    const text = el.getAttribute('data-copy') || el.textContent.trim();
    el.addEventListener('click', () => {
      copyTextToClipboard(text).then(() => showCopyTooltip(el));
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copyTextToClipboard(text).then(() => showCopyTooltip(el));
      }
    });
  });
}

function setupDismissibleBanner() {
  const banner = document.getElementById('new-design-banner');
  if (!banner) return;

  let dismissed = false;
  try {
    dismissed = localStorage.getItem(BANNER_STORAGE_KEY) === '1';
  } catch (error) {
    dismissed = false;
  }

  if (dismissed) {
    banner.remove();
    return;
  }

  const dismissButton = banner.querySelector('.banner-dismiss');
  if (!dismissButton) return;

  dismissButton.addEventListener('click', () => {
    banner.remove();
    try {
      localStorage.setItem(BANNER_STORAGE_KEY, '1');
    } catch (error) {
      // Non-blocking for strict privacy modes.
    }
  });
}

function setupFooterRevealEffects() {
  const footer = document.querySelector('.main-footer');
  if (!footer) return;
  const logo = document.getElementById('footer-logo');
  const badges = Array.from(document.querySelectorAll('.footer-badge'));
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let lastIndex = -1;
  let activated = false;

  const pulse = () => {
    if (badges.length === 0) return;
    let index;
    do {
      index = Math.floor(Math.random() * badges.length);
    } while (index === lastIndex && badges.length > 1);

    lastIndex = index;
    const badge = badges[index];
    badge.classList.remove('is-pulsing');
    void badge.offsetWidth;
    badge.classList.add('is-pulsing');
    badge.addEventListener('animationend', () => badge.classList.remove('is-pulsing'), { once: true });
  };

  const activate = () => {
    if (activated) return;
    activated = true;

    if (logo) logo.classList.add('is-alive');
    if (reduceMotion || badges.length === 0) return;

    setTimeout(() => {
      pulse();
      setInterval(pulse, 10000);
    }, 3000);
  };

  if (!('IntersectionObserver' in window)) {
    activate();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0]?.isIntersecting) return;
    activate();
    observer.disconnect();
  }, { threshold: 0.35 });

  observer.observe(footer);
}

let particleSystem;

document.addEventListener('DOMContentLoaded', () => {
  setupDismissibleBanner();
  setupFooterRevealEffects();
  startTelemetryHud();

  renderCourseCards();
  setupCopyableFooterItems();
  startTypewriter('hero-tagline');

  fetchMoodleProgress().finally(() => {
    particleSystem = new ParticleSystem('hero-canvas');
  });
});
