import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './auth/firebase';
import { AuthScreen } from './components/Auth/AuthScreen';
import { TerminalDashboard } from './components/Layout/TerminalDashboard';

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (user) => setAuthenticated(Boolean(user)));
  }, []);

  if (!authenticated && !preview) return <AuthScreen onPreview={() => setPreview(true)} />;
  return (
    <TerminalDashboard
      onSignOut={() => {
        if (auth) signOut(auth);
        setAuthenticated(false);
        setPreview(false);
      }}
    />
  );
}
