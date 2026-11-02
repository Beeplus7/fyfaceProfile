import { Navigate } from 'react-router-dom';
import { isOnboardingDone } from '../onboarding/storage';
import LiveViewerExperience from './LiveViewerExperience';

/** Product OS live session — TikTok-style gift economy viewer. */
export default function LiveViewerPage() {
  if (!isOnboardingDone()) {
    return <Navigate to="/app/onboarding" replace />;
  }
  return <LiveViewerExperience />;
}
