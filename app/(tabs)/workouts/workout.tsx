import { useColorScheme, Modal, View } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExerciseCard from '@/components/ExerciseCard';
import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';

import { db } from '@/src/database';
import { Workout } from '@/src/database/db_interfaces';
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
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [exerciseId, setExerciseId] = useState('0');

  //Lege Workout an. Gebe Exercise die Workout ID.
  // Wenn keine Exercise angelegt wird lösche Eintrag wieder

  const handleAddExercise = () => {
    let exercise_name = 'TestExercise';
    const result = db.runSync(
      'INSERT INTO workout_exercises (workout_id, name) VALUES (?, ?)',
      [parseInt(workout_id), exercise_name]
    );
    setExerciseId(result.lastInsertRowId.toString());
    setModalVisible(true);
  };

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
        <Modal
          style={{ alignSelf: 'center' }}
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ExerciseCard
              name="Exercise"
              exercise_id={exerciseId}
              editable={true}
            />
          </View>
        </Modal>
        <AddButton label="Add Exercise" onPress={handleAddExercise} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
