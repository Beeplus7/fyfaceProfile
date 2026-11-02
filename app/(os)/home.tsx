import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '../../src/lib/auth/AuthProvider';

export default function OsHome() {
  const { user, signOut } = useAuth();
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.root, width < 420 && styles.compact]}>
      <Text style={styles.brand}>MyFace OS</Text>
      <Text style={styles.title}>Command home</Text>
      <Text style={styles.sub}>{user?.email ?? 'Signed in'}</Text>

      <View style={styles.grid}>
        <Link href="/(os)/onboarding" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>UPRM Onboarding</Text>
            <Text style={styles.cardBody}>32 fields · 4 phases</Text>
          </Pressable>
        </Link>
        <Link href="/(os)/uprm" asChild>
          <Pressable style={styles.card}>
            <Text style={styles.cardTitle}>UPRM Center</Text>
            <Text style={styles.cardBody}>Go live · boost · bots</Text>
          </Pressable>
        </Link>
      </View>

      <Pressable style={styles.out} onPress={() => void signOut()}>
        <Text style={styles.outText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505', padding: 24, gap: 12 },
  compact: { paddingHorizontal: 16 },
  brand: { color: '#8FFF4A', fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: 48 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800' },
  sub: { color: '#94A3B8', marginBottom: 12 },
  grid: { gap: 12 },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    padding: 18,
    minHeight: 96,
    justifyContent: 'center',
  },
  cardTitle: { color: '#F8FAFC', fontWeight: '800', fontSize: 18 },
  cardBody: { color: '#94A3B8', marginTop: 4 },
  out: { marginTop: 24, alignItems: 'center', minHeight: 48, justifyContent: 'center' },
  outText: { color: '#FB7185', fontWeight: '700' },
});
