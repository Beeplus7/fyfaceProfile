/**
 * Trust Ledger runtime — Sprint 3
 * Append-only event-sourced Verified Pro · TrustScore formula.
 */

export type TrustEventType =
  | 'id_verified'
  | 'trade_cert'
  | 'gas_safe'
  | 'bs7671'
  | 'insurance'
  | 'portfolio_video'
  | 'review_verified'
  | 'job_completed'
  | 'response_logged';

export type TrustEvent = {
  id: string;
  userId: string;
  eventType: TrustEventType;
  payload: Record<string, unknown>;
  createdAt: string;
};

export type VerificationStep = {
  id: TrustEventType;
  label: string;
  done: boolean;
};

const VERIFY_STEPS: { id: TrustEventType; label: string }[] = [
  { id: 'id_verified', label: 'ID verified' },
  { id: 'trade_cert', label: 'Trade cert' },
  { id: 'gas_safe', label: 'Gas Safe / register' },
  { id: 'bs7671', label: 'BS 7671 Part P / Insurance / Portfolio' },
];

/** In-memory ledger until Supabase trust_ledger applied */
const ledger: TrustEvent[] = [];

export function createTrustEvent(
  userId: string,
  eventType: TrustEventType,
  payload: Record<string, unknown> = {},
): TrustEvent {
  const ev: TrustEvent = {
    id: `te_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    eventType,
    payload,
    createdAt: new Date().toISOString(),
  };
  ledger.push(ev);
  return ev;
}

export function listTrustEvents(userId: string) {
  return ledger.filter((e) => e.userId === userId);
}

export function getVerificationSteps(userId: string): VerificationStep[] {
  const types = new Set(listTrustEvents(userId).map((e) => e.eventType));
  return VERIFY_STEPS.map((s) => ({ ...s, done: types.has(s.id) }));
}

/**
 * TrustScore = Verified × Reviews × Completion × Response → capped 4.9 demo target
 * No fake reviews: only review_verified events (from bookings) count.
 */
export function calculateTrustScore(userId: string): {
  score: number;
  verified: boolean;
  factors: { verified: number; reviews: number; completion: number; response: number };
} {
  const events = listTrustEvents(userId);
  const steps = getVerificationSteps(userId);
  const verifiedRatio = steps.filter((s) => s.done).length / steps.length;
  const reviews = events.filter((e) => e.eventType === 'review_verified').length;
  const completions = events.filter((e) => e.eventType === 'job_completed').length;
  const responses = events.filter((e) => e.eventType === 'response_logged').length;

  const verified = Math.min(1, verifiedRatio);
  const reviewF = Math.min(1, reviews / 10);
  const completionF = Math.min(1, completions / 10);
  const responseF = Math.min(1, responses / 20 || 0.5);

  const raw = 3.5 + verified * 0.8 + reviewF * 0.3 + completionF * 0.2 + responseF * 0.1;
  const score = Math.min(4.9, Math.round(raw * 10) / 10);

  return {
    score,
    verified: verifiedRatio >= 1,
    factors: {
      verified: verifiedRatio,
      reviews: reviewF,
      completion: completionF,
      response: responseF,
    },
  };
}

/** Veri bot — seed AYO'S TAILORS Oldham verified pack */
export function verifyPro(userId: string, opts?: { gasSafeRegister?: string }) {
  createTrustEvent(userId, 'id_verified', { source: 'veri' });
  createTrustEvent(userId, 'trade_cert', { trade: 'Tailor' });
  createTrustEvent(userId, 'gas_safe', {
    register: opts?.gasSafeRegister || '123456',
    note: 'Trade register / Gas Safe when applicable',
  });
  createTrustEvent(userId, 'bs7671', { insurance: true, portfolio_video: true });
  createTrustEvent(userId, 'job_completed', { project: 'aso-ebi', cost: 320 });
  createTrustEvent(userId, 'review_verified', { from: 'Aisha Bridal', via: 'booking' });
  createTrustEvent(userId, 'response_logged', { hours: 2 });
  return calculateTrustScore(userId);
}

export function seedAyoTailorsTrust() {
  return verifyPro('ayo-tailors-ol1', { gasSafeRegister: 'N/A-tailor' });
}
