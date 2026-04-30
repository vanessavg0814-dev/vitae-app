// Auth.jsx — Signup + Login screens
// New design: cream bg, teal accent, Aboreto display, Inter UI
import React, { useState } from 'react';
import { V, FONT_DISPLAY, FONT_UI } from '../lib/tokens';
import { ScreenShell, PrimaryButton, VIcon, VitaeLogo, TopBar } from './Primitives';

// ─── Input field helper ──────────────────────────────────
function Field({ label, type = 'text', placeholder, value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: FONT_UI, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', color: V.inkMute, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%', padding: '14px 16px',
          background: 'transparent',
          border: `1.5px solid ${V.inkHair}`,
          borderRadius: 10,
          fontFamily: FONT_UI, fontSize: 14, color: V.ink,
          outline: 'none',
          transition: 'border-color .15s',
        }}
        onFocus={e => e.target.style.borderColor = V.teal}
        onBlur={e => e.target.style.borderColor = V.inkHair}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
// SIGNUP
// ═════════════════════════════════════════════════════════════
export function ScreenSignup({ onSignup, onSwitchToLogin, onBack }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!firstName || !email || !password) { setError('Please fill in all required fields.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    onSignup({ firstName, lastName, email, password });
  };

  return (
    <ScreenShell>
      <TopBar
        left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>}
        title=""
      />
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <VitaeLogo />
      </div>

      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.16em', color: V.ink, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>CREATE ACCOUNT</div>
      <div style={{ fontFamily: FONT_UI, fontSize: 13, color: V.inkMute, textAlign: 'center', marginBottom: 28 }}>Start measuring your respiratory performance.</div>

      <Field label="First Name *" placeholder="Ada" value={firstName} onChange={setFirstName} />
      <Field label="Last Name" placeholder="Lemaitre" value={lastName} onChange={setLastName} />
      <Field label="Email *" type="email" placeholder="ada@example.com" value={email} onChange={setEmail} />
      <Field label="Password *" type="password" placeholder="Min. 6 characters" value={password} onChange={setPassword} />

      {error && <div style={{ fontFamily: FONT_UI, fontSize: 12, color: V.rose, marginBottom: 16, textAlign: 'center' }}>{error}</div>}

      <PrimaryButton onClick={handleSubmit}>Create Account &nbsp;\u2192</PrimaryButton>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={onSwitchToLogin} style={{ background: 'none', border: 'none', fontFamily: FONT_UI, fontSize: 13, color: V.teal, cursor: 'pointer' }}>
          Already have an account? Sign in
        </button>
      </div>
    </ScreenShell>
  );
}

// ═════════════════════════════════════════════════════════════
// LOGIN
// ═════════════════════════════════════════════════════════════
export function ScreenLogin({ onLogin, onSwitchToSignup, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    onLogin({ email, password });
  };

  return (
    <ScreenShell>
      <TopBar
        left={<button onClick={onBack} style={{ background: 'none', border: 'none' }}><VIcon name="back" size={20} /></button>}
        title=""
      />
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <VitaeLogo />
      </div>

      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: '0.16em', color: V.ink, textTransform: 'uppercase', textAlign: 'center', marginBottom: 8 }}>SIGN IN</div>
      <div style={{ fontFamily: FONT_UI, fontSize: 13, color: V.inkMute, textAlign: 'center', marginBottom: 28 }}>Welcome back to VITAE.</div>

      <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail} />
      <Field label="Password" type="password" placeholder="Your password" value={password} onChange={setPassword} />

      <div style={{ textAlign: 'right', marginTop: -8, marginBottom: 20 }}>
        <button style={{ background: 'none', border: 'none', fontFamily: FONT_UI, fontSize: 12, color: V.inkMute, cursor: 'pointer' }}>Forgot password?</button>
      </div>

      {error && <div style={{ fontFamily: FONT_UI, fontSize: 12, color: V.rose, marginBottom: 16, textAlign: 'center' }}>{error}</div>}

      <PrimaryButton onClick={handleSubmit}>Sign In &nbsp;\u2192</PrimaryButton>

      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={onSwitchToSignup} style={{ background: 'none', border: 'none', fontFamily: FONT_UI, fontSize: 13, color: V.teal, cursor: 'pointer' }}>
          Don't have an account? Create one
        </button>
      </div>
    </ScreenShell>
  );
}
