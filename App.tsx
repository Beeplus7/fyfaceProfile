import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.brand}>MyFace</Text>
      <Text style={styles.subtitle}>
        React Native + Web · {Platform.OS}
      </Text>
      <Text style={styles.hint}>Edit App.tsx to start building.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1220',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brand: {
    color: '#F8FAFC',
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    color: '#94A3B8',
    fontSize: 16,
  },
  hint: {
    marginTop: 24,
    color: '#64748B',
    fontSize: 14,
  },
});
