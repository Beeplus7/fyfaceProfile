import { Outlet, useLocation } from 'react-router-dom';
import MobileBottomNav from './MobileBottomNav';
import GlobalPagesMenu from './GlobalPagesMenu';
import MyFaceCompanionGuide from './companion/MyFaceCompanionGuide';

function shouldShowGuide(pathname: string) {
  if (
    pathname.startsWith('/app') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/readiness') ||
    pathname.startsWith('/production')
  ) {
    return false;
  }
  return true;
}

export default function AppLayout() {
  const { pathname } = useLocation();
  return (
    <div className="marketing-surface app-shell app-shell--with-mobile-nav pb-[72px] md:pb-0">
      <Outlet />
      <MobileBottomNav />
      <GlobalPagesMenu />
      {shouldShowGuide(pathname) ? <MyFaceCompanionGuide /> : null}
    </div>
  );
}
