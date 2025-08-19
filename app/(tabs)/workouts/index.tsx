import {
  useColorScheme,
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';
import { Colors } from '@/constants/Colors';
import WorkoutCard from '@/components/WorkoutCard';

import { db } from '@/src/database';
import { Workout } from '@/src/database/db_interfaces';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const today = new Date();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  //Month is zero indexed therefore needs to be increased by 1
  const dateString =
    date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  const dateName = dateString.replaceAll('.', '');

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

  const handleAddWorkout = () => {
    try {
      const result = db.runSync('INSERT INTO workouts (date) VALUES (?)', [
        dateName,
      ]);
      let workout_id = result.lastInsertRowId.toString();
      router.push({
        pathname: './workouts/workout',
        params: {
          date: isCurrentDateToday() ? 'Today' : dateString,
          dateName,
          workout_id,
        },
      });
    } catch (error) {
      console.error('Inserting and rerouting did not work: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      function setup() {
        try {
          const result = db.getAllSync<Workout>(
            'SELECT * FROM workouts WHERE date = ? ORDER BY id',
            [dateName]
          );
          setWorkouts(result);
        } catch (error) {
          console.error('Failed to fetch exercises:', error);
        }
      }
      setup();
    }, [dateName])
  );

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
        <ScrollView
          style={styles.scrollViewContainer}
          {...(Platform.OS === 'android' ? { fadingEdgeLength: 75 } : {})}
        >
          {workouts.map((workout, index) => (
            <View key={workout.id} style={styles.workoutContainer}>
              <Text>Workout {index + 1}</Text>
              <WorkoutCard workout_id={workout.id.toString()} />
            </View>
          ))}
        </ScrollView>
        {/* RENDERS ALL WORKOUTCARDS IN ID ORDER AND PASSES WORKOUT ID TO WORKOUTCARD*/}
        <AddButton label="Add workout" onPress={handleAddWorkout} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    margin: 8,
  },
  workoutContainer: {
    alignItems: 'center',
  },
});
