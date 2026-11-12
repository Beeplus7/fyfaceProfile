import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AboutPage from './pages/AboutPage';
import ArchitecturePage from './pages/ArchitecturePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import ForBarbersPage from './pages/ForBarbersPage';
import ForBuildersPage from './pages/ForBuildersPage';
import ForElectriciansPage from './pages/ForElectriciansPage';
import ForMechanicsPage from './pages/ForMechanicsPage';
import ForPlumbersPage from './pages/ForPlumbersPage';
import ForTailorsPage from './pages/ForTailorsPage';
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import LiveWorkshopPage from './pages/LiveWorkshopPage';
import OnboardingMarketingPage from './pages/OnboardingMarketingPage';
import PricingPage from './pages/PricingPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import ProductionReadinessPage from './pages/readiness/ProductionReadinessPage';
import GoLiveExpenditurePage from './pages/GoLiveExpenditurePage';
import RevenueModelPage from './pages/RevenueModelPage';
import SitemapPage from './pages/SitemapPage';
import LegalDocumentPage from './pages/LegalDocumentPage';
import StubPage from './pages/StubPage';
import VerticalsPage from './pages/VerticalsPage';
import VideoToCashPage from './pages/VideoToCashPage';
import WorkOsPage from './pages/WorkOsPage';
import {
  AppIndexRedirect,
  AuthProvider,
  DashboardShell,
  LoginPage,
  OnboardingFlow,
  ProductLayout,
  SignupPage,
} from './product';
import { ArcadeShell } from './product/arcade';
import DemoLabPage from './product/demo/DemoLabPage';
import LiveViewerPage from './product/live/LiveViewerPage';
import StreamingStudioPage from './product/studio/StreamingStudioPage';
import WorkCutStudioPage from './product/studio/WorkCutStudioPage';
import DiscoverPage from './product/discover/DiscoverPage';
import DirectMessagesPage from './product/dm/DirectMessagesPage';
import MakerProfilePage from './product/maker/MakerProfilePage';
import TimelinePage from './product/timeline/TimelinePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Product OS — signup → onboarding → dashboard */}
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="demo" element={<DemoLabPage />} />
          <Route path="auth" element={<Navigate to="/demo" replace />} />
          <Route path="auth/callback" element={<AuthCallbackPage />} />

          <Route path="app" element={<ProductLayout />}>
            <Route index element={<AppIndexRedirect />} />
            <Route path="onboarding" element={<OnboardingFlow />} />
            <Route path="dashboard" element={<DashboardShell />} />
            <Route path="arcade" element={<ArcadeShell />} />
            <Route path="arcade/:gameId" element={<ArcadeShell />} />
            <Route path="live" element={<LiveViewerPage />} />
            <Route path="feed" element={<TimelinePage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="maker/:makerId" element={<MakerProfilePage />} />
            <Route path="messages" element={<DirectMessagesPage />} />
            <Route path="messages/:peerId" element={<DirectMessagesPage />} />
            <Route path="studio/stream" element={<StreamingStudioPage />} />
            <Route path="studio/workcut" element={<WorkCutStudioPage />} />
          </Route>

          {/* Marketing site */}
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="work-os" element={<WorkOsPage />} />
            <Route path="live-workshop" element={<LiveWorkshopPage />} />
            <Route path="uprm" element={<LiveWorkshopPage />} />
            <Route path="uprm-command" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectDetailPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="revenue-model" element={<RevenueModelPage />} />
            <Route path="revenue" element={<Navigate to="/revenue-model" replace />} />
            <Route path="go-live-expenditure" element={<GoLiveExpenditurePage />} />
            <Route path="go-live" element={<Navigate to="/go-live-expenditure" replace />} />
            <Route path="video-to-cash" element={<VideoToCashPage />} />
            <Route path="capture-guide" element={<Navigate to="/video-to-cash" replace />} />
            <Route path="verticals" element={<VerticalsPage />} />
            <Route path="for-tailors" element={<ForTailorsPage />} />
            <Route path="for-mechanics" element={<ForMechanicsPage />} />
            <Route path="for-barbers" element={<ForBarbersPage />} />
            <Route path="for-builders" element={<ForBuildersPage />} />
            <Route path="for-electricians" element={<ForElectriciansPage />} />
            <Route path="for-plumbers" element={<ForPlumbersPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:slug" element={<BlogDetailPage />} />
            <Route path="onboarding" element={<OnboardingMarketingPage />} />
            <Route path="sitemap" element={<SitemapPage />} />
            <Route path="architecture" element={<ArchitecturePage />} />
            <Route path="readiness" element={<ProductionReadinessPage />} />
            <Route path="production" element={<Navigate to="/readiness" replace />} />
            <Route
              path="trust"
              element={
                <StubPage
                  title="Trust & Safety"
                  description="Trust center content is on the way. See the sitemap for live pages."
                />
              }
            />
            <Route
              path="help"
              element={
                <StubPage
                  title="Help Center"
                  description="Help articles are being migrated. Use the sitemap meanwhile."
                />
              }
            />
            <Route
              path="legal/coins"
              element={
                <StubPage
                  title="MyFace Coins"
                  description="Legal information about MyFace Coins will appear here soon."
                />
              }
            />
            <Route path="legal/privacy" element={<LegalDocumentPage kind="privacy" />} />
            <Route path="legal/terms" element={<LegalDocumentPage kind="terms" />} />
          </Route>

          <Route path="*" element={<Navigate to="/sitemap" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
