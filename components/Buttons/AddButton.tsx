import { Pressable, View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
  variant?: 'primary' | 'secondary';
};

export default function AddButton({
  label,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 22,
  variant = 'primary',
}: Props) {
  const colors = useThemeColors();
  const isPrimary = variant === 'primary';
  const foreground = isPrimary ? colors.onPrimary : colors.primary;

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={({ pressed }) => [
          label ? styles.pill : styles.circle,
          {
            backgroundColor: isPrimary ? colors.primary : colors.primarySoft,
            opacity: pressed ? 0.85 : 1,
          },
          isPrimary && shadow(colors.primary, 2),
          buttonStyle,
        ]}
      >
        <Ionicons name="add" size={iconSize} color={foreground} />
        {label && (
          <CustomText
            style={[styles.label, { color: foreground }, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </CustomText>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    height: 48,
    paddingLeft: Spacing.md,
    paddingRight: Spacing.lg,
    borderRadius: Radius.pill,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.body,
  },
});
