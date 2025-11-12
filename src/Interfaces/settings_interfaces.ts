export interface Settings {
  darkMode: string;
  language: string;
  units: string;
}

export interface SettingsContextValue {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: string) => void;
  isLoading: boolean;
}
