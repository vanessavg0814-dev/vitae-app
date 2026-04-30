// Clinician.jsx â desktop dashboard for clinicians reviewing a patient
import React from 'react';
import { VITAE, FONT_UI, FONT_DISPLAY, tierFor } from '../lib/tokens';
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_NUM = FONT_DISPLAY;
import { PERSONAS, computeFor } from '../lib/score';
import { BreathOrb, VIcon } from './Primitives';
import { VizRing, PillarsQuad, Sparkline } from './Visualizations';

function clinicianHeadline(r) {
  if (r.tier === 'Elite Respiratory Performance') return 'Outstanding respiratory profile across all pillars.';
  if (r.tier === 'High Efficiency') return 'A well-regulated system with one trainable weakness.';
  if (r.tier === 'Moderate Efficiency') return 'Functional baseline; COâ tolerance limits performance.';
  if (r.tier === 'Low Efficiency') return 'Multiple pillars under reference; structured intervention indicated.';
  return 'Markers consistent with dysfunctional breathing pattern.';
}

function clinicianBody(r) {
  return `Composite RIS of ${r.risComposite} places this patient in the ${r.tier.toLowerCase()} band. The weakest pillar is ${r.recommendation.weakestPillar.toLowerCase()}, and the recommended ${r.recommendation.duration} program targets that directly.`;
}

