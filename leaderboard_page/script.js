/* =============================================
   Leagues of Code — script.js
   ============================================= */

// ═════════════════════════════════════════════
// COURSE CONFIGURATION
// Edit this array to add/remove/change courses.
// The API only returns solved counts per courseId;
// all other metadata lives here.
// ═════════════════════════════════════════════

const COURSES = [
  { id: 'python1',  name: 'Python 1',     total: 40, color: '#3b82f6' },
  { id: 'python2',     name: 'Python 2',  total: 40, color: '#10b981' },
  { id: 'math101',    name: 'Math 101',        total: 40, color: '#f59e0b' },
];

// Total problems across all courses (computed once)
const TOTAL_PROBLEMS = COURSES.reduce((sum, c) => sum + c.total, 0);

// ═════════════════════════════════════════════
// IOI MEDAL THRESHOLDS
// Gold:   top 1/12  of participants
// Silver: next 1/6  (i.e. top 1/12 + 1/6 = top 1/4)
// Bronze: next 1/3  (i.e. top 1/4  + 1/3 = top 7/12)
// ═════════════════════════════════════════════

function getMedalTier(rank, total) {
  if (rank <= Math.ceil(total / 12))                                     return 'gold';
  if (rank <= Math.ceil(total / 12) + Math.ceil(total / 6))             return 'silver';
  if (rank <= Math.ceil(total / 12) + Math.ceil(total / 6) + Math.ceil(total / 3)) return 'bronze';
  return null;
}

// ═════════════════════════════════════════════
// API LAYER
// Replace each function body with a real fetch() call.
// ═════════════════════════════════════════════

/**
 * Fetch leaderboard.
 * Returns: { id, name, handle, group, progress: { [courseId]: solvedCount } }[]
 *
 * TODO: return fetch('/api/leaderboard').then(r => r.json())
 */
async function fetchLeaderboard() {
  await delay(400);
  return [
    { id:  1, name: 'Margarita Zaman',    handle: 'mzaman',    group: 'Ukraine',        progress: { python1: 40, python2: 35, math101: 28 } },
    { id:  2, name: 'Artem Kovalenko',    handle: 'artem_k',   group: 'Ukraine',        progress: { python1: 40, python2: 38, math101: 20 } },
    { id:  3, name: 'Carlos Méndez',      handle: 'cmen',      group: 'Spain',          progress: { python1: 40, python2: 30, math101: 25 } },
    { id:  4, name: 'Sofia Ivanova',      handle: 'soficode',  group: 'Ukraine',        progress: { python1: 40, python2: 32, math101: 18 } },
    { id:  5, name: 'Lucía Fernández',    handle: 'luciaf',    group: 'Spain',          progress: { python1: 38, python2: 28, math101: 20 } },
    { id:  6, name: 'James Okafor',       handle: 'jokafor',   group: 'Harbour',        progress: { python1: 40, python2: 25, math101: 18 } },
    { id:  7, name: 'Olena Petrenko',     handle: 'olenap',    group: 'Ukraine',        progress: { python1: 36, python2: 26, math101: 16 } },
    { id:  8, name: 'Andrés Torres',      handle: 'andres_t',  group: 'Spain',          progress: { python1: 35, python2: 22, math101: 18 } },
    { id:  9, name: 'Amara Diallo',       handle: 'a_diallo',  group: 'Harbour',        progress: { python1: 32, python2: 24, math101: 14 } },
    { id: 10, name: 'Dmytro Shevchenko',  handle: 'dmytro_s',  group: 'Ukraine',        progress: { python1: 30, python2: 22, math101: 12 } },
    { id: 11, name: 'Emma Wilson',        handle: 'emmaw',     group: 'League of Code', progress: { python1: 28, python2: 20, math101: 10 } },
    { id: 12, name: 'Mikhail Bondarenko', handle: 'mbond',     group: 'Ukraine',        progress: { python1: 25, python2: 18, math101: 10 } },
    { id: 13, name: 'Laura García',       handle: 'laura_g',   group: 'Spain',          progress: { python1: 22, python2: 16, math101:  8 } },
    { id: 14, name: 'Noah Bennett',       handle: 'noahb',     group: 'Harbour',        progress: { python1: 20, python2: 14, math101:  6 } },
    { id: 15, name: 'Yuki Tanaka',        handle: 'yukidev',   group: 'League of Code', progress: { python1: 18, python2: 10, math101:  4 } },
    { id: 16, name: 'Pablo Ruiz',         handle: 'pablo_r',   group: 'Spain',          progress: { python1: 14, python2:  8, math101:  4 } },
    { id: 17, name: 'Grace Obi',          handle: 'grace_o',   group: 'Harbour',        progress: { python1: 10, python2:  6, math101:  2 } },
    { id: 18, name: 'Iryna Kravchuk',     handle: 'iryna_k',   group: 'Ukraine',        progress: { python1:  8, python2:  4, math101:  2 } },
    { id: 19, name: 'Tom Wierzbicki',     handle: 'tomwi',     group: 'League of Code', progress: { python1:  6, python2:  2, math101:  0 } },
    { id: 20, name: 'Rina Suzuki',        handle: 'rina_sz',   group: 'League of Code', progress: { python1:  4, python2:  0, math101:  0 } },
  ];
}

