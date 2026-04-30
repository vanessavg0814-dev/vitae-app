// Primitives.jsx — shared UI primitives for VITAE new design
// Cream bg · teal accent · Aboreto display · Inter UI · pill buttons
import React from 'react';
import { V, FONT_DISPLAY, FONT_UI } from '../lib/tokens';

// ─── Breath Orb (teal glow) ─────────────────────────────
export function BreathOrb({ size = 260, color = V.teal, paused = false, style = {} }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, ...style }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        background: `radial-gradient(circle, rgba(90,195,175,0.15) 0%, rgba(90,195,175,0.07) 35%, rgba(90,195,175,0.02) 55%, transparent 70%)`,
        animation: paused ? 'none' : 'vitaeBreathSlow 10s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute', inset: '25%', borderRadius: '50%',
        background: `radial-gradient(circle, rgba(90,195,175,0.22) 0%, rgba(90,195,175,0.08) 50%, transparent 70%)`,
        filter: 'blur(8px)', opacity: 0.7,
        animation: paused ? 'none' : 'vitaeBreath 6s ease-in-out infinite'
      }} />
    </div>
  );
}

// ─── Icon system ─────────────────────────────────────────
export function VIcon({ name, size = 16, color = 'currentColor' }) {
  const s = size;
  const stroke = { stroke: color, strokeWidth: 1.4, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'arrow':  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M3 8h10M9 4l4 4-4 4" {...stroke} /></svg>;
    case 'back':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M13 8H3M7 4 3 8l4 4" {...stroke} /></svg>;
    case 'wind':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M2 6h7a2 2 0 1 0-2-2M2 10h10a2 2 0 1 1-2 2" {...stroke} /></svg>;
    case 'pulse':  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M1 8h3l2-4 4 8 2-4h3" {...stroke} /></svg>;
    case 'wave':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M1 8c2-3 4-3 6 0s4 3 6 0" {...stroke} /></svg>;
    case 'leaf':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M14 2c0 7-5 12-12 12 0-7 5-12 12-12ZM2 14 9 7" {...stroke} /></svg>;
    case 'spark':  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 1v4M8 11v4M1 8h4M11 8h4M3 3l3 3M10 10l3 3M13 3l-3 3M6 10l-3 3" {...stroke} /></svg>;
    case 'plus':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" {...stroke} /></svg>;
    case 'check':  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="m3 8 3 3 7-7" {...stroke} /></svg>;
    case 'menu':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" {...stroke} /></svg>;
    case 'close':  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13" {...stroke} /></svg>;
    case 'play':   return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M4 3v10l9-5z" fill={color} /></svg>;
    case 'pause':  return <svg width={s} height={s} viewBox="0 0 16 16"><path d="M5 3v10M11 3v10" {...stroke} /></svg>;
    case 'timer':  return <svg width={s} height={s} viewBox="0 0 16 16"><circle cx="8" cy="9" r="5" {...stroke}/><path d="M8 6v3l2 1M6 2h4" {...stroke}/></svg>;
    default: return null;
  }
}

// ─── VITAE Logo (TopLuxury font) ─────────────────────────
export const FONT_LOGO = "'TopLuxury', 'Aboreto', sans-serif";

export function VitaeLogo({ color = V.ink, size = 'normal' }) {
  const fontSize = size === 'small' ? 18 : size === 'large' ? 28 : 22;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: FONT_LOGO,
        fontSize,
        fontWeight: 400,
        letterSpacing: '0.28em',
        color,
        textTransform: 'uppercase',
        lineHeight: 1.2,
      }}>VITAE</div>
      <div style={{
        fontFamily: FONT_UI,
        fontSize: size === 'small' ? 7 : 9,
        fontWeight: 600,
        letterSpacing: '0.2em',
        color: V.inkMute,
        textTransform: 'uppercase',
        marginTop: 3,
      }}>RESPIRATORY INTELLIGENCE</div>
    </div>
  );
}

