// App.jsx — Main app shell with state-based routing
// New design: cream bg, teal accent, Aboreto display, Inter UI
import React, { useState, useMemo } from 'react';
import { calculateBasic, computeFor } from './lib/score';

// Auth screens
import { ScreenSignup, ScreenLogin } from './components/Auth';

// Assessment + result screens
import { ScreenWelcome, ScreenMode, ScreenTest, ScreenResult, ScreenPillarDetail, ScreenTrend, ScreenProgram } from './components/Screens';

// Dashboard / recurring-user screens
import { ScreenHome, ScreenExercisePlayer, ScreenLibrary, ScreenHistory } from './components/Dashboard';

// Client Dashboard (post-assessment interactive report)
import ScreenClientDashboard from './components/ClientDashboard';

// ─── Route config ────────────────────────────────────────
// Routes: welcome | signup | login | home | mode | test | result | pillar | trend | program | session | library | history | client-dashboard
export default function App() {
  const [route, setRoute] = useState('welcome');
  const [mode, setMode] = useState('basic');
  const [persona, setPersona] = useState('ada');
  const [measurements, setMeasurements] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [user, setUser] = useState(null); // { firstName, lastName, email }

  const result = useMemo(() => {
    if (measurements && mode === 'basic') {
      return calculateBasic(measurements);
    }
    return computeFor(persona, mode);
  }, [persona, mode, measurements]);

  const goto = (r) => () => setRoute(r);

  // Auth handlers — in production these will call Supabase
  const handleSignup = (form) => {
    setUser({ firstName: form.firstName, lastName: form.lastName, email: form.email });
    setRoute('mode');
  };
  const handleLogin = (form) => {
    setUser({ firstName: 'Vanessa', lastName: 'Schlauri', email: form.email });
    setRoute('home');
  };

  return (
    <>
      {route === 'welcome' && (
        <ScreenWelcome
          onStart={goto('signup')}
          onSignIn={goto('login')}
        />
      )}
      {route === 'signup' && (
        <ScreenSignup
          onSignup={handleSignup}
          onSwitchToLogin={goto('login')}
          onBack={goto('welcome')}
        />
      )}
      {route === 'login' && (
        <ScreenLogin
          onLogin={handleLogin}
          onSwitchToSignup={goto('signup')}
          onBack={goto('welcome')}
        />
      )}
      {route === 'home' && (
        <ScreenHome
          persona={persona}
          onStartSession={goto('session')}
          onTest={goto('mode')}
          onTrend={goto('history')}
          onLibrary={goto('library')}
          onDashboard={goto('client-dashboard')}
        />
      )}
      {route === 'mode' && (
        <ScreenMode
          mode={mode}
          setMode={setMode}
          onContinue={goto('test')}
          onBack={user ? goto('home') : goto('welcome')}
        />
      )}
      {route === 'test' && (
        <ScreenTest
          onDone={(meas) => { setMeasurements(meas); setRoute('result'); }}
          onBack={goto('mode')}
        />
      )}
      {route === 'result' && (
        <ScreenResult
          result={result}
          onPillarTap={goto('pillar')}
          onProgram={goto('program')}
          onTrend={goto('trend')}
          onBack={goto('home')}
        />
      )}
      {route === 'pillar' && (
        <ScreenPillarDetail
          result={result}
          onBack={goto('result')}
        />
      )}
      {route === 'trend' && (
        <ScreenTrend
          persona={persona}
          onBack={goto('result')}
        />
      )}
      {route === 'program' && (
        <ScreenProgram
          result={result}
          onBack={goto('result')}
        />
      )}
      {route === 'session' && (
        <ScreenExercisePlayer
          exercise={selectedExercise}
          onBack={goto('home')}
          onComplete={goto('home')}
        />
      )}
      {route === 'library' && (
        <ScreenLibrary
          onBack={goto('home')}
          onPlay={(ex) => { setSelectedExercise(ex); setRoute('session'); }}
        />
      )}
      {route === 'history' && (
        <ScreenHistory
          persona={persona}
          onBack={goto('home')}
          onResultTap={goto('client-dashboard')}
        />
      )}
      {route === 'client-dashboard' && (
        <ScreenClientDashboard
          onBack={goto('home')}
        />
      )}
    </>
  );
}
