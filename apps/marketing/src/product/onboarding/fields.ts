import { profileFor } from './tradeProfiles';

export type FieldType = 'text' | 'select' | 'multi' | 'yesno' | 'number';

export interface FieldDef {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
  help?: string;
  required?: boolean;
  phase: 1 | 2 | 3 | 4;
  appliesIf?: (a: Record<string, any>) => boolean;
}

/** Base field schema — options/placeholders are resolved per trade at render time. */
export const ALL_FIELDS: FieldDef[] = [
  {
    id: 'tradeType',
    type: 'select',
    label: 'What is your primary craft?',
    options: ['Tailor', 'Mechanic', 'Builder', 'Barber', 'Electrician', 'Plumber', 'Other'],
    required: true,
    phase: 1,
    help: 'This unlocks trade-specific questions only — not other crafts.',
  },
  {
    id: 'tradeSpecialty',
    type: 'text',
    label: 'Your specialty in one line',
    placeholder: 'Your craft specialty',
    phase: 1,
    required: true,
  },
  {
    id: 'yearsExperience',
    type: 'number',
    label: 'Years in this craft?',
    placeholder: '12',
    required: true,
    phase: 1,
  },
  {
    id: 'shopName',
    type: 'text',
    label: 'Workshop / shop name',
    placeholder: 'Your workshop name',
    phase: 1,
  },
  {
    id: 'location',
    type: 'select',
    label: 'Base location',
    options: ['Oldham OL1', 'Oldham OL2', 'Oldham OL8', 'Manchester', 'Other'],
    required: true,
    phase: 1,
  },
  {
    id: 'workRadius',
    type: 'number',
    label: 'Work radius for Work Feed (miles)',
    placeholder: '10',
    phase: 1,
    help: 'Default 10 miles for local discovery',
  },
  {
    id: 'bio',
    type: 'text',
    label: 'Craft bio — show work, not CV',
    placeholder: 'One line about your craft',
    phase: 1,
  },
  {
    id: 'instagramHandle',
    type: 'text',
    label: 'Work Instagram / TikTok (optional)',
    placeholder: '@your_handle',
    phase: 1,
  },
  {
    id: 'tools',
    type: 'multi',
    label: 'Core tools you own for this craft',
    options: [],
    phase: 2,
    required: true,
    help: 'Options match your trade only',
  },
  {
    id: 'materials',
    type: 'multi',
    label: 'Materials / stock for this craft',
    options: [],
    phase: 2,
  },
  {
    id: 'signatureJobs',
    type: 'multi',
    label: 'How do you prove finished jobs?',
    options: [
      'Before/After Slider',
      'Timelapse Build',
      'Milestone Check',
      'Price Reveal',
      'Tool Stack Photo',
    ],
    required: true,
    phase: 2,
  },
  {
    id: 'avgJobPrice',
    type: 'number',
    label: 'Average job price (£) for your craft',
    placeholder: '200',
    required: true,
    phase: 2,
  },
  {
    id: 'availability',
    type: 'multi',
    label: 'Weekly availability',
    options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    phase: 2,
  },
  {
    id: 'projectBlueprint',
    type: 'text',
    label: 'How do you plan / blueprint jobs?',
    placeholder: 'Sketch, measure, photo…',
    phase: 2,
  },
  {
    id: 'firstProjects',
    type: 'number',
    label: 'How many past projects can you upload now?',
    placeholder: '3',
    phase: 3,
    required: true,
  },
  {
    id: 'shopItems',
    type: 'yesno',
    label: 'Do you sell products / materials to customers?',
    options: ['yes', 'no'],
    required: true,
    phase: 3,
  },
  {
    id: 'shopItemsList',
    type: 'text',
    label: 'List what you sell',
    placeholder: 'Items you retail',
    phase: 3,
    appliesIf: (a) => a.shopItems === 'yes',
  },
  {
    id: 'bookingPrefs',
    type: 'select',
    label: 'Booking flow you prefer',
    options: [
      'Instant Booking',
      'Quote First',
      'Custom Offer + 10% escrow',
      'Shop 5% fee',
    ],
    phase: 3,
  },
  {
    id: 'liveWorkshopSetup',
    type: 'yesno',
    label: 'Do you have tripod + phone for Live Workshop?',
    options: ['yes', 'no'],
    phase: 3,
  },
  {
    id: 'verificationDocs',
    type: 'multi',
    label: 'Verification you can show for this craft',
    options: [],
    phase: 3,
  },
  {
    id: 'gasSafeNumber',
    type: 'text',
    label: 'Gas Safe registration number',
    placeholder: '123456',
    phase: 3,
    appliesIf: (a) =>
      a.tradeType === 'Plumber' ||
      (Array.isArray(a.verificationDocs) &&
        a.verificationDocs.some((v: string) => v.startsWith('Gas Safe'))),
  },
  {
    id: 'consumerUnitDetails',
    type: 'text',
    label: 'Last consumer unit / electrical job spec',
    placeholder: '230V, RCD 30mA, BS 7671…',
    phase: 3,
    appliesIf: (a) => a.tradeType === 'Electrician',
  },
  {
    id: 'boilerType',
    type: 'select',
    label: 'Boiler specialism',
    options: [
      'Worcester Bosch Greenstar',
      'Vaillant ecoTEC',
      'Baxi',
      'Ideal',
      'Other',
    ],
    phase: 3,
    appliesIf: (a) => a.tradeType === 'Plumber',
  },
  {
    id: 'obd2Specialty',
    type: 'text',
    label: 'OBD2 / diagnostic specialty',
    placeholder: 'Toyota P0302, DPF, hybrid…',
    phase: 3,
    appliesIf: (a) => a.tradeType === 'Mechanic',
  },
  {
    id: 'asoEbiFabrics',
    type: 'text',
    label: 'Aso-Ebi fabrics you stock + price/m',
    placeholder: 'Lace £45/m, Aso-Oke £60/m…',
    phase: 3,
    appliesIf: (a) => a.tradeType === 'Tailor',
  },
  {
    id: 'fadeDesign',
    type: 'text',
    label: 'Fade / design specialty',
    placeholder: 'Skin fade, line design…',
    phase: 3,
    appliesIf: (a) => a.tradeType === 'Barber',
  },
  {
    id: 'buildSpecialty',
    type: 'text',
    label: 'Signature build type',
    placeholder: 'Kitchen remodel, loft, brickwork…',
    phase: 3,
    appliesIf: (a) => a.tradeType === 'Builder',
  },
  {
    id: 'customerTypes',
    type: 'multi',
    label: 'Who books you most for this craft?',
    options: [],
    phase: 4,
    required: true,
  },
  {
    id: 'pastCustomersCount',
    type: 'number',
    label: 'Past customers count (for Trust / Relationship seed)',
    placeholder: '50',
    phase: 4,
  },
  {
    id: 'relationshipImport',
    type: 'yesno',
    label: 'Import past customers into UPRM?',
    options: ['yes', 'no'],
    phase: 4,
  },
  {
    id: 'mfcGiftPrefs',
    type: 'multi',
    label: 'MFC gifts to enable on your profile',
    options: ['Hammer 10', 'Scissors 25', 'Heart 50', 'Crown 100', 'Trophy 500'],
    phase: 4,
  },
  {
    id: 'journeyGoal',
    type: 'select',
    label: 'Primary goal for the next 90 days',
    options: [
      'More bookings',
      'Higher prices',
      'Shop sales',
      'Live gifts',
      'TrustScore 5.0',
    ],
    required: true,
    phase: 4,
  },
  {
    id: 'consentShowcase',
    type: 'yesno',
    label: 'Showcase your work in the local Work Feed?',
    options: ['yes', 'no'],
    required: true,
    phase: 4,
  },
  {
    id: 'launchDate',
    type: 'text',
    label: 'When should we unlock COMMAND CENTER?',
    placeholder: 'ASAP',
    phase: 4,
  },
];

