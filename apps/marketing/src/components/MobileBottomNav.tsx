import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Sparkles, Map, CircleDollarSign } from 'lucide-react';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/how-it-works', label: 'How', icon: Sparkles },
  { to: '/work-os', label: 'Work OS', icon: Layers },
  { to: '/pricing', label: 'Pricing', icon: CircleDollarSign },
  { to: '/sitemap', label: 'All', icon: Map },
] as const;

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-[100] border-t border-white/10 bg-black/80 backdrop-blur-xl"
      style={{ paddingBottom: 'var(--safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="flex items-stretch justify-around h-[56px]">
        {items.map(({ to, label, icon: Icon }) => {
          const active =
            to === '/'
              ? pathname === '/'
              : pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center justify-center gap-0.5 h-full text-[10px] font-medium transition ${
                  active ? 'text-[#8FFF4A]' : 'text-white/50'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
