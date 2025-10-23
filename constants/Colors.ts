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
    background: brightColor,
    barColor: mediumDarkColor,
    tabBarBackgroundOne: '#ddeaf680',
    tabBarBackgroundTwo: '#ddeaf6ff',
    tint: brightColor,
    icon: mediumBrightColor,
    tabIconDefault: mediumBrightColor,
    tabIconSelected: darkColor,
  },
  dark: {
    text: brightTextColor,
    background: darkColor,
    barColor: mediumBrightColor,
    tabBarBackgroundOne: '#02182fcd',
    tabBarBackgroundTwo: '#02182fff',
    tint: darkColor,
    icon: mediumDarkColor,
    tabIconDefault: mediumDarkColor,
    tabIconSelected: brightColor,
  },
};
