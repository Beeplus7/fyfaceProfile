import React, { useEffect, useState, useRef, useCallback } from 'react';
import { ArrowRight, Loader2, Check, Sparkles, MapPin, Hammer, Scissors, Wrench, Zap, Droplets, Heart, Crown, Trophy, ShieldCheck, Store, Wallet } from 'lucide-react';

import logoM1 from "../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import tailorSewing from "../assets/840990accfbeab9d-image_20261029_173924.webp";
import mechanicImg from "../assets/862320100e7b980d-image_20261029_173915.webp";
import electricianImg from "../assets/8add8b271904e6b3-image_20261029_190128.webp";
import plumberImg from "../assets/a0e4b743decf2716-image_20261029_190129.webp";
import ayosTailors from "../assets/a57a388e71b1e926-image_20261029_223418.webp";
import giftBox from "../assets/66859f56b3a6c725-image_20261029_184125.webp";

// Types
type FieldType = 'text' | 'select' | 'multi' | 'yesno' | 'number';
interface FieldDef {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  options?: string[];
  help?: string;
  required?: boolean;
  phase: 1|2|3|4;
  appliesIf?: (a: Record<string,any>)=>boolean;
}

const ALL_FIELDS: FieldDef[] = [
  { id:'tradeType', type:'select', label:'What is your primary craft?', options:['Tailor','Mechanic','Builder','Barber','Electrician','Plumber','Other'], required:true, phase:1, help:'TradeType for UPRM Contact + Relationship 0-100' },
  { id:'tradeSpecialty', type:'text', label:'Your specialty in one line', placeholder:'e.g., Aso-Ebi wedding dresses, Toyota Corolla OBD2 P0302, kitchen remodel, fade line design, consumer unit 230V RCD, Worcester Bosch boiler 68C', phase:1 },
  { id:'yearsExperience', type:'number', label:'Years in craft?', placeholder:'12', required:true, phase:1 },
  { id:'shopName', type:'text', label:'Workshop / Shop name', placeholder:"Ayo's Tailors Spindlegate Oldham OL1", phase:1 },
  { id:'location', type:'select', label:'Base location', options:['Oldham OL1','Oldham OL2','Oldham OL8','Manchester','Other'], required:true, phase:1 },
  { id:'workRadius', type:'number', label:'Work radius for Work Feed (miles)', placeholder:'10', phase:1, help:'Default 10mi — deterministically gated for discovery' },
  { id:'bio', type:'text', label:'Craft bio — Show work not CV', placeholder:'Touch of GOD in every stitch. 12yrs Aso-Ebi. Oldham Spindlegate.', phase:1 },
  { id:'instagramHandle', type:'text', label:'Work Instagram / TikTok handle (optional)', placeholder:'@ayos_tailors_oldham', phase:1 },
  { id:'tools', type:'multi', label:'Core tools you own', options:['Juki industrial, lace scissors','OBD2 scanner, lift, P0302 kit','Trowel, laser level, mixer','Wahl clippers, fade blades','Multimeter CAT III, RCD tester 30mA','Gas Safe manometer, flue analyser','Other'], phase:2, help:'Per-trade gating' },
  { id:'materials', type:'multi', label:'Materials you stock', options:['Aso-Ebi lace £45/m, velvet','Brake pads, Toyota filters','Cement, timber, insulation','Pomade, aftershave','Cable 2.5mm, consumer unit BS 7671','Worcester Bosch parts, TRV'], phase:2 },
  { id:'signatureJobs', type:'multi', label:'How do you prove jobs?', options:['Before/After Slider','Timelapse Build','Milestone Check','Price Reveal','Tool Stack Photo'], required:true, phase:2 },
  { id:'avgJobPrice', type:'number', label:'Average job price (£)', placeholder:'320', required:true, phase:2, help:'Tailor £320, Mechanic £150, Builder £12k, Barber £25, Electrician £180, Plumber £150' },
  { id:'availability', type:'multi', label:'Weekly availability', options:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], phase:2 },
  { id:'projectBlueprint', type:'text', label:'Blueprint style you use', placeholder:'Hand sketch, CAD, photo measure, none — show work', phase:2 },
  { id:'firstProjects', type:'number', label:'How many past projects can you upload now for COMMAND CENTER?', placeholder:'3', phase:3, required:true },
  { id:'shopItems', type:'yesno', label:'Do you sell materials / fabrics / parts in shop?', options:['yes','no'], required:true, phase:3 },
  { id:'shopItemsList', type:'text', label:'List shop items (fabrics / parts)', placeholder:'Aso-Ebi lace 6 colors, Gele, brake pads Toyota', phase:3, appliesIf:(a)=> a.shopItems==='yes' },
  { id:'bookingPrefs', type:'select', label:'Booking flow you prefer', options:['Instant Booking','Quote First','Custom Offer + 10% escrow','Shop 5% fee'], phase:3 },
  { id:'liveWorkshopSetup', type:'yesno', label:'Do you have tripod + phone for Live Workshop?', options:['yes','no'], phase:3 },
  { id:'verificationDocs', type:'multi', label:'Verification docs you can upload now', options:['Gas Safe 123456','BS 7671 Part P Compliant','Public liability insurance','Portfolio video proof','Client video testimonial','None yet'], phase:3 },
  { id:'gasSafeNumber', type:'text', label:'Gas Safe registration number', placeholder:'123456 — required if Gas Safe checked', phase:3, appliesIf:(a)=> Array.isArray(a.verificationDocs) && a.verificationDocs.includes('Gas Safe 123456') },
  { id:'consumerUnitDetails', type:'text', label:'Last consumer unit job spec', placeholder:'230V 100A, RCD 30mA, RCBO, BS 7671 18th Edition, Oldham OL1 0.8mi', phase:3, appliesIf:(a)=> a.tradeType==='Electrician' },
  { id:'boilerType', type:'select', label:'Boiler specialism', options:['Worcester Bosch Greenstar','Vaillant ecoTEC','Baxi','Ideal','Other'], phase:3, appliesIf:(a)=> a.tradeType==='Plumber' },
  { id:'obd2Specialty', type:'text', label:'OBD2 / diagnostic specialty', placeholder:'Toyota Corolla P0302 misfire, DPF regen, hybrid battery', phase:3, appliesIf:(a)=> a.tradeType==='Mechanic' },
  { id:'asoEbiFabrics', type:'text', label:'Aso-Ebi fabrics you stock + price/m', placeholder:'Lace £45/m, Aso-Oke £60/m, 6 colors, Spindlegate', phase:3, appliesIf:(a)=> a.tradeType==='Tailor' },
  { id:'fadeDesign', type:'text', label:'Fade / design specialty', placeholder:'Skin fade, burst fade, line design, beard sculpt', phase:3, appliesIf:(a)=> a.tradeType==='Barber' },
  { id:'customerTypes', type:'multi', label:'Who books you most?', options:['Brides','Toyota owners','Kitchen remodel','Fade clients','Homeowners 230V','Boiler breakdown','Landlords'], phase:4 },
  { id:'pastCustomersCount', type:'number', label:'Past customers count (for seeding Relationship 0-100)', placeholder:'247', phase:4 },
  { id:'relationshipImport', type:'yesno', label:'Import past customers to UPRM for auto 0-100 strength?', options:['yes','no'], phase:4 },
  { id:'mfcGiftPrefs', type:'multi', label:'MFC Gift Economy you want enabled', options:['Hammer 10','Scissors 25','Heart 50','Crown 100','Trophy 500'], phase:4, help:'Gift box exploding — MFC economy' },
  { id:'journeyGoal', type:'select', label:'Primary UPRM Journey goal', options:['More bookings','Higher prices','Shop sales','Live gifts','TrustScore 5.0'], required:true, phase:4 },
  { id:'consentShowcase', type:'yesno', label:'Can we showcase your work within 10mi Work Feed?', options:['yes','no'], required:true, phase:4 },
  { id:'launchDate', type:'text', label:'When to unlock COMMAND CENTER?', placeholder:'ASAP — Oldham test, Ship now', phase:4 },
];

