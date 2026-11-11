import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase is not configured');
      return;
    }
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        setInfo('Signed in');
      } else {
        const { error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;
        setInfo('Account created — check email if confirmation is required.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Auth failed');
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    if (!supabase) {
      setError('Supabase is not configured');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setBusy(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#FFFDF7] text-[#0A0A0A] px-4 py-16 flex items-center justify-center"
      style={{ paddingTop: 'max(4rem, var(--safe-area-inset-top))' }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-4">
        <div className="text-[12px] font-bold tracking-[0.18em] uppercase text-[#8FFF4A]">MyFace</div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </h1>
        <p className="text-sm text-white/55">
          {isSupabaseConfigured
            ? 'Email/password + Google via Supabase'
            : 'Add VITE_SUPABASE_* to apps/marketing/.env'}
        </p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full min-h-12 rounded-xl border border-white/12 bg-black/40 px-3 text-white"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full min-h-12 rounded-xl border border-white/12 bg-black/40 px-3 text-white"
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          {info ? <p className="text-sm text-[#8FFF4A]">{info}</p> : null}
          <button
            type="submit"
            disabled={busy || !isSupabaseConfigured}
            className="w-full min-h-12 rounded-xl bg-[#8FFF4A] text-black font-extrabold disabled:opacity-60"
          >
            {busy ? 'Please wait…' : mode === 'signin' ? 'Continue' : 'Sign up'}
          </button>
        </form>

        <button
          type="button"
          disabled={busy || !isSupabaseConfigured}
          onClick={() => void onGoogle()}
          className="w-full min-h-12 rounded-xl border border-white/15 font-bold disabled:opacity-60"
        >
          Continue with Google
        </button>

        <button
          type="button"
          className="w-full text-sm text-[#00E5C0] font-semibold"
          onClick={() => setMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>

        <Link to="/" className="block text-center text-sm text-white/50">
          ← Back home
        </Link>
      </div>
    </div>
  );
}
