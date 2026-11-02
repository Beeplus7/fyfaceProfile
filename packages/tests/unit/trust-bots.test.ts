import { describe, expect, it } from 'vitest';
import { calculateTrustScore, seedAyoTailorsTrust } from '../../../apps/web/lib/trust';
import { monetizationSnapshot, runBot } from '../../../apps/web/lib/bots';
import { findySuggest } from '../../../apps/web/lib/search';

describe('trust + bots', () => {
  it('seeds AYO Verified Pro near 4.9', () => {
    const t = seedAyoTailorsTrust();
    expect(t.verified).toBe(true);
    expect(t.score).toBeGreaterThanOrEqual(4.0);
    expect(t.score).toBeLessThanOrEqual(4.9);
  });

  it('Findy returns AYO for Aso-Ebi lace 10mi', () => {
    const hits = findySuggest('Aso-Ebi lace').results;
    expect(hits.some((h) => h.shop.includes('AYO'))).toBe(true);
  });

  it('Quoto prices lace £45/m', async () => {
    const r = await runBot('quoto', { metres: 2, pricePerM: 45 });
    expect(r.ok).toBe(true);
    expect(JSON.stringify(r.data)).toContain('90');
  });

  it('monetization weekly totals 9620', () => {
    expect(monetizationSnapshot().weekly.total).toBe(9620);
  });

  it('calculateTrustScore returns shape', () => {
    const s = calculateTrustScore('unknown');
    expect(s).toHaveProperty('score');
    expect(s).toHaveProperty('verified');
  });
});
