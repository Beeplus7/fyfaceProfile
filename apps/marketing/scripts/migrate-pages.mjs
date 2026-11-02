import fs from 'fs';
import path from 'path';

const SRC = '/tmp/fyface-pages';
const OUT = '/Users/olabamijikola-balogun/myface/apps/marketing/src';
const ASSETS = path.join(OUT, 'assets');
const PAGES = path.join(OUT, 'pages');

const PAGE_MAP = [
  ['Face_Profile_Hero_Home', 'HomePage'],
  ['Face_Profile_How_It', 'HowItWorksPage'],
  ['Face_Profile_Work_Os', 'WorkOsPage'],
  ['Face_Profile_Uprm_Live', 'LiveWorkshopPage'],
  ['Face_Profile_Uprm_Command', 'UprmCommandPage'],
  ['Face_Profile_Projects_No5', 'ProjectsPage'],
  ['Face_Profile_Project_Detail', 'ProjectDetailPage'],
  ['Face_Profile_Pricing_Mfc', 'PricingPage'],
  ['Face_Profile_Verticals_No9', 'VerticalsPage'],
  ['Face_Profile_Tailors_Standalone', 'ForTailorsPage'],
  ['Face_Profile_Mechanics_Standalone', 'ForMechanicsPage'],
  ['Face_Profile_Plumbers_Standalone', 'ForPlumbersPage'],
  ['Face_Profile_About_No10', 'AboutPage'],
  ['Face_Profile_Careers_Standalone', 'CareersPage'],
  ['Face_Profile_Contact_Standalone', 'ContactPage'],
  ['Face_Profile_Blog_Careers', 'BlogPage'],
  ['Face_Profile_Blog_Detail', 'BlogDetailPage'],
  ['Face_Profile_Uprm_Onboarding', 'OnboardingMarketingPage'],
  ['Face_Profile_Sitemap_No12', 'SitemapPage'],
  ['Face_Profile_Full_Project', 'ArchitecturePage'],
];

fs.mkdirSync(ASSETS, { recursive: true });
fs.mkdirSync(PAGES, { recursive: true });

const copied = new Set();
for (const ent of fs.readdirSync(SRC, { withFileTypes: true })) {
  if (!ent.isDirectory()) continue;
  const assetsDir = path.join(SRC, ent.name, 'assets');
  if (!fs.existsSync(assetsDir)) continue;
  for (const f of fs.readdirSync(assetsDir)) {
    if (copied.has(f)) continue;
    fs.copyFileSync(path.join(assetsDir, f), path.join(ASSETS, f));
    copied.add(f);
  }
}
console.log('Assets copied:', copied.size);

const containerRe =
  /import\s+(\w+)\s+from\s+["']container:\/\/\/mnt\/data\/src\/assets\/([^"']+)["'];?/g;

const INTERNAL_ROUTES = [
  '/',
  '/how-it-works',
  '/work-os',
  '/live-workshop',
  '/uprm',
  '/uprm-command',
  '/projects',
  '/pricing',
  '/verticals',
  '/for-tailors',
  '/for-mechanics',
  '/for-plumbers',
  '/for-barbers',
  '/for-builders',
  '/for-electricians',
  '/about',
  '/careers',
  '/contact',
  '/blog',
  '/onboarding',
  '/sitemap',
  '/architecture',
  '/trust',
  '/help',
  '/legal/coins',
  '/legal/privacy',
  '/legal/terms',
];

function linkify(code) {
  let needsLink = false;
  let out = code;
  for (const route of INTERNAL_ROUTES) {
    const esc = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<a(\\s[^>]*?)href="${esc}"`, 'g');
    if (re.test(out)) needsLink = true;
    out = out.replace(re, `<Link$1to="${route}"`);
    out = out.replace(
      new RegExp(`<a(\\s[^>]*?)href='${esc}'`, 'g'),
      `<Link$1to='${route}'`,
    );
  }
  if (needsLink && !out.includes('from "react-router-dom"')) {
    out = out.replace(
      /^import React/m,
      'import { Link } from "react-router-dom";\nimport React',
    );
    if (!out.includes('from "react-router-dom"')) {
      out = `import { Link } from "react-router-dom";\n${out}`;
    }
  }
  if (needsLink) {
    const lines = out.split('\n');
    const stack = [];
    out = lines
      .map((line) => {
        let l = line;
        const opens = (l.match(/<Link[\s>]/g) || []).length;
        const closesInline = (l.match(/<\/Link>/g) || []).length;
        if (opens > closesInline) stack.push('link');
        const aCloses = (l.match(/<\/a>/g) || []).length;
        for (let i = 0; i < aCloses && stack.length; i++) {
          l = l.replace('</a>', '</Link>');
          stack.pop();
        }
        return l;
      })
      .join('\n');
  }
  return out;
}

function transformSource(code, componentName) {
  let out = code.replace(containerRe, (_, varName, file) =>
    `import ${varName} from "../assets/${file}";`,
  );
  out = out.replace(
    /export default function App\s*\(/,
    `export default function ${componentName}(`,
  );
  out = linkify(out);
  return out;
}

for (const [folder, component] of PAGE_MAP) {
  const appPath = path.join(SRC, folder, 'App.tsx');
  if (!fs.existsSync(appPath)) {
    console.warn('Missing', folder);
    continue;
  }
  const code = fs.readFileSync(appPath, 'utf8');
  fs.writeFileSync(
    path.join(PAGES, `${component}.tsx`),
    transformSource(code, component),
  );
  console.log('Wrote', component);
}
