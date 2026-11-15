import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';

import CustomText from './CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/Theme';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  hint?: string;
};

export default function EmptyState({ icon, title, hint }: Props) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={28} color={colors.primary} />
      </View>
      <CustomText style={styles.title}>{title}</CustomText>
      {hint && (
        <CustomText style={[styles.hint, { color: colors.textMuted }]}>
          {hint}
        </CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl * 2,
    paddingHorizontal: Spacing.xl,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.bodyLarge,
    textAlign: 'center',
  },
  hint: {
    fontSize: FontSize.small,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
