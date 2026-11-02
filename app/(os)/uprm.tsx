import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Link } from 'expo-router';

export default function UprmScreen() {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.root, width < 420 && styles.compact]}>
      <Text style={styles.brand}>UPRM</Text>
      <Text style={styles.title}>Command center</Text>
      <Text style={styles.sub}>
        Orchestrator shell — wire live workshop, FlowCRM, bots, and MFC next.
      </Text>
      <View style={styles.row}>
        {['Go Live', 'Boost', 'Bots', 'Trust'].map((label) => (
          <View key={label} style={styles.pill}>
            <Text style={styles.pillText}>{label}</Text>
          </View>
        ))}
      </View>
      <Link href="/(os)/home" asChild>
        <Pressable style={styles.back}>
          <Text style={styles.backText}>← OS home</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505', padding: 24, gap: 12 },
  compact: { paddingHorizontal: 16 },
  brand: { color: '#00E5C0', fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginTop: 48 },
  title: { color: '#fff', fontSize: 32, fontWeight: '800' },
  sub: { color: '#94A3B8', lineHeight: 22 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  pill: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(143,255,74,0.35)',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pillText: { color: '#8FFF4A', fontWeight: '700' },
  back: { marginTop: 28 },
  backText: { color: '#94A3B8', fontWeight: '600' },
});
