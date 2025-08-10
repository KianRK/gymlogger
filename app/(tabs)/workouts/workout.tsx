import { useColorScheme } from 'react-native';
import { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';

import { Colors } from '@/constants/Colors';

export default function Workouts() {
  const colorScheme = useColorScheme() ?? 'light';
  const { date } = useLocalSearchParams<{ date: string }>();
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CalendarButton date={date} />
        <AddButton label="Add Exercise" onPress={() => router.back()} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
