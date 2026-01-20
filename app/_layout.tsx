import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import DatabaseProvider from '@/src/providers/DatabaseProvider';
import { SettingsProvider } from '@/src/providers/SettingsProvider';
import { useAuthContext } from '@/hooks/UseAuthContext';
import AuthProvider from '@/src/providers/AuthProvider';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoading } = useAuthContext();
  const [loaded, error] = Font.useFonts({
    'Outfit-Black': require('@/assets/fonts/Outfit-Black.ttf'),
    'Outfit-Bold': require('@/assets/fonts/Outfit-Bold.ttf'),
    'Outfit-ExtraBold': require('@/assets/fonts/Outfit-ExtraBold.ttf'),
    'Outfit-ExtraLight': require('@/assets/fonts/Outfit-ExtraLight.ttf'),
    'Outfit-Light': require('@/assets/fonts/Outfit-Light.ttf'),
    'Outfit-Medium': require('@/assets/fonts/Outfit-Medium.ttf'),
    'Outfit-Regular': require('@/assets/fonts/Outfit-Regular.ttf'),
    'Outfit-SemiBold': require('@/assets/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Thin': require('@/assets/fonts/Outfit-Thin.ttf'),
  });
  useEffect(() => {
    if (loaded || error || !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error, isLoading]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <AuthProvider>
      <DatabaseProvider>
        <SettingsProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
          <StatusBar style="light" />
        </SettingsProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}
