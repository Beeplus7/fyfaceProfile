import { useEffect, useState } from 'react';

import logoM from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoFull from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";

import imgTailor from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import imgMechanic from "../assets/862320100e7b980d-image_20261029_173915.webp";
import imgBuilders from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import imgBarber from "../assets/f05e570703efee3a-image_20261029_173914.webp";
import imgElectrician from "../assets/8add8b271904e6b3-image_20261029_190128.webp";
import imgPlumber from "../assets/a0e4b743decf2716-image_20261029_190129.webp";

type Application = {
  role: string;
  name: string;
  email: string;
  craft: string;
  link: string;
  why: string;
  created_at?: string;
};

const TRADES = [
  { id: 'tailor', name: 'Tailor', count: 247, image: imgTailor, tag: 'LACE • SEW', loc: 'OL1 • Textiles', tint: 'from-[#8FFF4A]/30' },
  { id: 'mechanic', name: 'Mechanic', count: 189, image: imgMechanic, tag: 'J MARTINEZ • ENGINE', loc: 'OL2 • Garage', tint: 'from-[#00E5C0]/30' },
  { id: 'builders', name: 'Builders', count: 124, image: imgBuilders, tag: 'BRICK • OLDHAM', loc: 'OL8 • Site', tint: 'from-[#FFE600]/30' },
  { id: 'barber', name: 'Barber', count: 98, image: imgBarber, tag: 'FADE • LINE', loc: 'OL1 • Shop', tint: 'from-[#FF8A00]/30' },
  { id: 'electrician', name: 'Electrician', count: 87, image: imgElectrician, tag: 'BS7671 • RCD 30mA', loc: 'OL2 • 230V', tint: 'from-[#00E5C0]/30' },
  { id: 'plumber', name: 'Plumber', count: 76, image: imgPlumber, tag: 'GAS SAFE • BOILER', loc: 'OL8 • Worcester', tint: 'from-[#8FFF4A]/30' },
];

const VALUES = [
  { k: '01', title: 'Real Work > Filter', desc: 'We show the stitch, the torque wrench, the mortar line, the fade design. No stock photos. No AI hustle.', image: imgTailor },
  { k: '02', title: 'Trust Ledger > Likes', desc: 'Every booking verified, every TrustScore earned on chain. Not vanity. Proof.', image: imgMechanic },
  { k: '03', title: 'Project > Post', desc: 'Gallery of jobs done, not promises. Before/after, receipt, review. That\'s the OS.', image: imgBuilders },
  { k: '04', title: 'Escrow > Promise', desc: 'Money held until client says Amen. Stripe Connect protects both sides.', image: imgElectrician },
  { k: '05', title: 'Community > Competition', desc: '247 tailors don\'t compete, they refer. Oldham first. Always.', image: imgBarber },
  { k: '06', title: 'Touch of GOD', desc: 'Craft as worship. When you lay brick straight, you glorify. This is holy build.', image: imgPlumber },
];

const ROLES = [
  {
    id: 'senior-engineer',
    title: 'Senior Engineer',
    dept: 'ENGINEERING • OLDHAM HQ',
    type: 'Full-time • On-site OL1',
    salary: '£75k — £95k + 0.5% equity',
    stack: ['Next.js 15', 'NestJS', 'PostgreSQL', 'LiveKit', 'Mux', 'Stripe Connect', 'TrustScore Engine'],
    blurb: 'Build the real-time OS that handles 12K projects/week. Video calling for consultations, Mux for proof reels, escrow that never fails.',
    images: [imgMechanic, imgElectrician],
    color: 'from-[#8FFF4A] to-[#00E5C0]',
  },
  {
    id: 'product-designer',
    title: 'Product Designer — M Gradient',
    dept: 'DESIGN • CRAFT SYSTEM',
    type: 'Full-time • Oldham + Remote',
    salary: '£60k — £80k + 0.4% equity',
    stack: ['Figma', 'Glassmorphism', 'M Gradient System', '24px Radius', 'Divine Glow', 'Holy Build'],
    blurb: 'Own the design language that makes a plumber’s boiler install look like art. Same glassmorphism as No.1 hero home. Not SaaS. Sacred.',
    images: [imgTailor, imgBarber],
    color: 'from-[#00E5C0] to-[#FFE600]',
  },
  {
    id: 'trust-safety',
    title: 'Trust & Safety Lead',
    dept: 'TRUST • VERIFICATION',
    type: 'Full-time • Oldham HQ',
    salary: '£55k — £75k + 0.3% equity',
    stack: ['Verified Pro', 'TrustScore 0-100', 'KYC', 'Gas Safe API', 'BS 7671 Check', 'Human Review'],
    blurb: 'Keep the 1,247 real. Verify Gas Safe for plumbers, BS 7671 for sparks, portfolios for tailors. No fakes in the OS.',
    images: [imgPlumber, imgBuilders],
    color: 'from-[#FFE600] to-[#FF8A00]',
  },
  {
    id: 'community-oldham',
    title: 'Community Oldham Lead',
    dept: 'COMMUNITY • OL1 OL2 OL8',
    type: 'Full-time • Oldham Streets',
    salary: '£40k — £55k + 0.25% equity',
    stack: ['1247 Pros', 'Oldham Markets', 'College Links', 'Church & Mosque', 'Word of Mouth'],
    blurb: 'You know every barber on Yorkshire St, every builder at the builders merchants at 6am. Be the bridge between OS and Oldham.',
    images: [imgBuilders, imgBuilders],
    color: 'from-[#8FFF4A] via-[#FFE600] to-[#FF8A00]',
  },
  {
    id: 'bot-army-trainer',
    title: 'Bot Army Trainer',
    dept: 'AI • MILO CUTTY QUOTO HELPY VERI',
    type: 'Full-time • Remote / Oldham',
    salary: '£50k — £70k + 0.3% equity',
    stack: ['Milo — Booking', 'Cutty — Barber AI', 'Quoto — Pricing', 'Helpy — Support', 'Veri — Verification'],
    blurb: 'Train 5 bots that speak real trade. Milo knows a boiler service takes 45 mins, Cutty knows a skin fade is £25 not £15. No hallucinations.',
    images: TRADES.map(t => t.image),
    color: 'from-[#00E5C0] via-[#FFE600] to-[#8FFF4A]',
  },
];