// ─── Stat Row ────────────────────────────────────────────
export function VStatRow({ label, value, max = 100, unit = '', color = V.teal, dim = false }) {
  const pct = Math.max(2, Math.min(100, value / max * 100));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'baseline', padding: '12px 0', borderBottom: `1px solid ${V.inkHair}` }}>
      <div>
        <div className="vitae-eyebrow" style={{ color: V.inkMute, marginBottom: 6 }}>{label}</div>
        <div style={{ height: 2, background: V.creamDim, position: 'relative', overflow: 'hidden', borderRadius: 1 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: color, borderRadius: 1, transition: 'width 1.2s cubic-bezier(.2,.7,.3,1)' }} />
        </div>
      </div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 400, color: dim ? V.inkMute : V.ink, lineHeight: 1 }}>
        {value == null ? '\u2014' : Math.round(value)}{unit && <span style={{ fontSize: 12, color: V.inkMute, marginLeft: 2 }}>{unit}</span>}
      </div>
    </div>
  );
}

// ─── Screen Shell ────────────────────────────────────────
export function ScreenShell({ children, dark = false, padded = true, scroll = true }) {
  return (
    <div style={{
      width: '100%', maxWidth: 430, margin: '0 auto',
      minHeight: scroll ? '100vh' : undefined,
      height: scroll ? undefined : '100vh',
      background: dark ? V.night : V.cream,
      color: dark ? V.cream : V.ink,
      fontFamily: FONT_UI,
      padding: padded ? '12px 24px 32px' : 0,
      overflowY: scroll ? 'auto' : 'hidden',
      overflowX: 'hidden',
      position: 'relative',
      boxSizing: 'border-box'
    }} className="vitae-scroll">
      {children}
    </div>
  );
}

// ─── Top Bar ─────────────────────────────────────────────
export function TopBar({ left, right, title, dark = false }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36, marginBottom: 18 }}>
      <div style={{ width: 32, color: dark ? V.cream : V.ink }}>{left}</div>
      <div className="vitae-eyebrow" style={{ color: dark ? V.cream : V.inkMute }}>{title}</div>
      <div style={{ width: 32, color: dark ? V.cream : V.ink, display: 'flex', justifyContent: 'flex-end' }}>{right}</div>
    </div>
  );
}

// ─── Primary Button (pill shape) ─────────────────────────
export function PrimaryButton({ children, onClick, variant = 'solid', dark = false, full = true, disabled = false, style = {} }) {
  const solid = variant === 'solid';
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width: full ? '100%' : 'auto',
      padding: '17px 24px',
      background: solid ? (dark ? V.cream : V.ink) : 'transparent',
      color: solid ? (dark ? V.ink : '#EDE9E0') : (dark ? V.cream : V.ink),
      border: solid ? 'none' : `1.5px solid ${dark ? 'rgba(255,255,255,0.5)' : 'rgba(26,26,26,0.6)'}`,
      borderRadius: 32,
      fontFamily: FONT_UI, fontSize: 14, fontWeight: 500, letterSpacing: '0.04em',
      cursor: disabled ? 'default' : 'pointer',
      opacity: disabled ? 0.3 : 1,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      transition: 'transform .1s, opacity .15s',
      ...style
    }}>
      {children}
    </button>
  );
}

// ─── Progress Bar (multi-segment) ────────────────────────
export function ProgressBar({ current = 0, total = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '14px 0 0' }}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          flex: 1, height: 2, borderRadius: 1,
          background: i < current ? V.teal : i === current ? `linear-gradient(90deg, ${V.teal} 55%, ${V.creamDim} 55%)` : V.creamDim
        }} />
      ))}
    </div>
  );
}

// ─── Section Heading ─────────────────────────────────────
export function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      {eyebrow && <div style={{ fontFamily: FONT_UI, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', color: V.teal, textTransform: 'uppercase', marginBottom: 10 }}>{eyebrow}</div>}
      {title && <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 400, letterSpacing: '0.2em', color: V.ink, textTransform: 'uppercase', lineHeight: 1.4 }}>{title}</div>}
      {subtitle && <div style={{ fontFamily: FONT_UI, fontSize: 13, fontWeight: 400, color: V.inkMute, lineHeight: 1.55, marginTop: 12 }}>{subtitle}</div>}
    </div>
  );
}