async function fetchUserActivity(userId) {
  // TODO: return fetch(`/api/users/${userId}/activity`).then(r => r.json())
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

// ═════════════════════════════════════════════
// DATA HELPERS
// ═════════════════════════════════════════════

/**
 * Enrich a raw API student with computed fields:
 *   .courses   — array of { ...courseConfig, solved }
 *   .totalSolved
 */
function enrichStudent(raw) {
  const courses = COURSES.map(c => ({
    ...c,
    solved: raw.progress[c.id] ?? 0,
  }));
  const totalSolved = courses.reduce((s, c) => s + c.solved, 0);
  return { ...raw, courses, totalSolved };
}

// ═════════════════════════════════════════════
// UTILITIES
// ═════════════════════════════════════════════

function delay(ms) { return new Promise(res => setTimeout(res, ms)); }
function fmtXP(n)  { return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n); }
function initials(name) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(); }

const AVATAR_PALETTE = [
  { color: '#3D52FA', bg: 'rgba(61,82,250,0.08)',   border: 'rgba(61,82,250,0.25)'  },
  { color: '#e03fa8', bg: 'rgba(224,63,168,0.08)',  border: 'rgba(224,63,168,0.25)' },
  { color: '#f5a623', bg: 'rgba(245,166,35,0.09)',  border: 'rgba(245,166,35,0.3)'  },
  { color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.25)' },
  { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.25)'  },
];
function getPalette(id) { return AVATAR_PALETTE[(id - 1) % AVATAR_PALETTE.length]; }

const GROUP_COLORS = {
  'Ukraine':        { color: '#3D52FA', bg: 'rgba(61,82,250,0.08)',   border: 'rgba(61,82,250,0.22)'   },
  'Spain':          { color: '#e03fa8', bg: 'rgba(224,63,168,0.08)',  border: 'rgba(224,63,168,0.22)'  },
  'Harbour':        { color: '#0ea5e9', bg: 'rgba(14,165,233,0.08)',  border: 'rgba(14,165,233,0.22)'  },
  'League of Code': { color: '#22c55e', bg: 'rgba(34,197,94,0.08)',   border: 'rgba(34,197,94,0.22)'   },
};
function groupColor(name) {
  return GROUP_COLORS[name] || { color: '#aaa', bg: 'rgba(180,180,180,0.08)', border: 'rgba(180,180,180,0.22)' };
}

// ═════════════════════════════════════════════
// AUTH STATE
// ═════════════════════════════════════════════

let currentUser = null;

function setUser(user) {
  currentUser = user;
  document.getElementById('userPill').style.display = user ? 'flex' : 'none';
  document.getElementById('loginBtn').style.display  = user ? 'none' : 'flex';
  if (user) document.getElementById('userNameDisplay').textContent = user.handle;

  if (user) loadHeatmap(user.id);
  else document.getElementById('heatmapSection').classList.remove('visible');

  if (studentsData.length) renderPage(currentPage);
}

