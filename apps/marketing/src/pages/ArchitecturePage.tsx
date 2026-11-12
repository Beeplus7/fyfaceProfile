import React, { useState, useMemo, useEffect } from "react";
import {
  Folder, FolderOpen, FileCode, FileJson, FileText, Box,
  Search, Sparkles, Layers, Cpu, Database, Zap, Shield,
  Hammer, Scissors, Heart, Crown, Trophy, Grid3X3, GitBranch,
  Package, Server, Workflow, Eye, MapPin, Flame, Construction, Pin, Trash2, Plus
} from "lucide-react";

type Status = "DONE" | "NEW" | "FROM" | null;
type NodeType = "folder" | "file";

interface TreeNodeData {
  id: string;
  name: string;
  type: NodeType;
  path: string;
  status?: Status;
  count?: number;
  badge?: string;
  desc?: string;
  deliverable?: string;
  preview?: {
    title: string;
    subtitle: string;
    metrics?: string[];
    stack?: string[];
    hero?: string;
  };
  children?: TreeNodeData[];
}

const MARKETING_PAGES: TreeNodeData[] = [
  { id:"m1", name:"app", type:"folder", path:"apps/marketing/app", status:null, count:28,
    children:[
      { id:"m1-page", name:"page.tsx", type:"file", path:"apps/marketing/app/page.tsx", status:"DONE", desc:"Page 1 Hero Home", deliverable:"Your Work Is Your Face. Not Your CV. — iOS Android Coming Soon QR — 6 cards Live Workshop Project Booking Gift Trust Shop — SHOW CONNECT GROW",
        preview:{ title:"Hero Home", subtitle:"Your Work Is Your Face. Not Your CV.", metrics:["SHOW","CONNECT","GROW"], stack:["Next.js 14","Framer Motion","QR Code"], hero:"infographic card drop 6 cards" } },
      { id:"m-how", name:"how-it-works", type:"folder", path:"apps/marketing/app/how-it-works", status:"DONE", count:1,
        children:[{ id:"m-how-f", name:"page.tsx", type:"file", path:"apps/marketing/app/how-it-works/page.tsx", status:"DONE", desc:"Page 2 How It Works", deliverable:"Work→Content→Discovery→Trust→Commerce loop animated", preview:{ title:"How It Works", subtitle:"Work → Content → Discovery → Trust → Commerce", metrics:["Loop","Animated SVG"], stack:["Framer Motion"], hero:"animated loop" } }]},
      { id:"m-workos", name:"work-os", type:"folder", path:"apps/marketing/app/work-os", status:"DONE", count:1,
        children:[{ id:"m-workos-f", name:"page.tsx", type:"file", path:"apps/marketing/app/work-os/page.tsx", status:"DONE", desc:"Page 3 Work OS", deliverable:"OS stack Kernel System Services UPRM Apps — images tailor sewing lace mechanic diagnosing builders bricks barber fade", preview:{ title:"Work OS", subtitle:"Kernel • System Services • UPRM Apps", metrics:["Tailor","Mechanic","Builder","Barber"], stack:["OS Diagram"], hero:"6 trades collage" } }]},
      { id:"m-uprm", name:"uprm-live-workshop", type:"folder", path:"apps/marketing/app/uprm-live-workshop", status:"DONE", count:1,
        children:[{ id:"m-uprm-f", name:"page.tsx", type:"file", path:"apps/marketing/app/uprm-live-workshop/page.tsx", status:"DONE", desc:"Page 4 UPRM + Live Workshop", deliverable:"Live In Workshop Mode hands-free PiP — FlowCRM pipeline — diverse customers receiving dress", preview:{ title:"UPRM + Live Workshop", subtitle:"Live In Workshop Mode", metrics:["PiP","Hands-free","FlowCRM"], stack:["WebRTC","PiP API"], hero:"workshop streaming" } }]},
      { id:"m-projects", name:"projects", type:"folder", path:"apps/marketing/app/projects", status:"DONE", count:3,
        children:[
          { id:"m-proj-f", name:"page.tsx", type:"file", path:"apps/marketing/app/projects/page.tsx", status:"DONE", desc:"Page 5 Projects", deliverable:"Project is object killer — Before/After Kitchen Final Reveal Wedding Dress Blueprint Materials List — SEO goldmine", preview:{ title:"Projects", subtitle:"Project is object killer", metrics:["SEO","Before/After"], stack:["ISR","OG Images"], hero:"grid of objects" } },
          { id:"m-proj-id", name:"[id]", type:"folder", path:"apps/marketing/app/projects/[id]", status:"DONE", count:1,
            children:[{ id:"m-proj-id-f", name:"page.tsx", type:"file", path:"apps/marketing/app/projects/[id]/page.tsx", status:"DONE", desc:"Page 6 Project Detail", deliverable:"Before/After slider milestone timeline materials team escrow verified review", preview:{ title:"Project Detail", subtitle:"Before/After + Milestone", metrics:["Slider","Escrow","Verified"], stack:["Slider","Timeline"], hero:"wedding dress timeline" } }]}
        ]},
      { id:"m-pricing", name:"pricing", type:"folder", path:"apps/marketing/app/pricing", status:"DONE", count:1,
        children:[{ id:"m-pricing-f", name:"page.tsx", type:"file", path:"apps/marketing/app/pricing/page.tsx", status:"DONE", desc:"Page 7 Pricing + MFC", deliverable:"Gift Economy box phone live gift rain escrow payment received verified review — Free vs Pro £29/mo 6 monetization ways", preview:{ title:"Pricing + MFC", subtitle:"Gift Economy + Free vs Pro £29", metrics:["£29/mo","6 ways","Escrow"], stack:["Stripe","Gift Rain"], hero:"gift rain" } }]},
      { id:"m-trust", name:"trust-safety", type:"folder", path:"apps/marketing/app/trust-safety", status:"DONE", count:1,
        children:[{ id:"m-trust-f", name:"page.tsx", type:"file", path:"apps/marketing/app/trust-safety/page.tsx", status:"DONE", desc:"Page 8 Trust & Safety", deliverable:"Verified Pro 4 steps TrustScore formula Trust Ledger event-sourced", preview:{ title:"Trust & Safety", subtitle:"Verified Pro 4 steps • TrustScore", metrics:["TrustScore 4.9","Event-sourced"], stack:["Ledger"], hero:"trust ledger" } }]},
      { id:"m-verticals", name:"verticals", type:"folder", path:"apps/marketing/app/verticals", status:"DONE", count:1,
        children:[{ id:"m-vert-f", name:"page.tsx", type:"file", path:"apps/marketing/app/verticals/page.tsx", status:"DONE", desc:"Page 9 Verticals Hub", deliverable:"6 trades images SEO keywords Tailors Mechanics Builders Barbers Electricians Plumbers", preview:{ title:"Verticals Hub", subtitle:"6 trades SEO hub", metrics:["Tailors","Mechanics","Builders","Barbers","Electricians","Plumbers"], stack:["SEO","Hub"], hero:"trade grid" } }]},
      { id:"m-about", name:"about", type:"folder", path:"apps/marketing/app/about", status:"DONE", count:1,
        children:[{ id:"m-about-f", name:"page.tsx", type:"file", path:"apps/marketing/app/about/page.tsx", status:"DONE", desc:"Page 10 About + Mission", deliverable:"Story timeline VisaguideOS → Roadagel → Oldham Test → My Face Profile OS", preview:{ title:"About + Mission", subtitle:"VisaguideOS → Roadagel → Oldham Test → MFP OS", metrics:["Timeline","Mission"], stack:["Story"], hero:"journey timeline" } }]},
      { id:"m-bundle", name:"(bundle-11)", type:"folder", path:"apps/marketing/app/(bundle-11)", status:"DONE", count:3,
        children:[
          { id:"m-blog", name:"blog", type:"folder", path:"apps/marketing/app/blog", status:"DONE", count:2, children:[
            { id:"m-blog-f", name:"page.tsx", type:"file", path:"apps/marketing/app/blog/page.tsx", status:"DONE", desc:"Blog list", deliverable:"Blog listing" },
            { id:"m-blog-slug", name:"[slug]", type:"folder", path:"apps/marketing/app/blog/[slug]", status:"DONE", count:1, children:[{ id:"m-blog-slug-f", name:"page.tsx", type:"file", path:"apps/marketing/app/blog/[slug]/page.tsx", status:"DONE", desc:"Page 21 Blog Detail Aisha's 47 dresses", deliverable:"Aisha's 47 dresses deep dive", preview:{ title:"Blog Detail", subtitle:"Aisha's 47 dresses", metrics:["Story","SEO"], stack:["MDX"], hero:"dress story" } }]}
          ]},
          { id:"m-careers", name:"careers", type:"folder", path:"apps/marketing/app/careers", status:"DONE", count:1, children:[{ id:"m-careers-f", name:"page.tsx", type:"file", path:"apps/marketing/app/careers/page.tsx", status:"DONE", desc:"Careers list", deliverable:"Join the OS" }]},
          { id:"m-help", name:"help", type:"folder", path:"apps/marketing/app/help", status:"DONE", count:1, children:[{ id:"m-help-f", name:"page.tsx", type:"file", path:"apps/marketing/app/help/page.tsx", status:"DONE", desc:"Help center", deliverable:"FAQ + Guides" }]}
        ]},
      { id:"m-sitemap", name:"sitemap", type:"folder", path:"apps/marketing/app/sitemap", status:"DONE", count:1,
        children:[{ id:"m-sitemap-f", name:"page.tsx", type:"file", path:"apps/marketing/app/sitemap/page.tsx", status:"DONE", desc:"Page 12 Sitemap Master Handover", deliverable:"lists all 24 pages production handover structure", preview:{ title:"Sitemap Master", subtitle:"24-page handover", metrics:["Production","Handover"], stack:["Sitemap"], hero:"master list" } }]},
      { id:"m-tailors", name:"for-tailors", type:"folder", path:"apps/marketing/app/for-tailors", status:"DONE", count:1,
        children:[{ id:"m-tailors-f", name:"page.tsx", type:"file", path:"apps/marketing/app/for-tailors/page.tsx", status:"DONE", desc:"Page 13 For Tailors Standalone LP", deliverable:"AYO'S TAILORS Spindlegate Oldham OL1 luxury Aso-Ebi fabrics", preview:{ title:"For Tailors", subtitle:"AYO'S TAILORS • Spindlegate Oldham OL1", metrics:["Aso-Ebi","Luxury"], stack:["LP"], hero:"tailor sewing lace" } }]},
      { id:"m-mech", name:"for-mechanics", type:"folder", path:"apps/marketing/app/for-mechanics", status:"DONE", count:1,
        children:[{ id:"m-mech-f", name:"page.tsx", type:"file", path:"apps/marketing/app/for-mechanics/page.tsx", status:"DONE", desc:"Page 14 For Mechanics", deliverable:"SPANNER & SOCKET Oldham Motors LEE Toyota Corolla OBD2 P0302", preview:{ title:"For Mechanics", subtitle:"SPANNER & SOCKET • Oldham Motors", metrics:["OBD2 P0302","Diagnostics"], stack:["LP"], hero:"mechanic diagnosing" } }]},
      { id:"m-build", name:"for-builders", type:"folder", path:"apps/marketing/app/for-builders", status:"DONE", count:1,
        children:[{ id:"m-build-f", name:"page.tsx", type:"file", path:"apps/marketing/app/for-builders/page.tsx", status:"DONE", desc:"Page 15 For Builders", deliverable:"builders laying bricks kitchen remodel £12K", preview:{ title:"For Builders", subtitle:"Kitchen remodel £12K", metrics:["Bricks","Remodel"], stack:["LP"], hero:"builders bricks" } }]},
      { id:"m-barber", name:"for-barbers", type:"folder", path:"apps/marketing/app/for-barbers", status:"DONE", count:1,
        children:[{ id:"m-barber-f", name:"page.tsx", type:"file", path:"apps/marketing/app/for-barbers/page.tsx", status:"DONE", desc:"Page 16 For Barbers", deliverable:"fade line design Oldham", preview:{ title:"For Barbers", subtitle:"Fade line design • Oldham", metrics:["Fade","Design"], stack:["LP"], hero:"barber fade" } }]},
      { id:"m-elec", name:"for-electricians", type:"folder", path:"apps/marketing/app/for-electricians", status:"DONE", count:1,
        children:[{ id:"m-elec-f", name:"page.tsx", type:"file", path:"apps/marketing/app/for-electricians/page.tsx", status:"DONE", desc:"Page 17 For Electricians", deliverable:"consumer unit 230V RCD 30mA BS 7671 Hager RCBO", preview:{ title:"For Electricians", subtitle:"Consumer unit 230V RCD 30mA BS 7671", metrics:["Hager","RCBO","Part P"], stack:["LP"], hero:"consumer unit" } }]},
      { id:"m-plumb", name:"for-plumbers", type:"folder", path:"apps/marketing/app/for-plumbers", status:"DONE", count:1,
        children:[{ id:"m-plumb-f", name:"page.tsx", type:"file", path:"apps/marketing/app/for-plumbers/page.tsx", status:"DONE", desc:"Page 18 For Plumbers", deliverable:"Gas Safe Worcester Bosch boiler 68C 1.2 bar", preview:{ title:"For Plumbers", subtitle:"Worcester Bosch 68C 1.2 bar Gas Safe", metrics:["Gas Safe 123456","Boiler"], stack:["LP"], hero:"boiler panel" } }]},
      { id:"m-careers2", name:"careers-standalone", type:"folder", path:"apps/marketing/app/careers-standalone", status:"DONE", count:1,
        children:[{ id:"m-careers2-f", name:"page.tsx", type:"file", path:"apps/marketing/app/careers-standalone/page.tsx", status:"DONE", desc:"Page 19 Careers Standalone", deliverable:"multi-skill images", preview:{ title:"Careers Standalone", subtitle:"Multi-skill workshop", metrics:["Careers"], stack:["LP"], hero:"team" } }]},
      { id:"m-contact", name:"contact", type:"folder", path:"apps/marketing/app/contact", status:"DONE", count:1,
        children:[{ id:"m-contact-f", name:"page.tsx", type:"file", path:"apps/marketing/app/contact/page.tsx", status:"DONE", desc:"Page 20 Contact Standalone", deliverable:"multi-skill contact", preview:{ title:"Contact", subtitle:"Oldham OL1 • Multi-skill", metrics:["Contact"], stack:["LP"], hero:"contact" } }]},
      { id:"m-help2", name:"help-standalone", type:"folder", path:"apps/marketing/app/help-standalone", status:"DONE", count:1,
        children:[{ id:"m-help2-f", name:"page.tsx", type:"file", path:"apps/marketing/app/help-standalone/page.tsx", status:"DONE", desc:"Page 22 Help Standalone FAQ", deliverable:"FAQ searchable", preview:{ title:"Help FAQ", subtitle:"Searchable FAQ", metrics:["Help"], stack:["Search"], hero:"faq" } }]},
      { id:"m-legal", name:"legal", type:"folder", path:"apps/marketing/app/legal", status:"DONE", count:3,
        children:[
          { id:"m-legal-priv", name:"privacy", type:"folder", path:"apps/marketing/app/legal/privacy", status:"DONE", count:1, children:[{ id:"m-priv-f", name:"page.tsx", type:"file", path:"apps/marketing/app/legal/privacy/page.tsx", status:"DONE", desc:"Page 23 Legal Privacy", deliverable:"Privacy policy" }]},
          { id:"m-legal-terms", name:"terms", type:"folder", path:"apps/marketing/app/legal/terms", status:"DONE", count:1, children:[{ id:"m-terms-f", name:"page.tsx", type:"file", path:"apps/marketing/app/legal/terms/page.tsx", status:"DONE", desc:"Page 24 Legal Terms + MFC Coins FINAL", deliverable:"complete 24-page OS sitemap — Terms + Coins" }]},
          { id:"m-legal-coins", name:"coins", type:"folder", path:"apps/marketing/app/legal/coins", status:"DONE", count:1, children:[{ id:"m-coins-f", name:"page.tsx", type:"file", path:"apps/marketing/app/legal/coins/page.tsx", status:"DONE", desc:"MFC Coins", deliverable:"Gift economy rules" }]}
        ]},
      { id:"m-onboard", name:"onboarding", type:"folder", path:"apps/marketing/app/onboarding", status:"NEW", badge:"FROM VisaguideOS", count:1,
        children:[{ id:"m-onboard-f", name:"page.tsx", type:"file", path:"apps/marketing/app/onboarding/page.tsx", status:"NEW", badge:"FROM VisaguideOS", desc:"Page 25 NEW — UPRM Onboarding Companion", deliverable:"32 fields 4 phases Craft Identity Work DNA Production Engine UPRM Brain — Field schema config/onboardingSteps.ts — Gating rules/rules/fieldGating.ts — Shared engine rules/gatingEngine.ts — Orchestrator companion/OnboardingCompanion.tsx — Edge fn onboarding-chat — CompanionMessage whyText — QuantumBackground M gradient — Live interactive demo one question at a time deterministically-gated — On completion → /uprm command center",
          preview:{ title:"UPRM Onboarding Companion", subtitle:"From VisaguideOS • 32 fields • 4 phases", metrics:["Craft Identity","Work DNA","Production Engine","UPRM Brain"], stack:["OnboardingCompanion.tsx","fieldGating.ts","gatingEngine.ts","onboarding-chat edge fn"], hero:"quantum M gradient" } }]},
      { id:"m-uprm-lp", name:"uprm-command", type:"folder", path:"apps/marketing/app/uprm-command", status:"NEW", count:1,
        children:[{ id:"m-uprm-lp-f", name:"page.tsx", type:"file", path:"apps/marketing/app/uprm-command/page.tsx", status:"NEW", desc:"Preview of command center marketing landing", deliverable:"Marketing landing for UPRM Command", preview:{ title:"UPRM Command Landing", subtitle:"Preview • Go Live + Boost", metrics:["Command Center"], stack:["LP"], hero:"dashboard preview" } }]}
    ]
  }
];

