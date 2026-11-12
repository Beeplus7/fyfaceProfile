import TradeVerticalPage from './TradeVerticalPage';
import barberImg from '../assets/f05e570703efee3a-image_20261029_173914.webp';

export default function ForBarbersPage() {
  return (
    <TradeVerticalPage
      trade={{
        slug: 'for-barbers',
        label: 'Barbers',
        eyebrow: 'Fades • Beards • Live shop floor • Oldham',
        headline: 'Your chair is the',
        headlineAccent: 'content.',
        sub: 'Go live while you cut. Gift scissors, book £25 fades, sell clippers mid-stream. TrustScore lifts you in the Oldham Work Feed — no dancing required.',
        heroStats: [
          { k: 'Watching', v: '127 live' },
          { k: 'Trust', v: '4.9 ★' },
          { k: 'Fades', v: '312 verified' },
        ],
        proofs: [
          {
            title: 'Live fade cam',
            meta: 'Live Workshop',
            detail: 'Hands-free tripod on the chair. Clients watch the line, gift MFC, book the next slot.',
          },
          {
            title: 'Shop the question',
            meta: 'Commerce',
            detail: '“Which clippers?” becomes a £45 pin. Turn craft talk into checkout without leaving the cut.',
          },
          {
            title: 'Trust Ledger',
            meta: 'Proof',
            detail: 'Every finished fade mints verified proof. Search “barber Oldham fade” ranks your work, not a filter selfie.',
          },
        ],
        bullets: [
          'Work Feed shows live fades within 0.8mi — proximity + proof, not hashtags.',
          'UPRM pipeline: inquiry → book → paid → rated without DM chaos.',
          'Gift economy + escrow-ready bookings for walk-ins and appointments.',
          'Free forever to show work; boost when you want more reach.',
        ],
        cta: 'Join as Barber — Free',
        image: barberImg,
        imageAlt: 'Barber giving a skin fade with line design',
      }}
    />
  );
}
