import { View, useColorScheme, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';

import { useSettings } from '@/src/providers/SettingsProvider';
import { Colors } from '@/constants/Colors';
import CustomText from '@/components/CustomText';
import DropDownButton from '@/components/Buttons/DropDownButton';
import { Settings } from '@/src/Interfaces/settings_interfaces';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { settings, updateSetting } = useSettings();
  const [refreshKey, setRefreshKey] = useState(0);

  const [currentDropDownVisible, setCurrentDropDownVisible] = useState('');

  const [currentLanguage, setCurrentLanguage] = useState(settings.language);
  const [languageSettingVisible, setLanguageSettingVisible] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([
    'German',
    'English',
    'French',
  ]);

  const [currentDarkModeSetting, setCurrentDarkModeSetting] = useState(
    settings.darkMode
  );
  const [darkModeSettingVisible, setDarkModeSettingVisible] = useState(false);
  const [darkModeOptions, setDarkModeOptions] = useState(['On, Off']);

  const [currentUnitSetting, setCurrentUnitSetting] = useState(settings.units);
  const [unitSettingVisible, setUnitSettingVisible] = useState(false);
  const [unitOptions, setUnitOptions] = useState([
    'metric (kg)',
    'imperial (lb)',
  ]);

  const colorOne = '#b3cbe4ff';
  const colorTwo = '#91c7faff';

  useEffect(() => {
    if (currentDropDownVisible === 'lang') {
      setDarkModeSettingVisible(false);
      setUnitSettingVisible(false);
    }
    if (currentDropDownVisible === 'darkmode') {
      setLanguageSettingVisible(false);
      setUnitSettingVisible(false);
    }
    if (currentDropDownVisible === 'unit') {
      setDarkModeSettingVisible(false);
      setLanguageSettingVisible(false);
    }
  }, [currentDropDownVisible]);

  useEffect(() => {
    setLanguageOptions(() =>
      languageOptions.sort((a, b) => {
        if (a === currentLanguage) {
          return -1;
        }

        if (b === currentLanguage) {
          return 1;
        }

        return a.localeCompare(b);
      })
    );
  }, [currentLanguage]);

  useEffect(() => {
    if (currentDarkModeSetting === 'On') {
      setDarkModeOptions(['On', 'Off']);
    }
    if (currentDarkModeSetting === 'Off') {
      setDarkModeOptions(['Off', 'On']);
    }
  }, [currentDarkModeSetting]);

  useEffect(() => {
    if (currentUnitSetting === 'metric (kg)') {
      setUnitOptions(['metric (kg)', 'imperial (lb)']);
    }
    if (currentUnitSetting === 'imperial (lb)') {
      setUnitOptions(['imperial (lb)', 'metric (kg)']);
    }
  }, [currentUnitSetting]);

  return (
    <LinearGradient
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      colors={['#ddeaf6ff', '#b3cbe4ff']}
      style={[StyleSheet.absoluteFillObject, { alignItems: 'center' }]}
    >
      <View style={styles.settingsContainer}>
        <View style={styles.generalSection}>
          <CustomText style={styles.settingSectionHeader}>General</CustomText>
          <View style={[styles.settingRow, { backgroundColor: colorTwo }]}>
            <CustomText style={styles.settingText}>Language</CustomText>
            <DropDownButton
              currentSelection={currentLanguage}
              options={languageOptions}
              settingName="language"
              visible={languageSettingVisible}
              registrationHandler={() => setCurrentDropDownVisible('lang')}
              selectionSetter={setCurrentLanguage}
              visibilitySetter={setLanguageSettingVisible}
            />
          </View>
          <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
            <CustomText style={styles.settingText}>Dark mode</CustomText>
            <DropDownButton
              currentSelection={currentDarkModeSetting}
              options={darkModeOptions}
              settingName="darkMode"
              visible={darkModeSettingVisible}
              registrationHandler={() => setCurrentDropDownVisible('darkmode')}
              visibilitySetter={setDarkModeSettingVisible}
              selectionSetter={setCurrentDarkModeSetting}
            />
          </View>
        </View>
        <View style={styles.trainingSection}>
          <CustomText style={styles.settingSectionHeader}>Training</CustomText>
          <View style={[styles.settingRow, { backgroundColor: colorTwo }]}>
            <Pressable>
              <CustomText style={styles.settingText}>
                Reset to default exercises
              </CustomText>
            </Pressable>
          </View>
          <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
            <CustomText style={styles.settingText}>Units</CustomText>
            <DropDownButton
              componentStyle={{ width: '40%' }}
              currentSelection={currentUnitSetting}
              options={unitOptions}
              settingName="units"
              visible={unitSettingVisible}
              registrationHandler={() => setCurrentDropDownVisible('unit')}
              selectionSetter={setCurrentUnitSetting}
              visibilitySetter={setUnitSettingVisible}
            />
          </View>
        </View>
        <View style={styles.contactSection}>
          <CustomText style={styles.settingSectionHeader}>Contact</CustomText>
          <View style={[styles.settingRow, { backgroundColor: colorTwo }]}>
            <Pressable>
              <CustomText style={styles.settingText}>Feedback</CustomText>
            </Pressable>
          </View>
          <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
            <Pressable>
              <CustomText style={styles.settingText}>Help & Support</CustomText>
            </Pressable>
          </View>
          <View style={[styles.settingRow, { backgroundColor: colorTwo }]}>
            <Pressable>
              <CustomText style={styles.settingText}>Rate</CustomText>
            </Pressable>
          </View>
          <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
            <Pressable>
              <CustomText style={styles.settingText}>Social</CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  settingsContainer: { justifyContent: 'center', width: '80%' },
  generalSection: { width: '100%', marginTop: '20%' },
  trainingSection: { width: '100%', marginTop: '10%' },
  contactSection: { width: '100%', marginTop: '10%' },
  settingSectionHeader: { textAlign: 'left', fontSize: 26 },
  settingRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    padding: 4,
  },
  settingText: { fontSize: 18, textAlign: 'right' },
});
