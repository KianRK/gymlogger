import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import DatabaseProvider from '@/src/providers/DatabaseProvider';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </DatabaseProvider>
  );
}
