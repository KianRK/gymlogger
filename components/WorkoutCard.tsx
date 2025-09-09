import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/database/db_interfaces';

import DeleteButton from './DeleteButton';

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
    <View style={styles.WorkoutCardContainer}>
      <View style={styles.workoutCardHeaderContainer}>
        <Text style={styles.workoutCardLabel}>Workout {workout_number}</Text>
        <DeleteButton
          componentStyle={styles.deletebuttonComponent}
          iconSize={20}
          onPress={() => deleteWorkout(workout_id)}
        />
      </View>
      {workoutExercises.map((exercise) => (
        <View key={exercise.id} style={styles.workoutCardExerciseContainer}>
          <Text style={styles.workoutCardExerciseName}>{exercise.name}</Text>
          <Text style={styles.workoutCardExerciseSets}>
            Sets: {countSets(exercise.id)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  WorkoutCardContainer: {
    width: '75%',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    margin: 3,
  },
  workoutCardHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'center',
    padding: 3,
  },
  workoutCardLabel: {
    textAlign: 'center',
    fontSize: 22,
    marginLeft: 3,
  },
  deletebuttonComponent: {
    marginLeft: 'auto',
    marginRight: 3,
  },
  workoutCardExerciseContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    borderWidth: 1,
    padding: 2,
  },
  workoutCardExerciseName: {
    marginLeft: 3,
    fontSize: 16,
  },
  workoutCardExerciseSets: {
    marginRight: 3,
    fontSize: 16,
  },
});
