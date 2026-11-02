import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';
import { getSupabase } from '../supabase';
import { env, isSupabaseConfigured } from '../../config/env';

WebBrowser.maybeCompleteAuthSession();

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      configured,
      signInWithPassword: async (email, password) => {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      },
      signUpWithPassword: async (email, password) => {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      },
      signInWithGoogle: async () => {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase not configured');

        const redirectTo =
          Platform.OS === 'web'
            ? typeof window !== 'undefined'
              ? `${window.location.origin}/auth/callback`
              : `${env.appUrl}/auth/callback`
            : makeRedirectUri({ scheme: 'myface', path: 'auth/callback' });

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo,
            skipBrowserRedirect: Platform.OS !== 'web',
          },
        });
        if (error) throw error;

        if (Platform.OS !== 'web' && data.url) {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectTo,
          );
          if (result.type !== 'success' || !('url' in result) || !result.url) {
            throw new Error('Google sign-in cancelled');
          }
          const url = new URL(result.url);
          const params = new URLSearchParams(
            url.hash.replace(/^#/, '') || url.search.replace(/^\?/, ''),
          );
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          if (!access_token || !refresh_token) {
            throw new Error('No session tokens returned from Google OAuth');
          }
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (sessionError) throw sessionError;
        }
      },
      signOut: async () => {
        const supabase = getSupabase();
        if (supabase) await supabase.auth.signOut();
      },
    }),
    [session, loading, configured],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