export function ClinicianView({ persona = 'noah', mode = 'full' }) {
  const p = PERSONAS[persona];
  const result = computeFor(persona, mode);
  const t = tierFor(result.risComposite);
  return (
    <div style={{
      width: '100%', height: '100vh', background: VITAE.paper, color: VITAE.ink,
      fontFamily: FONT_UI, display:'grid', gridTemplateColumns: '220px 1fr 320px',
      overflow: 'hidden',
    }}>
      {/* sidebar */}
      <aside style={{ borderRight: `1px solid ${VITAE.inkHair}`, padding: '20px 18px', display:'flex', flexDirection:'column', gap: 18, overflowY:'auto' }}>
        <div className="vitae-eyebrow" style={{ color: VITAE.ink, letterSpacing: '0.18em' }}>VITAE Â· RESPIRATORY INTELLIGENCE</div>
        <div style={{ marginTop: 4 }}>
          <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 10 }}>Practice</div>
          {['Today\'s patients Â· 12', 'Awaiting review Â· 3', 'Programs running Â· 47', 'Retests due Â· 8'].map((x, i) => (
            <div key={x} style={{ display:'flex', justifyContent:'space-between', padding: '8px 0', borderBottom: `1px solid ${VITAE.inkHair}`, fontSize: 12, color: i === 1 ? VITAE.ink : VITAE.inkSoft }}>
              <span>{x.split('Â·')[0]}</span>
              <span className="vitae-num">{x.split('Â·')[1]}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 10 }}>Recent</div>
          {Object.entries(PERSONAS).map(([k, v]) => {
            const active = k === persona;
            const last = v.history[v.history.length - 1];
            const tt = tierFor(last);
            return (
              <div key={k} style={{ display:'flex', alignItems:'center', gap: 10, padding: '10px 0', opacity: active ? 1 : 0.6, cursor:'pointer' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: tt.color }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: active ? 600 : 400 }}>{v.name}</div>
                  <div style={{ fontSize: 10, color: VITAE.inkMute, fontFamily: FONT_MONO }}>{v.age}{v.sex} Â· {v.height}cm</div>
                </div>
                <span className="vitae-num" style={{ fontSize: 14, color: tt.ink }}>{last}</span>
              </div>
            );
          })}
        </div>
      </aside>

      {/* main */}
      <main style={{ padding: '24px 36px', overflowY: 'auto' }} className="vitae-scroll">
        {/* header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', borderBottom: `1px solid ${VITAE.inkHair}`, paddingBottom: 18, flexWrap:'wrap', gap: 12 }}>
          <div>
            <div className="vitae-eyebrow" style={{ color: VITAE.inkMute }}>PATIENT Â· {p.age}{p.sex} Â· {p.height}cm Â· session #2861</div>
            <h1 className="vitae-display" style={{ fontSize: 48, lineHeight: 1, margin: '8px 0 0', color: VITAE.ink }}>{p.name}.</h1>
          </div>
          <div style={{ display:'flex', gap: 8, flexWrap:'wrap' }}>
            {['Print', 'Annotate', 'Send to patient'].map(b => (
              <button key={b} style={{
                fontFamily: FONT_UI, fontSize: 12, padding: '8px 14px', border: `1px solid ${VITAE.inkHair}`, background: VITAE.paper,
                cursor:'pointer', color: VITAE.ink, borderRadius: 999,
              }}>{b}</button>
            ))}
            <button style={{
              fontFamily: FONT_UI, fontSize: 12, padding: '8px 14px', background: VITAE.ink, color: VITAE.paper,
              border:'none', cursor:'pointer', borderRadius: 999,
            }}>Open program</button>
          </div>
        </div>

        {/* hero row: ring + interpretation + stat cards */}
        <div style={{ display:'grid', gridTemplateColumns: '320px 1fr', gap: 36, marginTop: 28 }}>
          <VizRing score={result.risComposite} size={300}/>
          <div>
            <div className="vitae-eyebrow" style={{ color: t.ink }}>{t.name.toUpperCase()}</div>
            <h2 className="vitae-display" style={{ fontSize: 30, lineHeight: 1.2, margin: '6px 0 14px', textWrap:'pretty', maxWidth: 540 }}>
              {clinicianHeadline(result)}
            </h2>
            <p style={{ fontSize: 13, color: VITAE.inkSoft, lineHeight: 1.6, maxWidth: 520 }}>
              {clinicianBody(result)}
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap: 0, marginTop: 22, borderTop: `1px solid ${VITAE.inkHair}`, borderBottom: `1px solid ${VITAE.inkHair}` }}>
              {[
                { k: 'COâ HOLD', v: p.full.co2HoldBestSec + 's', ref: 'â¥40s' },
                { k: 'FEV1 %PRED', v: p.full.fev1PctPred, ref: 'â¥80' },
                { k: 'FEV1/FVC', v: p.full.fev1FvcRatio.toFixed(2), ref: 'â¥0.75' },
                { k: 'EtCOâ', v: p.full.etco2Mean + ' mmHg', ref: '35â42' },
              ].map(x => (
                <div key={x.k} style={{ padding: '14px 0', borderRight: `1px solid ${VITAE.inkHair}`, paddingRight: 16 }}>
                  <div className="vitae-eyebrow" style={{ color: VITAE.inkMute }}>{x.k}</div>
                  <div className="vitae-num" style={{ fontSize: 22, color: VITAE.ink, marginTop: 4 }}>{x.v}</div>
                  <div className="vitae-num" style={{ fontSize: 10, color: VITAE.inkMute, marginTop: 2 }}>ref Â· {x.ref}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* pillars + trend */}
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap: 28, marginTop: 36 }}>
          <div>
            <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 12 }}>The four pillars</div>
            <PillarsQuad result={result} compact={false}/>
          </div>
          <div>
            <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 12 }}>12-week trajectory</div>
            <div style={{ border: `1px solid ${VITAE.inkHair}`, padding: 18, background: VITAE.paper }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span className="vitae-numeric" style={{ fontSize: 30 }}>{p.history[p.history.length-1]}</span>
                <span className="vitae-num" style={{ fontSize: 11, color: 'oklch(50% 0.10 150)' }}>â {p.history[p.history.length-1] - p.history[0]} since baseline</span>
              </div>
              <Sparkline data={p.history} width={400} height={90}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8, fontFamily: FONT_MONO, fontSize: 9, color: VITAE.inkMute, letterSpacing:'0.06em' }}>
                <span>WK 01</span><span>WK 06</span><span>NOW</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* right rail â recommendation */}
      <aside style={{ borderLeft: `1px solid ${VITAE.inkHair}`, padding: '24px 24px', background: VITAE.paperDim, overflowY: 'auto' }} className="vitae-scroll">
        <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 8 }}>Recommended program</div>
        <div style={{ background: VITAE.ink, color: VITAE.paper, padding: 22, position:'relative', overflow:'hidden', marginBottom: 20 }}>
          <div style={{ position:'absolute', right:-50, bottom:-50 }}><BreathOrb size={150} color={t.color}/></div>
          <div style={{ position:'relative' }}>
            <div className="vitae-eyebrow" style={{ color: t.color }}>{result.recommendation.weakestPillar.toUpperCase()}</div>
            <h3 className="vitae-display" style={{ fontSize: 26, lineHeight: 1.1, margin:'8px 0', textWrap:'pretty' }}>
              {result.recommendation.program}.
            </h3>
            <div className="vitae-num" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{result.recommendation.duration} Â· 8 min/day</div>
          </div>
        </div>

        <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 8 }}>Clinical notes</div>
        <textarea readOnly value={`Patient presents with ${result.tier.toLowerCase()}. COâ tolerance is the limiting factor â recommend 6-week capacity builder. Spirometry within reference. EtCOâ trending hypocapnic; consider breathing-pattern disorder workup if symptomatic.`}
          style={{
            width:'100%', minHeight: 130, fontFamily: FONT_UI, fontSize: 12, lineHeight: 1.5,
            color: VITAE.ink, background: VITAE.paper, padding: 14, border: `1px solid ${VITAE.inkHair}`,
            resize:'none', borderRadius: 0, boxSizing:'border-box',
          }}/>

        <div className="vitae-eyebrow" style={{ color: VITAE.inkMute, marginBottom: 8, marginTop: 18 }}>Retest schedule</div>
        {[
          { d: 'In 14 days', n: 'Mid-program', state:'scheduled' },
          { d: 'In 42 days', n: 'Program close', state:'pending' },
          { d: 'In 84 days', n: 'Quarterly retest', state:'pending' },
        ].map(r => (
          <div key={r.d} style={{ display:'flex', justifyContent:'space-between', padding: '10px 0', borderBottom: `1px solid ${VITAE.inkHair}` }}>
            <div>
              <div style={{ fontSize: 12, color: VITAE.ink }}>{r.n}</div>
              <div className="vitae-num" style={{ fontSize: 10, color: VITAE.inkMute, marginTop: 2 }}>{r.d}</div>
            </div>
            <span className="vitae-eyebrow" style={{ color: r.state === 'scheduled' ? VITAE.cyanDeep : VITAE.inkMute }}>{r.state}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}