function getEligibleFields(answers: Record<string,any>){
  const autoAnswered: Record<string,any> = {};
  if(answers.workRadius===undefined || answers.workRadius==='') autoAnswered.workRadius = 10;
  const allAnsweredKeys = new Set([...Object.keys(answers), ...Object.keys(autoAnswered)]);
  const eligible = ALL_FIELDS.filter(f=>{
    if(allAnsweredKeys.has(f.id)) return false;
    if(f.appliesIf && !f.appliesIf({...answers, ...autoAnswered})) return false;
    if(f.id==='shopItemsList' && answers.shopItems==='no') return false;
    if(f.id==='gasSafeNumber' && !(Array.isArray(answers.verificationDocs) && answers.verificationDocs.includes('Gas Safe 123456'))) return false;
    return true;
  });
  return { eligible, autoAnswered, total: ALL_FIELDS.length, answered: allAnsweredKeys.size };
}

const WHY_TEXT: Record<string,string> = {
  tradeType: "To show your work in Work Feed within 10mi of Oldham — not posts. Trade = discovery algorithm.",
  tradeSpecialty: "To match you to Brides searching Aso-Ebi, Toyota owners P0302, kitchen remodel — exact craft intent.",
  yearsExperience: "For TrustScore 4.9 — years + verification docs + video proof = PID 1 unlocked.",
  shopName: "So customers navigate to Spindlegate Oldham OL1 — shop card in COMMAND CENTER.",
  location: "Oldham OL1 / OL2 / OL8 / Manchester determines 0.8mi proximity boost for electrician 230V RCD jobs.",
  workRadius: "Work Feed radius — we show your consumer unit 230V RCD 30mA within 10mi, not beyond.",
  bio: "Touch of GOD bio — craft as worship, not SaaS — appears on profile glass overlay.",
  tools: "Tool stack proves craft — Juki lace, OBD2 lift, RCD tester, Gas Safe manometer — for Project killer object.",
  materials: "Materials stock → Shop inventory — Aso-Ebi lace £45/m, Worcester Bosch parts — commerce enabled.",
  signatureJobs: "Before/After slider vs timelapse vs price reveal — determines Project killer object format.",
  avgJobPrice: "Avg job price £320 tailor / £150 mechanic — sets escrow 10% + Shop 5% fee logic.",
  availability: "Availability Mon-Sun → booking calendar in COMMAND CENTER — instant vs quote.",
  firstProjects: "3 projects upload = UPRM unlocked — Projects grid Before/After, blueprint, final.",
  shopItems: "If yes → ask shopItemsList. If no → genuinely removes question from eligible set — deterministic gating.",
  shopItemsList: "Shop inventory text → UPRM Shop tab — fabrics stacked image, price per meter.",
  bookingPrefs: "Instant vs Quote vs Custom escrow 10% → bookingPrefs changes Pipeline Inquiry→Booked.",
  liveWorkshopSetup: "Tripod phone → Live Workshop card — girl live streaming tripod image — Live gifts.",
  verificationDocs: "Gas Safe 123456, BS 7671, insurance — if Gas Safe selected → require Gas Safe number.",
  gasSafeNumber: "Gas Safe registration validation — shows Gas Safe badge in COMMAND CENTER Trust tab.",
  consumerUnitDetails: "Electrician consumer unit 230V RCD 30mA BS 7671 18th — proves compliance, not just post.",
  boilerType: "Plumber Gas Safe Worcester Bosch boiler 68C 1.2 bar — exact boiler type for matching.",
  obd2Specialty: "Mechanic OBD2 P0302 Toyota Corolla — diagnostic specialty for search intent.",
  asoEbiFabrics: "Tailor Aso-Ebi fabrics £45/m — appears in Shop if shopItems=yes — gated if trade=Tailor only.",
  fadeDesign: "Barber fade line design — gated if trade=Barber only.",
  customerTypes: "Brides, Toyota owners, kitchen remodel — seeds UPRM Relationship strength 0-100.",
  pastCustomersCount: "Past customers count → seeding Relationship 0-100 in COMMAND CENTER.",
  relationshipImport: "Import past customers → UPRM auto creates Contact entries 0-100 strength.",
  mfcGiftPrefs: "MFC Gift Economy — Hammer 10, Scissors 25, Heart 50, Crown 100, Trophy 500 — gift box exploding.",
  journeyGoal: "Journey goal → UPRM PID 1 dashboard focus — More bookings vs Higher prices vs Shop sales vs Live gifts.",
};

const QuantumBackground = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(143,255,74,0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(0,229,192,0.10),transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(255,230,0,0.08),transparent_60%)]" />
    <div className="absolute -top-[30%] -left-[10%] h-[70%] w-[70%] rounded-full opacity-[0.18] blur-[90px]" style={{background:'linear-gradient(120deg,#8FFF4A,#00E5C0)', animation:'float1 18s ease-in-out infinite'}} />
    <div className="absolute top-[10%] -right-[15%] h-[60%] w-[60%] rounded-full opacity-[0.14] blur-[110px]" style={{background:'linear-gradient(120deg,#FFE600,#FF8A00)', animation:'float2 22s ease-in-out infinite'}} />
    <div className="absolute bottom-[-20%] left-[20%] h-[50%] w-[80%] rounded-full opacity-[0.10] blur-[100px]" style={{background:'linear-gradient(120deg,#00E5C0,#8FFF4A)', animation:'float3 26s ease-in-out infinite'}} />
    <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:`linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)`, backgroundSize:'32px 32px'}} />
  </div>
);

const CompanionMessage = ({ message, isTyping }: { message:string, isTyping?:boolean }) => (
  <div className="flex gap-3 items-start">
    <div className="h-9 w-9 rounded-full m-gradient-bg flex items-center justify-center shrink-0 m-glow">
      <img src={logoM1} alt="My Face Profile M logo" className="h-7 w-7 rounded-full object-cover" />
    </div>
    <div className="glass rounded-[18px] rounded-tl-[6px] px-4 py-3 max-w-[92%]">
      <div className="mono text-[10px] tracking-widest text-[#5B6470] uppercase mb-1">Why we ask this</div>
      <div className="text-[13px] leading-[1.5] text-white/85 font-medium break-words">{message}</div>
      {isTyping && (
        <div className="mt-2 flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/40 animate-bounce" />
        </div>
      )}
    </div>
  </div>
);

