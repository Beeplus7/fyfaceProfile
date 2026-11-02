import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { getSupabase } from '../../src/lib/supabase';

/** OAuth return route — Supabase web PKCE / hash tokens land here. */
export default function AuthCallback() {
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    void supabase.auth.getSession();
  }, []);

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#8FFF4A" />
      </View>
      <Redirect href="/" />
    </>
  );
}
