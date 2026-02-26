/* =============================================
   RANKUP — script.js
   ============================================= */

// ─────────────────────────────────────────────
// "BACKEND" STUB FUNCTIONS
// Replace these with real API calls (fetch/axios)
// ─────────────────────────────────────────────

async function fetchStudents() {
  // TODO: replace with: return fetch('/api/students').then(r => r.json())
  await delay(400);
  return [
    { id: 1,  name: "Alexandra Chen",   handle: "alex_coder",   school: "MIT",        schoolId: 1, xp: 48200, solved: 312 },
    { id: 2,  name: "Mateo Rivera",     handle: "m_rive",       school: "Stanford",   schoolId: 2, xp: 44900, solved: 289 },
    { id: 3,  name: "Yuki Tanaka",      handle: "yukidev",      school: "CMU",        schoolId: 3, xp: 41300, solved: 271 },
    { id: 4,  name: "Omar Hassan",      handle: "ohdev99",      school: "MIT",        schoolId: 1, xp: 39800, solved: 258 },
    { id: 5,  name: "Sofia Ivanova",    handle: "soficode",     school: "Stanford",   schoolId: 2, xp: 37500, solved: 247 },
    { id: 6,  name: "Liam O'Brien",     handle: "liam_ob",      school: "Harvard",    schoolId: 4, xp: 34100, solved: 231 },
    { id: 7,  name: "Priya Nair",       handle: "priya_n",      school: "CMU",        schoolId: 3, xp: 31700, solved: 220 },
    { id: 8,  name: "Felix Wagner",     handle: "felixw",       school: "ETH Zurich", schoolId: 5, xp: 29400, solved: 204 },
    { id: 9,  name: "Isabella Rossi",   handle: "isa_r",        school: "Harvard",    schoolId: 4, xp: 27200, solved: 191 },
    { id: 10, name: "Dmitri Volkov",    handle: "dmitri_v",     school: "ETH Zurich", schoolId: 5, xp: 25600, solved: 178 },
    { id: 11, name: "Amara Diallo",     handle: "a_diallo",     school: "Stanford",   schoolId: 2, xp: 23300, solved: 164 },
    { id: 12, name: "Nathan Kim",       handle: "nkim42",       school: "MIT",        schoolId: 1, xp: 21800, solved: 152 },
    { id: 13, name: "Elena Popescu",    handle: "elena_p",      school: "CMU",        schoolId: 3, xp: 20100, solved: 143 },
    { id: 14, name: "Carlos Mendez",    handle: "cmen_dev",     school: "Harvard",    schoolId: 4, xp: 18400, solved: 131 },
    { id: 15, name: "Aisha Al-Farsi",   handle: "aafarsi",      school: "ETH Zurich", schoolId: 5, xp: 16900, solved: 119 },
    { id: 16, name: "Lucas Petit",      handle: "luca_p",       school: "Stanford",   schoolId: 2, xp: 15200, solved: 108 },
    { id: 17, name: "Mei Lin",          handle: "meilin99",     school: "MIT",        schoolId: 1, xp: 13800, solved: 97  },
    { id: 18, name: "Ahmed Saleh",      handle: "ahmed_s",      school: "CMU",        schoolId: 3, xp: 12100, solved: 86  },
    { id: 19, name: "Nina Kovač",       handle: "ninak",        school: "ETH Zurich", schoolId: 5, xp: 10600, solved: 75  },
    { id: 20, name: "Ben Okafor",       handle: "benokafor",    school: "Harvard",    schoolId: 4, xp:  9200, solved: 64  },
    { id: 21, name: "Sara Johansson",   handle: "sarajoh",      school: "Stanford",   schoolId: 2, xp:  8100, solved: 57  },
    { id: 22, name: "Tom Wierzbicki",   handle: "tomwi",        school: "MIT",        schoolId: 1, xp:  7000, solved: 49  },
    { id: 23, name: "Fatou Balde",      handle: "fatou_b",      school: "CMU",        schoolId: 3, xp:  5900, solved: 41  },
    { id: 24, name: "Jorge Navarro",    handle: "jorgenav",     school: "Harvard",    schoolId: 4, xp:  4800, solved: 33  },
    { id: 25, name: "Rina Suzuki",      handle: "rina_sz",      school: "ETH Zurich", schoolId: 5, xp:  3700, solved: 26  },
  ];
}

