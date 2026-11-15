import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

type Props = {
  date: string;
  /** Extra style for the outer pill (name kept for backwards compatibility). */
  gradientStyle?: ViewStyle;
  onPress?: () => void;
};

export default function CalendarButton({
  date,
  gradientStyle,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const interactive = Boolean(onPress);

  return (
    <Pressable
      onPress={onPress}
      disabled={!interactive}
      accessibilityRole={interactive ? 'button' : 'text'}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
        shadow(colors.shadow, 1),
        gradientStyle,
      ]}
    >
      <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      <CustomText style={styles.label}>{date}</CustomText>
      {interactive && (
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.body,
  },
});
