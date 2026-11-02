import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import LiveGiftOverlay from './LiveGiftOverlay';
import LiveGiftShop from './LiveGiftShop';
import {
  LIVE_GIFT_SHOP_OPEN,
  type LiveGift,
  type LiveGiftShopOpenDetail,
} from './liveGifts';

function defaultFromName(detail?: LiveGiftShopOpenDetail) {
  if (detail?.fromName?.trim()) return detail.fromName.trim();
  try {
    const name = localStorage.getItem('myface.live.guestName');
    if (name?.trim()) return name.trim();
  } catch {
    /* ignore */
  }
  return 'Viewer';
}

type Props = {
  /** Called after a successful send (feed rain / chat / gift count). */
  onSent?: (gift: LiveGift, meta: { cardId?: string; fromName: string }) => void;
};

/**
 * Single app-level gift shop + overlay (portaled to body).
 * Survives feed overflow:hidden and works from header / right-rail / stage Gift buttons.
 */
export default function LiveGiftPortal({ onSent }: Props) {
  const [open, setOpen] = useState(false);
  const [fromName, setFromName] = useState('Viewer');
  const [cardId, setCardId] = useState<string | undefined>();

  useEffect(() => {
    const onOpen = (ev: Event) => {
      const detail = (ev as CustomEvent<LiveGiftShopOpenDetail>).detail || {};
      setFromName(defaultFromName(detail));
      setCardId(detail.cardId);
      setOpen(true);
    };
    window.addEventListener(LIVE_GIFT_SHOP_OPEN, onOpen);
    return () => window.removeEventListener(LIVE_GIFT_SHOP_OPEN, onOpen);
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <LiveGiftOverlay />
      <LiveGiftShop
        open={open}
        onClose={() => setOpen(false)}
        fromName={fromName}
        onSent={(gift) => {
          onSent?.(gift, { cardId, fromName });
        }}
      />
    </>,
    document.body,
  );
}
