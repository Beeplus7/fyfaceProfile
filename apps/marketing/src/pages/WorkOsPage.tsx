import { useEffect, useRef, useState } from 'react';
import logoMain from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoAlt from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import imgTailor from "../assets/0d6564d2fa205a01-image_20261029_173924.webp";
import imgMechanic from "../assets/58168934cd6080e3-image_20261029_173915.webp";
import imgBuilder from "../assets/ab9fac428a8b31b4-image_20261029_173918.webp";
import imgBarber from "../assets/5471205d5685489f-image_20261029_173914.webp";

const layers = [
  {
    id: 'kernel',
    label: 'LAYER 1 — KERNEL',
    title: 'Kernel',
    sub: 'PID 0 • Bare Metal Trust',
    items: [
      { k: 'Identity', v: 'DID + Veriff + Bio hash', icon: '◧' },
      { k: 'Verification', v: 'Liveness, doc-scan, proof-of-work', icon: '◨' },
      { k: 'Storage', v: 'S3 / R2 / signed URLs', icon: '⧉' },
      { k: 'Video', v: 'Mux • Cloudflare Stream • HLS', icon: '▶' },
      { k: 'Live', v: 'LiveKit SFU • WebRTC', icon: '◎' },
      { k: 'Payments', v: 'Stripe Connect • Escrow', icon: '$' },
      { k: 'PostGIS', v: 'Geo-fence, radius, map tiles', icon: '⌖' },
      { k: 'Trust Ledger', v: 'Append-only, attestations', icon: '≋' },
    ]
  },
  {
    id: 'system',
    label: 'LAYER 2 — SYSTEM SERVICES',
    title: 'System Services',
    sub: 'Daemons • Always On',
    items: [
      { k: 'Feed Engine', v: 'Ranked by trust, not likes', icon: '≡' },
      { k: 'Search', v: 'Typesense + pgvector hybrid', icon: '⌕' },
      { k: 'Notifications', v: 'Push, in-app, email, webhooks', icon: '◐' },
      { k: 'BullMQ Event Bus', v: 'Events → Jobs → Side effects', icon: '↝' },
      { k: 'AI Layer', v: 'WorkCut, Quoto, TrustScore LLM', icon: '✦' },
    ]
  },
  {
    id: 'uprm',
    label: 'LAYER 3 — UPRM ORCHESTRATOR',
    title: 'UPRM — Users Personal Relationship Manager',
    sub: 'PID 1 • Orchestrates Everything',
    highlight: true,
    items: [
      { k: 'Relationship Graph', v: 'People ↔ Skills ↔ Work ↔ Commerce', icon: '◈' },
      { k: 'Event Sourcing', v: 'Every message = event, replayable', icon: '↺' },
      { k: 'Pipeline State Machine', v: 'Inquiry → Quote → Milestone → Done', icon: '⤳' },
    ]
  },
  {
    id: 'apps',
    label: 'LAYER 4 — APPS',
    title: 'Apps Layer',
    sub: 'What Pros & Clients Touch',
    items: [
      { k: 'Timeline', v: 'Reels of real work, auto-edited', icon: '◫' },
      { k: 'Project Manager', v: 'Milestones, files, approvals', icon: '▤' },
      { k: 'Shop', v: 'Bookable services & products', icon: '◫' },
      { k: 'Live Studio', v: 'Go live to clients, sell live', icon: '◉' },
      { k: 'WorkCut', v: 'CapCut for Work — trim + captions', icon: '✂' },
      { k: 'Wallet', v: 'Escrow, payouts, invoices', icon: '₿' },
      { k: 'Bot Army', v: 'Quoto, Followup, Review bots', icon: '⚑' },
    ]
  },
];

function BgImg({ src, alt, className, children }: { src: string; alt: string; className?: string; children?: React.ReactNode }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{ backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {children}
    </div>
  );
}

