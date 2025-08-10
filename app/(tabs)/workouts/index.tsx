import { useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';

import { Colors } from '@/constants/Colors';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const today = new Date();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  //Month is zero indexed therefore needs to be increased by 1
  const dateString =
    date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate) {
      setDate(currentDate);
    }
  };

  function isCurrentDateToday() {
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  }

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
        <CalendarButton
          date={isCurrentDateToday() ? 'Today' : dateString}
          onPress={() => {
            setShow(!show);
          }}
        />
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onChange}
            display="inline"
          />
        )}
        <AddButton
          label="Add workout"
          onPress={() =>
            router.push({
              pathname: './workouts/workout',
              params: { date: isCurrentDateToday() ? 'Today' : dateString },
            })
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
