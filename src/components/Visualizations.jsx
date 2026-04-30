// Visualizations.jsx â 4 score viz variants + PillarsQuad + Sparkline
import React from 'react';
import { V, VITAE, FONT_UI, FONT_DISPLAY, tierFor } from '../lib/tokens';
const FONT_NUM = FONT_DISPLAY;
const FONT_MONO = "'JetBrains Mono', monospace";

// âââ 1. RING âââââââââââââââââââââââââââââââââââââââââââââ
export function VizRing({ score = 78, size = 280, tier, animate = true }) {
  const t = tier || tierFor(score);
  const pct = score / 100;
  const ring = (radius, stroke, color, opacity = 1, animDelay = 0) => {
    const c = 2 * Math.PI * radius;
    return (
      <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeOpacity={opacity}
        strokeWidth={stroke} fill="none" strokeDasharray={`${pct * c} ${c}`}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={animate ? { animation: `vitaeDraw 1.6s ${animDelay}s cubic-bezier(.2,.7,.3,1) both`, '--len': c } : {}}
      />
    );
  };
  const inner = size * 0.32, mid = size * 0.40, outer = size * 0.46;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <div style={{ position:'absolute', inset:'15%', borderRadius:'50%', background:`radial-gradient(circle, ${t.color} 0%, transparent 65%)`, filter:'blur(28px)', opacity: 0.45, animation: animate ? 'vitaeBreathSlow 8s ease-in-out infinite' : 'none' }}/>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position:'relative' }}>
        <circle cx={size/2} cy={size/2} r={outer} stroke={VITAE.inkHair} strokeWidth="0.5" fill="none"/>
        <circle cx={size/2} cy={size/2} r={mid}   stroke={VITAE.inkHair} strokeWidth="0.5" fill="none"/>
        <circle cx={size/2} cy={size/2} r={inner} stroke={VITAE.inkHair} strokeWidth="0.5" fill="none"/>
        {ring(outer, 1.5, t.color, 1, 0)}
        {ring(mid,   1,   t.color, 0.6, 0.2)}
        {ring(inner, 0.7, t.color, 0.35, 0.4)}
        {[0, 25, 50, 75].map(deg => {
          const ang = (deg / 100) * 2 * Math.PI - Math.PI/2;
          const x1 = size/2 + Math.cos(ang) * (outer + 4), y1 = size/2 + Math.sin(ang) * (outer + 4);
          const x2 = size/2 + Math.cos(ang) * (outer + 8), y2 = size/2 + Math.sin(ang) * (outer + 8);
          return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={VITAE.inkMute} strokeWidth="0.5"/>;
        })}
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 4 }}>RIS</div>
        <div className="vitae-numeric" style={{ fontSize: size * 0.28, lineHeight: 1, color: VITAE.ink }}>{Math.round(score)}</div>
        <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: t.ink, marginTop: 8 }}>{t.short.toUpperCase()}</div>
      </div>
    </div>
  );
}