export default function CareersPage() {
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState<Application>({ role: ROLES[0].id, name: '', email: '', craft: '', link: '', why: '' });
  const [apps, setApps] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ saved: number; error: string | null } | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  async function loadApps() {
    setLoadingApps(true);
    try {
      const res = await fetch('actions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'records.list', args: { collection: 'career_applications', limit: 50 } }),
      });
      const j = await res.json();
      if (j.data) setApps((j.data.records || []).map((r: any) => r.value).reverse());
    } catch {}
    finally { setLoadingApps(false); }
  }

  useEffect(() => { loadApps(); }, []);

  async function handleSubmit() {
    if (!form.name || !form.email || !form.why) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const idempotency_key = `${form.email}-${form.role}-${Date.now()}`;
      const res = await fetch('actions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'records.create',
          args: { collection: 'career_applications', value: { ...form, created_at: new Date().toISOString() }, idempotency_key },
        }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setSubmitResult({ saved: 1, error: null });
      setForm({ role: form.role, name: '', email: '', craft: '', link: '', why: '' });
      setShowApply(false);
      await loadApps();
    } catch (e: any) {
      setSubmitResult({ saved: 0, error: e.message || 'Failed' });
    } finally { setSubmitting(false); }
  }

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
      className="min-h-screen bg-[#FFFDF7] text-[#f5f5f0] selection:bg-[#FFC300]/35 selection:text-[#0A1931] overflow-x-clip"
    >
      <header
        data-safe-area-sticky-top
        style={{ top: 'var(--safe-area-inset-top)' }}
        className="sticky z-50 border-b border-[#D4CBB8] bg-[#FFFDF7]/90 backdrop-blur-2xl"
      >
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-[10px] overflow-hidden bg-white p-[2px]">
                <img src={logoM} alt="M Logo" className="h-full w-full object-cover rounded-[8px]" />
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="font-mono text-[11px] tracking-[0.18em] text-[#5B6470] uppercase">My Face</span>
                <span className="font-['Poppins'] font-extrabold text-[15px] tracking-[-0.02em]">Profile</span>
              </div>
            </div>
            <div className="h-5 w-px bg-[#F0E9DB] hidden md:block" />
            <nav className="hidden md:flex items-center gap-6">
              {[
                { label: 'Home', href: '#top' },
                { label: 'Pros', href: '#pros' },
                { label: 'Projects', href: '#projects' },
                { label: 'Careers', href: '#roles', active: true },
                { label: 'OS', href: '#os' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault();
                      document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`font-mono text-[11px] tracking-[0.14em] uppercase transition ${
                    item.active ? 'text-[#0A1931] bg-[#F0E9DB] px-3 py-1.5 rounded-full border border-[#D4CBB8]' : 'text-[#5B6470] hover:text-[#0A1931]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.12em] text-[#5B6470] uppercase">Page 19 of 24 • Live OS • 1247 Pros</span>
            </div>
            <button onClick={() => setShowApply(true)} className="hidden md:inline-flex h-9 px-5 rounded-full bg-[var(--m-gradient)] text-black font-mono text-[11px] font-bold tracking-[0.14em] uppercase hover:opacity-90 transition">Apply</button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden h-9 w-9 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] grid place-items-center">
              <div className="space-y-1"><div className="h-[2px] w-4 bg-white" /><div className="h-[2px] w-4 bg-white" /><div className="h-[2px] w-3 bg-white/60" /></div>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-[#D4CBB8] bg-[#0c0c0c] px-5 py-4 flex flex-col gap-3">
            {['Home', 'Pros', 'Projects', 'Careers', 'OS'].map((i) => (
              <button key={i} onClick={() => { setMobileMenu(false); if(i==='Careers') document.querySelector('#roles')?.scrollIntoView({behavior:'smooth'}); }} className={`font-mono text-left text-[12px] uppercase tracking-[0.14em] ${i === 'Careers' ? 'text-[#0A1931]' : 'text-[#5B6470]'}`}>{i} {i==='Careers'?'• Active':''}</button>
            ))}
            <button onClick={() => { setMobileMenu(false); setShowApply(true); }} className="mt-2 h-11 rounded-full bg-[var(--m-gradient)] text-black font-mono text-[12px] font-bold tracking-[0.14em] uppercase">Apply Now</button>
          </div>
        )}
      </header>

      <div className="border-b border-[#D4CBB8] bg-[#0c0c0c]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 h-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#141414] border border-[#D4CBB8] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFE600]" />
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5B6470]">Page 19 of 24 • Careers Standalone • Touch of GOD</span>
            </span>
            <span className="hidden md:inline-flex font-mono text-[10px] tracking-[0.16em] uppercase text-[#5B6470]">Production-ready • Tailwind • app/careers/page.tsx</span>
          </div>
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5B6470]">Oldham • OL1 OL2 OL8 • 1247 PROS</span>
        </div>
      </div>

      <section id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c] via-[#050505] to-[#050505]" />
        <div className="absolute -top-[30%] left-1/2 -translate-x-1/2 w-[120%] h-[80%] bg-[radial-gradient(ellipse_at_center,_rgba(143,255,74,0.12),_transparent_60%)] blur-[40px]" />
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[60%] bg-[radial-gradient(ellipse_at_center,_rgba(0,229,192,0.10),_transparent_60%)] blur-[40px]" />
        <div className="absolute bottom-[0%] left-[-10%] w-[50%] h-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(255,230,0,0.08),_transparent_60%)] blur-[50px]" />

        <div className="relative mx-auto max-w-[1440px] px-5 md:px-8 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-[#5B6470]">Page 19 of 24 • Careers • Build the OS for Real Work • All Skills • Oldham • Touch of GOD</span>
            <span className="hidden md:inline h-px w-12 bg-[#F0E9DB]" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">5 OPEN ROLES • HIRING NOW</span>
            </span>
          </div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-12 items-start">
            <div>
              <h1 className="font-['Poppins'] font-extrabold leading-[0.9] tracking-[-0.04em] text-[44px] md:text-[68px] lg:text-[84px]">
                <span className="block text-[#0A1931]">Build the OS</span>
                <span className="block text-[#0A1931]">for Real Work.</span>
                <span className="block mt-2 md:mt-3 m-gradient-text text-[36px] md:text-[52px] lg:text-[60px] leading-[0.9]">Not for Hustlers.</span>
                <span className="block m-gradient-text text-[36px] md:text-[52px] lg:text-[60px] leading-[0.9]">For Craftsmen.</span>
              </h1>
              <p className="mt-6 md:mt-8 font-['Inter'] text-[15px] md:text-[18px] leading-[1.6] text-[#5B6470] max-w-[560px]">
                <span className="text-[#0A1931] font-medium">247 tailors, 189 mechanics, 124 builders, 98 barbers, 87 electricians, 76 plumbers</span> in Oldham already showing real work — Join My Face Profile OS team — Senior Engineer, Product Designer M Gradient, Trust & Safety Lead, Community Oldham Lead, Bot Army Trainer (Milo, Cutty, Quoto) — <span className="text-[#0A1931] font-semibold">Real Work &gt; Filter.</span>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setShowApply(true)} className="h-[48px] px-7 rounded-full bg-[var(--m-gradient)] text-black font-mono text-[12px] font-bold tracking-[0.16em] uppercase hover:scale-[1.02] transition">Apply — Build Brick by Brick →</button>
                <button onClick={() => document.querySelector('#roles')?.scrollIntoView({behavior:'smooth'})} className="h-[48px] px-7 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#0A1931] font-mono text-[12px] tracking-[0.14em] uppercase grid place-items-center hover:bg-[#F0E9DB] transition">View 5 Roles</button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 max-w-[420px]">
                {[{k:'5',v:'Open Roles'},{k:'1247',v:'Pros Live'},{k:'4.9',v:'TrustScore'}].map((s)=>(
                  <div key={s.v} className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                    <div className="font-['Poppins'] font-bold text-[22px] leading-none text-[#0A1931]">{s.k}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 bg-[var(--m-gradient)] opacity-[0.08] blur-[40px] rounded-[32px] pointer-events-none" />
              <div className="relative grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {TRADES.map((t)=>(
                  <div key={t.id} className="group relative rounded-[24px] overflow-hidden bg-[#141414] border border-[#D4CBB8] aspect-[4/5] md:aspect-[3/4] glow">
                    <img src={t.image} alt={`${t.name} ${t.count} Oldham`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${t.tint} via-black/20 to-transparent opacity-80`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#D4CBB8] px-2.5 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />
                      <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[#0A1931]">{t.tag}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                      <div className="flex items-end justify-between">
                        <div><div className="font-['Poppins'] font-bold text-[16px] md:text-[18px] leading-none text-[#0A1931]">{t.name}</div><div className="mt-1 font-mono text-[9px] tracking-[0.12em] uppercase text-[#5B6470]">{t.loc}</div></div>
                        <div className="rounded-full bg-white text-black px-2 py-1 font-mono text-[10px] font-bold leading-none">{t.count}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[16px] bg-[#0c0c0c] border border-[#D4CBB8] px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">All Skills Verified • Touch of GOD • Real Work OS</span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">OL1 OL2 OL8</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-[#D4CBB8] bg-[#F0E9DB]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div><div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#5B6470] mb-3">Section 01 — Why Join • Values</div><h2 className="font-['Poppins'] font-extrabold text-[36px] md:text-[56px] leading-[0.9] tracking-[-0.03em]"><span className="text-[#0A1931]">Not SaaS.</span> <span className="m-gradient-text">Sacred Build.</span></h2></div>
            <p className="max-w-[420px] font-['Inter'] text-[14px] leading-[1.6] text-[#5B6470]">We don’t build filters. We build ledger, escrow, projects that pay Oldham families. Same glassmorphism as No.1 hero, but for real work.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {VALUES.map((v)=>(
              <div key={v.k} className="group relative rounded-[24px] overflow-hidden bg-[#141414] border border-[#D4CBB8] min-h-[320px] p-6 flex flex-col justify-between glow hover:glow-m transition">
                <div className="absolute inset-0 opacity-[0.18] group-hover:opacity-[0.28] transition duration-700 bg-cover bg-center" style={{ backgroundImage: `url(${v.image})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-[#050505]/80 to-[#141414]/60" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-[radial-gradient(ellipse_at_top,_rgba(143,255,74,0.10),_transparent_60%)]" />
                <div className="relative"><div className="flex items-center justify-between"><span className="font-mono text-[11px] tracking-[0.18em] uppercase text-[#5B6470]">{v.k}</span><span className="h-8 w-8 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] grid place-items-center font-mono text-[11px] text-[#5B6470]">{v.k}</span></div><h3 className="mt-10 font-['Poppins'] font-bold text-[26px] leading-[0.95] tracking-[-0.02em] text-[#0A1931] max-w-[220px]">{v.title}</h3></div>
                <div className="relative"><p className="font-['Inter'] text-[14px] leading-[1.5] text-[#5B6470]">{v.desc}</p><div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roles" className="relative border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8 py-16 md:py-24">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 px-3 py-1 mb-4"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" /><span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#8FFF4A]">Section 02 — Open Roles • 5 Positions</span></div>
              <h2 className="font-['Poppins'] font-extrabold text-[40px] md:text-[64px] leading-[0.9] tracking-[-0.04em] text-[#0A1931]">Build the OS<br /><span className="m-gradient-text">Brick by Brick.</span></h2>
            </div>
            <div className="lg:max-w-[360px]">
              <p className="font-['Inter'] text-[14px] leading-[1.6] text-[#5B6470]">Every role touches real skill images. Senior Engineer sees torque, Designer sees lace. We hire craftsmen who understand craftsmen.</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-6 w-12 rounded-[4px] overflow-hidden opacity-70 bg-cover bg-center" style={{ backgroundImage: `url(${logoFull})` }} />
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">My Face Profile OS • Est Oldham</span>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            {ROLES.map((role)=>(
              <div key={role.id} className={`group relative rounded-[24px] overflow-hidden border ${activeRole===role.id?'border-[#D4CBB8] bg-[#141414]':'border-[#D4CBB8] bg-[#0e0e0e]'} transition-all`}>
                <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
                  <div className="p-6 md:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className={`inline-flex h-7 px-3 rounded-full bg-gradient-to-r ${role.color} text-black font-mono text-[10px] font-bold tracking-[0.14em] uppercase items-center`}>{role.dept}</span>
                      <span className="inline-flex h-7 px-3 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#5B6470] font-mono text-[10px] tracking-[0.12em] uppercase items-center">{role.type}</span>
                      <span className="inline-flex h-7 px-3 rounded-full bg-[#141414] border border-[#D4CBB8] text-[#5B6470] font-mono text-[10px] tracking-[0.12em] uppercase items-center">{role.salary}</span>
                    </div>
                    <h3 className="font-['Poppins'] font-extrabold text-[24px] md:text-[32px] leading-[0.95] tracking-[-0.02em] text-[#0A1931]">{role.title}</h3>
                    <p className="mt-4 font-['Inter'] text-[14px] md:text-[15px] leading-[1.6] text-[#5B6470] max-w-[560px]">{role.blurb}</p>
                    <div className="mt-6 flex flex-wrap gap-2">{role.stack.map((s)=>(<span key={s} className="inline-flex h-7 px-3 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#5B6470] font-mono text-[10px] tracking-[0.08em] uppercase items-center">{s}</span>))}</div>
                    <div className="mt-8 flex gap-3">
                      <button onClick={()=>{ setForm((f)=>({...f,role:role.id})); setShowApply(true); }} className="h-11 px-6 rounded-full bg-white text-black font-mono text-[11px] font-bold tracking-[0.14em] uppercase hover:bg-white/90 transition">Apply for {role.title.split(' ')[0]} →</button>
                      <button onClick={()=>setActiveRole(activeRole===role.id?null:role.id)} className="h-11 w-11 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] grid place-items-center text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB] transition"><span className={`transition ${activeRole===role.id?'rotate-45':''} text-[18px] leading-none`}>+</span></button>
                    </div>
                    {activeRole===role.id && (
                      <div className="mt-8 rounded-[16px] bg-black/40 border border-[#D4CBB8] p-5">
                        <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5B6470] mb-3">What You’ll Ship First 90 Days</div>
                        <ul className="space-y-2 font-['Inter'] text-[13px] leading-[1.5] text-[#5B6470]">
                          <li>• Ship 1 real trade flow — e.g., tailor lace measurement → project post → escrow</li>
                          <li>• Pair with 2 pros in Oldham — 1 morning on site (OL8 builders 6am), 1 evening in shop</li>
                          <li>• Reduce TrustScore gaming by 50% or improve booking conversion by 15%</li>
                          <li>• Demo to Touch of GOD council — craft as worship, not hustle</li>
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="relative min-h-[280px] lg:min-h-full bg-[#141414] overflow-hidden">
                    <div className="absolute inset-0 grid" style={{ gridTemplateColumns: role.images.length>2?'repeat(3,1fr)':'repeat(2,1fr)' }}>
                      {role.images.slice(0,6).map((img,i)=>(
                        <div key={i} className="relative overflow-hidden border-r border-b border-[#D4CBB8] last:border-r-0">
                          <div className="absolute inset-0 bg-cover bg-center group-hover:scale-[1.04] transition duration-700" style={{ backgroundImage: `url(${img})` }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                      ))}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-black/70 backdrop-blur-md border border-[#D4CBB8] px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />
                        <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Real Work Images • {role.images.length} trades</span>
                      </span>
                      <span className="hidden md:inline-flex rounded-full bg-white text-black px-2.5 py-1 font-mono text-[10px] font-bold">OL</span>
                    </div>
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pros" className="relative border-t border-[#D4CBB8] bg-[#F0E9DB] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-[0.12]" style={{ backgroundImage: `url(${imgBuilders})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(143,255,74,0.10),_transparent_60%)]" />
        </div>
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-8 py-16 md:py-28">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div className="lg:sticky lg:top-[88px]">
              <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#5B6470] mb-4">Section 03 — How We Build • Brick by Brick</div>
              <h2 className="font-['Poppins'] font-extrabold text-[36px] md:text-[52px] leading-[0.9] tracking-[-0.04em] text-[#0A1931]">Oldham First.<br />Then World.</h2>
              <div className="mt-8 rounded-[24px] overflow-hidden border border-[#D4CBB8] bg-[#141414]/80 backdrop-blur-xl">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imgBuilders})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4"><div className="rounded-[16px] bg-black/70 backdrop-blur-md border border-[#D4CBB8] p-4"><div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">Live Site • OL8 • 06:14 AM</div><div className="mt-1 font-['Poppins'] font-bold text-[18px] text-[#0A1931] leading-tight">Oldham Builders laying bricks — This is our OS metaphor</div></div></div>
                  <div className="absolute top-4 left-4 rounded-full bg-[#8FFF4A] text-black px-3 py-1 font-mono text-[10px] font-bold tracking-[0.12em] uppercase">Holy Build • Real Work</div>
                </div>
                <div className="p-5 grid grid-cols-3 gap-3">
                  {[{k:'OL1',v:'Centre • Tailors Barbers'},{k:'OL2',v:'Chadderton • Garage Sparks'},{k:'OL8',v:'Bardsley • Builders Plumbers'}].map((loc)=>(
                    <div key={loc.k} className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] p-3"><div className="font-mono text-[12px] font-bold text-[#0A1931]">{loc.k}</div><div className="mt-1 font-mono text-[9px] leading-[1.3] text-[#5B6470] uppercase">{loc.v}</div></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[24px] border border-[#D4CBB8] bg-[#141414]/90 backdrop-blur-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-[10px] bg-white p-[2px] overflow-hidden"><div className="h-full w-full rounded-[8px] bg-cover bg-center" style={{ backgroundImage: `url(${logoM})` }} /></div>
                  <div><div className="font-['Poppins'] font-bold text-[16px] text-[#0A1931]">From VisaguideOS → My Face Profile</div><div className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">2019 • Single Skill → 2025 • All Skills OS</div></div>
                </div>
                <div className="space-y-6">
                  {[
                    { year: '2019', title: 'VisaguideOS — Barbers only', desc: 'Started with fade line designs. One image: barber fade. Learned trust is everything.', img: imgBarber },
                    { year: '2021', title: 'Add Tailors — Lace & Sew', desc: '247 tailors in Oldham had no portfolio. We gave them glass cards, 24px radius, divine glow.', img: imgTailor },
                    { year: '2022', title: 'Mechanics + Builders', desc: 'J Martinez torque specs, Oldham builders 6am starts. Real work > filter proven.', img: imgMechanic },
                    { year: '2023', title: 'Sparks & Gas Safe', desc: 'Electrician BS 7671 30mA RCD, Worcester Bosch boiler. Compliance becomes product.', img: imgElectrician },
                    { year: '2025', title: 'My Face Profile — All 6 Trades OS', desc: '1247 pros, 12K projects, 4.9 TrustScore. Oldham → Manchester → UK → World. Touch of GOD.', img: imgPlumber },
                  ].map((step)=>(
                    <div key={step.year} className="flex gap-4">
                      <div className="flex flex-col items-center"><div className="h-8 w-8 rounded-full bg-white text-black grid place-items-center font-mono text-[11px] font-bold">{step.year.slice(-2)}</div><div className="mt-2 w-px flex-1 bg-[#F0E9DB]" /></div>
                      <div className="flex-1 pb-6"><div className="flex gap-3"><div className="h-14 w-14 rounded-[12px] border border-[#D4CBB8] hidden md:block bg-cover bg-center" style={{ backgroundImage: `url(${step.img})` }} /><div><div className="font-['Poppins'] font-bold text-[15px] text-[#0A1931]">{step.title}</div><div className="mt-1 font-['Inter'] text-[13px] leading-[1.5] text-[#5B6470] max-w-[420px]">{step.desc}</div></div></div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {TRADES.map((t)=>(
                  <div key={`mini-${t.id}`} className="rounded-[20px] bg-[#141414] border border-[#D4CBB8] overflow-hidden flex gap-3 p-3">
                    <div className="h-14 w-14 rounded-[12px] bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${t.image})` }} />
                    <div><div className="font-['Poppins'] font-bold text-[13px] text-[#0A1931]">{t.name}</div><div className="font-mono text-[9px] tracking-[0.12em] uppercase text-[#5B6470] mt-1">{t.count} pros • Real Work</div><div className="mt-2 inline-flex rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-2 py-0.5 font-mono text-[8px] uppercase text-[#5B6470]">{t.tag}</div></div>
                  </div>
                ))}
              </div>

              <div className="rounded-[20px] bg-[var(--m-gradient)] p-[1px]"><div className="rounded-[19px] bg-[#0c0c0c] p-5 flex items-center justify-between gap-4"><div><div className="font-mono text-[10px] tracking-[0.16em] uppercase text-[#5B6470]">Live OS Stats • Oldham</div><div className="mt-1 font-['Poppins'] font-bold text-[18px] text-[#0A1931]">1,247 pros • 12K Projects • 4.9 Trust • Touch of GOD</div></div><div className="hidden md:grid h-12 w-12 rounded-full bg-white place-items-center font-mono text-[12px] font-bold text-black">OL</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <footer id="os" className="relative border-t border-[#D4CBB8] bg-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(143,255,74,0.14),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,138,0,0.10),_transparent_60%)]" />
        <div className="relative mx-auto max-w-[1440px] px-5 md:px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-1.5 mb-6"><span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" /><span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5B6470]">Page 19 of 24 • Careers Standalone • Production-ready</span></div>
              <h2 className="font-['Poppins'] font-extrabold text-[42px] md:text-[72px] leading-[0.85] tracking-[-0.05em]"><span className="block text-[#0A1931]">Join Us —</span><span className="block text-[#0A1931]">Build the OS</span><span className="block m-gradient-text">Brick by Brick —</span><span className="block text-[#0A1931] text-[32px] md:text-[44px] mt-2">Oldham Is Waiting.</span></h2>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={()=>setShowApply(true)} className="h-[56px] px-8 rounded-full bg-[var(--m-gradient)] text-black font-['Poppins'] font-bold text-[15px] tracking-[-0.01em] hover:scale-[1.02] transition">Apply Now — 5 Roles Open →</button>
                <div className="flex items-center gap-3 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] px-5 h-[56px]"><span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5B6470]">iOS • Android • Web</span><span className="h-6 w-px bg-[#F0E9DB]" /><span className="flex gap-1"><span className="h-6 w-10 rounded-[6px] bg-white/90 grid place-items-center font-mono text-[8px] font-bold text-black">iOS</span><span className="h-6 w-10 rounded-[6px] bg-white/90 grid place-items-center font-mono text-[8px] font-bold text-black">AND</span></span></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-[24px] bg-[#141414] border border-[#D4CBB8] p-6">
                <div className="flex items-center justify-between mb-6"><span className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5B6470]">My Face Profile OS • Live</span><span className="inline-flex items-center gap-1.5 rounded-full bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 px-2.5 py-1"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" /><span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#8FFF4A]">Hiring</span></span></div>
                <div className="grid grid-cols-2 gap-3">
                  {[{k:'5',l:'Open Roles'},{k:'1247',l:'Pros Live'},{k:'12K',l:'Projects'},{k:'4.9',l:'TrustScore'}].map((s)=>(
                    <div key={s.l} className="rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-4"><div className="font-['Poppins'] font-extrabold text-[28px] leading-none text-[#0A1931]">{s.k}</div><div className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">{s.l}</div></div>
                  ))}
                </div>
                <div className="mt-6 rounded-[12px] bg-black border border-[#D4CBB8] p-3 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-[8px] bg-white p-[2px] overflow-hidden shrink-0"><img src={logoFull} alt="My Face Profile full" className="h-full w-full object-cover rounded-[6px]" /></div>
                  <div><div className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Touch of GOD • Craft as Worship</div><div className="font-['Inter'] text-[12px] text-[#5B6470]">We build holy, not hustle. Real work &gt; filter.</div></div>
                </div>
              </div>
              <div className="rounded-[16px] bg-[#0c0c0c] border border-[#D4CBB8] px-4 py-3 flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">© 2025 My Face Profile • Oldham • Touch of GOD</span><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470]">Page 19 / 24</span></div>
            </div>
          </div>

          <div className="mt-16 md:mt-24 border-t border-[#D4CBB8] pt-10">
            <div className="flex items-center justify-between mb-6"><h3 className="font-['Poppins'] font-bold text-[18px] text-[#0A1931]">Application Ledger — Trust &gt; Likes • {apps.length} recent</h3><span className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#5B6470]">{loadingApps?'Loading…':'Live from records.list'}</span></div>
            {apps.length===0?(
              <div className="rounded-[16px] border border-dashed border-[#D4CBB8] bg-white/[0.02] p-8 text-center"><div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[#5B6470]">No applications yet • Be first to build brick by brick • Oldham waits</div></div>
            ):(
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">{apps.slice(0,6).map((a,i)=>(<div key={i} className="rounded-[16px] bg-[#141414] border border-[#D4CBB8] p-4"><div className="flex items-center justify-between"><span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">{a.role} • {a.craft||'Craft'}</span><span className="h-2 w-2 rounded-full bg-[#8FFF4A]" /></div><div className="mt-2 font-['Poppins'] font-bold text-[14px] text-[#0A1931]">{a.name}</div><div className="mt-1 font-['Inter'] text-[12px] leading-[1.4] text-[#5B6470] line-clamp-2">{a.why}</div></div>))}</div>
            )}
          </div>
        </div>
      </footer>

      {showApply && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={()=>setShowApply(false)} />
          <div className="relative w-full md:max-w-[640px] max-h-[92vh] md:max-h-[90vh] rounded-t-[32px] md:rounded-[32px] bg-[#0e0e0e] border border-white/[0.10] overflow-hidden flex flex-col shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.8),0_0_120px_rgba(143,255,74,0.10)]">
            <div className="h-[3px] w-full bg-[var(--m-gradient)]" />
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="flex items-start justify-between gap-4">
                <div><div className="inline-flex items-center gap-2 rounded-full bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 px-3 py-1 mb-3"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" /><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#8FFF4A]">Apply • Touch of GOD • Brick by Brick</span></div><h3 className="font-['Poppins'] font-extrabold text-[28px] leading-[0.9] tracking-[-0.02em] text-[#0A1931]">Build the OS<br />for Real Work.</h3><p className="mt-3 font-['Inter'] text-[13px] leading-[1.5] text-[#5B6470] max-w-[380px]">Oldham first. 1247 pros already trust us. Show real work, not hustle.</p></div>
                <button onClick={()=>setShowApply(false)} className="h-9 w-9 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] grid place-items-center text-[#5B6470] hover:text-[#0A1931]">✕</button>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {ROLES.map((r)=>(
                  <button key={r.id} onClick={()=>setForm((f)=>({...f,role:r.id}))} className={`rounded-[12px] border p-3 text-left transition ${form.role===r.id?'bg-white text-black border-white':'bg-[#F0E9DB] border-[#D4CBB8] text-[#5B6470] hover:bg-[#F0E9DB]'}`}>
                    <div className="font-mono text-[10px] tracking-[0.12em] uppercase leading-[1.1]">{r.title.split(' ')[0]}</div><div className="font-['Poppins'] font-bold text-[11px] leading-[1.1] mt-1 line-clamp-2">{r.title}</div>
                  </button>
                ))}
              </div>
              <div className="mt-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470] mb-2 block">Full Name *</span><input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="e.g. Aisha Khan — Tailor" className="w-full h-11 rounded-[12px] bg-[#141414] border border-[#D4CBB8] px-4 font-['Inter'] text-[14px] text-[#0A1931] placeholder:text-[#5B6470] focus:border-[#8FFF4A]/50 focus:outline-none" /></label>
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470] mb-2 block">Email *</span><input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="you@realwork.co.uk" className="w-full h-11 rounded-[12px] bg-[#141414] border border-[#D4CBB8] px-4 font-['Inter'] text-[14px] text-[#0A1931] placeholder:text-[#5B6470] focus:border-[#8FFF4A]/50 focus:outline-none" /></label>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470] mb-2 block">Your Craft</span><input value={form.craft} onChange={(e)=>setForm({...form,craft:e.target.value})} placeholder="Mechanic, Builder, Barber..." className="w-full h-11 rounded-[12px] bg-[#141414] border border-[#D4CBB8] px-4 font-['Inter'] text-[14px] text-[#0A1931] placeholder:text-[#5B6470] focus:border-[#8FFF4A]/50 focus:outline-none" /></label>
                  <label className="block"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470] mb-2 block">Portfolio / Link</span><input value={form.link} onChange={(e)=>setForm({...form,link:e.target.value})} placeholder="github, figma, insta..." className="w-full h-11 rounded-[12px] bg-[#141414] border border-[#D4CBB8] px-4 font-['Inter'] text-[14px] text-[#0A1931] placeholder:text-[#5B6470] focus:border-[#8FFF4A]/50 focus:outline-none" /></label>
                </div>
                <label className="block"><span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#5B6470] mb-2 block">Why Real Work &gt; Filter? *</span><textarea value={form.why} onChange={(e)=>setForm({...form,why:e.target.value})} placeholder="Tell us about one real job you did brick by brick... Touch of GOD moment..." rows={4} className="w-full rounded-[12px] bg-[#141414] border border-[#D4CBB8] p-4 font-['Inter'] text-[14px] text-[#0A1931] placeholder:text-[#5B6470] focus:border-[#8FFF4A]/50 focus:outline-none resize-none" /></label>
                {submitResult && (<div className={`rounded-[12px] border p-3 font-mono text-[11px] ${submitResult.error?'bg-red-500/10 border-red-500/20 text-red-300':'bg-[#8FFF4A]/10 border-[#8FFF4A]/20 text-[#8FFF4A]'}`}>{submitResult.error?`Error: ${submitResult.error}`:`Saved ${submitResult.saved} • Ledger updated • Oldham welcomes you`}</div>)}
                <div className="flex gap-3 pt-2">
                  <button disabled={submitting||!form.name||!form.email||!form.why} onClick={handleSubmit} className="flex-1 h-12 rounded-full bg-[var(--m-gradient)] text-black font-mono text-[12px] font-bold tracking-[0.14em] uppercase disabled:opacity-40 hover:scale-[1.01] transition">{submitting?'Saving to Ledger...':'Submit — Build Brick by Brick →'}</button>
                  <button onClick={()=>setShowApply(false)} className="h-12 px-6 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#0A1931] font-mono text-[11px] tracking-[0.14em] uppercase">Cancel</button>
                </div>
                <div className="flex items-center gap-2 pt-2"><div className="h-6 w-6 rounded-full bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${imgBuilders})` }} /><span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[#5B6470]">Oldham builders laying bricks • OL8 • 6am start • Touch of GOD</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