async function fetchSchools() {
  // TODO: replace with: return fetch('/api/schools').then(r => r.json())
  await delay(400);
  return [
    { id: 1, name: "MIT",        location: "Cambridge, USA",      icon: "🏛️", members: 5, totalXP: 109800, totalSolved: 722 },
    { id: 2, name: "Stanford",   location: "Stanford, USA",       icon: "🌲", members: 5, totalXP: 105700, totalSolved: 700 },
    { id: 3, name: "CMU",        location: "Pittsburgh, USA",     icon: "⚙️", members: 5, totalXP: 93100,  totalSolved: 634 },
    { id: 4, name: "Harvard",    location: "Cambridge, USA",      icon: "📚", members: 5, totalXP: 79700,  totalSolved: 553 },
    { id: 5, name: "ETH Zurich", location: "Zürich, Switzerland", icon: "🔬", members: 5, totalXP: 67900,  totalSolved: 501 },
  ];
}

async function fetchUserActivity(userId) {
  // TODO: replace with: return fetch(`/api/users/${userId}/activity`).then(r => r.json())
  await delay(300);
  const data = {};
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  for (let d = new Date(start); d <= now; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split('T')[0];
    const rand = Math.random();
    if (rand > 0.4) data[key] = Math.floor(rand * 9) + 1;
  }
  return data;
}

// ─────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }

function fmtXP(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return n.toString();
}

const PALETTE = [
  { color: '#3D52FA', bg: 'rgba(61,82,250,0.08)',   border: 'rgba(61,82,250,0.25)'  },
  { color: '#e03fa8', bg: 'rgba(224,63,168,0.08)',  border: 'rgba(224,63,168,0.25)' },
  { color: '#f5a623', bg: 'rgba(245,166,35,0.09)',  border: 'rgba(245,166,35,0.3)'  },
  { color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.25)' },
  { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)'  },
];
function getPalette(id) { return PALETTE[(id - 1) % PALETTE.length]; }
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

// ─────────────────────────────────────────────
// AUTH STATE
// ─────────────────────────────────────────────

let currentUser = null;

function setUser(user) {
  currentUser = user;
  document.getElementById('userPill').style.display = user ? 'flex' : 'none';
  document.getElementById('loginBtn').style.display  = user ? 'none' : 'flex';
  if (user) document.getElementById('userNameDisplay').textContent = user.handle;

  if (user) {
    loadHeatmap(user.id);
  } else {
    document.getElementById('heatmapSection').classList.remove('visible');
  }

  if (studentsData.length) renderPage(currentPage);
}

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ─────────────────────────────────────────────
// STUDENTS BOARD WITH PAGINATION
// ─────────────────────────────────────────────

let studentsData = [];
let currentPage  = 1;
const PAGE_SIZE  = 10;

async function loadStudents() {
  const students = await fetchStudents();
  students.sort((a, b) => b.xp - a.xp);
  studentsData = students;
  document.getElementById('studentCount').textContent = students.length + ' students';
  renderPage(1);
}

