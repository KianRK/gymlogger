import { Link, Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function WorkoutsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Workouts' }} />
      <Stack.Screen name="workout" options={{ title: 'Workouts' }} />
    </Stack>
  );
}
