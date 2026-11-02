/**
 * MyFace UPRM chrome — adapted from VisaGuide JourneyOSDashboard / Wallet.
 *
 * VisaGuide patterns kept:
 * - Layered glass cards (bg-white/6 + blur + multi-shadow + inset highlight)
 * - Eyebrow: 10px bold uppercase tracking ~0.16–0.2em
 * - Titles: font-black / Poppins display
 * - Inner tiles: rounded-xl white/5
 * - Sticky glass top bar + section pills
 *
 * MyFace brand kept:
 * - Base #050505 (not indigo/purple slate spine)
 * - M-gradient accents for CTAs / live / MFC
 */

export const UPRM_CARD =
  'bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.55),0_8px_20px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.12)]';

export const UPRM_CARD_INNER =
  'bg-white/[0.05] rounded-xl border border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]';

export const UPRM_EYE =
  'mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/45';

export const UPRM_PAGE =
  'min-h-screen bg-[#050505] text-white relative overflow-hidden';

export const UPRM_STICKY =
  'sticky z-[60] border-b border-white/10 bg-black/80 backdrop-blur-xl';

export const UPRM_PILL =
  'h-10 px-3 rounded-full border border-white/15 text-xs font-semibold text-white/70 grid place-items-center hover:bg-white/5 transition';

export const UPRM_PILL_ACTIVE =
  'h-9 px-4 rounded-full mono text-[11px] font-bold grid place-items-center bg-white text-black';

export const UPRM_PILL_IDLE =
  'h-9 px-4 rounded-full mono text-[11px] font-bold grid place-items-center border border-white/15 text-white/60 hover:bg-white/5';

export const M_GRAD =
  'linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)';
