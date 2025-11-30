import { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/Interfaces/db_interfaces';
import { Colors } from '@/constants/Colors';
import CustomText from './CustomText';

import DeleteButton from './Buttons/DeleteButton';
import MenuButton from './Buttons/MenuButton';

type Props = {
  workout_id: string;
  workout_number: number;
  pressedDropDownNumber: { num: number };
  refreshKey: number;
  refreshTrigger: () => void;
  onPressEdit: () => void;
  onPress: () => void;
};

export default function WorkoutCard({
  workout_id,
  workout_number,
  pressedDropDownNumber,
  refreshKey,
  refreshTrigger,
  onPressEdit,
  onPress,
}: Props) {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    []
  );
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';
  const colorTwoAlpha = '#ddeaf633';
  const [dropDownVisible, setDropDownVisible] = useState(false);

  useEffect(() => {
    function setup() {
      pressedDropDownNumber.num === workout_number
        ? setDropDownVisible(!dropDownVisible)
        : setDropDownVisible(false);
    }
    setup();
  }, [pressedDropDownNumber]);

  useFocusEffect(
    useCallback(() => {
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
    }, [refreshKey])
  );

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
      <LinearGradient
        start={{ x: 0.375, y: 0.375 }}
        end={{ x: 0.75, y: 0.75 }}
        colors={[colorOneAlpha, colorTwo, colorOne]}
        style={[StyleSheet.absoluteFill, styles.gradientStyle]}
      />
      <View style={styles.workoutCardHeaderContainer}>
        <CustomText style={styles.workoutCardLabel}>
          Workout {workout_number}
        </CustomText>
        <View style={styles.menuDropDownContainer}>
          <MenuButton
            componentStyle={styles.deletebuttonComponent}
            buttonStyle={{ width: 40, height: 40 }}
            iconSize={25}
            onPress={onPress}
          />
          {dropDownVisible && (
            <View style={styles.dropDownContainer}>
              <Pressable style={{ zIndex: 10 }} onPress={onPressEdit}>
                <CustomText style={styles.buttonText}>Edit</CustomText>
              </Pressable>
              <Pressable
                style={{ zIndex: 10 }}
                onPress={() => {
                  setDropDownVisible(false);
                  setDeleteConfirmationVisible(!deleteConfirmationVisible);
                }}
              >
                <CustomText style={styles.buttonText}>Delete</CustomText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <Modal transparent={true} visible={deleteConfirmationVisible}>
        <View style={styles.confirmationContainer}>
          <CustomText
            style={{
              height: '50%',
              width: '100%',
              alignSelf: 'center',
              borderBottomWidth: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: 24,
            }}
          >
            Delete Workout ?
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
              flex: 1,
            }}
          >
            <Pressable
              onPress={() => deleteWorkout(workout_id)}
              style={[styles.confirmationButton, { borderRightWidth: 1 }]}
            >
              <CustomText
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                Delete
              </CustomText>
            </Pressable>
            <Pressable
              onPress={() => setDeleteConfirmationVisible(false)}
              style={styles.confirmationButton}
            >
              <CustomText
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                Cancel
              </CustomText>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  );
}

const styles = StyleSheet.create({
  WorkoutCardContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'visible',
    margin: 8,
    padding: 5,
  },
  gradientStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 8,
  },
  workoutCardHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 4,
    zIndex: 7,
    overflow: 'visible',
  },
  workoutCardLabel: {
    position: 'absolute',
    marginRight: 'auto',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 22,
  },
  menuDropDownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 3,
    marginBottom: 2,
    overflow: 'visible',
    zIndex: 8,
  },
  dropDownContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 80,
    top: 40,
    marginLeft: 'auto',
    backgroundColor: '#f9f9f9',
    overflow: 'visible',
    zIndex: 9,
  },
  deletebuttonComponent: {
    marginLeft: 'auto',
    marginRight: 3,
    marginBottom: 2,
  },
  buttonText: { fontSize: 18, padding: 2, zIndex: 10 },
  workoutCardExerciseContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 2,
    zIndex: Platform.OS === 'ios' ? 0 : undefined,
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
  confirmationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'static',
    borderWidth: 1,
    borderRadius: 3,
    width: '60%',
    height: '10%',
    backgroundColor: '#f9f9f9',
    margin: 'auto',
  },
  confirmationButton: {
    justifyContent: 'center',
    width: '50%',
  },
});
