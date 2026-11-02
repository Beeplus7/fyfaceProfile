/**
 * Bot Army orchestrator — Sprint 3
 * 9 micro-bots · edge fn stubs under supabase/functions/bots/*
 */

import { cuttyAutoTools } from './workcut';
import { findySuggest } from './search';
import { boostProject } from './feed';
import { seedAyoTailorsTrust, verifyPro } from './trust';
import { computeEscrow, splitGift } from './stripe';

export const BOT_IDS = [
  'milo',
  'cutty',
  'quoto',
  'timi',
  'findy',
  'helpy',
  'veri',
  'growy',
  'lingo',
] as const;

export type BotId = (typeof BOT_IDS)[number];

export type BotResult = {
  bot: BotId;
  ok: boolean;
  data: unknown;
  mode: 'local' | 'edge-stub';
};

export async function runBot(bot: BotId, input: Record<string, unknown> = {}): Promise<BotResult> {
  switch (bot) {
    case 'milo':
      return {
        bot,
        ok: true,
        mode: 'edge-stub',
        data: {
          next: 'Invoke supabase/functions/onboarding-chat',
          fields: 32,
          gated: true,
        },
      };
    case 'cutty':
      return { bot, ok: true, mode: 'local', data: cuttyAutoTools(String(input.trade || 'Tailor')) };
    case 'quoto': {
      const metres = Number(input.metres || 1);
      const perM = Number(input.pricePerM || 45);
      return {
        bot,
        ok: true,
        mode: 'local',
        data: { line: `Aso-Ebi lace £${perM}/m × ${metres} = £${perM * metres}`, escrow: computeEscrow(perM * metres, 'shop') },
      };
    }
    case 'timi':
      return {
        bot,
        ok: true,
        mode: 'local',
        data: {
          bufferMins: 15,
          nextSlot: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
          note: 'Availability buffer for Discovery→Repeat calendar',
        },
      };
    case 'findy':
      return { bot, ok: true, mode: 'local', data: findySuggest(String(input.query || 'Aso-Ebi lace')) };
    case 'helpy':
      return {
        bot,
        ok: true,
        mode: 'local',
        data: {
          faq: [
            'Escrow 10% jobs / 5% shop',
            'Gift split 70% pro / 30% platform',
            'TrustScore from verified bookings only — no fake reviews',
          ],
        },
      };
    case 'veri':
      return {
        bot,
        ok: true,
        mode: 'local',
        data: input.userId ? verifyPro(String(input.userId)) : seedAyoTailorsTrust(),
      };
    case 'growy':
      return {
        bot,
        ok: true,
        mode: 'local',
        data: {
          ...boostProject(String(input.projectId || 'aso-ebi'), Number(input.gbp || 5)),
          ads: ['B&Q', 'Wickes', 'Howdens'],
          leadUnlockGbp: 3,
          proSubGbp: 29,
        },
      };
    case 'lingo': {
      const text = String(input.text || 'Your work is your face');
      return {
        bot,
        ok: true,
        mode: 'local',
        data: {
          en: text,
          yo: `[YO] ${text}`,
          ha: `[HA] ${text}`,
          sw: `[SW] ${text}`,
        },
      };
    }
    default:
      return { bot, ok: false, mode: 'local', data: { error: 'unknown bot' } };
  }
}

export async function runBotArmy(input: Record<string, unknown> = {}) {
  const out: BotResult[] = [];
  for (const id of BOT_IDS) {
    out.push(await runBot(id, input));
  }
  return out;
}

/** Monetization 6 ways snapshot — £9620/week → £618K ARR at 10K WAU */
export function monetizationSnapshot() {
  return {
    weekly: {
      gifts: 600,
      jobs: 6300,
      shop: 420,
      boost: 1500,
      supplierAds: 500,
      leadUnlock: 300,
      total: 9620,
    },
    arrWithoutPro: 618_000,
    giftSplit: splitGift(100),
    proSubGbp: 29,
  };
}
