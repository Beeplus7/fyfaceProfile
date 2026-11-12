import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Play,
  X,
  Plus,
  Check,
  ShieldCheck,
  Wallet,
  MapPin,
  Star,
  Clock,
  Users,
  SlidersHorizontal,
  BadgeCheck,
  Trash2,
} from 'lucide-react';
import {
  createDatasetOrder,
  createPayoutRequest,
  createSupplierListing,
  deleteSupplierListing,
  listCatalog,
  listSupplierListings,
  type SupplierListing,
} from '../lib/datasetStore';
import { isSupabaseConfigured } from '../lib/supabase';

type Dataset = {
  id: string;
  title: string;
  category: string;
  type: string;
  badge: string;
  priceHr: number;
  total: number;
  hours: number;
  pros: number;
  quality: number;
  languages: string;
  hands: number;
  blurred: number;
  seller: string;
  trust: number;
  location: string;
  emoji: string;
  gradient: string;
  labels: string[];
  buyers: string;
};

const DATASETS: Dataset[] = [
  {id:"d1",title:"500 hrs Tailor Sewing — Aso-Ebi + Agbada",category:"Tailor",type:"Recorded",badge:"RECORDED $60/hr",priceHr:60,total:30000,hours:500,pros:124,quality:96,languages:"Yoruba / Pidgin / English",hands:82,blurred:18,seller:"AYO'S TAILORS",trust:4.9,location:"Lagos + Oldham",emoji:"🧵",gradient:"linear-gradient(135deg,#8FFF4A,#00E5C0)",labels:["[00:01] hand reaches for towel, folds left to right","[00:09] needle guides ankara seam, presser foot down"],buyers:"Figure AI · Dyna"},
  {id:"d2",title:"Mechanic EV — Tesla BMS Diagnostics + Battery Swap",category:"Mechanic",type:"Live Capture",badge:"LIVE CAPTURE $50/hr",priceHr:50,total:25000,hours:500,pros:86,quality:97,languages:"English / Pidgin",hands:91,blurred:9,seller:"EV WORKS MANCHESTER",trust:4.8,location:"Manchester",emoji:"🔋",gradient:"linear-gradient(135deg,#1A7CFF,#00E5C0)",labels:["[00:01] technician lifts BMS cover with torque driver","[00:12] multimeter probes cell group, reading checked"],buyers:"Physical Intelligence · Troveo"},
  {id:"d3",title:"Chef — Jollof, Suya + Small-Chop Service",category:"Chef",type:"Recorded",badge:"RECORDED $60/hr",priceHr:60,total:18000,hours:300,pros:98,quality:95,languages:"Yoruba / Hausa / English",hands:88,blurred:12,seller:"LAGOS KITCHEN COLLECTIVE",trust:4.9,location:"Lagos",emoji:"🍲",gradient:"linear-gradient(135deg,#FFE600,#FF8A00)",labels:["[00:01] hand stirs tomato base, steam rises","[00:08] spoon tastes broth, adjusts seasoning"],buyers:"Scale AI · Encord"},
  {id:"d4",title:"Builder — Block Laying, Plaster + Scaffold Work",category:"Builder",type:"Live Capture",badge:"LIVE CAPTURE $50/hr",priceHr:50,total:20000,hours:400,pros:74,quality:94,languages:"Pidgin / English",hands:94,blurred:6,seller:"ABUJA BUILD CREW",trust:4.7,location:"Abuja",emoji:"🧱",gradient:"linear-gradient(135deg,#FF8A00,#FFE600)",labels:["[00:01] trowel spreads mortar in a straight bed","[00:10] block set, level checked both ways"],buyers:"Kinetic Blocks · Surge AI"},
  {id:"d5",title:"Braider — Knotless, Cornrows + Wig Install",category:"Tailor",type:"Recorded",badge:"RECORDED $60/hr",priceHr:60,total:12000,hours:200,pros:112,quality:96,languages:"Igbo / English",hands:97,blurred:3,seller:"OLDHAM BRAID STUDIO",trust:5.0,location:"Oldham",emoji:"💇🏾",gradient:"linear-gradient(135deg,#00E5C0,#1A7CFF)",labels:["[00:01] fingers part hair into clean sections","[00:07] braid tension even, feed-in added"],buyers:"Mercor · Defined.ai"},
  {id:"d6",title:"Farmer — Cassava Harvest, Peeling + Processing",category:"Farmer",type:"Recorded",badge:"RECORDED $60/hr",priceHr:60,total:15000,hours:250,pros:68,quality:93,languages:"Igbo / Pidgin",hands:89,blurred:11,seller:"ENUGU FARM NETWORK",trust:4.8,location:"Accra + Enugu",emoji:"🌾",gradient:"linear-gradient(135deg,#8FFF4A,#FFE600)",labels:["[00:01] hand pulls cassava stem, root lifted","[00:09] peeler removes skin in long strokes"],buyers:"Troveo · Scale AI"},
  {id:"d7",title:"Barber — Fades, Line-Ups + Hot-Towel Shave",category:"Barber",type:"Live Capture",badge:"LIVE CAPTURE $50/hr",priceHr:50,total:10000,hours:200,pros:76,quality:95,languages:"English / Yoruba",hands:93,blurred:7,seller:"OLDHAM FADE HOUSE",trust:4.9,location:"Oldham",emoji:"💈",gradient:"linear-gradient(135deg,#050505,#1A7CFF)",labels:["[00:01] clipper moves upward, fade blended","[00:08] razor defines hairline, brush clears"],buyers:"Dyna · Figure AI"},
  {id:"d8",title:"Tailor Bundle — 1,000 hrs Sewing + Pattern Cutting",category:"Tailor",type:"Bundle",badge:"BUNDLE $100k",priceHr:100,total:100000,hours:1000,pros:210,quality:97,languages:"Yoruba / English",hands:85,blurred:15,seller:"MYFACE ATELIER NETWORK",trust:4.9,location:"Lagos + Oldham",emoji:"✂️",gradient:"linear-gradient(135deg,#FF8A00,#1A7CFF)",labels:["[00:01] pattern chalked on ankara, scissors cut","[00:14] seam pinned, machine stitch started"],buyers:"Figure AI · Physical Intelligence"},
  {id:"d9",title:"Language — Yoruba Market Talk + Cooking Narration",category:"Language",type:"Language",badge:"LANGUAGE $120/hr",priceHr:120,total:12000,hours:100,pros:42,quality:98,languages:"Yoruba / English",hands:76,blurred:24,seller:"YORUBA VOICE LAB",trust:4.9,location:"Lagos",emoji:"🗣️",gradient:"linear-gradient(135deg,#00E5C0,#FFE600)",labels:["[00:01] speaker names ingredients in Yoruba","[00:06] repeats phrase, then English gloss"],buyers:"Mercor · Encord"},
  {id:"d10",title:"Mechanic Bundle — 1,000 hrs EV + Engine Rebuild",category:"Mechanic",type:"Bundle",badge:"BUNDLE $100k",priceHr:100,total:100000,hours:1000,pros:145,quality:96,languages:"English / Hausa",hands:90,blurred:10,seller:"NAIROBI + MANCHESTER GARAGE",trust:4.8,location:"Nairobi + Manchester",emoji:"🔧",gradient:"linear-gradient(135deg,#1A7CFF,#8FFF4A)",labels:["[00:01] socket removes engine mount bolts","[00:11] gasket inspected, surface cleaned"],buyers:"Defined.ai · Kinetic Blocks"},
  {id:"d11",title:"Chef Bundle — 1,000 hrs West African + UK Kitchens",category:"Chef",type:"Bundle",badge:"BUNDLE $100k",priceHr:100,total:100000,hours:1000,pros:180,quality:95,languages:"Hausa / Yoruba / English",hands:87,blurred:13,seller:"CHEF COLLECTIVE UK + NG",trust:4.9,location:"Lagos + Manchester",emoji:"👨🏾‍🍳",gradient:"linear-gradient(135deg,#FFE600,#00E5C0)",labels:["[00:01] knife dices onion, board wiped","[00:08] pan deglazed, stock added"],buyers:"Surge AI · Scale AI"},
  {id:"d12",title:"Language — Swahili + Pidgin Work Talk",category:"Language",type:"Language",badge:"LANGUAGE $120/hr",priceHr:120,total:9600,hours:80,pros:38,quality:94,languages:"Swahili / Pidgin / English",hands:72,blurred:28,seller:"NAIROBI VOICE LAB",trust:4.8,location:"Nairobi",emoji:"🎙️",gradient:"linear-gradient(135deg,#8FFF4A,#1A7CFF)",labels:["[00:01] speaker greets customer in Swahili","[00:07] work instruction repeated in Pidgin"],buyers:"Troveo · Mercor"},
];

