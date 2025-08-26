import { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/database/db_interfaces';

type Props = {
  workout_id: string;
  number: number;
};

export default function WorkoutCard({ workout_id, number }: Props) {
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
    const result = db.getFirstSync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sets WHERE exercise_id = ?;',
      [exercise_id]
    );
    return result?.count ?? 0;
  }

  return (
    <View style={styles.WorkoutCardContainer}>
      <Text style={styles.workoutCardHeader}>Workout {number}</Text>
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
  workoutCardHeader: {
    textAlign: 'center',
    width: '100%',
    fontSize: 20,
    borderWidth: 2,
  },
  workoutCardExerciseContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    borderWidth: 1,
  },
  workoutCardExerciseName: {
    fontSize: 16,
  },
  workoutCardExerciseSets: {
    fontSize: 16,
  },
});
