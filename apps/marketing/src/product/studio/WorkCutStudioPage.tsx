import { Navigate } from 'react-router-dom';
import { isOnboardingDone } from '../onboarding/storage';
import WorkCutLightStudio from './WorkCutLightStudio';

/** Admin · CapCut-style WorkCut editing studio (light Axentra shell). */
export default function WorkCutStudioPage() {
  if (!isOnboardingDone()) {
    return <Navigate to="/app/onboarding" replace />;
  }
  return <WorkCutLightStudio />;
}
