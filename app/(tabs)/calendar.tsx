import { Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Calendar Tab</Text>
    </View>
  );
}
