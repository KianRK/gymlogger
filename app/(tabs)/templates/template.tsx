import {
  useColorScheme,
  Modal,
  View,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import TemplateExerciseCard from '@/components/TemplateExerciseCard';
import SelectExerciseCard from '@/components/SelectExerciseCard';
import AddButton from '@/components/Buttons/AddButton';
import BackButton from '@/components/Buttons/BackButton';

import { db } from '@/src/database';
import { TemplateExercise } from '@/src/Interfaces/db_interfaces';

import { Colors } from '@/constants/Colors';

export default function Workouts() {
  const colorScheme = useColorScheme() ?? 'light';
  const { template_id } = useLocalSearchParams<{
    template_id: string;
  }>();
  const colors = Colors[colorScheme];
  const [orderIndex, setOrderIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [templateExercises, setTemplateExercises] = useState<
    TemplateExercise[]
  >([]);
  const [exerciseId, setExerciseId] = useState('0');

  useFocusEffect(
    useCallback(() => {
      // If no exercise has been inserted the corresponding workout will be deleted again from db
      return () => {
        let result;
        try {
          result = db.getFirstSync<{ exist_check: number }>(
            'SELECT EXISTS(SELECT 1 FROM template_exercises WHERE template_id = ?) AS exist_check',
            [template_id]
          );
        } catch (error) {
          console.error('Exist check did not run:', error);
        }
        let hasExercises = result?.exist_check;
        if (!hasExercises) {
          db.runSync('DELETE FROM template_workouts WHERE id = ?', [
            parseInt(template_id),
          ]);
        }
      };
    }, [])
  );

  useEffect(() => {
    function fetchTemplateExercises() {
      try {
        const result = db.getAllSync<TemplateExercise>(
          'SELECT * FROM template_exercises WHERE template_id = ? order by order_index',
          [template_id]
        );
        setTemplateExercises(result);
      } catch (error) {
        console.error('Failed to fetch template exercises', error);
      }
    }
    fetchTemplateExercises();
  }, [exerciseModalVisible, refreshKey]);

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
      setExerciseModalVisible(true);
    }
  };

  useEffect(() => {
    const result = db.getFirstSync<TemplateExercise>(
      `SELECT IFNULL(MAX(order_index), 0) AS max_order_index
       FROM template_exercises
       WHERE template_id = ?`,
      [template_id]
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
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LinearGradient
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={['#ddeaf6ff', '#b3cbe4ff']}
          style={StyleSheet.absoluteFillObject}
        />
        <View
          style={{
            flexDirection: 'row',
            height: '12%',
            width: '100%',
            marginTop: '5%',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <BackButton />
        </View>
        <ScrollView
          style={styles.scrollViewContainer}
          {...(Platform.OS === 'android' ? { fadingEdgeLength: 75 } : {})}
        >
          {templateExercises.map((exercise) => (
            <View
              style={styles.exerciseCardContainer}
              key={exercise.order_index}
            >
              <TemplateExerciseCard
                name={exercise.name}
                exercise_id={exercise.id.toString()}
                editable={false}
                template_id={template_id}
                refreshTrigger={() => setRefreshKey(refreshKey + 1)}
              />
            </View>
          ))}
        </ScrollView>
        <Modal
          style={{ alignSelf: 'center', overflow: 'visible' }}
          visible={selectionModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setSelectionModalVisible(!selectionModalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
            }}
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
            <TemplateExerciseCard
              name={exerciseName}
              exercise_id={exerciseId}
              editable={true}
              template_id={template_id}
              onConfirm={() => {
                setExerciseModalVisible(false);
                setRefreshKey((prev) => prev + 1);
              }}
            />
          </View>
        </Modal>
        <AddButton
          label="Add exercise"
          componentStyle={styles.buttonComponent}
          onPress={handleAddExercise}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    width: '100%',
    margin: 8,
  },
  exerciseCardContainer: {
    alignItems: 'center',
  },
  buttonComponent: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
  },
});
