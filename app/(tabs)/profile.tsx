import { View, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';

import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';
import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '@/components/CustomText';
import { useSettings } from '@/src/providers/SettingsProvider';
import ProfileButton from '@/components/Buttons/ProfileButton';
import MeasurementsModal from '@/components/ MeasurementsModal';
import Auth from '@/components/Auth';

export default function ProfileScreen() {
  const { settings, updateSetting } = useSettings();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [measureModalVisible, setMeasureModalVisible] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <LinearGradient
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.mainOne, colors.mainTwo]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.profileOverview}>
        <ProfileButton
          componentStyle={styles.profileImage}
          imageStyle={styles.profileImage}
        />
        <View style={styles.membershipContainer}>
          <CustomText
            style={{
              fontFamily: 'Outfit-SemiBold',
              fontSize: 26,
              textAlign: 'center',
              textAlignVertical: 'center',
              textShadowColor: 'black',
              textShadowRadius: 1,
              letterSpacing: 3,
            }}
          >
            {t('profile.membership')}
          </CustomText>
          <Pressable style={styles.membershipButton}>
            <CustomText style={styles.membershipButtonText}>Basic</CustomText>
          </Pressable>
        </View>
      </View>
      <Auth />
      <View style={styles.profileSettings}>
        <CustomText style={styles.settingSectionHeader}>
          {t('profile.profileSettings')}
        </CustomText>
        <View style={[styles.settingRow, { backgroundColor: colors.settings }]}>
          <CustomText style={styles.settingText}>Email</CustomText>
          <CustomText style={styles.settingText}>{settings.email}</CustomText>
        </View>
        <Pressable onPress={() => setMeasureModalVisible(true)}>
          <View
            style={[styles.settingRow, { backgroundColor: colors.mainTwo }]}
          >
            <CustomText style={styles.settingText}>
              {t('profile.measurements')}
            </CustomText>
          </View>
        </Pressable>
      </View>
      <View style={styles.accountSettings}>
        <CustomText style={styles.settingSectionHeader}>
          {t('profile.account')}
        </CustomText>
        <View style={[styles.settingRow, { backgroundColor: colors.settings }]}>
          <CustomText style={styles.settingText}>
            {t('profile.signOut')}
          </CustomText>
        </View>
        <View style={[styles.settingRow, { backgroundColor: colors.mainTwo }]}>
          <CustomText style={styles.settingText}>
            {t('profile.deleteAccount')}
          </CustomText>
        </View>
      </View>
      <MeasurementsModal
        visible={measureModalVisible}
        onRequestClose={() => setMeasureModalVisible(false)}
        setMeasureModalVisible={setMeasureModalVisible}
        animationType="fade"
        transparent={true}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
        }}
        viewStyle={{
          top: '4%',
          height: '90%',
          width: '100%',
          position: 'absolute',
          borderRadius: 64,
          backgroundColor: '#b4b4b4ee',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileOverview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: '15%',
  },
  profileImage: {
    width: 84,
    height: 84,
    marginLeft: '10%',
    borderRadius: 48,
  },
  membershipContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: '15%',
  },
  membershipButton: {
    backgroundColor: 'gold',
    borderWidth: 1,
    borderRadius: 30,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 24,
    paddingRight: 24,
  },
  membershipButtonText: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    color: '#222222',
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: 1,
  },
  profileSettings: { width: '80%', marginTop: '20%' },
  accountSettings: { width: '80%', marginTop: 'auto', marginBottom: '10%' },
  settingSectionHeader: { textAlign: 'left', fontSize: 26 },
  settingRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    padding: 4,
  },
  settingText: {
    fontSize: 18,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
});
