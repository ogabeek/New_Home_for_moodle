/**
 * LEAGUES OF CODE — Design Tokens (JS)
 *
 * Mirrors brand.css so canvas / JS animation code can use
 * the same values without hard-coding hex strings.
 *
 * Usage (ES module):
 *   import { brand, courses as courseColors } from './brand.js';
 *   ctx.fillStyle = brand.blue;
 *
 * Usage (CommonJS / plain script tag — exposes window.LOCBrand):
 *   <script src="brand.js"></script>
 *   const { brand } = window.LOCBrand;
 */

// ------------------------------------------------------------------
// PRIMARY PALETTE
// ------------------------------------------------------------------
export const brand = Object.freeze({
  blue:   '#3844FF',  // --loc-blue
  cyan:   '#38C9FF',  // --loc-cyan
  dark:   '#05071D',  // --loc-dark
  white:  '#FFFFFF',  // --loc-white
});

// ------------------------------------------------------------------
// SECONDARY PALETTE  (keyed by Roman numeral i → v)
// ------------------------------------------------------------------
export const secondary = Object.freeze({
  i:   '#38C9FF',  // Cyan
  ii:  '#CF75FF',  // Violet
  iii: '#EB4869',  // Coral
  iv:  '#F8CD46',  // Yellow
  v:   '#5CC88D',  // Green
});

// ------------------------------------------------------------------
// COURSE COLOUR CONFIGS  (matches courseColorConfigs in script.js)
// Particles expect "rgba(r,g,b," prefix strings for perf reasons.
// ------------------------------------------------------------------
export const courseColors = Object.freeze({
  blue: {
    icon:      '#dbeafe',
    button:    '#3b82f6',
    particles: ['rgba(59,130,246,',  'rgba(96,165,250,'],
  },
  green: {
    icon:      '#d1fae5',
    button:    '#10b981',
    particles: ['rgba(16,185,129,',  'rgba(52,211,153,'],
  },
  orange: {
    icon:      '#fef3c7',
    button:    '#f59e0b',
    particles: ['rgba(245,158,11,',  'rgba(251,191,36,'],
  },
  purple: {
    icon:      '#ede9fe',
    button:    '#8b5cf6',
    particles: ['rgba(139,92,246,',  'rgba(167,139,250,'],
  },
  grey: {
    icon:      '#f3f4f6',
    button:    '#6b7280',
    particles: ['rgba(107,114,128,', 'rgba(156,163,175,'],
  },
  cyan: {
    icon:      '#cffafe',
    button:    '#06b6d4',
    particles: ['rgba(6,182,212,',   'rgba(34,211,238,'],
  },
});

// ------------------------------------------------------------------
// GRADIENTS  (CSS strings, useful for canvas linearGradient helpers)
// ------------------------------------------------------------------
export const gradients = Object.freeze({
  brand:     `linear-gradient(135deg, ${brand.blue} 0%, ${brand.cyan} 100%)`,
  brandDark: `linear-gradient(135deg, ${brand.dark} 0%, ${brand.blue} 100%)`,
});

// ------------------------------------------------------------------
// TYPOGRAPHY  (mirrors brand.css type scale from Figma)
// ------------------------------------------------------------------
export const fonts = Object.freeze({
  heading: "'GT Walsheim', 'DM Sans', system-ui, sans-serif",
  body:    "'Inter', 'DM Sans', system-ui, sans-serif",
});

export const typeScale = Object.freeze({
  h1:    { size: 64, line: 64,  tracking: -1.6, weight: 700, family: fonts.heading },
  h2:    { size: 40, line: 44,  tracking: -1,   weight: 700, family: fonts.heading },
  h3:    { size: 32, line: 32,  tracking: -0.6, weight: 700, family: fonts.heading },
  h4:    { size: 20, line: 24,  tracking: 0.1,  weight: 700, family: fonts.body    },
  h5:    { size: 20, line: 24,  tracking: 0.1,  weight: 700, family: fonts.body    },
  pLg:   { size: 22, line: 32,  tracking: -0.3, weight: 400, family: fonts.body    },
  pMd:   { size: 18, line: 28,  tracking: 0,    weight: 400, family: fonts.body    },
  pSm:   { size: 14, line: 18,  tracking: -0.1, weight: 400, family: fonts.body    },
  btn:   { size: 16, line: 18,  tracking: 0,    weight: 400, family: fonts.body    },
});

// ------------------------------------------------------------------
// CommonJS / plain <script> fallback
// ------------------------------------------------------------------
if (typeof window !== 'undefined') {
  window.LOCBrand = { brand, secondary, courseColors, gradients, fonts, typeScale };
}
