import { Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import CustomText from '@/components/CustomText';

export default function TemplatesScreen() {
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
      <Text style={{ fontFamily: 'Outfit-VariableFont_wght' }}>
        Templates tab
      </Text>
    </View>
  );
}
