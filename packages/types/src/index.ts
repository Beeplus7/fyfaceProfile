export type JourneyState =
  | 'Discovery'
  | 'Engagement'
  | 'Inquiry'
  | 'Quote'
  | 'Booked'
  | 'In Progress'
  | 'Final'
  | 'Review'
  | 'Repeat';

export type GiftKind = 'Hammer' | 'Scissors' | 'Heart' | 'Crown' | 'Trophy';

export type TradeType =
  | 'Tailor'
  | 'Mechanic'
  | 'Builder'
  | 'Barber'
  | 'Electrician'
  | 'Plumber';

export type Project = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  before_image?: string;
  after_image?: string;
  milestones?: { label: string; done?: boolean }[];
  materials?: { name: string; cost?: number }[];
  team?: { name: string; role?: string }[];
  cost?: number;
  shop_link?: string;
  booking_link?: string;
  gift_count?: number;
  location_label?: string;
};

export type UprmContact = {
  id: string;
  user_id: string;
  name: string;
  relationship_strength: number;
  last_interaction?: string;
  journey_state: JourneyState;
  role?: string;
};

export type MfcWallet = {
  user_id: string;
  balance: number;
};

export type TrustLedgerEvent = {
  id: string;
  user_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export const JOURNEY_COLUMNS: JourneyState[] = [
  'Discovery',
  'Engagement',
  'Inquiry',
  'Quote',
  'Booked',
  'In Progress',
  'Final',
  'Review',
  'Repeat',
];

export const BOT_ARMY = [
  { id: 'milo', name: 'Milo', role: 'Onboarding 32 fields' },
  { id: 'cutty', name: 'Cutty', role: 'WorkCut auto-tools' },
  { id: 'quoto', name: 'Quoto', role: 'Quotes £45/m' },
  { id: 'timi', name: 'Timi', role: 'Scheduling buffer' },
  { id: 'findy', name: 'Findy', role: 'Discovery 10mi' },
  { id: 'helpy', name: 'Helpy', role: 'FAQ' },
  { id: 'veri', name: 'Veri', role: 'Trust · Gas Safe' },
  { id: 'growy', name: 'Growy', role: 'Boost £5/500' },
  { id: 'lingo', name: 'Lingo', role: 'Yoruba · Hausa · EN' },
] as const;

export const GIFT_PACKS = [
  { id: 'hammer', kind: 'Hammer' as GiftKind, coins: 10, emoji: '🔨' },
  { id: 'scissors', kind: 'Scissors' as GiftKind, coins: 25, emoji: '✂' },
  { id: 'heart', kind: 'Heart' as GiftKind, coins: 50, emoji: '❤' },
  { id: 'crown', kind: 'Crown' as GiftKind, coins: 100, emoji: '👑' },
  { id: 'trophy', kind: 'Trophy' as GiftKind, coins: 500, emoji: '🏆' },
];

export const MFC_PACKS = [
  { id: 'starter', label: 'Starter', coins: 100, priceGbp: 0.99 },
  { id: 'creator', label: 'Creator', coins: 500, priceGbp: 19.99 },
  { id: 'pro', label: 'Pro Pack', coins: 2000, priceGbp: 49.99 },
];
