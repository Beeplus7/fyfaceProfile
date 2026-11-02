/** MyFace twin of VisaGuide VGC_PER_GBP — Ad Revenue + Arcade catalogue. */

export const MFC_ANCHOR = {
  gbp: 39,
  mfc: 45_000,
  mfcPerGbp: 1200,
  exactVisaPerGbp: 45_000 / 39,
} as const;

export const GIFT_CATALOG = [
  { id: 'hammer', name: 'Hammer', mfc: 100, emoji: '🔨' },
  { id: 'scissors', name: 'Scissors', mfc: 300, emoji: '✂️' },
  { id: 'heart', name: 'Heart', mfc: 250, emoji: '💜' },
  { id: 'crown', name: 'Crown', mfc: 800, emoji: '👑' },
  { id: 'trophy', name: 'Trophy', mfc: 2000, emoji: '🏆' },
  { id: 'boost', name: 'Boost', mfc: 5000, emoji: '🚀' },
] as const;

/** Session earn caps when banking a play session from HTML artifacts. */
export const GAME_REWARDS = {
  gift_rain_festival: { perTick: 8, sessionCap: 200, label: 'Gift Rain Festival' },
  lace_wall_clash: { perTick: 10, sessionCap: 220, label: 'Lace Wall Clash' },
  multiplayer_arcade: { perTick: 6, sessionCap: 180, label: 'Multiplayer Gift Arcade' },
  oldham_raid: { perTick: 12, sessionCap: 250, label: 'Oldham Raid MMO' },
  quote_royale: { perTick: 15, sessionCap: 220, label: 'Quote Royale' },
  cosmic_craft: { perTick: 10, sessionCap: 220, label: 'Cosmic Craft Clash' },
} as const;

export type GameId = keyof typeof GAME_REWARDS;

export const ARCADE_GAMES: {
  id: GameId;
  title: string;
  blurb: string;
  streamHint: string;
  earn: string;
  cap: string;
  status: 'Playable';
  playable: boolean;
  /** Public path under /arcade/games/ */
  src: string;
}[] = [
  {
    id: 'gift_rain_festival',
    title: 'Gift Rain Festival',
    blurb: 'Catch gifts for real makers — Oldham workshop rain. Most gifted wins.',
    streamHint: 'Viewer gifts every 5s · Arcade Live',
    earn: 'Bank session ticks',
    cap: '200 / session',
    status: 'Playable',
    playable: true,
    src: '/arcade/games/gift-rain-festival.html',
  },
  {
    id: 'lace_wall_clash',
    title: 'Lace Wall Clash',
    blurb: 'Tailors vs fabric wall — stitch together with multi-needle combos.',
    streamHint: 'Team stitch live',
    earn: 'Bank session ticks',
    cap: '220 / session',
    status: 'Playable',
    playable: true,
    src: '/arcade/games/lace-wall-clash.html',
  },
  {
    id: 'multiplayer_arcade',
    title: 'Multiplayer Gift Arcade',
    blurb: 'Lobby of gift arcade modes — play → earn → gift a real maker.',
    streamHint: 'Mux/LiveKit gift overlay',
    earn: 'Bank session ticks',
    cap: '180 / session',
    status: 'Playable',
    playable: true,
    src: '/arcade/games/multiplayer-gift-arcade.html',
  },
  {
    id: 'oldham_raid',
    title: 'Oldham Raid MMO',
    blurb: 'Own Oldham — claim jobs across OL1 · OL2 · OL8 territory.',
    streamHint: 'Territory control live',
    earn: 'Bank session ticks',
    cap: '250 / session',
    status: 'Playable',
    playable: true,
    src: '/arcade/games/oldham-raid-mmo.html',
  },
  {
    id: 'quote_royale',
    title: 'Quote Royale',
    blurb: 'Battle-royale pricing — lace, sewing, fitting. Fair Oldham rates.',
    streamHint: 'Chat votes the quote',
    earn: 'Bank session ticks',
    cap: '220 / session',
    status: 'Playable',
    playable: true,
    src: '/arcade/games/quote-royale.html',
  },
  {
    id: 'cosmic_craft',
    title: 'Cosmic Craft Clash',
    blurb: 'Oldham to orbit — deliver gift crates across the galaxy.',
    streamHint: 'Nebula boss · Trophy MFC',
    earn: 'Bank session ticks',
    cap: '220 / session',
    status: 'Playable',
    playable: true,
    src: '/arcade/games/cosmic-craft-clash.html',
  },
];

export const AGGREGATORS = [
  { name: 'TapJoy', gross: '£2', userCap: '£25', fee: '30%', net: '£1.40', mfc: '1680', status: 'Active' },
  { name: 'AdGate', gross: '£2', userCap: '£20', fee: '40%', net: '£0.48–£1.20', mfc: '576–1440', status: 'Active' },
  { name: 'Offerwall', gross: '£2', userCap: '£20', fee: '35%', net: '£1.30', mfc: '1560', status: 'Active' },
  { name: 'Lead Gen', gross: '£5', userCap: '£50', fee: '20%', net: '£4.00', mfc: '4800', status: 'Gated' },
  { name: 'Affiliate', gross: '£10', userCap: '£100', fee: '15%', net: '£8.50', mfc: '10200', status: 'Gated' },
  { name: 'Pollfish', gross: '£0.80', userCap: '£5', fee: '25%', net: '£0.60', mfc: '720', status: 'Active' },
  { name: 'Game Pad PoW', gross: 'PoW', userCap: 'Session', fee: '0%', net: 'play tick', mfc: 'var', status: 'Live' },
] as const;

export function coinsFromUserShareGbp(userShareGbp: number, mfcPerGbp = MFC_ANCHOR.mfcPerGbp) {
  return Math.ceil(userShareGbp * mfcPerGbp);
}
