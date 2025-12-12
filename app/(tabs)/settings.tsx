import { View, useColorScheme, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { LinearGradient } from 'expo-linear-gradient';

import { useSettings } from '@/src/providers/SettingsProvider';
import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '@/components/CustomText';
import DropDownButton from '@/components/Buttons/DropDownButton';

export default function SettingsScreen() {
  const colors = useThemeColors();
  const { settings, updateSetting } = useSettings();
  const [refreshKey, setRefreshKey] = useState(0);
  const { t } = useTranslation();
  const [currentDropDownVisible, setCurrentDropDownVisible] = useState('');

  const [currentLanguage, setCurrentLanguage] = useState(settings.language);
  const [languageSettingVisible, setLanguageSettingVisible] = useState(false);
  const [languageOptions, setLanguageOptions] = useState(['en', 'de']);

  const [currentDarkModeSetting, setCurrentDarkModeSetting] = useState(
    settings.darkMode
  );
  const [darkModeSettingVisible, setDarkModeSettingVisible] = useState(false);
  const [darkModeOptions, setDarkModeOptions] = useState([
    'on',
    'off',
    'system',
  ]);

  const [currentUnitSetting, setCurrentUnitSetting] = useState(settings.units);
  const [unitSettingVisible, setUnitSettingVisible] = useState(false);
  const [unitOptions, setUnitOptions] = useState(['metric', 'imperial']);

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
    setDarkModeOptions(() =>
      darkModeOptions.sort((a, b) => {
        if (a === currentDarkModeSetting) {
          return -1;
        }

        if (b === currentDarkModeSetting) {
          return 1;
        }

        return a.localeCompare(b);
      })
    );
  }, [currentDarkModeSetting]);

  useEffect(() => {
    setUnitOptions(() =>
      unitOptions.sort((a, b) => {
        if (a === currentUnitSetting) {
          return -1;
        }

        if (b === currentUnitSetting) {
          return 1;
        }

        return a.localeCompare(b);
      })
    );
  }, [currentUnitSetting]);

  return (
    <LinearGradient
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
      colors={[colors.mainOne, colors.mainTwo]}
      style={[StyleSheet.absoluteFillObject, { alignItems: 'center' }]}
    >
      <View style={styles.settingsContainer}>
        <View style={styles.generalSection}>
          <CustomText style={styles.settingSectionHeader}>
            {t('settings.sections.general')}
          </CustomText>
          <View
            style={[styles.settingRow, { backgroundColor: colors.settings }]}
          >
            <CustomText style={styles.settingText}>
              {t('settings.language.language')}
            </CustomText>
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
          <View
            style={[styles.settingRow, { backgroundColor: colors.mainTwo }]}
          >
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
          <View
            style={[styles.settingRow, { backgroundColor: colors.mainTwo }]}
          >
            <Pressable>
              <CustomText style={styles.settingText}>
                {t('settings.resetEx')}
              </CustomText>
            </Pressable>
          </View>
          <View
            style={[styles.settingRow, { backgroundColor: colors.settings }]}
          >
            <CustomText style={styles.settingText}>
              {t('settings.units.units')}
            </CustomText>
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
          <CustomText style={styles.settingSectionHeader}>
            {t('settings.sections.contact')}
          </CustomText>
          <View
            style={[styles.settingRow, { backgroundColor: colors.mainTwo }]}
          >
            <Pressable>
              <CustomText style={styles.settingText}>Feedback</CustomText>
            </Pressable>
          </View>
          <View
            style={[styles.settingRow, { backgroundColor: colors.settings }]}
          >
            <Pressable>
              <CustomText style={styles.settingText}>
                {t('settings.help')}
              </CustomText>
            </Pressable>
          </View>
          <View
            style={[styles.settingRow, { backgroundColor: colors.mainTwo }]}
          >
            <Pressable>
              <CustomText style={styles.settingText}>
                {t('settings.rate')}
              </CustomText>
            </Pressable>
          </View>
          <View
            style={[styles.settingRow, { backgroundColor: colors.settings }]}
          >
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
