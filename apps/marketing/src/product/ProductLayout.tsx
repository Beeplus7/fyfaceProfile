import { Navigate, Outlet } from 'react-router-dom';
import RequireAuth from './auth/RequireAuth';
import LiveReturnPill from './live/LiveReturnPill';
import { isOnboardingDone } from './onboarding/storage';

/** /app shell — auth required; child routes handle onboarding vs dashboard. */
export default function ProductLayout() {
  return (
    <RequireAuth>
      <Outlet />
      <LiveReturnPill />
    </RequireAuth>
  );
}

export function AppIndexRedirect() {
  return (
    <Navigate to={isOnboardingDone() ? '/app/dashboard' : '/app/onboarding'} replace />
  );
}
