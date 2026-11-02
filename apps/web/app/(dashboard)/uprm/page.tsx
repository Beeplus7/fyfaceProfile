'use client';

/**
 * PID 1 MAIN — UPRM COMMAND CENTER
 * apps/web/app/(dashboard)/uprm/page.tsx
 */
import { useState } from 'react';
import {
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
} from '../../../components/uprm';

const GRAD =
  'linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)';

export default function UprmPage() {
  const [rain, setRain] = useState(0);

  return (
    <QuantumBackground className="min-h-screen bg-[#050505] text-white">
      <main className="mx-auto max-w-[1600px] px-4 py-6 space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.16em', opacity: 0.55 }}>
              UPRM · PID 1 · MAIN BRAIN
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '4px 0 0' }}>AYO&apos;S TAILORS · Spindlegate OL1</h1>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <TrustScoreBadge score={4.9} />
            <span
              style={{
                borderRadius: 999,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: '#0a0a0a',
                background: GRAD,
              }}
            >
              Full Tree route live
            </span>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          <ProjectCard
            project={{
              id: 'aso-ebi',
              title: 'Aso-Ebi Wedding Dress',
              cost: 320,
              gift_count: 12,
              milestones: [
                { label: 'Cutting', done: true },
                { label: 'Sewing', done: true },
                { label: 'Fitting', done: false },
              ],
              team: [{ name: 'Ayo' }],
            }}
          />
          <UPRMContactsList
            contacts={[
              { id: '1', name: 'Aisha Bridal', relationship_strength: 94, role: 'Aso-Ebi', journey_state: 'Quote' },
              { id: '2', name: 'Mrs Okafor', relationship_strength: 87, journey_state: 'Repeat' },
            ]}
          />
        </div>

        <PipelineKanban
          cards={[
            { id: '1', title: 'Aisha Bridal', status: 'Quote', meta: '£320' },
            { id: '2', title: 'Lace restock', status: 'Discovery', meta: '£45/m' },
            { id: '3', title: 'Fitting', status: 'Booked', meta: 'OL1' },
          ]}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          <ShopCard item={{ id: '1', title: 'Aso-Ebi lace', price: 45, stock: 24 }} />
          <BookingCalendar
            bookings={[{ id: '1', contact_name: 'Aisha', status: 'Booked', calendar_date: new Date().toISOString().slice(0, 10) }]}
          />
          <LiveWorkshop onGoLive={(on) => on && setRain((n) => n + 1)} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          <WorkCutEditor />
          <GiftRain trigger={rain} onGift={() => setRain((n) => n + 1)} />
          <MFCWallet balance={1247} />
          <BotArmy />
        </div>
      </main>
    </QuantumBackground>
  );
}
