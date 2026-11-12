import { Link } from "react-router-dom";
import React, { useState } from 'react';
import logoMain from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoIcon from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import tailorLace from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import dressReveal from "../assets/b4766d628a527e91-image_20261029_180641.webp";

// --- Types ---
type PageCard = {
  path: string;
  label: string;
  artifact: string;
  keyword: string;
  status: 'Built' | 'Ready';
  thumb?: string;
  accent?: string;
};

const coreOS: PageCard[] = [
  { path: '/', label: 'No.1 Hero Home', artifact: 'artifact 3', keyword: 'my face profile Oldham', status: 'Built', thumb: 'hero' },
  { path: '/how-it-works', label: 'No.2 How It Works', artifact: 'artifact 4', keyword: 'Work → Content → Discovery loop', status: 'Built' },
  { path: '/work-os', label: 'No.3 Work OS', artifact: 'artifact 5', keyword: 'OS Kernel + UPRM + Apps', status: 'Built' },
  { path: '/uprm', label: 'No.4 UPRM Orchestrator', artifact: 'artifact 6', keyword: 'UPRM pipeline orchestration', status: 'Built' },
  { path: '/live-workshop', label: 'No.4 Live Workshop', artifact: 'artifact 6b', keyword: 'hands-free gift rain live', status: 'Built' },
  { path: '/projects', label: 'No.5 Projects SEO', artifact: 'artifact 7', keyword: '12K projects grid Oldham', status: 'Built' },
  { path: '/projects/[id]', label: 'No.6 Project Detail', artifact: 'artifact 8', keyword: 'before/after slider blueprint', status: 'Built' },
  { path: '/pricing', label: 'No.7 Pricing MFC', artifact: 'artifact 9', keyword: 'MFC Coin economy gift box', status: 'Built' },
  { path: '/trust', label: 'No.8 Trust Ledger', artifact: 'artifact 10', keyword: 'TrustScore 4.9 verified reviews', status: 'Built' },
];

const verticals: PageCard[] = [
  { path: '/for-tailors', label: 'For Tailors', artifact: 'No.9 hub', keyword: 'bespoke lace wedding dress Oldham', status: 'Built', thumb: 'tailor' },
  { path: '/for-mechanics', label: 'For Mechanics', artifact: 'No.9 hub', keyword: 'female mechanic diagnostics', status: 'Built' },
  { path: '/for-builders', label: 'For Builders', artifact: 'No.9 hub', keyword: 'Oldham builders brick laying', status: 'Built' },
  { path: '/for-barbers', label: 'For Barbers', artifact: 'No.9 hub', keyword: 'barber fade Oldham', status: 'Built' },
  { path: '/for-electricians', label: 'For Electricians', artifact: 'No.9 hub', keyword: 'consumer unit 230V BS 7671', status: 'Built' },
  { path: '/for-plumbers', label: 'For Plumbers', artifact: 'No.9 hub', keyword: 'Gas Safe Worcester Bosch', status: 'Built' },
];

const contentGrowth: PageCard[] = [
  { path: '/about', label: 'No.10 About', artifact: 'artifact 11', keyword: 'VisaguideOS → My Face Profile', status: 'Built' },
  { path: '/careers', label: 'No.11 Careers', artifact: 'artifact 12', keyword: 'build OS brick by brick', status: 'Built' },
  { path: '/contact', label: 'No.11 Contact', artifact: 'artifact 12', keyword: 'hello@myfaceprofile.com Oldham', status: 'Built' },
  { path: '/blog', label: 'No.11 Blog', artifact: 'artifact 12', keyword: 'Aisha 47 dresses story', status: 'Built' },
  { path: '/blog/[slug]', label: 'Blog Detail', artifact: 'artifact 12', keyword: 'craft story longform SEO', status: 'Built' },
];

