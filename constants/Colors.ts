/**
 * Colour tokens for light and dark mode.
 *
 * Prefer the semantic tokens (background, surface, border, text, textMuted,
 * primary, ...) in new code. The legacy keys further down are kept so older
 * screens keep working; they map onto the same palette.
 */

const light = {
  // Semantic tokens
  background: '#F4F6FA',
  surface: '#FFFFFF',
  surfaceAlt: '#EEF2F7',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  primary: '#2563EB',
  primarySoft: '#E7EEFD',
  onPrimary: '#FFFFFF',
  danger: '#DC2626',
  dangerSoft: '#FDECEC',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: '#0F172A',
  statusBar: 'dark' as 'dark' | 'light',

  // Legacy keys
  mainOne: '#F4F6FA',
  mainTwo: '#F4F6FA',
  alpha: '#FFFFFF',
  settings: '#FFFFFF',
  barColor: '#2563EB',
  borderColor: '#E2E8F0',
  tabBarBackgroundOne: '#FFFFFF',
  tabBarBackgroundTwo: '#FFFFFF',
  tint: '#2563EB',
  icon: '#334155',
  tabIconDefault: '#94A3B8',
  tabIconSelected: '#2563EB',
  total: '#FFFFFF',
  pieChartColors: [
    '#2563EB',
    '#0EA5E9',
    '#14B8A6',
    '#22C55E',
    '#EAB308',
    '#F97316',
    '#EF4444',
    '#A855F7',
    '#64748B',
  ],
};

const dark: typeof light = {
  background: '#0B1220',
  surface: '#141D2F',
  surfaceAlt: '#1B263B',
  border: '#24324A',
  text: '#E6EDF7',
  textMuted: '#8B9AB3',
  primary: '#4C8DFF',
  primarySoft: '#1A2B4C',
  onPrimary: '#FFFFFF',
  danger: '#F87171',
  dangerSoft: '#3A1D24',
  overlay: 'rgba(2, 6, 16, 0.65)',
  shadow: '#000000',
  statusBar: 'light',

  mainOne: '#0B1220',
  mainTwo: '#0B1220',
  alpha: '#141D2F',
  settings: '#141D2F',
  barColor: '#4C8DFF',
  borderColor: '#24324A',
  tabBarBackgroundOne: '#141D2F',
  tabBarBackgroundTwo: '#141D2F',
  tint: '#4C8DFF',
  icon: '#C7D2E3',
  tabIconDefault: '#5B6B86',
  tabIconSelected: '#4C8DFF',
  total: '#141D2F',
  pieChartColors: [
    '#4C8DFF',
    '#38BDF8',
    '#2DD4BF',
    '#4ADE80',
    '#FACC15',
    '#FB923C',
    '#F87171',
    '#C084FC',
    '#94A3B8',
  ],
};

export const Colors = { light, dark };

export type ThemeColors = typeof light;
