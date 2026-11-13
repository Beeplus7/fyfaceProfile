import { Outlet } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';
import MarketingHeader from './MarketingHeader';

export default function AppLayout() {
  return (
    <div className="marketing-surface app-shell app-shell--with-mobile-nav pb-[72px] md:pb-0">
      <MarketingHeader />
      <Outlet />
      <MobileBottomNav />
    </div>
  );
}
