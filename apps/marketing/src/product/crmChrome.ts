/**
 * CRM-clean UPRM chrome — semi-square controls, no loud color CTAs.
 * Accents only on status text / hairlines, not button fills.
 */

export const CRM_CARD =
  'rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-xl';

export const CRM_CARD_IN =
  'rounded-lg border border-white/10 bg-black/40';

export const CRM_EYE =
  'mono text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40';

export const CRM_TITLE = 'font-display text-[18px] md:text-[20px] tracking-tight text-white';

/** Primary action — white / black, semi-square */
export const CRM_BTN =
  'inline-flex h-9 items-center justify-center rounded-lg bg-white px-3.5 text-[11px] font-semibold text-black hover:bg-white/90 transition disabled:opacity-40';

/** Secondary — outline, semi-square */
export const CRM_BTN_GHOST =
  'inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-transparent px-3.5 text-[11px] font-semibold text-white/75 hover:bg-white/[0.06] hover:text-white transition disabled:opacity-40';

/** Quiet tertiary */
export const CRM_BTN_QUIET =
  'inline-flex h-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2.5 text-[10px] font-medium text-white/60 hover:bg-white/[0.08] hover:text-white/85 transition';

export const CRM_INPUT =
  'h-9 w-full rounded-lg border border-white/12 bg-black/50 px-3 mono text-[12px] text-white outline-none placeholder:text-white/30 focus:border-white/25';

export const CRM_NAV_IDLE =
  'w-full flex items-center gap-3 rounded-lg px-2.5 h-10 text-left text-white/55 hover:bg-white/[0.05] hover:text-white/90 transition';

export const CRM_NAV_ACTIVE =
  'w-full flex items-center gap-3 rounded-lg px-2.5 h-10 text-left bg-white/[0.1] text-white border border-white/10';

/** Icon-only control — feed actions / slim rails */
export const CRM_ICON_BTN =
  'inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-black/45 text-white/85 hover:bg-white/[0.08] hover:text-white transition disabled:opacity-40';

export const CRM_ICON_BTN_ACTIVE =
  'inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/20 bg-white text-black transition';

/** Slim vertical rail item */
export const CRM_RAIL_ITEM =
  'flex flex-col items-center justify-center gap-1 h-14 w-12 rounded-lg text-white/55 hover:text-white hover:bg-white/[0.06] transition';

export const CRM_RAIL_ITEM_ACTIVE =
  'flex flex-col items-center justify-center gap-1 h-14 w-12 rounded-lg bg-white/[0.1] text-white border border-white/10';

/** Live status pill — Twitch-style calm */
export const CRM_LIVE_PILL =
  'inline-flex items-center gap-1.5 mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-red-500 text-white';
