import { describe, expect, it } from 'vitest';
import { computeEscrow, oldhamAishaEscrowExample, splitGift } from '../../../apps/web/lib/stripe';

describe('Stripe escrow + gift split', () => {
  it('Aisha Bridal £320 job holds 10% = £32', () => {
    const e = oldhamAishaEscrowExample();
    expect(e.holdGbp).toBe(32);
    expect(e.releaseToProGbp).toBe(288);
  });

  it('shop escrow is 5%', () => {
    const e = computeEscrow(100, 'shop');
    expect(e.holdGbp).toBe(5);
  });

  it('gift split 70/30', () => {
    const s = splitGift(100);
    expect(s.pro).toBe(70);
    expect(s.platform).toBe(30);
  });
});
