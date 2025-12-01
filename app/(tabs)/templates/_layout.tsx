import { Stack } from 'expo-router';

export default function TemplatesLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Templates' }} />
      <Stack.Screen name="template" options={{ title: 'Templates' }} />
    </Stack>
  );
}
