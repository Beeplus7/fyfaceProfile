import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../src/lib/auth/AuthProvider';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#8FFF4A" />
      </View>
    );
  }

  if (user) return <Redirect href="/(os)/home" />;
  return <Redirect href="/(auth)/login" />;
}
