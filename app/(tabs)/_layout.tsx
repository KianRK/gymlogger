import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet } from 'react-native';

import { useTranslation } from 'react-i18next';
import useThemeColors from '@/hooks/UseThemeColors';
import SettingsButton from '@/components/Buttons/SettingsButton';
import ProfileButton from '@/components/Buttons/ProfileButton';
import DashboardButton from '@/components/Buttons/DashboardButton';

export default function TabLayout() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 28, fontFamily: 'Outfit-Regular' },
        headerLeft: () => <DashboardButton />,
        headerRight: () => (
          <>
            <SettingsButton />
            <ProfileButton />
          </>
        ),
        headerBackground: () => (
          <LinearGradient
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            colors={[colors.tabBarBackgroundOne, colors.tabBarBackgroundTwo]}
          />
        ),
        tabBarStyle: {
          backgroundColor: 'transparent',
          elevation: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            colors={[colors.tabBarBackgroundOne, colors.tabBarBackgroundTwo]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'play-sharp' : 'play-outline'}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: t('app.exercises'),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'arm-flex' : 'arm-flex-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="templates"
        options={{
          title: t('app.templates'),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'clipboard-list' : 'clipboard-list-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          href: null,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          href: null,
        }}
      />
    </Tabs>
  );
}
