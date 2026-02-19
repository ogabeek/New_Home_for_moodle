// ============================================
// LOGIN PAGE — v8
// Password toggle, particle canvas, cycling welcome messages
// ============================================

// ── Password toggle ─────────────────────────────────────────────────
const toggleBtn = document.getElementById('togglePwd');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

const eyeOpen = `<path fill="currentColor" d="M12 9a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5c-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0a9.821 9.821 0 0 0-17.64 0"/>`;
const eyeClosed = `<path fill="currentColor" d="M2 5.27L3.28 4L20 20.72L18.73 22l-3.08-3.08c-1.15.38-2.37.58-3.65.58c-5 0-9.27-3.11-11-7.5c.69-1.76 1.79-3.31 3.19-4.54zM12 9a3 3 0 0 1 3 3a3 3 0 0 1-.17 1L11 9.17A3 3 0 0 1 12 9m0-4.5c5 0 9.27 3.11 11 7.5a11.8 11.8 0 0 1-4 5.19l-1.42-1.43A9.86 9.86 0 0 0 20.82 12A9.82 9.82 0 0 0 12 6.5c-1.09 0-2.16.18-3.16.5L7.3 5.47c1.44-.62 3.03-.97 4.7-.97M3.18 12A9.82 9.82 0 0 0 12 17.5c.69 0 1.37-.07 2-.21L11.72 15A3.064 3.064 0 0 1 9 12.28L5.6 8.87c-.99.85-1.82 1.91-2.42 3.13"/>`;

let visible = false;
toggleBtn.addEventListener('click', () => {
  visible = !visible;
  passwordInput.type = visible ? 'text' : 'password';
  eyeIcon.innerHTML = visible ? eyeClosed : eyeOpen;
});

// ── Form submit ─────────────────────────────────────────────────────
document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();
  login(emailInput.value, passwordInput.value);
});

function login(email, password) {
  // TODO: replace with real Moodle auth call
  console.log(email, password);
}


// ============================================
// WELCOME PANEL — CYCLING MESSAGES
// ============================================

const WELCOME_MESSAGES = [
  {
    title: 'Keep building\nyour skills.',
    subtitle: 'Every exercise you complete gets you closer to mastery. Your progress is waiting.',
  },
  {
    title: 'Grow your\nnetwork.',
    subtitle: 'Connect with fellow coders, solve challenges together, and level up as a team.',
  },
  {
    title: 'Code more,\nlearn faster.',
    subtitle: 'Hands-on practice beats passive reading. Dive back into your exercises today.',
  },
  {
    title: 'Your journey\ncontinues.',
    subtitle: 'Pick up exactly where you left off. Your courses, your pace, your progress.',
  },
];

const rightContent = document.querySelector('.right-content');
const titleEl = document.getElementById('welcome-title');
const subtitleEl = document.getElementById('welcome-subtitle');
let currentMsgIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);

function showMessage(index) {
  const msg = WELCOME_MESSAGES[index];
  titleEl.innerHTML = msg.title.replace(/\n/g, '<br>');
  subtitleEl.textContent = msg.subtitle;
}

function cycleMessage() {
  // Fade out
  rightContent.classList.add('fade-out');
  setTimeout(() => {
    currentMsgIndex = (currentMsgIndex + 1) % WELCOME_MESSAGES.length;
    showMessage(currentMsgIndex);
    // Fade back in
    rightContent.classList.remove('fade-out');
  }, 500); // matches CSS transition duration
}

// Show first message immediately, then cycle every 6 s
showMessage(currentMsgIndex);
setInterval(cycleMessage, 6000);


// ============================================
// PARTICLE SYSTEM — Login right panel
// Lightweight decorative version of the landing page net
// ============================================

const PARTICLE_CONFIG = {
  count:       60,
  nodeSize:    3,
  lineColor:   'rgba(255,255,255,',
  connectDist: 100,
  speed:       0.3,
  colors: [
    'rgba(255,255,255,',   // white
    'rgba(56,201,255,',    // loc-cyan
    'rgba(207,117,255,',   // loc-violet
  ],
};

class LoginParticle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.size = PARTICLE_CONFIG.nodeSize * (0.5 + Math.random());
    this.colorPrefix = PARTICLE_CONFIG.colors[Math.floor(Math.random() * PARTICLE_CONFIG.colors.length)];
    this.opacity = 0.15 + Math.random() * 0.35;
    this.vx = (Math.random() - 0.5) * PARTICLE_CONFIG.speed;
    this.vy = (Math.random() - 0.5) * PARTICLE_CONFIG.speed;
    this.timeOffset = Math.random() * Math.PI * 2;
    this.pulse = 1;
  }

  update(time) {
    this.x += this.vx;
    this.y += this.vy;

    // Wrap around edges
    if (this.x < -20) this.x = this.w + 20;
    if (this.x > this.w + 20) this.x = -20;
    if (this.y < -20) this.y = this.h + 20;
    if (this.y > this.h + 20) this.y = -20;

    // Gentle pulse
    this.pulse = 1 + Math.sin(time * 0.008 + this.timeOffset) * 0.15;
  }

  draw(ctx) {
    ctx.fillStyle = this.colorPrefix + this.opacity.toFixed(2) + ')';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.pulse, 0, Math.PI * 2);
    ctx.fill();
  }
}

class LoginParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.particles = [];
    this.time = 0;
    this.active = true;
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    window.addEventListener('resize', () => {
      clearTimeout(this._rt);
      this._rt = setTimeout(() => this.resize(), 150);
    }, { passive: true });
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
    this.particles.forEach(p => { p.w = this.canvas.width; p.h = this.canvas.height; });
  }

  createParticles() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.particles = [];
    for (let i = 0; i < PARTICLE_CONFIG.count; i++) {
      this.particles.push(new LoginParticle(
        Math.random() * w,
        Math.random() * h,
        w, h
      ));
    }
  }

  drawEdges() {
    const pts = this.particles;
    const maxDist = PARTICLE_CONFIG.connectDist;
    const maxDist2 = maxDist * maxDist;
    const ctx = this.ctx;

    ctx.lineWidth = 1;

    for (let i = 0; i < pts.length; i++) {
      let edges = 0;
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDist2) {
          const alpha = (1 - Math.sqrt(d2) / maxDist) * 0.12;
          ctx.strokeStyle = PARTICLE_CONFIG.lineColor + alpha.toFixed(3) + ')';
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
          if (++edges > 4) break;
        }
      }
    }
  }

  animate() {
    if (!this.active) return;
    this.time++;
    const { width, height } = this.canvas;
    if (width === 0 || height === 0) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    this.ctx.clearRect(0, 0, width, height);
    this.particles.forEach(p => { p.update(this.time); p.draw(this.ctx); });
    this.drawEdges();
    requestAnimationFrame(() => this.animate());
  }
}

// Only start particles when right panel is visible (desktop)
let loginPS = null;
const mql = window.matchMedia('(min-width: 941px)');

function startParticles() {
  if (!loginPS) {
    loginPS = new LoginParticleSystem('login-canvas');
  }
}
function stopParticles() {
  if (loginPS) {
    loginPS.active = false;
    loginPS = null;
  }
}

if (mql.matches) startParticles();
mql.addEventListener('change', (e) => e.matches ? startParticles() : stopParticles());
