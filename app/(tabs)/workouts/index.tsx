import {
  useColorScheme,
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import CalendarButton from '@/components/Buttons/CalendarButton';
import AddButton from '@/components/Buttons/AddButton';
import MenuButton from '@/components/Buttons/MenuButton';
import { Colors } from '@/constants/Colors';
import WorkoutCard from '@/components/WorkoutCard';

import { db } from '@/src/database';
import { Workout } from '@/src/Interfaces/db_interfaces';

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const today = new Date();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  //Month is zero indexed therefore needs to be increased by 1
  const dateString =
    `${date.getDate()}`.padStart(2, '0') +
    `.${date.getMonth() + 1}.${date.getFullYear()}`;
  const dateName =
    `${date.getFullYear()}${date.getMonth() + 1}` +
    `${date.getDate()}`.padStart(2, '0');

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
          dateName: dateName,
          workout_id,
        },
      });
    } catch (error) {
      console.error('Inserting and rerouting did not work: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      function fetchWorkouts() {
        try {
          const result = db.getAllSync<Workout>(
            'SELECT * FROM workouts WHERE date = ? ORDER BY id',
            [dateName]
          );
          setWorkouts(result);
        } catch (error) {
          console.error('Failed to fetch workouts:', error);
        }
      }
      fetchWorkouts();
    }, [dateName, refreshKey])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LinearGradient
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={['#ddeaf6ff', '#b3cbe4ff']}
          style={StyleSheet.absoluteFillObject}
        />
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
          {...(Platform.OS === 'android' ? { fadingEdgeLength: 10 } : {})}
        >
          {workouts.map((workout, index) => (
            <View key={workout.id} style={styles.workoutContainer}>
              <WorkoutCard
                workout_id={workout.id.toString()}
                workout_number={index + 1}
                refreshTrigger={() => setRefreshKey(refreshKey + 1)}
              />
            </View>
          ))}
        </ScrollView>
        {/* RENDERS ALL WORKOUTCARDS IN ID ORDER AND PASSES WORKOUT ID TO WORKOUTCARD*/}
        <AddButton
          label="Add workout"
          componentStyle={styles.buttonComponent}
          onPress={handleAddWorkout}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginTop: '10%',
    width: '100%',
    margin: 8,
  },
  workoutContainer: {
    alignItems: 'center',
    margin: 6,
  },
  buttonComponent: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
  },
});
