import { Text, View, useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

import { Colors } from '@/constants/Colors';
import WorkoutButton from '@/components/WorkoutButton';
import { Exercise } from '@/src/database/db_interfaces';

export default function ExercisesScreen() {
  const db = useSQLiteContext();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    async function setup() {
      try {
        const result = await db.getAllAsync<Exercise>(
          'SELECT * FROM exercises'
        );
        setExercises(result);
      } catch {
        console.error('Failed to fetch exercises:');
      }
    }
    setup();
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {exercises.map((exercise) => (
        <WorkoutButton
          key={exercise.id}
          imgSource={require('@/assets/images/latpull_target_muscles.png')}
          name={exercise.name}
        />
      ))}
    </View>
  );
}
