// ClientDashboard.jsx â Interactive post-assessment dashboard
// Shows VITAE Score, domain breakdown, journey/progress, next steps
// Designed for client retention: progress tracking, report downloads, re-assessment nudges
import React, { useState, useEffect, useRef } from 'react';
import { V, FONT_DISPLAY, FONT_UI, FONT_MONO, tierFor } from '../lib/tokens';
import { ScreenShell, TopBar, VIcon, PrimaryButton } from './Primitives';

// âââ Sample assessment data (anonymized Neil) ââââââââââââââ
const SAMPLE_DATA = {
  score: 72,
  band: 'Good',
  domains: {
    mechanics:  { score: 88, color: V.teal,  label: 'Mechanics',  desc: 'Lung capacity, airflow, FEV1, PEF' },
    recovery:   { score: 68, color: V.inkSoft, label: 'Recovery',   desc: 'Post-exertion normalisation speed' },
    stability:  { score: 62, color: V.gold,  label: 'Stability',  desc: 'Baseline breathing rate & rhythm' },
    regulation: { score: 54, color: V.gold,  label: 'Regulation', desc: 'COâ tolerance, breathing control, BOLT' },
  },
  lungAge: { chronological: 43, lung: 20 },
  metrics: {
    fev1: { value: 5.20, unit: 'L' },
    pef: { value: 556, unit: 'L/min' },
    bolt: { value: 22, unit: 'sec' },
    etco2: { value: '17â36', unit: 'mmHg' },
    spo2: { value: '96â98', unit: '%' },
    rr: { value: '11â41', unit: 'rpm' },
  },
  assessments: [
    { date: '15 Apr 2026', type: 'Deep Diagnostic', domains: 4, score: 72, ref: 'VTA-0023' },
    { date: '18 Feb 2026', type: 'Mid-Programme Check', domains: 2, score: 65, ref: 'VTA-0018' },
    { date: '10 Jan 2026', type: 'Initial Assessment', domains: 4, score: 60, ref: 'VTA-0009' },
  ],
  boltHistory: [
    { date: 'JAN', value: 22 },
    { date: 'FEB', value: 27 },
    { date: 'APR', value: 31 },
  ],
  scoreHistory: [
    { date: 'JAN 26', value: 60 },
    { date: 'FEB 26', value: 65 },
    { date: 'APR 26', value: 72 },
    { date: 'PROJECTED', value: 79, projected: true },
  ],
};

// âââ Score Ring Component ââââââââââââââââââââââââââââââââ
function ScoreRing({ score, size = 180 }) {
  const r = (size / 2) - 12;
  const circ = 2 * Math.PI * r;
  const [offset, setOffset] = useState(circ);
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const target = (score / 100) * circ;
    const duration = 1200;
    const start = performance.now();
    function animate(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setOffset(circ - ease * target);
      setDisplayScore(Math.round(ease * score));
      if (p < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }, [score]);

  const tier = tierFor(score);
  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={V.creamDim} strokeWidth={5} opacity={0.6} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={V.teal} strokeWidth={5}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
      </svg>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: V.ink, lineHeight: 1 }}>{displayScore}</div>
        <div style={{ fontSize: 11, color: tier.color, fontWeight: 500, marginTop: 2 }}>{tier.name}</div>
      </div>
    </div>
  );
}

// âââ Domain Bar ââââââââââââââââââââââââââââââââââââââââââ
function DomainBar({ label, score, desc, color, animate = true }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animate) setTimeout(() => setWidth(score), 100);
    else setWidth(score);
  }, [score, animate]);

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: V.inkSoft }}>{label}</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color }}>{score}</span>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: V.creamDim, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 2, width: `${width}%`,
          background: `linear-gradient(90deg, ${V.creamDim}, ${color})`,
          transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)'
        }} />
      </div>
      <div style={{ fontSize: 9, color: V.inkMute, marginTop: 3 }}>{desc}</div>
    </div>
  );
}

