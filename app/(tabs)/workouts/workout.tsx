import { useColorScheme, Modal, View } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExerciseCard from '@/components/ExerciseCard';
import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';
import SelectExerciseCard from '@/components/SelectExerciseCard';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/database/db_interfaces';

import { Colors } from '@/constants/Colors';

export default function Workouts() {
  const colorScheme = useColorScheme() ?? 'light';
  const { date, dateName, workout_id } = useLocalSearchParams<{
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

  useEffect(() => {
    function setup() {
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
    setup();
  }, [exerciseModalVisible]);

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
      let exercise_name = exerciseName;
      const result = db.runSync(
        'INSERT INTO workout_exercises (workout_id, name, order_index) VALUES (?, ?, ?)',
        [parseInt(workout_id), exercise_name, orderIndex + 1]
      );
      setOrderIndex(orderIndex + 1);
      setExerciseId(result.lastInsertRowId.toString());
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
        <View>
          {workoutExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.order_index}
              name={exercise.name}
              exercise_id={exercise.id.toString()}
              editable={false}
              refreshKey={refreshKey}
            />
          ))}
        </View>
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
              onConfirm={() => {
                setExerciseModalVisible(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          </View>
        </Modal>
        <AddButton label="Add Exercise" onPress={handleAddExercise} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