const OnboardingStep: React.FC<{ field: FieldDef, value:any, onChange:(v:any)=>void }> = ({ field, value, onChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="mono text-[10px] tracking-[0.18em] text-[#5B6470] uppercase mb-2 break-words">Field • {field.id} • Phase {field.phase} • {field.type}</div>
        <h3 className="text-[22px] md:text-[26px] leading-[1.15] text-[#0A1931] break-words">{field.label}</h3>
        {field.help && <div className="mt-2 text-[12px] text-[#5B6470] font-mono leading-snug break-words">{field.help}</div>}
      </div>
      {field.type==='text' && (
        <input value={value||''} onChange={e=>onChange(e.target.value)} placeholder={field.placeholder}
          className="w-full rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 text-[15px] text-[#0A1931] placeholder:text-[#5B6470] outline-none focus:border-[#8FFF4A]/50 focus:bg-[#F0E9DB] transition" />
      )}
      {field.type==='number' && (
        <input type="number" value={value||''} onChange={e=>onChange(e.target.value=== '' ? '' : Number(e.target.value))} placeholder={field.placeholder}
          className="w-full rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] px-4 py-3 text-[15px] text-[#0A1931] placeholder:text-[#5B6470] outline-none focus:border-[#00E5C0]/50" />
      )}
      {field.type==='select' && (
        <div className="grid grid-cols-1 gap-2">
          {field.options?.map(opt=>(
            <button key={opt} onClick={()=>onChange(opt)}
              className={`text-left rounded-[12px] px-4 py-3 border text-[14px] font-medium transition break-words ${value===opt ? 'bg-white text-black border-white' : 'bg-[#F0E9DB] border-[#D4CBB8] text-[#5B6470] hover:bg-[#F0E9DB] hover:border-[#D4CBB8]'}`}>
              {opt} {value===opt && <Check className="inline ml-2 h-4 w-4" />}
            </button>
          ))}
        </div>
      )}
      {field.type==='multi' && (
        <div className="grid grid-cols-1 gap-2">
          {field.options?.map(opt=>{
            const selected = Array.isArray(value) && value.includes(opt);
            return (
              <button key={opt} onClick={()=>{
                const cur = Array.isArray(value)? value: [];
                if(selected) onChange(cur.filter((x:string)=>x!==opt));
                else onChange([...cur, opt]);
              }}
                className={`text-left rounded-[12px] px-4 py-3 border text-[13px] leading-snug font-medium transition flex justify-between items-center break-words ${selected ? 'bg-[#8FFF4A] text-black border-[#8FFF4A]' : 'bg-[#F0E9DB] border-[#D4CBB8] text-[#5B6470] hover:bg-[#F0E9DB]'}`}>
                <span className="break-words pr-2">{opt}</span>
                {selected && <Check className="h-4 w-4 shrink-0" />}
              </button>
            )
          })}
        </div>
      )}
      {field.type==='yesno' && (
        <div className="grid grid-cols-2 gap-3">
          {['yes','no'].map(o=>{
            const sel = value===o;
            return (
              <button key={o} onClick={()=>onChange(o)}
                className={`rounded-[14px] py-4 border text-[15px] font-bold uppercase tracking-wide transition ${sel ? 'bg-white text-black border-white' : 'bg-[#F0E9DB] border-[#D4CBB8] text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB]'}`}>
                {o}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
};

export default function OnboardingMarketingPage(){
  const [dbRecords, setDbRecords] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string,any>>({});
  const [currentFieldId, setCurrentFieldId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<any>(undefined);
  const [isThinking, setIsThinking] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [turns, setTurns] = useState<{q:string,a:string}[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [completedData, setCompletedData] = useState<Record<string,any> | null>(null);
  const initializedRef = useRef(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const showToast = (msg:string)=>{ setToastMsg(msg); setTimeout(()=>setToastMsg(null), 3200); };

  const reloadRecords = useCallback(async ()=>{
    try{
      const res = await fetch("actions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"records.list",args:{collection:"onboarding_craft"}})});
      const j = await res.json();
      if(j?.data?.records) setDbRecords(j.data.records);
    }catch{}
  },[]);
  useEffect(()=>{ reloadRecords(); },[reloadRecords]);

  useEffect(()=>{
    if(initializedRef.current) return;
    initializedRef.current = true;
    const { eligible } = getEligibleFields({});
    if(eligible.length>0){
      setCurrentFieldId(eligible[0].id);
      setInputValue(undefined);
    }
  },[]);

  const eligibleInfo = getEligibleFields(answers);
  const currentField = ALL_FIELDS.find(f=> f.id===currentFieldId) || null;
  const progressCount = Object.keys(answers).length;
  const whyText = currentField ? (WHY_TEXT[currentField.id] || currentField.help || "To show your work within 10mi — not posts.") : "";

  const advance = useCallback(async (fieldId:string, value:any)=>{
    const rawReply = typeof value === 'string' ? value : JSON.stringify(value);
    const newAnswers = {...answers, [fieldId]: value, ...eligibleInfo.autoAnswered};
    setAnswers(newAnswers);
    setTurns(prev=> [...prev, {q: currentField?.label || fieldId, a: rawReply}]);
    setIsThinking(true);
    await new Promise(r=> setTimeout(r, 620));
    const next = getEligibleFields(newAnswers);
    if(next.eligible.length===0){
      setIsThinking(false);
      setShowCompletion(true);
      setCompletedData(newAnswers);
      showToast("Your workshop has begun! UPRM COMMAND CENTER unlocked.");
      try{
        await fetch("actions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"records.create",args:{collection:"onboarding_craft", value:{...newAnswers, createdAt: new Date().toISOString(), craft: newAnswers.tradeType || 'unknown'}}})});
        reloadRecords();
      }catch{}
      return;
    }
    setCurrentFieldId(next.eligible[0].id);
    setInputValue(newAnswers[next.eligible[0].id]);
    setIsThinking(false);
  },[answers, eligibleInfo.autoAnswered, currentField, reloadRecords]);

  const handleSubmit = async ()=>{
    if(!currentField) return;
    if(currentField.required && (inputValue===undefined || inputValue==='' || (Array.isArray(inputValue) && inputValue.length===0))){
      showToast("Please answer before continuing.");
      return;
    }
    await advance(currentField.id, inputValue);
  };

  const handleSkipToComplete = ()=>{
    setShowCompletion(true);
    setCompletedData(answers);
    showToast("Skipped — showing COMMAND CENTER preview with current answers.");
  };

  return (
    <div data-safe-area-inset-root className="min-h-screen w-full bg-[#FFFDF7] text-[#0A0A0A] overflow-x-clip relative selection:bg-[#FFC300]/35"
      style={{boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)'}}>
      <QuantumBackground />

      <header data-safe-area-sticky-top className="sticky z-40 backdrop-blur-2xl border-b border-[#D4CBB8] bg-black/40 overflow-x-clip"
        style={{top:'var(--safe-area-inset-top)'}}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-[12px] m-gradient-bg p-[1px] m-glow shrink-0">
              <div className="h-full w-full rounded-[11px] bg-black flex items-center justify-center overflow-hidden">
                <img src={logoM1} alt="M logo My Face Profile" className="h-7 w-7 object-cover rounded-full" />
              </div>
            </div>
            <div className="leading-none min-w-0">
              <div className="font-[Poppins] font-black text-[14px] tracking-tight flex gap-1.5 items-center"><span className="truncate">My Face Profile</span><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A] animate-pulse shrink-0" /></div>
              <div className="mono text-[9px] tracking-[0.18em] text-[#5B6470] uppercase -mt-0.5 truncate">UPRM • PID 1 • Page 25</div>
            </div>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <span className="rounded-full bg-[#F0E9DB] px-2.5 py-1 text-[10px] mono uppercase tracking-wide">Onboarding Active</span>
              <span className="rounded-full m-gradient-bg px-2.5 py-1 text-[10px] mono uppercase tracking-wide text-black font-bold">NEW</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={()=> document.getElementById('live-demo')?.scrollIntoView({behavior:'smooth'})} className="rounded-full bg-white text-black px-4 py-2 text-[12px] font-bold mono uppercase tracking-wide hover:bg-white/90">Live Demo</button>
          </div>
        </div>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 pb-3">
          <div className="mono text-[10px] leading-[1.4] text-[#5B6470] uppercase tracking-[0.12em] border-t border-[#D4CBB8] pt-2 mt-1 break-words whitespace-normal">
            Page 25 • NEW • UPRM Onboarding Companion • From VisaguideOS → My Face Profile • Craft Data → COMMAND CENTER — VisaguideOS Companion Memory → My Face Profile UPRM Onboarding — 32 Fields → COMMAND CENTER — Ship Oldham Test
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-8 md:py-12 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 md:gap-8 items-start overflow-x-clip">
        <div className="space-y-6 min-w-0">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full glass px-3 py-1 flex-wrap">
            <span className="h-2 w-2 rounded-full bg-[#8FFF4A] animate-pulse shrink-0" />
            <span className="mono text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-[#5B6470] break-words">Replicated Architecture • Documents/passport-paper/src/onboarding/companion/OnboardingCompanion.tsx</span>
          </div>
          <h1 className="text-[30px] md:text-[52px] leading-[0.95] tracking-[-0.03em] font-black break-words">
            VisaguideOS Companion →<br/>
            <span className="text-[#0A1931]">My Face Profile UPRM</span><br/>
            <span className="m-gradient-text">Onboarding — Same Brain,</span><br/>
            <span className="m-gradient-text">New Craft.</span>
          </h1>
          <div className="glass rounded-[20px] p-4 md:p-5 overflow-hidden">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#5B6470] mb-2 break-words">One Question At A Time — Deterministically Gated</div>
            <div className="font-[Poppins] font-bold text-[18px] md:text-[22px] leading-[1.2] m-gradient-text break-words">Work → Content → Discovery → Trust → Commerce</div>
            <p className="mt-3 text-[14px] leading-[1.6] text-white/65 break-words">Replicated from <span className="text-[#0A1931] font-mono text-[12px] bg-[#F0E9DB] px-1.5 py-0.5 rounded">OnboardingCompanion.tsx</span> — Adapted for <span className="text-[#0A1931]">UPRM COMMAND CENTER DASHBOARD</span> — Collecting comprehensive users craft data for better user production. Touch of GOD in every stitch — craft as worship, not SaaS.</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              {k:'32 fields', v:'4 phases'},
              {k:'6 trades', v:'1247 pros'},
              {k:'UPRM PID 1', v:'UNLOCKED'},
            ].map(s=>(
              <div key={s.k} className="glass rounded-[16px] p-3 min-w-0">
                <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470] break-words">{s.v}</div>
                <div className="font-black text-[13px] md:text-[14px] mt-1 break-words">{s.k}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="relative rounded-[20px] overflow-hidden aspect-[16/9] glass">
              <img src={tailorSewing} alt="Tailor sewing lace craft Oldham" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                <div className="mono text-[9px] uppercase tracking-wide bg-black/60 px-2.5 py-1 rounded-full truncate">Tailor • Lace • Aso-Ebi • Spindlegate OL1</div>
                <div className="h-6 w-6 rounded-full bg-[#8FFF4A] flex items-center justify-center shrink-0"><Scissors className="h-3 w-3 text-black" /></div>
              </div>
            </div>
          </div>
        </div>

        <div ref={demoRef} id="live-demo" className="relative lg:sticky lg:top-[88px] min-w-0">
          <div className="glass rounded-[24px] p-4 md:p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="flex items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-8 w-8 rounded-full m-gradient-bg flex items-center justify-center shrink-0">M</div>
                <div className="min-w-0">
                  <div className="font-black text-[13px] leading-none truncate">My Face Profile UPRM</div>
                  <div className="mono text-[9px] uppercase tracking-wide text-[#5B6470] truncate">Live Companion • Deterministically Gated</div>
                </div>
              </div>
              <div className="mono text-[10px] text-[#5B6470] shrink-0">{progressCount} of {ALL_FIELDS.length} confirmed</div>
            </div>

            <div className="mb-4">
              <CompanionMessage message={whyText || "Getting your next question ready — To show your work in Work Feed within 10mi of Oldham — not posts."} isTyping={isThinking} />
            </div>

            <div className="h-1.5 w-full rounded-full bg-[#F0E9DB] overflow-hidden mb-5">
              <div className="h-full m-gradient-bg transition-all duration-500" style={{width:`${(progressCount/ALL_FIELDS.length)*100}%`}} />
            </div>

            {!showCompletion ? (
              currentField ? (
                <div key={currentField.id} className="animate-[slideIn_0.4s_ease]">
                  <div className="glass bg-[#F0E9DB] backdrop-blur-xl rounded-[20px] p-5 md:p-6 border border-[#D4CBB8] overflow-hidden">
                    <OnboardingStep field={currentField} value={inputValue} onChange={setInputValue} />
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#D4CBB8] gap-3">
                      <button onClick={handleSkipToComplete} className="mono text-[11px] uppercase tracking-wide text-[#5B6470] hover:text-[#5B6470]">Skip to preview</button>
                      <button onClick={handleSubmit} disabled={isThinking} className="flex items-center gap-2 px-5 py-2.5 m-gradient-bg text-black font-bold rounded-[12px] hover:brightness-110 disabled:opacity-50 shadow-[0_0_20px_rgba(143,255,74,0.3)] transition shrink-0">
                        {isThinking ? <><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</> : <>Continue <ArrowRight className="h-4 w-4" /></>}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 flex flex-col items-center justify-center text-[#5B6470] mono text-[12px]"><Loader2 className="h-6 w-6 animate-spin mb-2" />Loading eligible fields…</div>
              )
            ) : (
              <div className="space-y-4">
                <div className="rounded-[20px] m-gradient-bg p-[1px]">
                  <div className="rounded-[19px] bg-[#F0E9DB] p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center"><Check className="h-5 w-5 text-black" /></div>
                      <div className="font-black text-[16px]">Your workshop is ready!</div>
                    </div>
                    <div className="mono text-[11px] text-[#5B6470] leading-[1.5] break-words">3 projects will be created from your answers. UPRM COMMAND CENTER unlocked. <span className="text-[#0A1931]">Touch of GOD</span> — craft as worship.</div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {Object.entries(completedData||{}).slice(0,6).map(([k,v])=>(
                        <div key={k} className="glass rounded-[10px] px-3 py-2 min-w-0">
                          <div className="mono text-[9px] uppercase text-[#5B6470] truncate">{k}</div>
                          <div className="text-[11px] truncate text-[#5B6470]">{Array.isArray(v)? v.join(', ') : String(v)}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>{setShowCompletion(false); setAnswers({}); setCurrentFieldId(ALL_FIELDS[0].id); setInputValue(undefined); setCompletedData(null); setTurns([]);}} className="mt-4 w-full rounded-[12px] bg-white text-black py-2.5 font-bold text-[12px] mono uppercase">Restart Onboarding</button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide">
              {[
                {icon:Zap, label:'Electrician 230V RCD 30mA BS 7671'},
                {icon:Droplets, label:'Plumber Gas Safe Worcester 68C'},
                {icon:Scissors, label:'AYO’S TAILORS Spindlegate OL1'},
              ].map(c=>(
                <div key={c.label} className="shrink-0 flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1">
                  <c.icon className="h-4 w-4 text-[#8FFF4A] ml-1" />
                  <span className="mono text-[9px] uppercase tracking-wide text-[#5B6470] whitespace-nowrap">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 mono text-[10px] text-white/25 text-center break-words px-2">Mock LIVE DEMO — deterministic gating — same brain as VisaguideOS Companion • answers persist to records API</div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-12 border-t border-[#D4CBB8] overflow-x-clip">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center font-black text-[12px]">1</div>
          <h2 className="text-[22px] md:text-[32px] break-words">Reusable Format Adapted — 5-Piece Stack</h2>
        </div>

        <div className="glass rounded-[24px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-[#D4CBB8] bg-[#F0E9DB]">
                  <th className="mono text-[11px] uppercase tracking-[0.18em] text-[#5B6470] px-5 py-3">Piece</th>
                  <th className="mono text-[11px] uppercase tracking-[0.18em] text-[#5B6470] px-5 py-3">Path</th>
                  <th className="mono text-[11px] uppercase tracking-[0.18em] text-[#5B6470] px-5 py-3">What you change for My Face Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {[
                  {piece:'Field schema', path:'config/onboardingSteps.ts', what:'Your craft steps/questions id type label options required — TradeType Tailor Mechanic Builder Barber Electrician Plumber, ShopName, Location Oldham OL1 OL2 OL8, YearsExperience, Tools, Materials, AvgJobPrice, etc'},
                  {piece:'Gating rules', path:'rules/fieldGating.ts', what:'appliesIf / autoAnswer so "no" removes follow-ups — If trade=Tailor → ask Aso-Ebi fabrics, If Mechanic → OBD2 P0302, If Electrician → consumer unit 230V RCD BS 7671, If Plumber → Gas Safe 123456 boiler, If no shop → skip shopItems'},
                  {piece:'Shared engine', path:'rules/gatingEngine.ts', what:'Reuse as-is — deterministic eligible fields — getEligibleFields(answers) → {eligible, autoAnswered} — no AI invents questions'},
                  {piece:'Orchestrator', path:'companion/OnboardingCompanion.tsx', what:'Brand text M logo, complete route → /uprm command center (UPRM locked until first project), edge fn URL /functions/v1/onboarding-chat → handoffToUprm craft destination Oldham OL1'},
                  {piece:'Edge fn contract', path:'onboarding-chat', what:'Payload answersSoFar eligibleFields conversationHistory latestUserReply → { done nextFieldId questionText whyText } — AI chooses one question at a time from eligible only'},
                ].map(r=>(
                  <tr key={r.piece} className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-bold text-[13px] whitespace-nowrap"><span className="inline-flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />{r.piece}</span></td>
                    <td className="px-5 py-4 mono text-[12px] text-[#00E5C0] break-words">{r.path}</td>
                    <td className="px-5 py-4 text-[12px] leading-[1.5] text-white/65 max-w-[520px] break-words">{r.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-12 border-t border-[#D4CBB8] overflow-x-clip">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-7 w-7 rounded-full m-gradient-bg text-black flex items-center justify-center font-black text-[12px]">2</div>
          <h2 className="text-[22px] md:text-[32px] break-words">Craft Field Schema — 32 Fields — 4 Phases</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {phase:1, title:'Craft Identity', subtitle:'for UPRM Contact + Relationship 0-100', img:ayosTailors, imgAlt:'AYOS TAILORS Spindlegate Oldham OL1 measuring Aso-Ebi', color:'#8FFF4A', fields: ALL_FIELDS.filter(f=>f.phase===1)},
            {phase:2, title:'Work DNA', subtitle:'for Project killer object', img:electricianImg, imgAlt:'Electrician consumer unit 230V RCD 30mA BS 7671', color:'#00E5C0', fields: ALL_FIELDS.filter(f=>f.phase===2)},
            {phase:3, title:'Production Engine', subtitle:'for UPRM Journey + Shop + Booking + Live', img:plumberImg, imgAlt:'Plumber Gas Safe Worcester Bosch boiler 68C 1.2 bar', color:'#FFE600', fields: ALL_FIELDS.filter(f=>f.phase===3)},
            {phase:4, title:'UPRM Brain', subtitle:'for COMMAND CENTER DASHBOARD PID 1', img:giftBox, imgAlt:'Gift Economy box black velvet exploding with coins hearts crowns trophies', color:'#FF8A00', fields: ALL_FIELDS.filter(f=>f.phase===4)},
          ].map(p=>(
            <div key={p.phase} className="glass rounded-[24px] overflow-hidden group min-w-0">
              <div className="relative h-[180px] overflow-hidden">
                <img src={p.img} alt={p.imgAlt} className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-black/70 backdrop-blur flex items-center justify-center mono text-[11px] font-bold" style={{border:`1px solid ${p.color}`}}>{p.phase}</div>
                  <div className="rounded-full bg-black/60 backdrop-blur px-3 py-1 mono text-[10px] uppercase tracking-wide text-[#5B6470]">{p.fields.length} fields</div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-[22px] leading-none break-words">{p.title}</h3>
                  <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470] mt-1 break-words">{p.subtitle}</div>
                </div>
              </div>
              <div className="p-4 space-y-2 max-h-[320px] overflow-y-auto scrollbar-hide">
                {p.fields.map(f=>(
                  <div key={f.id} className="flex items-start justify-between gap-3 rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2.5 min-w-0">
                    <div className="min-w-0">
                      <div className="mono text-[10px] text-[#5B6470] break-words">{f.id} • {f.type}</div>
                      <div className="text-[12px] font-medium leading-tight mt-0.5 break-words">{f.label}</div>
                      {f.options && <div className="mono text-[9px] text-[#5B6470] mt-1 line-clamp-2 break-words">{f.options.slice(0,4).join(' • ')}{f.options.length>4 ? ' •…' : ''}</div>}
                    </div>
                    <div className="shrink-0">
                      {f.required ? <span className="rounded-full bg-[#FF8A00] text-black mono text-[8px] px-2 py-1 font-bold uppercase">req</span> : <span className="rounded-full bg-[#F0E9DB] mono text-[8px] px-2 py-1 uppercase text-[#5B6470]">opt</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3">
          <div className="relative rounded-[20px] overflow-hidden glass min-h-[180px]">
            <img src={mechanicImg} alt="Female mechanic J Martinez OBD2 P0302 Toyota Corolla" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
            <div className="relative p-5">
              <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470]">Phase 2 Work DNA • Mechanic Speciality • Female mechanic J Martinez</div>
              <div className="mt-2 text-[18px] font-black leading-tight max-w-[520px] break-words">OBD2 P0302 Toyota Corolla misfire • Tool stack proves craft • Before/After slider for Project killer object</div>
              <div className="mt-2 mono text-[10px] text-[#5B6470] break-words">Materials: brake pads • Tools: OBD2 scanner lift • Avg job £150 • Availability Mon-Sun</div>
            </div>
          </div>
        </div>

        <div className="mt-8 glass rounded-[20px] p-1 overflow-hidden">
          <div className="rounded-[19px] bg-[#0D0D0D] p-4 md:p-6 overflow-x-auto">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5B6470] mb-3 flex items-center gap-2"><Sparkles className="h-3 w-3" /> config/onboardingSteps.ts — 32 fields — copyable</div>
            <pre className="text-[11px] leading-[1.6] text-[#5B6470] whitespace-pre-wrap break-words">{`// config/onboardingSteps.ts — My Face Profile Craft Schema
export const CRAFT_STEPS: FieldDef[] = [
  ${ALL_FIELDS.map(f=>`{ id:'${f.id}', type:'${f.type}', label:'${f.label.replace(/'/g,"\\'")}', ${f.options?`options:[${f.options.map(o=>`'${o}'`).join(', ')}],`:''} phase:${f.phase}, required:${!!f.required} ${f.appliesIf?`, appliesIf: (a)=>... // gated` : ''} }`).join('\n  ')}
];
// Total: ${ALL_FIELDS.length} — Phases: 1=Identity, 2=DNA, 3=Engine, 4=Brain
// Gating: if trade !== Tailor → remove Aso-Ebi fabrics, if Electrician → require consumer unit RCD 30mA BS 7671`}</pre>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-12 border-t border-[#D4CBB8] overflow-x-clip">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center font-black text-[12px]">3</div>
          <h2 className="text-[22px] md:text-[32px] break-words">Gating Logic — fieldGating.ts — “No” Genuinely Removes</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="glass rounded-[20px] p-1 overflow-hidden">
            <div className="rounded-[19px] bg-[#0D0D0D] p-4 md:p-6 overflow-x-auto">
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5B6470] mb-3">rules/fieldGating.ts — deterministic — no AI invents fields</div>
              <pre className="text-[11px] leading-[1.7] text-white/75 whitespace-pre-wrap break-words">{`// rules/fieldGating.ts — My Face Profile adapted
export function getEligibleFields(answers: Record<string,any>){
  const autoAnswered: Record<string,any> = {};
  if(!answers.workRadius) autoAnswered.workRadius = 10;

  const answeredKeys = new Set([...Object.keys(answers), ...Object.keys(autoAnswered)]);

  const eligible = ALL_FIELDS.filter(f=>{
    if(answeredKeys.has(f.id)) return false;
    if(f.appliesIf && !f.appliesIf({...answers, ...autoAnswered})) return false;
    if(f.id==='shopItemsList' && answers.shopItems==='no') return false;
    if(f.id==='gasSafeNumber'){
      const docs = answers.verificationDocs || [];
      if(!docs.includes('Gas Safe 123456')) return false;
    }
    if(f.id==='asoEbiFabrics' && answers.tradeType!=='Tailor') return false;
    if(f.id==='consumerUnitDetails' && answers.tradeType!=='Electrician') return false;
    if(f.id==='boilerType' && answers.tradeType!=='Plumber') return false;
    if(f.id==='obd2Specialty' && answers.tradeType!=='Mechanic') return false;
    if(f.id==='fadeDesign' && answers.tradeType!=='Barber') return false;
    return true;
  });
  return { eligible, autoAnswered, total: ALL_FIELDS.length, answered: answeredKeys.size };
}
`}</pre>
            </div>
          </div>

          <div className="space-y-4 min-w-0">
            <div className="glass rounded-[20px] p-5">
              <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470] mb-3">Live gating example — try in demo</div>
              <div className="space-y-3 text-[12px]">
                {[
                  {if:'tradeType ≠ Tailor', then:'remove Aso-Ebi fabrics', icon:Scissors},
                  {if:'shopItems = no', then:'remove shopItemsList', icon:Store},
                  {if:'verificationDocs includes Gas Safe', then:'require Gas Safe number 123456', icon:ShieldCheck},
                  {if:'trade = Electrician', then:'ask consumer unit 230V RCD 30mA BS 7671', icon:Zap},
                  {if:'trade = Plumber', then:'ask Worcester Bosch boiler 68C 1.2 bar', icon:Droplets},
                ].map(r=>(
                  <div key={r.if} className="flex gap-3 items-start rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2.5">
                    <r.icon className="h-4 w-4 mt-0.5 text-[#8FFF4A] shrink-0" />
                    <div className="min-w-0">
                      <div className="mono text-[11px] text-[#0A1931] break-words">if {r.if}</div>
                      <div className="text-[11px] text-[#5B6470] break-words">→ {r.then}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[20px] overflow-hidden glass p-5 bg-gradient-to-br from-[#8FFF4A]/10 via-[#00E5C0]/10 to-[#FFE600]/10">
              <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470]">Why we ask this — craft example</div>
              <div className="mt-2 text-[13px] leading-[1.5] font-medium break-words">To show your consumer unit 230V RCD 30mA installation within 0.8mi of customers searching electrician Oldham — not posts.</div>
              <div className="mt-3 flex items-center gap-2 mono text-[9px] uppercase text-[#5B6470]"><MapPin className="h-3 w-3" /> Oldham OL1 • 0.8mi boost • TrustScore 4.9</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-12 border-t border-[#D4CBB8] overflow-x-clip">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-7 w-7 rounded-full bg-white text-black flex items-center justify-center font-black text-[12px]">4</div>
          <h2 className="text-[22px] md:text-[32px] break-words">Orchestrator Diff — VisaguideOS → My Face Profile</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {[
            {from:'VisaGuide OS Rocket', to:'My Face Profile M logo gradient #8FFF4A→#00E5C0→#FFE600→#FF8A00', icon:Hammer},
            {from:'OUTSIDE_UK_WIZARD_ROUTE', to:'/uprm command center route UPRM locked until first project', icon:ArrowRight},
            {from:'handoffOutsideUkToAssessment', to:'handoffToUprm — persist craft destination Oldham OL1 localStorage + supabase', icon:MapPin},
            {from:'NATIVE_TO_CODE english→en français→fr', to:'TRADE_TO_TOOLS Tailor→Juki lace, Mechanic→OBD2 P0302, Electrician→RCD tester 30mA, Plumber→Gas Safe manometer', icon:Wrench},
            {from:'FUNCTIONS_URL onboarding-chat payload answersSoFar eligibleFields', to:'Same but payload now includes trade context — tradeType determines next eligible field set', icon:Zap},
            {from:'OnboardingCompletion “Your journey has begun!”', to:'UPRM Completion “Your workshop is ready! 3 projects will be created from your answers. UPRM COMMAND CENTER unlocked.”', icon:Trophy},
          ].map(d=>(
            <div key={d.from} className="glass rounded-[16px] p-4 min-w-0">
              <div className="flex gap-2 items-center mono text-[10px] uppercase tracking-wide text-[#5B6470] mb-2"><d.icon className="h-3 w-3" /> Diff</div>
              <div className="text-[11px] mono text-[#5B6470] line-through break-words">- {d.from}</div>
              <div className="text-[11px] mono text-[#8FFF4A] mt-1 break-words">+ {d.to}</div>
            </div>
          ))}
        </div>

        <div className="glass rounded-[20px] p-1 overflow-hidden">
          <div className="rounded-[19px] bg-[#0D0D0D] p-4 md:p-6 overflow-x-auto">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5B6470] mb-3">companion/OnboardingCompanion.tsx — My Face Profile adapted — copyable</div>
            <pre className="text-[11px] leading-[1.7] text-[#5B6470] whitespace-pre-wrap break-words">{`// src/onboarding/companion/OnboardingCompanion.tsx — Adapted
import { getEligibleFields, ALL_FIELDS } from '../rules/fieldGating';
import { QuantumBackground } from './QuantumBackground'; // M gradient
import { MLogo } from '@/assets/MLogo'; // #8FFF4A → #00E5C0 → #FFE600 → #FF8A00

const UPRM_ROUTE = '/uprm'; // UPRM locked until first project
const DEST_KEY = 'mfp_craft_destination';

async function handoffToUprm(finalAnswers: Record<string,unknown>){
  const dest = String(finalAnswers.location || '').trim(); // Oldham OL1
  if(!dest) return;
  try{ localStorage.setItem(DEST_KEY, dest); }catch{}
  await persistCraftDestination({ code: dest, name: dest });
}

const TRADE_TO_TOOLS: Record<string,string[]> = {
  'Tailor': ['Juki industrial','lace scissors','Aso-Ebi £45/m'],
  'Mechanic': ['OBD2 scanner','lift','P0302 kit'],
  'Electrician': ['Multimeter CAT III','RCD tester 30mA','consumer unit BS 7671'],
  'Plumber': ['Gas Safe manometer','Worcester Bosch 68C 1.2 bar'],
};

export const OnboardingCompanion: React.FC = () => {
  // fetchNextQuestion payload: answersSoFar, eligibleFields, conversationHistory, latestUserReply
  // → { done, nextFieldId, questionText, whyText }
  // whyText: "To show your consumer unit 230V RCD 30mA within 0.8mi of customers searching electrician Oldham — not posts."
  // On completion → UPRM Completion with "Your workshop is ready! 3 projects will be created"
};
`}</pre>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1280px] px-4 md:px-6 py-12 border-t border-[#D4CBB8] overflow-x-clip">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-7 w-7 rounded-full m-gradient-bg text-black flex items-center justify-center font-black text-[12px]">5</div>
          <h2 className="text-[22px] md:text-[32px] break-words">Live Interactive Demo — Working State Machine — UPRM COMMAND CENTER Preview</h2>
        </div>

        {!showCompletion ? (
          <div className="glass rounded-[24px] p-6 md:p-8 text-center">
            <div className="mono text-[11px] uppercase tracking-wide text-[#5B6470] mb-2 break-words">Scroll up — Live demo is in Hero split — deterministic gating working</div>
            <div className="text-[14px] text-[#5B6470] break-words">Current: <span className="text-[#0A1931] font-bold">{currentField?.label}</span> • {progressCount} / {ALL_FIELDS.length} • Eligible next: {eligibleInfo.eligible.slice(0,3).map(f=>f.id).join(', ')}</div>
            <button onClick={()=> demoRef.current?.scrollIntoView({behavior:'smooth'})} className="mt-4 rounded-full bg-white text-black px-5 py-2.5 text-[12px] font-bold mono uppercase">Go to live companion ↑</button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
              <div className="glass rounded-[24px] p-5 md:p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-5 gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-[12px] bg-white text-black flex items-center justify-center font-black shrink-0">M</div>
                    <div className="min-w-0">
                      <div className="font-black text-[15px] truncate">UPRM COMMAND CENTER • PID 1 UNLOCKED</div>
                      <div className="mono text-[10px] text-[#5B6470] uppercase tracking-wide truncate">Pipeline Inquiry → Booked → In Progress → Final → Review</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-[#8FFF4A] text-black px-2.5 py-1 mono text-[10px] font-bold">TrustScore 4.9</span>
                    <span className="rounded-full bg-[#F0E9DB] px-2.5 py-1 mono text-[10px]">Oldham OL1</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 mb-6">
                  {[
                    {k:'Inquiry', v:completedData?.pastCustomersCount ? Math.floor(Number(completedData.pastCustomersCount)*0.3) : 12, c:'#8FFF4A'},
                    {k:'Booked', v:8, c:'#00E5C0'},
                    {k:'Inquiry', v:3, c:'#FFE600'},
                    {k:'Final', v:2, c:'#FF8A00'},
                    {k:'Review', v:4.9, c:'#fff'},
                  ].map((s,i)=>(
                    <div key={i} className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 text-center min-w-0">
                      <div className="mono text-[9px] uppercase text-[#5B6470] truncate">{s.k}</div>
                      <div className="font-black text-[16px] md:text-[18px] mt-1 truncate" style={{color:s.c}}>{s.v}</div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    {title:'Projects', desc:'Before/After Aso-Ebi lace', icon:Scissors, grad:'from-[#8FFF4A]/20 to-[#00E5C0]/20'},
                    {title:'Shop', desc:'Aso-Ebi £45/m • 6 colors', icon:Store, grad:'from-[#FFE600]/20 to-[#FF8A00]/20'},
                    {title:'Bookings', desc:'Instant + Escrow 10%', icon:Wallet, grad:'from-white/10 to-white/5'},
                  ].map(card=>(
                    <div key={card.title} className={`rounded-[16px] overflow-hidden bg-gradient-to-br ${card.grad} border border-[#D4CBB8] p-4`}>
                      <div className="h-10 w-10 rounded-[12px] bg-black/50 flex items-center justify-center mb-3"><card.icon className="h-5 w-5 text-[#0A1931]" /></div>
                      <div className="font-bold text-[13px]">{card.title}</div>
                      <div className="mono text-[10px] text-[#5B6470] mt-1 break-words">{card.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className="rounded-[14px] bg-white text-black p-3 min-w-0">
                    <div className="mono text-[9px] uppercase tracking-wide">MFC Wallet</div>
                    <div className="font-black text-[16px] mt-1 flex items-center gap-1"><Wallet className="h-4 w-4" /> £1,247</div>
                    <div className="mono text-[9px] mt-1 text-black/60">Gift rain enabled</div>
                  </div>
                  <div className="rounded-[14px] bg-[#F0E9DB] border border-[#D4CBB8] p-3 min-w-0">
                    <div className="mono text-[9px] uppercase">TrustScore</div>
                    <div className="font-black text-[16px] mt-1">4.9 ★</div>
                    <div className="mono text-[9px] mt-1 text-[#5B6470]">Gas Safe • BS 7671 • Video</div>
                  </div>
                  <div className="rounded-[14px] m-gradient-bg text-black p-3 min-w-0">
                    <div className="mono text-[9px] uppercase font-bold">Live Gifts</div>
                    <div className="font-black text-[14px] mt-1 flex items-center gap-1"><Heart className="h-4 w-4" /> Hammer 10 • Heart 50</div>
                    <div className="mono text-[9px] mt-1">Exploding box • MFC</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 min-w-0">
                <div className="glass rounded-[24px] p-5 overflow-hidden">
                  <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470] mb-3">Onboarding turns • conversation history • public.onboarding_conversations</div>
                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {turns.map((t,i)=>(
                      <div key={i} className="rounded-[12px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2">
                        <div className="mono text-[9px] text-[#5B6470] break-words">{t.q}</div>
                        <div className="text-[11px] text-[#5B6470] mt-1 break-words">{t.a}</div>
                      </div>
                    ))}
                    {turns.length===0 && <div className="mono text-[11px] text-[#5B6470]">No turns yet — start in hero demo</div>}
                  </div>
                </div>

                <div className="relative rounded-[24px] overflow-hidden glass min-h-[160px]">
                  <div className="absolute inset-0 m-gradient-bg opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="relative p-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 mono text-[10px] uppercase"><Crown className="h-3 w-3 text-[#FFE600]" /> MFC Gift Economy</div>
                    <h4 className="mt-3 text-[18px] leading-[1.1] font-black break-words">Black velvet box exploding with coins hearts crowns trophies — MFC economy — Touch of GOD</h4>
                    <div className="mt-2 mono text-[11px] text-[#5B6470] break-words">Hammer 10 • Scissors 25 • Heart 50 • Crown 100 • Trophy 500 — Live gifts rain on phone</div>
                  </div>
                </div>

                <div className="glass rounded-[20px] p-4">
                  <div className="mono text-[10px] uppercase tracking-wide text-[#5B6470] mb-2 break-words">Saved craft records • onboarding_craft collection • {dbRecords.length} saved</div>
                  <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto">
                    {dbRecords.slice(-5).reverse().map((r:any)=>(
                      <div key={r.id} className="rounded-[10px] bg-[#F0E9DB] border border-[#D4CBB8] px-3 py-2 flex justify-between items-center gap-2">
                        <div className="mono text-[10px] text-[#5B6470] truncate">{r.value?.tradeType || 'craft'} • {r.value?.location || 'Oldham'} • £{r.value?.avgJobPrice || '—'}</div>
                        <div className="mono text-[9px] text-[#5B6470] shrink-0">{new Date(r.created_at).toLocaleDateString()}</div>
                      </div>
                    ))}
                    {dbRecords.length===0 && <div className="mono text-[11px] text-[#5B6470]">No records yet — complete onboarding to persist</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-[20px] p-1 overflow-hidden">
              <div className="rounded-[19px] bg-[#0D0D0D] p-4 md:p-6 overflow-x-auto">
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5B6470] mb-3">supabase/functions/onboarding-chat/index.ts — My Face Profile — copyable</div>
                <pre className="text-[11px] leading-[1.7] text-[#5B6470] whitespace-pre-wrap break-words">{`// supabase/functions/onboarding-chat/index.ts
// Payload: { answersSoFar, eligibleFields, conversationHistory, latestUserReply }
// → { done, nextFieldId, questionText, whyText }

export async function handler(req: Request){
  const { answersSoFar, eligibleFields } = await req.json();
  if(eligibleFields.length===0) return Response.json({ done:true });
  const trade = answersSoFar.tradeType || 'craft';
  // AI must pick ONLY from eligibleFields — deterministic gating
  return Response.json({
    done:false,
    nextFieldId: eligibleFields[0].id,
    questionText: eligibleFields[0].label,
    whyText: WHY_TEXT[eligibleFields[0].id] || "To show your work in Work Feed within 10mi — not posts."
  });
}
`}</pre>
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="relative z-10 mt-8 border-t border-[#D4CBB8] overflow-x-clip">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-12">
          <div className="rounded-[32px] m-gradient-bg p-[1px] m-glow-soft overflow-hidden">
            <div className="rounded-[31px] bg-[#070707] p-6 md:p-10 text-center relative overflow-hidden">
              <QuantumBackground />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F0E9DB] px-3 py-1 mono text-[10px] uppercase tracking-[0.2em] text-[#5B6470] mb-4 max-w-full flex-wrap justify-center">Page 25 • UPRM Onboarding Companion • Production-ready</div>
                <h2 className="text-[26px] md:text-[46px] leading-[0.95] tracking-[-0.03em] font-black max-w-[900px] mx-auto break-words">
                  From VisaguideOS Companion Memory →<br/>
                  <span className="m-gradient-text">My Face Profile UPRM Onboarding — 32 Fields → COMMAND CENTER — Ship Oldham Test</span>
                </h2>
                <div className="mt-6 flex flex-wrap justify-center gap-3 mono text-[11px]">
                  {[
                    'apps/marketing/app/onboarding/page.tsx',
                    'apps/web/app/(dashboard)/uprm/page.tsx COMMAND CENTER',
                    'supabase/functions/onboarding-chat/index.ts',
                    'src/onboarding/rules/fieldGating.ts',
                    'config/onboardingSteps.ts',
                  ].map(p=>(
                    <span key={p} className="rounded-full glass px-3 py-1.5 text-[#5B6470] break-words">{p}</span>
                  ))}
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-[12px] m-gradient-bg p-[1px]"><div className="h-full w-full rounded-[11px] bg-black flex items-center justify-center">M</div></div>
                    <div className="h-10 w-10 rounded-[12px] bg-white text-black flex items-center justify-center font-black">M</div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[
                      {label:'iOS', sub:'TestFlight'},
                      {label:'Android', sub:'Play Internal'},
                    ].map(b=>(
                      <div key={b.label} className="rounded-[14px] bg-white text-black px-5 py-2.5 flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-black text-[10px]">{b.label[0]}</div>
                        <div className="leading-none text-left">
                          <div className="font-bold text-[12px]">{b.label} Badge</div>
                          <div className="mono text-[9px] opacity-60">{b.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mono text-[11px] text-[#5B6470] break-words">32 fields • 4 phases • 6 trades • 1247 pros • Touch of GOD — UPRM PID 1 UNLOCKED</div>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[800px] mx-auto">
                  {[
                    {icon:Scissors, t:'Tailor • Aso-Ebi • £45/m'},
                    {icon:Zap, t:'Electrician • 230V RCD 30mA'},
                    {icon:Droplets, t:'Plumber • Worcester 68C'},
                    {icon:Wrench, t:'Mechanic • OBD2 P0302'},
                  ].map(c=>(
                    <div key={c.t} className="rounded-[16px] overflow-hidden bg-[#F0E9DB] border border-[#D4CBB8] p-4 flex flex-col items-start gap-2">
                      <div className="h-8 w-8 rounded-[10px] m-gradient-bg flex items-center justify-center"><c.icon className="h-4 w-4 text-black" /></div>
                      <div className="mono text-[9px] uppercase tracking-wide text-[#5B6470] break-words">{c.t}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 mono text-[10px] text-white/25 uppercase tracking-wide break-words">
            <span className="break-words">Badge Page 25 UPRM Onboarding Companion — From VisaguideOS — Tailored for My Face Profile — Production-ready</span>
            <span className="break-words">Touch of GOD • Craft as worship • Not SaaS • Holy onboarding • Divine glow • Glassmorphism • QuantumBackground</span>
          </div>
        </div>
      </footer>

      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[80] pointer-events-none px-4 max-w-[90vw]">
          <div className="rounded-full m-gradient-bg px-1 py-1 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <div className="rounded-full bg-black px-5 py-2.5 flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-[#8FFF4A] flex items-center justify-center"><Check className="h-3 w-3 text-black" /></div>
              <span className="mono text-[11px] font-bold text-[#0A1931] tracking-wide break-words">{toastMsg}</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn { from{ opacity:0; transform: translateY(14px) scale(0.98);} to{ opacity:1; transform: translateY(0) scale(1);} }
      `}</style>
    </div>
  );
}
