/**
 * UPRM COMMAND CENTER PID 1 — composed from split Sprint-1 components.
 * Demo seed: AYO'S TAILORS Spindlegate OL1 until Supabase tables applied.
 */
import { useMemo, useState } from 'react';
import { M_GRAD, UPRM_CARD, UPRM_EYE } from '../uprmChrome';
import {
  ArcadePanel,
  BookingCalendar,
  BotArmy,
  GiftRain,
  LiveWorkshop,
  MFCWallet,
  PipelineKanban,
  ProjectCard,
  QuantumBackground,
  ShopCard,
  TrustScoreBadge,
  UPRMContactsList,
  WorkCutEditor,
} from './uprm';

const CONTACTS = [
  { id: '1', name: 'Aisha Bridal', relationship_strength: 94, role: 'Aso-Ebi client', journey_state: 'Quote' },
  { id: '2', name: 'Mrs Okafor', relationship_strength: 87, role: 'Repeat', journey_state: 'Repeat' },
  { id: '3', name: 'J Martinez', relationship_strength: 72, role: 'Toyota P0302', journey_state: 'Inquiry' },
  { id: '4', name: 'Fatima Lace', relationship_strength: 81, role: 'Wholesale', journey_state: 'Engagement' },
];

const PROJECTS = [
  {
    id: 'aso-ebi',
    title: 'Aso-Ebi Wedding Dress',
    cost: 320,
    gift_count: 12,
    milestones: [
      { label: 'Cutting', done: true },
      { label: 'Sewing', done: true },
      { label: 'Fitting', done: false },
    ],
    materials: [{ name: 'Lace', cost: 45 }],
    team: [{ name: 'Ayo' }, { name: '+2' }],
    href: '/projects/aso-ebi',
  },
  {
    id: 'consumer-unit',
    title: 'Consumer Unit 230V',
    cost: 450,
    gift_count: 4,
    milestones: [{ label: 'RCD 30mA', done: true }],
    team: [{ name: 'Ade' }],
    href: '/projects/consumer-unit',
  },
  {
    id: 'p0302',
    title: 'Corolla OBD2 P0302',
    cost: 180,
    gift_count: 3,
    milestones: [{ label: 'Diagnostics', done: true }],
    team: [{ name: 'J' }],
    href: '/projects/p0302',
  },
];

const KANBAN = [
  { id: 'k1', title: 'Aisha Bridal', status: 'Quote', meta: '£320' },
  { id: 'k2', title: 'Fabric restock', status: 'Discovery', meta: '£45/m' },
  { id: 'k3', title: 'Fitting slot', status: 'Booked', meta: 'OL1' },
  { id: 'k4', title: 'Mrs Okafor', status: 'Repeat', meta: '87/100' },
  { id: 'k5', title: 'J Martinez', status: 'Inquiry', meta: 'P0302' },
  { id: 'k6', title: 'Live workshop', status: 'Engagement', meta: 'Go Live' },
  { id: 'k7', title: 'Escrow hold', status: 'In Progress', meta: '10%' },
  { id: 'k8', title: 'Review ask', status: 'Final', meta: 'Trust' },
];

const BOOKINGS = [
  { id: 'b1', contact_name: 'Aisha', status: 'Booked', calendar_date: new Date().toISOString().slice(0, 10), revenue: 320 },
];

export default function UprmCommandCenter() {
  const [rain, setRain] = useState(0);
  const [liveViewers, setLiveViewers] = useState(0);
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <QuantumBackground className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1600px] px-4 py-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mono text-[11px] tracking-[0.18em] uppercase text-white/50">
              UPRM COMMAND CENTER · PID 1
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif' }}>
              AYO&apos;S TAILORS · Spindlegate OL1
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <TrustScoreBadge score={4.9} />
            <span className="rounded-full px-3 py-1.5 text-[11px] font-bold text-black" style={{ background: M_GRAD }}>
              MFC 1,247
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            ['Projects', '12'],
            ['Contacts', '47'],
            ['Pipeline', '£8,420'],
            ['Trust', '4.9'],
            ['MFC', '1,247'],
            ['Reach', '12.4K'],
          ].map(([k, v]) => (
            <div key={k} className={`${UPRM_CARD} p-3`}>
              <div className={UPRM_EYE}>{k}</div>
              <div className="text-xl font-extrabold mt-1">{v}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="mono text-[10px] text-white/45 uppercase">Projects Commander</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {PROJECTS.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
          <UPRMContactsList contacts={CONTACTS} />
        </div>

        <PipelineKanban cards={KANBAN} />

        <div className="grid lg:grid-cols-3 gap-4">
          <ShopCard
            item={{
              id: 'lace',
              title: 'Aso-Ebi lace',
              price: 45,
              stock: 24,
              delivery_radius_mi: 10,
              escrow_pct: 5,
            }}
          />
          <BookingCalendar
            bookings={BOOKINGS.map((b) => ({ ...b, calendar_date: b.calendar_date || today }))}
            pipelineTotal={8420}
          />
          <LiveWorkshop
            viewers={liveViewers}
            onGoLive={(on) => {
              setLiveViewers(on ? 124 : 0);
              if (on) setRain((n) => n + 1);
            }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <WorkCutEditor onExport={() => setRain((n) => n + 1)} />
          <GiftRain trigger={rain} onGift={() => setRain((n) => n + 1)} />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <MFCWallet balance={1247} />
          <ArcadePanel />
          <BotArmy />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
          <div className="text-[14px] font-bold">Your Work Is Your Face. Promote. Enhance — Go Live Now</div>
          <div className="mono text-[10px] text-white/45 mt-2">
            £9,620/week → £618K ARR · Sprint 1 split components live · Apply supabase/schema.sql for persistence
          </div>
        </div>
      </div>
    </QuantumBackground>
  );
}
