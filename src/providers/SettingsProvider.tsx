import React, { createContext, useState, useEffect, useContext } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '@/src/i18n/i18n';
import i18n from '@/src/i18n/i18n';

import {
  Settings,
  SettingsContextValue,
} from '../Interfaces/settings_interfaces';

const SETTINGS_STORAGE_KEY = '@MyApp:Settings';

const initialSettings: Settings = {
  darkMode: 'system',
  language: 'en',
  units: 'metric',
  email: 'blabla@blamail.bla',
  measurements: {
    Weight: null,
    BodyFat: null,
    Neck: null,
    Shoulders: null,
    Chest: null,
    RightBiceps: null,
    RightForearm: null,
    LeftBiceps: null,
    LeftForearm: null,
    Waist: null,
    Hip: null,
    RightThigh: null,
    RightCalf: null,
    LeftThigh: null,
    LeftCalf: null,
  },
};

const defaultContextValue: SettingsContextValue = {
  settings: initialSettings,
  updateSetting: () => {},
  isLoading: true,
};

const SettingsContext = createContext(defaultContextValue);

const saveSettings = async (newSettings: Settings) => {
  try {
    const jsonValue = JSON.stringify(newSettings);
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save settings to AsyncStorage:', e);
  }
};

export const SettingsProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (jsonValue != null) {
          const parsedSettings = JSON.parse(jsonValue);
          setSettings(parsedSettings);
          i18n.changeLanguage(parsedSettings['language']);
        }
      } catch (e) {
        console.error('Failed to load settings from AsyncStorage:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const updateSetting = (key: string, value: any) => {
    const newSettings = {
      ...settings,
      [key]: value,
    };
    if (key == 'language') {
      i18n.changeLanguage(value);
    }
    setSettings(newSettings);

    saveSettings(newSettings);
  };

  const value = { settings, updateSetting, isLoading };

  return (
    <SettingsContext value={value}>
      {!isLoading && children}
      {isLoading && <Text>Loading Settings...</Text>}
    </SettingsContext>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
