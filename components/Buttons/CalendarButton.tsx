import { StyleSheet, Pressable, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import CustomText from '../CustomText';
import useThemeColors from '@/hooks/UseThemeColors';

type Props = {
  date: string;
  gradientStyle?: ViewStyle;
  onPress?: () => void;
};

export default function CalendarButton({
  date,
  gradientStyle,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';

  return (
    <LinearGradient
      start={{ x: 0.375, y: 0.375 }}
      end={{ x: 0.75, y: 0.75 }}
      colors={[colors.alpha, colors.mainOne, colors.mainTwo]}
      style={[
        {
          height: '12%',
          borderRadius: 8,
          marginTop: '5%',
          marginRight: '5%',
          marginLeft: 'auto',
          marginBottom: 'auto',
          justifyContent: 'center',
        },
        gradientStyle,
      ]}
    >
      <View style={styles.calendarButtonContainer}>
        <Pressable style={styles.calendarButton} onPress={onPress}>
          <CustomText style={styles.calendarButtonLabel}>{date}</CustomText>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  calendarButtonContainer: {
    width: '100%',
    height: '100%',
    minWidth: 180,
    borderRadius: 8,
    justifyContent: 'center',
  },
  calendarButton: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  calendarButtonLabel: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 24,
  },
});
