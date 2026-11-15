import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';
import { Fonts, FontSize } from '@/constants/Theme';

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
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShadowVisible: false,
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: FontSize.title,
          fontFamily: Fonts.semiBold,
          color: colors.text,
        },
        headerLeft: () => <DashboardButton />,
        headerRight: () => (
          <View style={styles.headerRight}>
            <SettingsButton />
            <ProfileButton />
          </View>
        ),
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerBackground: () => (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: colors.surface,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.border,
              },
            ]}
          />
        ),
        sceneStyle: { backgroundColor: colors.background },
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: FontSize.caption,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 0,
        },
      }}
    >
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'barbell' : 'barbell-outline'}
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

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center' },
});