function Pill({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border px-3 py-2 text-[12px] font-semibold transition ${
        active
          ? 'border-[#0A1931] bg-[#0A1931] text-white'
          : 'border-[#D4CBB8] bg-[#FFFDF7] text-[#0A1931] hover:border-[#0A1931]'
      }`}
    >
      {children}
    </button>
  );
}

export default function B2BDatasetStorePage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [typeTab, setTypeTab] = useState('All');
  const [priceFilter, setPriceFilter] = useState('All');
  const [location, setLocation] = useState('All');
  const [quality, setQuality] = useState('All');
  const [language, setLanguage] = useState('All');
  const [cart, setCart] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [license, setLicense] = useState('Single lab');
  const [preview, setPreview] = useState<Dataset | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hrs, setHrs] = useState(5);
  const [faceBlur, setFaceBlur] = useState(true);
  const [handsOnly, setHandsOnly] = useState(false);
  const [allowSale, setAllowSale] = useState(true);
  const [listings, setListings] = useState<SupplierListing[]>([]);
  const [loadError, setLoadError] = useState('');
  const [backendNote, setBackendNote] = useState('');
  const [catalog, setCatalog] = useState<Dataset[]>(DATASETS);
  const [form, setForm] = useState({
    title: '',
    category: 'Tailor',
    type: 'Recorded',
    hours: '20',
    location: 'Lagos',
    language: 'Yoruba',
    price: '60',
    seller: '',
  });
  const [formMsg, setFormMsg] = useState('');
  const [formBusy, setFormBusy] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');
  const [orderBusy, setOrderBusy] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('Opay');
  const [withdrawAmount, setWithdrawAmount] = useState('250');
  const [withdrawMsg, setWithdrawMsg] = useState('');
  const [withdrawBusy, setWithdrawBusy] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reloadListings = async () => {
    const res = await listSupplierListings();
    setListings(res.rows);
    setLoadError(res.error || '');
    setBackendNote(
      res.source === 'supabase'
        ? 'Live Supabase listings connected.'
        : isSupabaseConfigured
          ? 'Using local fallback until dataset tables are applied.'
          : 'Local demo store — apply supabase/dataset_store.sql for live sales.',
    );
  };

  useEffect(() => {
    reloadListings();
    listCatalog().then((res) => {
      if (res.source === 'supabase' && res.rows.length) {
        setCatalog(
          res.rows.map((r) => ({
            id: r.id,
            title: r.title,
            category: r.category,
            type: r.capture_type,
            badge: r.badge || '',
            priceHr: Number(r.price_hr),
            total: Number(r.total_price),
            hours: Number(r.hours),
            pros: r.pros_count,
            quality: Number(r.quality_score),
            languages: r.languages,
            hands: r.hands_pct,
            blurred: r.blurred_pct,
            seller: r.seller,
            trust: Number(r.trust_score),
            location: r.location,
            emoji: r.emoji || '🧵',
            gradient: r.gradient || 'linear-gradient(135deg,#8FFF4A,#00E5C0)',
            labels: Array.isArray(r.sample_labels) ? r.sample_labels : [],
            buyers: r.buyers || '',
          })),
        );
      }
    });
  }, []);

  useEffect(() => {
    if (playing) {
      timerRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 30) {
            setPlaying(false);
            return 30;
          }
          return p + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing]);

  const filtered = useMemo(() => {
    return catalog.filter((d) => {
      if (category !== 'All' && d.category !== category) return false;
      if (typeTab !== 'All' && d.type !== typeTab) return false;
      if (priceFilter !== 'All') {
        if (priceFilter === '$33/hr' && d.priceHr > 40) return false;
        if (priceFilter === '$97/hr' && !(d.priceHr >= 80 && d.priceHr <= 120)) return false;
        if (priceFilter === '$300/hr' && d.priceHr < 100) return false;
        if (priceFilter === 'Custom' && d.type !== 'Bundle') return false;
      }
      if (location !== 'All' && !d.location.includes(location)) return false;
      if (quality === '90%+' && d.quality < 90) return false;
      if (quality === '95%+' && d.quality < 95) return false;
      if (language !== 'All' && !d.languages.includes(language)) return false;
      if (
        search &&
        !(d.title + ' ' + d.seller + ' ' + d.location + ' ' + d.languages)
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [catalog, search, category, typeTab, priceFilter, location, quality, language]);

  const cartItems = catalog.filter((d) => cart.includes(d.id));
  const cartTotal = cartItems.reduce((s, d) => s + d.total, 0);
  const liveEarn = hrs * 50;
  const recEarn = hrs * 60;

  const addToCart = (id: string) => {
    if (!cart.includes(id)) setCart([...cart, id]);
    setCartOpen(true);
  };

  const submitListing = async () => {
    if (!form.title.trim() || !form.seller.trim()) {
      setFormMsg('Add a dataset title and seller name to list it.');
      return;
    }
    setFormBusy(true);
    setFormMsg('');
    try {
      await createSupplierListing({
        title: form.title.trim(),
        category: form.category,
        type: form.type,
        hours: Number(form.hours) || 0,
        location: form.location,
        language: form.language,
        price: Number(form.price) || 0,
        seller: form.seller.trim(),
      });
      await reloadListings();
      setFormMsg('Listed — your dataset is saved and now appears in Supplier Listings.');
      setForm({
        title: '',
        category: 'Tailor',
        type: 'Recorded',
        hours: '20',
        location: 'Lagos',
        language: 'Yoruba',
        price: '60',
        seller: '',
      });
    } catch (e: unknown) {
      setFormMsg(e instanceof Error ? e.message : 'Could not save this listing yet.');
    }
    setFormBusy(false);
  };

  const removeListing = async (id: string) => {
    try {
      await deleteSupplierListing(id);
      await reloadListings();
    } catch (e: unknown) {
      setFormMsg(e instanceof Error ? e.message : 'Could not remove that listing.');
    }
  };

  const checkout = async () => {
    if (cart.length === 0) {
      setOrderMsg('Your cart is empty.');
      return;
    }
    setOrderBusy(true);
    setOrderMsg('');
    try {
      const res = await createDatasetOrder({
        items: cartItems.map((d) => ({ id: d.id, title: d.title, total: d.total })),
        license,
        total: cartTotal,
      });
      setOrderMsg(
        `Order saved (${res.source}) — ${cart.length} dataset(s), ${license} licence, $${cartTotal.toLocaleString()}.`,
      );
      setCart([]);
    } catch (e: unknown) {
      setOrderMsg(e instanceof Error ? e.message : 'Checkout could not be saved.');
    }
    setOrderBusy(false);
  };

  const withdraw = async () => {
    if (Number(withdrawAmount) < 5) {
      setWithdrawMsg('Minimum withdrawal is £5 / ₦5,000.');
      return;
    }
    setWithdrawBusy(true);
    setWithdrawMsg('');
    try {
      const res = await createPayoutRequest({
        method: withdrawMethod,
        amount: Number(withdrawAmount),
      });
      setWithdrawMsg(`Payout request saved (${res.source}) — £${withdrawAmount} via ${withdrawMethod}.`);
    } catch (e: unknown) {
      setWithdrawMsg(e instanceof Error ? e.message : 'Payout request could not be saved.');
    }
    setWithdrawBusy(false);
  };

  return (
    <div
      data-safe-area-inset-root
      className="b2b-store min-h-screen overflow-x-clip bg-[#FFFDF7] text-[#0A1931] selection:bg-[#FFC300]/35"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="bg-[#0A1931] px-4 py-3 text-center text-[12px] text-white sm:text-[13px]">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-2">
          <span className="font-mono2 text-[#8FFF4A]">B2B DATASET MARKETPLACE</span>
          <span className="hidden opacity-40 sm:inline">•</span>
          <span>Verified African + UK work video for Physical AI · Consent-first</span>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold">
            {isSupabaseConfigured ? 'Supabase ready' : 'Demo mode'}
          </span>
        </div>
      </div>

      <div className="sticky top-[calc(64px+var(--safe-area-inset-top))] z-30 border-b border-[#D4CBB8] bg-[#FFFDF7]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative min-w-0 flex-1">
            <div className="flex max-w-[720px] items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-4 py-2.5">
              <Search size={17} className="shrink-0 text-[#5B6470]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search datasets — "tailor sewing" "mechanic EV" "Yoruba cooking"'
                className="min-w-0 flex-1 bg-transparent text-[13px] outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full border border-[#D4CBB8] bg-white p-2.5"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {cart.length > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-[#FF8A00] text-[10px] font-bold text-white">
                {cart.length}
              </span>
            ) : null}
          </button>
          <a
            href="#pros"
            className="hidden rounded-full bg-[#FFC300] px-3 py-2.5 text-[12px] font-extrabold text-[#0A1931] sm:inline-flex"
          >
            List Your Video
          </a>
          <a
            href="#datasets"
            className="hidden rounded-full bg-[#0A1931] px-3 py-2.5 text-[12px] font-extrabold text-white sm:inline-flex"
          >
            Buy Dataset
          </a>
        </div>
      </div>

      <section className="relative overflow-hidden">
        <div className="b2b-gradient pointer-events-none absolute inset-0 opacity-[0.12]" />
        <div className="relative mx-auto grid max-w-[1280px] items-center gap-8 px-4 py-10 sm:py-14 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-1.5 text-[11px] font-bold font-mono2 shadow-sm">
              <span className="b2b-live-dot h-2 w-2 rounded-full bg-[#00E5C0]" /> B2B DATASET STORE · VERIFIED
              WORK VIDEO
            </div>
            <h1 className="font-display mt-4 text-[42px] font-black leading-[0.95] tracking-tight text-[#0A1931] sm:text-[62px]">
              Buy Verified
              <br />
              <span className="b2b-text">African + UK Work Video</span>
              <br />
              For Physical AI
            </h1>
            <p className="mt-4 max-w-[620px] text-[16px] leading-relaxed text-[#5B6470] sm:text-[18px]">
              1,000+ hrs of quality-checked, labelled, consent-cleared video from real tailors, mechanics,
              chefs, builders. Hands in view. Tools in action. Real work, not chores.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#datasets"
                className="rounded-full bg-[#0A1931] px-5 py-3.5 text-[14px] font-bold text-white"
              >
                Browse Datasets →
              </a>
              <a href="#pros" className="b2b-gradient rounded-full px-5 py-3.5 text-[14px] font-bold text-[#0A1931]">
                Become a Supplier — List Your Video
              </a>
              <Link
                to="/video-to-cash"
                className="rounded-full border-2 border-[#0A1931] bg-[#FFF8E1] px-5 py-3.5 text-[14px] font-extrabold"
              >
                Video → Cash guide
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-semibold text-[#0A1931]">
              <span className="flex gap-1.5">
                <ShieldCheck size={15} className="text-[#00A66C]" />
                Consent-cleared
              </span>
              <span>Face-blur option</span>
              <span>GDPR</span>
              <span>NDPR</span>
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['12,480 hrs', 'available'],
                ['1,240', 'pros'],
                ['94%', 'avg Quality Score'],
                ['38', 'labs buying'],
              ].map(([v, l]) => (
                <div
                  key={l}
                  className="rounded-2xl border border-[#D4CBB8] bg-[#F0E9DB] p-3 shadow-[0_12px_32px_rgba(10,25,49,0.08)]"
                >
                  <div className="font-display text-[20px] font-black">{v}</div>
                  <div className="text-[11px] text-[#5B6470]">{l}</div>
                </div>
              ))}
            </div>
            {backendNote ? (
              <p className="mt-4 text-[12px] font-medium text-[#5B6470]">{backendNote}</p>
            ) : null}
          </div>
          <div className="rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-4 shadow-[0_18px_45px_rgba(10,25,49,0.08)]">
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: 'linear-gradient(135deg,#0A1931,#1A7CFF)' }}
            >
              <div className="font-mono2 text-[11px] text-[#8FFF4A]">FEATURED · LIVE CAPTURE</div>
              <div className="my-3 text-[56px] leading-none">{catalog[0]?.emoji || '🧵'}</div>
              <h3 className="font-display text-[20px] font-bold leading-tight">
                Tailor Sewing — Aso-Ebi + Agbada
              </h3>
              <p className="mt-2 text-[13px] text-white/70">Lagos + Oldham · 500 hrs · Quality 96%</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setPreview(catalog[0])}
                  className="flex items-center gap-1 rounded-full bg-white px-4 py-2.5 text-[12px] font-bold text-[#0A1931]"
                >
                  <Play size={14} /> Preview 30 sec
                </button>
                <button
                  type="button"
                  onClick={() => addToCart('d1')}
                  className="b2b-gradient rounded-full px-4 py-2.5 text-[12px] font-bold text-[#0A1931]"
                >
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px] font-semibold">
              <div className="rounded-xl bg-[#F0E9DB] py-2">
                Hands-only
                <br />
                <b>82%</b>
              </div>
              <div className="rounded-xl bg-[#EFFAF6] py-2">
                Face-blurred
                <br />
                <b>18%</b>
              </div>
              <div className="rounded-xl bg-[#FFF8E1] py-2">
                TrustScore
                <br />
                <b>★ 4.9</b>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-[#5B6470]">
              Bought by teams at Figure AI · Dyna · Troveo
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4">
        <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-4 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
          <div className="flex items-center gap-2 text-[13px] font-bold">
            <SlidersHorizontal size={16} /> Filter the marketplace{' '}
            <span className="ml-auto font-mono2 text-[11px] text-[#1A7CFF]">
              {filtered.length} of {catalog.length} datasets
            </span>
          </div>
          <div className="mt-3 space-y-3">
            <div>
              <div className="mb-1.5 font-mono2 text-[11px] font-bold text-[#5B6470]">CATEGORY</div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {['All', 'Tailor', 'Mechanic', 'Chef', 'Builder', 'Barber', 'Farmer', 'Language'].map((c) => (
                  <Pill key={c} active={category === c} onClick={() => setCategory(c)}>
                    {c}
                  </Pill>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ['TYPE', typeTab, setTypeTab, ['All', 'Live Capture', 'Recorded', 'Bundle', 'Language']],
                ['PRICE', priceFilter, setPriceFilter, ['All', '$33/hr', '$97/hr', '$300/hr', 'Custom']],
                [
                  'LOCATION',
                  location,
                  setLocation,
                  ['All', 'Lagos', 'Oldham', 'Nairobi', 'Accra', 'Manchester', 'Abuja'],
                ],
                ['QUALITY', quality, setQuality, ['All', '90%+', '95%+']],
              ].map(([label, val, setter, opts]) => (
                <label key={label as string} className="block">
                  <span className="font-mono2 text-[11px] font-bold text-[#5B6470]">{label as string}</span>
                  <select
                    value={val as string}
                    onChange={(e) => (setter as (v: string) => void)(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
                  >
                    {(opts as string[]).map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <div>
              <div className="mb-1.5 font-mono2 text-[11px] font-bold text-[#5B6470]">LANGUAGE</div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {['All', 'Yoruba', 'Igbo', 'Hausa', 'Pidgin', 'Swahili', 'English'].map((l) => (
                  <Pill key={l} active={language === l} onClick={() => setLanguage(l)}>
                    {l}
                  </Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="datasets" className="mx-auto max-w-[1280px] px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono2 text-[11px] font-bold text-[#1A7CFF]">MARKETPLACE · TWO-SIDED</p>
            <h2 className="font-display mt-1 text-[30px] font-black leading-none sm:text-[38px]">
              Datasets labs can train on today
            </h2>
          </div>
          <div className="flex gap-2">
            {['All', 'Live Capture', 'Recorded'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeTab(t)}
                className={`rounded-full border px-4 py-2 text-[12px] font-bold ${
                  typeTab === t
                    ? 'border-[#0A1931] bg-[#0A1931] text-white'
                    : 'border-[#D4CBB8] bg-[#FFFDF7]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <article
              key={d.id}
              className="flex flex-col overflow-hidden rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] shadow-[0_12px_32px_rgba(10,25,49,0.08)]"
            >
              <div className="relative p-4 pb-0">
                <div className="relative overflow-hidden rounded-2xl p-4 text-white" style={{ background: d.gradient }}>
                  <span className="absolute right-4 top-3 text-[44px]">{d.emoji}</span>
                  <span className="inline-block rounded-full bg-black/25 px-2.5 py-1 font-mono2 text-[10px] font-bold backdrop-blur">
                    {d.badge}
                  </span>
                  <div className="mt-10 pr-14 font-display text-[19px] font-bold leading-tight">{d.title}</div>
                  <div className="mt-2 flex items-center gap-1 text-[12px]">
                    <MapPin size={13} />
                    {d.location}
                  </div>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-[#5B6470]">
                  <span className="flex gap-1">
                    <Clock size={13} />
                    {d.hours} hrs
                  </span>
                  <span className="flex gap-1">
                    <Users size={13} />
                    {d.pros} pros
                  </span>
                  <span>Quality {d.quality}%</span>
                  <span>{d.languages}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="flex-1 rounded-xl bg-[#F0E9DB] px-2 py-2 text-center text-[11px]">
                    Hands-only
                    <br />
                    <b>{d.hands}%</b>
                  </div>
                  <div className="flex-1 rounded-xl bg-[#EFFAF6] px-2 py-2 text-center text-[11px]">
                    Face-blurred
                    <br />
                    <b>{d.blurred}%</b>
                  </div>
                </div>
                <div className="mt-3 rounded-xl border border-[#FFE600] bg-[#FFFBEB] p-3 text-[11px] leading-relaxed">
                  <b className="font-mono2">SAMPLE LABELS</b>
                  <div className="mt-1 text-[#555]">{d.labels[0]}</div>
                  <div className="text-[#555]">{d.labels[1]}</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-[22px] font-black">
                      ${d.priceHr}
                      <span className="text-[13px] font-medium text-[#5B6470]">/hr</span>
                    </div>
                    <div className="text-[12px] text-[#5B6470]">
                      Total ${d.total.toLocaleString()} · {d.hours} hrs
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div className="flex items-center justify-end gap-1 font-bold">
                      <Star size={13} className="fill-[#FFE600] text-[#FFE600]" />
                      {d.trust}
                    </div>
                    <div className="text-[#5B6470]">{d.seller}</div>
                    <div className="flex items-center justify-end gap-1 text-[#00A66C]">
                      <BadgeCheck size={13} /> Verified
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-[#5B6470]">Bought by: {d.buyers}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreview(d)}
                    className="flex items-center justify-center gap-1 rounded-full border border-[#D4CBB8] py-2.5 text-[12px] font-bold"
                  >
                    <Play size={13} /> Preview 30 sec
                  </button>
                  <button
                    type="button"
                    onClick={() => addToCart(d.id)}
                    className="flex items-center justify-center gap-1 rounded-full bg-[#F0E9DB] py-2.5 text-[12px] font-bold"
                  >
                    <Plus size={14} /> Add to Cart
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(d.id)}
                    className="rounded-full bg-[#0A1931] py-2.5 text-[12px] font-bold text-white"
                  >
                    Buy Dataset
                  </button>
                  <a
                    href="#pros"
                    className="b2b-gradient rounded-full py-2.5 text-center text-[12px] font-bold text-[#0A1931]"
                  >
                    List Similar
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#D4CBB8] bg-[#FFF7ED] p-6 text-center">
            <b>No datasets match that filter.</b>
            <p className="mt-1 text-sm text-[#5B6470]">
              Try clearing the location, language or quality filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setTypeTab('All');
                setPriceFilter('All');
                setLocation('All');
                setQuality('All');
                setLanguage('All');
                setSearch('');
              }}
              className="mt-3 rounded-full bg-[#0A1931] px-4 py-2 text-sm font-bold text-white"
            >
              Clear all filters
            </button>
          </div>
        ) : null}
      </main>

      <section className="mx-auto max-w-[1280px] px-4 pb-10">
        <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-5">
          <h3 className="font-display text-[22px] font-bold">
            Supplier Listings{' '}
            <span className="font-sans text-[13px] font-medium text-[#5B6470]">
              — saved to Supabase when live, otherwise local
            </span>
          </h3>
          <p className="mt-1 text-[13px] text-[#5B6470]">
            {loadError || `${listings.length} supplier listing(s) saved.`}
          </p>
          {listings.length === 0 ? (
            <p className="mt-4 rounded-2xl bg-[#FFFDF7] p-4 text-[13px]">
              No supplier listings yet. Use the “List Your Video” form below — no photo or file upload is
              needed.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((r) => (
                <div key={r.id} className="relative rounded-2xl border border-[#D4CBB8] bg-[#FFFDF7] p-4">
                  <button
                    type="button"
                    onClick={() => removeListing(r.id)}
                    className="absolute right-3 top-3 text-[#999]"
                    aria-label="Remove listing"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="font-mono2 text-[10px] font-bold text-[#1A7CFF]">
                    {String(r.type || '').toUpperCase()} · {r.category}
                  </div>
                  <b className="mt-1 block pr-6">{r.title}</b>
                  <p className="mt-1 text-[12px] text-[#5B6470]">
                    {r.hours} hrs · {r.location} · {r.language} · ${r.price}/hr · {r.seller}
                  </p>
                  <p className="mt-2 text-[11px] text-[#999]">Listed {r.createdLabel}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="pricing" className="bg-[#0A1931] py-12 text-white">
        <div className="mx-auto max-w-[1280px] px-4">
          <p className="font-mono2 text-[11px] font-bold text-[#8FFF4A]">
            DETAILED DATASET LISTINGS · TRANSPARENT RATES
          </p>
          <h2 className="font-display mt-1 text-[32px] font-black">Know the rate before you buy or list</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {(
              [
                [
                  'LIVE CAPTURE',
                  'Live Egocentric $50/hr',
                  'Live Teleoperation $50–$300/hr',
                  'Live Directed $30–$100/hr',
                  'Live Language $40–$120/hr',
                  'Live QA $25–$75/hr',
                ],
                [
                  'RECORDED',
                  'Median $33/hr',
                  'Offer $97/hr',
                  '$1–$4/min · $60–$240/hr',
                  'Defined.ai $100–$300/hr',
                  'Veritone refined $1,000/hr',
                ],
                [
                  'BUNDLES',
                  '1,000 hrs Tailor $50k–$500k',
                  '1,000 hrs Mechanic EV $50k–$500k',
                  '1,000 hrs Chef $50k–$500k',
                  'Exclusive licence on request',
                  'API + download delivery',
                ],
              ] as string[][]
            ).map(([title, ...rows]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <h3 className="font-display font-bold">{title}</h3>
                <ul className="mt-3 space-y-2.5 text-[13px] text-white/80">
                  {rows.map((r) => (
                    <li key={r} className="flex gap-2">
                      <Check size={15} className="mt-0.5 shrink-0 text-[#8FFF4A]" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="labs" className="mx-auto grid max-w-[1280px] gap-6 px-4 py-12 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
          <p className="font-mono2 text-[11px] font-bold text-[#1A7CFF]">FOR LABS · BUY DATASET FLOW</p>
          <h3 className="font-display mt-1 text-[28px] font-black">From search to training data in four steps</h3>
          <ol className="mt-5 space-y-4">
            {[
              ['1', 'Browse / Search', 'Filter by trade, language, location and quality.'],
              ['2', 'Preview 30 sec + Check Quality', 'Watch the sample, read labels, check the Quality Score.'],
              [
                '3',
                'Buy / License',
                'Checkout with Stripe. Choose Single, Multi-lab or Exclusive. Download or API access.',
              ],
              ['4', 'Train your robot', 'Use labelled, consent-cleared video in your pipeline.'],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-3">
                <span className="b2b-gradient grid h-8 w-8 shrink-0 place-items-center rounded-full font-bold text-[#0A1931]">
                  {n}
                </span>
                <div>
                  <b className="text-[14px]">{t}</b>
                  <p className="text-[13px] text-[#5B6470]">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div id="pros" className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6">
          <p className="font-mono2 text-[11px] font-bold text-[#FF8A00]">FOR PROS · LIST YOUR VIDEO FLOW</p>
          <h3 className="font-display mt-1 text-[28px] font-black">Your work is your face. Not your CV.</h3>
          <ol className="mt-5 space-y-3 text-[13px]">
            {[
              ['1', 'Go Live or Record while at work', 'Capture the job you already do — no extra setup.'],
              [
                '2',
                'WorkCut auto-labels + Quality Check',
                'Hands in view · Movement · Audio clear · Quality Score 94%.',
              ],
              [
                '3',
                'Consent toggle',
                'Face-blur / Hands-only / Allow sale — Yes or No, change anytime.',
              ],
              [
                '4',
                'List on Store',
                'Earn $50 live + $60–$220 recorded per hour. Withdraw via Stripe / Opay / PalmPay / M-Pesa.',
              ],
            ].map(([n, t, d]) => (
              <li key={n} className="flex gap-3 rounded-2xl bg-[#FFFDF7] p-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#0A1931] text-[12px] font-bold text-white">
                  {n}
                </span>
                <div>
                  <b>{t}</b>
                  <p className="text-[#5B6470]">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 rounded-2xl bg-[#FFFDF7] p-4">
            <div className="flex items-center justify-between">
              <b>Earnings calculator</b>
              <span className="rounded-full bg-[#F0E9DB] px-2 py-1 font-mono2 text-[12px]">{hrs} hrs / week</span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              value={hrs}
              onChange={(e) => setHrs(Number(e.target.value))}
              className="b2b-range mt-3 w-full"
            />
            <div className="mt-2 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-[#F0E9DB] p-2">
                <div className="text-[11px]">Live</div>
                <b>${liveEarn}</b>
              </div>
              <div className="rounded-xl bg-[#F0E9DB] p-2">
                <div className="text-[11px]">Recorded</div>
                <b>${recEarn}</b>
              </div>
              <div className="b2b-gradient rounded-xl p-2">
                <div className="text-[11px]">Total / week</div>
                <b>${liveEarn + recEarn}</b>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1280px] gap-6 px-4 pb-12 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-6 shadow-[0_12px_32px_rgba(10,25,49,0.08)]">
          <h3 className="font-display text-[22px] font-bold">List Your Video — supplier form</h3>
          <p className="mt-1 text-[13px] text-[#5B6470]">
            Describe the work. Your listing is saved to Supabase (or local fallback) and appears above.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-[12px] font-bold">Dataset title</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. 40 hrs Tailor — School Uniforms, Lagos"
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Seller / studio</span>
              <input
                value={form.seller}
                onChange={(e) => setForm({ ...form, seller: e.target.value })}
                placeholder="Your studio name"
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Category</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              >
                {['Tailor', 'Mechanic', 'Chef', 'Builder', 'Barber', 'Farmer', 'Language'].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Type</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              >
                <option>Recorded</option>
                <option>Live Capture</option>
                <option>Bundle</option>
                <option>Language</option>
              </select>
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Hours</span>
              <input
                type="number"
                min={1}
                value={form.hours}
                onChange={(e) => setForm({ ...form, hours: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Location</span>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Language</span>
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              />
            </label>
            <label className="block">
              <span className="text-[12px] font-bold">Price / hour ($)</span>
              <input
                type="number"
                min={1}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-[#FFFDF7] px-3 py-2.5 text-[13px]"
              />
            </label>
          </div>
          <button
            type="button"
            disabled={formBusy}
            onClick={submitListing}
            className="b2b-gradient mt-4 rounded-full px-5 py-3 text-[13px] font-bold text-[#0A1931] disabled:opacity-50"
          >
            {formBusy ? 'Saving listing…' : 'Save & List on Store'}
          </button>
          {formMsg ? <p className="mt-3 text-[13px] font-medium">{formMsg}</p> : null}
        </div>

        <div className="space-y-6">
          <div id="wallet" className="rounded-[24px] bg-[#0A1931] p-6 text-white">
            <div className="flex justify-between">
              <b className="font-display">Dataset Wallet</b>
              <Wallet />
            </div>
            <div className="mt-4">
              <div className="text-[12px] text-white/60">Balance</div>
              <div className="font-display text-[32px] font-black">
                £1,240 <span className="text-[18px] text-white/60">+ $850</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div className="rounded-xl bg-white/10 py-2">
                Bookings
                <br />
                <b>£640</b>
              </div>
              <div className="rounded-xl bg-white/10 py-2">
                Dataset
                <br />
                <b>$850</b>
              </div>
              <div className="rounded-xl bg-white/10 py-2">
                Gifts
                <br />
                <b>£120</b>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <select
                value={withdrawMethod}
                onChange={(e) => setWithdrawMethod(e.target.value)}
                className="rounded-xl bg-white px-3 py-2.5 text-[13px] text-[#0A1931]"
              >
                {['Opay', 'PalmPay', 'M-Pesa', 'Bank', 'Airtime', 'Stripe'].map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
              <input
                type="number"
                min={5}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                aria-label="Withdrawal amount in pounds"
                className="rounded-xl bg-white px-3 py-2.5 text-[13px] text-[#0A1931]"
              />
            </div>
            <button
              type="button"
              disabled={withdrawBusy}
              onClick={withdraw}
              className="b2b-gradient mt-2 w-full rounded-full py-3 text-[13px] font-bold text-[#0A1931] disabled:opacity-50"
            >
              {withdrawBusy ? 'Saving request…' : 'Request Withdrawal'}
            </button>
            <p className="mt-2 text-[11px] text-white/60">Min withdraw £5 / ₦5,000.</p>
            {withdrawMsg ? <p className="mt-2 text-[12px] text-[#8FFF4A]">{withdrawMsg}</p> : null}
          </div>
          <div id="quality" className="rounded-[24px] border border-[#D4CBB8] bg-[#FFFDF7] p-6">
            <div className="flex items-center gap-4">
              <div className="b2b-gradient h-[86px] w-[86px] shrink-0 rounded-full p-[5px]">
                <div className="grid h-full w-full place-items-center rounded-full bg-white text-center">
                  <div>
                    <div className="font-display text-[22px] font-black leading-none">94%</div>
                    <div className="font-mono2 text-[9px]">QUALITY</div>
                  </div>
                </div>
              </div>
              <div>
                <b className="font-display text-[18px]">Quality + Consent</b>
                <p className="text-[12px] text-[#5B6470]">Checks pass before a dataset can be listed.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2 text-[13px]">
              {['Hands in view', 'Movement', 'Audio clear', 'Lighting', 'Steps followed'].map((x) => (
                <li key={x} className="flex gap-2">
                  <Check size={16} className="text-[#00A66C]" /> {x}
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-3">
              {(
                [
                  ['Face-blur', faceBlur, setFaceBlur],
                  ['Hands-only', handsOnly, setHandsOnly],
                  ['Allow sale', allowSale, setAllowSale],
                ] as const
              ).map(([label, val, setter]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-xl bg-[#F0E9DB] px-3 py-2.5"
                >
                  <span className="text-[13px] font-semibold">{label}</span>
                  <button
                    type="button"
                    onClick={() => setter(!val)}
                    className={`h-6 w-11 rounded-full p-1 transition ${val ? 'bg-[#00A66C]' : 'bg-[#CBD5CE]'}`}
                    aria-label={`${label} ${val ? 'on' : 'off'}`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white transition ${val ? 'translate-x-5' : ''}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-12">
        <div className="rounded-[24px] border border-[#D4CBB8] bg-[#F0E9DB] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-[20px] font-bold">Supabase schema · B2B Dataset Store</h3>
              <p className="text-[13px] text-[#5B6470]">
                Apply <code className="rounded bg-white px-1">supabase/dataset_store.sql</code> for live
                catalogue, listings, orders and payouts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowConfig(!showConfig)}
              className="rounded-full border border-[#D4CBB8] bg-[#FFFDF7] px-4 py-2 text-[13px] font-bold"
            >
              {showConfig ? 'Hide details' : 'Show details'}
            </button>
          </div>
          {showConfig ? (
            <div className="mt-4 grid gap-3 font-mono2 text-[12px] md:grid-cols-3">
              {[
                ['dataset_catalog', 'id · title · category · capture_type · price_hr · hours · quality'],
                ['dataset_listings', 'supplier packs · consent · status · price_hr'],
                ['dataset_orders + items', 'licence · total · Stripe session · line items'],
                ['dataset_wallets', 'balance_gbp · balance_usd'],
                ['dataset_payout_requests', 'Opay / PalmPay / M-Pesa / Stripe · min £5'],
                ['RLS', 'public catalogue read · own listings/orders/payouts'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-[#FFFDF7] p-4">
                  <b>{t}</b>
                  <p className="mt-2 leading-relaxed text-[#5B6470]">{d}</p>
                </div>
              ))}
            </div>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/revenue-model"
              className="inline-flex h-10 items-center rounded-full bg-[#FFC300] px-4 text-sm font-extrabold text-[#0A1931]"
            >
              Revenue Model →
            </Link>
            <Link
              to="/go-live-expenditure"
              className="inline-flex h-10 items-center rounded-full border border-[#D4CBB8] bg-[#FFFDF7] px-4 text-sm font-bold"
            >
              Go Live Expenditure
            </Link>
            <Link
              to="/video-to-cash"
              className="inline-flex h-10 items-center rounded-full bg-[#0A1931] px-4 text-sm font-extrabold text-white"
            >
              Video → Cash
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#D4CBB8] bg-[#FFFDF7]">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-4 py-10 md:grid-cols-3">
          <div>
            <b className="font-display text-[20px]">MyFaceProfile</b>
            <p className="mt-2 text-[13px] text-[#5B6470]">Your Work Is Your Face. Not Your CV.</p>
            <p className="mt-2 text-[13px]">AiKOVA · Oldham OL1 · Lagos</p>
          </div>
          <div className="text-[13px]">
            <b>Store</b>
            <div className="mt-2 space-y-1.5 text-[#5B6470]">
              <a href="#datasets" className="block">
                Datasets
              </a>
              <a href="#labs" className="block">
                For Labs
              </a>
              <a href="#pros" className="block">
                For Pros
              </a>
            </div>
          </div>
          <div className="text-[13px]">
            <b>Contact</b>
            <p className="mt-2 text-[#5B6470]">hello@myfaceprofile.com</p>
            <p className="text-[#5B6470]">myfaceprofile.aikova.co.uk/dataset-store</p>
            <p className="mt-3 text-[11px] text-[#999]">Consent-cleared · GDPR · NDPR · Face-blur option</p>
          </div>
        </div>
      </footer>

      {cartOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCartOpen(false)} />
          <aside className="b2b-rise absolute right-0 top-0 h-full w-full max-w-[420px] overflow-y-auto bg-[#FFFDF7] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[20px] font-bold">Cart · {cart.length}</h3>
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-full border border-[#D4CBB8] p-2"
              >
                <X size={16} />
              </button>
            </div>
            {cartItems.length === 0 ? (
              <p className="mt-6 text-[13px] text-[#5B6470]">
                Your cart is empty. Add a dataset to start a licence order.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {cartItems.map((d) => (
                  <div key={d.id} className="flex gap-3 rounded-2xl border border-[#D4CBB8] p-3">
                    <span className="text-[28px]">{d.emoji}</span>
                    <div className="min-w-0 flex-1">
                      <b className="block text-[13px] leading-tight">{d.title}</b>
                      <p className="text-[12px] text-[#5B6470]">
                        ${d.priceHr}/hr · {d.hours} hrs
                      </p>
                      <b className="text-[13px]">${d.total.toLocaleString()}</b>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCart(cart.filter((x) => x !== d.id))}
                      aria-label={`Remove ${d.title}`}
                      className="self-start text-[#999]"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="mt-5 block">
              <span className="text-[12px] font-bold">Licence type</span>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#D4CBB8] bg-white px-3 py-2.5 text-[13px]"
              >
                <option>Single lab</option>
                <option>Multi-lab</option>
                <option>Exclusive</option>
              </select>
            </label>
            <div className="mt-4 flex justify-between text-[15px] font-bold">
              <span>Total</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            <button
              type="button"
              disabled={orderBusy || cart.length === 0}
              onClick={checkout}
              className="mt-4 w-full rounded-full bg-[#0A1931] py-3.5 text-[13px] font-bold text-white disabled:opacity-50"
            >
              {orderBusy ? 'Saving order…' : 'Checkout — Stripe (demo)'}
            </button>
            {orderMsg ? <p className="mt-3 text-[13px] font-medium">{orderMsg}</p> : null}
            <p className="mt-3 text-[11px] text-[#5B6470]">
              Licence terms: labelled video for internal model training. No resale of raw footage. Consent
              and blur settings travel with the licence.
            </p>
          </aside>
        </div>
      ) : null}

      {preview ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setPreview(null);
              setPlaying(false);
              setProgress(0);
            }}
          />
          <div className="b2b-rise relative w-full max-w-[620px] overflow-hidden rounded-[24px] bg-[#FFFDF7]">
            <div className="flex justify-between gap-3 p-5">
              <div>
                <p className="font-mono2 text-[10px] font-bold text-[#1A7CFF]">30-SECOND PREVIEW</p>
                <h3 className="font-display mt-1 text-[19px] font-bold leading-tight">{preview.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPreview(null);
                  setPlaying(false);
                  setProgress(0);
                }}
                aria-label="Close preview"
                className="h-fit rounded-full border border-[#D4CBB8] p-2"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mx-5 rounded-2xl p-5 text-white" style={{ background: preview.gradient }}>
              <div className="text-[56px]">{preview.emoji}</div>
              <p className="mt-2 text-[13px]">Mock preview player — sample labels appear as the work unfolds.</p>
              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPlaying(!playing)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#0A1931]"
                >
                  {playing ? '❚❚' : '▶'}
                </button>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/25">
                  <div className="h-full bg-white transition-all" style={{ width: `${(progress / 30) * 100}%` }} />
                </div>
                <span className="font-mono2 text-[12px]">
                  {String(progress).padStart(2, '0')} / 30
                </span>
              </div>
            </div>
            <div className="p-5">
              <b className="text-[13px]">Live labels</b>
              <ul className="mt-2 space-y-1.5 text-[12px] text-[#5B6470]">
                {preview.labels.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(preview.id);
                    setPreview(null);
                  }}
                  className="flex-1 rounded-full bg-[#0A1931] py-3 text-[13px] font-bold text-white"
                >
                  Add to Cart — ${preview.total.toLocaleString()}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    setPlaying(false);
                  }}
                  className="rounded-full border border-[#D4CBB8] px-4 py-3 text-[13px] font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="fixed bottom-20 right-5 z-40 flex items-center gap-2 rounded-full bg-[#0A1931] py-3 pl-4 pr-5 text-[13px] font-bold text-white shadow-2xl md:bottom-5"
      >
        <ShoppingCart size={17} /> Cart · {cart.length} · ${cartTotal.toLocaleString()}
      </button>
    </div>
  );
}
