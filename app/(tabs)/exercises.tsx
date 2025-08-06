import { Text, View, useColorScheme, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

import { Colors } from '@/constants/Colors';
import WorkoutButton from '@/components/WorkoutButton';
import { Exercise } from '@/src/database/db_interfaces';

const colorScheme = useColorScheme() ?? 'light';
const colors = Colors[colorScheme];

export default function ExercisesScreen() {
  const db = useSQLiteContext();

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
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeViewContainer}>
        <FlatList
          data={exercises}
          renderItem={({ item }) => (
            <WorkoutButton
              name={item.name}
              imgSource={require('@/assets/images/latpull_target_muscles.png')}
            />
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeViewContainer: {
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
