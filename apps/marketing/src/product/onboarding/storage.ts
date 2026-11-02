const ANSWERS_KEY = 'myface_onboarding_answers';
const DONE_KEY = 'myface_onboarding_done';
const PROFILE_KEY = 'myface_profile';

export type OnboardingProfile = {
  answers: Record<string, any>;
  completedAt: string;
  tradeType?: string;
  shopName?: string;
  location?: string;
};

export function loadAnswers(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(ANSWERS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function saveAnswers(answers: Record<string, any>) {
  localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function isOnboardingDone(): boolean {
  return localStorage.getItem(DONE_KEY) === '1';
}

export function markOnboardingDone(answers: Record<string, any>) {
  saveAnswers(answers);
  localStorage.setItem(DONE_KEY, '1');
  const profile: OnboardingProfile = {
    answers,
    completedAt: new Date().toISOString(),
    tradeType: answers.tradeType,
    shopName: answers.shopName,
    location: answers.location,
  };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): OnboardingProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
  } catch {
    return null;
  }
}

export function clearOnboarding() {
  localStorage.removeItem(ANSWERS_KEY);
  localStorage.removeItem(DONE_KEY);
  localStorage.removeItem(PROFILE_KEY);
}
