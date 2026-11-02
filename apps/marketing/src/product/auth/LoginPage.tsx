import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { enterTestLab } from '../demo/testLab';
import { isOnboardingDone } from '../onboarding/storage';
import { useAuth } from './AuthProvider';

export default function LoginPage() {
  const { user, loading, configured, signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) {
    return (
      <Navigate to={isOnboardingDone() ? '/app/dashboard' : '/app/onboarding'} replace />
    );
  }

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
      navigate(isOnboardingDone() ? '/app/dashboard' : '/app/onboarding', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void run(() => signIn(email.trim(), password));
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white px-4 flex items-center justify-center"
      style={{ paddingTop: 'max(3rem, var(--safe-area-inset-top))' }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 space-y-4">
        <div className="text-[12px] font-bold tracking-[0.18em] uppercase text-[#8FFF4A]">
          MyFace · Login
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
        <p className="text-sm text-white/55">Sign in to your UPRM dashboard.</p>

        <form className="space-y-3" onSubmit={onSubmit}>
          <input
            className="w-full min-h-12 rounded-xl border border-white/12 bg-black/40 px-3"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full min-h-12 rounded-xl border border-white/12 bg-black/40 px-3"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            disabled={busy || !configured}
            className="w-full min-h-12 rounded-xl bg-[#8FFF4A] text-black font-extrabold disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          disabled={busy || !configured}
          onClick={() => void run(() => signInWithGoogle())}
          className="w-full min-h-12 rounded-xl border border-white/15 font-bold disabled:opacity-60"
        >
          Continue with Google
        </button>

        <button
          type="button"
          className="w-full min-h-12 rounded-xl border border-[#8FFF4A]/40 bg-[#8FFF4A]/10 font-bold text-[#8FFF4A]"
          onClick={() => {
            enterTestLab();
            navigate('/app/dashboard', { replace: true });
          }}
        >
          Enter Test Lab · Ayo Tailors (no signup)
        </button>

        <button
          type="button"
          className="w-full min-h-11 rounded-xl border border-white/12 text-[12px] font-semibold text-white/70"
          onClick={() => {
            setEmail('ayo@oldham.demo');
            setPassword('OldhamDemo!234');
          }}
        >
          Fill Oldham demo credentials
        </button>
        <p className="text-[11px] text-white/35 leading-relaxed">
          Go-live probe · <Link to="/demo" className="text-[#00E5C0]">/demo</Link> · Google OAuth still needs console Client ID.
        </p>

        {!configured ? (
          <button
            type="button"
            className="w-full min-h-12 rounded-xl border border-white/15 font-bold"
            onClick={() => navigate('/app/onboarding')}
          >
            Demo mode · open onboarding
          </button>
        ) : null}

        <p className="text-center text-sm text-white/50">
          New here?{' '}
          <Link to="/signup" className="text-[#00E5C0] font-semibold">
            Create account
          </Link>
          {' · '}
          <Link to="/demo" className="text-[#00E5C0] font-semibold">
            Test Lab
          </Link>
        </p>
      </div>
    </div>
  );
}
