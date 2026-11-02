import { describe, expect, it } from 'vitest';

/**
 * Lightweight gating contract tests (mirrors marketing tradeProfiles rules).
 * Full field schema lives in apps/marketing — these assert deterministic rules.
 */

type Answers = Record<string, unknown>;

function applyTradeGating(answers: Answers, fields: string[]) {
  let out = [...fields];
  if (answers.tradeType !== 'Tailor') {
    out = out.filter((f) => !['asoEbiFabrics', 'asoEbiStyles'].includes(f));
  }
  if (answers.tradeType !== 'Electrician') {
    out = out.filter((f) => !['consumerUnitDetails', 'rcdDetails'].includes(f));
  }
  if (answers.tradeType !== 'Plumber') {
    out = out.filter((f) => !['gasSafeNumber', 'boilerDetails'].includes(f));
  }
  if (answers.shopItems === false || answers.shopItems === 'no') {
    out = out.filter((f) => f !== 'shopItemsList');
  }
  return out;
}

const ALL = [
  'tradeType',
  'asoEbiFabrics',
  'asoEbiStyles',
  'consumerUnitDetails',
  'rcdDetails',
  'gasSafeNumber',
  'boilerDetails',
  'shopItems',
  'shopItemsList',
];

describe('onboarding trade gating', () => {
  it('removes Aso-Ebi fields when trade !== Tailor', () => {
    const next = applyTradeGating({ tradeType: 'Mechanic' }, ALL);
    expect(next).not.toContain('asoEbiFabrics');
    expect(next).not.toContain('asoEbiStyles');
  });

  it('keeps Aso-Ebi fields for Tailor', () => {
    const next = applyTradeGating({ tradeType: 'Tailor' }, ALL);
    expect(next).toContain('asoEbiFabrics');
  });

  it('removes electrician fields for Plumber', () => {
    const next = applyTradeGating({ tradeType: 'Plumber' }, ALL);
    expect(next).not.toContain('consumerUnitDetails');
    expect(next).toContain('gasSafeNumber');
  });

  it('removes shopItemsList when shopItems is no', () => {
    const next = applyTradeGating({ tradeType: 'Tailor', shopItems: 'no' }, ALL);
    expect(next).not.toContain('shopItemsList');
  });
});
