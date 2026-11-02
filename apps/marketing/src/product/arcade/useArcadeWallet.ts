import { useCallback, useEffect, useState } from 'react';
import { GAME_REWARDS, type GameId } from './mfcEconomy';

const KEY = 'myface_arcade_mfc_v1';

type LedgerRow = {
  id: string;
  at: string;
  source: 'game_earn' | 'gift_spend' | 'buy_stub';
  gameId?: GameId;
  amount: number;
  note: string;
};

type Store = {
  balance: number;
  sessionEarned: Partial<Record<GameId, number>>;
  ledger: LedgerRow[];
};

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch {
    /* ignore */
  }
  return { balance: 1247, sessionEarned: {}, ledger: [] };
}

function save(s: Store) {
  localStorage.setItem(KEY, JSON.stringify(s));
}

export function useArcadeWallet() {
  const [store, setStore] = useState<Store>(() =>
    typeof window === 'undefined' ? { balance: 1247, sessionEarned: {}, ledger: [] } : load(),
  );

  useEffect(() => {
    save(store);
  }, [store]);

  useEffect(() => {
    const sync = () => setStore(load());
    window.addEventListener('myface-wallet', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('myface-wallet', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const creditBuy = useCallback((amount: number, note = 'Stripe buy stub') => {
    if (amount <= 0) return;
    setStore((prev) => {
      const row: LedgerRow = {
        id: `lg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        at: new Date().toISOString(),
        source: 'buy_stub',
        amount,
        note,
      };
      return {
        ...prev,
        balance: prev.balance + amount,
        ledger: [row, ...prev.ledger].slice(0, 80),
      };
    });
  }, []);

  const creditGame = useCallback((gameId: GameId, amount: number, note: string) => {
    if (amount <= 0) return 0;
    const cap = GAME_REWARDS[gameId].sessionCap;
    setStore((prev) => {
      const already = prev.sessionEarned[gameId] ?? 0;
      const room = Math.max(0, cap - already);
      const grant = Math.min(amount, room);
      if (grant <= 0) return prev;
      const row: LedgerRow = {
        id: `lg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        at: new Date().toISOString(),
        source: 'game_earn',
        gameId,
        amount: grant,
        note,
      };
      return {
        balance: prev.balance + grant,
        sessionEarned: { ...prev.sessionEarned, [gameId]: already + grant },
        ledger: [row, ...prev.ledger].slice(0, 80),
      };
    });
    return amount;
  }, []);

  const spendGift = useCallback((mfc: number, note: string) => {
    setStore((prev) => {
      if (prev.balance < mfc) return prev;
      const row: LedgerRow = {
        id: `lg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        at: new Date().toISOString(),
        source: 'gift_spend',
        amount: -mfc,
        note,
      };
      return {
        ...prev,
        balance: prev.balance - mfc,
        ledger: [row, ...prev.ledger].slice(0, 80),
      };
    });
  }, []);

  const resetSessionCaps = useCallback(() => {
    setStore((prev) => ({ ...prev, sessionEarned: {} }));
  }, []);

  return {
    balance: store.balance,
    sessionEarned: store.sessionEarned,
    ledger: store.ledger,
    creditGame,
    creditBuy,
    spendGift,
    resetSessionCaps,
  };
}
