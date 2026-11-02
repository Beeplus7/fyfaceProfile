import type { GameId } from '../arcade/mfcEconomy';
import { markOnboardingDone } from '../onboarding/storage';

export const DEMO_SESSION_KEY = 'myface_demo_session';
export const DEMO_BROADCAST_KEY = 'myface.live.broadcast';
export const WALLET_KEY = 'myface_arcade_mfc_v1';

export const TEST_ROUTES = [
  { path: '/app/dashboard', label: 'Command Center' },
  { path: '/app/feed', label: 'Timeline Feed' },
  { path: '/app/discover', label: 'Discover' },
  { path: '/app/live', label: 'Live Viewer' },
  { path: '/app/studio/stream', label: 'Streaming Studio' },
  { path: '/app/studio/workcut', label: 'WorkCut Studio' },
  { path: '/app/arcade', label: 'Games Arcade' },
  { path: '/app/arcade?tab=economics', label: 'Ad Revenue Scorecard' },
  { path: '/app/dashboard?pane=projects', label: 'Projects Kanban' },
  { path: '/app/dashboard?pane=contacts', label: 'Contacts' },
  { path: '/readiness', label: 'Readiness' },
] as const;

const AYO_ANSWERS = {
  tradeType: 'tailor',
  shopName: "AYO'S TAILORS",
  location: 'Spindlegate Oldham OL1',
  postcode: 'OL1',
  displayName: 'Ayo',
  craft: 'Aso-Ebi · Wedding · Lace',
  trustScore: 4.9,
  projectsTarget: 12,
  mfcSeed: 1247,
  phone: '+44 7700 900123',
  languages: ['EN', 'YO', 'HA'],
  demo: true,
};

export function isDemoSession(): boolean {
  try {
    return localStorage.getItem(DEMO_SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

export function seedWallet(balance = 1247) {
  const store = {
    balance,
    sessionEarned: {} as Partial<Record<GameId, number>>,
    ledger: [
      {
        id: `lg_seed_${Date.now()}`,
        at: new Date().toISOString(),
        source: 'buy_stub' as const,
        amount: balance,
        note: 'Test lab seed · Ayo Tailors Oldham',
      },
    ],
  };
  localStorage.setItem(WALLET_KEY, JSON.stringify(store));
  return store;
}

export type BroadcastMode = 'video' | 'audio';

export type BroadcastState = {
  live: boolean;
  title: string;
  viewers: number;
  startedAt: string;
  mode: BroadcastMode;
  from?: string;
};

export function setBroadcast(
  live: boolean,
  meta?: { title?: string; viewers?: number; mode?: BroadcastMode },
) {
  if (!live) {
    localStorage.removeItem(DEMO_BROADCAST_KEY);
    window.dispatchEvent(new Event('myface-broadcast'));
    void import('../live/liveRemote').then((m) => m.publishRemoteLive(null)).catch(() => undefined);
    return null;
  }
  const mode: BroadcastMode = meta?.mode === 'audio' ? 'audio' : 'video';
  const payload: BroadcastState = {
    live: true,
    title: meta?.title ?? (mode === 'audio' ? 'Audio Live · Spindlegate OL1' : 'AYO sewing lace · Spindlegate OL1'),
    viewers: meta?.viewers ?? 12,
    startedAt: new Date().toISOString(),
    mode,
    from: 'test-lab',
  };
  localStorage.setItem(DEMO_BROADCAST_KEY, JSON.stringify(payload));
  window.dispatchEvent(new Event('myface-broadcast'));
  // Cross-device: phone feed polls /api/live-status while PC is hosting
  void import('../live/liveRemote').then((m) => m.publishRemoteLive(payload)).catch(() => undefined);
  return payload;
}

export function readBroadcast(): BroadcastState | null {
  try {
    const raw = localStorage.getItem(DEMO_BROADCAST_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BroadcastState> & { live?: boolean };
    if (!parsed?.live) return null;
    return {
      live: true,
      title: parsed.title ?? 'Live · Oldham OL1',
      viewers: parsed.viewers ?? 12,
      startedAt: parsed.startedAt ?? new Date().toISOString(),
      mode: parsed.mode === 'audio' ? 'audio' : 'video',
      from: parsed.from,
    };
  } catch {
    return null;
  }
}

/** Drop stale local live flag without ending someone else's remote broadcast. */
export function clearLocalBroadcastOnly() {
  try {
    localStorage.removeItem(DEMO_BROADCAST_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event('myface-broadcast'));
}

/** One-click: demo session + Oldham tailor profile + wallet + idle broadcast flag cleared. */
export function enterTestLab() {
  localStorage.setItem(DEMO_SESSION_KEY, '1');
  markOnboardingDone(AYO_ANSWERS);
  seedWallet(1247);
  setBroadcast(false);
  localStorage.setItem(
    'myface.testlab.meta',
    JSON.stringify({ enteredAt: new Date().toISOString(), profile: "AYO'S TAILORS · OL1" }),
  );
  return {
    email: 'ayo.demo@myface.app',
    shop: AYO_ANSWERS.shopName,
    balance: 1247,
  };
}

export function exitTestLab() {
  localStorage.removeItem(DEMO_SESSION_KEY);
  localStorage.removeItem(DEMO_BROADCAST_KEY);
  localStorage.removeItem('myface.testlab.meta');
}

export function creditBuyStub(amount: number, note = 'Stripe buy stub') {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    const store = raw
      ? (JSON.parse(raw) as {
          balance: number;
          sessionEarned: Partial<Record<GameId, number>>;
          ledger: { id: string; at: string; source: string; amount: number; note: string }[];
        })
      : { balance: 0, sessionEarned: {}, ledger: [] };
    store.balance += amount;
    store.ledger = [
      {
        id: `lg_buy_${Date.now()}`,
        at: new Date().toISOString(),
        source: 'buy_stub',
        amount,
        note,
      },
      ...store.ledger,
    ].slice(0, 80);
    localStorage.setItem(WALLET_KEY, JSON.stringify(store));
    window.dispatchEvent(new Event('myface-wallet'));
    return store.balance;
  } catch {
    return null;
  }
}
