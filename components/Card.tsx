import { View, ViewProps, StyleSheet } from 'react-native';

import useThemeColors from '@/hooks/UseThemeColors';
import { Radius, Spacing, shadow } from '@/constants/Theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
}

export default function Card({
  style,
  elevated = true,
  children,
  ...otherProps
}: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        elevated && shadow(colors.shadow, 1),
        style,
      ]}
      {...otherProps}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
  },
});