// ═════════════════════════════════════════════
// STUDENTS BOARD
// ═════════════════════════════════════════════

let studentsData = [];   // enriched, sorted full list
let filteredData = [];   // after group filter
let currentPage  = 1;
const PAGE_SIZE  = 30;
let activeGroup  = 'all';

async function loadStudents() {
  const raw = await fetchLeaderboard();
  studentsData = raw.map(enrichStudent).sort((a, b) => b.totalSolved - a.totalSolved);
  populateGroupFilter(studentsData);
  applyGroupFilter();
}

function populateGroupFilter(students) {
  const groups = [...new Set(students.map(s => s.group))].sort();
  const select = document.getElementById('groupFilter');
  groups.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g; opt.textContent = g;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => {
    activeGroup = select.value;
    applyGroupFilter();
  });
}

function applyGroupFilter() {
  filteredData = activeGroup === 'all'
    ? [...studentsData]
    : studentsData.filter(s => s.group === activeGroup);
  document.getElementById('studentCount').textContent = filteredData.length + ' students';
  renderPage(1);
}

// ─────────────────────────────────────────────
// RENDER PAGE  (with user-always-visible logic)
// ─────────────────────────────────────────────

const progTooltip = document.getElementById('progTooltip');

function renderPage(page) {
  currentPage = page;
  const total     = filteredData.length;
  const pages     = Math.ceil(total / PAGE_SIZE);
  const start     = (page - 1) * PAGE_SIZE;
  const pageSlice = filteredData.slice(start, start + PAGE_SIZE);

  // User position in filteredData
  const myIndex = currentUser ? filteredData.findIndex(s => s.id === currentUser.id) : -1;
  const myRank  = myIndex + 1; // 1-based; 0 = not found

  // Determine extra context rows to pin above/below the normal page
  let extraTop    = null;
  let extraBottom = null;

  if (myIndex !== -1) {
    const pageSet  = new Set(pageSlice.map((_, i) => start + i));
    const pageEnd  = start + pageSlice.length - 1;

    if (myIndex < start) {
      // User ranks BETTER than this page → pin at top
      extraTop = [];
      if (myIndex > 0) extraTop.push({ idx: myIndex - 1, isMe: false, dim: true });
      extraTop.push({ idx: myIndex, isMe: true, dim: false });
      if (myIndex + 1 < total && !pageSet.has(myIndex + 1))
        extraTop.push({ idx: myIndex + 1, isMe: false, dim: true });
    } else if (myIndex > pageEnd) {
      // User ranks WORSE than this page → pin at bottom
      extraBottom = [];
      if (myIndex > 0 && !pageSet.has(myIndex - 1))
        extraBottom.push({ idx: myIndex - 1, isMe: false, dim: true });
      extraBottom.push({ idx: myIndex, isMe: true, dim: false });
      if (myIndex + 1 < total)
        extraBottom.push({ idx: myIndex + 1, isMe: false, dim: true });
    } else {
      // User IS on this page — inject out-of-page neighbours
      if (myIndex > 0 && myIndex - 1 < start)
        extraTop = [{ idx: myIndex - 1, isMe: false, dim: true }];
      if (myIndex + 1 < total && myIndex + 1 > pageEnd)
        extraBottom = [{ idx: myIndex + 1, isMe: false, dim: true }];
    }
  }

  const container = document.getElementById('studentBoard');
  container.innerHTML = '';

  // ── Row builder ──
  const appendRow = (student, rank, isMe, dim, animDelay) => {
    const p    = getPalette(student.id);
    const gp   = groupColor(student.group);
    const tier = getMedalTier(rank, total); // null | 'gold' | 'silver' | 'bronze'
    let rankMedal = '';
    if(tier == 'gold')
      rankMedal = ' 🥇';
    else if(tier == 'silver')
      rankMedal = ' 🥈';
    else if(tier == 'bronze')
      rankMedal = ' 🥉';

    const row = document.createElement('div');
    let cls = 'board-row';
    if (isMe)   cls += ' row-me';
    if (dim)    cls += ' row-dim';
    if (tier)   cls += ` row-${tier}`;
    row.className = cls;
    row.style.animationDelay = `${animDelay}ms`;

    const rankHtml = `<span class="rank-num${tier ? ` tier-${tier}` : ''}">${rank}${rankMedal}</span>`;

    const progressPct = TOTAL_PROBLEMS > 0
      ? Math.round(student.totalSolved / TOTAL_PROBLEMS * 100)
      : 0;

    const segments = student.courses.map(c => {
      const w = TOTAL_PROBLEMS > 0 ? (c.solved / TOTAL_PROBLEMS * 100).toFixed(2) : 0;
      return `<div class="prog-seg" style="width:${w}%;background:${c.color};"
        data-name="${c.name}" data-solved="${c.solved}" data-total="${c.total}"></div>`;
    }).join('');

    const legend = student.courses.map(c =>
      `<span class="prog-legend-dot" style="background:${c.color}"></span>
       <span class="prog-legend-label">${c.name}</span>`
    ).join('');

    row.innerHTML = `
      <div class="col-rank">${rankHtml}</div>
      <div class="col-name">
        <div class="student-info">
          <div class="student-avatar" style="color:${p.color};background:${p.bg};border-color:${p.border}">${initials(student.name)}</div>
          <div>
            <div class="student-name${isMe ? ' is-me' : ''}">${student.name}${isMe ? ' <span class="you-tag">[you]</span>' : ''}</div>
          </div>
        </div>
      </div>
      <div class="col-group">
        <span class="group-chip" style="color:${gp.color};border-color:${gp.border};background:${gp.bg}">${student.group}</span>
      </div>
      <div class="col-progress">
        <div class="prog-wrap">
          <div class="prog-bar-bg"><div class="prog-bar-inner">${segments}</div></div>
        </div>
        <div class="prog-legend">${legend}</div>
      </div>
      <div class="col-total">${student.totalSolved}</div>
    `;
    container.appendChild(row);
  };

  const makeDivider = () => {
    const d = document.createElement('div');
    d.className = 'context-divider';
    container.appendChild(d);
  };

  // Render extra-top context block
  if (extraTop) {
    extraTop.forEach((e, i) => appendRow(filteredData[e.idx], e.idx + 1, e.isMe, e.dim, i * 20));
    makeDivider();
  }

  // Render normal page rows
  pageSlice.forEach((s, i) => {
    const rank = start + i + 1;
    const isMe = currentUser && currentUser.id === s.id;
    appendRow(s, rank, isMe, false, i * 30);
  });

  // Render extra-bottom context block
  if (extraBottom) {
    makeDivider();
    extraBottom.forEach((e, i) => appendRow(filteredData[e.idx], e.idx + 1, e.isMe, e.dim, i * 20));
  }

  // Progress segment tooltips
  container.querySelectorAll('.prog-seg').forEach(seg => {
    seg.addEventListener('mouseenter', (e) => {
      progTooltip.innerHTML = `<strong>${seg.dataset.name}</strong><br>${seg.dataset.solved} / ${seg.dataset.total} solved`;
      progTooltip.classList.add('visible');
      positionProgTooltip(e);
    });
    seg.addEventListener('mousemove', positionProgTooltip);
    seg.addEventListener('mouseleave', () => progTooltip.classList.remove('visible'));
  });

  // Animate bars in
  setTimeout(() => {
    container.querySelectorAll('.prog-bar-inner').forEach(el => { el.style.opacity = '1'; });
  }, 50);

  renderPagination(page, pages);
}

