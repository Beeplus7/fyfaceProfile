export interface CompanionQuestion {
  id: string;
  type: 'text' | 'select' | 'multi' | 'yesno' | 'date' | 'number';
  label: string;
  placeholder?: string;
  options?: string[];
  help?: string;
  required?: boolean;
}

export interface StepConfig {
  id: string;
  title: string;
  description: string;
  progress: number;
  questions: CompanionQuestion[];
}

/** 32 fields · 4 phases — MyFace UPRM companion (VisaGuide format). */
export const STEPS: StepConfig[] = [
  {
    id: 'craftIdentity',
    title: 'Craft Identity',
    description: 'Who you are and how the OS should speak to you',
    progress: 15,
    questions: [
      {
        id: 'uiLanguage',
        type: 'select',
        label: 'Which language should MyFace use with you?',
        options: ['English', 'Français', 'Español', 'Polski', 'اردو', 'বাংলা', 'Yorùbá', 'Other'],
        required: true,
      },
      {
        id: 'displayName',
        type: 'text',
        label: 'What should we call you on your face profile?',
        placeholder: 'Preferred name',
        required: true,
      },
      {
        id: 'trade',
        type: 'select',
        label: 'What is your primary trade?',
        options: ['Tailor', 'Mechanic', 'Builder', 'Barber', 'Electrician', 'Plumber', 'Chef', 'Other'],
        required: true,
      },
      {
        id: 'secondaryTrades',
        type: 'multi',
        label: 'Any secondary skills you also offer?',
        options: ['Tailor', 'Mechanic', 'Builder', 'Barber', 'Electrician', 'Plumber', 'Chef', 'None'],
        required: false,
      },
      {
        id: 'yearsExperience',
        type: 'select',
        label: 'How many years have you been practising?',
        options: ['Under 1', '1–3', '3–5', '5–10', '10+'],
        required: true,
      },
      {
        id: 'businessName',
        type: 'text',
        label: 'Business or workshop name (optional)',
        placeholder: 'e.g. Aisha Bridal Atelier',
        required: false,
      },
      {
        id: 'baseLocation',
        type: 'text',
        label: 'Where is your main workshop / base?',
        placeholder: 'Town / postcode — e.g. Oldham OL1',
        required: true,
      },
      {
        id: 'serviceRadius',
        type: 'select',
        label: 'How far do you travel for jobs?',
        options: ['Workshop only', '5 miles', '10 miles', '25 miles', 'Anywhere in region'],
        required: true,
      },
    ],
  },
  {
    id: 'workDna',
    title: 'Work DNA',
    description: 'How you work, price, and prove trust',
    progress: 40,
    questions: [
      {
        id: 'signatureWork',
        type: 'text',
        label: 'Describe your signature piece of work in one line',
        placeholder: 'e.g. Bespoke lace wedding dress alterations',
        required: true,
      },
      {
        id: 'typicalJob',
        type: 'text',
        label: 'What does a typical paid job look like for you?',
        required: true,
      },
      {
        id: 'avgJobValue',
        type: 'select',
        label: 'Typical job value?',
        options: ['Under £100', '£100–£500', '£500–£2k', '£2k–£10k', '£10k+'],
        required: true,
      },
      {
        id: 'leadTime',
        type: 'select',
        label: 'Usual lead time from booking to finish?',
        options: ['Same day', '2–3 days', '1 week', '2–4 weeks', '1–3 months'],
        required: true,
      },
      {
        id: 'hasPortfolio',
        type: 'yesno',
        label: 'Do you already have photos/videos of finished work?',
        required: true,
      },
      {
        id: 'willingToFilm',
        type: 'yesno',
        label: 'Are you open to filming work-in-progress for discovery?',
        required: true,
      },
      {
        id: 'trustProofs',
        type: 'multi',
        label: 'Which trust proofs can you show?',
        options: ['Gas Safe', 'NICEIC / Part P', 'CSCS', 'Insurance', 'Reviews', 'None yet'],
        required: false,
      },
      {
        id: 'acceptsDeposit',
        type: 'yesno',
        label: 'Do you take deposits / escrow-style payments?',
        required: true,
      },
    ],
  },
  {
    id: 'productionEngine',
    title: 'Production Engine',
    description: 'Tools, bots, and how content gets made',
    progress: 70,
    questions: [
      {
        id: 'contentComfort',
        type: 'select',
        label: 'How comfortable are you creating short-form content?',
        options: ['Newbie', 'Getting there', 'Confident', 'Already posting daily'],
        required: true,
      },
      {
        id: 'preferredCapture',
        type: 'select',
        label: 'Preferred capture style?',
        options: ['Phone selfie cam', 'Tripod / hands-free', 'Customer films me', 'Not sure'],
        required: true,
      },
      {
        id: 'liveWorkshopInterest',
        type: 'yesno',
        label: 'Interested in Live Workshop (PiP / gift rain)?',
        required: true,
      },
      {
        id: 'botAssist',
        type: 'multi',
        label: 'Which OS bots should help first?',
        options: [
          'Booking bot',
          'Quote bot',
          'Follow-up bot',
          'Content caption bot',
          'Trust review bot',
          'MFC gift bot',
          'Not sure yet',
        ],
        required: true,
      },
      {
        id: 'crmNeed',
        type: 'yesno',
        label: 'Do you need a simple pipeline for leads → booked → done?',
        required: true,
      },
      {
        id: 'teamSize',
        type: 'select',
        label: 'Who works with you?',
        options: ['Just me', '2–3 people', '4–10', '10+'],
        required: true,
      },
      {
        id: 'toolsUsed',
        type: 'multi',
        label: 'Tools you already use',
        options: ['WhatsApp', 'Instagram', 'Facebook', 'Google Business', 'Spreadsheet', 'None'],
        required: false,
      },
      {
        id: 'mfcInterest',
        type: 'yesno',
        label: 'Want to enable MFC gifts on your public face?',
        required: true,
      },
    ],
  },
  {
    id: 'uprmBrain',
    title: 'UPRM Brain',
    description: 'Goals, availability, and how the orchestrator should run',
    progress: 100,
    questions: [
      {
        id: 'primaryGoal',
        type: 'select',
        label: 'Primary goal for the next 90 days?',
        options: [
          'More local bookings',
          'Higher average job value',
          'Build trust score',
          'Grow content audience',
          'Hire / train help',
        ],
        required: true,
      },
      {
        id: 'weeklyAvailability',
        type: 'select',
        label: 'Hours you can take new work each week?',
        options: ['Under 10h', '10–20h', '20–40h', 'Full time / flexible'],
        required: true,
      },
      {
        id: 'busyDays',
        type: 'multi',
        label: 'Usually busiest days?',
        options: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        required: false,
      },
      {
        id: 'idealCustomer',
        type: 'text',
        label: 'Who is your ideal customer in one sentence?',
        required: true,
      },
      {
        id: 'avoidJobs',
        type: 'text',
        label: 'Any jobs you want the OS to filter out?',
        placeholder: 'Optional',
        required: false,
      },
      {
        id: 'notifications',
        type: 'select',
        label: 'How should UPRM ping you?',
        options: ['Push only', 'WhatsApp', 'Email', 'All of the above'],
        required: true,
      },
      {
        id: 'referralSource',
        type: 'select',
        label: 'How did you find My Face Profile?',
        options: ['Friend', 'Search', 'Instagram', 'VisaGuide / AiKOVA', 'Other'],
        required: false,
      },
      {
        id: 'readyToGoLive',
        type: 'yesno',
        label: 'Ready to open your public face after this?',
        required: true,
      },
    ],
  },
];