const legalEconomy: PageCard[] = [
  { path: '/help', label: 'Help & FAQ', artifact: 'No.11', keyword: 'escrow TrustScore MFC FAQ', status: 'Built' },
  { path: '/legal/privacy', label: 'Privacy', artifact: 'No.11', keyword: 'privacy policy GDPR', status: 'Built' },
  { path: '/legal/terms', label: 'Terms', artifact: 'No.11', keyword: 'platform terms escrow', status: 'Built' },
  { path: '/legal/coins', label: 'MFC Coins', artifact: 'No.11', keyword: 'MFC not crypto legal', status: 'Built' },
];

export default function SitemapPage() {
  const [activeGroup, setActiveGroup] = useState<'all' | 'core' | 'verticals' | 'content' | 'legal'>('all');

  const groups = [
    { id: 'core', label: 'Core OS • 9 Pages', data: coreOS, count: '01—09' },
    { id: 'verticals', label: 'Verticals • 6 Pages', data: verticals, count: '09—09' },
    { id: 'content', label: 'Content & Growth • 5 Pages', data: contentGrowth, count: '10—11' },
    { id: 'legal', label: 'Legal & Economy • 4 Pages', data: legalEconomy, count: '11—11' },
  ] as const;

  const filteredGroups = activeGroup === 'all' ? groups : groups.filter(g => g.id === activeGroup);

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
      className="min-h-screen bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip selection:bg-[#FFC300]/35 selection:text-[#0A1931]"
    >
      {/* NAV */}
      <header
        data-safe-area-sticky-top
        style={{ top: 'var(--safe-area-inset-top)' }}
        className="sticky z-50 border-b border-[#D4CBB8] backdrop-blur-[24px] bg-[#FFFDF7]/90"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-9 rounded-[10px] overflow-hidden bg-white flex items-center justify-center divine-glow">
              <img src={logoIcon} alt="My Face Profile M icon" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#8FFF4A]/20 to-[#FF8A00]/20 mix-blend-overlay" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-poppins font-bold text-[16px] tracking-[-0.02em]">My Face Profile</span>
              <span className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470] uppercase">Oldham • Work OS</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1 rounded-full glass px-2 py-1.5">
            {[
              { label: 'Home', href: '/' },
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Work OS', href: '/work-os' },
              { label: 'UPRM', href: '/uprm' },
              { label: 'Projects', href: '/projects' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Trust', href: '/trust' },
            ].map(l => (
              <a key={l.label} href={l.href} className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB] transition">
                {l.label}
              </a>
            ))}
            <Link to="/sitemap" className="px-4 py-1.5 rounded-full text-[13px] font-bold bg-white text-black">Sitemap</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8FFF4A] text-black font-mono text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-[#0A1931] animate-pulse" />
              No.12 LIVE • 24 PAGES READY
            </div>
            <button className="lg:hidden h-9 w-9 grid place-items-center rounded-full glass">
              <div className="space-y-1">
                <div className="w-4 h-0.5 bg-white" />
                <div className="w-4 h-0.5 bg-white" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 h-[900px] w-[1200px] rounded-full blur-[120px] opacity-30"
            style={{ background: 'radial-gradient(60% 60% at 50% 30%, #8FFF4A 0%, #00E5C0 25%, #FFE600 55%, #FF8A00 85%, transparent 100%)' }} />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,#FFFDF7)]" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 pt-16 md:pt-24 pb-12 md:pb-16">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
            {/* left hero copy */}
            <div className="flex-1 max-w-[760px]">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 mb-6 card-drop">
                <span className="h-5 px-2 grid place-items-center rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FF8A00] text-[10px] font-mono font-bold text-black">No.12</span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-[#5B6470] uppercase">Master Sitemap • Production Handover • Touch of GOD</span>
                <span className="ml-1 h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
              </div>

              <h1 className="font-poppins font-extrabold leading-[0.9] tracking-[-0.04em] text-[40px] md:text-[64px] lg:text-[72px]">
                24 Pages.
                <br />
                11 Artifacts.
                <br />
                <span className="text-[#0A1931]">One OS.</span>
                <br />
                <span className="text-[#0A1931]">Ready to Ship.</span>
              </h1>

              <div className="mt-6">
                <p className="font-poppins font-bold text-[22px] md:text-[28px] leading-[1.1] tracking-[-0.02em] text-gradient">
                  From Hero to Sitemap — Full Marketing OS Production-Ready.
                </p>
                <p className="mt-4 max-w-[560px] text-[15px] md:text-[16px] leading-[1.6] text-[#5B6470] font-medium">
                  All 24 marketing pages built, with same fonts, same M gradient, same touch of GOD images — ready to wire into React web/mobile Turbo monorepo — <span className="text-[#0A1931]">pnpm dev</span> and go live in Oldham.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
                  <img src={logoMain} alt="" className="h-5 w-5 rounded-full object-cover" />
                  <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-[#5B6470]">Fonts: Poppins 800 + Inter • Maintained from No.1</span>
                </div>
                <div className="rounded-full bg-white text-black px-4 py-2 font-poppins font-bold text-[13px]">apps/marketing/app/sitemap/page.tsx</div>
              </div>

              {/* stats */}
              <div className="mt-10 grid grid-cols-3 md:grid-cols-6 gap-3 max-w-[640px]">
                {[
                  { k: 'Artifacts', v: '12' },
                  { k: 'Pages', v: '24' },
                  { k: 'Images', v: '14' },
                  { k: 'Pros', v: '1,247' },
                  { k: 'Trust', v: '4.9' },
                  { k: 'ARR', v: '£618K' },
                ].map(s => (
                  <div key={s.k} className="glass rounded-[16px] p-3">
                    <div className="font-poppins font-extrabold text-[20px] leading-none">{s.v}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470] mt-1">{s.k}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* right tailor images showcase */}
            <div className="flex-1 w-full lg:max-w-[520px] relative">
              <div className="relative">
                {/* main dress reveal */}
                <div className="relative rounded-[24px] overflow-hidden divine-glow card-drop" style={{ animationDelay: '0.1s' }}>
                  <img src={dressReveal} alt="Final wedding dress reveal - touch of GOD" className="w-full aspect-[4/5] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">Touch of GOD • Image 12/14</div>
                      <div className="font-poppins font-bold text-[18px] leading-[1.1] mt-1">Final Wedding Dress Reveal</div>
                      <div className="font-mono text-[11px] text-[#5B6470] mt-1">Oldham • Bespoke Lace • Holy Craft</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white text-black grid place-items-center font-poppins font-bold">↗</div>
                  </div>
                  <div className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#8FFF4A]" />
                    <span className="font-mono text-[10px] font-bold tracking-[0.1em]">SEO GOLDMINE</span>
                  </div>
                </div>

                {/* tailor lace floating */}
                <div className="absolute -bottom-10 -left-8 md:-left-14 w-[200px] md:w-[240px] rounded-[24px] overflow-hidden divine-glow glass-strong p-2 card-drop" style={{ animationDelay: '0.25s' }}>
                  <div className="rounded-[16px] overflow-hidden">
                    <img src={tailorLace} alt="Tailor sewing lace detail" className="w-full aspect-[4/3] object-cover" />
                  </div>
                  <div className="p-3">
                    <div className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#5B6470]">Tailor Sewing Lace • Image 11/14</div>
                    <div className="font-poppins font-bold text-[13px] leading-[1.2] mt-1">Hands That Speak — Lace Stitch</div>
                    <div className="mt-2 flex gap-1.5">
                      <span className="px-2 py-1 rounded-full bg-[#8FFF4A] text-black font-mono text-[9px] font-bold">BUILT</span>
                      <span className="px-2 py-1 rounded-full glass font-mono text-[9px]">/for-tailors</span>
                    </div>
                  </div>
                </div>

                {/* blueprint floating */}
                <div className="absolute -top-6 -right-2 md:-right-6 glass rounded-[20px] p-4 w-[200px] card-drop hidden md:block" style={{ animationDelay: '0.35s' }}>
                  <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Blueprint Materials</div>
                  <div className="mt-3 space-y-2">
                    <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#00E5C0]" />
                    <div className="h-1.5 w-[70%] rounded-full bg-white/20" />
                    <div className="h-1.5 w-[90%] rounded-full bg-[#F0E9DB]" />
                  </div>
                  <div className="mt-3 font-poppins font-bold text-[12px]">Glassmorphism + Divine Glow + 24px radius</div>
                  <div className="mt-2 text-[10px] font-mono text-[#5B6470]">Holy craft in every pixel — touch of GOD.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 — SITEMAP GRID */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-12 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5B6470]">Section 01 • Sitemap • 24 Pages Visual Grid</div>
            <h2 className="font-poppins font-extrabold text-[32px] md:text-[48px] leading-[0.9] tracking-[-0.03em] mt-3">
              Every Page Mapped.
              <br />
              <span className="text-[#5B6470]">Holy Production Map.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full glass p-1.5">
            {[
              { id: 'all', label: 'All 24' },
              { id: 'core', label: 'Core OS 9' },
              { id: 'verticals', label: 'Verticals 6' },
              { id: 'content', label: 'Content 5' },
              { id: 'legal', label: 'Legal 4' },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveGroup(t.id as any)}
                className={`px-4 py-2 rounded-full text-[12px] font-mono font-bold tracking-[0.06em] transition ${activeGroup === t.id ? 'bg-white text-black' : 'text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-14">
          {filteredGroups.map(group => (
            <div key={group.id} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-[#F0E9DB]" />
                <div className="flex items-center gap-3 glass rounded-full px-4 py-2">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-[#5B6470]">{group.count}</span>
                  <span className="font-poppins font-bold text-[13px] tracking-[-0.01em]">{group.label}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />
                </div>
                <div className="h-px flex-1 bg-[#F0E9DB]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {group.data.map((card, i) => (
                  <Link
                    to={card.path}
                    key={card.path}
                    className="group relative rounded-[24px] glass hover:glass-strong transition-all duration-500 overflow-hidden card-drop divine-glow hover:translate-y-[-2px] block"
                    style={{ animationDelay: `${i * 0.06}s` }}
                  >
                    {/* thumb */}
                    <div className="relative h-[156px] overflow-hidden">
                      {card.thumb === 'tailor' ? (
                        <img src={tailorLace} alt="Tailor sewing lace" className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
                      ) : card.thumb === 'hero' ? (
                        <img src={logoMain} alt="My Face Profile hero" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition" />
                      ) : card.path.includes('tailors') ? (
                        <img src={dressReveal} alt="Final wedding dress reveal" className="w-full h-full object-cover group-hover:scale-[1.03] transition" />
                      ) : (
                        <div className="w-full h-full bg-[#F0E9DB] relative">
                          <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${card.path.includes('mechanic') ? '#8FFF4A22, #00E5C022' : card.path.includes('builder') ? '#FFE60022, #FF8A0022' : card.path.includes('barber') ? '#00E5C022, #8FFF4A22' : card.path.includes('electric') ? '#FFE60022, #8FFF4A22' : '#111, #222'})` }} />
                          <div className="absolute inset-0 grid place-items-center">
                            <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#5B6470]">{card.path}</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                      <div className="absolute top-3 left-3 right-3 flex justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-[#8FFF4A] text-black font-mono text-[10px] font-bold">✅ {card.status}</span>
                        <span className="px-2.5 py-1 rounded-full glass font-mono text-[10px] text-[#5B6470]">{card.artifact}</span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">{card.path}</div>
                        <div className="font-poppins font-bold text-[14px] leading-[1.1] mt-1">{card.label}</div>
                      </div>
                    </div>

                    {/* meta */}
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-[10px] tracking-[0.08em] text-[#5B6470] truncate">SEO: {card.keyword}</div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="h-1 w-12 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FF8A00]" />
                          <div className="h-1 w-6 rounded-full bg-white/20" />
                        </div>
                      </div>
                      <span className="ml-3 h-8 w-8 rounded-full bg-white text-black grid place-items-center font-poppins font-bold text-[14px] group-hover:rotate-[45deg] transition">
                        ↗
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* LEGEND BAR */}
        <div className="mt-14 glass rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#FF8A00] grid place-items-center text-black font-poppins font-extrabold">M</div>
            <div>
              <div className="font-poppins font-bold text-[14px]">24 Pages • Same Fonts • Same Glow • Same GOD</div>
              <div className="font-mono text-[11px] text-[#5B6470]">All pages use Poppins 800 headlines + Inter body + JetBrains Mono labels — verified from No.1 homepage</div>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white text-black font-mono text-[11px] font-bold">24 PAGES</span>
            <span className="px-3 py-1.5 rounded-full glass font-mono text-[11px]">11 ARTIFACTS</span>
            <span className="px-3 py-1.5 rounded-full glass font-mono text-[11px]">14 IMAGES • TOUCH OF GOD</span>
          </div>
        </div>
      </section>

      {/* SECTION 2 — PRODUCTION HANDOVER */}
      <section className="relative border-y border-[#D4CBB8] bg-[#F0E9DB]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-14 md:py-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 items-start">
            {/* code */}
            <div>
              <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5B6470]">Section 02 • Production Handover • How to Wire</div>
              <h3 className="font-poppins font-extrabold text-[30px] md:text-[40px] leading-[0.9] tracking-[-0.03em] mt-4">
                Turbo Monorepo Ready.
                <br />
                <span className="text-gradient">p npm dev → Ship.</span>
              </h3>

              <div className="mt-8 rounded-[24px] glass-strong overflow-hidden divine-glow">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4CBB8]">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
                    <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                    <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="font-mono text-[11px] tracking-[0.12em] text-[#5B6470]">apps/marketing/app/ — 24 pages wired</div>
                  <div className="px-2.5 py-1 rounded-full bg-[#8FFF4A] text-black font-mono text-[10px] font-bold">COPY • PASTE</div>
                </div>
                <pre className="p-6 overflow-x-auto font-mono text-[12px] md:text-[13px] leading-[1.7] text-[#5B6470] scrollbar-hide">
{`apps/marketing/app/
  page.tsx -> No.1 Hero Home artifact 3
  how-it-works/page.tsx -> No.2
  work-os/page.tsx -> No.3
  uprm/page.tsx -> No.4
  live-workshop/page.tsx -> No.4
  projects/page.tsx -> No.5
  projects/[id]/page.tsx -> No.6
  pricing/page.tsx -> No.7
  trust/page.tsx -> No.8
  for-tailors/page.tsx etc -> No.9 hub
    ├── /for-mechanics
    ├── /for-builders
    ├── /for-barbers
    ├── /for-electricians
    └── /for-plumbers
  about/page.tsx -> No.10
  blog/page.tsx + careers etc -> No.11
    ├── /careers
    ├── /contact
    ├── /blog/[slug]
    ├── /help
    └── /legal/*
  sitemap/page.tsx -> No.12 • THIS PAGE

// Command:
pnpm dev — localhost:3000
pnpm build — production
vercel --prod — ship Oldham`}
                </pre>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="glass rounded-[16px] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470]">Web</div>
                  <div className="font-poppins font-bold text-[14px] mt-1">apps/marketing — Next.js 14</div>
                  <div className="font-mono text-[11px] text-[#5B6470] mt-1">Tailwind + Poppins + Inter + Mono</div>
                </div>
                <div className="glass rounded-[16px] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#5B6470]">Mobile</div>
                  <div className="font-poppins font-bold text-[14px] mt-1">apps/mobile — Expo</div>
                  <div className="font-mono text-[11px] text-[#5B6470] mt-1">Same M gradient • Same glow</div>
                </div>
              </div>
            </div>

            {/* mobile badges + QR */}
            <div className="space-y-6">
              <div className="rounded-[24px] bg-white text-black p-6 md:p-8 divine-glow card-drop">
                <div className="flex items-center justify-between">
                  <div className="font-poppins font-extrabold text-[22px] leading-[0.9] tracking-[-0.02em]">iOS & Android<br />Coming Soon</div>
                  <div className="h-10 w-10 rounded-full bg-[#0A1931] text-white grid place-items-center font-mono text-[12px]">QR</div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-[14px] bg-[#0A1931] text-white p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[8px] bg-white text-black grid place-items-center font-poppins font-bold text-[14px]"></div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em]">Download on</div>
                      <div className="font-poppins font-bold text-[13px] leading-none">App Store</div>
                    </div>
                  </div>
                  <div className="rounded-[14px] bg-[#0A1931] text-white p-3 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-[8px] bg-white text-black grid place-items-center font-poppins font-bold text-[10px]">▶</div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em]">Get it on</div>
                      <div className="font-poppins font-bold text-[13px] leading-none">Google Play</div>
                    </div>
                  </div>
                </div>

                {/* QR mock */}
                <div className="mt-6 rounded-[16px] bg-[#f5f5f5] p-4 flex gap-4 items-center">
                  <div className="h-[88px] w-[88px] rounded-[12px] bg-[#0A1931] grid grid-cols-5 gap-0.5 p-2">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className={`rounded-[1px] ${Math.random() > 0.4 ? 'bg-white' : 'bg-black'}`} />
                    ))}
                  </div>
                  <div className="flex-1">
                    <div className="font-poppins font-bold text-[13px]">TestFlight • Ready for QA</div>
                    <div className="font-mono text-[11px] text-black/60 mt-1 leading-[1.4]">Scan to join Oldham test group — 1,247 pros already in — 4.9 Trust</div>
                    <div className="mt-2 inline-flex px-2 py-1 rounded-full bg-[#0A1931] text-white font-mono text-[10px] font-bold">myfaceprofile.com/testflight</div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#00E5C0]" />
                  <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-[#FFE600] to-[#FF8A00]" />
                </div>
              </div>

              <div className="glass rounded-[24px] p-6">
                <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">Production Checklist • No.12 Handover</div>
                <div className="mt-4 space-y-3">
                  {[
                    'Fonts Poppins 800 + Inter + JetBrains Mono — same as No.1',
                    'M Gradient #8FFF4A→#00E5C0→#FFE600→#FF8A00 — everywhere',
                    '14 Images — tailor lace, dress reveal, mechanic, builders — touch of GOD',
                    'Glassmorphism + 24px radius + divine glow — holy craft',
                    'Responsive — Tailwind production-ready — apps/marketing/app/sitemap/page.tsx',
                    'SEO keywords — Oldham, bespoke, Gas Safe, BS 7671, Worcester Bosch',
                  ].map(item => (
                    <div key={item} className="flex gap-2">
                      <span className="mt-0.5 h-4 w-4 rounded-full bg-[#8FFF4A] text-black grid place-items-center font-mono text-[10px] font-bold">✓</span>
                      <span className="font-mono text-[12px] leading-[1.4] text-[#5B6470]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — FONTS + IMAGES CONSISTENCY */}
      <section className="mx-auto max-w-[1440px] px-6 md:px-10 py-14 md:py-24">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5B6470]">Section 03 • Fonts + Images Consistency • What We Maintained</div>

        <div className="mt-8 grid lg:grid-cols-3 gap-6">
          {/* fonts */}
          <div className="rounded-[24px] glass-strong p-7 md:p-8 divine-glow">
            <div className="h-12 w-12 rounded-full bg-white text-black grid place-items-center font-poppins font-extrabold text-[20px]">Aa</div>
            <h4 className="font-poppins font-extrabold text-[20px] leading-[1.1] tracking-[-0.02em] mt-5">Fonts — Holy Consistency</h4>
            <div className="mt-6 space-y-4">
              <div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Headlines</div>
                <div className="font-poppins font-extrabold text-[28px] leading-[0.9] mt-1">Poppins Bold 800</div>
                <div className="font-mono text-[11px] text-[#5B6470] mt-1">Same across all 12 artifacts — maintained from No.1 homepage</div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Body</div>
                <div className="font-inter text-[18px] leading-[1.4] mt-1" style={{ fontFamily: 'Inter' }}>Inter Regular / Medium — clean, readable, Oldham truth</div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Labels</div>
                <div className="font-mono text-[13px] mt-1">JetBrains Mono — 11px, tracking 0.14em, uppercase</div>
              </div>
            </div>
            <div className="mt-6 h-1.5 w-full rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FF8A00]" />
          </div>

          {/* colors */}
          <div className="rounded-[24px] bg-[#F0E9DB] border border-[#D4CBB8] p-7 md:p-8">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#FF8A00] grid place-items-center font-poppins font-extrabold text-black">M</div>
            <h4 className="font-poppins font-extrabold text-[20px] leading-[1.1] tracking-[-0.02em] mt-5">Colors — M Gradient Divine</h4>
            <div className="mt-6">
              <div className="rounded-[16px] overflow-hidden h-[56px] w-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00]" />
              <div className="mt-3 flex gap-2 font-mono text-[10px]">
                <span className="px-2 py-1 rounded-full bg-[#F0E9DB]">#8FFF4A</span>
                <span className="px-2 py-1 rounded-full bg-[#F0E9DB]">#00E5C0</span>
                <span className="px-2 py-1 rounded-full bg-[#F0E9DB]">#FFE600</span>
                <span className="px-2 py-1 rounded-full bg-[#F0E9DB]">#FF8A00</span>
              </div>
            </div>
            <div className="mt-6 space-y-3 font-mono text-[12px] text-[#5B6470]">
              <div className="flex justify-between"><span>Cream base</span><span className="text-[#0A1931]">#FFFDF7</span></div>
              <div className="flex justify-between"><span>Glass</span><span className="text-[#0A1931]">rgba(255,255,255,0.06)</span></div>
              <div className="flex justify-between"><span>Border</span><span className="text-[#0A1931]">rgba(255,255,255,0.10)</span></div>
              <div className="flex justify-between"><span>Radius</span><span className="text-[#0A1931]">24px — everywhere</span></div>
            </div>
            <div className="mt-6 glass rounded-[14px] p-3 font-mono text-[11px] text-[#5B6470]">Divine glow: 0 0 80px rgba(143,255,74,0.15) + holy craft border inset</div>
          </div>

          {/* images */}
          <div className="rounded-[24px] glass p-7 md:p-8 divine-glow">
            <div className="flex gap-2">
              <div className="h-12 w-12 rounded-[12px] overflow-hidden">
                <img src={tailorLace} alt="Tailor" className="h-full w-full object-cover" />
              </div>
              <div className="h-12 w-12 rounded-[12px] overflow-hidden">
                <img src={dressReveal} alt="Dress reveal" className="h-full w-full object-cover" />
              </div>
              <div className="h-12 w-12 rounded-[12px] bg-gradient-to-br from-[#8FFF4A]/30 to-[#FF8A00]/30 grid place-items-center font-mono text-[10px]">+12</div>
            </div>
            <h4 className="font-poppins font-extrabold text-[20px] leading-[1.1] tracking-[-0.02em] mt-5">Images — Touch of GOD</h4>
            <div className="mt-4 space-y-2.5 font-mono text-[11px] leading-[1.5] text-[#5B6470]">
              <div>• Tailor sewing lace — hands that speak more than words</div>
              <div>• Final wedding dress reveal — holy moment Oldham</div>
              <div>• Mechanic diagnosing — female pro, craft & precision</div>
              <div>• Builders laying bricks — brick by brick OS</div>
              <div>• Barber fade — clean, sharp, trusted</div>
              <div>• Electrician consumer unit — 230V BS 7671 compliance</div>
              <div>• Plumber Gas Safe — Worcester Bosch boiler</div>
              <div>• Gift economy box — MFC Coin gifting rain</div>
              <div>• Stripe escrow + verified review + before/after kitchen</div>
              <div>• Blueprint materials — blueprint + craft ledger</div>
            </div>
            <div className="mt-6 inline-flex px-3 py-1.5 rounded-full bg-[#8FFF4A] text-black font-mono text-[11px] font-bold">14 IMAGES • ALL SPEAK • TOUCH OF GOD</div>
          </div>
        </div>

        {/* design system strip */}
        <div className="mt-8 grid md:grid-cols-4 gap-3">
          {[
            { title: 'Glassmorphism', desc: 'blur 24px + saturate 1.2 + 8% white' },
            { title: 'Card Drop', desc: 'slide-in 0.7s cubic-bezier(0.16,1,0.3,1)' },
            { title: 'Rounded 24px', desc: 'Every card, image, modal — holy radius' },
            { title: 'Divine Glow', desc: 'Green→Teal→Yellow→Orange halo' },
          ].map(c => (
            <div key={c.title} className="glass rounded-[16px] p-4">
              <div className="font-poppins font-bold text-[13px]">{c.title}</div>
              <div className="font-mono text-[11px] text-[#5B6470] mt-1">{c.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="relative overflow-hidden border-t border-[#D4CBB8]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#8FFF4A]/10 via-[#FFE600]/5 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
          <div className="rounded-[32px] bg-white text-black p-8 md:p-12 lg:p-16 overflow-hidden relative">
            {/* gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00]" />

            <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
              <div className="max-w-[720px]">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0A1931] text-white px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase">No.12 of 24 — Master Sitemap — Production Handover — Touch of GOD</span>
                </div>
                <h2 className="font-poppins font-extrabold text-[36px] md:text-[56px] leading-[0.85] tracking-[-0.04em] mt-6">
                  24 Pages Ready —<br />
                  Ship Oldham Test —
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00]" style={{ WebkitBackgroundClip: 'text' }}>
                    Touch of GOD in Every Page
                  </span>
                </h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    '12 Artifacts',
                    '24 Pages',
                    '14 Images',
                    '1,247 Pros',
                    '12K Projects',
                    '4.9 Trust',
                    '£618K ARR',
                  ].map(stat => (
                    <span key={stat} className="px-3 py-1.5 rounded-full bg-[#0A1931] text-white font-mono text-[11px] font-bold tracking-[0.06em]">{stat}</span>
                  ))}
                </div>
              </div>

              <div className="lg:w-[340px] w-full space-y-4">
                <div className="rounded-[20px] bg-[#0A1931] text-white p-6">
                  <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">Ready to Wire — Command</div>
                  <div className="mt-3 font-mono text-[13px] leading-[1.6]">
                    <div className="text-[#5B6470]">$ pnpm dev</div>
                    <div className="text-[#8FFF4A]">→ localhost:3000 — Oldham live</div>
                    <div className="text-[#5B6470] mt-2">$ pnpm build && vercel --prod</div>
                    <div className="text-[#FFE600]">→ Ship production — touch of GOD</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link to="/" className="rounded-full bg-[#0A1931] text-white h-12 grid place-items-center font-poppins font-bold text-[14px] hover:bg-[#F0E9DB] transition">Go Home ↗</Link>
                  <Link to="/how-it-works" className="rounded-full bg-transparent border-2 border-black h-12 grid place-items-center font-poppins font-bold text-[14px] hover:bg-black hover:text-white transition">Work OS</Link>
                </div>

                <div className="font-mono text-[10px] leading-[1.5] text-black/50 text-center">
                  Same fonts Poppins 800 + Inter • Same M gradient • Same glassmorphism • Same holy craft • Ready for apps/marketing/app/sitemap/page.tsx
                </div>
              </div>
            </div>

            {/* bottom bar */}
            <div className="mt-12 pt-8 border-t border-black/10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex items-center gap-3">
                <img src={logoIcon} alt="M icon" className="h-8 w-8 rounded-[8px] object-cover" />
                <div className="font-poppins font-bold text-[14px] tracking-[-0.01em]">My Face Profile • Oldham • Work OS • Touch of GOD</div>
              </div>
              <div className="font-mono text-[11px] text-black/50">© 2025 My Face Profile — Built brick by brick — No.12 Master Sitemap — Production Handover — pnpm dev and go live</div>
            </div>
          </div>

          {/* small badge */}
          <div className="mt-6 flex justify-center">
            <div className="glass rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.12em] text-[#5B6470]">
              Badge: No.12 of 24 — Master Sitemap — Production Handover — Touch of GOD — Reverent, Beautiful, Ready to Ship
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
