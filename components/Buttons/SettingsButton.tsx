import { Pressable, View, StyleSheet, ViewStyle } from 'react-native';

import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

export default function SettingsButton() {
  const router = useRouter();

  const goToSettings = () => {
    router.push({
      pathname: '/settings',
    });
  };

  return (
    <View style={styles.componentContainer}>
      <Pressable style={styles.settingsButton} onPress={goToSettings}>
        <Ionicons name="settings-sharp" size={30} color={'#222222'} />
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
