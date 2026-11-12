export type SitePage = {
  path: string;
  label: string;
  group: 'core' | 'verticals' | 'content' | 'legal' | 'product';
  blurb: string;
};

/** Canonical marketing sitemap — keep in sync with App.tsx routes. */
export const SITE_PAGES: SitePage[] = [
  { path: '/', label: 'Hero Home', group: 'core', blurb: 'Your Work Is Your Face' },
  { path: '/how-it-works', label: 'How It Works', group: 'core', blurb: 'Work → Content → Discovery' },
  { path: '/work-os', label: 'Work OS', group: 'core', blurb: 'Kernel · UPRM · Apps' },
  { path: '/uprm', label: 'UPRM Orchestrator', group: 'core', blurb: 'Pipeline orchestration' },
  { path: '/live-workshop', label: 'Live Workshop', group: 'core', blurb: 'Hands-free gift rain' },
  { path: '/projects', label: 'Projects', group: 'core', blurb: 'SEO project grid' },
  { path: '/projects/demo', label: 'Project Detail', group: 'core', blurb: 'Before/after blueprint' },
  { path: '/pricing', label: 'Public Pricing', group: 'core', blurb: 'Free to join · 3 pays' },
  { path: '/revenue-model', label: 'Revenue Model', group: 'core', blurb: '100 → 1,000 in 3 months' },
  { path: '/go-live-expenditure', label: 'Go Live Expenditure', group: 'core', blurb: '10k users · UK + Nigeria' },
  { path: '/dataset-store', label: 'B2B Dataset Store', group: 'core', blurb: 'Physical AI marketplace' },
  { path: '/video-to-cash', label: 'Video → Cash', group: 'core', blurb: 'Capture guide · dual pay' },
  { path: '/trust', label: 'Trust Ledger', group: 'core', blurb: 'TrustScore 4.9' },
  { path: '/verticals', label: 'Verticals Hub', group: 'verticals', blurb: 'All trades' },
  { path: '/for-tailors', label: 'For Tailors', group: 'verticals', blurb: 'Bespoke lace Oldham' },
  { path: '/for-mechanics', label: 'For Mechanics', group: 'verticals', blurb: 'Diagnostics' },
  { path: '/for-builders', label: 'For Builders', group: 'verticals', blurb: 'Brick & reno' },
  { path: '/for-barbers', label: 'For Barbers', group: 'verticals', blurb: 'Fade design' },
  { path: '/for-electricians', label: 'For Electricians', group: 'verticals', blurb: 'BS 7671' },
  { path: '/for-plumbers', label: 'For Plumbers', group: 'verticals', blurb: 'Gas Safe' },
  { path: '/about', label: 'About', group: 'content', blurb: 'VisaguideOS → MyFace' },
  { path: '/careers', label: 'Careers', group: 'content', blurb: 'Build OS brick by brick' },
  { path: '/contact', label: 'Contact', group: 'content', blurb: 'Oldham OL1' },
  { path: '/blog', label: 'Blog', group: 'content', blurb: 'Craft stories' },
  { path: '/blog/aisha-47-dresses', label: 'Blog Detail', group: 'content', blurb: 'Longform SEO' },
  { path: '/signup', label: 'Sign up', group: 'product', blurb: 'Create account' },
  { path: '/login', label: 'Login', group: 'product', blurb: 'Email + Google' },
  { path: '/app/onboarding', label: 'UPRM Onboarding', group: 'product', blurb: '32 fields · 4 phases' },
  { path: '/app/dashboard', label: 'UPRM Dashboard', group: 'product', blurb: 'Command center' },
  { path: '/app/arcade', label: 'Games Center', group: 'product', blurb: 'Play · earn MFC · stream live' },
  { path: '/app/arcade?tab=economics', label: 'Ad Revenue Scorecard', group: 'product', blurb: 'AdGate → MFC offers' },
  { path: '/app/live', label: 'Live Viewer', group: 'product', blurb: 'TikTok-style gift economy session' },
  { path: '/app/feed', label: 'Timeline Feed', group: 'product', blurb: 'Snap scroll WorkCuts · music · gifts' },
  { path: '/app/discover', label: 'Discover', group: 'product', blurb: 'Search makers · trades · live · trending' },
  { path: '/app/studio/stream', label: 'Streaming Studio', group: 'product', blurb: 'Admin Go Live video studio' },
  { path: '/app/studio/workcut', label: 'WorkCut Studio', group: 'product', blurb: 'Admin CapCut-style editor' },
  { path: '/demo', label: 'Test Lab', group: 'product', blurb: 'One-click Oldham smoke seed' },
  { path: '/onboarding', label: 'Onboarding (marketing)', group: 'product', blurb: 'Demo landing page' },
  { path: '/architecture', label: 'Architecture', group: 'product', blurb: 'Project tree' },
  { path: '/readiness', label: 'Production Readiness', group: 'product', blurb: 'System build monitor' },
  { path: '/sitemap', label: 'Sitemap', group: 'content', blurb: 'All pages map' },
  { path: '/help', label: 'Help & FAQ', group: 'legal', blurb: 'Escrow · MFC FAQ' },
  { path: '/legal/privacy', label: 'Privacy', group: 'legal', blurb: 'GDPR' },
  { path: '/legal/terms', label: 'Terms', group: 'legal', blurb: 'Platform terms' },
  { path: '/legal/coins', label: 'MFC Coins', group: 'legal', blurb: 'Gift economy rules' },
];

export const SITE_PAGE_GROUPS: { id: SitePage['group']; label: string }[] = [
  { id: 'core', label: 'Core OS' },
  { id: 'verticals', label: 'Trade Verticals' },
  { id: 'content', label: 'Content & Growth' },
  { id: 'product', label: 'Product / Auth' },
  { id: 'legal', label: 'Legal & Help' },
];
