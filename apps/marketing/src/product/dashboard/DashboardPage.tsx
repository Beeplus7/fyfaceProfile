/**
 * @deprecated Legacy monolith UPRM dashboard.
 * Live product route `/app/dashboard` uses CommandShell via DashboardShell.
 * Kept for reference / marketing re-exports only — do not wire new features here.
 */
import { useEffect, useState, useRef } from 'react';
import logo1 from "../../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg";
import logo2 from "../../assets/37dd6990257bc05a-image_BB42B180-B8CD-4B6B-AC5B-C76D1CB32C77.jpeg";
import tailorImg from "../../assets/840990accfbeab9d-image_20261029_173924.webp";
import mechanicImg from "../../assets/862320100e7b980d-image_20261029_173915.webp";
import electricianImg from "../../assets/8add8b271904e6b3-image_20261029_190128.webp";
import plumberImg from "../../assets/a0e4b743decf2716-image_20261029_190129.webp";
import shopFrontImg from "../../assets/a57a388e71b1e926-image_20261029_223418.webp";
import giftBoxImg from "../../assets/66859f56b3a6c725-image_20261029_184125.webp";

type Project = { id: string; title: string; beforeLabel: string; afterLabel: string; price: string; status: string; material?: string; trust: boolean; gifts: number; crowns: number; bookings: number; imageKey: string; };
type Contact = { id: string; name: string; role: string; strength: number; last: string; next: string; journey: string; gift: string; };
type KanbanCol = { id: string; label: string; count: number; color: string };
type Bot = { id: string; name: string; role: string; icon: string; active: boolean; };

const KANBAN_COLS: KanbanCol[] = [
  { id: 'discovery', label: 'Discovery', count: 12, color: '#8FFF4A' },
  { id: 'engagement', label: 'Engagement', count: 8, color: '#00E5C0' },
  { id: 'inquiry', label: 'Inquiry', count: 5, color: '#FFE600' },
  { id: 'quote', label: 'Quote', count: 3, color: '#FF8A00' },
  { id: 'booked', label: 'Booked', count: 2, color: '#8FFF4A' },
  { id: 'progress', label: 'In Progress', count: 2, color: '#00E5C0' },
  { id: 'final', label: 'Final', count: 1, color: '#FFE600' },
  { id: 'review', label: 'Review', count: 1, color: '#8FFF4A' },
  { id: 'repeat', label: 'Repeat', count: 1, color: '#FF8A00' },
];

const BOTS: Bot[] = [
  { id: 'milo', name: 'Milo', role: 'Onboarding 32 fields', icon: '◍', active: true },
  { id: 'cutty', name: 'Cutty', role: 'WorkCut auto-tools', icon: '✂', active: true },
  { id: 'quoto', name: 'Quoto', role: 'Quotes £45/m', icon: '£', active: true },
  { id: 'timi', name: 'Timi', role: 'Bookings auto-sched', icon: '◷', active: true },
  { id: 'findy', name: 'Findy', role: 'Discovery 10mi', icon: '◎', active: true },
  { id: 'helpy', name: 'Helpy', role: 'FAQ instant', icon: '?', active: true },
  { id: 'veri', name: 'Veri', role: 'GasSafe BS7671', icon: '✓', active: true },
  { id: 'growy', name: 'Growy', role: 'Boost traffic', icon: '↗', active: true },
  { id: 'lingo', name: 'Lingo', role: 'Yoruba Hausa Eng', icon: 'あ', active: true },
];

const DEFAULT_PROJECTS: Project[] = [
  { id: '1', title: 'Aso-Ebi Wedding Dress', beforeLabel: 'Fabric Stack • Green Yellow Pink', afterLabel: 'Final Reveal • Silk Lace', price: '£320', status: 'Final Reveal', material: 'Aso-Ebi lace • £45/m Silk', trust: true, gifts: 24, crowns: 5, bookings: 3, imageKey: 'tailor' },
  { id: '2', title: 'Kitchen Remodel Oldham', beforeLabel: 'Before • Broken Tiles', afterLabel: 'After • Marble White Black', price: '£12K', status: 'In Progress', material: 'Quartz + Oak', trust: true, gifts: 18, crowns: 2, bookings: 1, imageKey: 'shop' },
  { id: '3', title: 'Consumer Unit 230V RCD 30mA BS 7671', beforeLabel: 'Before • Old Fuse Box', afterLabel: 'After • Hager RCBO', price: '£180', status: 'Verification Part P', material: 'Hager • RCBO', trust: true, gifts: 9, crowns: 1, bookings: 2, imageKey: 'electric' },
  { id: '4', title: 'Worcester Bosch Boiler 68C 1.2 bar', beforeLabel: 'Before • Leak', afterLabel: 'After • Fixed 68C', price: '£150', status: 'Gas Safe 123456', material: 'Worcester • 30i', trust: true, gifts: 12, crowns: 3, bookings: 1, imageKey: 'plumber' },
  { id: '5', title: 'Toyota Corolla OBD2 P0302', beforeLabel: 'Before • Misfire Code', afterLabel: 'After • Coil Fixed', price: '£150', status: 'Final', material: 'OBD2 Scan • Denso', trust: true, gifts: 7, crowns: 1, bookings: 1, imageKey: 'mechanic' },
  { id: '6', title: 'Fade Haircut Oldham OL1', beforeLabel: 'Before • Grown Out', afterLabel: 'After • Skin Fade', price: '£25', status: 'Review 4.9', material: 'Wahl • Andis', trust: true, gifts: 31, crowns: 4, bookings: 5, imageKey: 'barber' },
];

const DEFAULT_CONTACTS: Contact[] = [
  { id: '1', name: 'Aisha Bridal', role: 'Bride • Aso-Ebi', strength: 94, last: 'Final fitting • 2h ago', next: 'Review + Repeat', journey: 'Review → Repeat', gift: 'Crown 100' },
  { id: '2', name: 'Mrs Okafor', role: 'Aso-Ebi mother • 12m', strength: 87, last: 'Measurement • £45/m x 12m', next: 'Cutting', journey: 'Quote → Booked', gift: 'Heart 50' },
  { id: '3', name: 'J Martinez', role: 'Toyota Corolla P0302', strength: 72, last: 'OBD2 scan • Inquiry', next: 'Quote £150', journey: 'Inquiry → Quote', gift: 'Hammer 10' },
  { id: '4', name: 'Mr Smith', role: 'Kitchen Oldham £12K', strength: 68, last: 'Tiles → Hood • In Progress', next: 'Final inspection', journey: 'In Progress → Final', gift: 'Trophy 500' },
  { id: '5', name: 'Homeowner OL1', role: 'Consumer unit 230V £180', strength: 81, last: 'RCBO upgrade • BS 7671', next: 'Certification', journey: 'Booked → In Progress', gift: 'Scissors 25' },
  { id: '6', name: 'Boiler OL8', role: 'Worcester Bosch 68C £150', strength: 76, last: '1.2 bar • Leak fixed', next: 'Gas Safe cert', journey: 'Booked', gift: 'Crown 100' },
];

