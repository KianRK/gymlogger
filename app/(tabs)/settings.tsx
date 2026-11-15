import { ScrollView, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { useSettings } from '@/src/providers/SettingsProvider';
import useThemeColors from '@/hooks/UseThemeColors';
import { SettingsRow, SettingsSection } from '@/components/SettingsSection';
import { Spacing } from '@/constants/Theme';
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
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      <SettingsSection
        title={t('settings.sections.general')}
        style={{ zIndex: 3 }}
      >
        <SettingsRow
          icon="language-outline"
          label={t('settings.language.language')}
          right={
            <DropDownButton
              currentSelection={currentLanguage}
              options={languageOptions}
              settingName="language"
              visible={languageSettingVisible}
              registrationHandler={() => setCurrentDropDownVisible('lang')}
              selectionSetter={setCurrentLanguage}
              visibilitySetter={setLanguageSettingVisible}
            />
          }
        />
        <SettingsRow
          icon="moon-outline"
          label="Dark mode"
          right={
            <DropDownButton
              currentSelection={currentDarkModeSetting}
              options={darkModeOptions}
              settingName="darkMode"
              visible={darkModeSettingVisible}
              registrationHandler={() => setCurrentDropDownVisible('darkmode')}
              visibilitySetter={setDarkModeSettingVisible}
              selectionSetter={setCurrentDarkModeSetting}
            />
          }
        />
      </SettingsSection>
      <SettingsSection title="Training" style={{ zIndex: 2 }}>
        <SettingsRow
          icon="speedometer-outline"
          label={t('settings.units.units')}
          right={
            <DropDownButton
              currentSelection={currentUnitSetting}
              options={unitOptions}
              settingName="units"
              visible={unitSettingVisible}
              registrationHandler={() => setCurrentDropDownVisible('unit')}
              selectionSetter={setCurrentUnitSetting}
              visibilitySetter={setUnitSettingVisible}
            />
          }
        />
        <SettingsRow
          icon="refresh-outline"
          label={t('settings.resetEx')}
          showChevron
        />
      </SettingsSection>
      <SettingsSection
        title={t('settings.sections.contact')}
        style={{ zIndex: 1 }}
      >
        <SettingsRow icon="chatbubble-outline" label="Feedback" showChevron />
        <SettingsRow
          icon="help-circle-outline"
          label={t('settings.help')}
          showChevron
        />
        <SettingsRow icon="star-outline" label={t('settings.rate')} showChevron />
        <SettingsRow icon="people-outline" label="Social" showChevron />
      </SettingsSection>
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
});