function positionProgTooltip(e) {
  progTooltip.style.left = e.clientX + 'px';
  progTooltip.style.top  = (e.clientY - 10) + 'px';
}

function renderPagination(page, pages) {
  const el = document.getElementById('studentPagination');
  el.innerHTML = '';
  if (pages <= 1) { el.style.display = 'none'; return; }
  el.style.display = 'flex';

  const prev = document.createElement('button');
  prev.className = 'pg-arrow'; prev.textContent = '← Prev'; prev.disabled = page === 1;
  prev.addEventListener('click', () => renderPage(page - 1));
  el.appendChild(prev);

  const rs = Math.max(1, page - 2), re = Math.min(pages, page + 2);
  if (rs > 1) { el.appendChild(makePgBtn(1, page)); if (rs > 2) el.appendChild(makePgEllipsis()); }
  for (let p = rs; p <= re; p++) el.appendChild(makePgBtn(p, page));
  if (re < pages) { if (re < pages - 1) el.appendChild(makePgEllipsis()); el.appendChild(makePgBtn(pages, page)); }

  const info = document.createElement('span');
  info.className = 'pg-info';
  info.textContent = `${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE, filteredData.length)} of ${filteredData.length}`;
  el.appendChild(info);

  const next = document.createElement('button');
  next.className = 'pg-arrow'; next.textContent = 'Next →'; next.disabled = page === pages;
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
  const s = document.createElement('span'); s.className = 'pg-info'; s.textContent = '…'; return s;
}

