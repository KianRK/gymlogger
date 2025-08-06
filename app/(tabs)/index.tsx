import { Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

import CalendarButton from '@/components/CalendarButton';
import { Colors } from '@/constants/Colors';

export default function Index() {
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
      <CalendarButton date="06.08.25" onPress={() => {}} />
    </View>
  );
}
