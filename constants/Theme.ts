import { Platform, ViewStyle } from 'react-native';

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const Fonts = {
  light: 'Outfit-Light',
  regular: 'Outfit-Regular',
  medium: 'Outfit-Medium',
  semiBold: 'Outfit-SemiBold',
  bold: 'Outfit-Bold',
};

export const FontSize = {
  caption: 12,
  small: 14,
  body: 16,
  bodyLarge: 18,
  title: 20,
  heading: 24,
  display: 32,
};

/** Soft, cross-platform elevation for cards and floating elements. */
export function shadow(color: string, level: 1 | 2 | 3 = 1): ViewStyle {
  const presets = {
    1: { opacity: 0.06, radius: 8, offset: 2, elevation: 2 },
    2: { opacity: 0.1, radius: 14, offset: 4, elevation: 5 },
    3: { opacity: 0.16, radius: 24, offset: 8, elevation: 10 },
  }[level];
  return Platform.select<ViewStyle>({
    android: { elevation: presets.elevation, shadowColor: color },
    default: {
      shadowColor: color,
      shadowOpacity: presets.opacity,
      shadowRadius: presets.radius,
      shadowOffset: { width: 0, height: presets.offset },
    },
  }) as ViewStyle;
}
