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
    pieChartColors: [
      '#1E4E79', // Deep Navy
      '#D9534F', // Soft Crimson
      '#2E8B57', // Sea Green
      '#F0AD4E', // Muted Amber
      '#8E44AD', // Amethyst
      '#FF8C69', // Salmon
      '#16A085', // Dark Teal
      '#5BC0DE', // Bright Sky
      '#2C3E50', // Midnight Blue
    ],
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
    pieChartColors: [
      '#1A73E8', // Strong Royal Blue
      '#D93025', // Deep Candy Red
      '#188038', // Forest Green
      '#F29900', // Harvest Orange
      '#A142F4', // Royal Purple
      '#12B5CB', // Deep Teal
      '#E52592', // Rich Raspberry
      '#F9AB00', // Bold Gold
      '#0097A7', // Dark Cyan
    ],
  },
};
