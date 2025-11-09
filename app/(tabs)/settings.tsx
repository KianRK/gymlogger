import { View, useColorScheme, StyleSheet, Pressable } from 'react-native';
import { useState, useEffect } from 'react';

import { LinearGradient } from 'expo-linear-gradient';

import { useSettings } from '@/src/providers/SettingsProvider';
import { Colors } from '@/constants/Colors';
import CustomText from '@/components/CustomText';
import DropDownButton from '@/components/Buttons/DropDownButton';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { settings, updateSetting } = useSettings();
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [languageSettingsVisible, setLanguageSettingsVisible] = useState(false);
  const [languageOptions, setLanguageOptions] = useState([
    'German',
    'English',
    'French',
  ]);

  const colorOne = '#b3cbe4ff';
  const colorTwo = '#91c7faff';

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
              visible={languageSettingsVisible}
              selectionSetter={setCurrentLanguage}
              visibilitySetter={setLanguageSettingsVisible}
            />
          </View>
          <View style={[styles.settingRow, { backgroundColor: colorOne }]}>
            <CustomText style={styles.settingText}>Dark mode</CustomText>
            <Pressable>
              <CustomText style={styles.settingText}>On</CustomText>
            </Pressable>
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
            <Pressable>
              <CustomText style={styles.settingText}>metric (kg)</CustomText>
            </Pressable>
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
