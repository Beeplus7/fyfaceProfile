import React, { useEffect, useMemo, useState } from "react";

// Types
type EngineRow = {
  id: string;
  name: string;
  status: string;
  gross: number;
  feePct: number;
  capTxn: number;
  capDay: number;
  color: string;
  kind: "offerwall" | "lead" | "affiliate" | "survey" | "media" | "pow";
};

const DEFAULT_ENGINES: EngineRow[] = [
  { id: "adgate", name: "AdGate", status: "Registry ready, awaitingCredentials", gross: 0.80, feePct: 40, capTxn: 2, capDay: 20, color: "#8FFF4A", kind: "offerwall" },
  { id: "offerwall", name: "Offerwall", status: "Awaiting creds", gross: 1.20, feePct: 40, capTxn: 2, capDay: 20, color: "#00E5CF", kind: "offerwall" },
  { id: "tapjoy", name: "TapJoy", status: "Pattern live (needs TAPJOY_SECRET)", gross: 0.50, feePct: 30, capTxn: 2, capDay: 25, color: "#1A7CFF", kind: "offerwall" },
  { id: "pollfish", name: "Pollfish", status: "Legacy survey path", gross: 0.30, feePct: 40, capTxn: 0.8, capDay: 5, color: "#FFE600", kind: "survey" },
  { id: "leadgen", name: "Lead Gen", status: "Awaiting creds", gross: 3.00, feePct: 30, capTxn: 5, capDay: 50, color: "#FF8A00", kind: "lead" },
  { id: "affiliate", name: "Affiliate", status: "Awaiting creds", gross: 8.00, feePct: 30, capTxn: 10, capDay: 100, color: "#FF5C00", kind: "affiliate" },
  { id: "gmedia", name: "Google Media", status: "External — not in VisaGuide repo", gross: 0.02, feePct: 50, capTxn: 2, capDay: 20, color: "#9B8CFF", kind: "media" },
  { id: "gamepad", name: "Game Pad", status: "Local PoW taps — not webhook", gross: 0, feePct: 0, capTxn: 0, capDay: 0, color: "#FFFFFF", kind: "pow" },
];

const GIFT_CATALOG = [
  { name: "Hammer", mfc: 100, emoji: "🔨", value: 0.083 },
  { name: "Scissors", mfc: 300, emoji: "✂️", value: 0.25 },
  { name: "Heart", mfc: 250, emoji: "💜", value: 0.208 },
  { name: "Crown", mfc: 800, emoji: "👑", value: 0.666 },
  { name: "Trophy", mfc: 2000, emoji: "🏆", value: 1.666 },
  { name: "Boost", mfc: 5000, emoji: "🚀", value: 4.166 },
];

