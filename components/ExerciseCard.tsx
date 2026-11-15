import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import CustomText from './CustomText';
import IconButton from './IconButton';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

type Props = {
  name: string;
  is_favorite: boolean;
  region?: string;
  primary?: string[] | undefined;
  secondary?: string[] | undefined;
  onPressInfo?: () => void;
  onPressFav?: () => void;
};

export default function ExerciseCard({
  name,
  is_favorite = false,
  region,
  primary,
  secondary,
  onPressInfo,
  onPressFav,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const primaryText = primary && primary[0] ? t('targets.' + primary[0]) : '';
  const secondaryText =
    secondary && secondary[0] ? t('targets.' + secondary[0]) : '';
  const targets = [primaryText, secondaryText].filter(Boolean).join(' · ');

  return (
    <Pressable
      onPress={onPressInfo}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
        shadow(colors.shadow, 1),
      ]}
    >
      <IconButton
        onPress={onPressFav}
        variant={is_favorite ? 'active' : 'soft'}
        size={38}
        accessibilityLabel="Favorite"
      >
        <MaterialCommunityIcons
          name={is_favorite ? 'heart' : 'heart-outline'}
          size={20}
          color={is_favorite ? colors.primary : colors.textMuted}
        />
      </IconButton>
      <View style={styles.textContainer}>
        <CustomText
          style={styles.name}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {t(name)}
        </CustomText>
        <View style={styles.metaRow}>
          {region && (
            <View
              style={[styles.regionTag, { backgroundColor: colors.primarySoft }]}
            >
              <CustomText style={[styles.regionText, { color: colors.primary }]}>
                {t('targets.' + region)}
              </CustomText>
            </View>
          )}
          {targets.length > 0 && (
            <CustomText
              style={[styles.targets, { color: colors.textMuted }]}
              numberOfLines={1}
            >
              {targets}
            </CustomText>
          )}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.xs,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  textContainer: { flex: 1 },
  name: { fontFamily: Fonts.semiBold, fontSize: FontSize.body },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  regionTag: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 1,
  },
  regionText: { fontFamily: Fonts.medium, fontSize: FontSize.caption },
  targets: { flexShrink: 1, fontSize: FontSize.caption },
});
