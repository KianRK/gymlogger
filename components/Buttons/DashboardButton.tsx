import { Pressable, View, StyleSheet } from 'react-native';

import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import useThemeColors from '@/hooks/UseThemeColors';

export default function DashboardButton() {
  const router = useRouter();
  const colors = useThemeColors();

  const goToDashboard = () => {
    router.push({
      pathname: '/dashboard',
    });
  };

  return (
    <View style={styles.componentContainer}>
      <Pressable style={styles.settingsButton} onPress={goToDashboard}>
        <Ionicons name="stats-chart-sharp" size={30} color={colors.icon} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    width: 45,
    height: 45,
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  settingsButton: { alignItems: 'center' },
});