/** Interactive AdGate → MFC offer scorecard (from Myface+Ad+Revenue+Coin.tar.gz). */
export default function AdRevenueScorecard({ embedded = false }: { embedded?: boolean }) {
  // Anchor state
  const [anchorGBP, setAnchorGBP] = useState<number>(39);
  const [anchorMFC, setAnchorMFC] = useState<number>(45000);
  const [mfcPerGBP, setMfcPerGBP] = useState<number>(1200);
  const [useExactVisa, setUseExactVisa] = useState(false);

  // Engines editable
  const [engines, setEngines] = useState<EngineRow[]>(DEFAULT_ENGINES);
  const [powRate, setPowRate] = useState<number>(10); // taps per MFC

  // What-if simulator
  const [simGross, setSimGross] = useState(0.8);
  const [simFee, setSimFee] = useState(40);
  const [simRate, setSimRate] = useState(1200);

  // Notes + persistence
  const [notes, setNotes] = useState("");
  const [savedLogs, setSavedLogs] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<string>("");

  // derived
  const exactVGCPerGBP = 45000 / 39; // 1153.846...
  const calcMFCPerGBP = useMemo(() => {
    if (useExactVisa) return exactVGCPerGBP;
    if (anchorGBP > 0) return anchorMFC / anchorGBP;
    return mfcPerGBP;
  }, [anchorMFC, anchorGBP, useExactVisa, mfcPerGBP, exactVGCPerGBP]);

  useEffect(() => {
    if (!useExactVisa) {
      // if anchor edited, keep mfcPerGBP in sync for display but allow manual override
      // we don't auto overwrite mfcPerGBP slider, only calcMFCPerGBP is source of truth
    }
  }, [anchorMFC, anchorGBP]);

  // Load logs
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("actions", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "records.list", args: { collection: "closure_logs" } }),
        });
        const j = await res.json();
        if (j.data) setSavedLogs(j.data.records || []);
      } catch {}
    };
    load();
  }, []);

  const handleSaveNote = async () => {
    if (!notes.trim()) return;
    setSaveStatus("Saving…");
    try {
      const res = await fetch("actions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "records.create",
          args: {
            collection: "closure_logs",
            value: {
              text: notes,
              anchorGBP,
              anchorMFC,
              mfcPerGBP: calcMFCPerGBP,
              engines: engines.map((e) => ({ id: e.id, gross: e.gross, fee: e.feePct, capTxn: e.capTxn, capDay: e.capDay })),
              created_at_text: new Date().toISOString(),
            },
          },
        }),
      });
      const j = await res.json();
      if (j.error) throw new Error(j.error);
      setSaveStatus("Saved ✓");
      setSavedLogs((prev) => [...prev, j.data]);
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (e: any) {
      setSaveStatus("Error: " + (e?.message || "failed"));
    }
  };

  const updateEngine = (id: string, field: keyof EngineRow, value: number) => {
    setEngines((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  // Calculations
  const computed = useMemo(() => {
    return engines.map((e) => {
      if (e.kind === "pow") {
        const mfcPerTap = 1 / powRate;
        return {
          ...e,
          userShare: 0,
          raw: 0,
          final: 0,
          dailyMax: 0,
          dailyTotal: 0,
          capped: false,
          mfcPerTap,
        };
      }
      const userShare = e.gross * (1 - e.feePct / 100);
      const raw = Math.ceil(userShare * calcMFCPerGBP);
      const isCapped = userShare > e.capTxn;
      const finalShare = isCapped ? e.capTxn : userShare;
      const final = Math.ceil(finalShare * calcMFCPerGBP);
      const dailyMax = userShare > 0 ? Math.floor(e.capDay / userShare) : 0;
      const dailyTotal = dailyMax * final;
      return { ...e, userShare, raw, final, dailyMax, dailyTotal, capped: isCapped, mfcPerTap: 0 };
    });
  }, [engines, calcMFCPerGBP, powRate]);

  const totals = useMemo(() => {
    const sumDaily = computed.reduce((a, c) => a + (c.dailyTotal || 0), 0);
    const sumUses = computed.reduce((a, c) => a + (c.dailyMax || 0), 0);
    return { sumDaily, sumUses };
  }, [computed]);

  const simResult = useMemo(() => {
    const userShare = simGross * (1 - simFee / 100);
    const coins = Math.ceil(userShare * simRate);
    const hammers = (coins / 100).toFixed(1);
    const hearts = (coins / 250).toFixed(1);
    return { userShare, coins, hammers, hearts };
  }, [simGross, simFee, simRate]);

  const exportJSON = () => {
    const payload = {
      version: "myface_scorecard_v1",
      anchor: { gbp: anchorGBP, mfc: anchorMFC, mfc_per_gbp: calcMFCPerGBP, vgc_per_gbp_reference: exactVGCPerGBP },
      engines: computed.map((c) => ({
        engine: c.name,
        status: c.status,
        gross_gbp: c.gross,
        platform_fee_pct: c.feePct,
        user_share_gbp: Number((c as any).userShare?.toFixed(4) || 0),
        cap_txn_gbp: c.capTxn,
        cap_day_gbp: c.capDay,
        coins_raw: (c as any).raw,
        coins_final: (c as any).final,
        capped: (c as any).capped,
        daily_max_uses: (c as any).dailyMax,
        daily_max_mfc: (c as any).dailyTotal,
      })),
      totals: { total_mfc_per_day_max: totals.sumDaily, total_uses_per_day: totals.sumUses, estimated_gbp_value_user: Number((totals.sumDaily / calcMFCPerGBP).toFixed(2)) },
      recommendation: {
        anchor_mirror: "£39 = 45000 MFC (MFC_PER_GBP 1153.85, market 1200)",
        platform_share: "40% offerwall, 30% lead/affiliate, 50% Google Media",
        caps: "Keep VisaGuide caps v1",
        spend_only: "MFC never cash-out — gifts/boost only",
        anti_fraud: "rate limit + PoW + device fingerprint + email verified",
      },
      gift_catalog: GIFT_CATALOG,
      timestamp: new Date().toISOString(),
      notes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `myface_scorecard_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      data-safe-area-inset-root
      style={{
        boxSizing: "border-box",
        paddingTop: embedded ? 0 : "var(--safe-area-inset-top)",
        minHeight: embedded ? undefined : "100vh",
        background: "var(--bg)",
      }}
      className="overflow-x-clip"
    >
      {/* Header — hidden when embedded under ProductTopNav (VisaGuide-style single chrome) */}
      {!embedded ? (
      <div className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl" data-safe-area-sticky-top style={{ top: "var(--safe-area-inset-top)", background: "rgba(5,5,5,0.85)" }}>
        <div className="mx-auto max-w-[1280px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl m-gradient grid place-items-center font-display text-black text-[18px]">M</div>
            <div>
              <div className="font-display text-[13px] tracking-[0.12em] text-white/90">MYFACE</div>
              <div className="font-mono text-[10px] text-white/40 -mt-1">AD REVENUE ECONOMICS</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="h-7 px-3 rounded-full glass text-[11px] font-mono text-white/60 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" /> LIVE CALCULATOR
            </div>
            <button onClick={exportJSON} className="h-9 px-5 rounded-full bg-white text-black font-mono text-[11px] font-semibold hover:bg-white/90 transition">EXPORT JSON</button>
          </div>
        </div>
      </div>
      ) : (
        <div className="mx-auto max-w-[1280px] px-6 pt-4 flex justify-end">
          <button onClick={exportJSON} className="h-9 px-5 rounded-full bg-white text-black font-mono text-[11px] font-semibold hover:bg-white/90 transition">EXPORT JSON</button>
        </div>
      )}

      {/* Hero */}
      <div className="mx-auto max-w-[1280px] px-6 pt-12 pb-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-[11px] font-mono text-white/70">
              <span className="px-2 py-0.5 rounded-full bg-white text-black font-bold">SCAN RESULT</span> NO ADGATE REVENUE ECONOMICS SCORECARD IN VISAGUIDE
            </div>
            <h1 className="font-display text-[44px] md:text-[64px] leading-[0.9] mt-6">
              MyFace Ad Revenue
              <br />
              <span className="m-gradient bg-clip-text text-transparent">Economics Scorecard</span>
            </h1>
            <p className="mt-5 text-[16px] leading-7 text-white/60 max-w-[560px]">
              VisaGuide gave us coin wiring + caps + readiness. No spreadsheet for eCPM / Google Media / share % for what to offer users. This builds that missing scorecard — maps VisaGuide's 45k = £39 anchor to MyFace Gift Arcade MFC offers.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { label: "Investigation Done", done: true },
                { label: "Wiring Mapped", done: true },
                { label: "Caps Mapped", done: true },
                { label: "No Scorecard Found", done: true, warn: true },
                { label: "Calculator Built", done: true },
                { label: "MyFace Anchor Set", done: false },
                { label: "Proposal Ready", done: false },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 rounded-full glass px-3.5 py-2">
                  <div className={`h-5 w-5 rounded-full grid place-items-center ${s.done ? "bg-[#8FFF4A] text-black" : "bg-white/10 text-white/30"} ${s.warn ? "!bg-[#FFE600]" : ""}`}>
                    <span className="text-[11px] font-bold">{s.done ? "✓" : "○"}</span>
                  </div>
                  <span className="font-mono text-[11px] text-white/70">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Canonical rate card */}
          <div className="glass-strong rounded-[24px] p-6 md:p-7 m-gradient-border">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">SECTION 1 — WHAT VISAGUIDE ACTUALLY HAS</div>
              <div className="h-6 px-2.5 rounded-full bg-[#FFE600] text-black font-mono text-[10px] font-bold grid place-items-center">NO SCORECARD</div>
            </div>
            <div className="mt-5 grid gap-3">
              <div className="rounded-[16px] bg-white/[0.04] border border-white/10 p-4">
                <div className="font-mono text-[10px] text-white/40 tracking-widest">CANONICAL COIN RATE — engineRegistry.ts + power_tap_pricing</div>
                <div className="mt-3 grid grid-cols-[120px_1fr] gap-y-3 font-mono text-[13px]">
                  <span className="text-white/40">Anchor</span> <span className="text-white">45,000 VGC = £39 (Journey)</span>
                  <span className="text-white/40">VGC_PER_GBP</span> <span className="text-white">45000 / 39 ≈ 1,153.85 VGC per £1</span>
                  <span className="text-white/40">Credit formula</span> <span className="text-[#8FFF4A]">ceil(partner_payout_gbp × 45000/39)</span>
                </div>
                <div className="mt-4 rounded-xl bg-[#050505] border border-white/10 p-3 font-mono text-[11px] leading-5 text-white/60">
                  Webhook path: partner sends payout → parse to GBP → clamp to per-txn + daily caps → credit that full GBP as VGC at rate above. There is <span className="text-white font-bold">NO</span> coded "user gets X% of AdGate net" cut — margin not expressed as share rate in code.
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[14px] bg-white/[0.03] border border-white/10 p-3">
                  <div className="font-mono text-[10px] text-white/30">ANCHOR VALUE</div>
                  <div className="font-display text-[20px] mt-1">£39</div>
                  <div className="font-mono text-[11px] text-white/40">= 45k VGC</div>
                </div>
                <div className="rounded-[14px] bg-white/[0.03] border border-white/10 p-3">
                  <div className="font-mono text-[10px] text-white/30">VGC_PER_GBP</div>
                  <div className="font-display text-[20px] mt-1">1,153.85</div>
                  <div className="font-mono text-[11px] text-white/40">ceil() wiring</div>
                </div>
                <div className="rounded-[14px] bg-[#8FFF4A] text-black p-3">
                  <div className="font-mono text-[10px] text-black/60">MYFACE TWIN</div>
                  <div className="font-display text-[20px] mt-1">{Math.round(calcMFCPerGBP)}</div>
                  <div className="font-mono text-[11px] text-black/60">MFC / £1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <div className="glass rounded-[24px] p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-[22px]">5 aggregators + Game Pad — What's actually wired</h2>
              <p className="font-mono text-[11px] text-white/40 mt-1">20260926220000_power_tap_tapjoy_five_aggregators.sql + engineRegistry.ts</p>
            </div>
            <div className="font-mono text-[10px] text-white/40 max-w-[420px]">Admin UI AggregatorSecurityShield.tsx talks about same 5 aggregators + Game Pad (AdGate · Offerwall · Lead · Affil · Game Pad). Numbers there (+2k / 15k VGC) look like demo shield counters, not revenue model. "Google Media" does not appear as engine name in VisaGuide repo.</div>
          </div>
          <div className="mt-6 overflow-x-auto scrollbar-hide rounded-[16px] border border-white/10">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="bg-white/[0.04] font-mono text-[10px] tracking-widest text-white/40">
                  <th className="px-4 py-3 font-medium">ENGINE</th>
                  <th className="px-4 py-3 font-medium">STATUS IN REPO</th>
                  <th className="px-4 py-3 font-medium">CAP / TXN</th>
                  <th className="px-4 py-3 font-medium">CAP / DAY / USER</th>
                  <th className="px-4 py-3 font-medium">COLOR</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {DEFAULT_ENGINES.map((r) => (
                  <tr key={r.id} className="border-t border-white/10 hover:bg-white/[0.02]">
                    <td className="px-4 py-3.5 font-semibold text-white">{r.name}</td>
                    <td className="px-4 py-3.5 text-white/60 text-[12px]">{r.status}</td>
                    <td className="px-4 py-3.5"><span className="px-2 py-1 rounded-full bg-white/10 text-white">{r.capTxn ? `£${r.capTxn}` : "n/a"}</span></td>
                    <td className="px-4 py-3.5"><span className="px-2 py-1 rounded-full bg-white/10 text-white">{r.capDay ? `£${r.capDay}` : "rate/PoW"}</span></td>
                    <td className="px-4 py-3.5"><span className="h-3 w-3 rounded-full inline-block" style={{ background: r.color }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 3 MyFace Twin Anchor */}
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-6">
          <div className="glass rounded-[24px] p-6 md:p-8 m-gradient-border">
            <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">SECTION 3 — MYFACE TWIN ANCHOR — DEFINE MFC_PER_GBP</div>
            <h3 className="font-display text-[26px] mt-3 leading-[1.05]">Mirror VisaGuide Journey<br />with Gift Arcade</h3>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-white/40">ANCHOR £ PRICE</label>
                <div className="flex items-center gap-2 rounded-[14px] bg-[#0A0A0A] border border-white/15 px-4 h-[48px]">
                  <span className="font-mono text-white/30">£</span>
                  <input type="number" value={anchorGBP} onChange={(e) => setAnchorGBP(Number(e.target.value))} className="bg-transparent w-full outline-none font-mono text-[16px] text-white" />
                </div>
                <div className="font-mono text-[11px] text-white/30">VisaGuide: £39 Journey</div>
              </div>
              <div className="space-y-3">
                <label className="font-mono text-[10px] text-white/40">ANCHOR MFC AMOUNT</label>
                <div className="flex items-center gap-2 rounded-[14px] bg-[#0A0A0A] border border-white/15 px-4 h-[48px]">
                  <input type="number" value={anchorMFC} onChange={(e) => setAnchorMFC(Number(e.target.value))} className="bg-transparent w-full outline-none font-mono text-[16px] text-white" />
                  <span className="font-mono text-white/30">MFC</span>
                </div>
                <div className="font-mono text-[11px] text-white/30">Starter packs example</div>
              </div>
            </div>

            <div className="mt-6 rounded-[16px] bg-[#050505] border border-white/10 p-4">
              <div className="font-mono text-[10px] text-white/30">FORMULA</div>
              <div className="font-mono text-[13px] mt-1 text-white">MFC_PER_GBP = anchor_MFC / anchor_GBP</div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-display text-[36px]">{calcMFCPerGBP.toFixed(2)}</div>
                <div className="font-mono text-[12px] text-white/40">MFC per £1 — {useExactVisa ? "Exact VisaGuide" : "MyFace anchor"}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setUseExactVisa(!useExactVisa)} className={`h-8 px-3 rounded-full font-mono text-[11px] border ${useExactVisa ? "bg-white text-black border-white" : "bg-white/10 border-white/15 text-white/70"}`}>{useExactVisa ? "Using 1153.85 exact" : "Use Visa exact 1153.85"}</button>
                <button onClick={() => { setAnchorGBP(39); setAnchorMFC(45000); setUseExactVisa(false); setMfcPerGBP(1200); }} className="h-8 px-3 rounded-full bg-white/10 border border-white/15 font-mono text-[11px] text-white/70">Reset to Journey</button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Starter", gbp: 4.99, mfc: 5000, rate: (5000 / 4.99).toFixed(0) },
                { label: "Creator", gbp: 14.99, mfc: 18000, rate: (18000 / 14.99).toFixed(0) },
                { label: "Hero", gbp: 39, mfc: 50000, rate: (50000 / 39).toFixed(0) },
              ].map((p) => (
                <button key={p.label} onClick={() => { setAnchorGBP(p.gbp); setAnchorMFC(p.mfc); setUseExactVisa(false); }} className="rounded-[14px] bg-white/[0.04] border border-white/10 p-3 text-left hover:bg-white/[0.07] transition">
                  <div className="font-mono text-[10px] text-white/40">{p.label} £{p.gbp}</div>
                  <div className="font-display text-[14px] mt-1">{p.mfc.toLocaleString()} MFC</div>
                  <div className="font-mono text-[11px] text-[#8FFF4A] mt-1">{p.rate} / £</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass rounded-[24px] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">GIFT PRICE REFERENCE — ANCHOR MAPPING</div>
              <div className="font-mono text-[10px] text-white/30">1 MFC ≈ £{(1 / calcMFCPerGBP).toFixed(4)}</div>
            </div>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
              {GIFT_CATALOG.map((g) => (
                <div key={g.name} className="rounded-[16px] bg-[#0F0F0F] border border-white/10 p-4">
                  <div className="text-[22px]">{g.emoji}</div>
                  <div className="font-display text-[15px] mt-2">{g.name}</div>
                  <div className="font-mono text-[12px] text-white/60 mt-1">{g.mfc} MFC</div>
                  <div className="font-mono text-[11px] text-white/30">£{(g.mfc / calcMFCPerGBP).toFixed(3)} user value</div>
                  <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full m-gradient" style={{ width: `${Math.min(100, (g.mfc / 5000) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[14px] bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 p-3 font-mono text-[11px] text-white/60">
              <span className="text-[#8FFF4A] font-bold">Spend-only:</span> MFC never cash-out — only gifts/boost/shop tips — So high coin offers feel generous, no cash liability.
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="font-mono text-[10px] text-white/40">CUSTOM MFC_PER_GBP SLIDER</label>
              <input type="range" min={800} max={1500} value={mfcPerGBP} onChange={(e) => setMfcPerGBP(Number(e.target.value))} className="flex-1" />
              <span className="font-mono text-[12px] text-white">{mfcPerGBP}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4 Interactive Calculator */}
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <div className="glass-strong rounded-[24px] p-6 md:p-8 m-gradient-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">SECTION 4 — INTERACTIVE CALCULATOR — THE MISSING SCORECARD</div>
              <h2 className="font-display text-[28px] mt-2">VisaGuide rule → MyFace offers</h2>
              <div className="font-mono text-[12px] text-white/50 mt-2">Coins offered = ceil(£ you keep as "user-facing value" × {calcMFCPerGBP.toFixed(2)}) then hard-capped by engine max txn / day</div>
            </div>
            <div className="rounded-full bg-white text-black px-4 py-2 font-mono text-[11px] font-bold">LIVE CALC • {Math.round(calcMFCPerGBP)} MFC/£</div>
          </div>

          {/* Desktop table */}
          <div className="mt-6 hidden lg:block overflow-x-auto scrollbar-hide rounded-[16px] border border-white/10">
            <table className="w-full min-w-[1080px] text-left">
              <thead>
                <tr className="bg-white/[0.06] font-mono text-[10px] tracking-widest text-white/40">
                  <th className="px-3 py-3 font-medium">ENGINE</th>
                  <th className="px-3 py-3 font-medium">GROSS £</th>
                  <th className="px-3 py-3 font-medium">FEE %</th>
                  <th className="px-3 py-3 font-medium">USER SHARE £</th>
                  <th className="px-3 py-3 font-medium">CAP TXN £</th>
                  <th className="px-3 py-3 font-medium">COINS RAW</th>
                  <th className="px-3 py-3 font-medium">COINS FINAL</th>
                  <th className="px-3 py-3 font-medium">DAILY MAX</th>
                  <th className="px-3 py-3 font-medium">DAILY MFC</th>
                </tr>
              </thead>
              <tbody>
                {computed.map((c) => (
                  <tr key={c.id} className="border-t border-white/10 font-mono text-[13px] hover:bg-white/[0.03]">
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                        <span className="font-semibold text-white">{c.name}</span>
                      </div>
                      <div className="text-[10px] text-white/30 mt-1">{c.status.slice(0, 28)}</div>
                    </td>
                    <td className="px-3 py-3.5">
                      {c.kind !== "pow" ? (
                        <input type="number" step="0.01" value={engines.find((e) => e.id === c.id)?.gross} onChange={(e) => updateEngine(c.id, "gross", Number(e.target.value))} className="w-[70px] rounded-[8px] bg-[#0A0A0A] border border-white/15 px-2 py-1.5 text-white outline-none" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      {c.kind !== "pow" ? (
                        <input type="number" value={engines.find((e) => e.id === c.id)?.feePct} onChange={(e) => updateEngine(c.id, "feePct", Number(e.target.value))} className="w-[56px] rounded-[8px] bg-[#0A0A0A] border border-white/15 px-2 py-1.5 text-white outline-none" />
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-white/80">£{c.kind === "pow" ? "0.00" : (c as any).userShare?.toFixed(3)}</td>
                    <td className="px-3 py-3.5">
                      {c.kind !== "pow" ? (
                        <div className="flex items-center gap-1">
                          <input type="number" step="0.1" value={engines.find((e) => e.id === c.id)?.capTxn} onChange={(e) => updateEngine(c.id, "capTxn", Number(e.target.value))} className="w-[56px] rounded-[8px] bg-[#0A0A0A] border border-white/15 px-2 py-1.5 text-white outline-none" />
                          {(c as any).capped && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFE600] text-black font-bold">CAP</span>}
                        </div>
                      ) : (
                        <span className="text-white/30">n/a</span>
                      )}
                    </td>
                    <td className="px-3 py-3.5"><span className="text-white/60">{c.kind !== "pow" ? `${(c as any).raw} MFC` : "-"}</span></td>
                    <td className="px-3 py-3.5"><span className={`px-2 py-1 rounded-full font-bold ${ (c as any).capped ? "bg-[#FFE600] text-black" : "bg-white text-black"}`}>{c.kind !== "pow" ? `${(c as any).final}` : `${(1 / powRate).toFixed(2)}/tap`}</span></td>
                    <td className="px-3 py-3.5 text-white/60">{c.kind !== "pow" ? `${(c as any).dailyMax} uses` : `${Math.floor(1000 / powRate)}k taps`}</td>
                    <td className="px-3 py-3.5 text-white font-semibold">{c.kind !== "pow" ? `${(c as any).dailyTotal.toLocaleString()}` : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden mt-6 grid gap-3">
            {computed.map((c) => (
              <div key={c.id} className="rounded-[18px] bg-[#101010] border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c.color }} /><span className="font-display text-[15px]">{c.name}</span></div>
                  <span className={`px-2 py-1 rounded-full font-mono text-[11px] font-bold ${ (c as any).capped ? "bg-[#FFE600] text-black" : "bg-white text-black"}`}>{c.kind !== "pow" ? `${(c as any).final} MFC` : `${(1 / powRate).toFixed(3)}/tap`}</span>
                </div>
                {c.kind !== "pow" ? (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <label className="space-y-1"><span className="font-mono text-[9px] text-white/40">GROSS £</span><input type="number" step="0.01" value={engines.find((e) => e.id === c.id)?.gross} onChange={(e) => updateEngine(c.id, "gross", Number(e.target.value))} className="w-full rounded-[10px] bg-[#0A0A0A] border border-white/10 px-2 py-2 font-mono text-[13px] text-white" /></label>
                    <label className="space-y-1"><span className="font-mono text-[9px] text-white/40">FEE %</span><input type="number" value={engines.find((e) => e.id === c.id)?.feePct} onChange={(e) => updateEngine(c.id, "feePct", Number(e.target.value))} className="w-full rounded-[10px] bg-[#0A0A0A] border border-white/10 px-2 py-2 font-mono text-[13px] text-white" /></label>
                    <label className="space-y-1"><span className="font-mono text-[9px] text-white/40">CAP TXN</span><input type="number" step="0.1" value={engines.find((e) => e.id === c.id)?.capTxn} onChange={(e) => updateEngine(c.id, "capTxn", Number(e.target.value))} className="w-full rounded-[10px] bg-[#0A0A0A] border border-white/10 px-2 py-2 font-mono text-[13px] text-white" /></label>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="font-mono text-[10px] text-white/40">TAPS PER MFC</span>
                    <input type="number" value={powRate} onChange={(e) => setPowRate(Number(e.target.value))} className="w-[80px] rounded-[10px] bg-[#0A0A0A] border border-white/10 px-2 py-2 font-mono text-[13px] text-white" />
                  </div>
                )}
                <div className="mt-3 flex gap-3 font-mono text-[11px] text-white/50">
                  <span>User £{(c as any).userShare?.toFixed(2) || "0"}</span>
                  <span>•</span>
                  <span>{(c as any).dailyMax || 0} max/day</span>
                  <span>•</span>
                  <span className="text-white">{(c as any).dailyTotal?.toLocaleString() || 0} MFC/day</span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 grid md:grid-cols-3 gap-3">
            <div className="rounded-[16px] bg-white text-black p-4 flex items-center justify-between">
              <div><div className="font-mono text-[10px] text-black/50">TOTAL MFC EARNABLE / DAY (NO PAY)</div><div className="font-display text-[24px] mt-1">{totals.sumDaily.toLocaleString()} MFC</div></div>
              <div className="h-10 w-10 rounded-full bg-black text-white grid place-items-center font-mono text-[12px]">MAX</div>
            </div>
            <div className="rounded-[16px] bg-[#0F0F0F] border border-white/10 p-4">
              <div className="font-mono text-[10px] text-white/40">TOTAL USES / DAY</div>
              <div className="font-display text-[24px] mt-1">{totals.sumUses} offers</div>
              <div className="font-mono text-[11px] text-white/30 mt-1">Clamped by £ caps: £20/£20/£25/£5/£50/£100</div>
            </div>
            <div className="rounded-[16px] bg-[#0F0F0F] border border-white/10 p-4">
              <div className="font-mono text-[10px] text-white/40">EST. GBP USER VALUE / DAY</div>
              <div className="font-display text-[24px] mt-1">£{(totals.sumDaily / calcMFCPerGBP).toFixed(2)}</div>
              <div className="font-mono text-[11px] text-white/30 mt-1">Spend-only gift economy — no cash liability</div>
            </div>
          </div>

          {/* One line rule */}
          <div className="mt-6 rounded-[16px] bg-[#050505] border border-white/10 p-4 md:p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="font-mono text-[12px] leading-6 text-white/70"><span className="text-white font-bold">SECTION 5 — ONE LINE RULE:</span> VisaGuide offer rule: <span className="text-[#8FFF4A]">Coins offered = ceil(£ you keep as "user-facing value" × 1153.85) then hard-capped by engine max txn / day.</span> MyFace twin: <span className="text-white">MFC_offer = ceil(user_share_gbp × MFC_PER_GBP)</span> — Example if sheet says net £0.50 to user: ceil(0.50×45000/39)=577 VGC = {Math.ceil(0.5 * calcMFCPerGBP)} MFC</div>
          </div>
        </div>
      </div>

      {/* Section 6 Recommendation */}
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="glass rounded-[24px] p-6 md:p-8">
            <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">SECTION 6 — RECOMMENDATION — MYFACE GIFT ECONOMICS PROPOSAL</div>
            <div className="mt-4 grid gap-4">
              {[
                { t: "Anchor", d: "Use £39 = 45000 MFC to mirror VisaGuide Journey → MFC_PER_GBP = 1153.85 (keep math simple 1200 for marketing)", dot: "#8FFF4A" },
                { t: "Platform share", d: "40% for offerwall engines (AdGate, Offerwall, TapJoy), 30% for high-value Lead/Affiliate (incentivize), 50% for Google Media ad views (low value)", dot: "#00E5CF" },
                { t: "Cap", d: "Keep VisaGuide caps for MyFace v1: £2 txn for AdGate/Offerwall, £2 TapJoy, £0.80 Pollfish, £5 Lead, £10 Affiliate, daily £20/£20/£25/£5/£50/£100 — Prevent farm", dot: "#1A7CFF" },
                { t: "Spend-only", d: "MFC never cash-out — only gifts/boost/shop tips — So high coin offers feel generous, no cash liability", dot: "#FFE600" },
                { t: "Anti-fraud", d: "rate limit + PoW same as VisaGuide + device fingerprint + email verified to earn", dot: "#FF8A00" },
                { t: "Webhook", d: "parse to GBP → clamp → credit full GBP as MFC at rate — Log to mfc_ledger source offerwall_postback", dot: "#FFFFFF" },
              ].map((r) => (
                <div key={r.t} className="flex gap-3 rounded-[14px] bg-white/[0.03] border border-white/10 p-4">
                  <span className="h-2.5 w-2.5 rounded-full mt-1.5 shrink-0" style={{ background: r.dot }} />
                  <div><div className="font-mono text-[12px] font-bold text-white">{r.t}</div><div className="font-mono text-[11px] text-white/60 mt-1 leading-5">{r.d}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass rounded-[24px] p-6 md:p-8">
            <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">CONVERSION FEEL — 1 ADGATE = ?</div>
            <div className="mt-4 rounded-[16px] bg-[#0A0A0A] border border-white/10 p-4">
              <div className="font-mono text-[11px] text-white/40">Example: AdGate 576 MFC</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {GIFT_CATALOG.map((g) => {
                  const count = Math.floor((computed.find((c) => c.id === "adgate") as any)?.final / g.mfc || 576 / g.mfc);
                  return (
                    <div key={g.name} className="flex items-center justify-between rounded-[12px] bg-white/[0.04] border border-white/10 px-3 py-2.5">
                      <span className="font-mono text-[12px] text-white">{g.emoji} {g.name}</span>
                      <span className="font-mono text-[11px] text-[#8FFF4A]">×{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 font-mono text-[11px] text-white/50 leading-5">So one AdGate offer (~576 MFC) = ~5 Hammers or 2 Hearts — Feels rewarding. Trophy needs ~3-4 offers, Boost needs ~8-9 offers.</div>
            </div>
            <div className="mt-4 rounded-[16px] bg-[#8FFF4A] text-black p-4">
              <div className="font-mono text-[10px] font-bold">MYFACE LEDGER SHAPE</div>
              <div className="font-mono text-[11px] mt-2 leading-5">mfc_ledger: id, user_id, source: offerwall_postback | pow | purchase | gift_spend, engine, gross_gbp, fee_pct, user_gbp, mfc_amount, cap_applied boolean, created_at<br />Never store cash-out — gift_spend only reduces balance.</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 7 Simulator */}
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <div className="glass rounded-[24px] p-6 md:p-8 m-gradient-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">SECTION 7 — INTERACTIVE WHAT-IF SIMULATOR</div>
              <h3 className="font-display text-[22px] mt-2">Slide to feel the gift economy</h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-white/40"><span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse" /> Touch of GOD — Production ready</div>
          </div>

          <div className="mt-6 grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between font-mono text-[11px] text-white/50"><span>MFC_PER_GBP (800-1500)</span><span className="text-white font-bold">{simRate}</span></div>
                <input type="range" min={800} max={1500} value={simRate} onChange={(e) => setSimRate(Number(e.target.value))} className="w-full mt-3" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[11px] text-white/50"><span>Platform fee % (20-60%)</span><span className="text-white font-bold">{simFee}%</span></div>
                <input type="range" min={20} max={60} value={simFee} onChange={(e) => setSimFee(Number(e.target.value))} className="w-full mt-3" />
              </div>
              <div>
                <div className="flex justify-between font-mono text-[11px] text-white/50"><span>Gross payout £ (0.01-10)</span><span className="text-white font-bold">£{simGross.toFixed(2)}</span></div>
                <input type="range" min={0.01} max={10} step={0.01} value={simGross} onChange={(e) => setSimGross(Number(e.target.value))} className="w-full mt-3" />
              </div>
              <div className="rounded-[16px] bg-[#050505] border border-white/10 p-4 grid grid-cols-3 gap-4">
                <div><div className="font-mono text-[10px] text-white/30">USER SHARE</div><div className="font-display text-[18px] mt-1">£{simResult.userShare.toFixed(3)}</div></div>
                <div><div className="font-mono text-[10px] text-white/30">MFC OFFER</div><div className="font-display text-[18px] mt-1 text-[#8FFF4A]">{simResult.coins} MFC</div></div>
                <div><div className="font-mono text-[10px] text-white/30">HAMMERS</div><div className="font-display text-[18px] mt-1">×{simResult.hammers}</div></div>
              </div>
            </div>

            <div className="rounded-[18px] bg-[#0A0A0A] border border-white/10 p-5">
              <div className="font-mono text-[11px] text-white/40">VISUAL GIFT CONVERSION</div>
              <div className="mt-4 flex items-end gap-2">
                <div className="flex-1">
                  <div className="font-mono text-[11px] text-white/30">1 AdGate complete = {simResult.hammers} Hammers</div>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: Math.min(12, Math.floor(Number(simResult.hammers)) || 0) }).map((_, i) => (
                      <div key={i} className="h-8 w-8 rounded-[10px] bg-white/[0.06] border border-white/10 grid place-items-center text-[16px]">🔨</div>
                    ))}
                  </div>
                  <div className="mt-4 font-mono text-[11px] text-white/30">{simResult.hearts} Hearts • {Math.floor(simResult.coins / 800)} Crowns • {Math.floor(simResult.coins / 2000)} Trophies</div>
                </div>
              </div>
              <div className="mt-6 h-[84px] rounded-[14px] m-gradient p-[1px]">
                <div className="h-full w-full rounded-[13px] bg-[#0A0A0A] grid place-items-center">
                  <div className="font-display text-[22px]">{simResult.coins} MFC <span className="text-white/30 text-[14px] font-mono">= £{simResult.userShare.toFixed(2)} user value</span></div>
                </div>
              </div>
              <div className="mt-3 font-mono text-[10px] text-white/30">Formula: ceil({simResult.userShare.toFixed(3)} × {simRate}) = {simResult.coins}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 8 Export + Notes */}
      <div className="mx-auto max-w-[1280px] px-6 pb-16">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="glass rounded-[24px] p-6 md:p-8">
            <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">SECTION 8 — EXPORT SCORECARD + YOUR 5-ENGINE NOTES</div>
            <h3 className="font-display text-[20px] mt-3">Save closure log</h3>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Drop your AdGate, Google Media, Offerwall, TapJoy, Lead, Affiliate real numbers here... e.g. AdGate gross £0.65 fee 35% ... Google Media eCPM £0.015 fee 50% ... Save to closure_logs collection for persistence" className="mt-4 w-full h-[160px] rounded-[16px] bg-[#0A0A0A] border border-white/15 p-4 font-mono text-[12px] text-white/80 outline-none resize-none placeholder:text-white/20" />
            <div className="mt-3 flex items-center gap-3">
              <button onClick={handleSaveNote} className="h-10 px-5 rounded-full bg-white text-black font-mono text-[12px] font-bold hover:bg-white/90 transition">SAVE TO CLOSURE_LOGS</button>
              <span className="font-mono text-[11px] text-white/50">{saveStatus}</span>
            </div>
            {savedLogs.length > 0 && (
              <div className="mt-5 space-y-2 max-h-[180px] overflow-y-auto scrollbar-hide">
                {savedLogs.slice(-5).reverse().map((l: any) => (
                  <div key={l.id} className="rounded-[12px] bg-white/[0.04] border border-white/10 p-3 font-mono text-[11px] text-white/60">
                    <div className="text-white/90 truncate">{l.value?.text?.slice(0, 80)}...</div>
                    <div className="text-[10px] text-white/30 mt-1">{l.created_at?.slice(0, 19)} • {Math.round(l.value?.mfcPerGBP || 0)} MFC/£</div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex gap-2">
              <button onClick={exportJSON} className="flex-1 h-12 rounded-full m-gradient text-black font-display text-[14px] tracking-wide">EXPORT JSON SCORECARD</button>
            </div>
            <div className="mt-3 font-mono text-[10px] text-white/30">Includes anchor, MFC_PER_GBP, engines gross fee user_share coins final caps daily max, totals, recommendation, timestamp</div>
          </div>

          <div className="glass rounded-[24px] p-6 md:p-8">
            <div className="font-mono text-[11px] tracking-[0.14em] text-white/50">HOW THIS MAPS — VISAGUIDE → MYFACE</div>
            <div className="mt-5 grid gap-3 font-mono text-[12px] leading-6">
              <div className="rounded-[14px] bg-white/[0.04] border border-white/10 p-4 text-white/70"><span className="text-white font-bold">VisaGuide:</span> partner sends payout → parse to GBP → clamp to per-txn + daily caps → credit that full GBP as VGC at 45000/39</div>
              <div className="rounded-[14px] bg-[#8FFF4A]/10 border border-[#8FFF4A]/20 p-4 text-white/80"><span className="text-[#8FFF4A] font-bold">MyFace:</span> partner sends payout → parse to GBP → apply platform fee % → clamp → credit as MFC at MFC_PER_GBP → log to mfc_ledger source offerwall_postback — spend-only gift shop</div>
              <div className="rounded-[14px] bg-[#050505] border border-white/10 p-4">
                <div className="text-white font-bold">Bottom line from scan</div>
                <div className="text-white/50 mt-1">VisaGuide gives you the rate + caps + webhook credit path, not a filled AdGate/Google Media revenue scorecard. This calculator fills it — drop your 5-engine numbers next to VGC_PER_GBP (or MyFace twin) and sanity-check coin offers without coding.</div>
              </div>
            </div>
            <div className="mt-6 rounded-[14px] m-gradient p-[1px]">
              <div className="rounded-[13px] bg-[#0A0A0A] p-4 flex items-center justify-between">
                <div className="font-mono text-[11px] text-white/60">Target file: <span className="text-white">myface_ad_revenue_coin.html</span><br />Brand: Black #050505 + M gradient + Glass white/5 + Touch of GOD</div>
                <div className="h-9 w-9 rounded-full m-gradient grid place-items-center text-black font-display">✓</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center font-mono text-[10px] text-white/20 tracking-[0.2em]">MYFACE PROFILE — AD REVENUE TO COIN OFFER SCORECARD — BUILT FROM VISAGUIDE WIRING — NO MOCK — LIVE CALC</div>
      </div>
    </div>
  );
}
