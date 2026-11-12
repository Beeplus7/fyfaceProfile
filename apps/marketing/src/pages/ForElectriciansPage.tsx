import TradeVerticalPage from './TradeVerticalPage';
import electricianImg from '../assets/c898e4b8391d7d79-image_20261029_190128.webp';

export default function ForElectriciansPage() {
  return (
    <TradeVerticalPage
      trade={{
        slug: 'for-electricians',
        label: 'Electricians',
        eyebrow: 'Consumer unit • BS 7671 • Part P • Oldham',
        headline: 'Certs on the job.',
        headlineAccent: 'Not in the van.',
        sub: 'Show consumer unit installs with 230V ~50Hz, RCD 30mA, BS 7671 Part P compliance pinned to the project. Safety cert + materials + escrow — holy electrician energy, not SaaS fluff.',
        heroStats: [
          { k: 'Electricians', v: '87 Oldham' },
          { k: 'Trust', v: '4.9 ★' },
          { k: 'Avg job', v: '£180' },
        ],
        proofs: [
          {
            title: 'Consumer unit proof',
            meta: 'Live project',
            detail: 'Voltage, protection, standard overlays on the install photo. Clients see compliance before they book.',
          },
          {
            title: 'Safety cert auto-attach',
            meta: 'Compliance',
            detail: 'EIC, Part P notification, RCD test sheet, and materials receipt stay pinned to the job forever.',
          },
          {
            title: 'NICEIC-ready profile',
            meta: 'Trust Ledger',
            detail: 'Verified reviews only after escrow release. Your badge lifts local search for “electrician Oldham”.',
          },
        ],
        bullets: [
          'Project pages rank: consumer unit Oldham, RCD install, Part P compliant.',
          'Quote → deposit → milestone release without chasing bank transfers.',
          'WorkCut trims install clips into before/after trust assets.',
          'Free to show work; grow with Pro bots and boost when ready.',
        ],
        cta: 'Join as Electrician — Free',
        image: electricianImg,
        imageAlt: 'Electrician working on a consumer unit installation',
      }}
    />
  );
}