const WEB_TREE: TreeNodeData[] = [
  { id:"web-root", name:"apps/web", type:"folder", path:"apps/web", count:180,
    children:[
      { id:"web-app", name:"app/(dashboard)", type:"folder", path:"apps/web/app/(dashboard)", count:26,
        children:[
          { id:"web-uprm", name:"uprm", type:"folder", path:"apps/web/app/(dashboard)/uprm", status:"NEW", badge:"PID 1 MAIN", count:1,
            children:[{ id:"web-uprm-page", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/uprm/page.tsx", status:"NEW", badge:"PID 1 MAIN", desc:"Page 26 NEW — UPRM COMMAND CENTER DASHBOARD — MAIN BRAIN", deliverable:"LEFT SIDEBAR 240px black fixed — M logo + OS Core Dashboard Projects 12 UPRM Contacts 47 Relationship 0-100 Pipeline 8 Work Feed — Production Shop 24 Bookings Live Workshop Go Live pulse red WorkCut CapCut-like Analytics — Trust & Growth TrustScore 4.9 Verified MFC Wallet 1247 Bot Army 9 Boost Discovery | TOP HEADER sticky — Search + Quick Actions + New Project M gradient Go Live red pulse Boost post yellow + Notifications Gift rain 3 Messages 5 TrustScore green | ROW 1 OVERVIEW STATS 6 cards — Total Projects 12 +3 week, Relationships 47 avg 73/100, Pipeline £8420 8 active, TrustScore 4.9 Verified Gas Safe BS 7671, MFC Wallet 1247 £600 gifts 70% you, Work Feed Reach 12.4K +23% | ROW 2 PROMOTE ENHANCE — PROJECTS COMMANDER killer object — Grid 3x2 + UPRM CONTACTS Relationship 0-100 | ROW 3 PIPELINE KANBAN Discovery→Repeat 8 columns | ROW 4 SHOP + BOOKINGS + LIVE | ROW 5 TRUST & SAFETY + MFC WALLET + GROWTH | FOOTER CTA £618K ARR",
              preview:{ title:"UPRM COMMAND CENTER", subtitle:"PID 1 • MAIN BRAIN • Where they land after onboarding", metrics:["12 Projects","47 Contacts","£8420 Pipeline","4.9 Trust","1247 MFC","12.4K Reach"], stack:["Next.js","Supabase Realtime","Kanban DnD","MapLibre","WorkCut"], hero:"full OS dashboard" } }]},
          { id:"web-dash", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/page.tsx", status:"DONE", desc:"Dashboard overview wrapper for UPRM" },
          { id:"web-proj", name:"projects", type:"folder", path:"apps/web/app/(dashboard)/projects", status:"DONE", count:2,
            children:[
              { id:"web-proj-page", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/projects/page.tsx", status:"DONE", desc:"Projects commander page" },
              { id:"web-proj-id", name:"[id]", type:"folder", path:"apps/web/app/(dashboard)/projects/[id]", status:"DONE", count:1, children:[{ id:"web-proj-id-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/projects/[id]/page.tsx", status:"DONE", desc:"Project detail with Before/After slider milestone" }]}
            ]},
          { id:"web-contacts", name:"contacts", type:"folder", path:"apps/web/app/(dashboard)/contacts", status:"DONE", count:1, children:[{ id:"web-contacts-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/contacts/page.tsx", status:"DONE", desc:"UPRM Contacts Relationship 0-100 list" }]},
          { id:"web-pipe", name:"pipeline", type:"folder", path:"apps/web/app/(dashboard)/pipeline", status:"DONE", count:1, children:[{ id:"web-pipe-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/pipeline/page.tsx", status:"DONE", desc:"Pipeline Kanban full page" }]},
          { id:"web-shop", name:"shop", type:"folder", path:"apps/web/app/(dashboard)/shop", status:"DONE", count:1, children:[{ id:"web-shop-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/shop/page.tsx", status:"DONE", desc:"Shop commander inventory" }]},
          { id:"web-book", name:"bookings", type:"folder", path:"apps/web/app/(dashboard)/bookings", status:"DONE", count:1, children:[{ id:"web-book-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/bookings/page.tsx", status:"DONE", desc:"Bookings calendar" }]},
          { id:"web-live", name:"live", type:"folder", path:"apps/web/app/(dashboard)/live", status:"DONE", count:1, children:[{ id:"web-live-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/live/page.tsx", status:"DONE", desc:"Live Workshop Go Live page" }]},
          { id:"web-cut", name:"workcut", type:"folder", path:"apps/web/app/(dashboard)/workcut", status:"DONE", count:1, children:[{ id:"web-cut-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/workcut/page.tsx", status:"DONE", desc:"WorkCut editor CapCut-like" }]},
          { id:"web-trust", name:"trust", type:"folder", path:"apps/web/app/(dashboard)/trust", status:"DONE", count:1, children:[{ id:"web-trust-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/trust/page.tsx", status:"DONE", desc:"Trust & Safety ledger" }]},
          { id:"web-wallet", name:"wallet", type:"folder", path:"apps/web/app/(dashboard)/wallet", status:"DONE", count:1, children:[{ id:"web-wallet-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/wallet/page.tsx", status:"DONE", desc:"MFC Wallet gift economy" }]},
          { id:"web-analytics", name:"analytics", type:"folder", path:"apps/web/app/(dashboard)/analytics", status:"DONE", count:1, children:[{ id:"web-analytics-f", name:"page.tsx", type:"file", path:"apps/web/app/(dashboard)/analytics/page.tsx", status:"DONE", desc:"Analytics" }]},
        ]},
      { id:"web-comp", name:"components", type:"folder", path:"apps/web/components", count:27,
        children:[
          { id:"web-comp-uprm", name:"uprm", type:"folder", path:"apps/web/components/uprm", status:"NEW", count:12,
            children:[
              { id:"c-uprm-1", name:"UPRMContactsList.tsx", type:"file", path:"apps/web/components/uprm/UPRMContactsList.tsx", status:"NEW", desc:"Relationship 0-100 bar" },
              { id:"c-uprm-2", name:"PipelineKanban.tsx", type:"file", path:"apps/web/components/uprm/PipelineKanban.tsx", status:"NEW", desc:"8 columns draggable" },
              { id:"c-uprm-3", name:"ProjectCard.tsx", type:"file", path:"apps/web/components/uprm/ProjectCard.tsx", status:"DONE", desc:"Project killer object Before/After" },
              { id:"c-uprm-4", name:"ShopCard.tsx", type:"file", path:"apps/web/components/uprm/ShopCard.tsx", status:"DONE", desc:"Shop item £45/m" },
              { id:"c-uprm-5", name:"BookingCalendar.tsx", type:"file", path:"apps/web/components/uprm/BookingCalendar.tsx", status:"DONE", desc:"week view" },
              { id:"c-uprm-6", name:"LiveWorkshop.tsx", type:"file", path:"apps/web/components/uprm/LiveWorkshop.tsx", status:"NEW", desc:"Go Live red pulse + gift rain" },
              { id:"c-uprm-7", name:"WorkCutEditor.tsx", type:"file", path:"apps/web/components/uprm/WorkCutEditor.tsx", status:"NEW", desc:"CapCut-like templates" },
              { id:"c-uprm-8", name:"TrustScoreBadge.tsx", type:"file", path:"apps/web/components/uprm/TrustScoreBadge.tsx", status:"DONE", desc:"4.9 green" },
              { id:"c-uprm-9", name:"MFCWallet.tsx", type:"file", path:"apps/web/components/uprm/MFCWallet.tsx", status:"NEW", desc:"1247 coins gift feed" },
              { id:"c-uprm-10", name:"BotArmy.tsx", type:"file", path:"apps/web/components/uprm/BotArmy.tsx", status:"NEW", desc:"9 bots Milo Cutty Quoto Timi Findy Helpy Veri Growy Lingo green active" },
              { id:"c-uprm-11", name:"GiftRain.tsx", type:"file", path:"apps/web/components/uprm/GiftRain.tsx", status:"NEW", desc:"Hammer Scissors Heart Crown Trophy animation" },
              { id:"c-uprm-12", name:"QuantumBackground.tsx", type:"file", path:"apps/web/components/uprm/QuantumBackground.tsx", status:"NEW", badge:"FROM VisaguideOS", desc:"M gradient #8FFF4A→#00E5C0→#FFE600→#FF8A00" },
            ]},
          { id:"web-comp-onb", name:"onboarding", type:"folder", path:"apps/web/components/onboarding", status:"NEW", badge:"FROM VisaguideOS", count:15,
            children:[
              { id:"c-onb-1", name:"OnboardingCompanion.tsx", type:"file", path:"apps/web/components/onboarding/OnboardingCompanion.tsx", status:"NEW", badge:"FROM VisaguideOS", desc:"Main orchestrator AI-driven conversational one question at a time deterministically-gated remaining fields — saves to onboarding_memory — on completion → /uprm" },
              { id:"c-onb-2", name:"OnboardingStep.tsx", type:"file", path:"apps/web/components/onboarding/OnboardingStep.tsx", status:"NEW", desc:"Question renderer text select multi yesno number date" },
              { id:"c-onb-3", name:"OnboardingCompletion.tsx", type:"file", path:"apps/web/components/onboarding/OnboardingCompletion.tsx", status:"NEW", desc:"Your workshop is ready! 3 projects auto-created UPRM COMMAND CENTER unlocked" },
              { id:"c-onb-4", name:"CompanionMessage.tsx", type:"file", path:"apps/web/components/onboarding/CompanionMessage.tsx", status:"NEW", desc:"Why we ask this: To show your work in Work Feed within 10mi Oldham" },
              { id:"c-onb-5", name:"QuantumBackground.tsx", type:"file", path:"apps/web/components/onboarding/QuantumBackground.tsx", status:"NEW", badge:"FROM VisaguideOS", desc:"M gradient background" },
              { id:"c-onb-6", name:"hooks/useOnboardingMemory.ts", type:"file", path:"apps/web/components/onboarding/hooks/useOnboardingMemory.ts", status:"NEW", desc:"saveStep completeOnboarding" },
              { id:"c-onb-7", name:"services/OnboardingConversationService.ts", type:"file", path:"apps/web/components/onboarding/services/OnboardingConversationService.ts", status:"NEW", desc:"appendTurn loadTurns ConversationTurn turnIndex fieldId questionText whyText userAnswer answerValue" },
              { id:"c-onb-8", name:"services/OnboardingMemoryService.ts", type:"file", path:"apps/web/components/onboarding/services/OnboardingMemoryService.ts", status:"NEW", desc:"onboarding_memory contract" },
              { id:"c-onb-9", name:"rules/fieldGating.ts", type:"file", path:"apps/web/components/onboarding/rules/fieldGating.ts", status:"NEW", badge:"FROM VisaguideOS", desc:"getEligibleFields ALL_FIELDS FieldDef — appliesIf autoAnswer — if shopItems no → remove shopItemsList — if trade !== Tailor → remove Aso-Ebi — if trade !== Electrician → remove consumerUnitDetails RCD 30mA BS 7671 — if trade !== Plumber → remove Gas Safe boiler" },
              { id:"c-onb-10", name:"rules/gatingEngine.ts", type:"file", path:"apps/web/components/onboarding/rules/gatingEngine.ts", status:"NEW", badge:"FROM VisaguideOS", desc:"Reuse as-is deterministic" },
              { id:"c-onb-11", name:"config/onboardingSteps.ts", type:"file", path:"apps/web/components/onboarding/config/onboardingSteps.ts", status:"NEW", desc:"32 fields 4 phases Craft Identity Work DNA Production Engine UPRM Brain — CompanionQuestion id type label placeholder options help required" },
            ]},
        ]},
    ]
  }
];

const SUPABASE_TREE: TreeNodeData = {
  id:"supabase", name:"supabase", type:"folder", path:"supabase", count:40,
  children:[
    { id:"supa-func", name:"functions", type:"folder", path:"supabase/functions", count:1,
      children:[{ id:"supa-onb-chat", name:"onboarding-chat", type:"folder", path:"supabase/functions/onboarding-chat", status:"NEW", badge:"FROM VisaguideOS", count:2,
        children:[
          { id:"supa-onb-idx", name:"index.ts", type:"file", path:"supabase/functions/onboarding-chat/index.ts", status:"NEW", badge:"FROM VisaguideOS", desc:"Edge fn — Payload answersSoFar eligibleFields conversationHistory latestUserReply → { done nextFieldId questionText whyText } — AI chooses one question at a time" },
          { id:"supa-onb-deno", name:"deno.json", type:"file", path:"supabase/functions/onboarding-chat/deno.json", status:"NEW", desc:"Deno config" }
        ]}]},
    { id:"supa-tables", name:"tables", type:"folder", path:"supabase/tables", count:12,
      children:[
        { id:"t1", name:"public.onboarding_conversations", type:"file", path:"supabase/tables/onboarding_conversations.sql", status:"NEW", desc:"turnIndex fieldId questionText whyText userAnswer answerValue" },
        { id:"t2", name:"public.onboarding_memory", type:"file", path:"supabase/tables/onboarding_memory.sql", status:"NEW", desc:"steps" },
        { id:"t3", name:"public.projects", type:"file", path:"supabase/tables/projects.sql", status:"DONE", desc:"killer object Before After milestone materials team cost" },
        { id:"t4", name:"public.uprm_contacts", type:"file", path:"supabase/tables/uprm_contacts.sql", status:"NEW", desc:"Relationship 0-100" },
        { id:"t5", name:"public.uprm_interactions", type:"file", path:"supabase/tables/uprm_interactions.sql", status:"NEW", desc:"event-sourced" },
        { id:"t6", name:"public.uprm_journeys", type:"file", path:"supabase/tables/uprm_journeys.sql", status:"NEW", desc:"state machine Discovery→Repeat" },
        { id:"t7", name:"public.shop_items", type:"file", path:"supabase/tables/shop_items.sql", status:"DONE", desc:"£45/m" },
        { id:"t8", name:"public.bookings", type:"file", path:"supabase/tables/bookings.sql", status:"DONE", desc:"escrow 10% Jobs 5% Shop" },
        { id:"t9", name:"public.mfc_wallet", type:"file", path:"supabase/tables/mfc_wallet.sql", status:"DONE", desc:"coins gifts" },
        { id:"t10", name:"public.trust_ledger", type:"file", path:"supabase/tables/trust_ledger.sql", status:"DONE", desc:"event-sourced" },
        { id:"t11", name:"public.bot_logs", type:"file", path:"supabase/tables/bot_logs.sql", status:"NEW", desc:"9 bots" },
        { id:"t12", name:"public.work_feed", type:"file", path:"supabase/tables/work_feed.sql", status:"DONE", desc:"Work Feed 12.4K" },
      ]},
  ]
};

const PACKAGES_TREE: TreeNodeData = {
  id:"packages", name:"packages", type:"folder", path:"packages", count:100,
  children:[
    { id:"pkg-ui", name:"ui", type:"folder", path:"packages/ui", count:40,
      children:[
        { id:"pkg-ui-m", name:"MLogo.tsx", type:"file", path:"packages/ui/MLogo.tsx", status:"DONE", desc:"M logo gradient" },
        { id:"pkg-ui-btn", name:"Button.tsx", type:"file", path:"packages/ui/Button.tsx", status:"DONE", desc:"M gradient border" },
        { id:"pkg-ui-card", name:"Card.tsx", type:"file", path:"packages/ui/Card.tsx", status:"DONE", desc:"glassmorphism" },
        { id:"pkg-ui-badge", name:"Badge.tsx", type:"file", path:"packages/ui/Badge.tsx", status:"DONE", desc:"DONE NEW FROM" },
        { id:"pkg-ui-slider", name:"Slider.tsx", type:"file", path:"packages/ui/Slider.tsx", status:"DONE", desc:"Before/After slider" },
        { id:"pkg-ui-kanban", name:"Kanban.tsx", type:"file", path:"packages/ui/Kanban.tsx", status:"NEW", desc:"8 columns draggable" },
        { id:"pkg-ui-etc", name:"... 34 more", type:"file", path:"packages/ui/*", status:"DONE", desc:"Tailwind black #050505 M gradient components" },
      ]},
    { id:"pkg-config", name:"config", type:"folder", path:"packages/config", count:10,
      children:[
        { id:"pkg-tailwind", name:"tailwind.config.ts", type:"file", path:"packages/config/tailwind.config.ts", status:"DONE", desc:"Poppins Bold 800 Inter JetBrains Mono" },
        { id:"pkg-ts", name:"tsconfig.json", type:"file", path:"packages/config/tsconfig.json", status:"DONE", desc:"Turbo monorepo paths" },
      ]},
    { id:"pkg-types", name:"types", type:"folder", path:"packages/types", count:20,
      children:[
        { id:"pkg-type-proj", name:"Project.ts", type:"file", path:"packages/types/Project.ts", status:"DONE", desc:"killer object Before After milestone" },
        { id:"pkg-type-contact", name:"UPRMContact.ts", type:"file", path:"packages/types/UPRMContact.ts", status:"NEW", desc:"Relationship 0-100 Journey" },
        { id:"pkg-type-mfc", name:"MFC.ts", type:"file", path:"packages/types/MFC.ts", status:"DONE", desc:"Gift Hammer 10 Scissors 25 Heart 50 Crown 100 Trophy 500" },
        { id:"pkg-type-bot", name:"Bot.ts", type:"file", path:"packages/types/Bot.ts", status:"NEW", desc:"Milo Cutty Quoto Timi Findy Helpy Veri Growy Lingo" },
      ]},
  ]
};

const ROOT_TREE: TreeNodeData = {
  id:"root", name:"my-face-profile/", type:"folder", path:"my-face-profile/", count:640,
  children:[
    { id:"pnpm", name:"pnpm-workspace.yaml", type:"file", path:"pnpm-workspace.yaml", status:"DONE", desc:"Turbo monorepo workspaces: apps/* packages/*" },
    { id:"turbo", name:"turbo.json", type:"file", path:"turbo.json", status:"DONE", desc:"Turbo pipeline build dev lint" },
    { id:"pkgjson", name:"package.json", type:"file", path:"package.json", status:"DONE", desc:"Root package pnpm dev" },
    { id:"apps", name:"apps", type:"folder", path:"apps", count:300,
      children:[
        { id:"apps-marketing", name:"marketing/", type:"folder", path:"apps/marketing", count:120, status:"DONE", badge:"26 Pages + 2 legal coins = 28 routes", children: MARKETING_PAGES[0].children },
        { id:"apps-web", name:"web/ — MAIN APP UPRM COMMAND CENTER PID 1", type:"folder", path:"apps/web", count:180, status:"NEW", badge:"PID 1", children: WEB_TREE[0].children },
      ]},
    SUPABASE_TREE,
    PACKAGES_TREE,
    { id:"assets", name:"assets/", type:"folder", path:"assets/", count:100, status:"DONE", desc:"100 assets — tailor lace mechanic builder barber electrician plumber" },
    { id:"tests", name:"tests/", type:"folder", path:"tests/", count:100, status:"DONE", desc:"100 tests" },
  ]
};

function StatusBadge({ status, badge }: { status?: Status, badge?: string }){
  if(!status && !badge) return null;
  const map: Record<string,string> = {
    DONE:"bg-[var(--done)] text-black",
    NEW:"bg-[var(--new)] text-black",
    FROM:"bg-[var(--from)] text-[#0A1931]",
  };
  return (
    <div className="flex items-center gap-1.5 ml-2">
      {status && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest ${map[status]}`}>{status}</span>}
      {badge && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0E9DB] text-[#5B6470] border border-[#D4CBB8]">{badge}</span>}
    </div>
  );
}

function FileIcon({ node, expanded }: { node: TreeNodeData, expanded?: boolean }){
  if(node.type==="folder"){
    return expanded ? <FolderOpen className="w-4 h-4 text-amber-300/80" /> : <Folder className="w-4 h-4 text-amber-300/60" />;
  }
  if(node.name.endsWith(".tsx")||node.name.endsWith(".ts")) return <FileCode className="w-4 h-4 text-sky-300/70" />;
  if(node.name.endsWith(".yaml")||node.name.endsWith(".json")) return <FileJson className="w-4 h-4 text-lime-300/70" />;
  return <FileText className="w-4 h-4 text-[#5B6470]" />;
}

function TreeRow({ node, depth, expanded, selected, onToggle, onSelect, search }: {
  node: TreeNodeData, depth: number, expanded: boolean, selected: boolean, onToggle: ()=>void, onSelect: ()=>void, search: string
}){
  const highlight = search && node.name.toLowerCase().includes(search.toLowerCase());
  return (
    <div
      className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all border ${selected ? "bg-[#F0E9DB] border-[#D4CBB8] text-[#0A1931]" : "border-transparent hover:bg-[#F0E9DB] hover:border-[#D4CBB8] text-[#5B6470] hover:text-[#0A1931]"} ${highlight ? "ring-1 ring-[var(--m-lime)]/30" : ""}`}
      style={{ marginLeft: depth*16 }}
      onClick={onSelect}
    >
      <button onClick={(e)=>{ e.stopPropagation(); if(node.children) onToggle(); }} className="w-4 h-4 flex items-center justify-center shrink-0">
        {node.children ? <span className={`text-[10px] transition-transform ${expanded ? "rotate-90" : ""}`}>▶</span> : <span className="w-4" />}
      </button>
      <FileIcon node={node} expanded={expanded} />
      <span className="font-mono text-[13px] tracking-tight truncate">{node.name}</span>
      {node.count !== undefined && <span className="ml-auto text-[11px] font-mono text-[#5B6470]">{node.count} files</span>}
      <StatusBadge status={node.status as Status} badge={node.badge} />
      {node.desc && depth>0 && <span className="hidden xl:block ml-2 text-[11px] text-[#5B6470] truncate max-w-[260px]">— {node.desc}</span>}
    </div>
  );
}

export default function ArchitecturePage(){
  const [expandedSet, setExpandedSet] = useState<Set<string>>(new Set(["root","apps","apps-marketing","apps-web","web-app","web-uprm","supabase","packages","web-comp","web-comp-uprm","web-comp-onb"]));
  const [selectedId, setSelectedId] = useState<string>("web-uprm-page");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "ALL">("ALL");
  const [showStats, setShowStats] = useState(true);
  // --- Persistent OS Memory (backend) ---
  const [pins, setPins] = useState<any[]>([]);
  const [pinsLoading, setPinsLoading] = useState(true);
  const [pinsError, setPinsError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [resultInfo, setResultInfo] = useState<{saved:number, remaining:number, error:string|null, reloadError:string|null} | null>(null);

  async function reloadRecords(){
    const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.list", args: { collection: "project_pins", limit: 100 } }) });
    const payload = await res.json();
    if (!res.ok || payload.error) throw new Error(payload.error || "list failed");
    setPins(payload.data.records || []);
  }

  useEffect(()=>{
    (async ()=>{
      try{
        setPinsLoading(true);
        const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.list", args: { collection: "project_pins", limit: 100 } }) });
        const payload = await res.json();
        if(!res.ok || payload.error) throw new Error(payload.error || "load failed");
        setPins(payload.data.records || []);
      }catch(e:any){
        setPinsError(e?.message || String(e));
      }finally{
        setPinsLoading(false);
      }
    })();
  },[]);

  async function createRow(row:any){
    const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.create", args: { collection: "project_pins", value: row } }) });
    const payload = await res.json();
    if(!res.ok || payload.error) throw new Error(payload.error || "create failed");
    return payload.data;
  }

  async function handlePinCurrent(){
    if(!selectedNode) return;
    const note = newNote.trim() || `Pinned ${selectedNode.name} for UPRM review`;
    setBusy(true);
    let saved=0; let error:string|null=null;
    const rows=[{ path: selectedNode.path, name: selectedNode.name, desc: selectedNode.desc || "", note, createdAt: new Date().toISOString(), status: selectedNode.status || "NEW" }];
    try{
      for(const row of rows){
        await createRow(row);
        saved+=1;
      }
    }catch(e:any){
      error = e instanceof Error ? e.message : String(e);
    }
    let reloadError:string|null=null;
    try{ await reloadRecords(); }catch(e:any){ reloadError = e instanceof Error ? e.message : String(e); }
    setResultInfo({ saved, remaining: rows.length - saved, error, reloadError });
    setBusy(false);
    setNewNote("");
  }

  async function handleDeletePin(id:string){
    try{
      const res = await fetch("actions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "records.delete", args: { collection: "project_pins", id } }) });
      const payload = await res.json();
      if(!res.ok || payload.error) throw new Error(payload.error || "delete failed");
      await reloadRecords();
    }catch(e:any){
      setPinsError(e.message || String(e));
    }
  }

  const allNodes = useMemo(()=>{
    const arr: TreeNodeData[] = [];
    function walk(n: TreeNodeData){ arr.push(n); n.children?.forEach(walk); }
    walk(ROOT_TREE);
    return arr;
  },[]);

  const selectedNode = useMemo(()=> allNodes.find(n=>n.id===selectedId) || ROOT_TREE, [allNodes, selectedId]);

  const toggle = (id:string)=>{
    setExpandedSet(prev=>{
      const next = new Set(prev);
      if(next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  function renderTree(nodes: TreeNodeData[], depth=0): React.ReactNode{
    return nodes.map(node=>{
      const exp = expandedSet.has(node.id);
      const sel = selectedId===node.id;
      const matchesFilter = filter==="ALL" || node.status===filter || node.badge?.includes(filter as string);
      const matchesSearch = !search || node.name.toLowerCase().includes(search.toLowerCase()) || node.path.toLowerCase().includes(search.toLowerCase()) || (node.desc?.toLowerCase().includes(search.toLowerCase()));
      if(!matchesFilter && !matchesSearch && !(node.children?.some(c=> c.name.toLowerCase().includes(search.toLowerCase())))) {
        // hide if no match and not parent of match - but still show parent if child matches? simplified: hide only files
        if(node.type==="file") return null;
      }
      return (
        <div key={node.id}>
          <TreeRow node={node} depth={depth} expanded={exp} selected={sel} onToggle={()=>toggle(node.id)} onSelect={()=>setSelectedId(node.id)} search={search} />
          {node.children && exp && (
            <div className="border-l border-[#D4CBB8] ml-5">
              {renderTree(node.children, depth+1)}
            </div>
          )}
        </div>
      );
    });
  }

  return (
    <div data-safe-area-inset-root className="min-h-screen bg-[#FFFDF7] text-[#0A0A0A] selection:bg-[var(--m-lime)] selection:text-black" style={{ boxSizing:'border-box', paddingTop:'var(--safe-area-inset-top)' }}>
      {/* Top Stats Bar */}
      <div className="sticky top-0 z-30 border-b border-[#D4CBB8] backdrop-blur-2xl" data-safe-area-sticky-top style={{ top:'var(--safe-area-inset-top)' }}>
        <div className="bg-[#FFFDF7]/92">
          <div className="flex flex-wrap items-center gap-2 px-3 md:px-5 py-2.5 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg m-gradient flex items-center justify-center font-black text-black text-[14px]">M</div>
              <span className="font-poppins font-extrabold text-[14px] tracking-tight">MY FACE PROFILE — FULL PROJECT TREE OS</span>
              <span className="hidden md:inline-flex ml-2 px-2 py-0.5 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#5B6470]">Turbo monorepo • pnpm dev • production-ready</span>
            </div>
            <div className="ml-auto flex flex-wrap gap-1.5 items-center">
              {[
                "26 Pages","32 Onboarding Fields","9 Bots","6 Trades","12 Projects","47 Contacts","1247 MFC","4.9 Trust","£618K ARR","640 Files","Touch of GOD"
              ].map(k=>(
                <span key={k} className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[#5B6470] hover:bg-[#F0E9DB] transition-colors">{k}</span>
              ))}
            </div>
          </div>
          <div className="h-[2px] w-full m-gradient opacity-80" />
        </div>
      </div>

      {/* Search + Filter */}
      <div className="sticky z-20 backdrop-blur-xl bg-[#FFFDF7]/90 border-b border-[#D4CBB8]" style={{ top:'calc(var(--safe-area-inset-top) + 56px)' }} data-safe-area-sticky-top>
        <div className="flex flex-col md:flex-row gap-2 px-3 md:px-5 py-3">
          <div className="flex items-center gap-2 flex-1 glass rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-[#5B6470]" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search files: onboarding companion, uprm, projects, tailors, mechanic, trust..." className="flex-1 bg-transparent outline-none text-[13px] font-mono placeholder:text-[#5B6470]" />
            {search && <button onClick={()=>setSearch("")} className="text-[11px] px-2 py-0.5 rounded bg-[#F0E9DB]">clear</button>}
          </div>
          <div className="flex gap-1.5 items-center overflow-x-auto">
            {(["ALL","DONE","NEW","FROM"] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f as any)} className={`px-3 py-2 rounded-xl text-[11px] font-bold tracking-widest border transition-all shrink-0 ${filter===f ? "bg-white text-black border-white" : "bg-[#F0E9DB] border-[#D4CBB8] text-[#5B6470] hover:text-[#0A1931] hover:bg-[#F0E9DB]"}`}>{f}</button>
            ))}
            <button onClick={()=>setShowStats(s=>!s)} className="ml-2 px-3 py-2 rounded-xl text-[11px] font-bold tracking-widest bg-[var(--m-lime)] text-black">STATS {showStats?"ON":"OFF"}</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-120px)]">
        {/* LEFT TREE */}
        <div className="lg:w-[48%] xl:w-[52%] border-r border-[#D4CBB8] bg-[#080808]">
          <div className="p-3 flex items-center gap-2 text-[11px] font-mono text-[#5B6470]">
            <Layers className="w-3.5 h-3.5" /> VS CODE EXPLORER • my-face-profile/ • 640 files • MVP 250 • Full 620-650
            <span className="ml-auto flex gap-1">
              <span className="w-3 h-3 rounded-full bg-red-500/70" /><span className="w-3 h-3 rounded-full bg-yellow-400/70" /><span className="w-3 h-3 rounded-full bg-green-400/70" />
            </span>
          </div>
          <div className="px-2 pb-20 space-y-0.5 overflow-x-clip">
            {renderTree([ROOT_TREE])}
          </div>
        </div>

        {/* RIGHT PREVIEW */}
        <div className="lg:w-[52%] xl:w-[48%] bg-[#F0E9DB] relative">
          <div className="sticky top-[108px] p-4 md:p-6 space-y-5" style={{ top:'calc(var(--safe-area-inset-top) + 108px)' }}>
            {/* Path breadcrumb */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#5B6470] overflow-x-auto">
              <FileText className="w-3 h-3 shrink-0" />
              <span className="truncate">{selectedNode.path}</span>
              <span className="ml-auto flex items-center gap-1 shrink-0">
                <StatusBadge status={selectedNode.status as Status} badge={selectedNode.badge} />
              </span>
            </div>

            {/* Hero preview card */}
            <div className="glass-strong rounded-[24px] overflow-hidden">
              <div className="h-[2px] w-full m-gradient" />
              <div className="p-5 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-xl m-gradient flex items-center justify-center text-black font-black">M</div>
                      <h2 className="font-poppins font-extrabold text-[22px] md:text-[28px] leading-none tracking-tight">{selectedNode.preview?.title || selectedNode.name}</h2>
                    </div>
                    <p className="font-mono text-[12px] md:text-[13px] text-[#5B6470] leading-relaxed max-w-[520px]">{selectedNode.preview?.subtitle || selectedNode.desc || selectedNode.deliverable || "Production-ready Turbo monorepo — pnpm-workspace.yaml • Tailwind black #050505 • M gradient #8FFF4A→#00E5C0→#FFE600→#FF8A00 • Poppins Bold 800 • Inter • JetBrains Mono • Glassmorphism"}</p>
                  </div>
                  <div className="hidden md:flex flex-col gap-2">
                    {selectedNode.count && <span className="px-3 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] font-mono text-[11px]">{selectedNode.count} files</span>}
                  </div>
                </div>

                {/* Deliverable box */}
                {selectedNode.deliverable && (
                  <div className="mt-5 rounded-2xl bg-black/60 border border-[#D4CBB8] p-4">
                    <div className="text-[10px] font-bold tracking-widest text-[#5B6470] mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3" /> DELIVERABLE / PREVIEW</div>
                    <p className="font-mono text-[12px] leading-relaxed text-[#5B6470]">{selectedNode.deliverable}</p>
                  </div>
                )}

                {/* Metrics */}
                {selectedNode.preview?.metrics && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedNode.preview.metrics.map(m=>(
                      <span key={m} className="px-3 py-1.5 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[11px] font-mono text-[#5B6470]">{m}</span>
                    ))}
                  </div>
                )}

                {/* Stack */}
                {selectedNode.preview?.stack && (
                  <div className="mt-4">
                    <div className="text-[10px] font-bold tracking-widest text-[#5B6470] mb-2">STACK / SOURCE</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.preview.stack.map(s=>(
                        <span key={s} className="px-2.5 py-1 rounded-lg bg-black border border-[#D4CBB8] font-mono text-[11px] text-[var(--m-teal)]">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Visual mock for UPRM */}
                {selectedNode.id==="web-uprm-page" && (
                  <div className="mt-6 space-y-4">
                    {/* Mini OS */}
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-3 bg-[#FFFDF7] border border-[#D4CBB8] rounded-xl p-3">
                        <div className="text-[10px] font-bold tracking-widest text-[#5B6470] mb-2">LEFT SIDEBAR 240px</div>
                        <div className="space-y-1.5 font-mono text-[10px] text-[#5B6470]">
                          <div className="flex items-center gap-2"><Box className="w-3 h-3" /> M logo</div>
                          <div className="text-[#0A1931]">OS Core • Dashboard</div>
                          <div>Projects 12</div><div>UPRM Contacts 47</div><div>Relationship 0-100</div><div>Pipeline 8</div><div>Work Feed</div><div className="h-px bg-[#F0E9DB] my-1" />
                          <div>Production • Shop 24</div><div>Bookings • Live Workshop <span className="w-1.5 h-1.5 inline-block bg-red-500 rounded-full animate-pulse" /></div><div>WorkCut • Analytics</div>
                        </div>
                      </div>
                      <div className="col-span-9 space-y-3">
                        <div className="bg-[#121212] border border-[#D4CBB8] rounded-xl p-3 flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#5B6470]">TOP HEADER sticky • Search + Quick Actions</span>
                          <div className="flex gap-1.5"><span className="px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-bold">New Project M gradient</span><span className="px-2 py-0.5 rounded-full bg-red-500 text-[#0A1931] text-[9px] font-bold animate-pulse">Go Live</span></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            ["Total Projects 12","+3 week"],["Relationships 47","avg 73/100"],["Pipeline £8420","8 active"],
                            ["TrustScore 4.9","Verified Gas Safe"],["MFC Wallet 1247","£600 gifts 70%"],["Work Feed 12.4K","+23%"]
                          ].map(([a,b])=>(
                            <div key={a} className="bg-[#F0E9DB] border border-[#D4CBB8] rounded-xl p-2.5">
                              <div className="font-mono text-[10px] text-[#5B6470]">{a}</div><div className="text-[10px] text-[#5B6470]">{b}</div>
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-12 gap-2">
                          <div className="col-span-8 bg-[#F0E9DB] border border-[#D4CBB8] rounded-xl p-2.5">
                            <div className="text-[10px] font-bold text-[#5B6470] mb-2">ROW 2 PROJECTS COMMANDER killer object</div>
                            <div className="grid grid-cols-3 gap-2">
                              {["Aso-Ebi Wedding £45/m","Kitchen £12K","Consumer Unit 230V","Boiler 68C Gas Safe","Corolla OBD2 P0302","Fade £25"].map(t=>(
                                <div key={t} className="bg-black border border-[#D4CBB8] rounded-lg p-2 text-[9px] font-mono text-[#5B6470]">{t}<div className="mt-1 h-8 rounded bg-gradient-to-br from-white/5 to-white/0" /></div>
                              ))}
                            </div>
                          </div>
                          <div className="col-span-4 bg-[#F0E9DB] border border-[#D4CBB8] rounded-xl p-2.5">
                            <div className="text-[10px] font-bold text-[#5B6470] mb-2">UPRM CONTACTS 0-100</div>
                            {[
                              ["Aisha Bridal","94"],["Mrs Okafor","87"],["J Martinez","72"]
                            ].map(([n,s])=>(
                              <div key={n} className="flex items-center gap-2 mb-1.5"><div className="w-6 h-6 rounded-full bg-[#F0E9DB]" /><div className="text-[9px] font-mono"><div>{n}</div><div className="h-1 w-12 bg-gradient-to-r from-green-400 to-sky-400 rounded-full" /></div><span className="ml-auto text-[9px]">{s}/100</span></div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-[#F0E9DB] border border-[#D4CBB8] rounded-xl p-2.5">
                          <div className="text-[10px] font-bold text-[#5B6470] mb-2">ROW 3 PIPELINE KANBAN Discovery→Repeat 8 cols</div>
                          <div className="flex gap-2 overflow-x-auto">
                            {["Discovery 12","Engagement 8","Inquiry 5","Quote 3","Booked 2","In Progress 2","Final 1","Review 1","Repeat 1"].map(c=>(
                              <div key={c} className="min-w-[72px] bg-black border border-[#D4CBB8] rounded-lg p-1.5 text-[8px] font-mono text-[#5B6470]">{c}<div className="mt-1 h-6 bg-[#F0E9DB] rounded" /></div>
                            ))}
                          </div>
                          <div className="mt-2 flex gap-1">
                            {["Milo","Cutty","Quoto","Timi","Findy","Helpy","Veri","Growy","Lingo"].map(b=>(
                              <span key={b} className="px-1.5 py-0.5 rounded-full bg-[var(--m-lime)]/20 border border-[var(--m-lime)]/30 text-[8px] text-[var(--m-lime)]">{b}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bot army + gift rain */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass rounded-xl p-3">
                        <div className="text-[10px] font-bold tracking-widest text-[#5B6470] flex items-center gap-1"><Cpu className="w-3 h-3" /> BOT ARMY 9 micro-bots green active</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {[
                            {n:"Milo",d:"Find leads"},{n:"Cutty",d:"WorkCut"},{n:"Quoto",d:"Quotes"},{n:"Timi",d:"Scheduling"},{n:"Findy",d:"Discovery"},{n:"Helpy",d:"FAQ"},{n:"Veri",d:"Trust"},{n:"Growy",d:"Boost"},{n:"Lingo",d:"Yoruba Hausa English"}
                          ].map(b=>(
                            <div key={b.n} className="px-2 py-1 rounded-full bg-green-500/15 border border-green-500/30 text-[10px] font-mono text-green-300 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />{b.n} • {b.d}</div>
                          ))}
                        </div>
                      </div>
                      <div className="glass rounded-xl p-3">
                        <div className="text-[10px] font-bold tracking-widest text-[#5B6470] flex items-center gap-1"><Heart className="w-3 h-3" /> GIFT RAIN • MFC • 70% pro</div>
                        <div className="mt-2 flex gap-2">
                          {[
                            {icon:Hammer, label:"Hammer 10", color:"text-[#5B6470]"},
                            {icon:Scissors, label:"Scissors 25", color:"text-sky-300"},
                            {icon:Heart, label:"Heart 50", color:"text-pink-300"},
                            {icon:Crown, label:"Crown 100", color:"text-yellow-300"},
                            {icon:Trophy, label:"Trophy 500", color:"text-amber-400"},
                          ].map(g=>(
                            <div key={g.label} className="flex flex-col items-center gap-1"><g.icon className={`w-5 h-5 ${g.color}`} /><span className="text-[8px] font-mono text-[#5B6470]">{g.label}</span></div>
                          ))}
                        </div>
                        <div className="mt-3 h-8 rounded-lg bg-black/60 border border-[#D4CBB8] flex items-center justify-center overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--m-lime)]/10 to-transparent animate-pulse" />
                          <span className="text-[10px] font-mono text-[#5B6470]">Gift rain preview • girl live streaming tripod viewers 0 • Start Live gradient red→orange</span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl m-gradient p-[1px]">
                      <div className="rounded-[11px] bg-black p-3 flex items-center justify-between">
                        <span className="font-poppins font-extrabold text-[13px]">Your Work Is Your Face. Promote Enhance — Go Live Now</span>
                        <span className="font-mono text-[10px] text-[#5B6470]">£9620/week = £618K ARR • 10K weekly users</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Onboarding preview */}
                {selectedNode.id==="m-onboard-f" && (
                  <div className="mt-6 space-y-3">
                    <div className="rounded-2xl overflow-hidden border border-[#D4CBB8]">
                      <div className="h-28 m-gradient opacity-80 relative">
                        <div className="absolute inset-0 bg-black/30" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="glass-strong rounded-2xl px-5 py-3 text-center">
                            <div className="font-poppins font-extrabold text-black mix-blend-screen text-[14px]">QuantumBackground M gradient</div>
                            <div className="font-mono text-[10px] text-black/60">#8FFF4A → #00E5C0 → #FFE600 → #FF8A00</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#0F0F0F] p-4 space-y-3">
                        <div className="flex gap-2">
                          <div className="w-7 h-7 rounded-full m-gradient flex items-center justify-center text-black font-bold text-[10px]">AI</div>
                          <div className="glass rounded-xl px-3 py-2 max-w-[80%]">
                            <div className="text-[11px] font-semibold">What craft makes your hands remember why you started?</div>
                            <div className="text-[10px] font-mono text-[#5B6470] mt-1">Why we ask this: To show your work in Work Feed within 10mi Oldham — CompanionMessage whyText</div>
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <div className="bg-white text-black rounded-xl px-3 py-2 max-w-[70%] text-[11px] font-medium">Tailoring luxury Aso-Ebi — AYO'S TAILORS Spindlegate OL1</div>
                          <div className="w-7 h-7 rounded-full bg-white/20" />
                        </div>
                        <div className="flex gap-2">
                          <div className="w-7 h-7 rounded-full m-gradient flex items-center justify-center text-black font-bold text-[10px]">AI</div>
                          <div className="glass rounded-xl px-3 py-2">
                            <div className="text-[11px]">Got it. Do you have a workshop or work from home? <span className="text-[#5B6470] font-mono text-[10px]">— fieldGating.ts • if shopItems no → remove shopItemsList</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        ["Craft Identity","8 fields","#8FFF4A"],
                        ["Work DNA","10 fields","#00E5C0"],
                        ["Production Engine","7 fields","#FFE600"],
                        ["UPRM Brain","7 fields","#FF8A00"],
                      ].map(([t,c,col])=>(
                        <div key={t} className="rounded-xl bg-[#F0E9DB] border border-[#D4CBB8] p-2.5">
                          <div className="w-2 h-2 rounded-full mb-2" style={{ background:col }} />
                          <div className="font-poppins font-bold text-[11px] leading-tight">{t}</div>
                          <div className="font-mono text-[10px] text-[#5B6470]">{c}</div>
                        </div>
                      ))}
                    </div>
                    <div className="glass rounded-xl p-3 font-mono text-[11px] leading-relaxed text-[#5B6470]">
                      <div className="text-[10px] font-bold tracking-widest text-[#5B6470] mb-1">GATING ENGINE — Deterministically-gated</div>
                      Field schema config/onboardingSteps.ts → 32 fields • getEligibleFields ALL_FIELDS FieldDef • appliesIf autoAnswer • if trade !== Tailor → remove Aso-Ebi • if trade !== Electrician → remove consumerUnitDetails RCD 30mA BS 7671 • if trade !== Plumber → remove Gas Safe boiler • rules/gatingEngine.ts reuse as-is deterministic • Edge fn onboarding-chat Payload answersSoFar eligibleFields conversationHistory latestUserReply → {`{ done nextFieldId questionText whyText }`} • on completion → /uprm command center
                    </div>
                  </div>
                )}

                {/* Default image placeholder for DONE pages */}
                {!["web-uprm-page","m-onboard-f"].includes(selectedNode.id) && selectedNode.preview?.hero && (
                  <div className="mt-5 rounded-2xl bg-black border border-[#D4CBB8] p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl m-gradient flex items-center justify-center text-black"><Eye className="w-6 h-6" /></div>
                    <div>
                      <div className="font-mono text-[11px] text-[#5B6470]">PREVIEW IMAGE</div>
                      <div className="font-poppins font-bold text-[13px]">{selectedNode.preview.hero}</div>
                    </div>
                  </div>
                )}

                {/* Footer meta */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono text-[#5B6470]"><GitBranch className="w-3 h-3" /> {selectedNode.path}</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono text-[#5B6470]"><Package className="w-3 h-3" /> file counts per folder</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono text-[#5B6470]"><Construction className="w-3 h-3" /> Touch of GOD • craft as worship</span>
                </div>
              </div>
            </div>

            {/* Full project count breakdown */}
            {showStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { k:"Marketing", v:"26 pages + 2 legal coins = 28 routes ~120 files", icon:Grid3X3 },
                  { k:"App dashboard UPRM", v:"26 + onboarding 15 + components 12 = ~180 files", icon:Cpu },
                  { k:"Backend supabase", v:"functions + tables = ~40 files", icon:Server },
                  { k:"Shared + assets + tests", v:"100 + 100 + 100 = 300 files", icon:Database },
                ].map(b=>(
                  <div key={b.k} className="glass rounded-xl p-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#5B6470]"><b.icon className="w-3 h-3" /> {b.k.toUpperCase()}</div>
                    <div className="mt-1 font-mono text-[11px] text-[#5B6470] leading-tight">{b.v}</div>
                  </div>
                ))}
                <div className="col-span-2 md:col-span-4 rounded-xl m-gradient p-[1px]">
                  <div className="rounded-[11px] bg-[#FFFDF7] px-4 py-3 flex flex-wrap items-center gap-3">
                    <span className="font-poppins font-extrabold text-[13px]">Total = 120+180+40+100 = 440 + assets 100 = 540 + tests 100 = 640 files — MVP 250 files — Full 620-650 files</span>
                    <span className="ml-auto px-3 py-1 rounded-full bg-white text-black font-mono text-[11px] font-bold">PRODUCTION-READY Turbo monorepo pnpm dev</span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer narrative */}
            <div className="glass rounded-2xl p-4 md:p-5">
              <div className="flex items-center gap-2 mb-2"><Flame className="w-4 h-4 text-[var(--m-orange)]" /><span className="font-poppins font-extrabold text-[12px] tracking-widest">FULL PROJECT TREE — FROM VisaguideOS</span></div>
              <p className="font-mono text-[11px] leading-relaxed text-[#5B6470]">
                From <span className="text-[var(--m-teal)]">Documents/passport-paper/src/onboarding/companion/OnboardingCompanion.tsx</span> → My Face Profile UPRM Onboarding Companion Page 25 → UPRM COMMAND CENTER DASHBOARD Page 26 PID 1 — Combination of everything for users to promote enhance work content — Production-ready Turbo monorepo <span className="text-[#0A1931]">pnpm dev</span> — Ship Oldham Test — <span className="text-[var(--m-lime)]">Your Work Is Your Face. Not Your CV.</span> — 10K weekly users = £9620/week Gifts £600 + Jobs £6300 + Shop £420 + Boost £1500 + Supplier Ads £500 + Lead Unlock £300 = £51528/mo = £618K ARR without Pro — £12882/week with Pro £29/mo — Glassmorphism holy workshop dark OS #050505 glass white/5 backdrop-blur rounded-2xl border white/10 card drop slide-in touch of GOD craft as worship.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono flex items-center gap-1"><MapPin className="w-3 h-3" /> Oldham OL1 OL2 OL8 Manchester 10mi</span>
                <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono flex items-center gap-1"><Workflow className="w-3 h-3" /> VisaguideOS → Roadagel → Oldham Test → MFP OS</span>
                <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono flex items-center gap-1"><Shield className="w-3 h-3" /> Verified Pro 4 steps TrustScore formula Trust Ledger event-sourced</span>
                <span className="px-2.5 py-1 rounded-full bg-[#F0E9DB] border border-[#D4CBB8] text-[10px] font-mono flex items-center gap-1"><Zap className="w-3 h-3" /> Data→Traffic flywheel Free→Projects→Work Feed→Discovery→Trust→Commerce→Data→Traffic→Gifts→More Projects</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom sticky legend */}
      <div className="sticky bottom-0 z-20 border-t border-[#D4CBB8] bg-[#FFFDF7]/92 backdrop-blur-2xl" data-safe-area-sticky-top style={{ top:'calc(100vh - 44px)' }}>
        <div className="px-3 md:px-5 py-2.5 flex flex-wrap items-center gap-3 text-[11px] font-mono">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--done)]" /> DONE green 26/26 marketing</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--new)]" /> NEW yellow Page 25 26 onboarding UPRM</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[var(--from)]" /> FROM VisaguideOS blue replicated deterministically-gated</span>
          <span className="ml-auto hidden md:flex items-center gap-2 text-[#5B6470]">Click file → preview • Expand folder • Search filter by DONE NEW FROM • Path on hover • holy workshop dark OS #050505 glass white/5 backdrop-blur rounded-2xl border white/10</span>
        </div>
        <div className="h-[2px] w-full m-gradient" />
      </div>
    </div>
  );
}
