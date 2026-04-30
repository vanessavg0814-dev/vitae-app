// score.js — BreathScore engine + sample personas
// Mirrors supabase/functions/calculate-breathscore/index.ts

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function exerciseFrequencyModifier(freq) {
  if (!freq) return 0;
  return { low: 0, moderate: -2, high: -4 }[freq] ?? 0;
}

function spiroScore(pctPred) {
  if (pctPred == null) return null;
  return clamp(((clamp(pctPred, 70, 130) - 70) / 60) * 100, 0, 100);
}
function fev1FvcRatioScore(r) {
  if (r == null) return null;
  if (r >= 0.80) return 95;
  if (r >= 0.75) return 95 - ((0.80 - r) / 0.05) * 15;
  if (r >= 0.70) return 80 - ((0.75 - r) / 0.05) * 20;
  if (r >= 0.60) return 60 - ((0.70 - r) / 0.10) * 30;
  return 20;
}
function co2ToleranceScore(s) {
  if (s < 20) return 20;
  if (s < 30) return 20 + ((s - 20) / 10) * 20;
  if (s < 40) return 40 + ((s - 30) / 10) * 20;
  if (s < 50) return 60 + ((s - 40) / 10) * 15;
  if (s < 60) return 75 + ((s - 50) / 10) * 10;
  return 95;
}
function rrVariabilityScore(c) {
  if (c <= 3) return 95;
  if (c <= 5) return 95 - ((c - 3) / 2) * 10;
  if (c <= 10) return 85 - ((c - 5) / 5) * 20;
  if (c <= 15) return 65 - ((c - 10) / 5) * 20;
  if (c <= 25) return 45 - ((c - 15) / 10) * 20;
  return 20;
}
function breathingIrregularityScore(i) {
  if (i <= 10) return 95;
  if (i <= 20) return 95 - ((i - 10) / 10) * 10;
  if (i <= 40) return 85 - ((i - 20) / 20) * 25;
  if (i <= 60) return 60 - ((i - 40) / 20) * 20;
  if (i <= 80) return 40 - ((i - 60) / 20) * 15;
  return 20;
}
function recoveryResponseScore(s) {
  if (s <= 30) return 95;
  if (s <= 60) return 95 - ((s - 30) / 30) * 20;
  if (s <= 90) return 75 - ((s - 60) / 30) * 15;
  if (s <= 120) return 60 - ((s - 90) / 30) * 15;
  if (s <= 180) return 45 - ((s - 120) / 60) * 20;
  return 20;
}
function etco2Score(e) {
  if (e <= 30) return 40;
  if (e <= 34) return 50 + ((e - 31) / 3) * 20;
  if (e <= 42) return 80 + ((e - 35) / 7) * 15;
  if (e <= 45) return 92 - ((e - 43) / 2) * 7;
  if (e <= 48) return 80 - ((e - 46) / 2) * 10;
  return 60;
}

export function interpretationTier(ris) {
  if (ris >= 90) return 'Elite Respiratory Performance';
  if (ris >= 75) return 'High Efficiency';
  if (ris >= 60) return 'Moderate Efficiency';
  if (ris >= 45) return 'Low Efficiency';
  return 'Respiratory Dysfunction Risk';
}

function recommendProgram(mech, reg, stab, rec) {
  const pillars = [
    { name: 'Respiratory Mechanics',  score: mech, program: 'Lung Expansion Protocol',     duration: '8 weeks' },
    { name: 'Respiratory Regulation', score: reg,  program: 'CO₂ Capacity Builder',    duration: '6 weeks' },
  ];
  if (stab !== null) pillars.push({ name: 'Respiratory Stability', score: stab, program: 'Nervous System Reset', duration: '6 weeks' });
  if (rec  !== null) pillars.push({ name: 'Respiratory Recovery',  score: rec,  program: 'Recovery Response Protocol', duration: '4 weeks' });
  pillars.sort((a, b) => a.score !== b.score ? a.score - b.score : Math.abs(b.score - 85) - Math.abs(a.score - 85));
  return { weakestPillar: pillars[0].name, program: pillars[0].program, duration: pillars[0].duration };
}

