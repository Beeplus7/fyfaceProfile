export const BRAND = {
  name: 'My Face Profile',
  tagline: 'Your Work Is Your Face. Not Your CV.',
  showConnectGrow: 'SHOW · CONNECT · GROW',
  gradient:
    'linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)',
  colors: {
    lime: '#8FFF4A',
    teal: '#00E5C0',
    blue: '#1A7CFF',
    yellow: '#FFE600',
    orange: '#FF8A00',
    ink: '#050505',
  },
} as const;

export const OLDHAM = {
  testShop: "AYO'S TAILORS",
  address: 'Spindlegate, Oldham OL1',
  radiusMi: 10,
  demoContact: { name: 'Aisha Bridal', strength: 94 },
  demoProject: {
    title: 'Aso-Ebi Wedding Dress',
    cost: 320,
    materialsPerMetre: 45,
  },
} as const;

export const ESCROW = {
  jobsPct: 10,
  shopPct: 5,
  giftProPct: 70,
  giftPlatformPct: 30,
} as const;

export const PORTS = {
  marketing: 3000,
  web: 3001,
} as const;
