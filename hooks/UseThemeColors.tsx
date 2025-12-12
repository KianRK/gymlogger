import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';

import { useSettings } from '@/src/providers/SettingsProvider';
import { Colors } from '@/constants/Colors';

export default function useThemeColors() {
  const { settings } = useSettings();
  const systemTheme = useColorScheme() ?? settings.darkMode;
  const [theme, setTheme] = useState<'light' | 'dark'>(
    systemTheme as 'light' | 'dark'
  );
  const colors = Colors[theme];

  useEffect(() => {
    if (settings.darkMode !== 'system') {
      setTheme(settings.darkMode === 'on' ? 'dark' : 'light');
    } else setTheme(systemTheme as 'light' | 'dark');
  }, [settings.darkMode, systemTheme]);

  return colors;
}
