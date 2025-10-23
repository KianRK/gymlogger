import { View, useColorScheme, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';
import CustomText from '@/components/CustomText';

export default function CalendarScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <LinearGradient
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      colors={['#ddeaf6ff', '#b3cbe4ff']}
      style={StyleSheet.absoluteFillObject}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CustomText>Calendar Tab</CustomText>
      </View>
    </LinearGradient>
  );
}
