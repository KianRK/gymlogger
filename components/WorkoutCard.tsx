import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { db } from '@/src/database';
import { WorkoutExercise } from '@/src/Interfaces/db_interfaces';
import CustomText from './CustomText';
import MenuButton from './Buttons/MenuButton';
import useThemeColors from '@/hooks/UseThemeColors';
import Card from './Card';
import ActionDialog from './ActionDialog';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/Theme';

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
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <CustomText style={styles.title}>Workout {workout_number}</CustomText>
          <CustomText style={[styles.subtitle, { color: colors.textMuted }]}>
            {workoutExercises.length}{' '}
            {t('app.exercises')}
          </CustomText>
        </View>
        <MenuButton onPress={onPressMenu} />
      </View>
      {workoutExercises.length > 0 && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
      {workoutExercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseRow}>
          <CustomText style={styles.exerciseName} numberOfLines={1}>
            {t(exercise.name)}
          </CustomText>
          <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
            <CustomText style={[styles.badgeText, { color: colors.textMuted }]}>
              {countSets(exercise.id)} Sets
            </CustomText>
          </View>
        </View>
      ))}
      <ActionDialog
        visible={dropDownVisible}
        title={`Workout ${workout_number}`}
        onRequestClose={() => setDropDownVisible(false)}
        actions={[
          {
            label: t('buttonLabels.edit'),
            variant: 'primary',
            onPress: () => {
              setDropDownVisible(false);
              onPressEdit();
            },
          },
          {
            label: t('buttonLabels.delete'),
            variant: 'danger',
            onPress: () => {
              setDropDownVisible(false);
              onPressDelete();
            },
          },
          {
            label: t('buttonLabels.cancel'),
            onPress: () => setDropDownVisible(false),
          },
        ]}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', paddingVertical: Spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: { flex: 1 },
  title: { fontFamily: Fonts.semiBold, fontSize: FontSize.bodyLarge },
  subtitle: { fontSize: FontSize.small, marginTop: 2 },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.sm,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  exerciseName: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
    marginRight: Spacing.md,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 2,
  },
  badgeText: { fontFamily: Fonts.medium, fontSize: FontSize.caption },
});
