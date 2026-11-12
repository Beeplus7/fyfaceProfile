import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import logoM from '../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg';

const NAV = [
  { to: '/how-it-works', label: 'How it Works' },
  { to: '/work-os', label: 'Work OS' },
  { to: '/verticals', label: 'Trades' },
  { to: '/video-to-cash', label: 'Video → Cash', badge: 'NEW' },
  { to: '/pricing', label: 'Pricing' },
] as const;

export default function MarketingHeader() {
  const { pathname } = useLocation();

  return (
    <header
      data-safe-area-sticky-top
      data-marketing-chrome-header
      className="sticky z-[60] top-[var(--safe-area-inset-top)] border-b border-[#D4CBB8] backdrop-blur-[20px] bg-[#FFFDF7]/92"
    >
      <div className="mx-auto max-w-[1280px] px-5 lg:px-8 h-[64px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="relative h-9 w-9 rounded-[10px] overflow-hidden bg-[#0A1931] border border-[#D4CBB8] shadow-[0_8px_24px_rgba(10,25,49,0.12)] shrink-0">
            <img src={logoM} alt="M logo" className="h-full w-full object-cover scale-[1.7]" />
          </div>
          <div className="flex items-baseline gap-[1px] tracking-[-0.02em]">
            <span className="text-[18px] font-bold text-[#0A1931]">My</span>
            <span className="text-[18px] font-bold gradient-text-m">Face</span>
            <span className="text-[18px] font-bold text-[#0A1931] ml-[2px]">Profile</span>
            <span className="ml-2 hidden lg:inline-flex text-[10px] font-medium tracking-[0.18em] text-[#5B6470] uppercase border border-[#D4CBB8] rounded-full px-2 py-[2px] bg-[#F0E9DB]">
              OS
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-[13.5px] font-medium tracking-[-0.01em] text-[#5B6470]">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`hover:text-[#0A1931] transition flex items-center gap-1.5 ${
                  active ? 'text-[#0A1931] font-semibold' : ''
                }`}
              >
                {item.label}
                {'badge' in item && item.badge ? (
                  <span className="h-4 px-1.5 rounded-full bg-[#FFC300] text-[10px] text-[#0A1931] font-bold flex items-center">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#5B6470]">
            <span className="h-2 w-2 rounded-full bg-[#00C896] animate-pulse" />
            Oldham → Lagos → Nairobi
          </div>
          <Link
            to="/login"
            className="hidden sm:inline-flex text-[13px] font-semibold text-[#5B6470] hover:text-[#0A1931]"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="group relative inline-flex items-center justify-center h-9 px-5 rounded-full bg-[#FFC300] text-[#0A1931] text-[13.5px] font-extrabold tracking-[-0.01em] shadow-[0_8px_20px_rgba(255,195,0,0.35)] hover:brightness-[1.03] transition-all"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Go Live & Earn{' '}
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[1px] group-hover:-translate-y-[1px] transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
