import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { isOnboardingDone } from '../product/onboarding/storage';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!supabase) {
        navigate('/app/onboarding', { replace: true });
        return;
      }
      const { data, error: err } = await supabase.auth.getSession();
      if (cancelled) return;
      if (err) {
        setError(err.message);
        return;
      }
      if (data.session) {
        navigate(isOnboardingDone() ? '/app/dashboard' : '/app/onboarding', {
          replace: true,
        });
      } else {
        setError('No session found. Try signing in again.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-[#0A0A0A] grid place-items-center px-4">
      <div className="text-center space-y-3">
        <p className="text-[#5B6470]">{error ?? 'Finishing sign-in…'}</p>
        {error ? (
          <Link to="/login" className="text-[#8FFF4A] font-bold">
            Back to login
          </Link>
        ) : null}
      </div>
    </div>
  );
}