// ═════════════════════════════════════════════
// HEATMAP
// ═════════════════════════════════════════════

const hmTooltip = document.getElementById('hmTooltip');

function showHmTooltip(el, text) {
  hmTooltip.textContent = text;
  hmTooltip.classList.add('visible');
  positionHmTooltip(el);
}
function hideHmTooltip() { hmTooltip.classList.remove('visible'); }
function positionHmTooltip(el) {
  const r = el.getBoundingClientRect();
  hmTooltip.style.left = (r.left + r.width / 2) + 'px';
  hmTooltip.style.top  = (r.top - 10) + 'px';
}

async function loadHeatmap(userId) {
  renderHeatmap(await fetchUserActivity(userId));
}

function renderHeatmap(activityData) {
  const section = document.getElementById('heatmapSection');
  section.classList.add('visible');

  const year       = new Date().getFullYear();
  document.getElementById('heatmapYear').textContent = year;

  const startDate  = new Date(year, 0, 1);
  const endDate    = new Date();
  const startDay   = startDate.getDay();
  const totalDays  = Math.ceil((endDate - startDate) / 864e5) + 1;
  const totalWeeks = Math.ceil((totalDays + startDay) / 7);

  const CELL = 16, DAYCOL = 36;
  const colTemplate = `${DAYCOL}px repeat(${totalWeeks}, ${CELL}px)`;

  const monthGrid = document.getElementById('heatmapMonths');
  monthGrid.style.gridTemplateColumns = colTemplate;
  monthGrid.innerHTML = '';
  monthGrid.appendChild(document.createElement('div'));

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  let lastMonth = -1;
  for (let w = 0; w < totalWeeks; w++) {
    const d  = new Date(year, 0, 1 + w * 7 - startDay);
    const mo = d.getMonth();
    const el = document.createElement('div');
    el.className = 'hm-month-label';
    if (mo !== lastMonth && d.getFullYear() === year) { el.textContent = MONTHS[mo]; lastMonth = mo; }
    monthGrid.appendChild(el);
  }

  const grid = document.getElementById('heatmapGrid');
  grid.style.gridTemplateColumns = colTemplate;
  grid.style.gridTemplateRows   = `repeat(7, ${CELL}px)`;
  grid.innerHTML = '';

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
        cell.dataset.level = '0'; cell.style.opacity = '0'; cell.style.pointerEvents = 'none';
        grid.appendChild(cell); continue;
      }

      const key   = cellDate.toISOString().split('T')[0];
      const count = activityData[key] || 0;
      const level = count === 0 ? 0
                  : count <= maxVal * 0.25 ? 1
                  : count <= maxVal * 0.5  ? 2
                  : count <= maxVal * 0.75 ? 3 : 4;

      cell.dataset.level = level;
      const tipText = count ? `${count} solved · ${key}` : `No activity · ${key}`;
      cell.addEventListener('mouseenter', () => showHmTooltip(cell, tipText));
      cell.addEventListener('mousemove',  () => positionHmTooltip(cell));
      cell.addEventListener('mouseleave', hideHmTooltip);
      grid.appendChild(cell);
    }
  }

  const legendEl = document.getElementById('legendCells');
  legendEl.innerHTML = '';
  for (let lv = 0; lv <= 4; lv++) {
    const c = document.createElement('div');
    c.className = 'hm-cell no-tooltip'; c.dataset.level = lv;
    legendEl.appendChild(c);
  }
}

