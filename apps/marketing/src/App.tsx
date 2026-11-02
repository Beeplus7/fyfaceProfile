import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import AboutPage from './pages/AboutPage';
import ArchitecturePage from './pages/ArchitecturePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import BlogDetailPage from './pages/BlogDetailPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
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
import SitemapPage from './pages/SitemapPage';
import StaticHtmlFramePage from './pages/StaticHtmlFramePage';
import StubPage from './pages/StubPage';
import VerticalsPage from './pages/VerticalsPage';
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
            <Route path="verticals" element={<VerticalsPage />} />
            <Route path="for-tailors" element={<ForTailorsPage />} />
            <Route path="for-mechanics" element={<ForMechanicsPage />} />
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
          </Route>

          <Route
            path="for-barbers"
            element={
              <StaticHtmlFramePage
                src="/pages/for-barbers.html"
                title="For Barbers — MyFace"
              />
            }
          />
          <Route
            path="for-builders"
            element={
              <StaticHtmlFramePage
                src="/pages/for-builders.html"
                title="For Builders — MyFace"
              />
            }
          />
          <Route
            path="for-electricians"
            element={
              <StaticHtmlFramePage
                src="/pages/for-electricians.html"
                title="For Electricians — MyFace"
              />
            }
          />
          <Route
            path="legal/privacy"
            element={
              <StaticHtmlFramePage
                src="/legal/privacy.html"
                title="Privacy Policy — MyFace"
              />
            }
          />
          <Route
            path="legal/terms"
            element={
              <StaticHtmlFramePage
                src="/legal/terms.html"
                title="Terms of Service — MyFace"
              />
            }
          />

          <Route path="*" element={<Navigate to="/sitemap" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
