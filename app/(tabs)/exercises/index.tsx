import { Text, View, useColorScheme, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';

import { Colors } from '@/constants/Colors';
import ExerciseButton from '@/components/ExerciseButton';
import { Exercise } from '@/src/database/db_interfaces';
import { db } from '@/src/database';

const colorScheme = useColorScheme() ?? 'light';
const colors = Colors[colorScheme];

export default function ExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const goToDetailPage = (id: number) => {
    router.push({
      pathname: '/exercises/[id]',
      params: {
        id: id,
      },
    });
  };

  useEffect(() => {
    function setup() {
      try {
        const result = db.getAllSync<Exercise>('SELECT * FROM exercises');
        setExercises(result);
      } catch (error) {
        console.error('Failed to fetch exercises', error);
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
            <ExerciseButton
              imgSource={require('@/assets/images/latpull_target_muscles.png')}
              name={item.name}
              onPress={() => goToDetailPage(item.id)}
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
