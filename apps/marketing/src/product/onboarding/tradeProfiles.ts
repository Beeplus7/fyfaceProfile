export type Trade =
  | 'Tailor'
  | 'Mechanic'
  | 'Builder'
  | 'Barber'
  | 'Electrician'
  | 'Plumber'
  | 'Other';

export type TradeProfile = {
  specialtyPlaceholder: string;
  shopPlaceholder: string;
  bioPlaceholder: string;
  igPlaceholder: string;
  tools: string[];
  materials: string[];
  customers: string[];
  verification: string[];
  avgJobHint: string;
  avgJobPlaceholder: string;
  blueprintPlaceholder: string;
  shopListPlaceholder: string;
  shopQuestion: string;
};

export const TRADE_PROFILES: Record<Trade, TradeProfile> = {
  Tailor: {
    specialtyPlaceholder: 'e.g. Aso-Ebi wedding dresses, Gele, alterations',
    shopPlaceholder: "Ayo's Tailors Spindlegate Oldham OL1",
    bioPlaceholder: 'Touch of GOD in every stitch. 12yrs Aso-Ebi. Oldham.',
    igPlaceholder: '@ayos_tailors_oldham',
    tools: ['Juki industrial', 'Lace scissors / overlocker', 'Dress form / mannequin', 'Steam iron / press', 'Other'],
    materials: ['Aso-Ebi lace £45/m', 'Velvet / George', 'Aso-Oke', 'Gele / headwrap stock', 'Thread & lining', 'Other'],
    customers: ['Brides', 'Aso-Ebi party clients', 'Alteration walk-ins', 'Church / event groups'],
    verification: ['Public liability insurance', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Typical bridal / Aso-Ebi job around £250–£450',
    avgJobPlaceholder: '320',
    blueprintPlaceholder: 'Hand sketch, fabric swatch board, measurement sheet',
    shopListPlaceholder: 'Lace 6 colours, Gele, lining, zippers',
    shopQuestion: 'Do you sell fabrics / Gele / materials in your shop?',
  },
  Mechanic: {
    specialtyPlaceholder: 'e.g. Toyota Corolla OBD2 P0302, DPF regen, hybrids',
    shopPlaceholder: 'Reid Autos Oldham OL1',
    bioPlaceholder: 'Diagnostics first. Toyota / hybrid specialist. Oldham.',
    igPlaceholder: '@reid_autos_oldham',
    tools: ['OBD2 scanner', '2-post lift', 'Torque wrenches', 'DPF / diagnostic kit', 'Other'],
    materials: ['Brake pads & discs', 'Oil / filters', 'Toyota OEM parts', 'Hybrid battery tools', 'Other'],
    customers: ['Toyota / hybrid owners', 'Fleet vans', 'MOT fail walk-ins', 'Local regulars'],
    verification: ['Public liability insurance', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Typical diagnostic / service job around £120–£250',
    avgJobPlaceholder: '150',
    blueprintPlaceholder: 'OBD report printout, photo of fault codes, parts list',
    shopListPlaceholder: 'Brake pads Toyota, oil filters, wiper blades',
    shopQuestion: 'Do you sell parts / consumables from the workshop?',
  },
  Builder: {
    specialtyPlaceholder: 'e.g. kitchen remodel, loft conversion, brickwork',
    shopPlaceholder: 'Voss Builds Oldham',
    bioPlaceholder: 'Brick to finish. Kitchen & loft specialist. Oldham.',
    igPlaceholder: '@voss_builds',
    tools: ['Laser level', 'Mixer / mixer drill', 'Scaffold / tower', 'Circular saw', 'Other'],
    materials: ['Cement & timber', 'Insulation', 'Plasterboard', 'Kitchen units / fittings', 'Other'],
    customers: ['Homeowners', 'Landlords', 'Kitchen remodel clients', 'Extension clients'],
    verification: ['Public liability insurance', 'CSCS / trade card', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Typical remodel / build package often £5k–£15k+',
    avgJobPlaceholder: '8000',
    blueprintPlaceholder: 'CAD, site measure drawings, photo survey',
    shopListPlaceholder: 'Timber offcuts, fittings (if retail)',
    shopQuestion: 'Do you sell materials / fittings to customers?',
  },
  Barber: {
    specialtyPlaceholder: 'e.g. skin fade, burst fade, line design, beard sculpt',
    shopPlaceholder: 'Fade Room Oldham OL1',
    bioPlaceholder: 'Clean fades. Line design. Oldham chair.',
    igPlaceholder: '@faderoom_oldham',
    tools: ['Wahl / Andis clippers', 'Fade blades', 'Trimmers', 'Hot towel / steamer', 'Other'],
    materials: ['Pomade / clay', 'Aftershave', 'Shampoo / tonic', 'Disposable necks', 'Other'],
    customers: ['Fade clients', 'Beard clients', 'Kids cuts', 'Walk-ins'],
    verification: ['Public liability insurance', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Typical fade / cut around £18–£35',
    avgJobPlaceholder: '25',
    blueprintPlaceholder: 'Reference photo board, style menu',
    shopListPlaceholder: 'Pomade, aftershave, beard oil',
    shopQuestion: 'Do you sell grooming products in the shop?',
  },
  Electrician: {
    specialtyPlaceholder: 'e.g. consumer unit 230V RCD 30mA, EV charger, rewires',
    shopPlaceholder: 'OL1 Electrical',
    bioPlaceholder: 'BS 7671 Part P. Consumer units & testing. Oldham.',
    igPlaceholder: '@ol1_electrical',
    tools: ['Multimeter CAT III', 'RCD / loop tester 30mA', 'Insulation resistance tester', 'Torque screwdriver', 'Other'],
    materials: ['Cable 2.5mm / 6mm', 'Consumer unit / RCBO', 'Sockets & switches', 'EV charger kits', 'Other'],
    customers: ['Homeowners 230V', 'Landlords', 'Small businesses', 'EV charger installs'],
    verification: ['BS 7671 Part P Compliant', 'Public liability insurance', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Typical consumer unit / install around £150–£400',
    avgJobPlaceholder: '180',
    blueprintPlaceholder: 'Circuit schedule, EIC photo, board layout sketch',
    shopListPlaceholder: 'RCBOs, sockets (if you retail)',
    shopQuestion: 'Do you sell electrical parts to customers?',
  },
  Plumber: {
    specialtyPlaceholder: 'e.g. Worcester Bosch boiler 68C, TRVs, bathrooms',
    shopPlaceholder: 'SafeHeat Plumbing Oldham',
    bioPlaceholder: 'Gas Safe. Worcester Bosch & bathrooms. Oldham.',
    igPlaceholder: '@safeheat_oldham',
    tools: ['Gas Safe manometer', 'Flue analyser', 'Pipe cutters / press tool', 'Drain kit', 'Other'],
    materials: ['Worcester Bosch parts', 'TRVs / radiators', 'Copper / MLCP fittings', 'Bathroom suites', 'Other'],
    customers: ['Boiler breakdown', 'Landlord gas safety', 'Bathroom installs', 'Homeowners'],
    verification: ['Gas Safe 123456', 'Public liability insurance', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Typical call-out / boiler job around £100–£250',
    avgJobPlaceholder: '150',
    blueprintPlaceholder: 'Boiler schematic, bathroom layout, parts list',
    shopListPlaceholder: 'TRVs, washers, boiler parts',
    shopQuestion: 'Do you sell plumbing parts / spares?',
  },
  Other: {
    specialtyPlaceholder: 'Describe your craft specialty in one line',
    shopPlaceholder: 'Your workshop / brand name',
    bioPlaceholder: 'Show your work — not a CV.',
    igPlaceholder: '@your_work_handle',
    tools: ['Primary toolset', 'Phone / camera for proof', 'Measuring tools', 'Other'],
    materials: ['Core materials you stock', 'Consumables', 'Other'],
    customers: ['Local homeowners', 'Repeat clients', 'Businesses', 'Walk-ins'],
    verification: ['Public liability insurance', 'Portfolio video proof', 'Client video testimonial', 'None yet'],
    avgJobHint: 'Your typical paid job value',
    avgJobPlaceholder: '200',
    blueprintPlaceholder: 'Sketch, photo measure, or none — show work',
    shopListPlaceholder: 'Items you sell (if any)',
    shopQuestion: 'Do you sell products / materials to customers?',
  },
};

export function profileFor(trade: string | undefined): TradeProfile {
  if (trade && trade in TRADE_PROFILES) {
    return TRADE_PROFILES[trade as Trade];
  }
  return TRADE_PROFILES.Other;
}
