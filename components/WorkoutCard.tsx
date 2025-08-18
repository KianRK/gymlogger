import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

import ExerciseCard from './ExerciseCard';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/database/db_interfaces';

type Props = {
  workout_id: string;
};

export default function WorkoutCard({ workout_id }: Props) {
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
        console.log('WORKOUT EXERCISES: ', result);
        setWorkoutExercises(result);
      } catch (error) {
        console.error('Failed to fetch workout exercises', error);
      }
    }
    setup();
  }, []);

  return (
    <>
      {workoutExercises.map((exercise) => (
        <ExerciseCard
          key={exercise.order_index}
          name={exercise.name}
          exercise_id={exercise.id.toString()}
          editable={false}
        />
      ))}
    </>
  );
}
