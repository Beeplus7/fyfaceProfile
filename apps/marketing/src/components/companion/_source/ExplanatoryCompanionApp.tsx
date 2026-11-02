import { useEffect, useRef, useState } from "react";
import mLogoUrl from "container:///mnt/data/src/assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import tailorSewUrl from "container:///mnt/data/src/assets/840990accfbeab9d-image_20261029_173924.webp";
import mechanicUrl from "container:///mnt/data/src/assets/862320100e7b980d-image_20261029_173915.webp";
import ayoTailorsUrl from "container:///mnt/data/src/assets/a57a388e71b1e926-image_20261029_223418.webp";
import giftBoxUrl from "container:///mnt/data/src/assets/66859f56b3a6c725-image_20261029_184125.webp";
import electricianUrl from "container:///mnt/data/src/assets/8add8b271904e6b3-image_20261029_190128.webp";
import plumberUrl from "container:///mnt/data/src/assets/a0e4b743decf2716-image_20261029_190129.webp";
import extraUrl from "container:///mnt/data/src/assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";

const GRAD = "linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)";
const GRAD2 = "linear-gradient(135deg, #8FFF4A 0%, #00E5C0 30%, #1A7CFF 60%, #FFE600 80%, #FF8A00 100%)";

type PageDef = { id: number; title: string; render: (spread: number) => React.ReactNode };

