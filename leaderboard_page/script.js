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
    { id:  21, name: 'Kateryna Bondar', handle: 'kbondar', group: 'Ukraine', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  22, name: 'David Ramírez', handle: 'dramirez', group: 'Spain', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  23, name: 'Babajide Adeyemi', handle: 'badeyemi', group: 'Harbour', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  24, name: 'Bailey Jackson', handle: 'bjackson', group: 'League of Code', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  25, name: 'Lesia Sydorenko', handle: 'lsydorenko', group: 'Ukraine', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  26, name: 'Fernando Reyes', handle: 'freyes', group: 'Spain', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  27, name: 'Zara Ihejirika', handle: 'zihejirika', group: 'Harbour', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  28, name: 'Parker Lewis', handle: 'plewis', group: 'League of Code', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  29, name: 'Daria Chernysh', handle: 'dchernysh', group: 'Ukraine', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  30, name: 'Helena Herrera', handle: 'hherrera', group: 'Spain', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  31, name: 'Hauwa Usman', handle: 'husman', group: 'Harbour', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  32, name: 'Devon Robinson', handle: 'drobinson', group: 'League of Code', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  33, name: 'Andrii Moroz', handle: 'amoroz', group: 'Ukraine', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  34, name: 'Adrián Castro', handle: 'acastro', group: 'Spain', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  35, name: 'Fatima Mensah', handle: 'fmensah', group: 'Harbour', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  36, name: 'Bailey King', handle: 'bking', group: 'League of Code', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  37, name: 'Roksolana Boyko', handle: 'rboyko', group: 'Ukraine', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  38, name: 'Julia Navarro', handle: 'jnavarro', group: 'Spain', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  39, name: 'Makena Owusu', handle: 'mowusu', group: 'Harbour', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  40, name: 'Bailey Young', handle: 'byoung', group: 'League of Code', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  41, name: 'Hanna Moroz', handle: 'hmoroz', group: 'Ukraine', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  42, name: 'Carmen Romero', handle: 'cromero', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  43, name: 'Ahmed Sow', handle: 'asow', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  44, name: 'Sage Wright', handle: 'swright', group: 'League of Code', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  45, name: 'Kateryna Vasylenko', handle: 'kvasylenko', group: 'Ukraine', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  46, name: 'Lara Delgado', handle: 'ldelgado', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  47, name: 'Yewande Traore', handle: 'ytraore', group: 'Harbour', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  48, name: 'Nico Evans', handle: 'nevans', group: 'League of Code', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  49, name: 'Zoriana Kovalchuk', handle: 'zkovalchuk', group: 'Ukraine', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  50, name: 'Eduardo Vega', handle: 'evega', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  51, name: 'Aisha Amara', handle: 'aamara', group: 'Harbour', progress: { python1: 3, python2: 2, math101: 1 } },
    { id:  52, name: 'Logan Lee', handle: 'llee', group: 'League of Code', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  53, name: 'Halyna Zaichenko', handle: 'hzaichenko', group: 'Ukraine', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  54, name: 'Eduardo Díaz', handle: 'ediaz', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  55, name: 'Ibrahim Obi', handle: 'iobi', group: 'Harbour', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  56, name: 'Blake Parker', handle: 'bparker', group: 'League of Code', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  57, name: 'Andrii Ponomarenko', handle: 'aponomaren', group: 'Ukraine', progress: { python1: 3, python2: 1, math101: 1 } },
    { id:  58, name: 'Carmen González', handle: 'cgonzalez', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  59, name: 'Aisha Akinwale', handle: 'aakinwale', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  60, name: 'Hayden Clarke', handle: 'hclarke', group: 'League of Code', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  61, name: 'Petro Shevchuk', handle: 'pshevchuk', group: 'Ukraine', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  62, name: 'Rafael Flores', handle: 'rflores', group: 'Spain', progress: { python1: 2, python2: 2, math101: 0 } },
    { id:  63, name: 'Damilola Sow', handle: 'dsow', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  64, name: 'Sage Moore', handle: 'smoore', group: 'League of Code', progress: { python1: 2, python2: 2, math101: 0 } },
    { id:  65, name: 'Hanna Zaichenko', handle: 'hzaichenko65', group: 'Ukraine', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  66, name: 'Gloria Muñoz', handle: 'gmunoz', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  67, name: 'Hauwa Akinwale', handle: 'hakinwale', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  68, name: 'Jamie Williams', handle: 'jwilliams', group: 'League of Code', progress: { python1: 2, python2: 2, math101: 1 } },
    { id:  69, name: 'Serhiy Hrytsenko', handle: 'shrytsenko', group: 'Ukraine', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  70, name: 'Ignacio Álvarez', handle: 'ialvarez', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  71, name: 'Efua Mensah', handle: 'emensah', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  72, name: 'Lane Lee', handle: 'llee72', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 1 } },
    { id:  73, name: 'Vladyslav Zaichenko', handle: 'vzaichenko', group: 'Ukraine', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  74, name: 'Víctor Morales', handle: 'vmorales', group: 'Spain', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  75, name: 'Rania Akinwale', handle: 'rakinwale', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  76, name: 'Marlowe Smith', handle: 'msmith', group: 'League of Code', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  77, name: 'Vladyslav Tkachenko', handle: 'vtkachenko', group: 'Ukraine', progress: { python1: 1, python2: 1, math101: 1 } },
    { id:  78, name: 'Víctor Moreno', handle: 'vmoreno', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  79, name: 'Kofi Fakoya', handle: 'kfakoya', group: 'Harbour', progress: { python1: 1, python2: 1, math101: 1 } },
    { id:  80, name: 'Cameron Lee', handle: 'clee', group: 'League of Code', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  81, name: 'Viktor Danyliuk', handle: 'vdanyliuk', group: 'Ukraine', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  82, name: 'Julia Herrera', handle: 'jherrera', group: 'Spain', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  83, name: 'Fatima Kamara', handle: 'fkamara', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  84, name: 'Jamie Wright', handle: 'jwright', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  85, name: 'Ivan Fedorenko', handle: 'ifedorenko', group: 'Ukraine', progress: { python1: 1, python2: 1, math101: 1 } },
    { id:  86, name: 'Elena Gil', handle: 'egil', group: 'Spain', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  87, name: 'Wanjiru Owusu', handle: 'wowusu', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  88, name: 'Nico Clarke', handle: 'nclarke', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  89, name: 'Oleksandr Marchenko', handle: 'omarchenko', group: 'Ukraine', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  90, name: 'Diana Martínez', handle: 'dmartinez', group: 'Spain', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  91, name: 'Chioma Tanko', handle: 'ctanko', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  92, name: 'Casey Hall', handle: 'chall', group: 'League of Code', progress: { python1: 1, python2: 0, math101: 0 } },
    { id:  93, name: 'Bohdan Moroz', handle: 'bmoroz', group: 'Ukraine', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  94, name: 'Eduardo Muñoz', handle: 'emunoz', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  95, name: 'Emeka Fakoya', handle: 'efakoya', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 1 } },
    { id:  96, name: 'Indigo Robinson', handle: 'irobinson', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id:  97, name: 'Ihor Vasylenko', handle: 'ivasylenko', group: 'Ukraine', progress: { python1: 2, python2: 1, math101: 0 } },
    { id:  98, name: 'Francisca Reyes', handle: 'freyes98', group: 'Spain', progress: { python1: 1, python2: 1, math101: 1 } },
    { id:  99, name: 'Hauwa Eze', handle: 'heze', group: 'Harbour', progress: { python1: 2, python2: 1, math101: 0 } },
    { id: 100, name: 'Finley Parker', handle: 'fparker', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 101, name: 'Tetiana Chernysh', handle: 'tchernysh', group: 'Ukraine', progress: { python1: 2, python2: 0, math101: 0 } },
    { id: 102, name: 'Natalia Ramírez', handle: 'nramirez', group: 'Spain', progress: { python1: 2, python2: 1, math101: 1 } },
    { id: 103, name: 'Damilola Garba', handle: 'dgarba', group: 'Harbour', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 104, name: 'Devon Taylor', handle: 'dtaylor', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 105, name: 'Oleh Danyliuk', handle: 'odanyliuk', group: 'Ukraine', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 106, name: 'César López', handle: 'clopez', group: 'Spain', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 107, name: 'Yewande Lawal', handle: 'ylawal', group: 'Harbour', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 108, name: 'Alex Evans', handle: 'aevans', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 109, name: 'Vitaliy Savchenko', handle: 'vsavchenko', group: 'Ukraine', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 110, name: 'Javier Muñoz', handle: 'jmunoz', group: 'Spain', progress: { python1: 1, python2: 0, math101: 1 } },
    { id: 111, name: 'Wanjiru Traore', handle: 'wtraore', group: 'Harbour', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 112, name: 'Bailey Anderson', handle: 'banderson', group: 'League of Code', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 113, name: 'Zoriana Tymoshenko', handle: 'ztymoshenk', group: 'Ukraine', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 114, name: 'Sara Morales', handle: 'smorales', group: 'Spain', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 115, name: 'Xolani Kamara', handle: 'xkamara', group: 'Harbour', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 116, name: 'Morgan Moore', handle: 'mmoore', group: 'League of Code', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 117, name: 'Anastasia Boyko', handle: 'aboyko', group: 'Ukraine', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 118, name: 'Carmen Martínez', handle: 'cmartinez', group: 'Spain', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 119, name: 'Uche Ihejirika', handle: 'uihejirika', group: 'Harbour', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 120, name: 'Hayden Wilson', handle: 'hwilson', group: 'League of Code', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 121, name: 'Polina Ponomarenko', handle: 'pponomaren', group: 'Ukraine', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 122, name: 'Pilar Díaz', handle: 'pdiaz', group: 'Spain', progress: { python1: 1, python2: 0, math101: 1 } },
    { id: 123, name: 'Seun Okafor', handle: 'sokafor', group: 'Harbour', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 124, name: 'Emerson Hughes', handle: 'ehughes', group: 'League of Code', progress: { python1: 1, python2: 1, math101: 0 } },
    { id: 125, name: 'Mykola Zaichenko', handle: 'mzaichenko', group: 'Ukraine', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 126, name: 'Guillermo Pérez', handle: 'gperez', group: 'Spain', progress: { python1: 0, python2: 1, math101: 0 } },
    { id: 127, name: 'Hauwa Garba', handle: 'hgarba', group: 'Harbour', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 128, name: 'Quinn Foster', handle: 'qfoster', group: 'League of Code', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 129, name: 'Daria Yatsenko', handle: 'dyatsenko', group: 'Ukraine', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 130, name: 'Lara Muñoz', handle: 'lmunoz', group: 'Spain', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 131, name: 'Makena Usman', handle: 'musman', group: 'Harbour', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 132, name: 'Riley Brooks', handle: 'rbrooks', group: 'League of Code', progress: { python1: 0, python2: 1, math101: 0 } },
    { id: 133, name: 'Daria Oliynyk', handle: 'doliynyk', group: 'Ukraine', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 134, name: 'Ignacio Flores', handle: 'iflores', group: 'Spain', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 135, name: 'Makena Ihejirika', handle: 'mihejirika', group: 'Harbour', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 136, name: 'Nico Green', handle: 'ngreen', group: 'League of Code', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 137, name: 'Halyna Tymoshenko', handle: 'htymoshenk', group: 'Ukraine', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 138, name: 'Natalia González', handle: 'ngonzalez', group: 'Spain', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 139, name: 'Ibrahim Usman', handle: 'iusman', group: 'Harbour', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 140, name: 'Alex Young', handle: 'ayoung', group: 'League of Code', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 141, name: 'Bohdan Zinchenko', handle: 'bzinchenko', group: 'Ukraine', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 142, name: 'Hugo Díaz', handle: 'hdiaz', group: 'Spain', progress: { python1: 1, python2: 0, math101: 0 } },
    { id: 143, name: 'Xolani Garba', handle: 'xgarba', group: 'Harbour', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 144, name: 'Indigo Harris', handle: 'iharris', group: 'League of Code', progress: { python1: 0, python2: 0, math101: 0 } },
    // --- bottom feeders ---
    { id: 145, name: 'Matteo Ricci', handle: 'mricci', group: 'League of Code', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 146, name: 'Nkechi Osei', handle: 'nkosei', group: 'Harbour', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 147, name: 'Álvaro Fuentes', handle: 'afuentes', group: 'Spain', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 148, name: 'Viktor Vasylenko', handle: 'vvasylenko', group: 'Ukraine', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 149, name: 'Sam Whitfield', handle: 'swhitfield', group: 'League of Code', progress: { python1: 0, python2: 0, math101: 0 } },
    { id: 150, name: 'César Díaz', handle: 'cdiaz', group: 'Spain', progress: { python1: 0, python2: 0, math101: 0 } },
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
  'Ukraine':        { color: 'rgba(59,130,246,1)',  bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.28)'  },  // blue
  'Spain':          { color: 'rgba(245,158,11,1)',  bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.28)'  },  // orange
  'Harbour':        { color: 'rgba(6,182,212,1)',   bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.28)'   },  // cyan
  'League of Code': { color: 'rgba(16,185,129,1)',  bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.28)'  },  // green
};
function groupColor(name) {
  return GROUP_COLORS[name] || { color: 'rgba(107,114,128,1)', bg: 'rgba(107,114,128,0.08)', border: 'rgba(107,114,128,0.28)' };  // grey
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
      // User ranks BETTER than this page → pin user + neighbours at top
      extraTop = [];
      if (myIndex > 0) extraTop.push({ idx: myIndex - 1, isMe: false, dim: true });
      extraTop.push({ idx: myIndex, isMe: true, dim: false });
      if (myIndex + 1 < total) extraTop.push({ idx: myIndex + 1, isMe: false, dim: true });
    } else if (myIndex > pageEnd) {
      // User ranks WORSE than this page → pin user + neighbours at bottom
      extraBottom = [];
      if (myIndex > 0) extraBottom.push({ idx: myIndex - 1, isMe: false, dim: true });
      extraBottom.push({ idx: myIndex, isMe: true, dim: false });
      if (myIndex + 1 < total) extraBottom.push({ idx: myIndex + 1, isMe: false, dim: true });
    }
    // User IS on this page → no extra rows, no divider
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

    const maxSolved = Math.max(1, ...student.courses.map(c => c.solved));
    const segments = student.courses.map(c => {
      const w = c.solved > 0 ? (c.solved / maxSolved * 100).toFixed(2) : 0;
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
    const s = document.createElement('span');
    s.textContent = 'YOU';
    d.appendChild(s);
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
  [students[0], students[5], students[30], students[65], students[120]].forEach(s => {
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
  { id:  1, joinedMinsAgo:  2 },
  { id:  3, joinedMinsAgo:  5 },
  { id:  6, joinedMinsAgo:  9 },
  { id:  9, joinedMinsAgo: 14 },
  { id: 11, joinedMinsAgo: 18 },
  { id: 14, joinedMinsAgo: 23 },
  { id: 17, joinedMinsAgo: 29 },
  { id: 22, joinedMinsAgo: 33 },
  { id: 25, joinedMinsAgo: 37 },
  { id: 28, joinedMinsAgo: 41 },
  { id: 31, joinedMinsAgo: 46 },
  { id: 35, joinedMinsAgo: 50 },
  { id: 40, joinedMinsAgo: 54 },
  { id: 45, joinedMinsAgo: 59 },
  { id: 52, joinedMinsAgo: 63 },
  { id: 58, joinedMinsAgo: 68 },
  { id: 63, joinedMinsAgo: 74 },
  { id: 71, joinedMinsAgo: 81 },
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