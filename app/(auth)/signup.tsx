import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useAuth } from '../../src/lib/auth/AuthProvider';

export default function SignupScreen() {
  const { user, loading, configured, signUpWithPassword, signInWithGoogle } = useAuth();
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) return <Redirect href="/(os)/onboarding" />;

  const run = async (fn: () => Promise<void>, ok?: string) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await fn();
      if (ok) setMessage(ok);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-up failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={[styles.root, width < 420 && styles.rootCompact]}>
      <Text style={styles.brand}>MyFace</Text>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.sub}>Then complete 32-field UPRM onboarding</Text>

      <TextInput
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        placeholderTextColor="#64748B"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Password (min 6)"
        placeholderTextColor="#64748B"
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.ok}>{message}</Text> : null}

      <Pressable
        style={styles.cta}
        disabled={busy || !configured}
        onPress={() =>
          run(
            () => signUpWithPassword(email.trim(), password),
            'Check your email to confirm, or continue if confirmations are disabled.',
          )
        }
      >
        {busy ? <ActivityIndicator color="#050505" /> : <Text style={styles.ctaText}>Sign up</Text>}
      </Pressable>

      <Pressable
        style={styles.google}
        disabled={busy || !configured}
        onPress={() => run(() => signInWithGoogle())}
      >
        <Text style={styles.googleText}>Sign up with Google</Text>
      </Pressable>

      <Link href="/(auth)/login" style={styles.link}>
        Already have an account?
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'center',
    padding: 24,
    maxWidth: 440,
    width: '100%',
    alignSelf: 'center',
    gap: 12,
  },
  rootCompact: { paddingHorizontal: 16 },
  brand: { color: '#8FFF4A', fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: '#fff', fontSize: 32, fontWeight: '800' },
  sub: { color: '#94A3B8', marginBottom: 8 },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cta: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#8FFF4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  ctaText: { color: '#050505', fontWeight: '800', fontSize: 16 },
  google: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: { color: '#F8FAFC', fontWeight: '700' },
  link: { color: '#00E5C0', marginTop: 8, textAlign: 'center', fontWeight: '600' },
  error: { color: '#FB7185', fontSize: 13 },
  ok: { color: '#8FFF4A', fontSize: 13 },
});