// âââ Expandable Domain Card ââââââââââââââââââââââââââââââ
function DomainCard({ domain, metrics, isOpportunity = false, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const { label, score, desc, color } = domain;

  const iconBg = score >= 70 ? 'rgba(90,190,170,0.08)' : 'rgba(196,162,88,0.08)';
  return (
    <div onClick={() => setOpen(!open)} style={{
      background: '#fff', borderRadius: 16, padding: 18, marginBottom: 12, cursor: 'pointer',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      border: isOpportunity ? `1px solid ${V.gold}44` : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
          }}>
            <VIcon name="pulse" size={18} color={color} />
            {isOpportunity && <div style={{
              position: 'absolute', top: -3, right: -3, width: 8, height: 8,
              borderRadius: '50%', background: V.gold, border: '2px solid #fff'
            }} />}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: V.ink }}>{label}</div>
            <div style={{ fontSize: 9, color: isOpportunity ? V.gold : V.inkMute, marginTop: 1 }}>
              {isOpportunity ? 'Your biggest opportunity' : desc}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color }}>{score}</span>
          <svg width={12} height={12} viewBox="0 0 12 12"
            style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
            <path d="M3 4.5l3 3 3-3" stroke={V.inkMute} strokeWidth={1.2} fill="none" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${V.inkHair}` }}>
          {metrics && (
            <div style={{ display: 'grid', gridTemplateColumns: metrics.length > 1 ? '1fr 1fr' : '1fr', gap: 10, marginBottom: 12 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ background: V.creamDim, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 8, color: V.inkMute, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{m.label}</div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: V.ink, marginTop: 2 }}>
                    {m.value} <span style={{ fontSize: 10, color: V.inkMute }}>{m.unit}</span>
                  </div>
                  {m.status && <div style={{ fontSize: 9, color: m.statusColor || V.inkMute, marginTop: 2 }}>{m.status}</div>}
                </div>
              ))}
            </div>
          )}
          <p style={{ fontSize: 11, color: V.inkSoft, lineHeight: 1.6 }}>{domain.detail}</p>
        </div>
      )}
    </div>
  );
}

// âââ Insight Tip âââââââââââââââââââââââââââââââââââââââââ
function InsightTip({ icon = 'â¦', title, children }) {
  return (
    <div style={{
      background: V.ink, color: V.cream, borderRadius: 12,
      padding: '14px 16px', margin: '0 0 12px', fontSize: 12, lineHeight: 1.6, position: 'relative'
    }}>
      <div style={{
        position: 'absolute', top: -6, left: 28, width: 12, height: 12,
        background: V.ink, transform: 'rotate(45deg)', borderRadius: 2
      }} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: -2 }}>{icon}</span>
        <div>
          {title && <div style={{ fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(90,190,170,0.6)', marginBottom: 4, fontWeight: 500 }}>{title}</div>}
          {children}
        </div>
      </div>
    </div>
  );
}

// âââ Pill Badge ââââââââââââââââââââââââââââââââââââââââââ
function Pill({ children, color = V.teal, bg }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500,
      background: bg || `${color}11`, color
    }}>{children}</span>
  );
}

// âââ Card wrapper ââââââââââââââââââââââââââââââââââââââââ
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: 18, marginBottom: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)', ...style
    }}>{children}</div>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// MAIN COMPONENT
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function ScreenClientDashboard({ onBack, data = SAMPLE_DATA }) {
  const [tab, setTab] = useState('overview');
  const tabs = ['overview', 'domains', 'journey', 'next step'];

  return (
    <ScreenShell padded={false}>
      {/* âââ Header with orb âââ */}
      <div style={{
        padding: '18px 22px 14px', position: 'relative', overflow: 'hidden',
        background: `linear-gradient(180deg, rgba(90,190,170,0.08) 0%, ${V.cream} 100%)`
      }}>
        {/* Ambient orb */}
        <div style={{
          position: 'absolute', top: -30, right: -20, width: 160, height: 160, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,195,175,0.18) 0%, rgba(90,195,175,0.06) 40%, transparent 70%)',
          animation: 'vitaeBreathSlow 10s ease-in-out infinite'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: "'TopLuxury', 'Aboreto', sans-serif", fontSize: 14, letterSpacing: '0.28em', textTransform: 'uppercase', color: V.ink }}>VITAE</div>
              <div style={{ fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: V.inkMute, marginTop: 2 }}>RESPIRATORY INTELLIGENCE</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 9, color: V.inkMute, letterSpacing: '0.04em' }}>Last assessed</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: V.inkSoft, marginTop: 1 }}>15 APR 2026</div>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: V.ink, lineHeight: 1.2, letterSpacing: '0.05em' }}>Your Respiratory</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: V.teal, lineHeight: 1.2, letterSpacing: '0.05em' }}>Profile</div>
          </div>
          <p style={{ fontSize: 11, color: V.inkMute, marginTop: 8, lineHeight: 1.5 }}>
            Here's what your body is telling us â and what we can do together.
          </p>

          {onBack && (
            <div onClick={onBack} style={{ position: 'absolute', top: 0, left: 0, cursor: 'pointer', padding: 4 }}>
              <VIcon name="back" size={18} color={V.ink} />
            </div>
          )}
        </div>
      </div>

      {/* âââ Tab navigation âââ */}
      <div style={{
        display: 'flex', padding: '0 20px', gap: 0,
        borderBottom: `1px solid ${V.inkHair}`, background: V.cream,
        position: 'sticky', top: 0, zIndex: 10
      }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 0 10px', fontFamily: FONT_UI, fontSize: 10, fontWeight: 500,
            letterSpacing: '0.06em', textTransform: 'uppercase', background: 'none', border: 'none',
            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
            color: tab === t ? V.ink : V.inkMute,
            borderBottom: tab === t ? `2px solid ${V.ink}` : '2px solid transparent'
          }}>{t}</button>
        ))}
      </div>

      {/* âââ OVERVIEW TAB âââ */}
      {tab === 'overview' && (
        <div style={{ padding: '0 20px' }}>
          {/* Score ring */}
          <div style={{ padding: '28px 0 20px', textAlign: 'center' }}>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, letterSpacing: '0.2em', marginBottom: 16 }}>YOUR VITAE SCORE</div>
            <ScoreRing score={data.score} />
            <p style={{ fontSize: 11, color: V.inkMute, marginTop: 12, lineHeight: 1.55, maxWidth: 280, margin: '12px auto 0' }}>
              Above average â with one area that stands out as a clear opportunity for improvement.
            </p>
          </div>

          {/* Domain bars */}
          <Card>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, marginBottom: 14 }}>DOMAIN BREAKDOWN</div>
            {Object.values(data.domains).map(d => (
              <DomainBar key={d.label} label={d.label} score={d.score} desc={d.desc} color={d.color} />
            ))}
          </Card>

          {/* Key insight */}
          <InsightTip title="YOUR KEY INSIGHT">
            Exceptional lung structure paired with a breathing pattern that has room to grow.
            This means your ceiling for improvement is unusually high.
          </InsightTip>

          {/* Lung Age */}
          <Card style={{ textAlign: 'center', padding: '22px 18px' }}>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, marginBottom: 14 }}>LUNG AGE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 12 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: V.inkMute, marginBottom: 4 }}>YOUR AGE</div>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 42, color: V.ink }}>{data.lungAge.chronological}</span>
              </div>
              <VIcon name="arrow" size={20} color={V.inkMute} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: V.teal, marginBottom: 4 }}>LUNG AGE</div>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 42, color: V.teal }}>{data.lungAge.lung}</span>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Pill color={V.teal}>
                <VIcon name="check" size={12} color={V.teal} />
                {data.lungAge.chronological - data.lungAge.lung} years younger
              </Pill>
            </div>
            <p style={{ fontSize: 10, color: V.inkMute, marginTop: 10, lineHeight: 1.5 }}>
              Your lungs perform like someone two decades younger. This is your strongest asset.
            </p>
          </Card>

          {/* Download Report */}
          <div style={{
            background: `linear-gradient(135deg, ${V.ink} 0%, #1a2a30 100%)`,
            borderRadius: 16, padding: 18, marginBottom: 12, color: V.cream
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v14M12 16l-5-5M12 16l5-5" stroke={V.gold} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 20h16" stroke={V.gold} strokeWidth={1.5} strokeLinecap="round" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>Your Full Report</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)', marginTop: 3, lineHeight: 1.4 }}>
                  Deep Diagnostic Â· 15 April 2026 Â· REF {data.assessments[0]?.ref}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button style={{
                  padding: '7px 14px', background: V.gold, color: V.ink, border: 'none', borderRadius: 20,
                  fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                }}>Download PDF</button>
                <button style={{
                  padding: '7px 14px', background: 'transparent', color: V.teal,
                  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
                  fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap'
                }}>Share â</button>
              </div>
            </div>
          </div>

          {/* All Reports */}
          <Card style={{ padding: '14px 18px' }}>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, marginBottom: 12 }}>ALL REPORTS</div>
            {data.assessments.map((a, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: i < data.assessments.length - 1 ? `1px solid ${V.inkHair}` : 'none'
              }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: V.ink }}>{a.type}</div>
                  <div style={{ fontSize: 9, color: V.inkMute, marginTop: 2 }}>
                    {a.date} Â· {a.domains} domain{a.domains !== 1 ? 's' : ''} Â· Score {a.score}
                  </div>
                </div>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                  <path d="M12 2v14M12 16l-4-4M12 16l4-4M4 20h16" stroke={V.teal} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ))}
          </Card>

          <div style={{ height: 16 }} />
        </div>
      )}

      {/* âââ DOMAINS TAB âââ */}
      {tab === 'domains' && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ padding: '22px 0 8px' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: V.ink, letterSpacing: '0.05em' }}>Your Four Domains</div>
            <p style={{ fontSize: 11, color: V.inkMute, marginTop: 6, lineHeight: 1.5 }}>
              Tap each domain to see what the numbers mean for you.
            </p>
          </div>

          <DomainCard
            domain={{ ...data.domains.mechanics, detail: 'Your lung structure is exceptional. FEV1 of 5.20 L puts you at the very top of the range â this is the engine that powers everything else.' }}
            metrics={[
              { label: 'FEV1', value: data.metrics.fev1.value, unit: data.metrics.fev1.unit },
              { label: 'PEF', value: data.metrics.pef.value, unit: data.metrics.pef.unit },
            ]}
          />
          <DomainCard
            domain={{ ...data.domains.recovery, detail: 'Good recovery capacity with room to optimise. How quickly your system returns to baseline after exertion is a strong indicator of overall resilience.' }}
            metrics={[
              { label: 'SPOâ', value: data.metrics.spo2.value, unit: data.metrics.spo2.unit, status: 'Excellent oxygen saturation', statusColor: V.moss },
            ]}
          />
          <DomainCard
            domain={{ ...data.domains.stability, detail: 'Your respiratory rate swings widely â from 11 to 41 rpm. A more stable baseline pattern is associated with better energy regulation and sleep quality.' }}
            metrics={[
              { label: 'RESPIRATORY RATE', value: data.metrics.rr.value, unit: data.metrics.rr.unit, status: 'High variability', statusColor: V.gold },
            ]}
          />
          <DomainCard
            domain={{ ...data.domains.regulation, detail: 'COâ tolerance is the domain with the most room for growth. A BOLT of 22s with ETCOâ never reaching 40 mmHg suggests a pattern where targeted breathing exercises could make a significant difference.' }}
            metrics={[
              { label: 'BOLT', value: data.metrics.bolt.value, unit: data.metrics.bolt.unit, status: 'Moderate', statusColor: V.gold },
              { label: 'ETCOâ', value: data.metrics.etco2.value, unit: data.metrics.etco2.unit, status: 'Below optimal', statusColor: V.gold },
            ]}
            isOpportunity
          />

          <div style={{ height: 16 }} />
        </div>
      )}

      {/* âââ JOURNEY TAB âââ */}
      {tab === 'journey' && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ padding: '22px 0 8px' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: V.ink, letterSpacing: '0.05em' }}>Your Journey</div>
            <p style={{ fontSize: 11, color: V.inkMute, marginTop: 6, lineHeight: 1.5 }}>
              Every assessment adds a chapter. Here's your story so far.
            </p>
          </div>

          {/* Score trend chart */}
          <Card>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, marginBottom: 14 }}>VITAE SCORE TREND</div>
            <div style={{ position: 'relative', height: 140, marginBottom: 8 }}>
              <svg width="100%" height={140} viewBox="0 0 320 140" preserveAspectRatio="none">
                {/* Grid */}
                {[28, 56, 84, 112].map(y => (
                  <line key={y} x1={0} y1={y} x2={320} y2={y} stroke={V.creamDim} strokeWidth={0.5} opacity={0.8} />
                ))}
                {[{y:26,t:'90'},{y:54,t:'75'},{y:82,t:'60'},{y:110,t:'45'}].map(({y,t}) => (
                  <text key={y} x={2} y={y} fontSize={8} fill={V.inkMute} fontFamily="Inter">{t}</text>
                ))}

                {/* Area */}
                <path d="M40,72.8 L120,63 L200,49 L280,35.6 L280,140 L40,140 Z" fill={V.teal} opacity={0.06} />

                {/* Line */}
                <polyline points="40,72.8 120,63 200,49 280,35.6" stroke={V.teal} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />

                {/* Dots + labels */}
                {data.scoreHistory.map((p, i) => {
                  const x = 40 + i * 80;
                  const y = 140 - ((p.value - 30) / 70) * 120;
                  return (
                    <g key={i}>
                      <circle cx={x} cy={y} r={p.projected ? 6 : 5} fill={p.projected ? V.teal : '#fff'} stroke={p.projected ? '#fff' : V.teal} strokeWidth={2} />
                      <text x={x} y={y - 6} textAnchor="middle" fontSize={p.projected ? 11 : 10} fill={p.projected ? V.teal : V.ink} fontFamily="Aboreto" fontWeight={p.projected ? 600 : 500}>{p.value}</text>
                      <text x={x} y={135} textAnchor="middle" fontSize={7} fill={p.projected ? V.teal : V.inkMute} fontFamily="Inter" letterSpacing="0.04em" fontWeight={p.projected ? 600 : 400}>{p.date}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Pill color={V.teal}>
                <svg width={10} height={10} viewBox="0 0 12 12"><path d="M6 9V3M3 5l3-3 3 3" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinecap="round" /></svg>
                +12 points since January
              </Pill>
            </div>
          </Card>

          {/* BOLT trend */}
          <Card>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, marginBottom: 14 }}>BOLT SCORE TREND</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, padding: '0 4px' }}>
              {[...data.boltHistory, { date: 'GOAL', value: 36, goal: true }].map((b, i) => {
                const maxH = 60;
                const h = (b.value / 50) * maxH;
                const isGoal = b.goal;
                const color = b.value < 25 ? V.gold : V.teal;
                return (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ height: maxH, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                      <div style={{
                        width: 32, height: h, borderRadius: '6px 6px 0 0',
                        background: isGoal ? 'transparent' : `linear-gradient(180deg, ${V.creamDim} 0%, ${color} 100%)`,
                        border: isGoal ? `1px dashed ${V.moss}` : 'none',
                        opacity: isGoal ? 0.5 : 1,
                      }} />
                    </div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: isGoal ? V.moss : V.ink, marginTop: 6 }}>
                      {b.value}s{isGoal ? '?' : ''}
                    </div>
                    <div style={{ fontSize: 7, color: isGoal ? V.moss : V.inkMute, marginTop: 2 }}>{b.date}</div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 10, color: V.inkMute, marginTop: 14, textAlign: 'center', lineHeight: 1.5 }}>
              From 22s to 31s in 3 months â crossing into the "Good" range. The next milestone is 40s.
            </p>
          </Card>

          {/* Timeline */}
          <Card>
            <div className="vitae-eyebrow" style={{ color: V.inkMute, fontSize: 8, marginBottom: 16 }}>YOUR ASSESSMENT HISTORY</div>
            {data.assessments.map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', border: `2px solid ${V.teal}`,
                    background: V.teal, flexShrink: 0
                  }} />
                  {i < data.assessments.length - 1 && <div style={{ width: 2, height: 40, background: V.creamDim, flexShrink: 0 }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: V.ink }}>{a.type}</span>
                    <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: V.inkMute }}>{a.date.split(' ').slice(0,2).join(' ').toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: 10, color: V.inkMute, marginTop: 2 }}>
                    {a.domains} domain{a.domains !== 1 ? 's' : ''} Â· Score {a.score}
                  </div>
                </div>
              </div>
            ))}

            {/* Next assessment */}
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', border: `2px dashed ${V.creamDim}`, background: '#fff', flexShrink: 0 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: V.inkMute }}>Next Assessment</span>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: V.teal }}>BOOK NOW</span>
                </div>
                <div style={{ fontSize: 10, color: V.inkMute, marginTop: 2 }}>Recommended: 90 days after last assessment</div>
              </div>
            </div>
          </Card>

          {/* Progress insight */}
          <InsightTip icon="ð">
            Your BOLT improved by <strong>41%</strong> across 3 assessments. Regulation went from 42 to 54.
            At this trajectory, you could cross into the "Good" band (65+) by your next assessment.
          </InsightTip>

          <div style={{ height: 16 }} />
        </div>
      )}

      {/* âââ NEXT STEP TAB âââ */}
      {tab === 'next step' && (
        <div style={{ padding: '0 20px' }}>
          <div style={{ padding: '22px 0 8px' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: V.ink, letterSpacing: '0.05em' }}>What's Next</div>
            <p style={{ fontSize: 11, color: V.inkMute, marginTop: 6, lineHeight: 1.5 }}>
              Based on your data, here's the path with the highest return.
            </p>
          </div>

          {/* Focus */}
          <Card style={{
            border: `1px solid ${V.teal}33`,
            background: `linear-gradient(160deg, #fff 0%, rgba(90,190,170,0.04) 100%)`
          }}>
            <div className="vitae-eyebrow" style={{ color: V.teal, fontSize: 8, marginBottom: 10 }}>RECOMMENDED FOCUS</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: V.ink, lineHeight: 1.2, letterSpacing: '0.04em' }}>
              COâ Tolerance &<br />Pattern Stability
            </div>
            <p style={{ fontSize: 11, color: V.inkSoft, marginTop: 10, lineHeight: 1.6 }}>
              Your mechanics are already exceptional. The highest leverage is in training your breathing pattern â how your body regulates COâ and maintains rhythm throughout the day.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <Pill color={V.teal}>BOLT â 40s target</Pill>
              <Pill color={V.teal}>ETCOâ â 35+ mmHg</Pill>
              <Pill color={V.teal}>Rate variability â</Pill>
            </div>
          </Card>

          {/* Programme */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div className="vitae-eyebrow" style={{ color: V.gold, fontSize: 8, marginBottom: 6 }}>SUGGESTED PROGRAMME</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: V.ink, letterSpacing: '0.04em' }}>Core Programme</div>
                <div style={{ fontSize: 11, color: V.inkMute, marginTop: 4 }}>Breathing Retraining</div>
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: V.ink }}>CHF 1,100</div>
            </div>
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${V.inkHair}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                {[{ n: '6', l: 'Sessions' }, { n: '8', l: 'Weeks' }, { n: '1:1', l: 'Private' }].map(x => (
                  <div key={x.l}>
                    <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: V.ink }}>{x.n}</div>
                    <div style={{ fontSize: 9, color: V.inkMute, marginTop: 2 }}>{x.l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['COâ tolerance', 'Nervous system', 'Diaphragmatic mechanics'].map(t => (
                <span key={t} style={{ fontSize: 9, padding: '4px 10px', background: V.creamDim, borderRadius: 20, color: V.inkSoft }}>{t}</span>
              ))}
            </div>
          </Card>

          {/* Insurance */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', background: 'rgba(106,168,118,0.06)', borderRadius: 12, marginBottom: 12
          }}>
            <VIcon name="check" size={16} color={V.moss} />
            <span style={{ fontSize: 11, color: V.moss, fontWeight: 500 }}>Covered by Swiss supplementary insurance</span>
          </div>

          {/* CTAs */}
          <div style={{ padding: '8px 0 12px' }}>
            <PrimaryButton>Book Your Next Session â</PrimaryButton>
            <div style={{ height: 10 }} />
            <PrimaryButton variant="outline">Schedule a Reassessment</PrimaryButton>
          </div>

          {/* Nudge */}
          <Card style={{ background: V.creamDim }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: V.tealFog,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16
              }}>ð</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 500, color: V.ink, marginBottom: 3 }}>Time for your next chapter?</div>
                <div style={{ fontSize: 11, color: V.inkMute, lineHeight: 1.5 }}>
                  Your last assessment was 15 days ago. We recommend reassessing every 8â12 weeks to track your progress and adjust your protocol.
                </div>
              </div>
            </div>
          </Card>

          {/* Share + footer */}
          <div style={{ textAlign: 'center', padding: '16px 0 24px' }}>
            <div style={{ fontSize: 10, color: V.inkMute, marginBottom: 8 }}>Share your progress</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              {['share', 'print'].map(action => (
                <div key={action} style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer'
                }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    {action === 'share'
                      ? <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke={V.inkMute} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      : <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6z" stroke={V.inkMute} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    }
                  </svg>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${V.inkHair}` }}>
              <div style={{ fontFamily: "'TopLuxury', 'Aboreto', sans-serif", fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase', color: V.inkMute }}>VITAE</div>
              <div style={{ fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', color: V.inkMute, marginTop: 2 }}>RESPIRATORY INTELLIGENCE</div>
              <div style={{ fontSize: 8, color: V.inkMute, marginTop: 6 }}>vitaeclinic.ch</div>
            </div>
          </div>
        </div>
      )}
    </ScreenShell>
  );
}
