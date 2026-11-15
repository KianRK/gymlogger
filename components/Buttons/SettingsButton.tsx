import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import IconButton from '../IconButton';
import useThemeColors from '@/hooks/UseThemeColors';

export default function SettingsButton() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View>
      <IconButton
        accessibilityLabel="Settings"
        onPress={() => router.push({ pathname: '/settings' })}
      >
        <Ionicons name="settings-outline" size={22} color={colors.icon} />
      </IconButton>
    </View>
  );
}
