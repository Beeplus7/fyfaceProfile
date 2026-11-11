import React, { useState, useRef, useEffect } from 'react';

import logoIcon from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logoFull from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";

import imgBarber from "../assets/f05e570703efee3a-image_20261029_173914.webp";
import imgMechanic from "../assets/862320100e7b980d-image_20261029_173915.webp";
import imgBuilders from "../assets/727cc9fbccc433e9-image_20261029_173918.webp";
import imgSewing from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import imgLiveWorkshop from "../assets/c580b278bd1bf106-image_20261029_175419.webp";
import imgGiftRain from "../assets/9d6013af7e4e2a36-image_20261029_175423.webp";
import imgKitchenAfter from "../assets/35ca56917d3e0882-image_20261029_180640.webp";
import imgDressFinal from "../assets/025b3e01cae20907-image_20261029_180641.webp";
import imgKitchenBeforeAfter from "../assets/2c2dfd41d427dc37-image_20261029_180642.webp";
import imgBlueprint from "../assets/c76b0ae06d28fd76-image_20261029_180643.webp";

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how' },
  { label: 'Work OS', href: '#os' },
  { label: 'UPRM', href: '#uprm' },
  { label: 'Projects', href: '#projects', active: true },
  { label: 'Pricing', href: '#pricing' },
];

