import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';

import useThemeColors from '@/hooks/UseThemeColors';
import { Radius } from '@/constants/Theme';

export type IconButtonVariant = 'ghost' | 'soft' | 'active' | 'danger';

type Props = {
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: number;
  style?: ViewStyle;
  accessibilityLabel?: string;
  children: ReactNode;
};

/** Round, quiet icon button used throughout the app. */
export default function IconButton({
  onPress,
  variant = 'ghost',
  size = 40,
  style,
  accessibilityLabel,
  children,
}: Props) {
  const colors = useThemeColors();

  const background = {
    ghost: 'transparent',
    soft: colors.surfaceAlt,
    active: colors.primarySoft,
    danger: colors.dangerSoft,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        {
          width: size,
          height: size,
          backgroundColor: background,
          opacity: pressed ? 0.6 : 1,
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
