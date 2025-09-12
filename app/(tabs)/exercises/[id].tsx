import { Text, Image, StyleSheet, View } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { db } from '@/src/database';
import { Exercise } from '@/src/database/db_interfaces';

export default function ExerciseId() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise>();

  useEffect(() => {
    function fetchExercise() {
      try {
        let result = db.getFirstSync<Exercise>(
          'SELECT * FROM exercises where id = ?',
          [id]
        );
        if (result !== null) {
          setExercise(result);
        }
      } catch (error) {
        console.error('Could not fetch exercise details', error);
      }
    }
    fetchExercise();
  }, []);

  return (
    <View>
      <View
        style={{
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'black', fontSize: 32 }}>{exercise?.name}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/latpull_target_muscles.png')}
          style={styles.exerciseImage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 12 },
  imageContainer: { borderWidth: 2, flex: 2 },
  exerciseImage: {
    resizeMode: 'none',
    height: 72,
  },
});
