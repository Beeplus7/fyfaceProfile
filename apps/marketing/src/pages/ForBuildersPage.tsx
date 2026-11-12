import TradeVerticalPage from './TradeVerticalPage';
import builderImg from '../assets/727cc9fbccc433e9-image_20261029_173918.webp';

export default function ForBuildersPage() {
  return (
    <TradeVerticalPage
      trade={{
        slug: 'for-builders',
        label: 'Builders',
        eyebrow: 'Brick • Extensions • Escrow milestones • Oldham',
        headline: 'Brickwork is your',
        headlineAccent: 'storefront.',
        sub: 'Log design → demolition → build → final with photos, materials (£2,480 BOM), and escrow releases. Clients fund milestones; you show proof — not empty Instagram posts.',
        heroStats: [
          { k: 'Builders', v: '124 live' },
          { k: 'Trust', v: '4.8 ★' },
          { k: 'Escrow', v: 'Milestones' },
        ],
        proofs: [
          {
            title: 'Milestone escrow',
            meta: 'Money safe',
            detail: 'Design funded, demolition released on proof, build paid as brick courses rise. Stripe holds until approval.',
          },
          {
            title: 'Before → after SEO',
            meta: 'Projects',
            detail: '1990s kitchen to 2024 modern ranks forever. Every project page is a living portfolio + Google surface.',
          },
          {
            title: 'Site diary that sells',
            meta: 'Work OS',
            detail: 'Daily brick photos, materials clipboard, van on site — UPRM turns logs into trust and the next enquiry.',
          },
        ],
        bullets: [
          'Project timeline beats posts: months of linked proof vs 24h burial.',
          'Materials + labour tracked per milestone with verified client approval.',
          'Gift Hammer moments on final reveal — emotional close, escrow release.',
          'Start free; Pro unlocks unlimited projects and boost credits.',
        ],
        cta: 'Create Builder Profile — Free',
        image: builderImg,
        imageAlt: 'Oldham builders laying bricks on an extension',
      }}
    />
  );
}
