import { DarkTheme } from '@react-navigation/native';

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */
const darkTextColor = '#222222';
const brightTextColor = '#f9f9f9';

const darkColor = '#043c7cff';
const mediumDarkColor = '#185499ff';
const mediumBrightColor = '#1C74D9';
const brightColor = '#93BFF1';

export const Colors = {
  light: {
    text: darkTextColor,
    mainOne: '#ddeaf6ff',
    mainTwo: '#b3cbe4ff',
    alpha: '#b3cbe490',
    settings: '#91c7faff',
    background: brightColor,
    barColor: mediumDarkColor,
    borderColor: darkTextColor,
    tabBarBackgroundOne: '#ddeaf680',
    tabBarBackgroundTwo: '#ddeaf6ff',
    tint: brightColor,
    icon: darkTextColor,
    tabIconDefault: mediumBrightColor,
    tabIconSelected: darkColor,
    total: '#f9f9f9',
  },
  dark: {
    text: brightTextColor,
    mainOne: '#02182fcd',
    mainTwo: '#132538ff',
    alpha: '#02182f90',
    settings: darkColor,
    background: darkColor,
    barColor: mediumBrightColor,
    borderColor: brightTextColor,
    tabBarBackgroundOne: '#02182fcd',
    tabBarBackgroundTwo: '#02182fff',
    tint: darkColor,
    icon: brightTextColor,
    tabIconDefault: mediumDarkColor,
    tabIconSelected: brightColor,
    total: '#222222',
  },
};
