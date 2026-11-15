import { View, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';
import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '@/components/CustomText';
import { useSettings } from '@/src/providers/SettingsProvider';
import ProfileButton from '@/components/Buttons/ProfileButton';
import MeasurementsModal from '@/components/ MeasurementsModal';
import { SettingsRow, SettingsSection } from '@/components/SettingsSection';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

export default function ProfileScreen() {
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [measureModalVisible, setMeasureModalVisible] = useState(false);

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
          shadow(colors.shadow, 1),
        ]}
      >
        <ProfileButton
          componentStyle={styles.avatarContainer}
          imageStyle={styles.avatar}
        />
        <View style={styles.profileText}>
          <CustomText style={styles.email} numberOfLines={1}>
            {settings.email}
          </CustomText>
          <View style={styles.membershipRow}>
            <CustomText
              style={[styles.membershipLabel, { color: colors.textMuted }]}
            >
              {t('profile.membership')}
            </CustomText>
            <View style={styles.premiumBadge}>
              <Ionicons name="star" size={12} color="#8A5A00" />
              <CustomText style={styles.premiumText}>Premium</CustomText>
            </View>
          </View>
        </View>
      </View>

      <SettingsSection title={t('profile.profileSettings')}>
        <SettingsRow icon="mail-outline" label="Email" value={settings.email} />
        <SettingsRow
          icon="body-outline"
          label={t('profile.measurements')}
          onPress={() => setMeasureModalVisible(true)}
        />
      </SettingsSection>

      <SettingsSection title={t('profile.account')}>
        <SettingsRow
          icon="log-out-outline"
          label={t('profile.signOut')}
          showChevron={false}
        />
        <SettingsRow
          icon="trash-outline"
          label={t('profile.deleteAccount')}
          destructive
          showChevron={false}
        />
      </SettingsSection>

      <MeasurementsModal
        visible={measureModalVisible}
        onRequestClose={() => setMeasureModalVisible(false)}
        setMeasureModalVisible={setMeasureModalVisible}
        animationType="fade"
        transparent={true}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: { marginLeft: 0, marginRight: 0 },
  avatar: { width: 72, height: 72 },
  profileText: { flex: 1 },
  email: { fontFamily: Fonts.semiBold, fontSize: FontSize.bodyLarge },
  membershipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  membershipLabel: { fontSize: FontSize.small },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDE8B0',
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  premiumText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.caption,
    color: '#8A5A00',
  },
});
