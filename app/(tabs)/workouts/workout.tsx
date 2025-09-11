import {
  useColorScheme,
  Modal,
  View,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';

import ExerciseCard from '@/components/ExerciseCard';
import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';
import SelectExerciseCard from '@/components/SelectExerciseCard';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/database/db_interfaces';

import { Colors } from '@/constants/Colors';

export default function Workouts() {
  const colorScheme = useColorScheme() ?? 'light';
  const { date, workout_id } = useLocalSearchParams<{
    date: string;
    dateName: string;
    workout_id: string;
  }>();
  const colors = Colors[colorScheme];
  const [orderIndex, setOrderIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    []
  );
  const [exerciseId, setExerciseId] = useState('0');

  useFocusEffect(
    useCallback(() => {
      // If no exercise has been inserted the corresponding workout will be deleted again from db
      return () => {
        let result;
        try {
          result = db.getFirstSync<{ exist_check: number }>(
            'SELECT EXISTS(SELECT 1 FROM workout_exercises WHERE workout_id = ?) AS exist_check',
            [workout_id]
          );
        } catch (error) {
          console.error('Exist check did not run:', error);
        }
        let hasExercises = result?.exist_check;
        if (!hasExercises) {
          let result = db.runSync('DELETE FROM workouts WHERE id = ?', [
            parseInt(workout_id),
          ]);
        }
      };
    }, [])
  );

  useEffect(() => {
    function fetchWorkoutExercises() {
      try {
        const result = db.getAllSync<WorkoutExercise>(
          'SELECT * FROM workout_exercises WHERE workout_id = ? order by order_index',
          [workout_id]
        );
        setWorkoutExercises(result);
      } catch (error) {
        console.error('Failed to fetch workout exercises', error);
      }
    }
    fetchWorkoutExercises();
  }, [exerciseModalVisible, refreshKey]);

  //Lege Workout an. Gebe Exercise die Workout ID.
  // Wenn keine Exercise angelegt wird lösche Eintrag wieder

  const handleAddExercise = () => {
    if (!selectionModalVisible) {
      setSelectionModalVisible(true);
    }
  };

  const handleConfirmExercise = () => {
    setSelectionModalVisible(false);
    if (!exerciseModalVisible && exerciseName) {
      setExerciseModalVisible(true);
    }
  };

  useEffect(() => {
    const result = db.getFirstSync<WorkoutExercise>(
      `SELECT IFNULL(MAX(order_index), 0) AS max_order_index
       FROM workout_exercises
       WHERE workout_id = ?`,
      [workout_id]
    );
    let order_index = result?.order_index;
    if (order_index) {
      setOrderIndex(order_index);
    }
  }, []);

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
        <ScrollView
          style={styles.scrollViewContainer}
          {...(Platform.OS === 'android' ? { fadingEdgeLength: 75 } : {})}
        >
          {workoutExercises.map((exercise) => (
            <View
              style={styles.exerciseCardContainer}
              key={exercise.order_index}
            >
              <ExerciseCard
                name={exercise.name}
                exercise_id={exercise.id.toString()}
                editable={false}
                workout_id={workout_id}
                refreshTrigger={() => setRefreshKey(refreshKey + 1)}
              />
            </View>
          ))}
        </ScrollView>
        <Modal
          style={{ alignSelf: 'center' }}
          visible={selectionModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setSelectionModalVisible(!selectionModalVisible);
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <SelectExerciseCard
              updateExerciseName={setExerciseName}
              onConfirm={handleConfirmExercise}
            />
          </View>
        </Modal>
        <Modal
          style={{ alignSelf: 'center' }}
          visible={exerciseModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setExerciseModalVisible(!exerciseModalVisible);
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ExerciseCard
              name={exerciseName}
              exercise_id={exerciseId}
              editable={true}
              workout_id={workout_id}
              onConfirm={() => {
                setExerciseModalVisible(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          </View>
        </Modal>
        <AddButton
          label="Add Exercise"
          componentStyle={styles.buttonComponent}
          onPress={handleAddExercise}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    margin: 8,
  },
  exerciseCardContainer: {
    alignItems: 'center',
  },
  buttonComponent: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
  },
});