export default function WorkOsPage() {
  const [activeLayer, setActiveLayer] = useState('uprm');
  const revealRefs = useRef<HTMLDivElement[]>([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [quoteSent, setQuoteSent] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealRefs.current.forEach(r => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  const addReveal = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', background: 'var(--bg)', minHeight: '100vh' }}
      className="w-full overflow-x-clip selection:bg-[#FFC300]/35 selection:text-[#0A1931]"
    >
      <header
        data-safe-area-sticky-top
        className="sticky z-50 border-b border-[#D4CBB8] backdrop-blur-xl"
        style={{ top: 'var(--safe-area-inset-top)', background: 'rgba(255,253,247,0.92)' }}
      >
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-[10px] flex items-center justify-center font-black text-black text-[18px] poppins" style={{ background: 'var(--gradient-m)' }}>M</div>
            <div className="flex items-baseline gap-[2px] leading-none">
              <span className="poppins font-bold text-[16px] tracking-[-0.02em] text-[#0A1931]">My</span>
              <span className="poppins font-extrabold text-[16px] tracking-[-0.02em] m-gradient-text">Face</span>
              <span className="poppins font-bold text-[16px] tracking-[-0.02em] text-[#0A1931]">Profile</span>
            </div>
            <div className="hidden md:flex ml-4 pl-4 border-l border-[#D4CBB8] items-center gap-2">
              <img src={logoMain} alt="My Face Profile logo mark" className="h-6 w-6 rounded object-cover opacity-90" />
              <span className="mono text-[10px] tracking-[0.18em] text-[#5B6470] uppercase">No.3 / 24 • Work OS</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-7">
            {[
              { l: 'Home', h: '#home' },
              { l: 'How It Works', h: '#how' },
              { l: 'Work OS', h: '#workos', active: true },
              { l: 'Projects', h: '#projects' },
              { l: 'Pricing', h: '#pricing' },
            ].map(i => (
              <a
                key={i.l}
                href={i.h}
                className={`text-[13px] tracking-[-0.01em] transition ${i.active ? 'text-[#0A1931] font-medium border-b border-white pb-[2px]' : 'text-[#5B6470] hover:text-[#0A1931]'}`}
              >{i.l}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#cta"
              className="hidden md:inline-flex h-9 px-4 rounded-full items-center justify-center text-[13px] font-semibold text-black poppins tracking-[-0.01em] hover:scale-[1.02] transition"
              style={{ background: 'var(--gradient-m)' }}
            >Join as Pro</a>
            <button onClick={() => setMobileMenu(v => !v)} className="lg:hidden h-9 w-9 rounded-full glass flex items-center justify-center text-[#0A1931]">☰</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-[#D4CBB8] px-5 py-4 flex flex-col gap-3 bg-[#F0E9DB]">
            {['Home','How It Works','Work OS','Projects','Pricing'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s/g,'')}`} className="text-sm text-[#5B6470]">{l}</a>
            ))}
          </div>
        )}
      </header>

      <div className="w-full border-b border-[#D4CBB8] bg-[#FFF8E1]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-5 px-2 rounded-full items-center text-[10px] font-medium tracking-[0.12em] mono text-black" style={{ background: 'var(--gradient-m)' }}>PRODUCTION ARTIFACT</span>
            <span className="mono text-[11px] text-[#5B6470] tracking-[0.08em]">No.3 of 24 — Work OS — Production Brand Artifact — Same fonts as No.1</span>
          </div>
          <span className="hidden md:inline mono text-[10px] text-[#5B6470]">Poppins 800 • Inter 400/500 • JetBrains Mono • #050505</span>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-[1200px] h-[700px] opacity-60" style={{ background: 'var(--gradient-glow)' }} />
          <div className="absolute left-[-10%] top-[20%] w-[520px] h-[520px] rounded-full blur-[90px] bg-[#8FFF4A]/10" />
          <div className="absolute right-[-12%] top-[30%] w-[640px] h-[640px] rounded-full blur-[110px] bg-[#FF8A00]/10" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8 pt-14 md:pt-20 pb-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <div className="reveal" ref={addReveal}>
                <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full glass">
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: '#8FFF4A' }} />
                  <span className="mono text-[11px] tracking-[0.16em] uppercase text-[#5B6470]">Work OS • The OS for Real Work</span>
                </div>
              </div>

              <h1 className="reveal mt-6 poppins font-extrabold leading-[0.9] tracking-[-0.04em] text-[40px] md:text-[64px] lg:text-[72px]" ref={addReveal}>
                <span className="block text-[#0A1931]">Not an App.</span>
                <span className="block text-[#0A1931]">An Operating</span>
                <span className="block text-[#0A1931]">System for Work.</span>
                <span className="block mt-3 m-gradient-text text-[28px] md:text-[36px] lg:text-[42px] leading-[1.05] tracking-[-0.03em]">Kernel + UPRM + Apps</span>
              </h1>

              <p className="reveal mt-6 text-[16px] md:text-[18px] leading-[1.55] text-[#5B6470] max-w-[560px]" ref={addReveal}>
                Like VisaguideOS orchestrated guides, <span className="text-[#0A1931]">My Face Profile OS</span> orchestrates people, skills, work, content, trust and commerce — with <span className="mono text-[#0A1931] bg-[#F0E9DB] px-1.5 py-0.5 rounded">UPRM as PID 1</span>.
              </p>

              <div className="reveal mt-8 flex flex-wrap items-center gap-3" ref={addReveal}>
                <a href="#architecture" className="h-11 px-6 rounded-full inline-flex items-center justify-center text-[14px] font-semibold text-black poppins" style={{ background: 'var(--gradient-m)' }}>Explore OS Architecture ↓</a>
                <a href="#architecture" className="h-11 px-5 rounded-full glass inline-flex items-center gap-2 text-[13px] text-[#5B6470]"><span className="h-5 w-5 rounded-full bg-[#F0E9DB] flex items-center justify-center">◫</span> See OS Architecture</a>
              </div>

              <div className="reveal mt-10 grid grid-cols-3 gap-3 max-w-[520px]" ref={addReveal}>
                {[
                  { k: 'Real Work', v: 'Before/After, Milestones, Loom' },
                  { k: 'TrustScore', v: 'Ledger, attestations' },
                  { k: 'Commerce', v: 'Bookings, Escrow, Wallet' },
                ].map(c => (
                  <div key={c.k} className="glass rounded-[14px] p-3">
                    <div className="mono text-[10px] tracking-[0.14em] text-[#5B6470] uppercase">{c.k}</div>
                    <div className="mt-1 text-[12px] text-[#5B6470] leading-[1.3]">{c.v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="reveal relative" ref={addReveal}>
              <div className="relative rounded-[28px] overflow-hidden glass-strong p-3 md:p-4">
                <div className="rounded-[20px] overflow-hidden bg-[#F0E9DB] border border-[#D4CBB8]">
                  <div className="h-9 flex items-center justify-between px-4 border-b border-[#D4CBB8]">
                    <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" /></div>
                    <span className="mono text-[10px] text-[#5B6470]">myfaceprofile-os://kernel</span>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-3">
                    <BgImg src={imgTailor} alt="Tailor sewing wedding dress lace" className="rounded-xl aspect-[4/3] w-full" />
                    <BgImg src={imgMechanic} alt="Female mechanic J Martinez diagnosing engine" className="rounded-xl aspect-[4/3] w-full" />
                    <BgImg src={imgBuilder} alt="Builders laying bricks Oldham Builders van" className="rounded-xl aspect-[4/3] w-full" />
                    <BgImg src={imgBarber} alt="Barber giving fade haircut" className="rounded-xl aspect-[4/3] w-full" />
                  </div>
                  <div className="px-4 pb-4 flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {[imgTailor, imgMechanic, imgBuilder, imgBarber].map((im,i) => (
                        <div key={i} className="h-7 w-7 rounded-full border-2 border-[#FFFDF7]" style={{ backgroundImage: `url(${im})`, backgroundSize: 'cover' }} />
                      ))}
                    </div>
                    <span className="mono text-[10px] text-[#5B6470]">4 jobs → UPRM → live</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="rounded-full h-7 glass flex items-center justify-center mono text-[10px] text-[#5B6470]">◧ Kernel</div>
                  <div className="rounded-full h-7 flex items-center justify-center mono text-[10px] text-black font-semibold" style={{ background: 'var(--gradient-m)' }}>◈ UPRM PID1</div>
                  <div className="rounded-full h-7 glass flex items-center justify-center mono text-[10px] text-[#5B6470]">◫ Apps</div>
                </div>
              </div>
              <div className="absolute -right-6 -top-6 hidden md:flex h-12 w-12 rounded-[14px] items-center justify-center text-black font-black poppins text-xl rotate-6" style={{ background: 'var(--gradient-m)' }}>M</div>
            </div>
          </div>
        </div>
      </section>

      <section id="architecture" className="relative border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mono text-[11px] tracking-[0.2em] text-[#5B6470] uppercase">OS Architecture • Interactive</div>
              <h2 className="mt-3 poppins font-extrabold text-[30px] md:text-[44px] leading-[0.95] tracking-[-0.03em]">The 4-Layer OS Stack<br /><span className="m-gradient-text">From kernel to commerce</span></h2>
            </div>
            <div className="mono text-[12px] text-[#5B6470] max-w-[360px] leading-[1.5]">Click any layer to expand. Real work images orbit UPRM — every job becomes an event, every event becomes trust.</div>
          </div>

          <div className="mt-12 relative">
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.18]">
              <div className="w-full h-full rounded-full" style={{ background: 'var(--gradient-glow)' }} />
              <div className="absolute inset-0 flex items-center justify-center text-[320px] font-black poppins leading-none select-none" style={{ background: 'var(--gradient-m)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>M</div>
            </div>

            <div className="relative grid gap-4">
              <div className="hidden md:flex absolute left-[32px] top-[20px] bottom-[20px] w-px bg-gradient-to-b from-[#8FFF4A]/60 via-[#FFE600]/50 to-[#FF8A00]/60" />

              {layers.map((layer, idx) => {
                const isActive = activeLayer === layer.id;
                return (
                  <div
                    key={layer.id}
                    ref={addReveal}
                    className={`reveal relative rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer ${isActive ? 'ring-1 ring-[#D4CBB8] scale-[1.01] shadow-[0_12px_32px_rgba(10,25,49,0.08)]' : 'hover:scale-[1.005]'}`}
                    style={{
                      background: layer.highlight
                        ? 'linear-gradient(180deg, rgba(143,255,74,0.18) 0%, rgba(0,229,192,0.12) 35%, #F0E9DB 100%)'
                        : 'linear-gradient(180deg, #F0E9DB 0%, #FFFDF7 100%)',
                      border: layer.highlight ? '1px solid transparent' : '1px solid #D4CBB8',
                      backgroundClip: 'padding-box',
                    }}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    {layer.highlight && (
                      <div className="absolute inset-0 rounded-[24px] pointer-events-none" style={{ background: 'var(--gradient-m)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', padding: '1px' }} />
                    )}

                    <div className="relative flex flex-wrap md:flex-nowrap items-center justify-between gap-4 p-5 md:p-7">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-[14px] flex items-center justify-center text-black font-black poppins text-[18px] shrink-0" style={{ background: layer.highlight ? 'var(--gradient-m)' : '#E8DFCC', color: layer.highlight ? '#000' : '#0A1931' }}>{idx + 1}</div>
                        <div>
                          <div className="mono text-[10px] tracking-[0.16em] text-[#5B6470] uppercase">{layer.label}</div>
                          <div className="poppins font-bold text-[18px] md:text-[22px] tracking-[-0.02em] text-[#0A1931]">{layer.title}</div>
                          <div className="mono text-[11px] text-[#5B6470]">{layer.sub}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="mono text-[10px] text-[#5B6470] hidden md:inline">CLICK TO {isActive ? 'COLLAPSE' : 'EXPAND'}</span>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center border border-[#D4CBB8] transition ${isActive ? 'rotate-45 bg-white text-black' : 'bg-[#F0E9DB] text-[#5B6470]'}`}>＋</div>
                      </div>
                    </div>

                    {isActive && (
                      <div className="relative px-5 md:px-7 pb-7 pt-1">
                        <div className="grid md:grid-cols-12 gap-6">
                          <div className="md:col-span-7 grid sm:grid-cols-2 gap-2">
                            {layer.items.map(it => (
                              <div key={it.k} className="rounded-[14px] glass px-3 py-3 flex gap-3 items-start">
                                <div className="h-7 w-7 rounded-full bg-[#F0E9DB] flex items-center justify-center text-[12px] text-[#5B6470] shrink-0">{it.icon}</div>
                                <div>
                                  <div className="text-[13px] font-medium text-[#0A1931] tracking-[-0.01em]">{it.k}</div>
                                  <div className="text-[11px] text-[#5B6470] leading-[1.35] mono">{it.v}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {layer.id === 'uprm' ? (
                            <div className="md:col-span-5">
                              <div className="rounded-[18px] overflow-hidden bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                                <div className="mono text-[10px] tracking-[0.14em] text-[#5B6470] uppercase mb-3">Real Work Nodes → UPRM → Apps → Coins</div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="relative rounded-xl overflow-hidden">
                                    <img src={imgTailor} alt="Tailor sewing wedding dress lace" className="w-full aspect-[4/3] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                                      <span className="text-[9px] mono bg-[#0A1931]/85 text-white px-1.5 py-0.5 rounded-full">Tailor • Wedding Lace</span>
                                      <span className="text-[9px] mono px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: 'var(--gradient-m)' }}>98%</span>
                                    </div>
                                  </div>
                                  <div className="relative rounded-xl overflow-hidden">
                                    <img src={imgMechanic} alt="Female mechanic J Martinez diagnosing engine" className="w-full aspect-[4/3] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                                      <span className="text-[9px] mono bg-[#0A1931]/85 text-white px-1.5 py-0.5 rounded-full">J. Martinez • OBD2</span>
                                      <span className="text-[9px] mono px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: 'var(--gradient-m)' }}>96%</span>
                                    </div>
                                  </div>
                                  <div className="relative rounded-xl overflow-hidden">
                                    <img src={imgBuilder} alt="Builders laying bricks Oldham Builders van" className="w-full aspect-[4/3] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                                      <span className="text-[9px] mono bg-[#0A1931]/85 text-white px-1.5 py-0.5 rounded-full">Oldham Builders • Brick</span>
                                      <span className="text-[9px] mono px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: 'var(--gradient-m)' }}>99%</span>
                                    </div>
                                  </div>
                                  <div className="relative rounded-xl overflow-hidden">
                                    <img src={imgBarber} alt="Barber giving fade haircut" className="w-full aspect-[4/3] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                                      <span className="text-[9px] mono bg-[#0A1931]/85 text-white px-1.5 py-0.5 rounded-full">Fade Cut • Live</span>
                                      <span className="text-[9px] mono px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: 'var(--gradient-m)' }}>97%</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 text-[11px] mono text-[#5B6470]">
                                  <span className="h-px flex-1 bg-gradient-to-r from-[#8FFF4A] to-[#FF8A00]" />
                                  <span>Work Images → UPRM → Apps → Coins</span>
                                  <span className="h-px flex-1 bg-gradient-to-r from-[#FF8A00] to-[#8FFF4A]" />
                                </div>
                              </div>
                            </div>
                          ) : layer.id === 'apps' ? (
                            <div className="md:col-span-5 rounded-[18px] glass p-4">
                              <div className="mono text-[10px] text-[#5B6470] uppercase mb-2">Data Flow</div>
                              <div className="flex flex-wrap gap-2">
                                {['Timeline','Project Manager','Shop','Live Studio','WorkCut','Wallet','Bot Army'].map(a => (
                                  <span key={a} className="h-7 px-3 rounded-full bg-white/[0.07] border border-[#D4CBB8] text-[11px] text-[#5B6470] mono inline-flex items-center">{a}</span>
                                ))}
                              </div>
                              <div className="mt-4 text-[12px] text-[#5B6470] leading-[1.5]">Each app reads from UPRM graph. Write → Event → BullMQ → Fans-out to Feed, Search, Notifications, Wallet.</div>
                            </div>
                          ) : (
                            <div className="md:col-span-5 rounded-[18px] glass p-4 mono text-[11px] text-[#5B6470] leading-[1.6]">
                              <div className="text-[#5B6470] text-[12px] mb-2 font-medium">Why this layer matters</div>
                              {layer.id === 'kernel' ? 'Kernel = trust. No kernel, no commerce. Identity + payments + video must be primitives, not plugins. Every upload signed, every payout escrowed.' : 'System services = the daemons. Feed ranking by TrustScore, not vanity. Search is hybrid: Typesense lexical + pgvector semantic. BullMQ is the nervous system.'}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#D4CBB8]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="poppins font-extrabold text-[30px] md:text-[44px] leading-[0.95] tracking-[-0.03em]">Why OS,<br />Not App?</h2>
            <p className="mono text-[12px] text-[#5B6470] max-w-[380px] leading-[1.5]">Apps show content. OS shows work, trust, money movement. My Face Profile replaces 7 tools with one graph.</p>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-4">
            <div ref={addReveal} className="reveal rounded-[24px] p-5 flex flex-col glass opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold bg-[#F0E9DB] text-[#5B6470]">✕</div>
                  <span className="poppins font-bold text-[15px] text-[#0A1931]">Instagram</span>
                </div>
                <span className="mono text-[9px] px-2 py-1 rounded-full bg-[#F0E9DB] text-[#5B6470]">OLD APP</span>
              </div>
              <div className="mt-3 mono text-[11px] text-[#5B6470]">Shows content but no trust</div>
              <div className="mt-4 rounded-[16px] bg-[#0C0C0C] border border-[#D4CBB8] p-4 h-[168px] flex flex-col justify-between">
                <div className="text-[12px] text-[#5B6470] mono">Likes ≠ proof of work</div>
                <div className="grid gap-1.5">
                  {['No milestones','No escrow','No real location'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[11px] mono text-[#5B6470]"><span className="h-3 w-3 rounded-full bg-[#F0E9DB] flex items-center justify-center">✕</span>{f}</div>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between"><span className="mono text-[10px] text-[#5B6470]">1 / 3</span><span className="mono text-[10px] text-[#5B6470]">Content-only</span></div>
            </div>

            <div ref={addReveal} className="reveal rounded-[24px] p-5 flex flex-col glass opacity-80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold bg-[#F0E9DB] text-[#5B6470]">✕</div>
                  <span className="poppins font-bold text-[15px] text-[#0A1931]">Fiverr</span>
                </div>
                <span className="mono text-[9px] px-2 py-1 rounded-full bg-[#F0E9DB] text-[#5B6470]">OLD APP</span>
              </div>
              <div className="mt-3 mono text-[11px] text-[#5B6470]">Shows gig but no work</div>
              <div className="mt-4 rounded-[16px] bg-[#0C0C0C] border border-[#D4CBB8] p-4 h-[168px] flex flex-col justify-between">
                <div className="text-[12px] text-[#5B6470] mono">Gigs ≠ before/after</div>
                <div className="grid gap-1.5">
                  {['No live work','No team','No repeat graph'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-[11px] mono text-[#5B6470]"><span className="h-3 w-3 rounded-full bg-[#F0E9DB] flex items-center justify-center">✕</span>{f}</div>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between"><span className="mono text-[10px] text-[#5B6470]">2 / 3</span><span className="mono text-[10px] text-[#5B6470]">Content-only</span></div>
            </div>

            <div ref={addReveal} className="reveal rounded-[24px] p-5 flex flex-col glass-strong ring-1 ring-white/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center text-[13px] font-bold text-black" style={{ background: 'var(--gradient-m)' }}>M</div>
                  <span className="poppins font-bold text-[15px] text-[#0A1931]">My Face Profile</span>
                </div>
                <span className="mono text-[9px] px-2 py-1 rounded-full text-black" style={{ background: 'var(--gradient-m)' }}>NEW OS</span>
              </div>
              <div className="mt-3 mono text-[11px] text-[#5B6470]">Shows real work • TrustScore • Booking</div>
              <div className="mt-4 grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <BgImg src={imgTailor} alt="Tailor sewing wedding dress lace" className="relative rounded-[14px] overflow-hidden aspect-[4/3] w-full" />
                  <BgImg src={imgMechanic} alt="Female mechanic diagnosing engine" className="relative rounded-[14px] overflow-hidden aspect-[4/3] w-full" />
                </div>
                <div className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3">
                  <div className="mono text-[10px] text-[#5B6470] uppercase">Includes</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {['Before/After','Milestones','Team','TrustScore','Booking','Escrow'].map(w => (
                      <span key={w} className="h-6 px-2.5 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] mono text-[#5B6470] inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />{w}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between"><span className="mono text-[10px] text-[#5B6470]">3 / 3</span><span className="mono text-[10px] text-[#5B6470]">Work + Trust + Commerce</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-24">
          <div className="mono text-[11px] tracking-[0.2em] text-[#5B6470] uppercase">UPRM In Action • Live Pipelines</div>
          <h2 className="mt-3 poppins font-extrabold text-[30px] md:text-[44px] leading-[0.95] tracking-[-0.03em]">Every job is a<br /><span className="m-gradient-text">pipeline, not a post</span></h2>

          <div className="mt-10 grid lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
            <div ref={addReveal} className="reveal rounded-[24px] glass-strong p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="poppins font-bold text-[14px] text-[#0A1931]">Pipeline Kanban</span>
                <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#F0E9DB] text-[#5B6470]">UPRM • Event Sourced</span>
              </div>

              <div className="grid gap-3">
                {[
                  { status: 'Inquiry', title: 'Wedding Dress — Aisha', price: '£320', tag: 'Tailor', img: imgTailor, meta: 'Oldham • Lace Fitting #3', color: '#FFE600' },
                  { status: 'In Progress', title: 'Toyota Misfire — J. Martinez', price: 'Quoted £195', tag: 'Mechanic', img: imgMechanic, meta: 'OBD2 P0302 • 2.1k views', color: '#8FFF4A' },
                  { status: 'Milestone 2/3', title: 'Brick Wall — Oldham Builders', price: '£1,240 escrow', tag: 'Builder', img: imgBuilder, meta: '3 days • 12 photos', color: '#00E5C0' },
                  { status: 'Live Now', title: 'Fade Cut — Barber Shop', price: '£25 • Tips £8', tag: 'Barber', img: imgBarber, meta: 'LiveKit • 18 watching', color: '#FF8A00' },
                ].map(c => (
                  <div key={c.title} className="group rounded-[16px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex gap-3 hover:border-[#D4CBB8] transition">
                    <div className="h-[56px] w-[56px] rounded-[12px] shrink-0" style={{ backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[9px] px-1.5 py-0.5 rounded-full text-black font-bold" style={{ background: c.color }}>{c.status}</span>
                        <span className="mono text-[10px] text-[#5B6470] truncate">{c.meta}</span>
                      </div>
                      <div className="mt-1 poppins font-semibold text-[13px] text-[#0A1931] tracking-[-0.01em] truncate">{c.title}</div>
                      <div className="mono text-[11px] text-[#5B6470]">{c.price}</div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] flex items-center justify-center text-[#5B6470] group-hover:bg-white group-hover:text-black transition">↗</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex items-center justify-between">
                <div className="mono text-[11px] text-[#5B6470]">Event bus • BullMQ • 47 events today</div>
                <div className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" /><span className="mono text-[10px] text-[#5B6470]">live</span></div>
              </div>
            </div>

            <div className="grid gap-4">
              <div ref={addReveal} className="reveal rounded-[24px] overflow-hidden glass">
                <div className="relative">
                  <BgImg src={imgTailor} alt="Tailor sewing wedding dress lace" className="w-full aspect-[16/10]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-[#0A1931]/85 border border-[#D4CBB8] text-white">WorkCut • Auto-trimmed</span>
                    <span className="mono text-[10px] px-2 py-1 rounded-full text-black font-bold" style={{ background: 'var(--gradient-m)' }}>Captions ON</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full" style={{ backgroundImage: `url(${logoMain})`, backgroundSize: 'cover' }} />
                      <span className="poppins font-bold text-[13px] text-[#0A1931]">Oldham Wedding Dress Lace Fitting #3</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="mono text-[10px] bg-[#F0E9DB] border border-[#D4CBB8] text-[#5B6470] px-2 py-1 rounded-full">Timeline • 0:42</span>
                      <span className="mono text-[10px] bg-[#F0E9DB] border border-[#D4CBB8] text-[#5B6470] px-2 py-1 rounded-full">Before/After</span>
                      <span className="mono text-[10px] px-2 py-1 rounded-full text-black font-medium" style={{ background: '#FFE600' }}>Trust +12</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between bg-[#E8DFCC]">
                  <span className="mono text-[11px] text-[#5B6470]">Auto: trim silence, add captions, blur background</span>
                  <span className="mono text-[10px] text-[#5B6470]">Mux • HLS</span>
                </div>
              </div>

              <div ref={addReveal} className="reveal rounded-[24px] overflow-hidden glass">
                <div className="grid md:grid-cols-[1.2fr_0.8fr]">
                  <div className="relative min-h-[220px]">
                    <BgImg src={imgMechanic} alt="Female mechanic J Martinez diagnosing engine with OBD2 scanner" className="w-full h-full min-h-[220px]" />
                    <div className="absolute top-3 left-3 mono text-[10px] px-2.5 py-1 rounded-full bg-[#8FFF4A] text-black font-bold">OBD2 Scanner: P0302 Misfire</div>
                  </div>
                  <div className="p-4 bg-[#F0E9DB] flex flex-col">
                    <div className="mono text-[10px] text-[#5B6470] uppercase tracking-[0.12em]">Quoto Bot Suggests</div>
                    <div className="mt-2 poppins font-bold text-[18px] text-[#0A1931] tracking-[-0.02em]">£195 fixed price</div>
                    <div className="mt-1 mono text-[11px] text-[#5B6470] leading-[1.4]">Includes: spark plug set, coil test, live video diagnosis, 7-day guarantee.</div>
                    <div className="mt-3 grid gap-2">
                      <div className="rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2 flex items-center justify-between"><span className="mono text-[10px] text-[#5B6470]">Parts</span><span className="mono text-[11px] text-[#0A1931]">£68</span></div>
                      <div className="rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2 flex items-center justify-between"><span className="mono text-[10px] text-[#5B6470]">Labour 1.2h</span><span className="mono text-[11px] text-[#0A1931]">£127</span></div>
                    </div>
                    <button
                      onClick={() => setQuoteSent(true)}
                      className="mt-auto h-9 rounded-full text-[12px] font-semibold text-black poppins hover:scale-[1.02] transition"
                      style={{ background: 'var(--gradient-m)' }}
                    >{quoteSent ? '✓ Quote Sent to UPRM' : 'Send Quote via UPRM →'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work-gallery" className="border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1280px] px-5 md:px-8 py-14 md:py-16">
          <div className="mono text-[11px] tracking-[0.2em] text-[#5B6470] uppercase mb-2">Real Work • Live Nodes</div>
          <h2 className="poppins font-extrabold text-[28px] md:text-[36px] tracking-[-0.03em] text-[#0A1931] mb-8">Tailors, mechanics, builders, barbers — proof on the OS.</h2>
          <div className="mt-12 grid md:grid-cols-4 gap-3">
            {[
              { img: imgTailor, label: 'Tailor • Oldham', meta: 'Lace • Wedding' },
              { img: imgMechanic, label: 'J. Martinez • Mechanic', meta: 'OBD2 • P0302' },
              { img: imgBuilder, label: 'Oldham Builders', meta: 'Brick • Milestone' },
              { img: imgBarber, label: 'Barber • Fade', meta: 'LiveKit • Tips' },
            ].map(c => (
              <div key={c.label} className="rounded-[18px] overflow-hidden glass">
                <div className="w-full aspect-[16/10]" style={{ backgroundImage: `url(${c.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="p-3 flex items-center justify-between">
                  <div><div className="poppins font-semibold text-[12px] text-[#0A1931]">{c.label}</div><div className="mono text-[10px] text-[#5B6470]">{c.meta}</div></div>
                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-black font-bold text-[10px]" style={{ background: 'var(--gradient-m)' }}>M</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </section>

      <section id="cta" className="relative border-t border-[#D4CBB8] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-40" style={{ background: 'var(--gradient-glow)' }} />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-5 md:px-8 py-16 md:py-20">
          <div className="rounded-[32px] glass-strong p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-[380px] h-[380px] rounded-full blur-[80px] opacity-30" style={{ background: 'var(--gradient-m)' }} />
            <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white text-black mono text-[10px] tracking-[0.14em] font-semibold uppercase">No.3 of 24 • Work OS • Live</div>
                <h2 className="mt-5 poppins font-extrabold text-[32px] md:text-[48px] leading-[0.92] tracking-[-0.04em]">Start Showing<br /><span className="m-gradient-text">Real Work.</span></h2>
                <p className="mt-4 text-[15px] leading-[1.5] text-[#5B6470] max-w-[480px]">Join as Pro. Timeline auto-edits your tailor, mechanic, builder, barber work into trust. UPRM handles quotes, milestones, payouts.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <a href="#" className="h-12 px-7 rounded-full inline-flex items-center justify-center text-[14px] font-bold text-black poppins tracking-[-0.01em]" style={{ background: 'var(--gradient-m)' }}>Start Showing Free</a>
                  <div className="flex items-center gap-2">
                    <span className="h-12 px-3 rounded-full glass inline-flex items-center gap-2 text-[12px] text-[#5B6470]">
                      <img src={logoAlt} alt="My Face Profile second logo" className="h-6 w-6 rounded object-cover" />
                      iOS • Android • Coming Soon
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-16 w-16 rounded-[14px] bg-white p-1.5"><div className="w-full h-full bg-[#FFFDF7] rounded-[8px] flex items-center justify-center text-[20px] font-black poppins m-gradient-text">M</div></div>
                  <div className="mono text-[11px] text-[#5B6470] leading-[1.4]">Scan to join waitlist<br />apps/marketing/app/work-os<br />Same fonts as No.1 • Poppins 800</div>
                </div>
              </div>

              <div className="grid gap-3">
                <div className="rounded-[20px] overflow-hidden bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex gap-3">
                  <div className="h-20 w-20 rounded-[12px] shrink-0" style={{ backgroundImage: `url(${imgBuilder})`, backgroundSize: 'cover' }} />
                  <div className="flex-1">
                    <div className="mono text-[10px] text-[#5B6470] uppercase">Featured • Oldham Builders</div>
                    <div className="poppins font-semibold text-[13px] text-[#0A1931] mt-1">Brick wall — Milestone 2/3 → £1,240 escrow</div>
                    <div className="mt-2 flex gap-1.5"><span className="mono text-[9px] px-2 py-1 rounded-full bg-[#F0E9DB] text-[#5B6470]">Trust 99%</span><span className="mono text-[9px] px-2 py-1 rounded-full text-black font-bold" style={{ background: '#8FFF4A' }}>Payout ready</span></div>
                  </div>
                </div>
                <div className="rounded-[20px] overflow-hidden bg-[#F0E9DB] border border-[#D4CBB8] p-3 flex gap-3">
                  <div className="h-20 w-20 rounded-[12px] shrink-0" style={{ backgroundImage: `url(${imgBarber})`, backgroundSize: 'cover' }} />
                  <div className="flex-1">
                    <div className="mono text-[10px] text-[#5B6470] uppercase">Live Now • Barber</div>
                    <div className="poppins font-semibold text-[13px] text-[#0A1931] mt-1">Fade Cut — LiveKit • 18 watching • Tips £8</div>
                    <div className="mt-2 flex gap-1.5"><span className="mono text-[9px] px-2 py-1 rounded-full bg-[#F0E9DB] text-[#5B6470]">LiveStudio</span><span className="mono text-[9px] px-2 py-1 rounded-full text-black font-bold" style={{ background: '#FF8A00' }}>Go live</span></div>
                  </div>
                </div>
                <div className="rounded-[16px] glass px-4 py-3 flex items-center justify-between">
                  <span className="mono text-[11px] text-[#5B6470]">Production brand artifact • cream #FFFDF7</span>
                  <span className="h-6 w-6 rounded-full flex items-center justify-center text-black font-black poppins" style={{ background: 'var(--gradient-m)' }}>M</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 mono text-[10px] text-[#5B6470]">
            <span>© My Face Profile • Work OS • apps/marketing/app/work-os/page.tsx • Tailwind • Poppins Bold 700/800 • Inter • JetBrains Mono</span>
            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#8FFF4A]" />Kernel + UPRM + Apps = OS for Real Work</span>
          </div>
        </div>
      </section>
    </div>
  );
}
