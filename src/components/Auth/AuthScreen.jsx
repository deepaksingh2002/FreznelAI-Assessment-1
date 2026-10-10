import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firebaseConfigured } from '../../auth/firebase';

export function AuthScreen({ onPreview }) {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    if (!auth) {
      setMessage('Firebase is not configured. Add VITE_FIREBASE_* values to .env.local.');
      return;
    }
    try {
      if (mode === 'signup') await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setMessage('Authentication failed. Check your email, password, and Firebase Auth setup.');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#090d0c] bg-[radial-gradient(circle_at_50%_0%,#173b31_0,transparent_45%)] p-6">
      <section className="w-full max-w-[440px] border border-[#27483b] bg-[#0b1411]/95 p-7 shadow-2xl shadow-black/50 sm:p-10">
        <div className="mb-7 grid h-11 w-11 place-items-center border border-[#557b47] text-3xl text-[#a4f67c]">
          ⌁
        </div>
        <p className="font-mono text-[11px] tracking-[0.14em] text-[#779187]">
          SYSWATCH / SECURE ACCESS
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-[#eff7ee]">
          {mode === 'signup' ? 'Create your operator account' : 'Welcome back, operator'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#779187]">
          Monitor your machine with a focused, keyboard-first terminal workspace.
        </p>
        <form onSubmit={submit} className="mt-7 grid gap-4">
          <label className="grid gap-2 text-xs text-[#9db1a5]">
            Email address
            <input
              className="border border-[#294438] bg-[#0c1512] px-3.5 py-3 text-sm text-[#edf9ec] outline-none focus:border-[#96dc75] focus:ring-2 focus:ring-[#96dc75]/15"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="operator@example.com"
            />
          </label>
          <label className="grid gap-2 text-xs text-[#9db1a5]">
            Password
            <input
              className="border border-[#294438] bg-[#0c1512] px-3.5 py-3 text-sm text-[#edf9ec] outline-none focus:border-[#96dc75] focus:ring-2 focus:ring-[#96dc75]/15"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
            />
          </label>
          {message && <p className="text-xs text-[#ff9d85]">{message}</p>}
          <button
            className="cursor-pointer border-0 bg-[#a4f67c] px-4 py-3 font-semibold text-[#102011] transition hover:bg-[#b9ff96]"
            type="submit"
          >
            {mode === 'signup' ? 'Initialize account ↗' : 'Sign in ↗'}
          </button>
        </form>
        <button
          className="cursor-pointer border-0 bg-transparent py-3 text-xs text-[#a4f67c]"
          onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
        >
          {mode === 'signup' ? 'Already registered? Sign in' : 'Need an account? Sign up'}
        </button>
        {!firebaseConfigured && (
          <button
            className="mt-2 w-full cursor-pointer border border-dashed border-[#496958] bg-transparent px-4 py-3 text-xs text-[#a9c7b0]"
            onClick={onPreview}
          >
            Open terminal preview (local)
          </button>
        )}
        <small className="mt-5 block font-mono text-[11px] text-[#779187]">
          Authentication is provided exclusively by Firebase.
        </small>
      </section>
    </main>
  );
}
