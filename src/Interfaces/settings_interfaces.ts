export interface Settings {
  darkMode: boolean;
  fontSize: number;
}

export interface SettingsContextValue {
  settings: Settings;
  updateSetting: (key: keyof Settings, value: any) => void;
  isLoading: boolean;
}
