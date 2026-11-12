import TradeVerticalPage from './TradeVerticalPage';
import plumberImg from '../assets/a0e4b743decf2716-image_20261029_190129.webp';

export default function ForPlumbersPage() {
  return (
    <TradeVerticalPage
      trade={{
        slug: 'for-plumbers',
        label: 'Plumbers',
        eyebrow: 'Boiler • Heating • Gas Safe • Oldham',
        headline: 'Gas Safe on the job.',
        headlineAccent: 'Not in the van.',
        sub: 'Show Worcester Bosch 68°C boiler fixes with pressure 1.2 bar, flue secure, and Gas Safe ID pinned to the project. Escrow before heat — clients book from proof, not promises.',
        heroStats: [
          { k: 'Plumbers', v: '76 Oldham' },
          { k: 'Trust', v: '4.9 ★' },
          { k: 'Avg job', v: '£150' },
        ],
        proofs: [
          {
            title: 'Boiler fix proof',
            meta: 'Live project',
            detail: 'Temp, pressure, and Gas Safe badge overlay the install. Customers see compliance before they book.',
          },
          {
            title: 'Gas Safe verified',
            meta: 'Compliance',
            detail: 'Register ID, tightness test Pass, and flue check stay attached to the job in Trust Ledger.',
          },
          {
            title: 'Escrow before heat',
            meta: 'Money safe',
            detail: '£150 fixed quotes with deposit held until the boiler is live and the client approves.',
          },
        ],
        bullets: [
          'Work Feed ranks “plumber Oldham boiler” on proximity + verified jobs.',
          'UPRM pipeline: search → book → invoice → Trust Ledger → repeat.',
          'WorkCut turns pressure checks and flue clips into before/after trust.',
          'Free to show work; Pro unlocks boost and full bot army when you grow.',
        ],
        cta: 'Join as Plumber — Free',
        image: plumberImg,
        imageAlt: 'Plumber working on a Worcester Bosch boiler installation',
      }}
    />
  );
}
