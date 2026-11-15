import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Children, ComponentProps, ReactNode, isValidElement } from 'react';

import CustomText from './CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

type SectionProps = {
  title: string;
  children: ReactNode;
  style?: ViewStyle;
};

/** Grouped list section with an uppercase caption, iOS-settings style. */
export function SettingsSection({ title, children, style }: SectionProps) {
  const colors = useThemeColors();
  const rows = Children.toArray(children).filter(isValidElement);

  return (
    <View style={[styles.section, style]}>
      <CustomText style={[styles.sectionTitle, { color: colors.textMuted }]}>
        {title.toUpperCase()}
      </CustomText>
      <View
        style={[
          styles.group,
          { backgroundColor: colors.surface, borderColor: colors.border },
          shadow(colors.shadow, 1),
        ]}
      >
        {rows.map((row, index) => (
          <View
            key={index}
            style={[
              // Later rows sit below earlier ones so open dropdowns overlap them.
              { zIndex: rows.length - index },
              index > 0 && {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.border,
              },
            ]}
          >
            {row}
          </View>
        ))}
      </View>
    </View>
  );
}

type RowProps = {
  label: string;
  icon?: ComponentProps<typeof Ionicons>['name'];
  value?: string;
  right?: ReactNode;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
};

export function SettingsRow({
  label,
  icon,
  value,
  right,
  onPress,
  destructive = false,
  showChevron,
}: RowProps) {
  const colors = useThemeColors();
  const chevron = showChevron ?? (Boolean(onPress) && !right);
  const tint = destructive ? colors.danger : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        pressed && { backgroundColor: colors.surfaceAlt },
      ]}
    >
      {icon && (
        <View
          style={[
            styles.iconBox,
            {
              backgroundColor: destructive
                ? colors.dangerSoft
                : colors.primarySoft,
            },
          ]}
        >
          <Ionicons name={icon} size={16} color={tint} />
        </View>
      )}
      <CustomText
        style={[
          styles.label,
          { color: destructive ? colors.danger : colors.text },
        ]}
      >
        {label}
      </CustomText>
      {value !== undefined && (
        <CustomText
          style={[styles.value, { color: colors.textMuted }]}
          numberOfLines={1}
        >
          {value}
        </CustomText>
      )}
      {right}
      {chevron && (
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: { width: '100%' },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.caption,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.lg,
  },
  group: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minHeight: 52,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { flex: 1, fontFamily: Fonts.medium, fontSize: FontSize.body },
  value: { fontSize: FontSize.body, maxWidth: '55%' },
});