function BeforeAfterSlider() {
  const [pos, setPos] = useState(52);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
    setPos(pct);
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      updateFromClientX(clientX);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchend', handleUp);
    };
  }, [dragging]);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-[28px] bg-[#0a0a0a] border border-white/[0.08] select-none"
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
      >
        {/* AFTER - primary img tag for KitchenAfter */}
        <img src={imgKitchenAfter} alt="After Modern Kitchen 2024" className="absolute inset-0 w-full h-full object-cover" draggable={false} />
        <div className="absolute top-4 right-4 z-10 glass px-3 py-1.5 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--lime)] shadow-[0_0_12px_var(--lime)]" />
          <span className="mono text-[11px] tracking-widest text-white font-medium">AFTER • 2024 • Oldham Builders</span>
        </div>

        {/* BEFORE - background div using KitchenBeforeAfter (duplicate visually but not img tag) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${imgKitchenBeforeAfter})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: `${100 * (100 / pos)}%`,
            }}
          />
          <div className="absolute inset-0 bg-[#1a0f00]/20 mix-blend-multiply" />
          <div className="absolute top-4 left-4 z-10 glass px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--orange)]" />
            <span className="mono text-[11px] tracking-widest text-white font-medium">BEFORE • 1990s • Floral Wallpaper</span>
          </div>
        </div>

        <div className="absolute top-0 bottom-0 w-[2px] bg-white z-20" style={{ left: `${pos}%` }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full bg-white shadow-[0_4px_24px_rgba(0,0,0,0.4)] border border-black/10 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <div className="flex gap-[3px]">
              <span className="w-[2px] h-[14px] bg-black/30 rounded-full" />
              <span className="w-[2px] h-[14px] bg-black/30 rounded-full" />
            </div>
          </div>
        </div>

        <div className="glow-divine w-[520px] h-[520px] -bottom-40 left-1/2 -translate-x-1/2 rounded-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full flex items-center gap-2 z-20">
          <span className="mono text-[10px] tracking-[0.15em] text-white/70">DRAG TO REVEAL • TOUCH OF GOD TRANSFORMATION</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { k: 'COST', v: '£8,400', sub: 'incl. materials £2,480' },
          { k: 'DURATION', v: '14 days', sub: 'On-time • 100%' },
          { k: 'TEAM', v: '4 pros', sub: 'Architect + Builder + Elec + Plumb' },
          { k: 'CLIENT', v: '5★ Verified', sub: 'TrustScore +12 • Google ranks' },
        ].map((m) => (
          <div key={m.k} className="glass rounded-[16px] px-4 py-3">
            <div className="mono text-[10px] tracking-[0.18em] text-white/40 mb-1">{m.k}</div>
            <div className="poppins font-bold text-[16px] text-white">{m.v}</div>
            <div className="text-[11px] text-white/50 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestoneTimeline() {
  return (
    <div className="relative">
      <div className="absolute left-[18px] md:left-[29px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00] opacity-60 rounded-full hidden md:block" />
      <div className="space-y-8 md:space-y-10">
        {/* M1 Blueprint - primary img */}
        <div className="relative flex gap-4 md:gap-8 drop-in">
          <div className="relative z-10 flex-shrink-0">
            <div className="w-[36px] h-[36px] md:w-[60px] md:h-[60px] rounded-full bg-[#0f0f0f] border border-white/10 flex items-center justify-center shadow-[0_0_0_6px_#050505]">
              <span className="mono text-[11px] md:text-[13px] font-medium text-white">01</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-[var(--lime)] flex items-center justify-center text-[10px]">✓</div>
          </div>
          <div className="flex-1 glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="grid md:grid-cols-[320px_1fr] gap-0">
              <div className="relative h-[220px] md:h-full min-h-[220px] overflow-hidden bg-[#0a0a0a]">
                <img src={imgBlueprint} alt="Foundation Plan Blueprint" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full">
                  <span className="mono text-[10px] tracking-widest text-white">✓ Complete</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="mono text-[10px] text-white/70">18 Oct 2024 • $2,480 materials list</span>
                  <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[10px]">▶</span>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <h4 className="poppins font-bold text-[18px] md:text-[20px] leading-tight text-white">Design • Foundation Plan</h4>
                <p className="text-[13px] leading-[1.6] text-white/60 mt-3">Builder reviewing foundation plan blueprints with clipboard. Full materials BOM approved. Client sign-off captured.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Blueprint', 'BOM', 'Client Sign-off'].map(t => (
                    <span key={t} className="mono text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/60">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <div className="flex -space-x-2">
                    <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-[#050505] flex items-center justify-center text-[10px] text-white/70">A</div>
                    <div className="w-[28px] h-[28px] rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-[#050505] flex items-center justify-center text-[10px] text-white/70">P</div>
                  </div>
                  <span className="mono text-[10px] text-white/40">Architect • PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* M2 Demolition - uses background div for KitchenBeforeAfter */}
        <div className="relative flex gap-4 md:gap-8 drop-in" style={{ animationDelay: '120ms' }}>
          <div className="relative z-10 flex-shrink-0">
            <div className="w-[36px] h-[36px] md:w-[60px] md:h-[60px] rounded-full bg-[#0f0f0f] border border-white/10 flex items-center justify-center shadow-[0_0_0_6px_#050505]">
              <span className="mono text-[11px] md:text-[13px] font-medium text-white">02</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-[var(--lime)] flex items-center justify-center text-[10px]">✓</div>
          </div>
          <div className="flex-1 glass rounded-[24px] overflow-hidden border border-white/[0.06]">
            <div className="grid md:grid-cols-[320px_1fr] gap-0">
              <div className="relative h-[220px] md:h-full min-h-[220px] overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0" style={{ backgroundImage: `url(${imgKitchenBeforeAfter})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full">
                  <span className="mono text-[10px] tracking-widest text-white">✓ Complete</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="mono text-[10px] text-white/70">22 Oct 2024 • 2 days • £420</span>
                  <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[10px]">▶</span>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <h4 className="poppins font-bold text-[18px] md:text-[20px] leading-tight text-white">Demolition • Strip Out</h4>
                <p className="text-[13px] leading-[1.6] text-white/60 mt-3">1990s floral wallpaper, old cabinets removed. Dust control, waste removal logged with photos. Before documentation for SEO.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Before Photos', 'Waste Log'].map(t => (
                    <span key={t} className="mono text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/60">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* M3 Build - primary img Builders */}
        <div className="relative flex gap-4 md:gap-8 drop-in" style={{ animationDelay: '240ms' }}>
          <div className="relative z-10 flex-shrink-0">
            <div className="w-[36px] h-[36px] md:w-[60px] md:h-[60px] rounded-full bg-[#0f0f0f] border border-white/10 flex items-center justify-center shadow-[0_0_0_6px_#050505]">
              <span className="mono text-[11px] md:text-[13px] font-medium text-white">03</span>
            </div>
          </div>
          <div className="flex-1 glass rounded-[24px] overflow-hidden border border-white/[0.06]">
            <div className="grid md:grid-cols-[320px_1fr] gap-0">
              <div className="relative h-[220px] md:h-full min-h-[220px] overflow-hidden bg-[#0a0a0a]">
                <img src={imgBuilders} alt="Oldham Builders laying bricks" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full bg-[var(--yellow)]/20 border border-[var(--yellow)]/30">
                  <span className="mono text-[10px] tracking-widest text-black font-bold">● In Progress • Live Video</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="mono text-[10px] text-white/70">24-30 Oct 2024 • Live • Video</span>
                  <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[10px]">▶</span>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <h4 className="poppins font-bold text-[18px] md:text-[20px] leading-tight text-white">Build • Brick & Structure</h4>
                <p className="text-[13px] leading-[1.6] text-white/60 mt-3">Oldham Builders van on site, bricklaying extension. Daily video updates for client. Materials logged, cost tracked.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Live Video', 'Daily Log', 'Materials Used'].map(t => (
                    <span key={t} className="mono text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/60">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* M4 Final Reveal - primary img DressFinal */}
        <div className="relative flex gap-4 md:gap-8 drop-in" style={{ animationDelay: '360ms' }}>
          <div className="relative z-10 flex-shrink-0">
            <div className="w-[36px] h-[36px] md:w-[60px] md:h-[60px] rounded-full bg-[#0f0f0f] border border-white/10 flex items-center justify-center shadow-[0_0_0_6px_#050505]">
              <span className="mono text-[11px] md:text-[13px] font-medium text-white">04</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-[var(--lime)] flex items-center justify-center text-[10px]">✓</div>
          </div>
          <div className="flex-1 glass rounded-[24px] overflow-hidden border border-white/[0.06]">
            <div className="grid md:grid-cols-[320px_1fr] gap-0">
              <div className="relative h-[220px] md:h-full min-h-[220px] overflow-hidden bg-[#0a0a0a]">
                <img src={imgDressFinal} alt="Final Reveal wedding dress lace" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 w-[96px] h-[72px] rounded-[12px] overflow-hidden border-2 border-white/20 shadow-xl" style={{ backgroundImage: `url(${imgKitchenAfter})`, backgroundSize: 'cover' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full">
                  <span className="mono text-[10px] tracking-widest text-white">✓ Complete • Divine Light</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="mono text-[10px] text-white/70">12 Nov 2024 • Final Photos • 4K</span>
                  <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[10px]">▶</span>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <h4 className="poppins font-bold text-[18px] md:text-[20px] leading-tight text-white">Final Reveal • Craft Complete</h4>
                <p className="text-[13px] leading-[1.6] text-white/60 mt-3">Final reveal is holy moment — wedding lace dress "Alterations Complete 12.09.2024" + kitchen hood light. Divine light glow — reverent, craft as worship.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['Final Reveal', 'Divine Light', '4K Photos'].map(t => (
                    <span key={t} className="mono text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/60">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* M5 Client Approval - primary img GiftRain */}
        <div className="relative flex gap-4 md:gap-8 drop-in" style={{ animationDelay: '480ms' }}>
          <div className="relative z-10 flex-shrink-0">
            <div className="w-[36px] h-[36px] md:w-[60px] md:h-[60px] rounded-full bg-[#0f0f0f] border border-white/10 flex items-center justify-center shadow-[0_0_0_6px_#050505]">
              <span className="mono text-[11px] md:text-[13px] font-medium text-white">05</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full bg-[var(--yellow)] flex items-center justify-center text-[10px]">★</div>
          </div>
          <div className="flex-1 glass rounded-[24px] overflow-hidden border border-white/[0.06]">
            <div className="grid md:grid-cols-[320px_1fr] gap-0">
              <div className="relative h-[220px] md:h-full min-h-[220px] overflow-hidden bg-[#0a0a0a]">
                <img src={imgGiftRain} alt="Phone live gift rain" className="w-full h-full object-cover" />
                <div className="absolute bottom-2 right-2 w-[84px] h-[84px] rounded-[12px] overflow-hidden border-2 border-white/20 shadow-xl" style={{ backgroundImage: `url(${imgLiveWorkshop})`, backgroundSize: 'cover' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 glass px-2.5 py-1 rounded-full bg-[var(--lime)]">
                  <span className="mono text-[10px] tracking-widest text-black font-bold">✓ 5★ Approved</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="mono text-[10px] text-white/70">13 Nov 2024 • TrustScore +18</span>
                  <span className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-[10px]">▶</span>
                </div>
              </div>
              <div className="p-5 md:p-7">
                <h4 className="poppins font-bold text-[18px] md:text-[20px] leading-tight text-white">Client Approval • Verified Review</h4>
                <p className="text-[13px] leading-[1.6] text-white/60 mt-3">Client gift rain on live stream, workshop replay 142 watching. Review auto posts to Google. Trust ledger updated forever.</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {['5★ Review', 'Google SEO', 'Trust Ledger'].map(t => (
                    <span key={t} className="mono text-[10px] tracking-wide px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] text-white/60">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
      {/* Card 1 - uses background div for DressFinal (already used as primary) */}
      <div className="group relative glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 drop-in flex flex-col">
        <div className="relative h-[240px] overflow-hidden bg-[#0a0a0a]">
          <div className="glow-divine w-[300px] h-[300px] -top-20 -right-20 rounded-full opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="absolute inset-0" style={{ backgroundImage: `url(${imgDressFinal})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <div className="glass px-3 py-1.5 rounded-full">
              <span className="mono text-[10px] tracking-widest text-white font-medium">Final Reveal • Divine</span>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Lace Detail</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Client Approved</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h4 className="poppins font-bold text-[15px] leading-[1.25] text-white line-clamp-2">Wedding Dress • Lace Alterations Complete</h4>
          <div className="mono text-[11px] text-white/50 mt-2">Aisha • Tailor • 4.9 (63 jobs)</div>
          <div className="mono text-[10px] text-white/35 mt-1">£320 • Oldham • 12.09.2024 • 142 watching</div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#050505]" />
                <div className="w-6 h-6 rounded-full bg-[#222] border border-[#050505]" />
                <div className="w-6 h-6 rounded-full bg-[var(--lime)] border border-[#050505] flex items-center justify-center text-[9px] text-black font-bold">✓</div>
              </div>
              <span className="mono text-[10px] text-white/40">Team • Cost</span>
            </div>
            <button className="mono text-[11px] tracking-wide px-3 py-1.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">View Project →</button>
          </div>
        </div>
      </div>

      {/* Card 2 Kitchen - primary img KitchenBeforeAfter */}
      <div className="group relative glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 drop-in flex flex-col" style={{ animationDelay: '90ms' }}>
        <div className="relative h-[240px] overflow-hidden bg-[#0a0a0a]">
          <div className="glow-divine w-[300px] h-[300px] -top-20 -right-20 rounded-full opacity-40" />
          <img src={imgKitchenBeforeAfter} alt="Kitchen Renovation Before After" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-full">
            <span className="mono text-[10px] tracking-widest text-white font-medium">Before → After • £8,400</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Transformation</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">On-Time</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h4 className="poppins font-bold text-[15px] leading-[1.25] text-white">Kitchen Renovation • 1990s → Modern 2024</h4>
          <div className="mono text-[11px] text-white/50 mt-2">Oldham Builders • 4.8 • Verified</div>
          <div className="mono text-[10px] text-white/35 mt-1">14 days • 4 pros • 5★ review • Google ranks</div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#050505]" />
              <div className="w-6 h-6 rounded-full bg-[#222] border border-[#050505]" />
              <div className="w-6 h-6 rounded-full bg-[var(--lime)] border border-[#050505] flex items-center justify-center text-[9px] text-black font-bold">✓</div>
            </div>
            <button className="mono text-[11px] tracking-wide px-3 py-1.5 rounded-full bg-white text-black font-medium">View Project →</button>
          </div>
        </div>
      </div>

      {/* Card 3 Mechanic - primary img Mechanic */}
      <div className="group relative glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 drop-in flex flex-col" style={{ animationDelay: '180ms' }}>
        <div className="relative h-[240px] overflow-hidden bg-[#0a0a0a]">
          <img src={imgMechanic} alt="Toyota Misfire Fix diagnosing" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-full">
            <span className="mono text-[10px] tracking-widest text-white font-medium">Diagnostic • OBD2 Live</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">OBD2 Scan</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Live Video</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h4 className="poppins font-bold text-[15px] leading-[1.25] text-white">Toyota Misfire Fix • J. Martinez Diagnosing</h4>
          <div className="mono text-[11px] text-white/50 mt-2">J. Martinez • Mechanic • OL8 • 1.2mi</div>
          <div className="mono text-[10px] text-white/35 mt-1">£195 • 45 min • TrustScore +8</div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-1.5">
              <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#050505]" />
              <div className="w-6 h-6 rounded-full bg-[var(--lime)] border border-[#050505] flex items-center justify-center text-[9px] text-black font-bold">✓</div>
            </div>
            <button className="mono text-[11px] tracking-wide px-3 py-1.5 rounded-full bg-white text-black font-medium">View Project →</button>
          </div>
        </div>
      </div>

      {/* Card 4 Brick Wall - background div for Builders (already used) */}
      <div className="group relative glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 drop-in flex flex-col" style={{ animationDelay: '270ms' }}>
        <div className="relative h-[240px] overflow-hidden bg-[#0a0a0a]">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${imgBuilders})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-full">
            <span className="mono text-[10px] tracking-widest text-white font-medium">Build • £2,480 Materials</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Foundation Plan</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h4 className="poppins font-bold text-[15px] leading-[1.25] text-white">Brick Wall Extension • Foundation to DPC</h4>
          <div className="mono text-[11px] text-white/50 mt-2">Oldham Builders • Brick & Extension</div>
          <div className="mono text-[10px] text-white/35 mt-1">3 days • Team of 3 • Materials logged</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="mono text-[10px] text-white/40">Blueprint • Materials • Cost</span>
            <button className="mono text-[11px] tracking-wide px-3 py-1.5 rounded-full bg-white text-black font-medium">View Project →</button>
          </div>
        </div>
      </div>

      {/* Card 5 Barber - primary img Barber */}
      <div className="group relative glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 drop-in flex flex-col" style={{ animationDelay: '360ms' }}>
        <div className="relative h-[240px] overflow-hidden bg-[#0a0a0a]">
          <img src={imgBarber} alt="Fade with Line barber" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-full">
            <span className="mono text-[10px] tracking-widest text-white font-medium">Live Now • 24 watching</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Fade</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Live Stream</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h4 className="poppins font-bold text-[15px] leading-[1.25] text-white">Fade with Line • Skin Fade Masters</h4>
          <div className="mono text-[11px] text-white/50 mt-2">Fade Masters • Barber • £25</div>
          <div className="mono text-[10px] text-white/35 mt-1">Live Now • Oldham • 4.9 (211)</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="mono text-[10px] text-white/40">Live • Gifts • Trust</span>
            <button className="mono text-[11px] tracking-wide px-3 py-1.5 rounded-full bg-white text-black font-medium">View Project →</button>
          </div>
        </div>
      </div>

      {/* Card 6 Workshop - primary img LiveWorkshop */}
      <div className="group relative glass rounded-[24px] overflow-hidden border border-white/[0.06] hover:border-white/[0.14] transition-all duration-500 drop-in flex flex-col" style={{ animationDelay: '450ms' }}>
        <div className="relative h-[240px] overflow-hidden bg-[#0a0a0a]">
          <img src={imgLiveWorkshop} alt="Girl live streaming workshop tripod" className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
          <div className="absolute top-3 left-3 glass px-3 py-1.5 rounded-full">
            <span className="mono text-[10px] tracking-widest text-white font-medium">Live Workshop • 142 watching</span>
          </div>
          <div className="absolute top-3 right-3 w-[64px] h-[64px] rounded-[14px] overflow-hidden border-2 border-white/20 shadow-xl" style={{ backgroundImage: `url(${imgSewing})`, backgroundSize: 'cover' }} />
          <div className="absolute bottom-0 left-0 right-0 h-[88px] bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Live</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/90 text-black font-medium">Gifts</span>
          </div>
        </div>
        <div className="p-4 md:p-5 flex-1 flex flex-col">
          <h4 className="poppins font-bold text-[15px] leading-[1.25] text-white">Atelier No.12 • Lace Workshop Live Stream</h4>
          <div className="mono text-[11px] text-white/50 mt-2">Atelier No.12 • Gifts 1,250 MFC</div>
          <div className="mono text-[10px] text-white/35 mt-1">Tripod stream • Q&A • Gifts raining</div>
          <div className="mt-4 flex items-center justify-between">
            <span className="mono text-[10px] text-white/40">Workshop • Day 3 • Detail</span>
            <button className="mono text-[11px] tracking-wide px-3 py-1.5 rounded-full bg-white text-black font-medium">View Project →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div data-safe-area-inset-root className="min-h-screen bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip" style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}>
      <header data-safe-area-sticky-top className="sticky z-[50] border-b border-white/[0.06] backdrop-blur-[20px] bg-[#FFFDF7]/90" style={{ top: 'var(--safe-area-inset-top)' }}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-[36px] h-[36px] rounded-[10px] overflow-hidden bg-white flex items-center justify-center">
              <img src={logoIcon} alt="My Face Profile" className="w-full h-full object-cover" />
            </div>
            <span className="poppins font-bold text-[15px] tracking-tight">My Face Profile</span>
            <span className="hidden md:inline-flex ml-2 mono text-[10px] tracking-[0.18em] px-2 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/50">No.5 of 11 — Projects — Touch of GOD</span>
          </div>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className={`mono text-[12px] tracking-wide transition-colors ${l.active ? 'text-white border-b border-white pb-[2px]' : 'text-white/50 hover:text-white/80'}`}>{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex mono text-[12px] px-5 h-[36px] rounded-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] to-[#FFE600] text-black font-semibold tracking-wide hover:opacity-90 transition-opacity">Join as Pro</button>
            <button onClick={() => setMobileMenu(v=>!v)} className="lg:hidden w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center">☰</button>
          </div>
        </div>
        {mobileMenu && (
          <div className="lg:hidden border-t border-white/[0.06] bg-[#0a0a0a] px-4 py-4 flex flex-col gap-3">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className={`mono text-[13px] ${l.active ? 'text-white' : 'text-white/60'}`}>{l.label}</a>
            ))}
          </div>
        )}
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-divine w-[800px] h-[800px] -top-[200px] left-1/2 -translate-x-1/2 opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]" />
        </div>

        <div className="relative mx-auto max-w-[1280px] px-4 md:px-6 pt-12 md:pt-20 pb-10 md:pb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
            <span className="mono text-[11px] tracking-[0.18em] text-white/70">No.5 of 11 • Projects • Living Portfolio • Touch of GOD</span>
          </div>

          <h1 className="poppins font-extrabold text-[36px] md:text-[64px] leading-[0.95] tracking-[-0.03em] max-w-[900px]">
            Every Project Is a
            <br />
            <span className="text-white">Living Portfolio.</span>
            <br />
            <span className="text-gradient">Not a Post. A Proof of Work.</span>
          </h1>

          <p className="mt-6 max-w-[640px] text-[14px] md:text-[16px] leading-[1.7] text-white/60">
            A Project is more than a photo — it's before, design, materials, milestones, team, cost, final result, client approval. It ranks on Google forever and builds trust that no filter can fake.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="poppins font-bold text-[14px] px-7 h-[48px] rounded-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] via-[#FFE600] to-[#FF8A00] text-black hover:opacity-95 transition-opacity">Explore 1,247 Projects in Oldham →</button>
            <div className="flex items-center gap-2 glass rounded-full px-4 h-[48px]">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border-2 border-[#050505]" />
                <div className="w-7 h-7 rounded-full bg-[#222] border-2 border-[#050505]" />
                <div className="w-7 h-7 rounded-full bg-[var(--lime)] border-2 border-[#050505]" />
              </div>
              <span className="mono text-[11px] text-white/60">12K Projects live • SEO goldmine</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {['Before/After is God', 'TrustScore Verified', 'Google Ranks Forever', 'Touch of GOD in Craft'].map(t => (
              <span key={t} className="mono text-[10px] tracking-[0.12em] px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.06] text-white/50">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="mono text-[11px] tracking-[0.2em] text-white/40 mb-2">SECTION 01 • THE KILLER OBJECT</div>
            <h2 className="poppins font-bold text-[28px] md:text-[42px] leading-[0.95] tracking-[-0.02em]">Before/After is God.<br /><span className="text-white/40">Transformation changes lives.</span></h2>
          </div>
          <div className="glass rounded-[16px] px-4 py-3 max-w-[320px]">
            <div className="mono text-[10px] text-white/40 tracking-widest">TOUCH OF GOD</div>
            <div className="text-[12px] leading-[1.5] text-white/60 mt-1">Warm divine light behind final reveal — craft as worship. The moment client sees old → new, trust becomes reverent.</div>
          </div>
        </div>

        <BeforeAfterSlider />

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          <div className="glass rounded-[20px] p-5">
            <div className="flex items-center gap-3">
              <img src={imgSewing} alt="Tailor sewing lace detail Day 3" className="w-12 h-12 rounded-[12px] object-cover" />
              <div>
                <div className="poppins font-bold text-[13px]">Craft Detail • Day 3</div>
                <div className="mono text-[11px] text-white/50">Tailor sewing lace close-up — God in details</div>
              </div>
            </div>
          </div>
          <div className="glass rounded-[20px] p-5 flex items-center justify-between">
            <div>
              <div className="poppins font-bold text-[13px]">Materials List Verified</div>
              <div className="mono text-[11px] text-white/50">Foundation Plan + Clipboard $2,480</div>
            </div>
            <div className="w-14 h-14 rounded-[12px] overflow-hidden" style={{ backgroundImage: `url(${imgBlueprint})`, backgroundSize: 'cover' }} />
          </div>
          <div className="rounded-[20px] p-[1px] bg-gradient-to-r from-[#8FFF4A] to-[#FF8A00]">
            <div className="rounded-[19px] bg-[#0f0f0f] p-5 flex items-center justify-between">
              <div>
                <div className="poppins font-bold text-[13px]">Client Approval 5★</div>
                <div className="mono text-[11px] text-white/50">Verified • Google SEO boost • Trust +18</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#FFE600] flex items-center justify-center text-black font-bold">✓</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-16">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <div className="mono text-[11px] tracking-[0.2em] text-white/40 mb-2">SECTION 02 • PROJECT TIMELINE • MILESTONES</div>
            <h2 className="poppins font-bold text-[28px] md:text-[44px] leading-[0.95] tracking-[-0.02em]">A Project lives 3 months.<br /><span className="text-gradient">A Post dies in 24h.</span></h2>
          </div>
          <div className="hidden md:block text-right">
            <div className="mono text-[11px] text-white/30">Trust Ledger</div>
            <div className="flex gap-2 mt-2">
              {['Completion 97%', 'On-Time 89%', 'Verified 4.9'].map(s => (
                <span key={s} className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/60">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <MilestoneTimeline />
      </section>

      <section id="projects" className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="mono text-[11px] tracking-[0.2em] text-white/40 mb-2">SECTION 03 • SEO GOLDMINE • 10K → 30K PAGES</div>
            <h2 className="poppins font-bold text-[28px] md:text-[44px] leading-[0.95]">Every Project Ranks.<br /><span className="text-white/40">Free Traffic. CAC £0.</span></h2>
          </div>
          <div className="glass rounded-[14px] px-4 py-2 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--lime)]" />
            <span className="mono text-[11px] text-white/70">3K pros × 10 projects = 30K SEO pages • "wedding dress tailor Oldham"</span>
          </div>
        </div>

        <ProjectsGrid />

        <div className="mt-8 glass rounded-[20px] p-5 md:p-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] flex items-center justify-center text-black font-bold text-[14px]">SEO</div>
            <div>
              <div className="poppins font-bold text-[14px]">How it ranks forever</div>
              <div className="mono text-[11px] text-white/50">Each Project page: /projects/wedding-dress-oldham-aisha-12-09-2024 — before, materials, team, cost, approval, schema.org markup</div>
            </div>
          </div>
          <div className="flex gap-2">
            {['TrustScore', 'Google Maps', 'Schema.org', 'OpenGraph'].map(t => (
              <span key={t} className="mono text-[10px] px-3 py-1.5 rounded-full bg-white text-black font-medium">{t}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-20">
        <div className="mono text-[11px] tracking-[0.2em] text-white/40 mb-6 text-center">SECTION 04 • WHY PROJECT {'>'} POST • INFOGRAPHIC</div>

        <div className="grid md:grid-cols-[1fr_80px_1fr] gap-6 items-stretch">
          <div className="glass rounded-[28px] p-6 md:p-8 border border-white/[0.04] opacity-60">
            <div className="flex items-center justify-between mb-6">
              <h3 className="poppins font-bold text-[20px]">Post</h3>
              <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/10">Dies in 24h</span>
            </div>
            <div className="space-y-4">
              <div className="h-[140px] rounded-[16px] bg-white/[0.04] border border-white/[0.06] overflow-hidden" style={{ backgroundImage: `url(${imgLiveWorkshop})`, backgroundSize: 'cover', opacity: 0.5 }} />
              <div className="space-y-2 mono text-[12px] text-white/40">
                <div>• Single image, no context</div>
                <div>• Likes, then algorithm buries</div>
                <div>• No cost, no team, no approval</div>
                <div>• Zero SEO, zero trust</div>
              </div>
              <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2">
                <span className="text-[11px] text-white/30">Reach</span>
                <div className="flex-1 h-[4px] rounded-full bg-white/10"><div className="h-full w-[22%] bg-white/20 rounded-full" /></div>
                <span className="mono text-[10px] text-white/30">2% after 24h</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center justify-center gap-3">
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white/20" />
            <div className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#FF8A00] flex items-center justify-center text-black font-bold">VS</div>
            <div className="w-[1px] h-12 bg-gradient-to-t from-transparent to-white/20" />
          </div>

          <div className="rounded-[28px] p-[1px] bg-gradient-to-br from-[#8FFF4A] via-[#00E5C0] to-[#FF8A00]">
            <div className="rounded-[27px] bg-[#0c0c0c] p-6 md:p-8 relative overflow-hidden">
              <div className="glow-divine w-[400px] h-[400px] -top-20 -right-20 opacity-30" />
              <div className="relative flex items-center justify-between mb-6">
                <h3 className="poppins font-bold text-[20px]">Project • Proof of Work</h3>
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-[#8FFF4A] to-[#FFE600] text-black font-bold">Ranks Forever</span>
              </div>
              <div className="relative grid grid-cols-3 gap-2 mb-5">
                <div className="h-[88px] rounded-[14px] overflow-hidden border border-white/10" style={{ backgroundImage: `url(${imgBlueprint})`, backgroundSize: 'cover' }} />
                <div className="h-[88px] rounded-[14px] overflow-hidden border border-white/10" style={{ backgroundImage: `url(${imgBuilders})`, backgroundSize: 'cover' }} />
                <div className="h-[88px] rounded-[14px] overflow-hidden border border-white/10" style={{ backgroundImage: `url(${imgDressFinal})`, backgroundSize: 'cover' }} />
              </div>
              <div className="space-y-2 mono text-[12px] text-white/70">
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[var(--lime)] text-black flex items-center justify-center text-[10px]">✓</span> 15 posts over 3 months, all linked</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[var(--lime)] text-black flex items-center justify-center text-[10px]">✓</span> Milestones, materials, team, cost, video</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[var(--lime)] text-black flex items-center justify-center text-[10px]">✓</span> Client approval 5★ verified + TrustScore</div>
                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-[var(--lime)] text-black flex items-center justify-center text-[10px]">✓</span> Ranks on Google for "oldham kitchen renovation"</div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { k: 'Trust', v: '+18' },
                  { k: 'On-Time', v: '89%' },
                  { k: 'Repeat', v: '42%' },
                ].map(m => (
                  <div key={m.k} className="rounded-[12px] bg-white/[0.06] border border-white/[0.08] p-2.5 text-center">
                    <div className="mono text-[10px] text-white/40">{m.k}</div>
                    <div className="poppins font-bold text-[14px]">{m.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/[0.06] mt-8">
        <div className="absolute inset-0">
          <div className="glow-divine w-[900px] h-[600px] left-1/2 -translate-x-1/2 top-0 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-4 md:px-6 py-16 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <img src={logoFull} alt="My Face Profile full logo" className="w-5 h-5 rounded-full object-cover" />
            <span className="mono text-[11px] tracking-[0.18em] text-white/60">Touch of GOD in Every Craft • No.5 of 11</span>
          </div>
          <h2 className="poppins font-extrabold text-[32px] md:text-[64px] leading-[0.9] tracking-[-0.03em] max-w-[800px] mx-auto">
            Show Your First
            <br />
            <span className="text-gradient">Project — Free.</span>
          </h2>
          <p className="mono text-[12px] md:text-[13px] text-white/50 mt-6 max-w-[520px] mx-auto leading-[1.6]">12K Projects • 4.9 Avg Trust • 89% On-Time • Every project becomes SEO, trust, and legacy. No filter can fake craft.</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="poppins font-bold text-[15px] px-8 h-[52px] rounded-full bg-gradient-to-r from-[#8FFF4A] via-[#FFE600] to-[#FF8A00] text-black">Start Your Project →</button>
            <div className="glass rounded-full px-5 h-[52px] flex items-center gap-3">
              <span className="mono text-[11px] text-white/60">iOS / Android Coming Soon</span>
              <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[10px]">◍</span>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {['Completion Rate 97%', 'On-Time 89%', 'Verified Jobs 12K', 'TrustScore 4.9', 'Touch of GOD'].map(b => (
              <span key={b} className="mono text-[10px] tracking-wide px-3 py-2 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">{b}</span>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 opacity-40">
            <div className="w-8 h-8 rounded-[8px] overflow-hidden bg-white" style={{ backgroundImage: `url(${logoIcon})`, backgroundSize: 'cover' }} />
            <span className="mono text-[11px] tracking-[0.2em]">MY FACE PROFILE • PROJECTS • LIVING PORTFOLIO • No.5 of 11</span>
          </div>
        </div>
      </section>
    </div>
  );
}