const SHOP_ITEMS = [
  { name: 'Aso-Ebi Lace', price: '£45/m', stock: 12, color:'#8FFF4A' },
  { name: 'Silk Premium', price: '£55/m', stock: 8, color:'#00E5C0' },
  { name: 'Brake Pads Bosch', price: '£45', stock: 24, color:'#FFE600' },
  { name: 'Cement Portland', price: '£12', stock: 40, color:'#FF8A00' },
  { name: 'Pomade Fade Co', price: '£8', stock: 60, color:'#8FFF4A' },
  { name: 'Cable 2.5mm Twin', price: '£1.20/m', stock: 200, color:'#00E5C0' },
  { name: 'Worcester Valve', price: '£89', stock: 5, color:'#FFE600' },
  { name: 'Sequin Gold', price: '£32/m', stock: 15, color:'#FF8A00' },
];

export default function UprmCommandPage() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [contacts, setContacts] = useState<Contact[]>(DEFAULT_CONTACTS);
  const [filter, setFilter] = useState('All');
  const [live, setLive] = useState(false);
  const [giftRain, setGiftRain] = useState<{id:number, emoji:string, x:number}[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjPrice, setNewProjPrice] = useState('');
  const [busy, setBusy] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [beforeAfterPos, setBeforeAfterPos] = useState(50);
  const [selectedProject, setSelectedProject] = useState<string>('1');
  const [viewers, setViewers] = useState(0);
  const [navPulse, setNavPulse] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  const reloadRecords = async () => {
    try {
      const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.list", args: { collection: "projects" } }) });
      const json = await res.json();
      if (json.data?.records?.length) setProjects(json.data.records.map((r:any)=>r.value));
      const res2 = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.list", args: { collection: "uprm_contacts" } }) });
      const json2 = await res2.json();
      if (json2.data?.records?.length) setContacts(json2.data.records.map((r:any)=>r.value));
    } catch {}
  };

  useEffect(()=>{ reloadRecords(); }, []);
  useEffect(()=>{
    const onKey = (e: KeyboardEvent) => { if (e.key === '/') { e.preventDefault(); searchRef.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return ()=> window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(()=>{
    if (!live) { setViewers(0); return; }
    const iv = setInterval(()=> setViewers(v=> v+ Math.floor(Math.random()*3)), 1200);
    return ()=> clearInterval(iv);
  }, [live]);

  const triggerGiftRain = () => {
    const emojis = ['🔨','✂️','❤️','👑','🏆'];
    const newGifts = Array.from({length: 10}, (_,i)=>({ id: Date.now()+i, emoji: emojis[Math.floor(Math.random()*emojis.length)], x: Math.random()*80+10 }));
    setGiftRain(g=> [...g, ...newGifts]);
    setTimeout(()=> setGiftRain(g=> g.slice(newGifts.length)), 3000);
  };

  const createRow = async (row: any, collection: string) => {
    const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.create", args: { collection, value: row, idempotency_key: `${collection}-${row.id}-${Date.now()}` } }) });
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.data;
  };

  const handleCreateProject = async () => {
    if (!newProjTitle.trim()) return;
    setBusy(true);
    const newP: Project = { id: Date.now().toString(), title: newProjTitle, beforeLabel: 'Before • Fabric Stack', afterLabel: 'After • Final Reveal', price: newProjPrice || '£0', status: 'Discovery', material: 'Custom', trust: true, gifts: 0, crowns: 0, bookings: 0, imageKey: 'tailor' };
    try {
      await createRow(newP, "projects");
      setProjects(p=>[newP, ...p]);
      setShowNewProject(false); setNewProjTitle(''); setNewProjPrice('');
    } catch (e:any) { /* keep */ }
    try { await reloadRecords(); } catch {}
    setBusy(false);
  };

  const bgFor = (key: string) => {
    switch(key){
      case 'tailor': return tailorImg;
      case 'mechanic': return mechanicImg;
      case 'electric': return electricianImg;
      case 'plumber': return plumberImg;
      case 'shop': return shopFrontImg;
      default: return tailorImg;
    }
  };

  const filteredProjects = projects.filter(p=> {
    const matchesSearch = (p.title + (p.material||'')).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || p.title.toLowerCase().includes(filter.toLowerCase()) || (filter==='Before/After' && p.status.includes('Final')) || (filter==='Timelapse' && p.status.includes('Progress')) || (filter==='Final Reveal' && p.status.includes('Final'));
    return matchesSearch && matchesFilter;
  });
  const filteredContacts = contacts.filter(c=> (c.name + c.role).toLowerCase().includes(search.toLowerCase()));

  const handleNav = (label: string) => {
    setActiveNav(label);
    setNavPulse(p=>p+1);
    setSearch('');
    // scroll to top for feedback
    window.scrollTo({ top:0, behavior:'smooth' });
  };

  return (
    <div data-safe-area-inset-root className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip" style={{ boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');`}</style>
      
      <div className="flex min-h-screen w-full">
        {/* LEFT SIDEBAR */}
        <aside className={`fixed lg:sticky lg:top-0 lg:h-screen lg:self-start inset-y-0 left-0 z-40 w-[280px] lg:w-[240px] bg-[#050505] border-r border-white/10 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} overflow-y-auto overflow-x-clip`}>
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0">
                <img src={logo1} alt="M logo My Face" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="poppins text-[15px] leading-none truncate">My Face</div>
                <div className="mono text-[10px] text-white/50 uppercase tracking-widest">Profile • OS</div>
              </div>
            </div>
            <div className="mt-3 mono text-[9px] text-white/40 tracking-[0.15em] uppercase">Page 26 • UPRM COMMAND CENTER • PID 1</div>
            <div className="mt-2 h-[2px] w-full m-gradient rounded-full" />
          </div>

          <div className="flex-1 p-3 space-y-6 overflow-y-auto">
            <div>
              <div className="mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2.5 px-2">OS Core</div>
              <nav className="space-y-1.5">
                {[
                  { label:'Dashboard', count:null },
                  { label:'Projects', count:'12' },
                  { label:'UPRM Contacts', count:'47' },
                  { label:'Pipeline', count:'8 active' },
                  { label:'Work Feed', count:'preview' },
                ].map(item=>(
                  <button key={item.label} onClick={()=>handleNav(item.label)} className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-[13px] font-medium transition-all ${activeNav===item.label ? 'm-gradient text-black shadow-lg shadow-[#8FFF4A]/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                    <span>{item.label}</span>
                    {item.count && <span className={`mono text-[10px] px-1.5 py-0.5 rounded-full ${activeNav===item.label?'bg-black/20 text-black':'bg-white/10 text-white/50'}`}>{item.count}</span>}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <div className="mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2.5 px-2">Production</div>
              <nav className="space-y-1.5">
                {[
                  { label:'Shop', count:'24 items' },
                  { label:'Bookings', count:'calendar' },
                  { label:'Live Workshop', count:'Go Live', pulse:true },
                  { label:'WorkCut', count:'editor' },
                  { label:'Analytics', count:null },
                ].map(item=>(
                  <button key={item.label} onClick={()=>handleNav(item.label)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition">
                    <span className="flex items-center gap-2">{item.label}{item.pulse && <span className="w-2 h-2 bg-red-500 rounded-full pulse-red inline-block" />}</span>
                    {item.count && <span className="mono text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/50">{item.count}</span>}
                  </button>
                ))}
              </nav>
            </div>

            <div>
              <div className="mono text-[10px] text-white/30 uppercase tracking-[0.2em] mb-2.5 px-2">Trust & Growth</div>
              <nav className="space-y-1">
                {[
                  { label:'TrustScore 4.9', badge:true },
                  { label:'Verification Gas Safe + BS 7671' },
                  { label:'MFC Wallet 1,247 coins' },
                  { label:'Bot Army 9 bots' },
                  { label:'Boost Discovery' },
                ].map(item=>(
                  <button key={item.label} onClick={()=>handleNav(item.label)} className="w-full text-left px-3 py-2.5 rounded-xl text-[12px] text-white/50 hover:text-white/80 hover:bg-white/5 flex items-center justify-between transition">
                    <span>{item.label}</span>
                    {item.badge && <span className="w-2 h-2 bg-[#8FFF4A] rounded-full shadow-[0_0_8px_#8FFF4A]" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="p-3 border-t border-white/10">
            <div className="glass rounded-2xl p-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-white/10">
                  <img src={shopFrontImg} alt="Ayo Tailor Spindlegate Oldham OL1" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-semibold truncate">Ayo Tailor</div>
                  <div className="mono text-[9px] text-white/50 truncate">Spindlegate Oldham OL1</div>
                </div>
                <div className="w-2 h-2 bg-[#8FFF4A] rounded-full animate-pulse shrink-0" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-1.5 mono text-[9px]">
                <div className="bg-white/5 rounded-lg px-2.5 py-2 text-white/60">Shop <span className="text-[#8FFF4A]">Open</span></div>
                <div className="bg-white/5 rounded-lg px-2.5 py-2 text-white/60">Live <span className={`${live?'text-red-400':'text-white/30'}`}>{live?'ON':'OFF'}</span></div>
                <div className="bg-white/5 rounded-lg px-2.5 py-2">Trust <span className="text-[#8FFF4A]">4.9/5 ✓</span></div>
                <div className="bg-white/5 rounded-lg px-2.5 py-2">MFC <span className="text-[#FFE600]">1,247</span></div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
          <header data-safe-area-sticky-top className="sticky z-30 top-0" style={{ top:'var(--safe-area-inset-top)' }}>
            <div className="bg-[#050505]/85 backdrop-blur-2xl border-b border-white/10 px-4 lg:px-8 py-3.5 flex items-center gap-3">
              <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="lg:hidden w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">☰</button>
              
              <div className="flex-1 relative max-w-[520px]">
                <input ref={searchRef} value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects, contacts, bookings...  / to focus" className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-[13px] placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition" />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30">⌕</span>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded">/</span>
              </div>

              <div className="hidden md:flex items-center gap-2.5">
                <button onClick={()=>setShowNewProject(true)} className="h-11 px-5 rounded-xl m-gradient text-black text-[13px] font-bold flex items-center gap-1.5 hover:brightness-110 transition shadow-lg shadow-[#8FFF4A]/10">+ New Project</button>
                <button onClick={()=>setLive(!live)} className={`h-11 px-5 rounded-xl text-[13px] font-bold flex items-center gap-2 transition ${live ? 'bg-red-500 text-white pulse-red shadow-lg shadow-red-500/20' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}>
                  <span className={`w-2 h-2 rounded-full ${live ? 'bg-white' : 'bg-red-500'} ${!live?'pulse-red':''}`} />{live ? 'Live ON' : 'Go Live'}
                </button>
                <button className="h-11 px-5 rounded-xl bg-[#FFE600] text-black text-[13px] font-bold hover:brightness-110 transition">Boost post</button>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <button onClick={triggerGiftRain} className="relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
                  <span className="text-[18px]">🎁</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FFE600] text-black mono text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
                </button>
                <button className="relative w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
                  <span>💬</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#8FFF4A] text-black mono text-[10px] font-bold rounded-full flex items-center justify-center">5</span>
                </button>
                <div className="hidden sm:flex items-center gap-3 pl-2">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/10 shrink-0">
                    <img src={logo2} alt="avatar Ayo" className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-[12px] font-semibold leading-none">Ayo</div>
                    <div className="mono text-[10px] text-[#8FFF4A]">Trust 4.9 ✓</div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 lg:px-8 py-8 space-y-8 overflow-x-clip max-w-[1600px] w-full mx-auto">
            {/* ROW 1 — OVERVIEW STATS — 6 cards */}
            <section className="slide-in">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="poppins text-[13px] tracking-[0.18em] uppercase opacity-80">Overview • Command Center {navPulse>0 && <span className="ml-2 text-[#8FFF4A]">• {activeNav} • {navPulse}</span>}</h2>
                <div className="mono text-[10px] text-white/35">Live OS • 10K weekly users = £9,620/week • PID 1</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                  { label:'Total Projects', value:'12', change:'+3 this week', accent:'#8FFF4A' },
                  { label:'UPRM Relationships', value:'47 contacts', change:'avg strength 73/100', accent:'#00E5C0', bar:true },
                  { label:'Pipeline Value', value:'£8,420', change:'8 active jobs', accent:'#FFE600' },
                  { label:'TrustScore', value:'4.9/5', change:'Verified Pro Gas Safe', accent:'#8FFF4A' },
                  { label:'MFC Wallet', value:'1,247 coins', change:'£600 gifts 70% you', accent:'#FFE600' },
                  { label:'Work Feed Reach', value:'12.4K views', change:'+23% this week', accent:'#FF8A00' },
                ].map((c,i)=>(
                  <div key={i} className="group relative glass rounded-[20px] p-4 overflow-hidden hover:bg-white/[0.07] transition">
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/[0.04] to-transparent" />
                    <div className="relative">
                      <div className="flex items-start justify-between mb-3">
                        <div className="mono text-[9px] uppercase tracking-[0.16em] text-white/40 leading-tight">{c.label}</div>
                        <div className="w-2 h-2 rounded-full" style={{ background:c.accent, boxShadow:`0 0 8px ${c.accent}` }} />
                      </div>
                      <div className="poppins text-[20px] leading-none tracking-tight">{c.value}</div>
                      <div className="mono text-[11px] text-white/45 mt-2">{c.change}</div>
                      {c.bar && <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[73%] m-gradient rounded-full" /></div>}
                      <div className="mt-3 h-[2px] w-full rounded-full opacity-60" style={{ background:c.accent }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ROW 2 — PROMOTE ENHANCE WORK CONTENT */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left 8 cols Projects Commander */}
              <div className="xl:col-span-8 glass rounded-[28px] p-5 lg:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="poppins text-[22px] lg:text-[26px] leading-[1.05] tracking-tight">Your Work Is Your Face.<br/>Not Your CV.</h2>
                    <div className="mono text-[10px] text-white/35 mt-2 tracking-wide">Project is object not content feed — Work Graph SEO goldmine — PID 1 • {activeNav}</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['All','Tailor','Before/After','Timelapse','Final Reveal'].map(f=>(
                      <button key={f} onClick={()=>setFilter(f)} className={`px-3.5 py-2 rounded-full mono text-[10px] font-bold uppercase tracking-wide transition ${filter===f ? 'm-gradient text-black shadow-md' : 'bg-white/10 text-white/50 hover:text-white hover:bg-white/15'}`}>{f}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProjects.map(proj=>(
                    <div key={proj.id} onClick={()=>setSelectedProject(proj.id)} className={`group relative rounded-[20px] overflow-hidden border transition-all cursor-pointer ${selectedProject===proj.id ? 'border-[#8FFF4A] bg-white/[0.07] shadow-[0_0_20px_rgba(143,255,74,0.15)]' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/15'} `}>
                      <div className="relative h-[156px] overflow-hidden bg-[#0A0A0A]">
                        <div className="absolute inset-0 opacity-80 group-hover:opacity-100 transition" style={{ backgroundImage:`url(${bgFor(proj.imageKey)})`, backgroundSize:'cover', backgroundPosition:'center' }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        {proj.id==='1' && selectedProject==='1' ? (
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${beforeAfterPos}%` }}>
                              <div className="w-full h-full" style={{ backgroundImage:`url(${tailorImg})`, backgroundSize:'cover' }} />
                              <div className="absolute top-2.5 left-2.5 mono text-[9px] bg-black/75 backdrop-blur px-2 py-1 rounded-full border border-white/10">BEFORE • Fabric Stack</div>
                            </div>
                            <div className="absolute inset-0 overflow-hidden" style={{ left: `${beforeAfterPos}%`, width: `${100-beforeAfterPos}%` }}>
                              <div className="w-full h-full" style={{ backgroundImage:`url(${shopFrontImg})`, backgroundSize:'cover' }} />
                              <div className="absolute top-2.5 right-2.5 mono text-[9px] bg-[#8FFF4A] text-black px-2 py-1 rounded-full font-bold">AFTER • Final Dress</div>
                            </div>
                            <input type="range" min={5} max={95} value={beforeAfterPos} onChange={e=>setBeforeAfterPos(Number(e.target.value))} className="absolute bottom-3 left-3 right-3 w-[calc(100%-24px)] accent-[#8FFF4A] h-1" />
                            <div className="absolute top-0 bottom-0 w-0.5 bg-white/80" style={{ left: `${beforeAfterPos}%` }} />
                          </div>
                        ) : (
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-between mono text-[8px] uppercase tracking-wide">
                            <span className="bg-black/70 backdrop-blur px-2 py-1 rounded-full border border-white/10">{proj.beforeLabel.slice(0,22)}</span>
                            <span className="bg-[#8FFF4A] text-black px-2 py-1 rounded-full font-bold">After • Reveal</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="poppins text-[13.5px] leading-tight tracking-tight flex-1 min-w-0">{proj.title}</div>
                          <div className="mono text-[11px] font-bold text-[#8FFF4A] shrink-0">{proj.price}</div>
                        </div>
                        <div className="mono text-[10px] text-white/35 mt-1.5 leading-relaxed">{proj.material} • cutting→sewing→fitting</div>
                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                          <span className="mono text-[9px] bg-white/10 px-2 py-1 rounded-full border border-white/5">{proj.status}</span>
                          {proj.trust && <span className="mono text-[9px] bg-[#8FFF4A]/15 text-[#8FFF4A] px-2 py-1 rounded-full border border-[#8FFF4A]/20">Verified ✓</span>}
                          <span className="mono text-[9px] bg-white/5 px-2 py-1 rounded-full">❤️ {proj.gifts} 👑 {proj.crowns}</span>
                        </div>
                        <div className="mt-3.5 flex gap-2">
                          <button className="flex-1 h-8 rounded-full bg-white/10 text-[11px] font-semibold hover:bg-white/15 transition">Boost</button>
                          <button className="flex-1 h-8 rounded-full m-gradient text-black text-[11px] font-bold hover:brightness-110 transition">Open</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={()=>setShowNewProject(true)} className="mt-6 w-full h-[56px] rounded-2xl border border-dashed border-white/20 text-[13px] font-semibold text-white/60 hover:text-white hover:border-white/30 hover:bg-white/[0.04] transition flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full m-gradient text-black flex items-center justify-center font-bold">+</span>
                  Create New Project with WorkCut templates Before/After Timelapse Milestone Price Reveal
                </button>
              </div>

              {/* Right 4 cols UPRM Contacts */}
              <div className="xl:col-span-4 glass rounded-[28px] p-5 lg:p-6 flex flex-col min-h-[600px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="poppins text-[17px] tracking-tight">UPRM Contacts</h3>
                  <div className="mono text-[9px] bg-white/10 px-2.5 py-1 rounded-full border border-white/5">Relationship 0-100</div>
                </div>
                <div className="relative mb-4">
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search contacts..." className="w-full h-10 pl-9 pr-3 rounded-xl bg-white/5 border border-white/10 text-[12px] placeholder:text-white/30 focus:outline-none focus:border-white/15 transition" />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-[13px]">⌕</span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[560px] pr-1">
                  {filteredContacts.map(c=>(
                    <div key={c.id} className="group p-3.5 rounded-[18px] bg-white/[0.04] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center font-bold text-[13px] shrink-0">{c.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="poppins text-[12.5px] truncate tracking-tight">{c.name}</div>
                            <div className={`mono text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${c.strength>85?'bg-[#8FFF4A] text-black': c.strength>70?'bg-[#00E5C0] text-black':'bg-[#FFE600] text-black'}`}>{c.strength}/100</div>
                          </div>
                          <div className="mono text-[10px] text-white/40 truncate mt-0.5">{c.role}</div>
                          <div className="mt-2.5 h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full m-gradient rounded-full transition-all" style={{ width:`${c.strength}%` }} /></div>
                          <div className="mt-2.5 flex flex-wrap gap-1">
                            <span className="mono text-[8px] bg-white/10 px-2 py-1 rounded-full border border-white/5">{c.journey}</span>
                            <span className="mono text-[8px] bg-[#8FFF4A]/15 text-[#8FFF4A] px-2 py-1 rounded-full border border-[#8FFF4A]/15">{c.gift}</span>
                          </div>
                          <div className="mono text-[9px] text-white/30 mt-2 leading-relaxed">Last: {c.last}<br/>Next: {c.next}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-1.5">
                        <button className="flex-1 h-8 rounded-full bg-white/10 text-[10px] font-semibold hover:bg-white/15 transition">Message</button>
                        <button className="flex-1 h-8 rounded-full bg-white/10 text-[10px] font-semibold hover:bg-white/15 transition">Quote</button>
                        <button className="flex-1 h-8 rounded-full m-gradient text-black text-[10px] font-bold hover:brightness-110 transition">Book</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3.5 rounded-2xl bg-[#8FFF4A]/10 border border-[#8FFF4A]/15">
                  <div className="mono text-[10px] text-[#8FFF4A] font-bold uppercase tracking-wide">Event-sourced Ledger</div>
                  <div className="mono text-[10px] text-white/60 mt-1.5 leading-relaxed">"Every Contact, Relationship, Interaction, Journey — No lost leads. Work Graph logs everything."</div>
                </div>
              </div>
            </section>

            {/* ROW 3 — PIPELINE KANBAN */}
            <section className="glass rounded-[28px] p-5 lg:p-7 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <h2 className="poppins text-[18px] lg:text-[20px] tracking-tight">PIPELINE KANBAN — UPRM Journey State Machine</h2>
                <div className="mono text-[10px] text-white/35 hidden lg:block">Discovery→Engagement→Inquiry→Quote→Booked→In Progress→Final→Review→Repeat</div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1 scrollbar-thin">
                {KANBAN_COLS.map(col=>(
                  <div key={col.id} className="min-w-[220px] w-[220px] flex-shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.color, boxShadow:`0 0 8px ${col.color}` }} />
                      <div className="mono text-[11px] font-bold uppercase tracking-wide">{col.label}</div>
                      <div className="mono text-[10px] bg-white/10 px-2 py-0.5 rounded-full border border-white/5">{col.count}</div>
                    </div>
                    <div className="space-y-2.5">
                      {Array.from({length: Math.min(col.count, col.id==='discovery'?3:2)}).map((_,i)=>(
                        <div key={i} className="group p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition cursor-grab active:cursor-grabbing">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-white/15 to-white/5 border border-white/10 flex items-center justify-center mono text-[10px] font-bold">{col.label[0]}{i+1}</div>
                            <div className="flex-1 min-w-0">
                              <div className="mono text-[10px] font-semibold truncate">{col.label} #{i+1}</div>
                              <div className="mono text-[9px] text-white/40">£{ (Math.random()*300+20).toFixed(0)} • OL1</div>
                            </div>
                            <div className="w-1.5 h-8 rounded-full" style={{ background: col.color }} />
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex -space-x-1">
                              <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-[#050505] flex items-center justify-center mono text-[8px]">A</div>
                              <div className="w-6 h-6 rounded-full bg-[#8FFF4A]/60 border-2 border-[#050505] flex items-center justify-center mono text-[8px] text-black font-bold">Q</div>
                            </div>
                            <div className="mono text-[9px] bg-white/10 px-2 py-1 rounded-full border border-white/5">Timi • Quoto</div>
                          </div>
                        </div>
                      ))}
                      {col.id==='quote' && <button className="w-full h-9 rounded-xl m-gradient text-black mono text-[10px] font-bold shadow-md">Quoto bot Quote £45/m</button>}
                      {col.id==='booked' && <div className="mono text-[9px] bg-[#8FFF4A]/20 text-[#8FFF4A] px-3 py-2 rounded-xl text-center border border-[#8FFF4A]/20">Escrow 10% £32 • Stripe</div>}
                      {col.id==='final' && <div className="h-[72px] rounded-xl overflow-hidden border border-white/10 relative bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mono text-[10px] font-bold">Final Reveal Slider • 100% Trust</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="mono text-[11px] font-bold uppercase tracking-[0.15em]">Bot Army — 9 micro-bots • All Active Green</div>
                  <div className="mono text-[10px] text-white/35">Map: Oldham OL1 OL2 OL8 Manchester • Deploy bots</div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                  {BOTS.map(b=>(
                    <div key={b.id} className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 text-center hover:bg-white/[0.07] hover:border-white/10 transition group">
                      <div className="w-9 h-9 mx-auto rounded-full m-gradient flex items-center justify-center text-black font-bold text-[14px] shadow-md">{b.icon}</div>
                      <div className="mono text-[10px] font-bold mt-2 tracking-wide">{b.name}</div>
                      <div className="mono text-[8px] text-white/40 leading-tight mt-1">{b.role}</div>
                      <div className="mt-2 w-2 h-2 bg-[#8FFF4A] rounded-full mx-auto shadow-[0_0_8px_#8FFF4A]" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ROW 4 — SHOP + BOOKINGS + LIVE WORKSHOP */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 glass rounded-[28px] p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="poppins text-[16px] tracking-tight">Shop Commander</h3>
                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] bg-[#8FFF4A] text-black px-2.5 py-1 rounded-full font-bold">Shop Open • 24 items</span>
                  </div>
                </div>
                <div className="h-[180px] rounded-2xl overflow-hidden border border-white/10 mb-4 relative">
                  <img src={shopFrontImg} alt="AYO'S TAILORS Spindlegate Oldham OL1" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="poppins text-[13px] leading-tight">AYO'S TAILORS • Spindlegate Oldham OL1</div>
                    <div className="mono text-[9px] text-white/60 mt-1 leading-relaxed">Aso-Ebi fabrics stacked • green yellow pink fuchsia blue gold sequins • Shop Open</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {SHOP_ITEMS.map((item,i)=>(
                    <div key={i} className="p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.07] transition">
                      <div className="flex gap-2.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mono text-[10px] font-bold text-black shrink-0" style={{ background:item.color }}>{item.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <div className="mono text-[11px] font-semibold truncate">{item.name}</div>
                          <div className="mono text-[11px] font-bold" style={{ color:item.color }}>{item.price}</div>
                          <div className="mono text-[8px] text-white/35">Stock {item.stock}</div>
                        </div>
                      </div>
                      <div className="mt-2.5 flex gap-1.5">
                        <button className="flex-1 h-7 rounded-full bg-white/10 mono text-[9px] font-semibold hover:bg-white/15 transition">+ Add</button>
                        <button className="flex-1 h-7 rounded-full bg-[#FFE600] text-black mono text-[9px] font-bold">Boost</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 mono text-[9px] text-white/30 leading-relaxed">Escrow 5% Shop • Delivery Oldham 10mi • Supplier Ads B&Q Wickes Howdens £500/wk</div>
              </div>

              <div className="lg:col-span-4 glass rounded-[28px] p-5 lg:p-6 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="poppins text-[16px] tracking-tight">Bookings Calendar</h3>
                  <span className="mono text-[10px] bg-white/10 px-2.5 py-1 rounded-full border border-white/5">8 bookings • Timi bot</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5 mb-4">
                  {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=>(
                    <div key={d} className="text-center mono text-[9px] text-white/30 uppercase tracking-wide">{d}</div>
                  ))}
                  {Array.from({length:7}).map((_,i)=>(
                    <div key={i} className={`h-[58px] rounded-xl border flex flex-col p-1.5 transition ${i===2?'bg-[#8FFF4A]/15 border-[#8FFF4A]/30 shadow-[0_0_12px_rgba(143,255,74,0.15)]':'bg-white/[0.03] border-white/5 hover:bg-white/[0.05]'}`}>
                      <div className="mono text-[11px] font-bold">{14+i}</div>
                      {i===2 && <div className="mt-1.5 space-y-1"><div className="h-1.5 bg-[#8FFF4A] rounded-full" /><div className="h-1.5 bg-[#00E5C0] rounded-full w-3/4" /><div className="h-1.5 bg-[#FFE600] rounded-full w-1/2" /></div>}
                      {i===1 && <div className="mt-2 h-1.5 bg-white/20 rounded-full" />}
                    </div>
                  ))}
                </div>
                <div className="space-y-3 flex-1">
                  <div className="p-4 rounded-2xl bg-[#8FFF4A]/10 border border-[#8FFF4A]/15">
                    <div className="mono text-[10px] font-bold text-[#8FFF4A] tracking-wide">Today • Revenue £8,420 pipeline • Escrow 10%</div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between mono text-[11px] p-2 rounded-xl bg-black/20 border border-white/5"><span>10am Aisha fitting</span><span className="text-white/60">£320</span></div>
                      <div className="flex justify-between mono text-[11px] p-2 rounded-xl bg-black/20 border border-white/5"><span>2pm Mrs Okafor measurement</span><span className="text-white/60">£540</span></div>
                      <div className="flex justify-between mono text-[11px] p-2 rounded-xl bg-black/20 border border-white/5"><span>4pm Mr Smith kitchen final</span><span className="text-white/60">£12K</span></div>
                    </div>
                    <div className="mono text-[9px] text-white/40 mt-3 leading-relaxed">Buffer time • Escrow 10% Jobs • Calendar integration • Timi auto-scheduling • No double booking</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 mono text-[10px] text-white/50">Quick Book • + New slot • Stripe Connect • No double booking • 8 active • £8,420 pipeline</div>
                </div>
              </div>

              <div className="lg:col-span-4 glass rounded-[28px] p-5 lg:p-6 flex flex-col gap-5">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="poppins text-[16px] tracking-tight flex items-center gap-2">Live Workshop <span className={`w-2 h-2 rounded-full ${live?'bg-red-500 pulse-red':'bg-white/20'}`} /></h3>
                    <span className={`mono text-[10px] px-2.5 py-1 rounded-full border ${live?'bg-red-500/20 text-red-300 border-red-500/20':'bg-white/5 text-white/40 border-white/5'}`}>{live?`${viewers} viewers • LIVE`:'Offline • PiP'}</span>
                  </div>
                  <div className="relative h-[200px] rounded-2xl overflow-hidden border border-white/10 bg-black group">
                    <div className="w-full h-full opacity-80 group-hover:opacity-100 transition" style={{ backgroundImage:`url(${tailorImg})`, backgroundSize:'cover', backgroundPosition:'center' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-500 text-white mono text-[10px] font-bold px-3 py-1.5 rounded-full pulse-red shadow-lg">{live?'● LIVE':'○ Standby'} {live && `${viewers}`}</div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex gap-1 flex-wrap">
                        {['🔨 10','✂️ 25','❤️ 50','👑 100','🏆 500'].map(g=>(
                          <span key={g} className="mono text-[9px] bg-black/70 backdrop-blur px-2 py-1 rounded-full border border-white/10">{g}</span>
                        ))}
                      </div>
                      <div className="mono text-[8px] text-white/50 mt-2">70% you 30% platform • Hands-free PiP • Phone tripod • Gift rain</div>
                    </div>
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {giftRain.map(g=>(
                        <div key={g.id} className="absolute bottom-0 text-[22px]" style={{ left:`${g.x}%`, animation:'float-gift 3s ease-out forwards' }}>{g.emoji}</div>
                      ))}
                    </div>
                  </div>
                  <button onClick={()=>{ setLive(!live); if(!live) triggerGiftRain(); }} className={`mt-3 w-full h-12 rounded-xl font-bold text-[13px] transition flex items-center justify-center gap-2 ${live?'bg-white/10 text-white border border-white/10':'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-[0_0_20px_rgba(255,59,48,0.3)] hover:brightness-110'}`}>{live?'Stop Live • Gift Rain Active':'Start Live • M gradient red→orange • Go Live Now'}</button>
                </div>

                <div className="pt-5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="poppins text-[14px] tracking-tight">WorkCut • CapCut-like Editor</h4>
                    <span className="mono text-[9px] bg-white/10 px-2 py-1 rounded-full border border-white/5">Auto-tools</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {['Before/After','Timelapse','Milestone','Price Reveal'].map(t=>(
                      <button key={t} className="h-[64px] rounded-xl bg-white/[0.05] border border-white/10 p-2 text-left hover:bg-white/[0.08] hover:border-white/15 transition">
                        <div className="mono text-[9px] font-bold leading-tight">{t}</div>
                        <div className="mono text-[7px] text-white/35 mt-1">Template • AI</div>
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8FFF4A]/20 to-[#00E5C0]/20 border border-white/10" />
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFE600]/20 to-[#FF8A00]/20 border border-white/10" />
                    <div className="flex-1 mono text-[10px] text-white/45 leading-relaxed">Auto-tools: background removal, auto-captions Yoruba Hausa English, stickers Aso-Ebi • tailor + mechanic + builders + barber • Export to Work Feed + TikTok + IG</div>
                  </div>
                  <button className="w-full h-11 rounded-xl m-gradient text-black font-bold text-[12px] shadow-lg shadow-[#8FFF4A]/10 hover:brightness-110 transition">Promote • Export to Work Feed</button>
                </div>
              </div>
            </section>

            {/* ROW 5 — TRUST & SAFETY + MFC WALLET + GROWTH */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 glass rounded-[28px] p-5 lg:p-6">
                <h3 className="poppins text-[16px] mb-4 tracking-tight">Trust & Safety Ledger • Event-sourced</h3>
                <div className="grid grid-cols-2 gap-2 h-[150px] rounded-2xl overflow-hidden border border-white/10 mb-4">
                  <div className="relative overflow-hidden"><img src={electricianImg} alt="Consumer unit 230V RCD 30mA BS 7671 Hager RCBO" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-1.5 left-1.5 mono text-[8px] bg-black/70 px-1.5 py-0.5 rounded-full border border-white/10">BS 7671 • 230V</div></div>
                  <div className="relative overflow-hidden"><img src={plumberImg} alt="Worcester Bosch boiler Gas Safe 68C 1.2 bar" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-1.5 left-1.5 mono text-[8px] bg-black/70 px-1.5 py-0.5 rounded-full border border-white/10">Gas Safe • 68C</div></div>
                </div>
                <div className="space-y-2 mono text-[11px]">
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5"><span className="text-white/60">ID Verified</span><span className="text-[#8FFF4A] font-semibold">✓ Selfie + Liveness</span></div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5"><span className="text-white/60">Trade Cert</span><span className="text-[#8FFF4A] font-semibold">Gas Safe 123456 • BS 7671 Part P</span></div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5"><span className="text-white/60">Insurance + Portfolio</span><span className="text-[#8FFF4A] font-semibold">Video proof • £2M</span></div>
                </div>
                <div className="mt-4 p-4 rounded-2xl bg-[#8FFF4A]/10 border border-[#8FFF4A]/15">
                  <div className="mono text-[10px] font-bold text-[#8FFF4A] uppercase tracking-wide">TrustScore Formula • 4.9/5 Verified Pro</div>
                  <div className="mono text-[10px] text-white/70 mt-2 leading-relaxed">(Verified x Reviews x Completion Rate x Response Time) = 4.9/5</div>
                  <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full w-[98%] bg-[#8FFF4A] rounded-full" /></div>
                  <div className="mono text-[9px] text-white/35 mt-3 leading-relaxed">"No fake reviews — event-sourced Work Graph — every interaction logged — Trust Ledger"</div>
                </div>
              </div>

              <div className="lg:col-span-4 glass rounded-[28px] p-5 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="poppins text-[16px] tracking-tight">MFC Wallet • Gift Economy</h3>
                  <span className="mono text-[10px] bg-[#FFE600] text-black px-3 py-1 rounded-full font-bold shadow-md">1,247 coins</span>
                </div>
                <div className="h-[150px] rounded-2xl overflow-hidden border border-white/10 relative mb-4">
                  <img src={giftBoxImg} alt="Gift Economy box black velvet exploding with coins hearts crowns trophies" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="poppins text-[13px] leading-tight">MyFace Coins • 70% you • 30% platform</div>
                    <div className="mono text-[9px] text-white/60 mt-1">£600 gifts received • Starter 100 £4.99 to Workshop 2500 £79.99 • Withdraw via Stripe Connect</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {[
                    { emoji:'🔨', name:'Hammer', price:'10 (£0.10)', desc:'appreciation' },
                    { emoji:'✂️', name:'Scissors', price:'25 (£0.25)', desc:'craft love' },
                    { emoji:'❤️', name:'Craft Heart', price:'50 (£0.50)', desc:'love work' },
                    { emoji:'👑', name:'Crown', price:'100 (£1)', desc:'royal client' },
                    { emoji:'🏆', name:'Trophy', price:'500 (£5)', desc:'masterpiece' },
                  ].map(g=>(
                    <div key={g.name} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/[0.06] transition">
                      <div className="flex items-center gap-2.5"><span className="text-[14px]">{g.emoji}</span><span className="mono text-[11px] font-semibold">{g.name}</span><span className="mono text-[9px] text-white/35">{g.desc}</span></div>
                      <span className="mono text-[10px] font-bold text-[#FFE600]">{g.price}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                  <div className="mono text-[10px] p-2.5 rounded-xl bg-white/5 border border-white/5"><span className="text-[#FFE600] font-bold">Aisha</span> sent Crown 100 "Beautiful Aso-Ebi!" • 2m ago</div>
                  <div className="mono text-[10px] p-2.5 rounded-xl bg-white/5 border border-white/5"><span className="text-[#8FFF4A] font-bold">J Martinez</span> sent Hammer 10 "Fixed OBD2!" • 1h ago</div>
                </div>
                <button onClick={triggerGiftRain} className="mt-4 w-full h-11 rounded-xl bg-[#FFE600] text-black font-bold text-[12px] shadow-lg shadow-[#FFE600]/10 hover:brightness-110 transition">Withdraw via Stripe Connect • Escrow 10% Jobs 5% Shop • Gift Rain</button>
              </div>

              <div className="lg:col-span-4 glass rounded-[28px] p-5 lg:p-6">
                <h3 className="poppins text-[16px] mb-4 tracking-tight">Boost Discovery + Growth Flywheel</h3>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#8FFF4A]/10 via-[#FFE600]/10 to-[#FF8A00]/10 border border-white/10 mb-4">
                  <div className="mono text-[10px] font-bold tracking-wide uppercase">Boost Discovery • Pay to appreciate Free entrance data into traffic</div>
                  <div className="mono text-[10px] text-white/60 mt-2 leading-relaxed">Boost post £5 for 1000 views 10mi Oldham • Work Feed map • Supplier Ads B&Q Wickes Howdens £500/week</div>
                  <div className="mt-3 h-[72px] rounded-xl overflow-hidden border border-white/10 relative bg-black">
                    <div className="absolute inset-0 opacity-60" style={{ backgroundImage:`url(${mechanicImg})`, backgroundSize:'cover', backgroundPosition:'center' }} />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8FFF4A]/40 to-[#FFE600]/30 flex items-center justify-center mono text-[10px] font-bold text-black">Work Feed Map • Oldham OL1 10mi radius • Findy bot active</div>
                  </div>
                  <button className="mt-3 w-full h-9 rounded-full m-gradient text-black mono text-[10px] font-bold shadow-md">Boost £5 → 1000 views • Supplier Ads B&Q £500/wk • Growy bot</button>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {[
                    { k:'Work Feed', v:'12.4K views +23%' },
                    { k:'Shop', v:'24 items £420' },
                    { k:'Bookings', v:'8 £8,420' },
                    { k:'Trust', v:'4.9 + Gift Crown' },
                  ].map(s=>(
                    <div key={s.k} className="p-3 rounded-xl bg-white/[0.04] border border-white/5"><div className="mono text-[9px] text-white/40 uppercase tracking-wide">{s.k}</div><div className="mono text-[11px] font-bold mt-1">{s.v}</div></div>
                  ))}
                </div>
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5">
                  <div className="mono text-[10px] font-bold tracking-wide">Data→Traffic Flywheel • £618K ARR</div>
                  <div className="mono text-[9px] text-white/50 mt-2 leading-relaxed">Free entrance → Projects → Work Feed → Discovery → Trust → Commerce → Data → Traffic → Gifts → More Projects • 10K weekly users = £9,620/week • £51,528/mo without Pro</div>
                  <div className="mt-3 flex gap-1.5">
                    {['#8FFF4A','#00E5C0','#FFE600','#FF8A00'].map(c=>(
                      <div key={c} className="flex-1 h-1.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* FOOTER CTA */}
            <section className="relative rounded-[32px] overflow-hidden border border-white/10 p-[1px] mt-2">
              <div className="absolute inset-0 m-gradient opacity-90" />
              <div className="relative rounded-[31px] bg-[#050505] p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div className="flex-1">
                    <div className="mono text-[10px] text-white/40 tracking-[0.2em] uppercase">Page 26 • UPRM COMMAND CENTER DASHBOARD • PID 1 • Main after onboarding • {activeNav}</div>
                    <h2 className="poppins text-[28px] lg:text-[42px] leading-[0.9] mt-3 tracking-tight">Your Work Is Your Face.<br /><span className="m-text">Promote Enhance — Go Live Now</span></h2>
                    <div className="mono text-[11px] text-white/45 mt-4 max-w-[720px] leading-relaxed">10K weekly users = £9,620/week Gifts £600 + Jobs £6,300 + Shop £420 + Boost £1,500 + Supplier Ads £500 + Lead Unlock £300 — £51,528/mo — £618K ARR without Pro — £12,882/week with Pro £29/mo • Combination of everything for users to promote enhance work content • Touch of GOD in every stitch • Holy workshop • Production-ready for apps/web/app/(dashboard)/uprm/page.tsx + page.tsx + Work Graph WorkCut Bot Army MFC Trust Shop Bookings Live.</div>
                  </div>
                  <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[280px]">
                    <button onClick={()=>setLive(true)} className="h-[56px] px-8 rounded-2xl m-gradient text-black font-black text-[16px] shadow-[0_0_30px_rgba(143,255,74,0.3)] hover:brightness-110 transition">🚀 Go Live Now — Promote Enhance</button>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="h-[56px] rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center mono text-[9px]"><span className="font-bold text-[11px]">iOS</span>Coming Soon QR</div>
                      <div className="h-[56px] rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center mono text-[9px]"><span className="font-bold text-[11px]">Android</span>Coming Soon QR</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="mono text-[9px] text-white/20 text-center pb-8 tracking-[0.2em] uppercase leading-relaxed">Work Graph • WorkCut • Bot Army • MFC Trust • Shop Bookings Live • My Face Profile OS • Black #050505 • M gradient #8FFF4A→#00E5C0→#FFE600→#FF8A00 • Poppins Bold 800 + Inter + JetBrains Mono • Holy Divine Craft as Worship • Page 26 UPRM COMMAND CENTER DASHBOARD — PID 1 — Main after onboarding — Combination of everything — Promote Enhance Work Content</div>
          </main>
        </div>
      </div>

      {showNewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl">
          <div className="w-full max-w-[520px] glass-strong rounded-[28px] p-7">
            <div className="flex items-center justify-between mb-5">
              <h3 className="poppins text-[18px] tracking-tight">+ Create New Project • WorkCut Templates</h3>
              <button onClick={()=>setShowNewProject(false)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mono text-[10px] uppercase tracking-[0.15em] text-white/50">Project Title — Your Work Is Your Face</label>
                <input value={newProjTitle} onChange={e=>setNewProjTitle(e.target.value)} placeholder="Aso-Ebi Wedding Dress • Before/After" className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] focus:outline-none focus:border-[#8FFF4A]/50 transition" />
              </div>
              <div>
                <label className="mono text-[10px] uppercase tracking-[0.15em] text-white/50">Price • £45/m Silk • Materials • Team Ayo</label>
                <input value={newProjPrice} onChange={e=>setNewProjPrice(e.target.value)} placeholder="£320 • £45/m • £12K • £150" className="mt-2 w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-[14px] focus:outline-none focus:border-white/15 transition" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['Before/After','Timelapse','Milestone','Price Reveal'].map(t=>(
                  <div key={t} className="h-[64px] rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center mono text-[9px] font-bold p-2 text-center leading-tight">{t}</div>
                ))}
              </div>
              <div className="mono text-[10px] text-white/35 leading-relaxed">Work Graph SEO goldmine • Gift count ❤️ 24 👑 5 • Booking count • Trust badge • Project is object not content feed • Event-sourced • TrustScore • MFC Wallet • Bot Army Timi Findy Quoto • Persistent records via API</div>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={()=>setShowNewProject(false)} className="flex-1 h-12 rounded-xl bg-white/10 font-semibold text-[13px] hover:bg-white/15 transition">Cancel</button>
              <button onClick={handleCreateProject} disabled={busy || !newProjTitle.trim()} className="flex-1 h-12 rounded-xl m-gradient text-black font-bold text-[13px] disabled:opacity-50 shadow-lg"> {busy ? 'Creating...' : 'Create Project • Promote Enhance'} </button>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && <div onClick={()=>setSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm" />}
    </div>
  );
}
