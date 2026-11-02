import { Navigate } from 'react-router-dom';
import { isOnboardingDone } from '../onboarding/storage';
import TimelineFeed from './TimelineFeed';

/** Front-user infinite snap timeline (WorkCuts · Projects · Live · Gifts). */
export default function TimelinePage() {
  if (!isOnboardingDone()) {
    return <Navigate to="/app/onboarding" replace />;
  }
  return <TimelineFeed />;
}
