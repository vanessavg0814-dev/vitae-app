// Dashboard.jsx â Home, ExercisePlayer, Library, History
// New design: cream bg, teal accent, Aboreto display, Inter UI
import React, { useState, useEffect, useRef } from 'react';
import { V, FONT_DISPLAY, FONT_UI, tierFor, PROGRAM_PALETTES, TAG_TO_PALETTE } from '../lib/tokens';
import { ScreenShell, TopBar, PrimaryButton, VIcon, BreathOrb, VStatRow, VitaeLogo } from './Primitives';
import { Sparkline } from './Visualizations';
import { PERSONAS, EXERCISES } from '../lib/score';

// âââ Shortcut Tile âââââââââââââââââââââââââââââââââââââââ
function ShortcutTile({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: V.tealFog, border: 'none', borderRadius: 12, padding: '18px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
      cursor: 'pointer', transition: 'transform .1s',
    }}>
      <VIcon name={icon} size={18} color={V.teal} />
      <span style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: V.ink, textTransform: 'uppercase' }}>{label}</span>
    </button>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 1. HOME DASHBOARD
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenHome({ persona = 'ada', onStartSession, onTest, onTrend, onLibrary, onDashboard }) {
  const p = PERSONAS[persona];
  const history = p?.history || [];
  const last = history[history.length - 1] || 0;
  const prev = history[history.length - 2] || last;
  const delta = last - prev;
  const tier = tierFor(last);
  const streak = 14;

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <ScreenShell>
      {/* Greeting */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 13, color: V.inkMute }}>{dateStr}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: '0.12em', color: V.ink, textTransform: 'uppercase', marginTop: 4 }}>{greeting}, {p?.name.split(' ')[0] || 'THERE'}.</div>
      </div>

      {/* Score Hero Band (dark card) */}
      <div style={{ background: V.night, borderRadius: 14, padding: '22px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', color: V.teal, textTransform: 'uppercase', marginBottom: 4 }}>VITAE SCORE</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 52, color: V.cream, lineHeight: 1 }}>{last}</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 11, color: delta >= 0 ? V.teal : V.rose }}>
                {delta >= 0 ? 'â' : 'â'} {Math.abs(delta)}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 4 }}>STREAK</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: V.cream }}>{streak}</div>
            <div style={{ fontFamily: FONT_UI, fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>days</div>
          </div>
        </div>
        <Sparkline data={history.slice(-8)} width={310} height={50} color={V.teal} />
      </div>

      {/* Today's Session Card */}
      <div style={{ border: `1.5px solid ${V.inkHair}`, borderRadius: 12, padding: '18px 16px', marginBottom: 20 }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', color: V.teal, textTransform: 'uppercase', marginBottom: 6 }}>DAY {streak} Â· COâ CAPACITY BUILDER</div>
        <div style={{ fontFamily: FONT_UI, fontSize: 15, fontWeight: 500, color: V.ink, marginBottom: 4 }}>Box breathing Â· 4Â·4Â·4Â·4</div>
        <div style={{ fontFamily: FONT_UI, fontSize: 12, color: V.inkMute, marginBottom: 14 }}>8 min Â· 12 rounds</div>
        <PrimaryButton onClick={onStartSession}>Start &nbsp;&rarr;</PrimaryButton>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'COâ HOLD', value: `${p?.basic.co2HoldBestSec || 0}s` },
          { label: 'BREATH RATE', value: `${p?.basic.restingBreathRate || 0} /min` },
          { label: 'RECOVERY', value: `${p?.basic.recoveryTimeSec || 0}s` },
        ].map(s => (
          <div key={s.label} style={{ background: V.tealFog, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: V.ink }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        <ShortcutTile icon="spark" label="New Assessment" onClick={onTest} />
        <ShortcutTile icon="wave" label="Trend" onClick={onTrend} />
        <ShortcutTile icon="leaf" label="Library" onClick={onLibrary} />
        <ShortcutTile icon="pulse" label="My Profile" onClick={onDashboard} />
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <div style={{ fontFamily: FONT_UI, fontSize: 9, color: V.inkMute, letterSpacing: '0.1em' }}>
          Last sync Â· {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} Â· all data on-device
        </div>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 2. EXERCISE PLAYER
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
const PHASE_MS = 4000;
const PHASES = ['INHALE', 'HOLD', 'EXHALE', 'HOLD'];
const SCALES = [1.55, 1.55, 0.70, 0.70];

export function ScreenExercisePlayer({ exercise, onBack, onComplete }) {
  const ex = exercise || EXERCISES[0];
  const palette = PROGRAM_PALETTES[TAG_TO_PALETTE[ex.tag] || 'calm'];
  const [phase, setPhase] = useState(0);
  const [count, setCount] = useState(4);
  const [round, setRound] = useState(1);
  const totalRounds = 12;

  useEffect(() => {
    const t = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhase(p => {
            const next = (p + 1) % 4;
            if (next === 0) setRound(r => r + 1);
            return next;
          });
          return 4;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const orb = SCALES[phase];
  return (
    <ScreenShell dark padded={false} scroll={false}>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', background: V.night }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', zIndex: 3 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="close" size={18} color="rgba(255,255,255,0.5)" /></button>
          <div style={{ fontFamily: FONT_UI, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{ex.name}</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: palette.accent, textTransform: 'uppercase' }}>{palette.name}</div>
        </div>

        {/* Side meta */}
        <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontFamily: FONT_UI, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          04:00 IN Â· 04:00 HOLD Â· 04:00 OUT Â· 04:00 HOLD
        </div>
        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontFamily: FONT_UI, fontSize: 8, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          ROUND {round} / {totalRounds}
        </div>

        {/* Central orb */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 220, height: 220, borderRadius: '50%',
            background: `radial-gradient(circle at 45% 40%, ${palette.center} 0%, transparent 65%)`,
            transform: `scale(${orb})`,
            transition: `transform ${PHASE_MS}ms cubic-bezier(.4,0,.2,1)`,
            filter: 'blur(2px)',
            boxShadow: `0 0 80px 30px ${palette.center}33, 0 0 160px 60px ${palette.center}11`,
          }} />
          <div style={{ marginTop: -80, zIndex: 2, textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', color: palette.accent, textTransform: 'uppercase', marginBottom: 8 }}>{PHASES[phase]}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 64, color: V.cream, lineHeight: 1 }}>{count}</div>
          </div>
        </div>

        {/* Phase pips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
          {PHASES.map((_, i) => (
            <div key={i} style={{ width: 40, height: 3, borderRadius: 2, background: i === phase ? palette.accent : 'rgba(255,255,255,0.15)' }} />
          ))}
        </div>

        {/* Bottom */}
        <div style={{ padding: '12px 24px 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 500, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>HRV Â· 62 ms</div>
          <PrimaryButton dark variant="ghost" onClick={onComplete || onBack}>END SESSION</PrimaryButton>
        </div>
      </div>
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 3. EXERCISE LIBRARY
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenLibrary({ onBack, onPlay }) {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'regulation', 'stability', 'mechanics', 'recovery'];
  const filtered = filter === 'all' ? EXERCISES : EXERCISES.filter(e => e.pillar.toLowerCase() === filter);

  return (
    <ScreenShell>
      <TopBar left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>} title="LIBRARY" />

      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: '0.14em', color: V.ink, textTransform: 'uppercase', marginBottom: 8 }}>Practices.</div>
      <div style={{ fontFamily: FONT_UI, fontSize: 13, color: V.inkMute, lineHeight: 1.5, marginBottom: 20 }}>Six protocols, each targeting a specific pillar of respiratory performance.</div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto' }} className="vitae-scroll">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '7px 14px', borderRadius: 20,
            background: filter === f ? V.ink : 'transparent',
            color: filter === f ? V.cream : V.inkSoft,
            border: filter === f ? 'none' : `1px solid ${V.inkHair}`,
            fontFamily: FONT_UI, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>{f}</button>
        ))}
      </div>

      {/* Exercise list */}
      {filtered.map(ex => {
        const palette = PROGRAM_PALETTES[TAG_TO_PALETTE[ex.tag] || 'calm'];
        return (
          <div key={ex.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: `1px solid ${V.inkHair}` }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: FONT_UI, fontSize: 14, fontWeight: 500, color: V.ink }}>{ex.name}</span>
                {ex.tier === 'advanced' && <span style={{ fontFamily: FONT_UI, fontSize: 8, fontWeight: 600, color: V.gold, letterSpacing: '0.1em', textTransform: 'uppercase', border: `1px solid ${V.gold}`, borderRadius: 4, padding: '1px 5px' }}>ADV</span>}
              </div>
              <div style={{ fontFamily: FONT_UI, fontSize: 11, color: V.inkMute }}>{ex.kind} Â· {ex.duration} Â· {ex.pillar}</div>
            </div>
            <button onClick={() => onPlay(ex)} style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: V.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <VIcon name="play" size={12} color={V.cream} />
            </button>
          </div>
        );
      })}
    </ScreenShell>
  );
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// 4. HISTORY (past assessments)
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
export function ScreenHistory({ persona = 'ada', onBack, onResultTap }) {
  const p = PERSONAS[persona];
  const history = p?.history || [];
  const best = Math.max(...history);
  const avg = Math.round(history.reduce((a, b) => a + b, 0) / history.length);

  return (
    <ScreenShell>
      <TopBar left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>} title="HISTORY" />

      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, letterSpacing: '0.14em', color: V.ink, textTransform: 'uppercase', marginBottom: 20 }}>Every test.</div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
        {[
          { label: 'TESTS', value: history.length },
          { label: 'BEST', value: best },
          { label: 'AVG', value: avg },
        ].map(s => (
          <div key={s.label} style={{ background: V.tealFog, borderRadius: 10, padding: '14px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_UI, fontSize: 8, fontWeight: 600, letterSpacing: '0.14em', color: V.inkMute, textTransform: 'uppercase', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: V.ink }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Sparkline data={history} width={350} height={80} color={V.teal} />

      {/* Session list */}
      <div style={{ marginTop: 20 }}>
        {history.map((score, i) => {
          const tier = tierFor(score);
          const idx = history.length - 1 - i;
          const label = idx === 0 ? 'TODAY' : idx === 1 ? 'LAST WEEK' : `${idx} WEEKS AGO`;
          const date = new Date();
          date.setDate(date.getDate() - idx * 7);
          return (
            <button key={i} onClick={onResultTap} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0',
              background: 'none', border: 'none',
              borderBottom: `1px solid ${V.inkHair}`, textAlign: 'left', cursor: 'pointer',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 12, color: '#fff' }}>{score}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', color: V.inkMute, textTransform: 'uppercase' }}>{label}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 12, color: V.inkSoft }}>{tier.name} Â· {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
              </div>
              <VIcon name="arrow" size={14} color={V.inkMute} />
            </button>
          );
        }).reverse().slice(0, 8)}
      </div>
    </ScreenShell>
  );
}