function renderPage(page) {
  currentPage = page;
  const total  = studentsData.length;
  const pages  = Math.ceil(total / PAGE_SIZE);
  const start  = (page - 1) * PAGE_SIZE;
  const slice  = studentsData.slice(start, start + PAGE_SIZE);
  const maxXP  = studentsData[0].xp;

  const container = document.getElementById('studentBoard');
  container.innerHTML = '';

  slice.forEach((s, i) => {
    const rank = start + i + 1;
    const p = getPalette(s.schoolId);
    const isMe = currentUser && currentUser.id === s.id;

    const row = document.createElement('div');
    row.className = 'board-row';
    row.style.animationDelay = `${i * 30}ms`;

    let rankHtml;
    if (rank === 1) rankHtml = `<span class="rank-badge gold">1</span>`;
    else if (rank === 2) rankHtml = `<span class="rank-badge silver">2</span>`;
    else if (rank === 3) rankHtml = `<span class="rank-badge bronze">3</span>`;
    else rankHtml = `<span class="rank-badge regular">${rank}</span>`;

    const xpPct = ((s.xp / maxXP) * 100).toFixed(1);

    row.innerHTML = `
      <div class="col-rank">${rankHtml}</div>
      <div class="col-name">
        <div class="student-info">
          <div class="student-avatar" style="color:${p.color};background:${p.bg};border-color:${p.border}">
            ${initials(s.name)}
          </div>
          <div class="student-name-wrap">
            <div class="student-name${isMe ? ' is-me' : ''}">${s.name}${isMe ? ' <span style="font-size:0.65rem;color:var(--accent);font-weight:700;margin-left:4px">[you]</span>' : ''}</div>
            <div class="student-handle">@${s.handle}</div>
          </div>
        </div>
      </div>
      <div class="col-school">
        <span class="school-chip" style="color:${p.color};border-color:${p.border};background:${p.bg}">${s.school}</span>
      </div>
      <div class="col-solved">${s.solved}</div>
      <div class="col-xp">
        <div class="xp-wrap">
          <span class="xp-val" style="color:${p.color}">${fmtXP(s.xp)}</span>
          <div class="xp-bar-bg">
            <div class="xp-bar-fill" style="width:0%;background:${p.color}" data-target="${xpPct}"></div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  setTimeout(() => {
    document.querySelectorAll('.xp-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 50);

  renderPagination(page, pages);
}

function renderPagination(page, pages) {
  const el = document.getElementById('studentPagination');
  el.innerHTML = '';

  if (pages <= 1) { el.style.display = 'none'; return; }
  el.style.display = 'flex';

  // Prev arrow
  const prev = document.createElement('button');
  prev.className = 'pg-arrow';
  prev.textContent = '← Prev';
  prev.disabled = page === 1;
  prev.addEventListener('click', () => renderPage(page - 1));
  el.appendChild(prev);

  // Page number buttons (show at most 5 around current)
  const rangeStart = Math.max(1, page - 2);
  const rangeEnd   = Math.min(pages, page + 2);

  if (rangeStart > 1) {
    el.appendChild(makePgBtn(1, page));
    if (rangeStart > 2) el.appendChild(makePgEllipsis());
  }
  for (let p = rangeStart; p <= rangeEnd; p++) {
    el.appendChild(makePgBtn(p, page));
  }
  if (rangeEnd < pages) {
    if (rangeEnd < pages - 1) el.appendChild(makePgEllipsis());
    el.appendChild(makePgBtn(pages, page));
  }

  // Info
  const info = document.createElement('span');
  info.className = 'pg-info';
  const s = (page - 1) * PAGE_SIZE + 1;
  const e = Math.min(page * PAGE_SIZE, studentsData.length);
  info.textContent = `${s}–${e} of ${studentsData.length}`;
  el.appendChild(info);

  // Next arrow
  const next = document.createElement('button');
  next.className = 'pg-arrow';
  next.textContent = 'Next →';
  next.disabled = page === pages;
  next.addEventListener('click', () => renderPage(page + 1));
  el.appendChild(next);
}

function makePgBtn(p, current) {
  const btn = document.createElement('button');
  btn.className = 'pg-btn' + (p === current ? ' active' : '');
  btn.textContent = p;
  btn.addEventListener('click', () => renderPage(p));
  return btn;
}

function makePgEllipsis() {
  const span = document.createElement('span');
  span.className = 'pg-info';
  span.textContent = '…';
  return span;
}

// ─────────────────────────────────────────────
// SCHOOLS BOARD
// ─────────────────────────────────────────────

async function loadSchools() {
  const schools = await fetchSchools();

  // Compute real members and totalSolved from actual student data
  const bySchool = {};
  studentsData.forEach(s => {
    if (!bySchool[s.schoolId]) bySchool[s.schoolId] = { members: 0, totalSolved: 0 };
    bySchool[s.schoolId].members++;
    bySchool[s.schoolId].totalSolved += s.solved;
  });
  schools.forEach(s => {
    if (bySchool[s.id]) {
      s.members     = bySchool[s.id].members;
      s.totalSolved = bySchool[s.id].totalSolved;
    }
  });

  schools.sort((a, b) => b.totalXP - a.totalXP);
  document.getElementById('schoolCount').textContent = schools.length + ' schools';
  renderSchools(schools);
}

function renderSchools(schools) {
  const maxXP = schools[0].totalXP;
  const container = document.getElementById('schoolBoard');
  container.innerHTML = '';

  schools.forEach((s, i) => {
    const rank = i + 1;
    const p = getPalette(s.id);
    const row = document.createElement('div');
    row.className = 'board-row';
    row.style.animationDelay = `${i * 40}ms`;

    let rankHtml;
    if (rank === 1) rankHtml = `<span class="rank-badge gold">1</span>`;
    else if (rank === 2) rankHtml = `<span class="rank-badge silver">2</span>`;
    else if (rank === 3) rankHtml = `<span class="rank-badge bronze">3</span>`;
    else rankHtml = `<span class="rank-badge regular">${rank}</span>`;

    const xpPct = ((s.totalXP / maxXP) * 100).toFixed(1);

    row.innerHTML = `
      <div class="col-rank">${rankHtml}</div>
      <div class="col-name">
        <div class="school-info">
          <div class="school-icon" style="color:${p.color};background:${p.bg};border-color:${p.border}">${s.icon}</div>
          <div>
            <div class="school-name">${s.name}</div>
            <div class="school-location">${s.location}</div>
          </div>
        </div>
      </div>
      <div class="members-col">${s.members}</div>
      <div class="col-solved">${s.totalSolved.toLocaleString()}</div>
      <div class="col-xp">
        <div class="xp-wrap">
          <span class="xp-val" style="color:${p.color}">${fmtXP(s.totalXP)}</span>
          <div class="xp-bar-bg">
            <div class="xp-bar-fill" style="width:0%;background:${p.color}" data-target="${xpPct}"></div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(row);
  });

  setTimeout(() => {
    document.querySelectorAll('#schoolBoard .xp-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 50);
}

// ─────────────────────────────────────────────
// HEATMAP
// ─────────────────────────────────────────────

const tooltip = document.getElementById('hmTooltip');

function showTooltip(el, text) {
  tooltip.textContent = text;
  tooltip.classList.add('visible');
  positionTooltip(el);
}
function hideTooltip() {
  tooltip.classList.remove('visible');
}
function positionTooltip(el) {
  const r = el.getBoundingClientRect();
  tooltip.style.left = (r.left + r.width / 2) + 'px';
  tooltip.style.top  = (r.top - 10) + 'px';
}

async function loadHeatmap(userId) {
  const activityData = await fetchUserActivity(userId);
  renderHeatmap(activityData);
}

function renderHeatmap(activityData) {
  const section = document.getElementById('heatmapSection');
  section.classList.add('visible');

  const year      = new Date().getFullYear();
  document.getElementById('heatmapYear').textContent = year;

  const startDate = new Date(year, 0, 1);
  const endDate   = new Date();
  const startDay  = startDate.getDay(); // 0 = Sunday
  const totalDays = Math.ceil((endDate - startDate) / 864e5) + 1;
  const totalWeeks = Math.ceil((totalDays + startDay) / 7);

  const CELL   = 16; // px — matches --cell CSS var
  const GAP    = 3;
  const DAYCOL = 36;
  const colTemplate = `${DAYCOL}px repeat(${totalWeeks}, ${CELL}px)`;

  // ── Month labels ──
  const monthGrid = document.getElementById('heatmapMonths');
  monthGrid.style.gridTemplateColumns = colTemplate;
  monthGrid.innerHTML = '';
  monthGrid.appendChild(document.createElement('div')); // spacer

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let lastMonth = -1;
  for (let w = 0; w < totalWeeks; w++) {
    const d = new Date(year, 0, 1 + w * 7 - startDay);
    const mo = d.getMonth();
    const el = document.createElement('div');
    el.className = 'hm-month-label';
    if (mo !== lastMonth && d.getFullYear() === year) { el.textContent = MONTHS[mo]; lastMonth = mo; }
    monthGrid.appendChild(el);
  }

  // ── Main grid ──
  const grid = document.getElementById('heatmapGrid');
  grid.style.gridTemplateColumns = colTemplate;
  grid.style.gridTemplateRows   = `repeat(7, ${CELL}px)`;
  grid.innerHTML = '';

  // Day labels
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  for (let d = 0; d < 7; d++) {
    const label = document.createElement('div');
    label.className = 'hm-day-label';
    label.textContent = (d % 2 === 1) ? DAYS[d] : '';
    grid.appendChild(label);
  }

  const values = Object.values(activityData);
  const maxVal = values.length ? Math.max(...values) : 1;

  for (let w = 0; w < totalWeeks; w++) {
    for (let d = 0; d < 7; d++) {
      const dayOffset = w * 7 + d - startDay;
      const cellDate  = new Date(year, 0, 1 + dayOffset);
      const cell      = document.createElement('div');
      cell.className  = 'hm-cell';

      if (dayOffset < 0 || cellDate.getFullYear() !== year || cellDate > endDate) {
        cell.dataset.level = '0';
        cell.style.opacity = '0';
        cell.style.pointerEvents = 'none';
        grid.appendChild(cell);
        continue;
      }

      const key   = cellDate.toISOString().split('T')[0];
      const count = activityData[key] || 0;
      const level = count === 0 ? 0
                  : count <= maxVal * 0.25 ? 1
                  : count <= maxVal * 0.5  ? 2
                  : count <= maxVal * 0.75 ? 3 : 4;

      cell.dataset.level = level;
      const tipText = count ? `${count} solved · ${key}` : `No activity · ${key}`;

      cell.addEventListener('mouseenter', () => showTooltip(cell, tipText));
      cell.addEventListener('mousemove',  () => positionTooltip(cell));
      cell.addEventListener('mouseleave', hideTooltip);

      grid.appendChild(cell);
    }
  }

  // ── Legend cells (no tooltip) ──
  const legendEl = document.getElementById('legendCells');
  legendEl.innerHTML = '';
  for (let lv = 0; lv <= 4; lv++) {
    const c = document.createElement('div');
    c.className = 'hm-cell no-tooltip';
    c.dataset.level = lv;
    legendEl.appendChild(c);
  }
}

// ─────────────────────────────────────────────
// LOGIN MODAL
// ─────────────────────────────────────────────

const loginModal  = document.getElementById('loginModal');
const loginBtn    = document.getElementById('loginBtn');
const logoutBtn   = document.getElementById('logoutBtn');
const modalClose  = document.getElementById('modalClose');
const demoUsersEl = document.getElementById('demoUsers');

function openModal()  { loginModal.classList.add('open'); }
function closeModal() { loginModal.classList.remove('open'); }

loginBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeModal(); });

logoutBtn.addEventListener('click', () => {
  setUser(null);
  document.getElementById('heatmapSection').classList.remove('visible');
});

function buildDemoUsers(students) {
  demoUsersEl.innerHTML = '';
  students.slice(0, 5).forEach(s => {
    const p = getPalette(s.schoolId);
    const btn = document.createElement('button');
    btn.className = 'demo-user-btn';
    btn.innerHTML = `
      <div style="color:${p.color};background:${p.bg};border:1.5px solid ${p.border};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;flex-shrink:0">
        ${initials(s.name)}
      </div>
      <div>
        <div class="dub-name">${s.name}</div>
        <div class="dub-school">@${s.handle} · ${s.school}</div>
      </div>
    `;
    btn.addEventListener('click', () => { setUser(s); closeModal(); });
    demoUsersEl.appendChild(btn);
  });
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

(async () => {
  document.getElementById('userPill').style.display = 'none';
  document.getElementById('loginBtn').style.display  = 'flex';

  // Load students first so studentsData is populated before schools computes aggregates
  await loadStudents();
  await loadSchools();
  buildDemoUsers(studentsData);
})(); 