import { View, useColorScheme, StyleSheet, Pressable } from 'react-native';
import { Image } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { Colors } from '@/constants/Colors';
import CustomText from '@/components/CustomText';
import CustomTextInput from '@/components/CustomTextInput';
import { useSettings } from '@/src/providers/SettingsProvider';
import ProfileButton from '@/components/Buttons/ProfileButton';

export default function ProfileScreen() {
  const { settings, updateSetting } = useSettings();

  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const colorOne = '#b3cbe4ff';
  const colorTwo = '#91c7faff';

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
        colors={['#ddeaf6ff', '#b3cbe4ff']}
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
            Membership
          </CustomText>
          <Pressable style={styles.membershipButton}>
            <CustomText style={styles.membershipButtonText}>Premium</CustomText>
          </Pressable>
        </View>
      </View>
      <View style={styles.profileSettings}>
        <CustomText style={styles.settingSectionHeader}>
          Profile Settings
        </CustomText>
        <View style={[styles.settingRow, { backgroundColor: colorTwo }]}>
          <CustomText style={styles.settingText}>Email</CustomText>
          <CustomText style={styles.settingText}>{settings.email}</CustomText>
        </View>
        <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
          <CustomText style={styles.settingText}>Measurements</CustomText>
        </View>
      </View>
      <View style={styles.accountSettings}>
        <CustomText style={styles.settingSectionHeader}>Account</CustomText>
        <View style={[styles.settingRow, { backgroundColor: colorTwo }]}>
          <CustomText style={styles.settingText}>Sign out</CustomText>
        </View>
        <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
          <CustomText style={styles.settingText}>Delete account</CustomText>
        </View>
      </View>
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
