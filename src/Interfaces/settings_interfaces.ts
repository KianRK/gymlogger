import { Measurements } from '@/constants/Interfaces';

export interface Settings {
  darkMode: string;
  language: string;
  units: string;
  email: string;
  measurements: Measurements;
}

export interface SettingsContextValue {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: any) => void;
  isLoading: boolean;
}
