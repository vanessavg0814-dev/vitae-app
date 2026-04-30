// tokens.js — VITAE design tokens (new brand direction)
// Aesthetic: clinical · data-driven · premium · respiratory performance

export const V = {
  // Core palette
  cream:    '#F0EDE7',    // primary background
  creamDim: '#E8E5E0',    // dimmer variant (cards, dividers)
  ink:      '#1a1a1a',    // primary text
  inkSoft:  '#666666',    // secondary text
  inkMute:  '#999999',    // muted labels
  inkHair:  'rgba(0,0,0,0.06)',  // hairline borders
  teal:     '#5ABEAA',    // primary accent
  tealDeep: '#3D9080',    // darker teal (pressed states)
  tealFog:  'rgba(90,190,170,0.08)', // teal tint backgrounds
  tealGlow: 'rgba(90,195,175,0.15)', // orb glow
  gold:     '#C4A258',    // warm gold (secondary accent)
  rose:     '#C05050',    // alert / at-risk
  moss:     '#6AA876',    // good / high tier
  night:    '#0B1824',    // dark mode bg
  nightAlt: '#142430',    // dark mode variant
  white:    '#FFFFFF',
};

// Legacy alias for backward compat
export const VITAE = {
  paper:    V.cream,
  paperDim: V.creamDim,
  ink:      V.ink,
  inkSoft:  V.inkSoft,
  inkMute:  V.inkMute,
  inkHair:  V.inkHair,
  cyan:     V.teal,
  cyanDeep: V.tealDeep,
  cyanFog:  V.tealFog,
  amber:    V.gold,
  rose:     V.rose,
  moss:     V.moss,
  violet:   '#7B68EE',
  night:    V.night,
  nightAlt: V.nightAlt,
};

// Typography
export const FONT_DISPLAY = "'Aboreto', sans-serif";
export const FONT_UI      = "'Inter', -apple-system, system-ui, sans-serif";
export const FONT_MONO    = "'JetBrains Mono', ui-monospace, monospace";
export const FONT_NUM     = "'Aboreto', sans-serif";  // Aboreto for big numbers too

// Score interpretation tiers — aligned with VITAE Score bands
export function tierFor(ris) {
  if (ris >= 80) return { name: 'Optimal',     short: 'Optimal',     color: V.teal,  ink: V.tealDeep, idx: 4 };
  if (ris >= 65) return { name: 'Good',         short: 'Good',        color: V.moss,  ink: '#4A8856',  idx: 3 };
  if (ris >= 50) return { name: 'Functional',   short: 'Functional',  color: V.gold,  ink: '#A08040',  idx: 2 };
  if (ris >= 35) return { name: 'Developing',   short: 'Developing',  color: V.rose,  ink: '#A04040',  idx: 1 };
  return             { name: 'At-Risk',      short: 'At-Risk',     color: V.rose,  ink: '#903030',  idx: 0 };
}

// Exercise palettes (6 breathing programme themes)
export const PROGRAM_PALETTES = {
  calm:     { name: 'CALM',     center: V.teal,    edge: V.tealFog,  accent: V.tealDeep },
  build:    { name: 'BUILD',    center: V.gold,    edge: 'rgba(196,162,88,0.08)',  accent: '#A08040' },
  charge:   { name: 'CHARGE',   center: '#D4A840', edge: 'rgba(212,168,64,0.08)',  accent: '#B89030' },
  balance:  { name: 'BALANCE',  center: V.moss,    edge: 'rgba(106,168,118,0.08)', accent: '#4A8856' },
  recovery: { name: 'RECOVERY', center: '#7B68EE', edge: 'rgba(123,104,238,0.08)', accent: '#5A48C8' },
  reset:    { name: 'RESET',    center: '#D070A0', edge: 'rgba(208,112,160,0.08)', accent: '#B05080' },
};

export const TAG_TO_PALETTE = { CALM:'calm', BUILD:'build', CHARGE:'charge', BALANCE:'balance', COOL:'recovery', RESET:'reset' };