// ═════════════════════════════════════════════
// LOGIN MODAL
// ═════════════════════════════════════════════

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
logoutBtn.addEventListener('click', () => setUser(null));

function buildDemoUsers(students) {
  demoUsersEl.innerHTML = '';
  students.slice(0, 5).forEach(s => {
    const p = getPalette(s.id);
    const btn = document.createElement('button');
    btn.className = 'demo-user-btn';
    btn.innerHTML = `
      <div style="color:${p.color};background:${p.bg};border:1.5px solid ${p.border};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:0.75rem;flex-shrink:0">
        ${initials(s.name)}
      </div>
      <div>
        <div class="dub-name">${s.name}</div>
        <div class="dub-school">@${s.handle} · ${s.group}</div>
      </div>`;
    btn.addEventListener('click', () => { setUser(s); closeModal(); });
    demoUsersEl.appendChild(btn);
  });
}

// ═════════════════════════════════════════════
// ONLINE USERS
// ═════════════════════════════════════════════

const ONLINE_SEEDS = [
  { id: 1,  joinedMinsAgo: 2  },
  { id: 3,  joinedMinsAgo: 7  },
  { id: 6,  joinedMinsAgo: 14 },
  { id: 9,  joinedMinsAgo: 23 },
  { id: 11, joinedMinsAgo: 31 },
  { id: 14, joinedMinsAgo: 45 },
  { id: 17, joinedMinsAgo: 58 },
];

let onlineUsers = [];   // { student, joinedAt: Date }
let onlineTimer = null;

function fmtOnlineTime(joinedAt) {
  const secs = Math.floor((Date.now() - joinedAt) / 1000);
  if (secs < 60)  return `${secs}s`;
  const mins = Math.floor(secs / 60);
  if (mins < 60)  return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function renderOnlineUsers() {
  const list  = document.getElementById('onlineUsersList');
  const count = document.getElementById('onlineCount');
  if (!list) return;

  count.textContent = onlineUsers.length;
  list.innerHTML = '';

  onlineUsers.forEach(({ student, joinedAt }) => {
    const p = getPalette(student.id);
    const card = document.createElement('div');
    card.className = 'online-user-card';
    card.innerHTML = `
      <div class="online-avatar" style="color:${p.color};background:${p.bg};border-color:${p.border}">
        ${initials(student.name)}
      </div>
      <div class="online-info">
        <span class="online-name">${student.name}</span>
      </div>
      <div class="online-duration" data-joined="${joinedAt}">${fmtOnlineTime(joinedAt)}</div>
    `;
    list.appendChild(card);
  });
}

function initOnlineUsers() {
  if (!studentsData.length) return;
  const now = Date.now();
  onlineUsers = ONLINE_SEEDS
    .map(seed => {
      const student = studentsData.find(s => s.id === seed.id);
      return student ? { student, joinedAt: now - seed.joinedMinsAgo * 60 * 1000 } : null;
    })
    .filter(Boolean);

  renderOnlineUsers();

  // Update durations every 30s
  if (onlineTimer) clearInterval(onlineTimer);
  onlineTimer = setInterval(() => {
    document.querySelectorAll('.online-duration[data-joined]').forEach(el => {
      el.textContent = fmtOnlineTime(Number(el.dataset.joined));
    });
  }, 30_000);
}



(async () => {
  document.getElementById('userPill').style.display = 'none';
  document.getElementById('loginBtn').style.display  = 'flex';

  await loadStudents();
  buildDemoUsers(studentsData);
  initOnlineUsers();
})();