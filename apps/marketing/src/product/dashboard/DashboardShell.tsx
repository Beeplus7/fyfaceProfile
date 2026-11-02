import { Navigate } from 'react-router-dom';
import CommandShell from '../command/CommandShell';
import { isOnboardingDone } from '../onboarding/storage';

/** Auth + onboarding gate → CRM Command Center (proposed UPRM v2 shell). */
export default function DashboardShell() {
  if (!isOnboardingDone()) {
    return <Navigate to="/app/onboarding" replace />;
  }
  return <CommandShell />;
}
