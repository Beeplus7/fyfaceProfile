/** TikTok-style reaction gifts for live — animals, rockets, tools, premium. */

export type LiveGiftCategory = 'Popular' | 'Animals' | 'Rockets' | 'Tools' | 'Premium';

export type LiveGiftAnim =
  | 'float'
  | 'burst'
  | 'rain'
  | 'rocket'
  | 'orbit'
  | 'stampede'
  | 'spin'
  | 'combo';

export type LiveGift = {
  id: string;
  name: string;
  emoji: string;
  /** Secondary particles for the on-screen animation */
  particles?: string[];
  coins: number;
  category: LiveGiftCategory;
  anim: LiveGiftAnim;
  /** Accent for shop tile */
  tint: string;
};

export const LIVE_GIFT_CATEGORIES: LiveGiftCategory[] = [
  'Popular',
  'Animals',
  'Rockets',
  'Tools',
  'Premium',
];

export const LIVE_GIFTS: LiveGift[] = [
  // Popular
  { id: 'rose', name: 'Rose', emoji: '🌹', coins: 1, category: 'Popular', anim: 'float', tint: '#fb7185' },
  { id: 'heart', name: 'Heart', emoji: '💚', coins: 5, category: 'Popular', anim: 'burst', tint: '#8FFF4A' },
  { id: 'crown', name: 'Crown', emoji: '👑', particles: ['✨', '💛'], coins: 10, category: 'Popular', anim: 'rain', tint: '#FFE600' },
  { id: 'clap', name: 'Clap', emoji: '👏', coins: 9, category: 'Popular', anim: 'burst', tint: '#fbbf24' },
  { id: 'fire', name: 'Fire', emoji: '🔥', coins: 15, category: 'Popular', anim: 'rain', tint: '#f97316' },
  { id: 'star', name: 'Star', emoji: '⭐', coins: 20, category: 'Popular', anim: 'orbit', tint: '#fde047' },

  // Animals
  { id: 'cat', name: 'Kitty', emoji: '🐱', particles: ['💕', '🐾'], coins: 49, category: 'Animals', anim: 'stampede', tint: '#fda4af' },
  { id: 'dog', name: 'Puppy', emoji: '🐶', particles: ['🦴'], coins: 99, category: 'Animals', anim: 'stampede', tint: '#fdba74' },
  { id: 'lion', name: 'Lion', emoji: '🦁', particles: ['👑'], coins: 199, category: 'Animals', anim: 'burst', tint: '#f59e0b' },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', particles: ['✨', '🌈'], coins: 299, category: 'Animals', anim: 'orbit', tint: '#c084fc' },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', particles: ['🔥'], coins: 399, category: 'Animals', anim: 'combo', tint: '#ef4444' },
  { id: 'phoenix', name: 'Phoenix', emoji: '🦅', particles: ['🔥', '✨'], coins: 599, category: 'Animals', anim: 'combo', tint: '#ea580c' },

  // Rockets / space
  { id: 'spark', name: 'Spark', emoji: '✨', coins: 30, category: 'Rockets', anim: 'float', tint: '#e2e8f0' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', particles: ['💨', '⭐'], coins: 299, category: 'Rockets', anim: 'rocket', tint: '#38bdf8' },
  { id: 'ufo', name: 'UFO', emoji: '🛸', particles: ['👽'], coins: 499, category: 'Rockets', anim: 'orbit', tint: '#22d3ee' },
  { id: 'firework', name: 'Firework', emoji: '🎆', particles: ['💥', '✨'], coins: 699, category: 'Rockets', anim: 'combo', tint: '#a78bfa' },
  { id: 'planet', name: 'Planet', emoji: '🪐', particles: ['🌟'], coins: 999, category: 'Rockets', anim: 'orbit', tint: '#818cf8' },
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌', particles: ['⭐', '✨'], coins: 1499, category: 'Rockets', anim: 'combo', tint: '#6366f1' },

  // Tools / trade (MyFace)
  { id: 'scissors', name: 'Scissors', emoji: '✂️', coins: 25, category: 'Tools', anim: 'spin', tint: '#94a3b8' },
  { id: 'needle', name: 'Needle', emoji: '🧵', coins: 35, category: 'Tools', anim: 'float', tint: '#f9a8d4' },
  { id: 'hammer', name: 'Hammer', emoji: '🔨', coins: 49, category: 'Tools', anim: 'burst', tint: '#a8a29e' },
  { id: 'wrench', name: 'Wrench', emoji: '🔧', coins: 59, category: 'Tools', anim: 'spin', tint: '#64748b' },
  { id: 'bolt', name: 'Bolt', emoji: '⚡', coins: 88, category: 'Tools', anim: 'rain', tint: '#facc15' },
  { id: 'helmet', name: 'Hard hat', emoji: '⛑️', coins: 120, category: 'Tools', anim: 'burst', tint: '#f97316' },

  // Premium
  { id: 'diamond', name: 'Diamond', emoji: '💎', particles: ['✨', '💠'], coins: 1999, category: 'Premium', anim: 'combo', tint: '#67e8f9' },
  { id: 'castle', name: 'Castle', emoji: '🏰', particles: ['👑', '✨'], coins: 2999, category: 'Premium', anim: 'combo', tint: '#c4b5fd' },
  { id: 'yacht', name: 'Yacht', emoji: '🛥️', particles: ['🌊'], coins: 4999, category: 'Premium', anim: 'combo', tint: '#7dd3fc' },
  { id: 'legend', name: 'Legend', emoji: '🏆', particles: ['👑', '🔥', '✨'], coins: 9999, category: 'Premium', anim: 'combo', tint: '#fbbf24' },
];

export function giftsInCategory(cat: LiveGiftCategory): LiveGift[] {
  return LIVE_GIFTS.filter((g) => g.category === cat);
}

export function getLiveGift(id: string): LiveGift | undefined {
  return LIVE_GIFTS.find((g) => g.id === id);
}

const WALLET_KEY = 'myface.mfc.wallet';
export const LIVE_GIFT_EVENT = 'myface-live-gift';

export function readMfcWallet(fallback = 1247): number {
  try {
    const n = Number(localStorage.getItem(WALLET_KEY));
    return Number.isFinite(n) && n >= 0 ? n : fallback;
  } catch {
    return fallback;
  }
}

export function writeMfcWallet(n: number) {
  localStorage.setItem(WALLET_KEY, String(Math.max(0, Math.floor(n))));
  window.dispatchEvent(new Event('myface-mfc-wallet'));
}

export type LiveGiftSendPayload = {
  gift: LiveGift;
  fromName: string;
  at: number;
};

export function broadcastLiveGift(payload: LiveGiftSendPayload) {
  window.dispatchEvent(new CustomEvent(LIVE_GIFT_EVENT, { detail: payload }));
}
