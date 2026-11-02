import Constants from 'expo-constants';

type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  appUrl?: string;
  googleClientId?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

const pick = (...values: Array<string | undefined>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

export const env = {
  supabaseUrl: pick(process.env.EXPO_PUBLIC_SUPABASE_URL, extra.supabaseUrl),
  supabaseAnonKey: pick(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    extra.supabaseAnonKey,
  ),
  appUrl: pick(
    process.env.EXPO_PUBLIC_APP_URL,
    extra.appUrl,
    'https://myfaceprofile.aikova.co.uk',
  ),
  googleClientId: pick(
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    extra.googleClientId,
  ),
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
