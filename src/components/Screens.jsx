// Screens.jsx â Welcome, Assessment (9-screen flow), Result, PillarDetail, Trend, Program
// New design: cream bg, teal accent, Aboreto display, Inter UI
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { V, FONT_DISPLAY, FONT_UI, tierFor } from '../lib/tokens';
import { ScreenShell, TopBar, PrimaryButton, VIcon, BreathOrb, ProgressBar, SectionHeading, VitaeLogo } from './Primitives';
import { VizRing, PillarsQuad, Sparkline } from './Visualizations';
import { PERSONAS } from '../lib/score';

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 1. WELCOME
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenWelcome({ onStart, onSignIn }) {
  const pillars = [
    { icon: 'pulse', title: 'Recovery', desc: 'How your breathing supports rest' },
    { icon: 'wind', title: 'Endurance', desc: 'Your respiratory stamina' },
    { icon: 'wave', title: 'Stress Regulation', desc: 'Breathing patterns under stress' },
    { icon: 'spark', title: 'Focus & Performance', desc: 'Breath control and clarity' },
  ];
  return (
    <ScreenShell padded={false}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px 0' }}>
          <VitaeLogo size="small" />
          {onSignIn && <button onClick={onSignIn} style={{ background: 'none', border: `1.5px solid rgba(26,26,26,0.15)`, borderRadius: 32, padding: '7px 16px', fontFamily: FONT_UI, fontSize: 11, fontWeight: 500, color: V.ink, letterSpacing: '0.04em' }}>Sign In</button>}
        </div>

        {/* Hero */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', color: V.teal, textTransform: 'uppercase', marginBottom: 14 }}>RESPIRATORY PERFORMANCE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 400, letterSpacing: '0.18em', color: V.ink, textTransform: 'uppercase', lineHeight: 1.3 }}>
              DISCOVER YOUR<br />VITAE SCORE
            </div>
          </div>

          <button onClick={onStart} style={{ position: 'relative', width: 200, height: 200, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
            <BreathOrb size={200} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <span style={{ fontFamily: FONT_UI, fontSize: 15, fontWeight: 500, color: V.ink }}>Start</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 8, fontWeight: 600, letterSpacing: '0.16em', color: V.inkMute, marginTop: 4, textTransform: 'uppercase' }}>BEGIN ASSESSMENT</span>
            </div>
          </button>

          <div style={{ fontFamily: FONT_UI, fontSize: 10, color: V.inkMute, letterSpacing: '0.1em', textTransform: 'uppercase' }}>NO EQUIPMENT NEEDED Â· ~7 MINUTES</div>
        </div>

        {/* Pillars grid */}
        <div style={{ padding: '0 24px 24px' }}>
          <div className="vitae-eyebrow" style={{ color: V.inkMute, textAlign: 'center', marginBottom: 16 }}>WHAT WE MEASURE</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {pillars.map(p => (
              <div key={p.title} style={{ background: V.tealFog, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
                <VIcon name={p.icon} size={16} color={V.teal} />
                <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 600, color: V.ink, marginTop: 8 }}>{p.title}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, color: V.inkMute, marginTop: 4, lineHeight: 1.4 }}>{p.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px 28px', textAlign: 'center', borderTop: `1px solid ${V.inkHair}` }}>
          <p style={{ fontSize: 10, color: V.inkMute, fontFamily: FONT_UI, lineHeight: 1.5, margin: 0 }}>
            VITAE is a respiratory performance tool â not medical advice. Covered by Swiss supplementary health insurance.
          </p>
        </div>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 2. MODE SELECT (simplified â now just basic vs full card)
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenMode({ mode, setMode, onContinue, onBack }) {
  return (
    <ScreenShell>
      <TopBar left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} color={V.ink} /></button>} title="ASSESSMENT" />
      <SectionHeading title="CHOOSE YOUR ASSESSMENT" subtitle="How deep do you want to look?" />

      {[
        { id: 'basic', label: 'BASIC', sub: 'LEVEL 1 Â· ~7 MINUTES', desc: 'Breath hold, resting rate, recovery', detail: 'Run anywhere with just your phone' },
        { id: 'full',  label: 'FULL',  sub: 'CLINICAL Â· ~22 MINUTES', desc: 'Adds spirometry & advanced metrics', detail: 'Requires connected device or clinic visit' },
      ].map(opt => (
        <button key={opt.id} onClick={() => setMode(opt.id)} style={{
          width: '100%', textAlign: 'left', padding: '20px', marginBottom: 12,
          background: mode === opt.id ? V.tealFog : 'transparent',
          border: `1.5px solid ${mode === opt.id ? V.teal : V.inkHair}`,
          borderRadius: 12, cursor: 'pointer', transition: 'all .15s',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.16em', color: V.ink }}>{opt.label}</span>
            <span style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: V.teal }}>{opt.sub}</span>
          </div>
          <div style={{ fontFamily: FONT_UI, fontSize: 13, color: V.inkSoft, marginBottom: 4 }}>{opt.desc}</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 11, color: V.inkMute }}>{opt.detail}</div>
        </button>
      ))}

      <div style={{ marginTop: 20 }}>
        <PrimaryButton onClick={onContinue}>Continue &nbsp;&rarr;</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 3. ASSESSMENT TEST â 9-screen flow
// Pre-check â BOLT how-to â BOLT trial 1 â Rest â BOLT trial 2 â
// BOLT complete â Breathing rate â Recovery â Done (â result)
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenTest({ onDone, onBack }) {
  const [phase, setPhase] = useState('precheck'); // precheck | bolt-howto | bolt-1 | rest | bolt-2 | bolt-done | rate | recovery | computing
  const [checks, setChecks] = useState([false, false, false]);
  const [boltTimes, setBoltTimes] = useState([0, 0]);
  const [boltRunning, setBoltRunning] = useState(false);
  const [boltSec, setBoltSec] = useState(0);
  const [restSec, setRestSec] = useState(90);
  const [tapCount, setTapCount] = useState(0);
  const [tapRunning, setTapRunning] = useState(false);
  const [tapSec, setTapSec] = useState(60);
  const [breathRate, setBreathRate] = useState(0);
  const [recoveryRate, setRecoveryRate] = useState(0);
  const timerRef = useRef(null);

  // Cleanup
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ââ BOLT timer logic ââ
  function startBolt() {
    setBoltSec(0);
    setBoltRunning(true);
    timerRef.current = setInterval(() => setBoltSec(s => s + 1), 1000);
  }
  function releaseBolt(trial) {
    clearInterval(timerRef.current);
    setBoltRunning(false);
    setBoltTimes(prev => { const n = [...prev]; n[trial] = boltSec; return n; });
    if (trial === 0) setPhase('rest');
    else setPhase('bolt-done');
  }

  // ââ Rest countdown ââ
  useEffect(() => {
    if (phase !== 'rest') return;
    setRestSec(90);
    const t = setInterval(() => {
      setRestSec(s => {
        if (s <= 1) { clearInterval(t); setPhase('bolt-2'); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  // ââ Tap timer logic ââ
  function handleTap() {
    if (!tapRunning) {
      setTapRunning(true);
      setTapCount(1);
      setTapSec(59);
      timerRef.current = setInterval(() => {
        setTapSec(s => {
          if (s <= 1) {
            clearInterval(timerRef.current);
            setTapRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      setTapCount(c => c + 1);
    }
  }

  // When tap timer finishes
  useEffect(() => {
    if (tapSec === 0 && !tapRunning && tapCount > 0) {
      if (phase === 'rate') {
        setBreathRate(tapCount);
        setTapCount(0);
        setTapSec(60);
      } else if (phase === 'recovery') {
        setRecoveryRate(tapCount);
      }
    }
  }, [tapSec, tapRunning, tapCount, phase]);

  // ââ Finalize and compute ââ
  function finishAssessment() {
    setPhase('computing');
    const bestBolt = Math.max(boltTimes[0], boltTimes[1]);
    setTimeout(() => {
      onDone({
        co2HoldBestSec: bestBolt || 22,
        restingBreathRate: breathRate || 14,
        recoveryTimeSec: recoveryRate > 0 ? Math.round(60 / recoveryRate * 30) : 45,
        exerciseFrequency: 'moderate',
      });
    }, 1500);
  }

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const allChecked = checks.every(Boolean);

  // ââ Render based on phase ââ
  return (
    <ScreenShell padded={false}>
      <div style={{ background: V.cream, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ââ PRE-CHECK ââ */}
        {phase === 'precheck' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div className="vitae-eyebrow" style={{ color: V.inkMute }}>ASSESSMENT</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textAlign: 'right', lineHeight: 1.3, textTransform: 'uppercase' }}>~ 7<br/>MIN</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 28px', overflow: 'auto' }}>
            <div style={{ textAlign: 'center', margin: '32px 0 8px' }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', color: V.teal, textTransform: 'uppercase', marginBottom: 10 }}>LEVEL 1 &middot; NO HARDWARE NEEDED</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: '0.2em', color: '#333', textTransform: 'uppercase', lineHeight: 1.4 }}>BASIC<br/>RESPIRATORY<br/>CHECK</div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: V.inkMute, lineHeight: 1.55 }}>Three simple tests will measure your breathing fitness. It takes about 7 minutes.</div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: V.ink, textTransform: 'uppercase', marginBottom: 12 }}>FOR BEST RESULTS</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#888', lineHeight: 1.8 }}>
                <span style={{ color: V.teal, marginRight: 8 }}>&bull;</span>Wait 1 hour after eating<br/>
                <span style={{ color: V.teal, marginRight: 8 }}>&bull;</span>Avoid caffeine 2 hours prior<br/>
                <span style={{ color: V.teal, marginRight: 8 }}>&bull;</span>Take the test in a calm, rested state<br/>
                <span style={{ color: V.teal, marginRight: 8 }}>&bull;</span>Breathe normally through your nose for 1 minute before starting
              </div>
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', color: V.ink, textTransform: 'uppercase', marginBottom: 12 }}>WHAT YOU'LL DO</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[{ name: 'Breath Hold', time: '~3 min' }, { name: 'Breathing Rate', time: '~1 min' }, { name: 'Recovery Test', time: '~3 min' }].map(t => (
                  <div key={t.name} style={{ flex: 1, background: V.tealFog, borderRadius: 10, padding: '14px 12px', textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 600, color: V.ink, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontFamily: FONT_UI, fontSize: 11, color: V.inkMute }}>{t.time}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${V.inkHair}`, paddingTop: 16, marginBottom: 8 }}>
              {['No recent flu / illness (last 7 days)', 'No acute respiratory symptoms', 'No caffeine (last 2h)'].map((label, i) => (
                <div key={i} onClick={() => setChecks(c => { const n = [...c]; n[i] = !n[i]; return n; })} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: i < 2 ? `1px solid ${V.inkHair}` : 'none', cursor: 'pointer' }}>
                  <div style={{ width: 22, height: 22, border: `1.5px solid ${checks[i] ? V.teal : '#c8c5c0'}`, borderRadius: 6, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checks[i] ? V.teal : 'transparent', transition: 'all .15s' }}>
                    {checks[i] && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>&check;</span>}
                  </div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 14, color: '#666', lineHeight: 1.45 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '12px 24px 28px', display: 'flex', gap: 10 }}>
            <PrimaryButton variant="ghost" full={false} style={{ flex: 1 }} onClick={onBack}>Cancel</PrimaryButton>
            <PrimaryButton full={false} style={{ flex: 1 }} disabled={!allChecked} onClick={() => setPhase('bolt-howto')}>Next &nbsp;&rarr;</PrimaryButton>
          </div>
        </>)}

        {/* ââ BOLT HOW-TO ââ */}
        {phase === 'bolt-howto' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>01 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textAlign: 'right', lineHeight: 1.3, textTransform: 'uppercase' }}>BOLT<br/>TEST</div>
          </div>
          <ProgressBar current={0} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 28px' }}>
            <SectionHeading title="BREATH HOLD TEST" />
            <div style={{ marginBottom: 24 }}>
              {[
                'Sit upright â relax for 30 seconds',
                'Take 5 normal breaths through your nose',
                'Exhale normally, then close your mouth and pinch your nose',
                'Press Start â stop when you feel the first urge to breathe',
                'Rest 90 seconds â then do it again',
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, color: '#c8c5c0', minWidth: 20 }}>{i + 1}</div>
                  <div style={{ fontFamily: FONT_UI, fontSize: 14, color: '#888', lineHeight: 1.5 }}>{step}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(200,170,60,0.08)', borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 14 }}>&#x26A0;&#xFE0F;</span>
              <div style={{ fontFamily: FONT_UI, fontSize: 12, color: '#888', lineHeight: 1.55 }}>Keep your mouth closed during the hold. Stop at the first urge â don't push to your maximum.</div>
            </div>
          </div>
          <div style={{ padding: '0 24px 28px' }}>
            <PrimaryButton onClick={() => { setBoltSec(0); setPhase('bolt-1'); }}>I'm ready &nbsp;&rarr;</PrimaryButton>
          </div>
        </>)}

        {/* ââ BOLT TRIAL 1 ââ */}
        {phase === 'bolt-1' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>01 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase' }}>TRIAL 1</div>
          </div>
          <ProgressBar current={0} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <BreathOrb size={280} paused={!boltRunning} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: V.teal, textTransform: 'uppercase' }}>HOLD TIME</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 90, fontWeight: 400, color: V.ink, lineHeight: 1 }}>{boltSec}s</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', color: V.teal, marginTop: 6, textTransform: 'uppercase' }}>
                  {boltRunning ? 'HOLDING...' : boltSec > 0 ? `${boltSec} SECONDS` : 'TAP TO START'}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 24px 8px' }}>
            {!boltRunning && boltSec === 0 && <PrimaryButton onClick={startBolt}>Start</PrimaryButton>}
            {boltRunning && <PrimaryButton variant="ghost" onClick={() => releaseBolt(0)}>Release</PrimaryButton>}
            <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#aaa', padding: '14px 4px 0', lineHeight: 1.55 }}>
              Take a normal breath out â don't empty your lungs completely. Then hold.
            </div>
          </div>
          <div style={{ height: 16 }} />
        </>)}

        {/* ââ REST ââ */}
        {phase === 'rest' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>01 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase' }}>REST</div>
          </div>
          <ProgressBar current={0} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: V.teal, textTransform: 'uppercase', marginBottom: 6 }}>TRIAL 1 COMPLETE</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: V.ink }}>{boltTimes[0]}s</div>
            </div>
            <div style={{ width: 40, height: 1, background: V.inkHair, marginBottom: 40 }} />
            <div style={{ position: 'relative', width: 200, height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <BreathOrb size={200} paused />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: V.teal, textTransform: 'uppercase' }}>REST</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, color: V.teal, lineHeight: 1 }}>{fmt(restSec)}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', color: V.teal, marginTop: 6, textTransform: 'uppercase' }}>REMAINING</div>
              </div>
            </div>
            <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#aaa', textAlign: 'center', padding: '24px 36px 0', lineHeight: 1.5 }}>Breathe normally. Trial 2 will start automatically when the rest is over.</div>
          </div>
        </>)}

        {/* ââ BOLT TRIAL 2 ââ */}
        {phase === 'bolt-2' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>01 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase' }}>TRIAL 2</div>
          </div>
          <ProgressBar current={0} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 280, height: 280, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <BreathOrb size={280} paused={!boltRunning} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: V.teal, textTransform: 'uppercase' }}>HOLD TIME</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 90, fontWeight: 400, color: V.ink, lineHeight: 1 }}>{boltSec}s</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', color: V.teal, marginTop: 6, textTransform: 'uppercase' }}>
                  {boltRunning ? 'HOLDING...' : boltSec > 0 ? `${boltSec} SECONDS` : 'TAP TO START'}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 24px 8px' }}>
            {!boltRunning && boltSec === 0 && <PrimaryButton onClick={() => { setBoltSec(0); startBolt(); }}>Start</PrimaryButton>}
            {boltRunning && <PrimaryButton variant="ghost" onClick={() => releaseBolt(1)}>Release</PrimaryButton>}
            <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#aaa', padding: '14px 4px 0', lineHeight: 1.55 }}>Same as before. Exhale normally, hold, and stop at the first urge.</div>
          </div>
          <div style={{ height: 16 }} />
        </>)}

        {/* ââ BOLT COMPLETE ââ */}
        {phase === 'bolt-done' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>01 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase' }}>COMPLETE</div>
          </div>
          <ProgressBar current={1} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 36px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${V.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
              <VIcon name="check" size={24} color={V.teal} />
            </div>
            <div className="vitae-eyebrow" style={{ color: V.teal, marginBottom: 8 }}>BOLT SCORE</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 48, color: V.ink, marginBottom: 4 }}>{Math.max(boltTimes[0], boltTimes[1])}s</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', color: '#aaa', textTransform: 'uppercase', marginBottom: 16 }}>BEST OF 2 TRIALS</div>
            <div style={{ display: 'flex', gap: 20, marginBottom: 48 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 500, color: '#ccc', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>TRIAL 1</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: '#aaa' }}>{boltTimes[0]}s</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 500, color: '#ccc', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>TRIAL 2</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: '#aaa' }}>{boltTimes[1]}s</div>
              </div>
            </div>
            <div style={{ width: 40, height: 1, background: V.inkHair, marginBottom: 48 }} />
            <div className="vitae-eyebrow" style={{ color: V.inkMute, marginBottom: 10 }}>NEXT</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, letterSpacing: '0.18em', color: '#333', textTransform: 'uppercase', marginBottom: 10 }}>BREATHING RATE</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#aaa', textAlign: 'center', lineHeight: 1.5 }}>Tap on each inhale for 60 seconds while breathing normally.</div>
          </div>
          <div style={{ padding: '0 24px 28px' }}>
            <PrimaryButton onClick={() => { setTapCount(0); setTapSec(60); setTapRunning(false); setPhase('rate'); }}>Continue &nbsp;&rarr;</PrimaryButton>
          </div>
        </>)}

        {/* ââ BREATHING RATE ââ */}
        {phase === 'rate' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>02 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase' }}>BREATH<br/>RATE</div>
          </div>
          <ProgressBar current={1} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <BreathOrb size={260} paused={!tapRunning} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <div className="vitae-eyebrow" style={{ color: V.teal }}>{tapSec === 0 ? 'COMPLETE' : 'TAPS Â· INHALES'}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 90, color: V.ink, lineHeight: 1 }}>{tapCount}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', color: V.teal, marginTop: 6, textTransform: 'uppercase' }}>
                  {tapSec > 0 ? `0:${tapSec.toString().padStart(2, '0')} REMAINING` : `${tapCount} BREATHS / MIN`}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 24px 8px' }}>
            {tapSec > 0 && <PrimaryButton onClick={handleTap}>TAP ON INHALE</PrimaryButton>}
            {tapSec === 0 && <PrimaryButton onClick={() => { setTapCount(0); setTapSec(60); setTapRunning(false); setPhase('recovery'); }}>Next &nbsp;&rarr;</PrimaryButton>}
            <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#aaa', padding: '14px 4px 0', lineHeight: 1.55 }}>
              {tapSec > 0 ? 'Breathe normally. Tap once each time you start to inhale.' : `Breathing rate: ${tapCount} breaths/min. One more test to go.`}
            </div>
          </div>
          <div style={{ height: 16 }} />
        </>)}

        {/* ââ RECOVERY ââ */}
        {phase === 'recovery' && (<>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px 0' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, fontWeight: 300, color: V.ink }}>&times;</button>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', color: V.inkMute }}>03 / 03</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase' }}>RECOVERY</div>
          </div>
          <ProgressBar current={2} total={3} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 260, height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <BreathOrb size={260} paused={!tapRunning} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                <div className="vitae-eyebrow" style={{ color: V.teal }}>{tapSec === 0 ? 'COMPLETE' : 'BREATHS Â· RETURNING'}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 90, color: V.ink, lineHeight: 1 }}>{tapCount}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.14em', color: V.teal, marginTop: 6, textTransform: 'uppercase' }}>
                  {tapSec > 0 ? `0:${tapSec.toString().padStart(2, '0')} REMAINING` : `${tapCount} BREATHS / MIN`}
                </div>
              </div>
            </div>
          </div>
          <div style={{ padding: '0 24px 8px' }}>
            {tapSec > 0 && <PrimaryButton onClick={handleTap}>TAP ON INHALE</PrimaryButton>}
            {tapSec === 0 && <PrimaryButton onClick={finishAssessment}>See Results &nbsp;&rarr;</PrimaryButton>}
            <div style={{ fontFamily: FONT_UI, fontSize: 13, color: '#aaa', padding: '14px 4px 0', lineHeight: 1.55 }}>
              {tapSec > 0 ? 'Let your breath find its own rhythm. Just keep tapping.' : `Recovery rate: ${tapCount} breaths/min. All done!`}
            </div>
          </div>
          <div style={{ height: 16 }} />
        </>)}

        {/* ââ COMPUTING ââ */}
        {phase === 'computing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <BreathOrb size={200} />
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, letterSpacing: '0.2em', color: V.ink, textTransform: 'uppercase', marginTop: 20 }}>COMPUTING</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 12, color: V.inkMute, marginTop: 8, animation: 'vitaePulse 1.5s ease-in-out infinite' }}>Calculating your VITAE Score...</div>
          </div>
        )}
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 4. RESULT
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenResult({ result, viz, onPillarTap, onProgram, onTrend, onBack }) {
  const tier = tierFor(result.risComposite);
  const ris = result.risComposite;
  const dashLen = 553;
  const dashOff = dashLen - (dashLen * ris / 100);

  return (
    <ScreenShell>
      <TopBar
        left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>}
        title="RESULTS"
      />
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.28em', color: '#aaa', textTransform: 'uppercase' }}>YOUR</div>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.22em', color: '#333', textTransform: 'uppercase' }}>VITAE SCORE</div>
      </div>

      {/* Score Ring */}
      <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto 8px' }}>
        <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="88" fill="none" stroke={V.creamDim} strokeWidth="3" />
          <circle cx="100" cy="100" r="88" fill="none" stroke={tier.color} strokeWidth="3" strokeLinecap="round" strokeDasharray={dashLen} strokeDashoffset={dashOff} />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, color: V.ink, lineHeight: 1 }}>{ris}</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: '#aaa', textTransform: 'uppercase', marginTop: 2 }}>OUT OF 100</div>
        </div>
      </div>

      {/* Band label */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span style={{ display: 'inline-block', fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: tier.color, textTransform: 'uppercase', padding: '6px 16px', border: `1.5px solid ${tier.color}`, borderRadius: 20 }}>{tier.short}</span>
      </div>

      {/* Measurements */}
      <div style={{ borderTop: `1px solid ${V.inkHair}` }}>
        {[
          { label: 'BOLT SCORE', sub: 'COâ tolerance', value: `${result.regulationScore > 0 ? Math.round(result.regulationScore / 95 * 60) : 22}s` },
          { label: 'BREATH RATE', sub: 'Resting breaths per minute', value: result.stabilityScore ? Math.round(100 - result.stabilityScore + 8) : '14' },
          { label: 'RECOVERY', sub: 'Post-hold breath rate', value: result.recoveryScore ? Math.round(100 - result.recoveryScore + 10) : '16' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: i < 2 ? `1px solid ${V.inkHair}` : 'none' }}>
            <div>
              <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: V.ink, textTransform: 'uppercase', marginBottom: 3 }}>{r.label}</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 12, color: '#aaa' }}>{r.sub}</div>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: V.ink }}>{r.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <PrimaryButton onClick={onProgram}>Book Deep Diagnostic &nbsp;&rarr;</PrimaryButton>
        <div style={{ marginTop: 12 }}>
          <PrimaryButton variant="ghost" onClick={onBack}>Retake Assessment</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 5. PILLAR DETAIL
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenPillarDetail({ result, onBack }) {
  const pillars = [
    { name: 'Regulation', score: result.regulationScore, desc: 'COâ tolerance and breathing control', color: V.teal },
    { name: 'Stability', score: result.stabilityScore, desc: 'Baseline breathing pattern and rate', color: V.gold },
    { name: 'Recovery', score: result.recoveryScore, desc: 'Post-exertion normalisation speed', color: V.moss },
    { name: 'Mechanics', score: result.mechanicalScore, desc: 'Lung capacity and airflow metrics', color: '#7B68EE' },
  ];
  return (
    <ScreenShell>
      <TopBar left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>} title="PILLARS" />
      <SectionHeading title="THE FOUR PILLARS" subtitle="Your respiratory performance broken down into four clinical domains." />
      {pillars.map((p, i) => (
        <div key={i} style={{ padding: '20px 0', borderBottom: i < 3 ? `1px solid ${V.inkHair}` : 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', color: V.ink, textTransform: 'uppercase' }}>{p.name}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: V.ink }}>{p.score != null ? Math.round(p.score) : 'â'}</div>
          </div>
          <div style={{ height: 3, background: V.creamDim, borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', width: `${Math.max(2, p.score || 0)}%`, background: p.color, borderRadius: 2, transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontFamily: FONT_UI, fontSize: 12, color: V.inkMute, lineHeight: 1.4 }}>{p.desc}</div>
        </div>
      ))}
      <div style={{ marginTop: 24 }}>
        <PrimaryButton onClick={onBack}>Back to Results</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 6. TREND (12-week trajectory)
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenTrend({ persona, onBack }) {
  const p = PERSONAS[persona];
  const history = p?.history || [];
  const last = history[history.length - 1] || 0;
  const first = history[0] || 0;
  const delta = last - first;

  return (
    <ScreenShell>
      <TopBar left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>} title="TREND" />
      <SectionHeading title="YOUR TRAJECTORY" subtitle="12-week VITAE Score progression" />

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, color: V.ink, lineHeight: 1 }}>{last}</div>
        <div style={{ fontFamily: FONT_UI, fontSize: 12, color: delta >= 0 ? V.teal : V.rose, marginTop: 4 }}>
          {delta >= 0 ? 'â' : 'â'} {Math.abs(delta)} pts from 12 weeks ago
        </div>
      </div>

      <Sparkline data={history} width={350} height={80} color={V.teal} />

      <div style={{ marginTop: 24 }}>
        {history.map((score, i) => {
          const tier = tierFor(score);
          const label = i === history.length - 1 ? 'TODAY' : i === history.length - 2 ? 'LAST WEEK' : `${(history.length - 1 - i)} WEEKS AGO`;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${V.inkHair}` }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: tier.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: V.inkMute, textTransform: 'uppercase' }}>{label}</div>
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: V.ink }}>{score}</div>
            </div>
          );
        }).reverse().slice(0, 6)}
      </div>

      <div style={{ marginTop: 24 }}>
        <PrimaryButton variant="ghost" onClick={onBack}>Back</PrimaryButton>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 7. RECOMMENDED PROGRAMME
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenProgram({ result, onBack }) {
  const rec = result?.recommendation || {};
  const weeks = [
    { num: '01', name: 'Discovery', time: '5 min/day', sessions: 7, done: true },
    { num: '02', name: 'Capacity Build', time: '8 min/day', sessions: 7, active: true },
    { num: '03', name: 'Tolerance', time: '12 min/day', sessions: 7 },
    { num: '04', name: 'Integration', time: '10 min/day', sessions: 7 },
  ];
  return (
    <ScreenShell>
      <TopBar left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>} title="PROGRAMME" />

      {/* Hero card */}
      <div style={{ background: V.night, borderRadius: 12, padding: '24px 20px', marginBottom: 24 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', color: V.teal, textTransform: 'uppercase', marginBottom: 8 }}>WEAKEST PILLAR Â· {rec.weakestPillar || 'REGULATION'}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, letterSpacing: '0.14em', color: V.cream, textTransform: 'uppercase', marginBottom: 16 }}>{rec.program || 'COâ CAPACITY BUILDER'}</div>
        <div style={{ display: 'flex', gap: 20 }}>
          <div><div style={{ fontFamily: FONT_UI, fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DURATION</div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: V.cream }}>{rec.duration || '6 weeks'}</div></div>
          <div><div style={{ fontFamily: FONT_UI, fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>EST. UPLIFT</div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: V.teal }}>+12 pts</div></div>
          <div><div style={{ fontFamily: FONT_UI, fontSize: 9, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>DAILY</div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: V.cream }}>8 min</div></div>
        </div>
      </div>

      <div className="vitae-eyebrow" style={{ color: V.inkMute, marginBottom: 16 }}>THE ARC</div>
      {weeks.map((w, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16, opacity: w.done ? 0.5 : 1 }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 14, color: w.active ? V.teal : V.inkMute, minWidth: 24 }}>{w.num}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 500, color: V.ink }}>{w.name}</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 11, color: V.inkMute }}>{w.time} Â· {w.sessions} sessions</div>
          </div>
          {w.done && <VIcon name="check" size={16} color={V.teal} />}
          {w.active && <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, color: V.teal, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '2px 8px', border: `1px solid ${V.teal}`, borderRadius: 10 }}>ACTIVE</div>}
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <PrimaryButton>Begin today's session &nbsp;&rarr;</PrimaryButton>
      </div>
    </ScreenShell>
  );
}
