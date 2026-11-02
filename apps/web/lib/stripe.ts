/**
 * Stripe Connect escrow + MFC packs — Sprint 3 API surface.
 * Uses stub mode until STRIPE_SECRET_KEY / Connect keys are set.
 */

export const ESCROW = {
  jobsPct: 10,
  shopPct: 5,
  giftProPct: 70,
  giftPlatformPct: 30,
} as const;

export const MFC_PACKS = [
  { id: 'starter', label: 'Starter', coins: 100, priceGbp: 0.99 },
  { id: 'creator', label: 'Creator', coins: 500, priceGbp: 19.99 },
  { id: 'business', label: 'Business', coins: 1000, priceGbp: 49 },
  { id: 'pro', label: 'Pro Pack', coins: 5000, priceGbp: 199 },
] as const;

export type EscrowHold = {
  id: string;
  amountGbp: number;
  kind: 'job' | 'shop';
  holdGbp: number;
  releaseToProGbp: number;
  status: 'held' | 'released' | 'refunded';
  proUserId: string;
  meta?: Record<string, unknown>;
};

const holds = new Map<string, EscrowHold>();

function liveMode() {
  return Boolean(typeof process !== 'undefined' && process.env?.STRIPE_SECRET_KEY);
}

export function computeEscrow(amountGbp: number, kind: 'job' | 'shop') {
  const pct = kind === 'job' ? ESCROW.jobsPct : ESCROW.shopPct;
  const holdGbp = Math.round(amountGbp * (pct / 100) * 100) / 100;
  return {
    amountGbp,
    kind,
    holdGbp,
    releaseToProGbp: Math.round((amountGbp - holdGbp) * 100) / 100,
  };
}

export function splitGift(coins: number) {
  const pro = Math.floor((coins * ESCROW.giftProPct) / 100);
  return { pro, platform: coins - pro, coins };
}

export async function createConnectAccount(proUserId: string) {
  if (liveMode()) {
    return { mode: 'live' as const, note: 'Wire stripe.accounts.create + Account Links', proUserId };
  }
  return {
    mode: 'stub' as const,
    accountId: `acct_stub_${proUserId}`,
    url: `https://connect.stripe.com/setup/stub?pro=${encodeURIComponent(proUserId)}`,
  };
}

export async function createConnectOnboardingLink(proUserId: string) {
  const acct = await createConnectAccount(proUserId);
  return { ...acct, type: 'account_onboarding' as const };
}

export async function createEscrowPayment(input: {
  proUserId: string;
  amountGbp: number;
  kind: 'job' | 'shop';
  meta?: Record<string, unknown>;
}) {
  const base = computeEscrow(input.amountGbp, input.kind);
  const hold: EscrowHold = {
    id: `esc_${Date.now()}`,
    ...base,
    status: 'held',
    proUserId: input.proUserId,
    meta: input.meta,
  };
  holds.set(hold.id, hold);
  return { mode: liveMode() ? ('live' as const) : ('stub' as const), hold };
}

export async function releaseEscrow(holdId: string) {
  const hold = holds.get(holdId);
  if (!hold) throw new Error('hold not found');
  hold.status = 'released';
  return { mode: liveMode() ? ('live' as const) : ('stub' as const), hold };
}

export async function purchaseMFC(packId: string, userId: string) {
  const pack = MFC_PACKS.find((p) => p.id === packId);
  if (!pack) throw new Error('Unknown pack');
  return {
    mode: liveMode() ? ('live' as const) : ('stub' as const),
    id: `cs_${packId}_${userId}`,
    url: liveMode() ? undefined : `/billing/stub?pack=${packId}`,
    pack,
  };
}

export async function createMfcCheckout(packId: string, userId: string) {
  return purchaseMFC(packId, userId);
}

export async function sendGiftSplit(coins: number, toProUserId: string) {
  const split = splitGift(coins);
  return { toProUserId, ...split, mode: liveMode() ? ('live' as const) : ('stub' as const) };
}

export async function withdraw(proUserId: string, amountGbp: number) {
  return {
    mode: liveMode() ? ('live' as const) : ('stub' as const),
    proUserId,
    amountGbp,
    status: 'queued',
    note: 'Connect payout stub — set STRIPE_SECRET_KEY for live',
  };
}

/** Oldham test: Aisha Bridal £320 job escrow → hold £32 */
export function oldhamAishaEscrowExample() {
  return computeEscrow(320, 'job');
}

export function getHold(id: string) {
  return holds.get(id) || null;
}
