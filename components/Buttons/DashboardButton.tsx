import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import IconButton from '../IconButton';
import useThemeColors from '@/hooks/UseThemeColors';
import { Spacing } from '@/constants/Theme';

export default function DashboardButton() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={styles.componentContainer}>
      <IconButton
        accessibilityLabel="Dashboard"
        onPress={() => router.push({ pathname: '/dashboard' })}
      >
        <Ionicons name="stats-chart-outline" size={22} color={colors.icon} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: { marginLeft: Spacing.md },
});
