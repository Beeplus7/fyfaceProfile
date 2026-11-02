import { Navigate } from 'react-router-dom';
import { isOnboardingDone } from '../onboarding/storage';
import StreamingLightStudio from './StreamingLightStudio';

/** Admin · Streaming Studio (light Axentra shell + Jamendo BGM). */
export default function StreamingStudioPage() {
  if (!isOnboardingDone()) {
    return <Navigate to="/app/onboarding" replace />;
  }
  return <StreamingLightStudio />;
}