export function calculateBasic(input) {
  const co2Tol = co2ToleranceScore(input.co2HoldBestSec);
  let breathRateScore = null;
  if (input.restingBreathRate != null && input.restingBreathRate > 0) {
    const rr = input.restingBreathRate;
    if (rr <= 8) breathRateScore = 95;
    else if (rr <= 12) breathRateScore = 90;
    else if (rr <= 16) breathRateScore = 75;
    else if (rr <= 20) breathRateScore = 55;
    else breathRateScore = 30;
  }
  const recScore = input.recoveryTimeSec != null && input.recoveryTimeSec > 0
    ? recoveryResponseScore(input.recoveryTimeSec) : null;

  let ris;
  if (breathRateScore != null && recScore != null) ris = 0.5 * co2Tol + 0.3 * recScore + 0.2 * breathRateScore;
  else if (recScore != null) ris = 0.6 * co2Tol + 0.4 * recScore;
  else if (breathRateScore != null) ris = 0.7 * co2Tol + 0.3 * breathRateScore;
  else ris = co2Tol;
  ris += exerciseFrequencyModifier(input.exerciseFrequency);
  ris = Math.round(clamp(ris, 0, 100));

  return {
    risComposite: ris,
    mechanicalScore: 0,
    regulationScore: Math.round(co2Tol * 10) / 10,
    stabilityScore:  breathRateScore != null ? Math.round(breathRateScore * 10) / 10 : null,
    recoveryScore:   recScore != null ? Math.round(recScore * 10) / 10 : null,
    tier: interpretationTier(ris),
    recommendation: recommendProgram(50, co2Tol, breathRateScore, recScore),
    mode: 'basic',
  };
}

export function calculateFull(input) {
  const fev1 = spiroScore(input.fev1PctPred);
  const fvc  = spiroScore(input.fvcPctPred);
  const pef  = spiroScore(input.pefPctPred);
  const ratioSc = fev1FvcRatioScore(input.fev1FvcRatio);
  const mechInputs = [];
  if (fev1 != null) mechInputs.push({ w: 0.35, s: fev1 });
  if (fvc  != null) mechInputs.push({ w: 0.20, s: fvc });
  if (pef  != null) mechInputs.push({ w: 0.15, s: pef });
  if (ratioSc != null) mechInputs.push({ w: 0.30, s: ratioSc });
  const tw = mechInputs.reduce((a, b) => a + b.w, 0);
  const mech = clamp(mechInputs.reduce((a, b) => a + (b.w / tw) * b.s, 0), 0, 100);

  const co2Tol = co2ToleranceScore(input.co2HoldBestSec);
  const stabScores = [];
  if (input.rrVariabilityCv != null) stabScores.push({ w: 0.55, s: rrVariabilityScore(input.rrVariabilityCv) });
  if (input.breathingIrregularityIndex != null) stabScores.push({ w: 0.45, s: breathingIrregularityScore(input.breathingIrregularityIndex) });
  const stw = stabScores.reduce((a, b) => a + b.w, 0);
  const stab = stabScores.length ? stabScores.reduce((a, b) => a + (b.w / stw) * b.s, 0) : null;

  const rec = input.recoveryTimeSec ? recoveryResponseScore(input.recoveryTimeSec) : null;

  let ris;
  if (stab !== null && rec !== null) ris = 0.25 * mech + 0.30 * co2Tol + 0.25 * rec + 0.20 * stab;
  else if (stab !== null) ris = 0.30 * mech + 0.35 * co2Tol + 0.35 * stab;
  else if (rec !== null) ris = 0.30 * mech + 0.40 * co2Tol + 0.30 * rec;
  else ris = 0.35 * mech + 0.65 * co2Tol;

  if (input.etco2Mean != null) {
    const e = etco2Score(input.etco2Mean);
    ris += clamp((0.8 * e + 0.2 * 100 - 70) / 30 * 5, -5, 5);
  }
  ris += exerciseFrequencyModifier(input.exerciseFrequency);
  ris = Math.round(clamp(ris, 0, 100));

  return {
    risComposite: ris,
    mechanicalScore: Math.round(mech * 10) / 10,
    regulationScore: Math.round(co2Tol * 10) / 10,
    stabilityScore:  stab !== null ? Math.round(stab * 10) / 10 : null,
    recoveryScore:   rec  !== null ? Math.round(rec  * 10) / 10 : null,
    fev1Score: fev1, fvcScore: fvc, pefScore: pef, ratioScore: ratioSc,
    etco2: input.etco2Mean ?? null,
    tier: interpretationTier(ris),
    recommendation: recommendProgram(mech, co2Tol, stab, rec),
    mode: 'full',
  };
}