// âââ 2. COLUMN âââââââââââââââââââââââââââââââââââââââââââ
export function VizColumn({ score = 78, size = 280, tier, animate = true }) {
  const t = tier || tierFor(score);
  const w = size * 0.45, h = size, fillH = (score / 100) * h;
  const strata = [
    { from: 90, label: 'Elite', color: VITAE.cyan }, { from: 75, label: 'High', color: VITAE.moss },
    { from: 60, label: 'Moderate', color: VITAE.amber }, { from: 45, label: 'Low', color: VITAE.rose },
    { from: 0, label: 'At Risk', color: 'oklch(60% 0.14 20)' },
  ];
  return (
    <div style={{ position:'relative', width: size, height: size, display:'flex', alignItems:'center', justifyContent:'center', gap: 14 }}>
      <div style={{ position:'relative', width: w, height: h, border: `1px solid ${VITAE.inkHair}`, background: VITAE.paperDim, overflow:'hidden' }}>
        {strata.map(s => <div key={s.from} style={{ position:'absolute', left:0, right:0, bottom:`${s.from}%`, borderBottom: s.from === 0 ? 'none' : `0.5px dashed ${VITAE.inkHair}` }}/>)}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, height: fillH, background: `linear-gradient(180deg, ${t.color} 0%, ${t.ink} 120%)`, transition: 'height 1.6s cubic-bezier(.2,.7,.3,1)' }}>
          <div style={{ position:'absolute', left: -2, right: -2, top: -6, height: 12, background: t.color, borderRadius: '50%', filter: 'blur(2px)', opacity: 0.6, animation: animate ? 'vitaeBreath 6s ease-in-out infinite' : 'none' }}/>
          <div style={{ position:'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(255,255,255,0.25) 0%, transparent 50%)' }}/>
        </div>
      </div>
      <div style={{ height: h, display:'flex', flexDirection:'column-reverse', justifyContent:'space-between', padding:'2px 0' }}>
        {strata.slice().reverse().map(s => <div key={s.from} className="vitae-eyebrow" style={{ color: VITAE.inkMute }}>{s.from} Â· {s.label}</div>)}
      </div>
      <div style={{ position:'absolute', top: 8, right: 8, textAlign:'right' }}>
        <div className="vitae-numeric" style={{ fontSize: 46, lineHeight: 1, color: VITAE.ink }}>{Math.round(score)}</div>
        <div className="vitae-eyebrow" style={{ color: t.ink }}>{t.short}</div>
      </div>
    </div>
  );
}

// âââ 3. WAVE âââââââââââââââââââââââââââââââââââââââââââââ
export function VizWave({ score = 78, size = 280, tier, animate = true }) {
  const t = tier || tierFor(score);
  const w = size, h = size * 0.62, amp = 8 + (score / 100) * 28, cycles = 2 + Math.round((score / 100) * 3);
  const N = 80;
  const pts = [], pts2 = [];
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * w;
    pts.push(`${x},${h/2 + Math.sin((i/N)*Math.PI*2*cycles) * amp * Math.sin((i/N)*Math.PI)}`);
    pts2.push(`${x},${h/2 + Math.sin((i/N)*Math.PI*2*cycles+1.4) * (amp*0.55) * Math.sin((i/N)*Math.PI)}`);
  }
  return (
    <div style={{ position:'relative', width: size, height: size, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
      <div>
        <div className="vitae-eyebrow" style={{ color: VITAE.inkMute }}>Vitae Â· {t.short}</div>
        <div className="vitae-numeric" style={{ fontSize: 78, lineHeight: 0.95, color: VITAE.ink, marginTop: 4 }}>
          {Math.round(score)}<span className="vitae-num" style={{ fontSize: 18, color: VITAE.inkMute, marginLeft: 6 }}>/100</span>
        </div>
      </div>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display:'block', marginTop:'auto' }}>
        <defs><linearGradient id="waveStroke" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor={t.color} stopOpacity="0.1"/><stop offset="50%" stopColor={t.color}/><stop offset="100%" stopColor={t.color} stopOpacity="0.1"/></linearGradient></defs>
        <line x1="0" y1={h/2} x2={w} y2={h/2} stroke={VITAE.inkHair} strokeWidth="0.5" strokeDasharray="2 3"/>
        <polyline points={pts2.join(' ')} fill="none" stroke={t.color} strokeOpacity="0.35" strokeWidth="1" style={animate ? { animation: 'vitaeFloat 7s ease-in-out infinite' } : {}}/>
        <polyline points={pts.join(' ')} fill="none" stroke="url(#waveStroke)" strokeWidth="1.4" style={animate ? { animation: 'vitaeFloat 5s ease-in-out infinite' } : {}}/>
      </svg>
    </div>
  );
}

