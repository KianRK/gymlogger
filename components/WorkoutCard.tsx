import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Platform, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/Interfaces/db_interfaces';
import CustomText from './CustomText';
import MenuButton from './Buttons/MenuButton';
import useThemeColors from '@/hooks/UseThemeColors';

type Props = {
  workout_id: string;
  workout_number: number;
  pressedDropDownNumber: { num: number };
  refreshKey: number;
  onPressMenu: () => void;
  onPressEdit: () => void;
  onPressDelete: () => void;
};

export default function WorkoutCard({
  workout_id,
  workout_number,
  pressedDropDownNumber,
  refreshKey,
  onPressMenu,
  onPressEdit,
  onPressDelete,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    []
  );

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
      function fetchWorkoutExercises() {
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
      fetchWorkoutExercises();
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

  return (
    <View
      style={[styles.WorkoutCardContainer, { borderColor: colors.borderColor }]}
    >
      <LinearGradient
        start={{ x: 0.375, y: 0.375 }}
        end={{ x: 0.75, y: 0.75 }}
        colors={[colors.alpha, colors.mainOne, colors.mainTwo]}
        style={[
          StyleSheet.absoluteFill,
          { borderColor: colors.borderColor },
          styles.gradientStyle,
        ]}
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
            onPress={onPressMenu}
          />
          {dropDownVisible && (
            <View
              style={[
                styles.dropDownContainer,
                { backgroundColor: colors.background },
              ]}
            >
              <Pressable style={{ zIndex: 10 }} onPress={onPressEdit}>
                <CustomText style={styles.buttonText}>
                  {t('buttonLabels.edit')}
                </CustomText>
              </Pressable>
              <Pressable
                style={{ zIndex: 10 }}
                onPress={() => {
                  setDropDownVisible(false);
                  onPressDelete();
                }}
              >
                <CustomText style={styles.buttonText}>
                  {t('buttonLabels.delete')}
                </CustomText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
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
    borderRadius: 8,
    overflow: 'visible',
    margin: 8,
    padding: 5,
  },
  gradientStyle: {
    justifyContent: 'center',
    alignItems: 'center',
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
    overflow: 'visible',
    zIndex: 9,
  },
  deletebuttonComponent: {
    marginLeft: 'auto',
    marginRight: 3,
    marginBottom: 2,
  },
  buttonText: { fontSize: 18, padding: 2, zIndex: 10, textAlign: 'left' },
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
    margin: 'auto',
  },
  confirmationButton: {
    justifyContent: 'center',
    width: '50%',
  },
});
