import { Navigate, useLocation } from 'react-router-dom';
import { isDemoSession } from '../demo/testLab';
import { useAuth } from './AuthProvider';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white grid place-items-center">
        Loading…
      </div>
    );
  }

  // Local demo / test lab bypass (works with or without Supabase).
  if (!configured || isDemoSession()) return <>{children}</>;

  if (!user) {
    return <Navigate to="/demo" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