export default function App() {
  const [open, setOpen] = useState(false);
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState<null | { dir: "next" | "prev"; anim: boolean }>(null);
  const [copied, setCopied] = useState(false);
  const touchStart = useRef<number | null>(null);

  const totalPages = 16;
  const totalSpreads = Math.ceil(totalPages / 2);

  const goNext = () => {
    if (flipping || spread >= totalSpreads - 1) return;
    setFlipping({ dir: "next", anim: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlipping({ dir: "next", anim: true }));
    });
    setTimeout(() => {
      setSpread((s) => s + 1);
      setFlipping(null);
    }, 620);
  };
  const goPrev = () => {
    if (flipping || spread <= 0) return;
    setFlipping({ dir: "prev", anim: false });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlipping({ dir: "prev", anim: true }));
    });
    setTimeout(() => {
      setSpread((s) => s - 1);
      setFlipping(null);
    }, 620);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, spread, flipping]);

  const progress = ((spread + 1) / totalSpreads) * 100;

  // Pages content
  const pages: PageDef[] = [
    {
      id: 1,
      title: "Cover",
      render: () => (
        <div className="paper w-full h-full p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[6px]" style={{ background: GRAD }} />
          <div className="flex items-center gap-2 mb-3">
            <img src={mLogoUrl} alt="M logo" className="w-9 h-9 rounded-xl object-cover border border-black/10" />
            <span className="mono text-[10px] tracking-[0.2em] font-bold">MY FACE PROFILE • OS</span>
            <span className="ml-auto mono text-[9px] px-2 py-1 rounded-full bg-black text-white">OL1 • LIVE</span>
          </div>
          <h1 className="text-[32px] leading-[0.9] tracking-tight">SHOW • CONNECT • GROW</h1>
          <div className="mt-3 inline-flex">
            <div className="px-3 py-1 rounded-full text-white text-[11px] font-bold tracking-wide" style={{ background: GRAD2 }}>SHOW YOUR WORK. NOT YOUR CV.</div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <img src={tailorSewUrl} className="rounded-[14px] h-[72px] w-full object-cover" alt="tailor sewing" />
            <img src={mechanicUrl} className="rounded-[14px] h-[72px] w-full object-cover" alt="mechanic" />
            <img src={electricianUrl} className="rounded-[14px] h-[72px] w-full object-cover" alt="electrician" />
            <img src={plumberUrl} className="rounded-[14px] h-[72px] w-full object-cover" alt="plumber" />
            <img src={ayoTailorsUrl} className="rounded-[14px] h-[72px] w-full object-cover" alt="ayo tailors" />
            <img src={extraUrl} className="rounded-[14px] h-[72px] w-full object-cover" alt="craft" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="mono text-[10px] text-black/50">Built for Oldham OL1 • Ready for Manchester • Now Building for UK</div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-[14px] bg-black text-white p-3">
                <div className="mono text-[8px] opacity-60">WORK GRAPH</div>
                <div className="text-[13px] font-bold leading-tight mt-1">Work Graph not User Graph — Project is the killer object</div>
              </div>
              <div className="w-[92px] rounded-[14px] p-3 text-white" style={{ background: GRAD2 }}>
                <div className="mono text-[8px]">TOUCH OF GOD</div>
                <div className="text-[11px] font-bold leading-tight mt-1">Craft as worship — holy workshop</div>
              </div>
            </div>
          </div>
          <div className="mt-auto flex items-center gap-2 mono text-[9px] text-black/40">
            <span>Page Flip Guide — Click edge to turn</span>
            <span className="ml-auto px-2 py-1 rounded-full bg-black/5">16 PAGES</span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Problem",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">02 — PROBLEM</div>
          <h2 className="text-[22px] leading-[1.05] mt-2">Why Work Is <span className="px-2 rounded-full text-white" style={{ background: "#111" }}>Invisible</span></h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[16px] overflow-hidden border border-black/10">
              <img src={extraUrl} className="h-[86px] w-full object-cover" alt="broken tiles" />
              <div className="p-2 bg-white">
                <div className="mono text-[8px]">BEFORE</div>
                <div className="text-[10px] font-semibold leading-tight">Old kitchen — broken tiles — client can't see proof</div>
              </div>
            </div>
            <div className="rounded-[16px] bg-black text-white p-3 flex flex-col">
              <div className="mono text-[8px] opacity-60">CV CULTURE</div>
              <div className="text-[11px] font-bold leading-tight mt-2">LinkedIn Instagram TikTok show face, not work</div>
              <div className="mt-auto text-[9px] opacity-60">85% customers want before/after but only get CV</div>
              <div className="mt-2 h-[4px] rounded-full bg-white/20 overflow-hidden"><div className="h-full w-[15%] bg-white" /></div>
            </div>
          </div>
          <div className="mt-3 rounded-[14px] border border-black/10 p-3">
            <div className="flex gap-2 text-[9px] mono">
              <div className="flex-1 p-2 rounded-[10px] bg-[#FFF7CC]">USER GRAPH — likes, follows — no trust</div>
              <div className="flex-1 p-2 rounded-[10px] bg-[#E6FFD8] border border-[#8FFF4A]">WORK GRAPH — before/after, cost, team, trust ✓</div>
            </div>
            <div className="mt-2 text-[10px]">Work Graph Missing → Lost trust → No booking → Data trapped</div>
          </div>
          <div className="mt-auto mono text-[8px] text-black/40">1/16 — Work Graph = SEO Goldmine</div>
        </div>
      ),
    },
    {
      id: 3,
      title: "Solution",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">03 — SOLUTION</div>
          <h2 className="text-[22px] leading-[1] mt-2">Work Graph OS — Project is <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>Killer Object</span></h2>
          <div className="mt-3 rounded-[18px] border border-black/10 overflow-hidden">
            <img src={ayoTailorsUrl} alt="Ayo tailors measuring" className="h-[84px] w-full object-cover" />
            <div className="p-3 grid grid-cols-2 gap-2">
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex-1 h-[8px] rounded-full bg-black/10 overflow-hidden"><div className="h-full w-[62%]" style={{ background: GRAD }} /></div>
                <span className="mono text-[8px]">BEFORE → AFTER SLIDER</span>
              </div>
              {[
                ["Before", "Fabric stack £45/m lace"],
                ["After", "Aso-Ebi final dress £320"],
                ["Milestone", "Cut → Sew → Fit"],
                ["Materials", "Lace, Silk, Lining"],
                ["Team", "Ayo +2"],
                ["Cost", "£320 escrow 5%"],
                ["Shop", "Link 24 items"],
                ["Trust", "Verified + video proof"],
                ["Gift", "Crown 100 💎"],
              ].slice(0, 6).map(([k, v]) => (
                <div key={k} className="rounded-[10px] bg-black/[0.04] p-2">
                  <div className="mono text-[7px] opacity-60">{k}</div>
                  <div className="text-[9px] font-semibold leading-tight">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 rounded-full bg-black text-white text-center py-2 mono text-[10px] tracking-wide">Your Work Is Your Face. Promote. Enhance.</div>
        </div>
      ),
    },
    {
      id: 4,
      title: "OS Architecture",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">04 — OS ARCHITECTURE</div>
          <h2 className="text-[20px] leading-[1] mt-2">Kernel + UPRM + Apps — <span className="text-[11px] align-middle px-2 py-1 rounded-full bg-black text-white mono">FERRARI BODY + SUPABASE ENGINE</span></h2>
          <div className="mt-3 space-y-2">
            <div className="rounded-[14px] border border-black/10 p-3">
              <div className="mono text-[8px]">KERNEL</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {["Identity","Verification","Mux Live","LiveKit","Stripe Connect","PostGIS","Trust Ledger","Typesense+pgvector","BullMQ"].map(t=>(
                  <span key={t} className="mono text-[7px] px-2 py-1 rounded-full bg-black text-white">{t}</span>
                ))}
              </div>
            </div>
            <div className="rounded-[14px] p-3 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#111 0%, #1A1A1A 100%)" }}>
              <div className="absolute right-0 top-0 w-[80px] h-[80px] rounded-full blur-[20px] opacity-60" style={{ background: GRAD }} />
              <div className="mono text-[8px] opacity-60">UPRM ORCHESTRATOR — PID 1 HEART</div>
              <div className="text-[11px] font-bold mt-1">Contact → Relationship 0-100 → Interaction event-sourced → Journey Discovery→Repeat</div>
              <div className="mt-2 flex gap-1">
                <div className="h-[6px] flex-1 rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[94%]" style={{ background: GRAD }} /></div>
                <span className="mono text-[7px]">94/100</span>
              </div>
            </div>
            <div className="rounded-[14px] border border-black/10 p-3">
              <div className="mono text-[8px]">APPS</div>
              <div className="mt-1 grid grid-cols-3 gap-1">
                {["Timeline","Projects","Shop","Live","WorkCut","Wallet","Bookings","Trust","Boost"].map(a=>(
                  <div key={a} className="text-[8px] mono px-2 py-1 rounded-full bg-black/5 text-center">{a}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: "UPRM",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">05 — UPRM 4 PRIMITIVES</div>
          <h2 className="text-[20px] leading-[1] mt-2">No lost leads — Every interaction logged</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[14px] bg-black text-white p-3">
              <div className="mono text-[7px] opacity-60">CONTACT UNIFIED</div>
              <div className="mt-2 space-y-1">
                {[
                  ["Aisha Bridal", "94"],
                  ["J Martinez Toyota", "88"],
                  ["Mrs Okafor Aso-Ebi", "91"],
                ].map(([n,s])=>(
                  <div key={n} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full" style={{ background: GRAD }} />
                    <div className="flex-1">
                      <div className="text-[8px] leading-tight">{n}</div>
                      <div className="h-[4px] rounded-full bg-white/20 mt-1"><div className="h-full" style={{ width: `${s}%`, background: GRAD }} /></div>
                    </div>
                    <span className="mono text-[8px]">{s}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded-[12px] border border-black/10 p-2">
                <div className="mono text-[7px]">RELATIONSHIP 0-100</div>
                <div className="mt-1 h-[8px] rounded-full bg-black/10 overflow-hidden"><div className="h-full w-[0%] animate-[grow_2s_ease_forwards]" style={{ width: "88%", background: GRAD }} /></div>
                <div className="mono text-[7px] mt-1">green → blue strength</div>
              </div>
              <div className="rounded-[12px] bg-[#E6FFD8] border border-[#8FFF4A] p-2">
                <div className="mono text-[7px]">INTERACTION LEDGER</div>
                <div className="text-[8px] mt-1">Event-sourced — WhatsApp, Call, DM, Booking — no loss</div>
              </div>
              <div className="rounded-[12px] border border-black/10 p-2">
                <div className="mono text-[7px]">JOURNEY</div>
                <div className="flex gap-1 mt-1 overflow-hidden">
                  {["Disc","Eng","Inq","Quote","Book","Prog","Final","Rev","Repeat"].map((j,i)=>(
                    <div key={j} className="text-[6px] mono px-1 py-0.5 rounded-full" style={{ background: i<4? GRAD: "#eee", color: i<4? "#000":"#999" }}>{j}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 rounded-[12px] p-2 text-white flex items-center gap-2" style={{ background: "#111" }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px]" style={{ background: GRAD }}>📒</div>
            <div className="text-[9px] leading-tight">Kanban 8 cols — Discovery → Engagement → Inquiry → Quote → Booked → In Progress → Final → Review → Repeat</div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: "Projects",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">06 — PROJECTS</div>
          <h2 className="text-[20px] leading-[1] mt-2">Project = SEO Goldmine — Before/After Slider</h2>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { img: tailorSewUrl, title: "Aso-Ebi Lace", cost: "£320" },
              { img: mechanicUrl, title: "Toyota P0302", cost: "£180" },
              { img: electricianUrl, title: "Consumer Unit 230V", cost: "£450" },
              { img: plumberUrl, title: "Worcester 68C 1.2bar", cost: "£620" },
              { img: ayoTailorsUrl, title: "Aso-Ebi Measuring", cost: "£320" },
              { img: extraUrl, title: "Fade + Beard", cost: "£35" },
            ].map((p)=>(
              <div key={p.title} className="rounded-[14px] overflow-hidden border border-black/10 bg-white">
                <div className="relative">
                  <img src={p.img} className="h-[56px] w-full object-cover" alt={p.title} />
                  <div className="absolute bottom-1 left-1 right-1 h-[4px] rounded-full bg-white/60 overflow-hidden"><div className="h-full w-[68%]" style={{ background: GRAD }} /></div>
                </div>
                <div className="p-2">
                  <div className="mono text-[7px] opacity-60">{p.title}</div>
                  <div className="text-[9px] font-bold">{p.cost} • Verified • Gift 12</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded-[12px] bg-black text-white p-2 flex gap-2 items-center">
            <span className="mono text-[7px]">MILESTONE TIMELINE</span>
            <div className="flex-1 flex gap-1">
              {["Cutting","Sewing","Fitting"].map(s=>(
                <span key={s} className="text-[7px] mono px-2 py-1 rounded-full bg-white/10">{s}</span>
              ))}
            </div>
            <span className="mono text-[7px]">Team: Ayo</span>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: "WorkCut",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">07 — WORKCUT</div>
          <h2 className="text-[20px] leading-[1] mt-2">CapCut-like Inside UPRM — Cut 5s → £320 booking</h2>
          <div className="mt-3 rounded-[18px] border border-black/10 overflow-hidden bg-black">
            <div className="flex h-[86px]">
              <img src={tailorSewUrl} className="w-[36%] object-cover" alt="cut" />
              <div className="flex-1 p-2 flex flex-col gap-1">
                <div className="flex gap-1">
                  {["Before/After","Timelapse","Milestone","Price Reveal"].map(t=>(
                    <span key={t} className="mono text-[6px] px-2 py-1 rounded-full bg-white/10 text-white">{t}</span>
                  ))}
                </div>
                <div className="flex gap-1 mt-1">
                  <span className="mono text-[6px] px-2 py-1 rounded-full text-black" style={{ background: GRAD }}>Trim</span>
                  <span className="mono text-[6px] px-2 py-1 rounded-full bg-white/10 text-white">Captions Yoruba/Hausa</span>
                  <span className="mono text-[6px] px-2 py-1 rounded-full bg-white/10 text-white">Blur trust badge</span>
                </div>
                <div className="flex gap-1 mt-auto">
                  {["Hammer 🔨 £45/m","Silk £55/m","Duration","Tool"].map(s=>(
                    <span key={s} className="text-[6px] mono px-1 py-0.5 rounded-full bg-white/10 text-white">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-2 bg-[#0E0E0E] flex items-center gap-2">
              <div className="h-[28px] flex-1 rounded-full bg-white/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[62%]" style={{ background: GRAD }} />
                <div className="absolute inset-0 flex items-center justify-center mono text-[7px] text-black font-bold">EXPORT → Work Feed • TikTok • Instagram</div>
              </div>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-4 gap-1">
            <img src={mechanicUrl} className="rounded-[10px] h-[44px] object-cover" alt="mechanic" />
            <img src={electricianUrl} className="rounded-[10px] h-[44px] object-cover" alt="electrician" />
            <img src={plumberUrl} className="rounded-[10px] h-[44px] object-cover" alt="plumber" />
            <img src={ayoTailorsUrl} className="rounded-[10px] h-[44px] object-cover" alt="ayo" />
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: "Live",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em] flex items-center gap-2">
            <span>08 — LIVE WORKSHOP</span><span className="px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">● LIVE</span>
          </div>
          <h2 className="text-[20px] leading-[1] mt-2">Hands-free PiP — Phone Tripod — Gift Rain</h2>
          <div className="mt-3 rounded-[18px] overflow-hidden border border-black/10 bg-black text-white relative">
            <img src={tailorSewUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="live" />
            <div className="relative p-3 h-[118px] flex flex-col">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-red-500 mono text-[7px] animate-pulse">● LIVE 124</span>
                <span className="mono text-[7px] bg-white/20 px-2 py-1 rounded-full">PiP • Tripod</span>
              </div>
              <div className="mt-auto grid grid-cols-5 gap-1">
                {[
                  ["🔨","10","£0.10"],
                  ["✂️","25","craft"],
                  ["❤️","50","love"],
                  ["👑","100","royal"],
                  ["🏆","500","master"],
                ].map(([e,c,l])=>(
                  <div key={c} className="rounded-[10px] bg-white/10 p-1 text-center">
                    <div className="text-[12px]">{e}</div>
                    <div className="mono text-[7px]">{c}</div>
                    <div className="mono text-[5px] opacity-60">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white text-black p-2 flex items-center gap-2 mono text-[7px]">
              <span>Gift feed — Aisha Crown 100 • J Martinez Hammer 10</span>
              <span className="ml-auto px-2 py-1 rounded-full text-white" style={{ background: GRAD }}>70% pro / 30% plat</span>
            </div>
          </div>
          <div className="mt-2 rounded-[12px] p-2 text-center text-white mono text-[9px]" style={{ background: GRAD2 }}>Show Work Live — Gift unlocks Shop — Data → Traffic</div>
        </div>
      ),
    },
    {
      id: 9,
      title: "Shop & Bookings",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">09 — SHOP & BOOKINGS</div>
          <h2 className="text-[20px] leading-[1] mt-2">Commerce = Trust — £420 shop + £8420 pipeline</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-[14px] border border-black/10 overflow-hidden">
              <img src={ayoTailorsUrl} className="h-[56px] w-full object-cover" alt="shop" />
              <div className="p-2">
                <div className="mono text-[7px]">SHOP COMMANDER 24 ITEMS</div>
                <div className="mt-1 space-y-1">
                  {[
                    ["Aso-Ebi lace","£45/m"],
                    ["Silk","£55/m"],
                    ["Brake pads","£85"],
                    ["Cement","£12"],
                  ].map(([n,p])=>(
                    <div key={n} className="flex justify-between text-[8px] mono"><span>{n}</span><span className="font-bold">{p}</span></div>
                  ))}
                </div>
                <div className="mt-2 text-[7px] mono bg-black text-white rounded-full px-2 py-1 text-center">Stock • Delivery 10mi • Escrow 5%</div>
              </div>
            </div>
            <div className="rounded-[14px] bg-black text-white p-2">
              <div className="mono text-[7px] opacity-60">BOOKINGS CALENDAR</div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className={`h-[16px] rounded-[6px] ${i % 3 === 0 ? "" : "bg-white/10"}`} style={i % 3 === 0 ? { background: GRAD } : {}} />
                ))}
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-[8px] mono">8 bookings • Buffer • Timi auto-schedule</div>
                <div className="h-[4px] rounded-full bg-white/10 overflow-hidden"><div className="h-full w-[72%]" style={{ background: GRAD }} /></div>
                <div className="text-[7px] mono opacity-60">Revenue £420/week shop + £8420 pipeline</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 10,
      title: "Trust",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">10 — TRUST & SAFETY</div>
          <h2 className="text-[20px] leading-[1] mt-2">No fake reviews — event-sourced Work Graph</h2>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <img src={electricianUrl} className="rounded-[14px] h-[86px] w-full object-cover border border-black/10" alt="electrician consumer unit" />
            <img src={plumberUrl} className="rounded-[14px] h-[86px] w-full object-cover border border-black/10" alt="plumber boiler" />
          </div>
          <div className="mt-3 rounded-[14px] border border-black/10 p-3">
            <div className="mono text-[7px]">VERIFIED PRO 4 STEPS</div>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {[
                ["ID","✓"],
                ["Trade Cert","Gas Safe 123456"],
                ["BS 7671 Part P","RCD 30mA"],
                ["Insurance + Portfolio","Video proof"],
              ].map(([k,v])=>(
                <div key={k} className="rounded-[10px] bg-black/5 p-2">
                  <div className="mono text-[6px]">{k}</div>
                  <div className="text-[7px] font-bold leading-tight mt-1">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-[8px] rounded-full bg-black/10 overflow-hidden"><div className="h-full w-[92%]" style={{ background: GRAD }} /></div>
              <span className="mono text-[10px] font-bold">4.9/5 TrustScore = Verified × Reviews × Completion × Response</span>
            </div>
            <div className="mt-2 mono text-[7px] bg-[#E6FFD8] border border-[#8FFF4A] rounded-full px-2 py-1 inline-block">Trust Ledger event-sourced • 230V RCD 30mA BS 7671 • Gas Safe</div>
          </div>
        </div>
      ),
    },
    {
      id: 11,
      title: "MFC Wallet",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">11 — MFC WALLET • GIFT ECONOMY</div>
          <h2 className="text-[18px] leading-[1] mt-2">MyFace Coins — Free entrance, Pay to appreciate</h2>
          <div className="mt-3 rounded-[18px] overflow-hidden border border-black/10 relative">
            <img src={giftBoxUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="gift box" />
            <div className="relative p-3 bg-white/80 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="w-[54px] h-[54px] rounded-[14px] flex items-center justify-center text-white font-bold text-[14px]" style={{ background: GRAD2 }}>1247</div>
                <div>
                  <div className="mono text-[8px]">BALANCE</div>
                  <div className="text-[12px] font-bold">1247 coins • £600 gifts received</div>
                  <div className="mono text-[7px]">Withdraw Stripe Connect • 70% pro 30% platform</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1">
                {[
                  ["Starter","100","£4.99"],
                  ["Creator","500","£19.99"],
                  ["Pro","1200","£39.99"],
                  ["Workshop","2500","£79.99"],
                ].map(([n,c,p])=>(
                  <div key={n} className="rounded-[10px] bg-black text-white p-2 text-center">
                    <div className="mono text-[6px] opacity-60">{n}</div>
                    <div className="text-[10px] font-bold">{c}</div>
                    <div className="mono text-[6px]">{p}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-5 gap-1">
                {[
                  ["🔨","10","£0.10"],
                  ["✂️","25","craft"],
                  ["❤️","50","love"],
                  ["👑","100","royal"],
                  ["🏆","500","master"],
                ].map(([e,c,l])=>(
                  <div key={c} className="rounded-[10px] border border-black/10 p-1 text-center bg-white">
                    <div className="text-[10px]">{e}</div>
                    <div className="mono text-[7px]">{c}</div>
                    <div className="mono text-[5px]">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-2 mono text-[7px]">Live feed: Aisha Crown 100 Beautiful Aso-Ebi • J Martinez Hammer 10 Fixed OBD2 • Data into Traffic</div>
        </div>
      ),
    },
    {
      id: 12,
      title: "Bot Army",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">12 — BOT ARMY • 9 MICRO-BOTS</div>
          <h2 className="text-[18px] leading-[1] mt-2">Your Team — No config hell — Oldham OL1 → UK</h2>
          <div className="mt-3 grid grid-cols-3 gap-1">
            {[
              ["Milo","Onboarding","32 fields"],
              ["Cutty","WorkCut","Auto-captions Yoruba Hausa"],
              ["Quoto","Quotes","£45/m lace"],
              ["Timi","Availability","Buffer"],
              ["Findy","Discovery","10mi Oldham"],
              ["Helpy","FAQ","Auto"],
              ["Veri","Verification","Gas Safe BS 7671"],
              ["Growy","Boost","£5 → 500 reach"],
              ["Lingo","Languages","Yoruba Hausa Kiswahili"],
            ].map(([name,role,detail])=>(
              <div key={name} className="rounded-[12px] border border-black/10 p-2 bg-white">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] text-white" style={{ background: GRAD }}>{name[0]}</div>
                  <span className="mono text-[8px] font-bold">{name}</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                </div>
                <div className="mono text-[6px] mt-1">{role}</div>
                <div className="text-[6px] leading-tight mt-0.5">{detail}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 rounded-[12px] bg-black text-white p-2 flex items-center gap-2">
            <div className="mono text-[7px]">MAP</div>
            <div className="text-[8px]">Oldham OL1 OL2 OL8 • Manchester → deploy bots • 9 active green</div>
            <div className="ml-auto h-[4px] w-[64px] rounded-full overflow-hidden bg-white/20"><div className="h-full w-[92%]" style={{ background: GRAD }} /></div>
          </div>
        </div>
      ),
    },
    {
      id: 13,
      title: "Monetization",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">13 — MONETIZATION • 6 WAYS</div>
          <h2 className="text-[18px] leading-[1] mt-2">£9620/week at 10K WAU — £618K ARR</h2>
          <div className="mt-3 flex gap-2">
            <div className="w-[84px] h-[84px] rounded-full border-[8px] border-black/10 relative flex items-center justify-center" style={{ borderTopColor: "#8FFF4A", borderRightColor: "#00E5C0", borderBottomColor: "#FFE600", borderLeftColor: "#FF8A00" }}>
              <div className="text-center">
                <div className="mono text-[8px]">ARR</div>
                <div className="text-[11px] font-bold">£618K</div>
              </div>
            </div>
            <div className="flex-1 space-y-1">
              {[
                ["Gift Take 30%","£600","Free→Gifts→More Projects"],
                ["Escrow 10% Jobs","£6300","Trust = Commerce"],
                ["Escrow 5% Shop","£420","24 items"],
                ["Boosted Discovery","£1500","£5/500 reach"],
                ["Supplier Ads","£500","B&Q Wickes Howdens"],
                ["Lead Unlock £3","£300","Work Feed"],
              ].map(([k,v,d])=>(
                <div key={k} className="flex items-center gap-2 text-[7px] mono">
                  <span className="flex-1">{k} — {d}</span>
                  <span className="px-2 py-0.5 rounded-full bg-black text-white">{v}</span>
                </div>
              ))}
              <div className="rounded-full text-white text-center py-1 mono text-[8px] mt-1" style={{ background: GRAD2 }}>Pro Sub £29/mo → £12882/week → £51528/mo — Data→Traffic flywheel</div>
            </div>
          </div>
          <div className="mt-2 mono text-[7px] leading-tight">Free entrance Pay to appreciate — Data→Traffic flywheel Free→Projects→Work Feed→Discovery→Trust→Commerce→Data→Traffic→Gifts→More Projects</div>
        </div>
      ),
    },
    {
      id: 14,
      title: "Onboarding",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">14 — ONBOARDING COMPANION</div>
          <h2 className="text-[18px] leading-[1] mt-2">32 Fields • 4 Phases • One question at a time — No config hell</h2>
          <div className="mt-3 rounded-[14px] bg-black text-white p-3">
            <div className="mono text-[7px] opacity-60">FROM VisaguideOS — passport-paper/src/onboarding/companion/OnboardingCompanion.tsx</div>
            <div className="mt-2 grid grid-cols-4 gap-1">
              {["Craft Identity","Work DNA","Production Engine","UPRM Brain"].map(p=>(
                <div key={p} className="rounded-[10px] bg-white/10 p-2 text-center mono text-[7px]">{p}</div>
              ))}
            </div>
            <div className="mt-3 rounded-[12px] bg-white text-black p-2">
              <div className="mono text-[7px]">FIELD SCHEMA — config/onboardingSteps.ts • rules/fieldGating.ts • rules/gatingEngine.ts</div>
              <div className="mt-2 space-y-1 mono text-[7px]">
                <div>→ if shopItems no → remove shopItemsList</div>
                <div>→ if trade !== Tailor → remove Aso-Ebi</div>
                <div>→ if trade !== Electrician → remove consumerUnitDetails RCD 30mA BS 7671</div>
                <div>→ if trade !== Plumber → remove Gas Safe boiler 68C 1.2bar</div>
              </div>
              <div className="mt-2 flex gap-1">
                <span className="px-2 py-1 rounded-full bg-black text-white mono text-[6px]">CompanionMessage whyText</span>
                <span className="px-2 py-1 rounded-full text-white mono text-[6px]" style={{ background: GRAD }}>QuantumBackground M gradient</span>
                <span className="px-2 py-1 rounded-full bg-black text-white mono text-[6px]">Edge fn onboarding-chat</span>
              </div>
            </div>
            <div className="mt-2 mono text-[7px] text-center opacity-60">Live interactive demo — deterministically-gated — On completion → UPRM COMMAND CENTER</div>
          </div>
        </div>
      ),
    },
    {
      id: 15,
      title: "Command Center",
      render: () => (
        <div className="paper w-full h-full p-4 flex flex-col">
          <div className="mono text-[9px] tracking-[0.25em]">15 — COMMAND CENTER • PID 1 • AFTER ONBOARDING</div>
          <h2 className="text-[16px] leading-[1] mt-2">Main Brain — Your Work Is Your Face. Promote Enhance</h2>
          <div className="mt-2 rounded-[16px] border border-black/10 overflow-hidden bg-[#F8F8F6] flex h-[156px]">
            <div className="w-[56px] bg-black text-white p-2 flex flex-col gap-1">
              <div className="w-6 h-6 rounded-[8px]" style={{ background: GRAD }} />
              <div className="mono text-[5px] opacity-60 mt-2">OS CORE</div>
              {["Production","Trust","Growth"].map(s=>(
                <div key={s} className="mono text-[5px] bg-white/10 rounded-full px-1 py-0.5">{s}</div>
              ))}
            </div>
            <div className="flex-1 p-2 flex flex-col gap-1 overflow-hidden">
              <div className="grid grid-cols-6 gap-1">
                {[
                  ["Projects","12"],
                  ["Relationships","47"],
                  ["Pipeline","£8420"],
                  ["Trust","4.9"],
                  ["MFC","1247"],
                  ["Reach","12.4K"],
                ].map(([k,v])=>(
                  <div key={k} className="rounded-[8px] bg-white border border-black/10 p-1">
                    <div className="mono text-[5px] opacity-60">{k}</div>
                    <div className="text-[8px] font-bold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="rounded-[8px] bg-white border border-black/10 p-1">
                  <div className="mono text-[5px]">PROJECTS COMMANDER 3x2</div>
                  <div className="mt-1 grid grid-cols-3 gap-1">
                    <img src={tailorSewUrl} className="h-[18px] rounded-[4px] object-cover" alt="" />
                    <img src={mechanicUrl} className="h-[18px] rounded-[4px] object-cover" alt="" />
                    <img src={electricianUrl} className="h-[18px] rounded-[4px] object-cover" alt="" />
                  </div>
                </div>
                <div className="rounded-[8px] bg-white border border-black/10 p-1">
                  <div className="mono text-[5px]">UPRM CONTACTS 0-100</div>
                  <div className="mt-1 space-y-0.5 mono text-[5px]"><div>Aisha 94</div><div>J Martinez 88</div><div>Mrs Okafor 91</div></div>
                </div>
                <div className="rounded-[8px] bg-black text-white p-1">
                  <div className="mono text-[5px]">PIPELINE KANBAN 8</div>
                  <div className="mt-1 h-[4px] rounded-full bg-white/20"><div className="h-full w-[72%]" style={{ background: GRAD }} /></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="rounded-[8px] bg-white border border-black/10 p-1 mono text-[5px]">SHOP BOOKINGS LIVE WorkCut</div>
                <div className="rounded-[8px] bg-white border border-black/10 p-1 mono text-[5px]">TRUST SAFETY MFC WALLET BOOST</div>
                <div className="rounded-[8px] text-white p-1 text-center mono text-[6px]" style={{ background: GRAD2 }}>Go Live Now — Holy workshop</div>
              </div>
            </div>
          </div>
          <div className="mt-auto mono text-[7px]">Row1 Stats • Row2 Projects+Contacts • Row3 Pipeline • Row4 Shop/Live • Row5 Trust/MFC/Boost • Footer CTA</div>
        </div>
      ),
    },
    {
      id: 16,
      title: "Back Cover",
      render: () => (
        <div className="paper w-full h-full p-5 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[6px]" style={{ background: GRAD }} />
          <h2 className="text-[20px] leading-[1]">Verticals Oldham — Touch of GOD in every stitch</h2>
          <div className="mt-3 grid grid-cols-3 gap-1">
            {[
              ["Tailors","247"],
              ["Mechanics","189"],
              ["Builders","124"],
              ["Barbers","98"],
              ["Electricians","87"],
              ["Plumbers","76"],
            ].map(([k,v])=>(
              <div key={k} className="rounded-[12px] border border-black/10 p-2 flex justify-between items-center">
                <span className="mono text-[8px]">{k}</span><span className="text-[10px] font-bold">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <div className="flex-1 rounded-[14px] bg-black text-white p-3">
              <div className="mono text-[7px] opacity-60">MAP EXPANSION</div>
              <div className="text-[10px] font-bold mt-1">Oldham OL1 OL2 OL8 → Manchester → UK → Eurozone</div>
              <div className="mt-2 flex gap-1">
                <span className="px-2 py-1 rounded-full bg-white/10 mono text-[6px]">OL1</span>
                <span className="px-2 py-1 rounded-full mono text-[6px] text-black" style={{ background: GRAD }}>OL2 LIVE</span>
                <span className="px-2 py-1 rounded-full bg-white/10 mono text-[6px]">MCR</span>
              </div>
            </div>
            <div className="w-[88px] rounded-[14px] p-2 flex flex-col items-center justify-center text-white" style={{ background: GRAD2 }}>
              <img src={mLogoUrl} className="w-10 h-10 rounded-full object-cover border-2 border-white" alt="M logo" />
              <div className="mono text-[6px] mt-2 text-center">myfaceprofile.com — Built for Oldham • Ready for Manchester</div>
            </div>
          </div>
          <div className="mt-auto">
            <div className="rounded-full bg-black text-white text-center py-2 mono text-[9px]">10K weekly users = £9620/week → £618K ARR — Holy workshop — Craft as worship</div>
            <div className="mt-2 flex justify-between mono text-[7px] opacity-60"><span>iOS Android Coming Soon QR</span><span>M gradient #8FFF4A → #00E5C0 → #1A7CFF → #FFE600 → #FF8A00</span></div>
          </div>
        </div>
      ),
    },
  ];

  const leftPage = pages[spread * 2];
  const rightPage = pages[spread * 2 + 1];

  const snippetCode = `<!-- My Face Profile Explanatory Companion Guide - Floater - Page Flip Popout - PRODUCTION READY -->
<!-- Copy this to marketing pages. Floater stays fixed bottom-right. Click opens page-flip popout modal with full OS explainer. -->
<!-- Add to apps/marketing/app/layout.tsx or page.tsx -->
<!-- Floater component: MyFaceGuideFloater.tsx — PageFlipBook.tsx — Copyable -->
<div id="myface-companion-floater" class="fixed bottom-6 right-6 z-50">
  <button id="myface-guide-btn" class="w-16 h-16 rounded-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] to-[#FFE600] shadow-2xl flex items-center justify-center animate-pulse hover:scale-110 transition-transform">
    <span class="text-white text-2xl">📖</span>
    <span class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">New</span>
  </button>
  <div class="absolute bottom-20 right-0 bg-white rounded-2xl shadow-xl p-3 whitespace-nowrap">
    <p class="text-sm font-bold">My Face Guide — Full OS Explainer</p>
    <p class="text-xs text-gray-500">Click to open Page Flip Guide — 16 Pages — Work OS + UPRM + MFC</p>
  </div>
</div>
<script>
  document.getElementById('myface-guide-btn').addEventListener('click', () => {
    document.getElementById('myface-companion-modal').classList.remove('hidden');
    initPageFlipBook();
  });
</script>
<div id="myface-companion-modal" class="hidden fixed inset-0 z-[100] bg-black/60 backdrop-blur flex items-center justify-center p-4">
  <div id="myface-page-flip-book" class="w-full max-w-[1100px] aspect-[16/10] bg-white rounded-3xl shadow-2xl overflow-hidden relative">
    <!-- Book pages injected here - 16 Pages Work OS + UPRM + MFC + Live + Shop -->
  </div>
</div>`;

  const copySnippet = () => {
    const ta = document.createElement("textarea");
    ta.value = snippetCode;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      {/* Marketing fake hero */}
      <div className="relative">
        {/* Top nav */}
        <header data-safe-area-sticky-top className="sticky top-0 z-30 backdrop-blur-xl bg-black/60 border-b border-white/10" style={{ top: "var(--safe-area-inset-top)" }}>
          <div className="max-w-[1280px] mx-auto px-5 lg:px-8 h-[64px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={mLogoUrl} alt="My Face Profile" className="w-9 h-9 rounded-[12px] object-cover" />
              <div>
                <div className="font-bold leading-none text-[14px] tracking-tight" style={{ fontFamily: "Poppins" }}>MY FACE PROFILE</div>
                <div className="mono text-[8px] opacity-60 tracking-[0.2em]">SHOW • CONNECT • GROW</div>
              </div>
              <div className="hidden md:flex items-center gap-2 ml-6">
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/10">Product</span>
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/5">Solutions</span>
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/5">Pricing</span>
                <span className="mono text-[10px] px-2.5 py-1 rounded-full bg-white/5">Docs</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 mono text-[9px]">
                <span className="px-2 py-1 rounded-full bg-white/10">MARKETING 100%</span>
                <span className="px-2 py-1 rounded-full bg-white/10">ONBOARDING 92%</span>
                <span className="px-2 py-1 rounded-full bg-white/10">ENGINE SUPABASE 95%+</span>
              </div>
              <button className="mono text-[11px] px-3 py-1.5 rounded-full bg-white text-black font-bold">Sign in</button>
              <button className="mono text-[11px] px-3 py-1.5 rounded-full text-black font-bold" style={{ background: GRAD }}>Start — €25</button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pt-10 pb-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mono text-[9px] tracking-wide">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#8FFF4A" }} />
              ONE ENGINE TWO CONTINENTS • FERRARI BODY + SUPABASE ENGINE • myfaceprofile.com • LIVE
            </div>
            <h1 className="mt-6 text-[46px] lg:text-[72px] leading-[0.85] tracking-[-0.04em] font-[800]" style={{ fontFamily: "Poppins" }}>
              SHOW YOUR WORK
              <br />
              <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>NOT YOUR CV.</span>
            </h1>
            <p className="mt-4 text-[15px] leading-[1.5] text-white/70 max-w-[560px]">
              Built for Oldham OL1 🌍 Ready for Manchester 🇬🇧 — Work Graph OS with UPRM Orchestrator. Project is killer object — Before/After, Milestone, Materials, Team, Shop, Trust, Gift.
              <br />
              <span className="mono text-[11px] text-white/50">Setup in 5 mins — 32 fields — No config hell — Touch of GOD — craft as worship</span>
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button onClick={() => setOpen(true)} className="px-5 py-3 rounded-full bg-white text-black font-bold text-[13px] mono flex items-center gap-2">
                <span>See how it works in 60s</span>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px]" style={{ background: GRAD2 }}>▶</span>
              </button>
              <div className="flex items-center gap-2">
                <img src={tailorSewUrl} className="w-9 h-9 rounded-full object-cover border-2 border-white/20" alt="live tailor" />
                <div className="mono text-[9px] leading-tight">
                  <div className="font-bold">Live demo OL1 vs MCR</div>
                  <div className="opacity-60">Aisha 94/100 • J Martinez 88/100</div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <div className="rounded-[20px] bg-white/5 border border-white/10 p-4 backdrop-blur">
                <div className="mono text-[9px] opacity-60">WORK GRAPH</div>
                <div className="text-[28px] font-bold leading-none mt-2" style={{ fontFamily: "Poppins" }}>12</div>
                <div className="mono text-[9px] opacity-60">Projects • SEO Goldmine</div>
              </div>
              <div className="rounded-[20px] bg-white/5 border border-white/10 p-4 backdrop-blur">
                <div className="mono text-[9px] opacity-60">PIPELINE</div>
                <div className="text-[28px] font-bold leading-none mt-2" style={{ fontFamily: "Poppins" }}>£8420</div>
                <div className="mono text-[9px] opacity-60">Bookings • Escrow 5-10%</div>
              </div>
              <div className="rounded-[20px] p-4 text-black" style={{ background: GRAD }}>
                <div className="mono text-[9px] opacity-70">TRUST SCORE</div>
                <div className="text-[28px] font-bold leading-none mt-2" style={{ fontFamily: "Poppins" }}>4.9</div>
                <div className="mono text-[9px] opacity-70">Verified • Event-sourced</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] overflow-hidden border border-white/10 bg-[#0A0A0A] p-3">
              <div className="rounded-[20px] overflow-hidden bg-black relative">
                <img src={giftBoxUrl} alt="Gift economy box" className="w-full h-[280px] object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="px-3 py-1.5 rounded-full bg-white text-black mono text-[10px] font-bold">FERRARI ENGINE DIAGRAM</div>
                  <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur border border-white/20 mono text-[10px] text-white">1 Telephony • 2 Speech • 3 Brain GPT-4o + RAG 815 • 4 Logic • 5 Social • 6 Handoff • 7 Observability</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-[16px] bg-white/5 border border-white/10 p-3">
                  <div className="mono text-[8px] opacity-60">UPRM COMMAND CENTER</div>
                  <div className="mt-2 flex gap-2">
                    <img src={mechanicUrl} className="w-10 h-10 rounded-[10px] object-cover" alt="mechanic" />
                    <div className="mono text-[9px] leading-tight"><div className="font-bold">J Martinez</div><div className="opacity-60">Toyota P0302 • 88/100</div></div>
                  </div>
                </div>
                <div className="rounded-[16px] bg-white/5 border border-white/10 p-3">
                  <div className="mono text-[8px] opacity-60">LIVE WORKSHOP</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="mono text-[9px]">124 viewers • Gift Rain 🔨✂️❤️👑🏆</span>
                  </div>
                </div>
              </div>
            </div>

            {/* subtle glow */}
            <div className="absolute -right-10 -top-10 w-[220px] h-[220px] rounded-full blur-[60px] opacity-30 pointer-events-none" style={{ background: GRAD2 }} />
          </div>
        </div>

        {/* Code snippet section */}
        <div className="max-w-[1280px] mx-auto px-5 lg:px-8 pb-24">
          <div className="rounded-[24px] bg-white/5 border border-white/10 backdrop-blur p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold" style={{ background: GRAD }}>M</div>
                <div>
                  <div className="mono text-[12px] font-bold">Floater Integration — Add to myfaceprofile.com</div>
                  <div className="mono text-[10px] opacity-60">Copy this to marketing pages. Floater stays fixed bottom-right. Click opens page-flip popout modal with full system explainer.</div>
                </div>
              </div>
              <button onClick={copySnippet} className="px-4 py-2 rounded-full bg-white text-black mono text-[11px] font-bold hover:bg-white/90 transition">
                {copied ? "Copied ✓" : "Copy snippet"}
              </button>
            </div>
            <pre className="mt-4 rounded-[16px] bg-black border border-white/10 p-4 overflow-auto text-[11px] leading-[1.5] mono text-white/80 max-h-[320px]">
              <code>{snippetCode}</code>
            </pre>
            <div className="mt-3 flex flex-wrap gap-2 mono text-[9px]">
              <span className="px-2.5 py-1 rounded-full bg-white/10">PRODUCTION READY</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10">Supabase Wired • Live</span>
              <span className="px-2.5 py-1 rounded-full text-black" style={{ background: GRAD }}>PAGES 16 — Work OS + UPRM + MFC + Bot Army + £618K ARR</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10">Poppins Bold 800 + Inter + JetBrains Mono</span>
              <span className="px-2.5 py-1 rounded-full bg-white/10">Glass white/5 backdrop-blur rounded 24px border white/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floater — Always visible on demo page */}
      <div id="myface-companion-floater" className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button
            id="myface-guide-btn"
            onClick={() => setOpen(true)}
            className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center animate-pulse hover:scale-110 transition-transform border border-white/20 relative"
            style={{ background: GRAD2 }}
            aria-label="Open My Face Guide"
          >
            <img src={mLogoUrl} alt="My Face Profile" className="w-9 h-9 rounded-full object-cover border border-white/50" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-black animate-pulse">New</span>
          </button>
          <div className="absolute bottom-20 right-0 bg-white rounded-2xl shadow-xl p-3 min-w-[268px] border border-black/5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px]" style={{ background: GRAD }}>📖</div>
              <p className="text-[13px] font-bold text-black" style={{ fontFamily: "Poppins" }}>My Face Guide — Full OS Explainer</p>
              <span className="ml-auto w-2 h-2 rounded-full bg-[#8FFF4A] animate-pulse" />
            </div>
            <p className="text-[11px] text-gray-500 mt-1 mono">Click to open Page Flip Guide — 16 Pages — Work OS + UPRM + MFC</p>
            <div className="mt-2 flex gap-1">
              <span className="mono text-[8px] px-2 py-1 rounded-full bg-black text-white">LIVE</span>
              <span className="mono text-[8px] px-2 py-1 rounded-full bg-[#E6FFD8] text-black border border-[#8FFF4A]">Supabase 95%+</span>
              <span className="mono text-[8px] px-2 py-1 rounded-full bg-black/5 text-black">16 Pages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Page Flip Book */}
      {open && (
        <div id="myface-companion-modal" className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[12px] flex items-center justify-center p-3 lg:p-6">
          <div
            id="myface-page-flip-book"
            className="w-full max-w-[1100px] bg-white rounded-[24px] lg:rounded-[32px] shadow-2xl overflow-hidden relative flex flex-col"
            style={{ height: "min(88vh, 720px)", aspectRatio: "16/10" }}
          >
            {/* Top bar */}
            <div className="h-[56px] shrink-0 flex items-center justify-between px-4 lg:px-6 border-b border-black/10 bg-white">
              <div className="flex items-center gap-3">
                <img src={mLogoUrl} alt="M" className="w-7 h-7 rounded-full object-cover" />
                <div className="hidden sm:block">
                  <div className="mono text-[10px] font-bold tracking-[0.18em]">MY FACE PROFILE OS — PAGE FLIP GUIDE</div>
                  <div className="mono text-[8px] opacity-60">{leftPage?.title} • {rightPage?.title || "End"} • {spread + 1}/{totalSpreads} spreads • {spread * 2 + 1}-{Math.min(spread * 2 + 2, totalPages)}/{totalPages}</div>
                </div>
                <div className="sm:hidden mono text-[10px] font-bold">MY FACE PROFILE OS</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-[120px] h-[6px] rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: GRAD }} />
                  </div>
                  <span className="mono text-[9px]">{Math.round(progress)}%</span>
                </div>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/80 transition">✕</button>
              </div>
            </div>

            {/* Book */}
            <div className="flex-1 relative overflow-hidden perspective-2000 bg-[#FDFCF8]">
              {/* Progress bar thin */}
              <div className="absolute top-0 left-0 right-0 h-[4px] z-20">
                <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, background: GRAD }} />
              </div>

              {/* Desktop spread */}
              <div className="hidden md:flex w-full h-full">
                <div className="w-1/2 h-full border-r border-black/10 relative bg-white">
                  {leftPage?.render(spread)}
                  <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/5 hover:bg-black text-black hover:text-white flex items-center justify-center transition">‹</button>
                  <div className="absolute bottom-2 left-3 mono text-[8px] opacity-40">{spread * 2 + 1}/{totalPages}</div>
                </div>
                <div className="w-1/2 h-full relative bg-white">
                  {rightPage ? rightPage.render(spread) : (
                    <div className="w-full h-full flex items-center justify-center paper">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-[24px]" style={{ background: GRAD2 }}>M</div>
                        <div className="mono text-[10px] mt-3">End of guide — Go Live Now</div>
                      </div>
                    </div>
                  )}
                  <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/5 hover:bg-black text-black hover:text-white flex items-center justify-center transition">›</button>
                  {rightPage && <div className="absolute bottom-2 right-3 mono text-[8px] opacity-40">{spread * 2 + 2}/{totalPages}</div>}
                </div>
              </div>

              {/* Mobile single */}
              <div className="md:hidden w-full h-full overflow-auto">
                <div className="min-h-full">
                  {(spread * 2 < totalPages ? pages[spread * 2] : null)?.render(spread)}
                  {pages[spread * 2 + 1] && (
                    <div className="border-t border-black/10">
                      {pages[spread * 2 + 1].render(spread)}
                    </div>
                  )}
                </div>
              </div>

              {/* Flipping page overlay — Desktop only */}
              {flipping && (
                <div
                  className="hidden md:block absolute top-0 w-1/2 h-full preserve-3d z-30 shadow-2xl"
                  style={{
                    left: flipping.dir === "next" ? "50%" : "0%",
                    transformOrigin: flipping.dir === "next" ? "left center" : "right center",
                    transform: flipping.anim ? `rotateY(${flipping.dir === "next" ? "-180deg" : "180deg"})` : "rotateY(0deg)",
                    transition: "transform 600ms cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <div className="absolute inset-0 backface-hidden overflow-hidden bg-white border border-black/10">
                    {flipping.dir === "next"
                      ? rightPage?.render(spread)
                      : leftPage?.render(spread)}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
                  </div>
                  <div className="absolute inset-0 backface-hidden overflow-hidden bg-white border border-black/10" style={{ transform: "rotateY(180deg)" }}>
                    {flipping.dir === "next"
                      ? (pages[(spread + 1) * 2]?.render(spread + 1) ?? (
                          <div className="w-full h-full flex items-center justify-center paper"><span className="mono text-[10px]">End</span></div>
                        ))
                      : (pages[(spread - 1) * 2 + 1]?.render(spread - 1) ?? pages[(spread - 1) * 2]?.render(spread - 1))}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Click zones */}
              <button aria-label="Previous spread" onClick={goPrev} className="hidden md:block absolute left-0 top-0 bottom-0 w-[8%] z-10 cursor-w-resize opacity-0 hover:opacity-100 bg-gradient-to-r from-black/5 to-transparent transition" />
              <button aria-label="Next spread" onClick={goNext} className="hidden md:block absolute right-0 top-0 bottom-0 w-[8%] z-10 cursor-e-resize opacity-0 hover:opacity-100 bg-gradient-to-l from-black/5 to-transparent transition" />

              {/* Swipe handler */}
              <div
                className="absolute inset-0 md:hidden z-10"
                onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchStart.current === null) return;
                  const diff = e.changedTouches[0].clientX - touchStart.current;
                  if (diff < -40) goNext();
                  if (diff > 40) goPrev();
                  touchStart.current = null;
                }}
              />
            </div>

            {/* Bottom nav */}
            <div className="h-[64px] shrink-0 border-t border-black/10 bg-white flex items-center justify-between px-4 lg:px-6 gap-3">
              <div className="flex items-center gap-2">
                <button onClick={goPrev} disabled={spread === 0} className="px-3 py-1.5 rounded-full bg-black text-white mono text-[11px] disabled:opacity-30 disabled:pointer-events-none">← Prev</button>
                <button onClick={goNext} disabled={spread >= totalSpreads - 1} className="px-3 py-1.5 rounded-full text-black mono text-[11px] font-bold disabled:opacity-30 disabled:pointer-events-none" style={{ background: GRAD }}>Next →</button>
              </div>

              <div className="flex items-center gap-1.5 overflow-auto">
                {Array.from({ length: totalSpreads }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSpread(i)}
                    className={`h-2 rounded-full transition-all ${i === spread ? "w-8" : "w-2 bg-black/15"}`}
                    style={i === spread ? { background: GRAD } : {}}
                    aria-label={`Go to spread ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 mono text-[9px]">
                <span className="hidden sm:inline opacity-60">Click edge • ← → keys • Swipe</span>
                <span className="px-2 py-1 rounded-full bg-black text-white">{spread * 2 + 1}-{Math.min(spread * 2 + 2, totalPages)}/{totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes grow { from { width: 0% } }
      `}</style>
    </div>
  );
}
