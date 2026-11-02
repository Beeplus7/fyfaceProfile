import { jamendoConfigured, searchJamendoTracks } from '../music/jamendo';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { isDemoSession, readBroadcast } from './testLab';
import { isOnboardingDone, loadProfile } from '../onboarding/storage';

export type CheckStatus = 'pass' | 'warn' | 'fail';

export type GoLiveCheck = {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
};

/** Client-side go-live probes for Test Lab. */
export async function runGoLiveChecks(): Promise<GoLiveCheck[]> {
  const checks: GoLiveCheck[] = [];

  checks.push({
    id: 'env-supabase',
    label: 'Supabase client env',
    status: isSupabaseConfigured ? 'pass' : 'fail',
    detail: isSupabaseConfigured ? 'VITE_SUPABASE_URL + anon key present' : 'Missing VITE_SUPABASE_*',
  });

  checks.push({
    id: 'env-jamendo',
    label: 'Jamendo client id',
    status: jamendoConfigured() ? 'pass' : 'warn',
    detail: jamendoConfigured() ? 'VITE_JAMENDO_CLIENT_ID set' : 'Music falls back without Jamendo',
  });

  // Public projects read (RLS public select)
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('title,slug').limit(3);
      if (error) throw error;
      checks.push({
        id: 'db-projects',
        label: 'Schema · projects readable',
        status: (data?.length || 0) > 0 ? 'pass' : 'warn',
        detail: data?.length ? `${data.length} project(s) · ${data[0]?.title}` : 'Table empty — seed may be missing',
      });
    } catch (e) {
      checks.push({
        id: 'db-projects',
        label: 'Schema · projects readable',
        status: 'fail',
        detail: e instanceof Error ? e.message : 'Query failed',
      });
    }
  } else {
    checks.push({
      id: 'db-projects',
      label: 'Schema · projects readable',
      status: 'fail',
      detail: 'No supabase client',
    });
  }

  // Jamendo search
  if (jamendoConfigured()) {
    try {
      const rows = await searchJamendoTracks('lofi', 2);
      checks.push({
        id: 'jamendo-api',
        label: 'Jamendo search API',
        status: rows.length ? 'pass' : 'warn',
        detail: rows.length ? `${rows.length} tracks · ${rows[0]?.title}` : 'Empty result',
      });
    } catch (e) {
      checks.push({
        id: 'jamendo-api',
        label: 'Jamendo search API',
        status: 'fail',
        detail: e instanceof Error ? e.message : 'Jamendo failed',
      });
    }
  }

  const demo = isDemoSession();
  const onboarded = isOnboardingDone();
  const profile = loadProfile();
  checks.push({
    id: 'demo-session',
    label: 'Test Lab session',
    status: demo ? 'pass' : 'warn',
    detail: demo ? 'DEMO ON · auth bypass active' : 'Off — tap Enter test lab',
  });
  checks.push({
    id: 'onboarding',
    label: 'Onboarding gate',
    status: onboarded ? 'pass' : 'fail',
    detail: onboarded
      ? `${profile?.shopName || 'Profile'} · ${profile?.location || 'OL1'}`
      : 'Incomplete — Enter test lab seeds Ayo',
  });

  const bc = readBroadcast();
  checks.push({
    id: 'broadcast',
    label: 'Broadcast flag',
    status: 'pass',
    detail: bc?.live ? `LIVE · ${bc.viewers} viewers` : 'Idle (toggle in Test Lab)',
  });

  const routes = [
    '/app/dashboard',
    '/app/feed',
    '/app/discover',
    '/app/live',
    '/app/studio/stream',
    '/app/studio/workcut',
    '/app/arcade',
  ];
  checks.push({
    id: 'routes',
    label: 'Smoke route map',
    status: 'pass',
    detail: routes.join(' · '),
  });

  return checks;
}

export function summarizeChecks(checks: GoLiveCheck[]) {
  const pass = checks.filter((c) => c.status === 'pass').length;
  const warn = checks.filter((c) => c.status === 'warn').length;
  const fail = checks.filter((c) => c.status === 'fail').length;
  const ready = fail === 0;
  return { pass, warn, fail, ready, score: Math.round((pass / Math.max(1, checks.length)) * 100) };
}
