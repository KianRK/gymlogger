import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/database/db_interfaces';
import { Colors } from '@/constants/Colors';
import CustomText from './CustomText';

import DeleteButton from './Buttons/DeleteButton';

type Props = {
  workout_id: string;
  workout_number: number;
  refreshTrigger: () => void;
};

export default function WorkoutCard({
  workout_id,
  workout_number,
  refreshTrigger,
}: Props) {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    []
  );
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';
  const colorTwoAlpha = '#ddeaf633';

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
  }, []);

  function countSets(exercise_id: number) {
    let result;
    try {
      result = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM sets WHERE exercise_id = ?',
        [exercise_id]
      );
    } catch (error) {
      console.error('Failed to fetch sets with exercise_id', error);
    }
    return result?.count ?? 0;
  }

  function deleteWorkout(workout_id: string) {
    try {
      db.runSync('DELETE FROM workouts WHERE id = ?', [workout_id]);
      refreshTrigger();
    } catch (error) {
      console.log('Could not delete workout', error);
    }
  }

  return (
    <LinearGradient
      start={{ x: 0.375, y: 0.375 }}
      end={{ x: 0.75, y: 0.75 }}
      colors={[colorOneAlpha, colorTwo, colorOne]}
      style={{ borderRadius: 8 }}
    >
      <View style={styles.WorkoutCardContainer}>
        <View style={styles.workoutCardHeaderContainer}>
          {/* First view just a hack to center the CustomText component */}
          <View style={{ width: 24 }}></View>
          <CustomText style={styles.workoutCardLabel}>
            Workout {workout_number}
          </CustomText>
          <DeleteButton
            componentStyle={styles.deletebuttonComponent}
            iconSize={23}
            onPress={() => deleteWorkout(workout_id)}
          />
        </View>
        {workoutExercises.map((exercise) => (
          <View key={exercise.id} style={styles.workoutCardExerciseContainer}>
            <CustomText style={styles.workoutCardExerciseName}>
              {exercise.name}
            </CustomText>
            <CustomText style={styles.workoutCardExerciseSets}>
              Sets: {countSets(exercise.id)}
            </CustomText>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  WorkoutCardContainer: {
    width: '95%',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 8,
    padding: 5,
    margin: 5,
  },
  workoutCardHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 3,
  },
  workoutCardLabel: {
    textAlign: 'center',
    fontSize: 22,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  deletebuttonComponent: {
    marginRight: 3,
  },
  workoutCardExerciseContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 2,
  },
  workoutCardExerciseName: {
    fontWeight: 600,
    marginLeft: 3,
    fontSize: 16,
  },
  workoutCardExerciseSets: {
    marginRight: 3,
    fontSize: 16,
  },
});