export const PERSONAS = {
  ada: {
    name: 'Ada Lemaître', age: 34, sex: 'F', height: 168,
    basic: { co2HoldBestSec: 62, restingBreathRate: 11, recoveryTimeSec: 28, exerciseFrequency: 'high' },
    full:  { fev1PctPred: 112, fvcPctPred: 108, pefPctPred: 105, fev1FvcRatio: 0.84, co2HoldBestSec: 62, recoveryTimeSec: 28, rrVariabilityCv: 4, breathingIrregularityIndex: 12, etco2Mean: 39, rrMean: 11, exerciseFrequency: 'high' },
    history: [62, 65, 71, 74, 78, 82, 85, 88, 91, 89, 92, 93],
  },
  noah: {
    name: 'Noah Park', age: 41, sex: 'M', height: 178,
    basic: { co2HoldBestSec: 38, restingBreathRate: 17, recoveryTimeSec: 72, exerciseFrequency: 'moderate' },
    full:  { fev1PctPred: 92, fvcPctPred: 96, pefPctPred: 88, fev1FvcRatio: 0.78, co2HoldBestSec: 38, recoveryTimeSec: 72, rrVariabilityCv: 11, breathingIrregularityIndex: 38, etco2Mean: 33, rrMean: 17, exerciseFrequency: 'moderate' },
    history: [55, 52, 58, 56, 61, 64, 62, 67, 69, 65, 68, 67],
  },
  ines: {
    name: 'Inés Vilar', age: 58, sex: 'F', height: 162,
    basic: { co2HoldBestSec: 22, restingBreathRate: 21, recoveryTimeSec: 165, exerciseFrequency: 'low' },
    full:  { fev1PctPred: 71, fvcPctPred: 78, pefPctPred: 68, fev1FvcRatio: 0.66, co2HoldBestSec: 22, recoveryTimeSec: 165, rrVariabilityCv: 18, breathingIrregularityIndex: 62, etco2Mean: 30, rrMean: 21, exerciseFrequency: 'low' },
    history: [38, 41, 39, 43, 45, 44, 47, 49, 48, 51, 50, 52],
  },
};

export function computeFor(personaKey, mode) {
  const p = PERSONAS[personaKey];
  return mode === 'full' ? calculateFull(p.full) : calculateBasic(p.basic);
}

export const EXERCISES = [
  { id: 'box',       name: 'Box breathing',       kind: '4·4·4·4', duration: '8 min',  pillar: 'Regulation', tier: 'foundational', tag: 'CALM' },
  { id: 'reset',     name: 'Physiological sigh',  kind: '2-in · 1-extra · long-out', duration: '3 min', pillar: 'Stability', tier: 'foundational', tag: 'RESET' },
  { id: 'co2',       name: 'CO₂ tolerance table', kind: 'increasing holds', duration: '12 min', pillar: 'Regulation', tier: 'advanced', tag: 'BUILD' },
  { id: 'wim',       name: 'Power breath cycle',  kind: '30 fast · hold', duration: '15 min', pillar: 'Mechanics',  tier: 'advanced', tag: 'CHARGE' },
  { id: 'coherence', name: 'Heart coherence',      kind: '5·5 paced', duration: '10 min', pillar: 'Stability',  tier: 'foundational', tag: 'BALANCE' },
  { id: 'recovery',  name: 'Recovery breath',      kind: 'extended exhale', duration: '6 min', pillar: 'Recovery',   tier: 'foundational', tag: 'COOL' },
];