// âââ 4. BAR ââââââââââââââââââââââââââââââââââââââââââââââ
export function VizBar({ score = 78, size = 280, tier }) {
  const t = tier || tierFor(score);
  const zones = [{ from:0, to:45, c:'oklch(60% 0.14 20)' }, { from:45, to:60, c:VITAE.rose }, { from:60, to:75, c:VITAE.amber }, { from:75, to:90, c:VITAE.moss }, { from:90, to:100, c:VITAE.cyan }];
  return (
    <div style={{ width: size }}>
      <div className="vitae-eyebrow" style={{ color: VITAE.inkMute }}>Respiratory Index</div>
      <div style={{ display:'flex', alignItems:'baseline', gap: 8, marginTop: 4 }}>
        <span className="vitae-numeric" style={{ fontSize: 72, lineHeight: 0.9, color: VITAE.ink }}>{Math.round(score)}</span>
        <span className="vitae-num" style={{ fontSize: 14, color: VITAE.inkMute }}>Â· {t.short}</span>
      </div>
      <div style={{ position:'relative', height: 6, background: VITAE.paperDim, marginTop: 22, borderRadius: 3 }}>
        {zones.map(z => <div key={z.from} style={{ position:'absolute', top:0, height:6, left:`${z.from}%`, width:`${z.to-z.from}%`, background: z.c, opacity: 0.18 }}/>)}
        <div style={{ position:'absolute', left:0, top:0, height:6, width:`${score}%`, background:`linear-gradient(90deg, ${VITAE.cyanFog}, ${t.color})`, transition:'width 1.4s cubic-bezier(.2,.7,.3,1)', borderRadius: 3 }}/>
        <div style={{ position:'absolute', left:`${score}%`, top: -7, transform:'translateX(-50%)', width: 2, height: 20, background: VITAE.ink }}/>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop: 10 }}>
        {[0,45,60,75,90,100].map(v => <span key={v} className="vitae-num" style={{ fontSize: 9, color: VITAE.inkMute }}>{v}</span>)}
      </div>
    </div>
  );
}

// âââ Pillars Quad ââââââââââââââââââââââââââââââââââââââââ
export function PillarsQuad({ result, compact = false, color }) {
  const pillars = [
    { name: 'Mechanics',  score: result.mechanicalScore, blurb: 'Lung capacity & airflow' },
    { name: 'Regulation', score: result.regulationScore, blurb: 'COâ tolerance' },
    { name: 'Stability',  score: result.stabilityScore,  blurb: 'Breath rhythm steadiness' },
    { name: 'Recovery',   score: result.recoveryScore,   blurb: 'Return to baseline' },
  ];
  const hue = color || VITAE.cyan;
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 1, background: VITAE.inkHair, border: `1px solid ${VITAE.inkHair}` }}>
      {pillars.map(p => {
        const pct = p.score == null ? 0 : Math.max(2, Math.min(100, p.score));
        return (
          <div key={p.name} style={{ background: VITAE.paper, padding: compact ? '12px 14px' : '16px 18px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
              <div className="vitae-eyebrow" style={{ color: VITAE.inkMute }}>{p.name}</div>
              <span className="vitae-num" style={{ fontSize: compact ? 16 : 22, color: p.score == null ? VITAE.inkMute : VITAE.ink }}>{p.score == null ? 'â' : Math.round(p.score)}</span>
            </div>
            <div style={{ height: 1, background: VITAE.paperDim, marginTop: 10, position:'relative' }}>
              <div style={{ position:'absolute', left:0, top:-1, height:3, width:`${pct}%`, background: hue, transition:'width 1.2s cubic-bezier(.2,.7,.3,1)' }}/>
            </div>
            {!compact && <div className="vitae-ui" style={{ fontSize: 11, color: VITAE.inkMute, marginTop: 8 }}>{p.blurb}</div>}
          </div>
        );
      })}
    </div>
  );
}

// âââ Sparkline âââââââââââââââââââââââââââââââââââââââââââ
export function Sparkline({ data = [], width = 240, height = 60, color = VITAE.cyan }) {
  const max = Math.max(...data, 100), min = Math.min(...data, 0), range = max - min || 1;
  const path = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  const lastX = width, lastY = height - ((data[data.length-1] - min) / range) * height;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display:'block', width:'100%' }}>
      <path d={`${path} L ${width} ${height} L 0 ${height} Z`} fill={color} fillOpacity="0.08"/>
      <path d={path} fill="none" stroke={color} strokeWidth="1.4"/>
      <circle cx={lastX} cy={lastY} r="3" fill={VITAE.paper} stroke={color} strokeWidth="1.4"/>
    </svg>
  );
}
