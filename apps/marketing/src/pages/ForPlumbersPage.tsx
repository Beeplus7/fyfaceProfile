import React, { useEffect, useState } from "react";
import mLogoWhite from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import mLogoBlack from "../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import heroPlumber from "../assets/a0e4b743decf2716-image_20261029_190129.webp";

type PlumberLead = {
  name: string;
  gasSafe: string;
  town: string;
  phone: string;
};

type StoredRecord = {
  id: string;
  value: PlumberLead & { createdAt: string };
};

const pipelineSteps = [
  { k: "SEARCH", label: "Customer searches", detail: "plumber Oldham boiler breakdown" },
  { k: "FEED", label: "Work Feed surfaces", detail: "Your boiler fix • 0.8mi • Worcester Bosch 68C" },
  { k: "BOOK", label: "Books instantly", detail: "£150 fixed • Escrow Secured • 24h guarantee" },
  { k: "UPRM", label: "UPRM Pipeline", detail: "Job → Invoice → Trust Ledger → Repeat" },
  { k: "TRUST", label: "Trust Ledger +0.2", detail: "4.9 • Gas Safe verified • Safety first" },
];

export default function ForPlumbersPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [leadForm, setLeadForm] = useState<PlumberLead>({ name: "", gasSafe: "", town: "Oldham", phone: "" });
  const [leads, setLeads] = useState<StoredRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<"fix" | "check">("fix");

  // Load records
  const reloadRecords = async () => {
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "records.list", args: { collection: "plumber_leads", limit: 100 } }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setLeads((json.data?.records || []) as StoredRecord[]);
    } catch (e) {
      console.log("load error", e);
    }
  };

  useEffect(() => {
    reloadRecords();
  }, []);

  const createRow = async (row: PlumberLead) => {
    const idempotency_key = `plumber_${row.name}_${row.gasSafe}_${Date.now()}`.replace(/\s+/g, "_");
    const res = await fetch("actions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        action: "records.create",
        args: {
          collection: "plumber_leads",
          value: { ...row, createdAt: new Date().toISOString() },
          idempotency_key,
        },
      }),
    });
    const json = await res.json();
    if (!res.ok || json.error) throw new Error(json.error || "Failed to save");
    return json.data;
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.gasSafe) {
      setSaveMsg("Add name + Gas Safe ID to verify.");
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    let saved = 0;
    let error: string | null = null;
    try {
      await createRow(leadForm);
      saved = 1;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
    let reloadError: string | null = null;
    try {
      await reloadRecords();
    } catch (err) {
      reloadError = err instanceof Error ? err.message : String(err);
    }
    if (saved && !error) {
      setSaveMsg(`Secured. You're #${leads.length + 1} in Oldham queue. We verify Gas Safe ${leadForm.gasSafe} within 2h.`);
      setLeadForm({ name: "", gasSafe: "", town: "Oldham", phone: "" });
    } else {
      setSaveMsg(error || reloadError || "Queue full — try again");
    }
    setSaving(false);
  };

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip relative selection:bg-[#8FFF4A] selection:text-black"
      style={{ boxSizing: "border-box", paddingTop: "var(--safe-area-inset-top)" }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -top-[30vh] left-[10%] h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(143,255,74,0.22),transparent_60%)] blur-[40px]" />
        <div className="absolute top-[10vh] right-[-10%] h-[80vh] w-[50vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,229,192,0.18),transparent_65%)] blur-[50px]" />
        <div className="absolute bottom-[0] left-[30%] h-[60vh] w-[70vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,230,0,0.12),transparent_70%)] blur-[60px]" />
      </div>

      {/* NAV */}
      <header
        data-safe-area-sticky-top
        className="sticky z-50 border-b border-white/[0.06] bg-[#FFFDF7]/90 backdrop-blur-2xl"
        style={{ top: "var(--safe-area-inset-top)" }}
      >
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white overflow-hidden">
              <img src={mLogoBlack} alt="M logo" className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-[Poppins] text-[15px] font-bold tracking-[-0.02em] leading-none">My Face Profile</span>
              <span className="mono text-[10px] tracking-[0.18em] text-white/50 uppercase">Touch of GOD • Oldham</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button onClick={()=>{ setSaveMsg("Top • My Face Profile • Page 18"); window.scrollTo({top:0,behavior:'smooth'}); }} className="mono text-[11px] tracking-[0.14em] text-white/40 hover:text-white/80 uppercase transition">
              Home
            </button>
            <button onClick={()=>document.getElementById('why')?.scrollIntoView({behavior:'smooth'})} className="mono text-[11px] tracking-[0.14em] text-white/40 hover:text-white/80 uppercase transition">
              For Customers
            </button>
            <span className="relative mono text-[11px] tracking-[0.14em] text-white uppercase">
              For Plumbers
              <span className="absolute -bottom-[22px] left-0 h-[2px] w-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] to-[#FFE600]" />
            </span>
            <button onClick={()=>document.getElementById('jobs')?.scrollIntoView({behavior:'smooth'})} className="mono text-[11px] tracking-[0.14em] text-white/40 hover:text-white/80 uppercase transition">
              Pricing
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#8FFF4A]" />
              <span className="mono text-[10px] tracking-[0.12em]">76 LIVE IN OLDHAM</span>
            </div>
            <button
              onClick={() => document.getElementById("join")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden md:inline-flex h-9 items-center justify-center rounded-full bg-white px-5 text-[13px] font-semibold text-black hover:bg-white/90 transition"
            >
              Join Free
            </button>
            <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden h-9 w-9 grid place-items-center rounded-full bg-white/10">
              <div className="space-y-1">
                <div className="h-[2px] w-4 bg-white" />
                <div className="h-[2px] w-4 bg-white" />
              </div>
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-white/10 bg-[#0A0A0A] px-6 py-6 space-y-4">
            <div className="mono text-[11px] text-white/50">Page 18 of 24 • For Plumbers</div>
            <a className="block text-[20px] font-bold font-[Poppins]">Your Boiler Fix Is Your Storefront</a>
          </div>
        )}
      </header>

      {/* Badge Row */}
      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] text-[10px] font-bold text-black">18</span>
            <span className="mono text-[10px] tracking-[0.14em] uppercase text-white/70">Page 18 of 24 • For Plumbers Standalone LP • SEO Oldham</span>
          </div>
          <div className="mono inline-flex items-center gap-2 rounded-full bg-[#8FFF4A]/10 px-3 py-1.5 text-[10px] tracking-[0.14em] text-[#8FFF4A] border border-[#8FFF4A]/20">
            <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse" /> Touch of GOD in Every Pipe • GAS SAFE VERIFIED
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative mx-auto max-w-[1440px] px-6 md:px-10 pt-10 pb-16 md:pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-start">
        {/* Left copy */}
        <div className="relative z-10">
          <div className="mono mb-6 inline-flex max-w-full flex-wrap rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] leading-[1.4] tracking-[0.12em] text-white/60 uppercase">
            Page 18 of 24 • For Plumbers • Boiler • Heating • Gas Safe • Oldham • Touch of GOD
          </div>

          <h1 className="text-[40px] md:text-[64px] lg:text-[72px] leading-[0.9] tracking-[-0.04em]">
            <span className="block text-white">Your Boiler Fix</span>
            <span className="block text-white">Is Your</span>
            <span className="block text-white">Storefront.</span>
            <span className="block mt-3 text-gradient-m pb-2">Show The Heat.</span>
            <span className="block text-gradient-m">Sell The Trust.</span>
          </h1>

          <p className="mt-7 max-w-[560px] text-[17px] leading-[1.6] text-white/60">
            <span className="text-white/90 font-medium">76 plumbers in Oldham</span> showing Worcester Bosch boiler fixes, heating, Gas Safe 123456 — with Gas Safe badge,{" "}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[12px] text-white">Pressure 1.2 bar</span>{" "}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[12px] text-white">Flue secure</span> Escrow Secured — not posts.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setSaveMsg("Jumping to Oldham queue — verify Gas Safe below");
                document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group relative inline-flex h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] to-[#FFE600] px-8 text-[14px] font-bold tracking-[-0.01em] text-black transition hover:scale-[1.02]"
            >
              <span>View Oldham Queue</span>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-white text-[12px] font-bold">•</span>
            </button>
            <div className="inline-flex h-[52px] items-center gap-3 rounded-full glass px-5">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full border-2 border-black bg-[#1A1A1A] grid place-items-center text-[10px]">JM</div>
                <div className="h-7 w-7 rounded-full border-2 border-black bg-[#2A2A2A] grid place-items-center text-[10px]">AK</div>
                <div className="h-7 w-7 rounded-full border-2 border-black bg-[#8FFF4A] text-black grid place-items-center text-[10px] font-bold">+74</div>
              </div>
              <span className="mono text-[11px] tracking-[0.08em] text-white/60">LIVE IN OLDHAM • 4.9 TRUST</span>
            </div>
          </div>

          {/* Mini stats under hero */}
          <div className="mt-10 grid grid-cols-3 max-w-[480px] gap-4 border-t border-white/10 pt-6">
            <div>
              <div className="font-[Poppins] text-[28px] leading-none tracking-[-0.02em]">76</div>
              <div className="mono mt-1 text-[10px] tracking-[0.12em] text-white/40 uppercase">Plumbers • Oldham</div>
            </div>
            <div>
              <div className="font-[Poppins] text-[28px] leading-none tracking-[-0.02em]">4.9</div>
              <div className="mono mt-1 text-[10px] tracking-[0.12em] text-white/40 uppercase">TrustScore • Safety</div>
            </div>
            <div>
              <div className="font-[Poppins] text-[28px] leading-none tracking-[-0.02em]">£150</div>
              <div className="mono mt-1 text-[10px] tracking-[0.12em] text-white/40 uppercase">Avg Job • Escrow</div>
            </div>
          </div>
        </div>

        {/* Right hero image - glassmorphism card */}
        <div className="relative lg:sticky lg:top-[88px]">
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0F0F0F] glow-m">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                <div className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                <div className="h-2 w-2 rounded-full bg-[#27CA40]" />
                <span className="ml-3 mono text-[10px] tracking-[0.14em] text-white/40 uppercase">J Martin Plumbing • Live Job</span>
              </div>
              <div className="mono flex items-center gap-2 text-[10px] text-white/50">
                <span className="inline-flex h-5 items-center rounded-full bg-[#8FFF4A]/15 px-2 text-[#8FFF4A] border border-[#8FFF4A]/20">GAS SAFE 123456</span>
                <span>68°C</span>
              </div>
            </div>

            <div className="relative aspect-[4/3] bg-[#111]">
              <img src={heroPlumber} alt="Plumber J Martin Plumbing Heating Gas Safe Registered 123456 fixing Worcester Bosch boiler 68C Central Heating Pressure 1.2 bar" className="absolute inset-0 h-full w-full object-cover" />
              {/* Glass overlays */}
              <div className="absolute left-4 top-4 rounded-[14px] glass-strong px-3 py-2">
                <div className="mono text-[9px] tracking-[0.16em] text-white/50 uppercase">Central Heating</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-[Poppins] text-[20px] leading-none">68°C</span>
                  <span className="mono text-[10px] text-white/60">Flow • Worcester Bosch</span>
                </div>
                <div className="mt-2 flex gap-1.5">
                  <span className="mono rounded-full bg-[#8FFF4A] px-2 py-0.5 text-[9px] font-bold text-black">Pressure 1.2 bar</span>
                  <span className="mono rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/70">Leaks None</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                <div className="flex-1 rounded-[16px] glass-strong p-3">
                  <div className="flex items-center gap-2">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] text-black font-bold text-[12px]">✓</div>
                    <div>
                      <div className="mono text-[9px] tracking-[0.12em] text-white/50 uppercase">Clipboard Check</div>
                      <div className="text-[12px] font-semibold leading-tight">Checked Pressure OK • Flue secure • Gas tightness Pass</div>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:grid h-[68px] w-[68px] place-items-center rounded-[16px] bg-white text-black">
                  <div className="text-center leading-none">
                    <div className="mono text-[8px] tracking-[0.14em]">GAS</div>
                    <div className="font-[Poppins] text-[14px] font-bold leading-none">SAFE</div>
                    <div className="mono mt-0.5 text-[7px]">REGISTER</div>
                  </div>
                </div>
              </div>

              {/* Divine glow rim */}
              <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-white/10" />
              <div className="pointer-events-none absolute -inset-[1px] rounded-[24px] bg-gradient-to-br from-[#8FFF4A]/30 via-transparent to-[#FFE600]/20 opacity-60 blur-[0.5px]" />
            </div>

            {/* Bottom meta */}
            <div className="grid grid-cols-3 divide-x divide-white/10 bg-[#0A0A0A]">
              <div className="px-5 py-4">
                <div className="mono text-[9px] tracking-[0.14em] text-white/40 uppercase">Toolbox</div>
                <div className="mt-1 text-[13px] font-medium">Worcester Bosch • Sealed</div>
              </div>
              <div className="px-5 py-4">
                <div className="mono text-[9px] tracking-[0.14em] text-white/40 uppercase">Escrow</div>
                <div className="mt-1 flex items-center gap-1.5 text-[13px] font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#8FFF4A]" /> Secured £150
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="mono text-[9px] tracking-[0.14em] text-white/40 uppercase">Safety</div>
                <div className="mt-1 text-[13px] font-medium">Flue secure • Tightness Pass</div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -right-3 -top-3 hidden md:flex rotate-3 items-center gap-2 rounded-full bg-white px-4 py-2 shadow-xl">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[12px] text-white">⚡</span>
            <span className="mono text-[11px] font-bold tracking-[0.04em] text-black">DIVINE FIX • TOUCH OF GOD</span>
          </div>
        </div>
      </section>

      {/* SECTION 1 — WHY PLUMBERS */}
      <section id="why" className="relative border-t border-white/[0.06] bg-[#080808]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mono mb-4 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] tracking-[0.14em] text-white/60 uppercase">Section 01 • Why Plumbers Choose Face Profile</div>
              <h2 className="text-[32px] md:text-[48px] leading-[0.95]">
                SHOW. <span className="text-white/30">SELL.</span> <br />
                <span className="text-gradient-m">GROW.</span>
              </h2>
            </div>
            <p className="max-w-[420px] text-[15px] leading-[1.6] text-white/50">
              Not another directory. Your Worcester Bosch 68C fix, pressure 1.2 bar check, flue secure proof — is the storefront. Customers book heat, not headlines.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* SHOW */}
            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0E0E0E] p-2">
              <div className="rounded-[18px] overflow-hidden bg-[#121212]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#0A0A0A]">
                  <div
                    role="img"
                    aria-label="Plumber boiler fix before after"
                    className="absolute inset-0 h-full w-full bg-cover bg-center transition duration-700 group-hover:scale-[1.03]"
                    style={{ backgroundImage: `url(${heroPlumber})` }}
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <button
                      onClick={() => setActiveImage("fix")}
                      className={`mono rounded-full px-3 py-1 text-[10px] tracking-[0.12em] border transition ${activeImage === "fix" ? "bg-white text-black border-white" : "bg-black/50 text-white/70 border-white/20 backdrop-blur"}`}
                    >
                      BEFORE / AFTER
                    </button>
                    <span className="mono rounded-full bg-[#8FFF4A] px-2.5 py-1 text-[10px] font-bold text-black">LIVE • OLDHAM</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-[12px] glass-strong px-3 py-2">
                    <div className="mono text-[10px] text-white/70">J Martin Plumbing • Worcester Bosch Greenstar • 68C Flow</div>
                    <div className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] text-black font-bold">1</div>
                  <h3 className="text-[20px] leading-none">SHOW</h3>
                  <span className="mono ml-auto text-[10px] tracking-[0.12em] text-white/40">BOILER FIX • VISUAL PROOF</span>
                </div>
                <p className="mt-4 text-[14px] leading-[1.5] text-white/60">Image 190129 boiler fix — not stock. Pressure gauge, flue clip, gas tightness sheet. Customers see you do the work, 0.8mi away, not a logo.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Worcester Bosch", "68C Flow", "0.8mi Oldham", "Verified Photo"].map((t) => (
                    <span key={t} className="mono rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/60">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SELL */}
            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0E0E0E] p-2">
              <div className="rounded-[18px] bg-[#101010] border border-white/[0.04] p-5">
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] tracking-[0.14em] text-white/40 uppercase">Materials • Checklist • Divine Detail</span>
                  <span className="mono rounded-full bg-white text-black px-2 py-0.5 text-[10px] font-bold">SELL</span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    { label: "Pressure", value: "1.2 bar", ok: true },
                    { label: "Leaks", value: "None", ok: true },
                    { label: "Flue", value: "Secure", ok: true },
                    { label: "Gas tightness test", value: "Pass", ok: true },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                      <span className="mono text-[11px] tracking-[0.06em] text-white/50">{row.label}</span>
                      <span className="flex items-center gap-2 text-[13px] font-semibold">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-[#8FFF4A] text-black text-[10px]">✓</span>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[14px] bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10 p-4">
                  <div className="mono text-[10px] tracking-[0.14em] text-white/40 uppercase">Clipboard • Checked Pressure OK</div>
                  <div className="mt-2 font-[Poppins] text-[16px] leading-[1.2]">“Boiler losing pressure — fixed PRV, repressurised to 1.2 bar, inhibitor topped. No leaks. Flue secure per Gas Safe.”</div>
                  <div className="mt-3 mono text-[11px] text-white/40">— J Martin • Gas Safe 123456 • £150 Escrow Secured</div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#FFE600] to-[#FF8A00] text-black font-bold">2</div>
                  <h3 className="text-[20px] leading-none">SELL</h3>
                  <span className="mono ml-auto text-[10px] tracking-[0.12em] text-white/40">TRUST • SAFETY • ESCROW</span>
                </div>
                <p className="mt-4 text-[14px] leading-[1.5] text-white/60">Materials sell, not marketing. Pressure 1.2 bar, Leaks None, Flue secure, Gas tightness Pass — that’s your product page.</p>
              </div>
            </div>

            {/* GROW */}
            <div className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-[#0E0E0E] p-2">
              <div className="rounded-[18px] overflow-hidden bg-[#0E0E0E] border border-white/[0.04]">
                <div className="bg-[#0A0A0A] p-5">
                  <div className="flex items-center gap-3">
                    <img src={mLogoWhite} alt="M" className="h-8 w-8 rounded-[10px] object-cover" />
                    <div>
                      <div className="mono text-[10px] tracking-[0.14em] text-white/40">GAS SAFE REGISTER</div>
                      <div className="font-[Poppins] text-[18px] leading-none">Badge 123456</div>
                    </div>
                    <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-[#8FFF4A] text-black">✓</span>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-3 text-center">
                      <div className="font-[Poppins] text-[22px] leading-none">4.9</div>
                      <div className="mono mt-1 text-[8px] tracking-[0.12em] text-white/40">TRUST SCORE</div>
                    </div>
                    <div className="rounded-[12px] bg-white/[0.04] border border-white/[0.06] p-3 text-center">
                      <div className="font-[Poppins] text-[22px] leading-none">76</div>
                      <div className="mono mt-1 text-[8px] tracking-[0.12em] text-white/40">PLUMBERS</div>
                    </div>
                    <div className="rounded-[12px] bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 p-3 text-center">
                      <div className="font-[Poppins] text-[22px] leading-none text-[#8FFF4A]">100%</div>
                      <div className="mono mt-1 text-[8px] tracking-[0.12em] text-[#8FFF4A]/70">SAFETY</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[12px] bg-gradient-to-r from-[#8FFF4A]/20 via-[#00E5C0]/15 to-[#FFE600]/15 border border-white/10 p-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white grid place-items-center text-black font-bold">TG</div>
                    <div>
                      <div className="mono text-[9px] tracking-[0.12em] text-white/50 uppercase">Touch of GOD</div>
                      <div className="text-[13px] font-semibold leading-tight">In Every Pipe • Holy plumber feel</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-black font-bold">3</div>
                  <h3 className="text-[20px] leading-none">GROW</h3>
                  <span className="mono ml-auto text-[10px] tracking-[0.12em] text-white/40">GAS SAFE • TRUST LEDGER</span>
                </div>
                <p className="mt-4 text-[14px] leading-[1.5] text-white/60">Gas Safe Register badge 123456, TrustScore 4.9, 76 plumbers — safety is the growth loop. One verified fix becomes next 5 bookings.</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#8FFF4A] px-3 py-1.5">
                  <span className="mono text-[10px] font-bold tracking-[0.08em] text-black">DIVINE GLOW • NOT SAAS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — REAL JOBS OLDHAM */}
      <section id="jobs" className="relative border-t border-white/[0.06] bg-[#FFFDF7]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-20">
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] tracking-[0.14em] text-white/60 uppercase">Section 02 • Real Jobs Oldham</span>
            <span className="mono rounded-full bg-[#00E5C0]/10 border border-[#00E5C0]/20 px-3 py-1 text-[10px] tracking-[0.12em] text-[#00E5C0] uppercase">Live Pipeline Demo</span>
          </div>

          <div className="mt-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <h2 className="text-[32px] md:text-[48px] leading-[0.9]">
                Customer searches <span className="text-white/30">plumber</span> Oldham boiler <br />
                <span className="text-gradient-m">→ Your fix shows up 0.8mi away.</span>
              </h2>

              <div className="mt-10 relative">
                {/* Pipeline */}
                <div className="absolute left-[18px] top-[14px] bottom-[14px] w-[1px] bg-gradient-to-b from-[#8FFF4A] via-[#00E5C0] to-[#FFE600]/30 hidden md:block" />
                <div className="space-y-4">
                  {pipelineSteps.map((step, i) => (
                    <div key={step.k} className="group relative flex gap-4 rounded-[18px] border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.04] hover:border-white/10">
                      <div className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0F0F0F] border border-white/10 font-[Poppins] text-[12px] font-bold">
                        {i + 1}
                        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#8FFF4A]/30 to-[#00E5C0]/20 opacity-0 group-hover:opacity-100 transition" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="mono text-[11px] tracking-[0.14em] text-white/40">{step.k}</span>
                          <span className="h-1 w-1 rounded-full bg-white/20" />
                          <span className="text-[15px] font-semibold tracking-[-0.01em]">{step.label}</span>
                        </div>
                        <div className="mt-1 mono text-[12px] text-white/50">{step.detail}</div>
                      </div>
                      <div className="hidden md:grid h-8 w-8 place-items-center rounded-full bg-white text-black text-[12px]">→</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Work Feed card */}
              <div className="rounded-[24px] border border-white/10 bg-[#0F0F0F] overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
                  <span className="mono text-[10px] tracking-[0.14em] text-white/40 uppercase">Work Feed • Oldham • 0.8mi</span>
                  <span className="mono inline-flex items-center gap-1 rounded-full bg-[#8FFF4A]/15 border border-[#8FFF4A]/20 px-2 py-1 text-[10px] text-[#8FFF4A]">LIVE • 3 BOOKING</span>
                </div>
                <div className="p-3">
                  <div className="rounded-[16px] overflow-hidden border border-white/10 bg-[#121212] flex gap-3 p-3">
                    <div
                      role="img"
                      aria-label="Worcester Bosch boiler fix"
                      className="h-[88px] w-[88px] rounded-[12px] bg-cover bg-center shrink-0"
                      style={{ backgroundImage: `url(${heroPlumber})` }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[10px] tracking-[0.08em] text-white/40">BOILER FIX • 12 MIN AGO</span>
                        <span className="mono rounded-full bg-[#8FFF4A] px-1.5 py-0.5 text-[8px] font-bold text-black">68C</span>
                      </div>
                      <div className="mt-1 font-[Poppins] text-[14px] leading-tight">Worcester Bosch Greenstar • Central Heating Pressure 1.2 bar • Flue secure • Gas tightness Pass</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="mono rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/70">J Martin • Gas Safe 123456</span>
                        <span className="mono rounded-full bg-[#FFE600]/15 border border-[#FFE600]/20 px-2 py-0.5 text-[9px] text-[#FFE600]">Escrow £150</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-[14px] bg-white text-black p-3">
                      <div className="mono text-[9px] tracking-[0.12em] text-black/50">BOOKS IN</div>
                      <div className="font-[Poppins] text-[20px] leading-none">~2h 14m</div>
                      <div className="mono mt-1 text-[10px] text-black/60">Oldham OL1 • 0.8mi</div>
                    </div>
                    <div className="rounded-[14px] border border-white/10 bg-white/[0.03] p-3">
                      <div className="mono text-[9px] tracking-[0.12em] text-white/40">UPRM PIPELINE</div>
                      <div className="font-[Poppins] text-[14px] leading-tight">Job → Invoice → Trust Ledger</div>
                      <div className="mt-2 flex gap-1">
                        <div className="h-1 flex-1 rounded-full bg-[#8FFF4A]" />
                        <div className="h-1 flex-1 rounded-full bg-[#00E5C0]" />
                        <div className="h-1 flex-1 rounded-full bg-[#FFE600]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Ledger */}
              <div className="rounded-[20px] glass p-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] text-black font-bold">4.9</div>
                <div className="flex-1">
                  <div className="mono text-[10px] tracking-[0.12em] text-white/40 uppercase">Trust Ledger • Verified</div>
                  <div className="text-[13px] leading-tight">76 plumbers • Safety-first • Touch of GOD in Every Pipe — not reviews, proof.</div>
                </div>
                <div className="mono rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px]">OLDHAM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — PROJECT EXAMPLE */}
      <section className="relative border-y border-white/[0.06] bg-[#0A0A0A]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
            <div className="lg:sticky lg:top-[100px]">
              <div className="mono mb-4 inline-flex rounded-full border border-[#8FFF4A]/20 bg-[#8FFF4A]/10 px-3 py-1 text-[10px] tracking-[0.14em] text-[#8FFF4A] uppercase">Section 03 • Project Example • Live Job Card</div>
              <h2 className="text-[28px] md:text-[42px] leading-[0.95]">
                Boiler fix <br />
                Worcester Bosch <span className="text-gradient-m">68C</span> <br />
                <span className="text-white/40">Central Heating</span> <br />
                Pressure 1.2 bar
              </h2>

              <div className="mt-8 space-y-4">
                <div className="rounded-[18px] border border-white/10 bg-[#121212] p-5">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10px] tracking-[0.12em] text-white/40">PROJECT STATS</span>
                    <span className="mono text-[10px] rounded-full bg-white text-black px-2 py-0.5 font-bold">LIVE DATA</span>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {[
                      { v: "76", l: "Projects • Oldham" },
                      { v: "4.9", l: "Trust • Gas Safe" },
                      { v: "£150", l: "Avg • Escrow Secured" },
                      { v: "123456", l: "Gas Safe • Verified" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-[14px] bg-white/[0.03] border border-white/[0.06] p-4">
                        <div className="font-[Poppins] text-[24px] leading-none">{s.v}</div>
                        <div className="mono mt-1 text-[9px] tracking-[0.08em] text-white/40 uppercase leading-[1.3]">{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[18px] bg-gradient-to-br from-[#8FFF4A] via-[#00E5C0] to-[#FFE600] p-[1px]">
                  <div className="rounded-[17px] bg-[#0A0A0A] p-4 flex items-center gap-3">
                    <img src={mLogoBlack} alt="M" className="h-10 w-10 rounded-[12px] object-cover" />
                    <div className="flex-1">
                      <div className="mono text-[10px] tracking-[0.12em] text-white/40 uppercase">Verified Plumber</div>
                      <div className="text-[14px] font-semibold">J Martin • Heating • Gas Safe 123456</div>
                    </div>
                    <span className="mono rounded-full bg-[#8FFF4A] px-3 py-1 text-[11px] font-bold text-black">BOOK £150</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-[32px] border border-white/10 bg-[#0E0E0E] p-2 md:p-3">
              <div className="rounded-[24px] overflow-hidden bg-[#101010] border border-white/[0.05]">
                <div className="relative aspect-[4/3] md:aspect-[16/10] bg-black">
                  <img src={heroPlumber} alt="Boiler fix Worcester Bosch 68C Central Heating Pressure 1.2 bar" className="absolute inset-0 h-full w-full object-cover" />

                  {/* Toggle */}
                  <div className="absolute left-4 top-4 flex rounded-full bg-black/60 backdrop-blur border border-white/10 p-1">
                    <button
                      onClick={() => setActiveImage("fix")}
                      className={`mono rounded-full px-3 py-1.5 text-[10px] tracking-[0.08em] transition ${activeImage === "fix" ? "bg-white text-black" : "text-white/60"}`}
                    >
                      FIX • 68C FLOW
                    </button>
                    <button
                      onClick={() => setActiveImage("check")}
                      className={`mono rounded-full px-3 py-1.5 text-[10px] tracking-[0.08em] transition ${activeImage === "check" ? "bg-white text-black" : "text-white/60"}`}
                    >
                      CHECK • SAFETY
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[16px] glass-strong p-4">
                      <div className="flex items-center justify-between">
                        <span className="mono text-[10px] tracking-[0.12em] text-white/40 uppercase">Clipboard • Gas Safe Report</span>
                        <span className="mono text-[10px] rounded-full bg-[#8FFF4A] px-2 py-0.5 font-bold text-black">PASS</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-[12px]"><span className="text-white/50">Pressure</span><span className="font-semibold">1.2 bar • OK</span></div>
                        <div className="flex justify-between text-[12px]"><span className="text-white/50">Leaks</span><span className="font-semibold">None</span></div>
                        <div className="flex justify-between text-[12px]"><span className="text-white/50">Flue</span><span className="font-semibold">Secure</span></div>
                        <div className="flex justify-between text-[12px]"><span className="text-white/50">Gas tightness</span><span className="font-semibold">Pass • 123456</span></div>
                      </div>
                    </div>
                    <div className="rounded-[16px] bg-white p-4 text-black">
                      <div className="mono text-[9px] tracking-[0.12em] text-black/50 uppercase">Worcester Bosch</div>
                      <div className="mt-1 font-[Poppins] text-[16px] leading-tight">Greenstar 30i • Central Heating • 68C Flow • Oldham OL1</div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-black grid place-items-center text-white text-[10px]">✓</div>
                        <span className="mono text-[10px] font-bold tracking-[0.04em]">GAS SAFE 123456 • ESCROW £150</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#0A0A0A]">
                  <div className="p-5">
                    <div className="mono text-[10px] tracking-[0.12em] text-white/40 uppercase">Customer</div>
                    <div className="mt-2 text-[14px] leading-[1.4]">“Boiler kept dropping to 0.4 bar. J fixed PRV, topped inhibitor, showed pressure 1.2 bar live.”</div>
                    <div className="mt-3 mono text-[10px] text-white/30">Oldham • 0.8mi • Booked £150</div>
                  </div>
                  <div className="p-5">
                    <div className="mono text-[10px] tracking-[0.12em] text-white/40 uppercase">Materials</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {["Worcester Bosch", "PRV Kit", "Inhibitor", "1.2 bar", "Flue clip", "Tightness test"].map((m) => (
                        <span key={m} className="mono rounded-full bg-white/[0.06] border border-white/10 px-2 py-1 text-[10px]">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mono text-[10px] tracking-[0.12em] text-white/40 uppercase">Trust Ledger</div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="font-[Poppins] text-[22px]">4.9</span>
                      <span className="mono text-[11px] text-white/60">76 reviews • Safety-first • Touch of GOD</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden flex">
                      <div className="h-full w-[92%] bg-gradient-to-r from-[#8FFF4A] to-[#00E5C0]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section id="join" className="relative overflow-hidden border-t border-white/[0.06] bg-[#FFFDF7]">
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-[-30%] h-[120%] w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(143,255,74,0.14),transparent_60%)] blur-[20px]" />

        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 py-16 md:py-24">
          <div className="rounded-[32px] border border-white/10 bg-[#0A0A0A] overflow-hidden">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-0">
              <div className="p-8 md:p-12">
                <div className="mono inline-flex rounded-full border border-[#8FFF4A]/20 bg-[#8FFF4A]/10 px-3 py-1 text-[10px] tracking-[0.14em] text-[#8FFF4A] uppercase">Page 18 of 24 • Join as Plumber • Oldham Plumbers Are Waiting</div>
                <h2 className="mt-6 text-[32px] md:text-[56px] leading-[0.9] tracking-[-0.03em]">
                  <span className="block text-white">Join as Plumber —</span>
                  <span className="block text-gradient-m">Start Showing Free —</span>
                  <span className="block text-white/40">Oldham Plumbers Are Waiting</span>
                </h2>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black text-white text-[12px]"></div>
                    <div className="leading-none text-black">
                      <div className="mono text-[8px] tracking-[0.08em]">Download on the</div>
                      <div className="font-[Poppins] text-[13px] font-bold leading-none">App Store</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2">
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-black text-white text-[10px]">▶</div>
                    <div className="leading-none text-black">
                      <div className="mono text-[8px] tracking-[0.08em]">GET IT ON</div>
                      <div className="font-[Poppins] text-[13px] font-bold leading-none">Google Play</div>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
                    <span className="mono text-[10px] tracking-[0.12em] text-white/60 uppercase">Stats • 76 plumbers 4.9 Trust £150 avg Gas Safe Touch of GOD in Every Pipe</span>
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-3 max-w-[420px] gap-4 border-t border-white/10 pt-6">
                  <div>
                    <div className="font-[Poppins] text-[24px] leading-none">76</div>
                    <div className="mono mt-1 text-[9px] tracking-[0.12em] text-white/40 uppercase">Oldham Plumbers</div>
                  </div>
                  <div>
                    <div className="font-[Poppins] text-[24px] leading-none">4.9 Trust</div>
                    <div className="mono mt-1 text-[9px] tracking-[0.12em] text-white/40 uppercase">Gas Safe • Safety</div>
                  </div>
                  <div>
                    <div className="font-[Poppins] text-[24px] leading-none">£150 avg</div>
                    <div className="mono mt-1 text-[9px] tracking-[0.12em] text-white/40 uppercase">Escrow • Touch of GOD</div>
                  </div>
                </div>
              </div>

              {/* Join form - uses persistence */}
              <div className="border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0F0F0F] p-8 md:p-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-[Poppins] text-[20px] leading-none">Start Showing Free</h3>
                  <span className="mono rounded-full bg-[#8FFF4A] px-2.5 py-1 text-[10px] font-bold text-black">OLDHAM QUEUE</span>
                </div>
                <p className="mt-3 text-[13px] leading-[1.5] text-white/50">Verify Gas Safe 123456, add one boiler fix (Worcester Bosch 68C, Pressure 1.2 bar). We surface you 0.8mi from customers searching Oldham.</p>

                <form onSubmit={handleJoin} className="mt-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="mono text-[9px] tracking-[0.12em] text-white/40 uppercase">Name • J Martin Plumbing</div>
                      <input value={leadForm.name} onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })} placeholder="J Martin Plumbing" className="mt-1 w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-white/20" />
                    </div>
                    <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="mono text-[9px] tracking-[0.12em] text-white/40 uppercase">Gas Safe ID • 123456</div>
                      <input value={leadForm.gasSafe} onChange={(e) => setLeadForm({ ...leadForm, gasSafe: e.target.value })} placeholder="123456" className="mt-1 w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-white/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="mono text-[9px] tracking-[0.12em] text-white/40 uppercase">Town • Oldham</div>
                      <input value={leadForm.town} onChange={(e) => setLeadForm({ ...leadForm, town: e.target.value })} placeholder="Oldham" className="mt-1 w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-white/20" />
                    </div>
                    <div className="rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div className="mono text-[9px] tracking-[0.12em] text-white/40 uppercase">Phone • Escrow alerts</div>
                      <input value={leadForm.phone} onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })} placeholder="07..." className="mt-1 w-full bg-transparent text-[14px] font-medium outline-none placeholder:text-white/20" />
                    </div>
                  </div>

                  <button disabled={saving} className="mt-2 flex h-[48px] w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] to-[#FFE600] text-[14px] font-bold text-black transition hover:scale-[1.01] disabled:opacity-60">
                    {saving ? "Verifying Gas Safe..." : "Join as Plumber - Verify 123456"}
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-white text-[12px] font-bold">+</span>
                  </button>

                  {saveMsg && <div className="rounded-[12px] bg-white/[0.04] border border-white/10 px-4 py-3 mono text-[11px] leading-[1.4] text-white/70">{saveMsg}</div>}

                  <div className="flex items-center gap-2 pt-2">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="mono text-[9px] tracking-[0.14em] text-white/30 uppercase">Live Oldham Queue • {leads.length} Waiting</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="max-h-[132px] overflow-auto space-y-2 pr-1">
                    {leads.slice(0, 8).map((l) => (
                      <div key={l.id} className="flex items-center justify-between rounded-[12px] border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-white/10 grid place-items-center text-[10px]">{l.value.name.charAt(0)}</div>
                          <div>
                            <div className="text-[12px] font-medium leading-none">{l.value.name}</div>
                            <div className="mono text-[9px] text-white/40">Gas Safe {l.value.gasSafe} • {l.value.town}</div>
                          </div>
                        </div>
                        <span className="mono text-[9px] rounded-full bg-[#8FFF4A]/15 border border-[#8FFF4A]/20 px-2 py-0.5 text-[#8FFF4A]">QUEUED</span>
                      </div>
                    ))}
                    {leads.length === 0 && <div className="mono text-[11px] text-white/30 py-3 text-center">No queue yet — be first in Oldham • Touch of GOD verification in 2h</div>}
                  </div>
                </form>

                <div className="mt-6 rounded-[14px] border border-white/10 bg-[#080808] p-3 flex gap-3">
                  <img src={mLogoWhite} alt="M logo white" className="h-9 w-9 rounded-[10px] object-cover" />
                  <div className="mono text-[10px] leading-[1.4] text-white/50">
                    <span className="text-white">Badge Page 18 of 24</span> • For Plumbers Standalone LP SEO Oldham Touch of GOD • Holy plumber feel — divine glow, rounded 24px, glass overlays.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-[10px] overflow-hidden bg-white">
                <img src={mLogoBlack} alt="M" className="h-full w-full object-contain" />
              </div>
              <span className="mono text-[11px] tracking-[0.12em] text-white/40 uppercase">My Face Profile • Page 18 of 24 • For Plumbers • © 2026 • Touch of GOD • Oldham • Boiler • Heating • Gas Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="mono rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] text-white/40">Escrow Secured</span>
              <span className="mono rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] text-white/40">76 plumbers • 4.9 Trust • £150 avg</span>
            </div>
          </div>
        </div>
      </section>

      {/* Global style for divine glow */}
      <style>{`
        @media (max-width: 390px){
          h1{ font-size:34px !important; }
        }
      `}</style>
    </div>
  );
}
