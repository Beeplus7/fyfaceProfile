/**
 * onboarding_memory contract — localStorage now, Supabase when schema applied.
 */
export type OnboardingMemory = {
  userId?: string;
  fields: Record<string, unknown>;
  completed: boolean;
  updatedAt: string;
};

const KEY = 'myface_onboarding_memory';

export function loadMemory(userId?: string): OnboardingMemory {
  try {
    const raw = localStorage.getItem(userId ? `${KEY}:${userId}` : KEY);
    if (raw) return JSON.parse(raw) as OnboardingMemory;
  } catch {
    /* ignore */
  }
  return { userId, fields: {}, completed: false, updatedAt: new Date().toISOString() };
}

export function saveStep(fieldId: string, value: unknown, userId?: string) {
  const mem = loadMemory(userId);
  mem.fields[fieldId] = value;
  mem.updatedAt = new Date().toISOString();
  localStorage.setItem(userId ? `${KEY}:${userId}` : KEY, JSON.stringify(mem));
  return mem;
}

export function completeOnboarding(userId?: string) {
  const mem = loadMemory(userId);
  mem.completed = true;
  mem.updatedAt = new Date().toISOString();
  localStorage.setItem(userId ? `${KEY}:${userId}` : KEY, JSON.stringify(mem));
  return mem;
}

/** Future: upsert into public.onboarding_memory via Supabase client */
export async function syncMemoryToSupabase(_client: unknown, _userId: string) {
  return { ok: false, reason: 'Apply supabase/schema.sql then wire client upsert' };
}