/** Resolve labels/options/placeholders for the user's chosen trade. */
export function resolveField(
  field: FieldDef,
  answers: Record<string, any>,
): FieldDef {
  const p = profileFor(answers.tradeType);
  const next: FieldDef = { ...field };

  switch (field.id) {
    case 'tradeSpecialty':
      next.placeholder = p.specialtyPlaceholder;
      next.label = `Your ${answers.tradeType || 'craft'} specialty in one line`;
      break;
    case 'shopName':
      next.placeholder = p.shopPlaceholder;
      break;
    case 'bio':
      next.placeholder = p.bioPlaceholder;
      break;
    case 'instagramHandle':
      next.placeholder = p.igPlaceholder;
      break;
    case 'tools':
      next.options = p.tools;
      next.label = `Core ${answers.tradeType || 'craft'} tools you own`;
      break;
    case 'materials':
      next.options = p.materials;
      next.label = `Materials you stock as a ${answers.tradeType || 'pro'}`;
      break;
    case 'avgJobPrice':
      next.help = p.avgJobHint;
      next.placeholder = p.avgJobPlaceholder;
      next.label = `Average ${answers.tradeType || 'job'} price (£)`;
      break;
    case 'projectBlueprint':
      next.placeholder = p.blueprintPlaceholder;
      break;
    case 'shopItems':
      next.label = p.shopQuestion;
      break;
    case 'shopItemsList':
      next.placeholder = p.shopListPlaceholder;
      break;
    case 'verificationDocs':
      next.options = p.verification;
      next.label = `Verification for ${answers.tradeType || 'your craft'}`;
      break;
    case 'customerTypes':
      next.options = p.customers;
      next.label = `Who books your ${answers.tradeType || 'work'} most?`;
      break;
    default:
      break;
  }

  return next;
}
