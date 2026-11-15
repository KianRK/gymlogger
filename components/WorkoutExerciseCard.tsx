import { View, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import CustomTextInput from './CustomTextInput';
import AddButton from './Buttons/AddButton';
import ConfirmButton from './Buttons/ConfirmButton';
import DeleteButton from './Buttons/DeleteButton';
import CustomText from './CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';
import { useSettings } from '@/src/providers/SettingsProvider';

import { db } from '@/src/database';
import { Set } from '@/src/Interfaces/db_interfaces';

type Props = {
  name: string;
  exercise_id: string;
  editable: boolean;
  workout_id: string;
  dateName: string;
  onConfirm?: () => void;
  refreshTrigger?: () => void;
};

export default function WorkoutExerciseCard({
  name,
  exercise_id,
  editable,
  workout_id,
  dateName,
  onConfirm,
  refreshTrigger,
}: Props) {
  const colors = useThemeColors();
  const muted = { color: colors.textMuted };
  const { t } = useTranslation();
  const { settings } = useSettings();
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);
  const [editedSet, setEditedSet] = useState(['0', '0']);
  const [orderIndex, setOrderIndex] = useState(0);
  const [setList, setSetList] = useState<string[][]>([]);
  const setListRef = useRef<string[]>(['0', '0']);

  function deleteExercise(exercise_id: string) {
    try {
      db.runSync('DELETE FROM workout_exercises WHERE id = ?', [exercise_id]);
      refreshTrigger?.();
    } catch (error) {
      console.error('Could not delete workout_exercise', error);
    }
  }

  const handleAddSet = () => {
    if (editing) {
      setSetList((prev) => [...prev, [editedSet[0], editedSet[1]]]);
    }
    setEditing(true);
  };

  const handleConfirmSet = () => {
    setSetList((prev) => [...prev, [editedSet[0], editedSet[1]]]);
    let insertSets = [
      ...setList,
      [setListRef.current[0], setListRef.current[1]],
    ];
    if (insertSets.length > 0) {
      try {
        let result = db.runSync(
          'INSERT INTO workout_exercises (workout_id, name, date, order_index) VALUES (?, ?, ?, ?)',
          [workout_id, name, dateName, orderIndex]
        );
        let id = result.lastInsertRowId.toString();
        setOrderIndex(orderIndex + 1);
        insertSets.map((set, index) => {
          if (settings.units == 'metric') {
            const result = db.runSync(
              'INSERT INTO sets (exercise_id, order_index, reps, weight) VALUES ( ?, ?, ?, ?)',
              [id, index + 1, set[0], set[1]]
            );
          } else {
            let convertedWeight = parseFloat(set[1]) / 2.20462;
            const result = db.runSync(
              'INSERT INTO sets (exercise_id, order_index, reps, weight) VALUES ( ?, ?, ?, ?)',
              [id, index + 1, set[0], convertedWeight]
            );
          }
        });
      } catch (error) {
        console.error('Could not insert exercise and/or sets', error);
      }
    }
    setEditing(false);
    onConfirm?.();
  };

  const handleChangeText = (text: string, fieldIndex: number) => {
    let updatedEditedSet = editedSet;
    updatedEditedSet[fieldIndex] = text;
    setListRef.current = updatedEditedSet;
    setEditedSet(updatedEditedSet);
  };

  useEffect(() => {
    const result = db.getFirstSync<{ max_order_index: number }>(
      `SELECT IFNULL(MAX(order_index), 0) AS max_order_index
       FROM workout_exercises
       WHERE workout_id = ?`,
      [workout_id]
    );
    let order_index = result?.max_order_index;
    if (order_index != null) {
      setOrderIndex(order_index + 1);
    }
  }, []);

  useEffect(() => {
    function setup() {
      if (!editable) {
        try {
          const result = db.getAllSync<Set>(
            'SELECT * FROM sets WHERE exercise_id = (?) ORDER BY order_index',
            [exercise_id]
          );
          setSets(result);
        } catch (error) {
          console.error('Failed to fetch sets', error);
        }
      }
    }
    setup();
  }, []);

  useEffect(() => {
    refreshTrigger?.();
  }, []);
  const weightUnit = settings.units == 'metric' ? 'kg' : 'lb';

  const headerRow = (
    <View style={[styles.row, styles.headerRow]}>
      <CustomText style={[styles.colSet, styles.headerText, muted]}>SET</CustomText>
      <CustomText style={[styles.col, styles.headerText, muted]}>REPS</CustomText>
      <CustomText style={[styles.col, styles.headerText, muted]}>
        {weightUnit.toUpperCase()}
      </CustomText>
      {editable && <View style={styles.colAction} />}
    </View>
  );

  const setNumber = (n: number) => (
    <View style={styles.colSet}>
      <View style={[styles.setBadge, { backgroundColor: colors.surfaceAlt }]}>
        <CustomText style={styles.setBadgeText}>{n}</CustomText>
      </View>
    </View>
  );

  const inputStyle = [
    styles.col,
    styles.input,
    { backgroundColor: colors.surfaceAlt, borderColor: colors.border },
  ];

  return (
    <View
      style={[
        styles.card,
        {
          width: editable ? '88%' : '100%',
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        shadow(colors.shadow, editable ? 3 : 1),
      ]}
    >
      <View style={styles.titleRow}>
        <CustomText style={styles.title} numberOfLines={2}>
          {t(name)}
        </CustomText>
        {!editable && (
          <DeleteButton onPress={() => deleteExercise(exercise_id)} />
        )}
      </View>
      {headerRow}
      <ScrollView style={{ maxHeight: editable ? 280 : undefined }}>
        {editable &&
          setList.map((set, index) => (
            <View key={index} style={styles.row}>
              {setNumber(index + 1)}
              <CustomText style={[styles.col, styles.value]}>{set[0]}</CustomText>
              <CustomText style={[styles.col, styles.value]}>{set[1]}</CustomText>
              <View style={styles.colAction}>
                <DeleteButton
                  onPress={() => setSetList(setList.toSpliced(index, 1))}
                />
              </View>
            </View>
          ))}
        {!editable &&
          sets.map((set, index) => (
            <View key={set.id} style={styles.row}>
              {setNumber(index + 1)}
              <CustomText style={[styles.col, styles.value]}>{set.reps}</CustomText>
              <CustomText style={[styles.col, styles.value]}>
                {settings.units == 'metric'
                  ? Math.round(set.weight)
                  : Math.round(set.weight * 2.20462)}
              </CustomText>
            </View>
          ))}
        {editing && (
          <View style={styles.row}>
            {setNumber(setList.length + 1)}
            <CustomTextInput
              onChangeText={(text) => handleChangeText(text, 0)}
              inputMode="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              style={inputStyle}
            />
            <CustomTextInput
              onChangeText={(text) => handleChangeText(text, 1)}
              inputMode="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              style={inputStyle}
            />
            <View style={styles.colAction} />
          </View>
        )}
      </ScrollView>
      {editable && (
        <View style={styles.buttonContainer}>
          <AddButton
            label={t('buttonLabels.addSet')}
            variant="secondary"
            onPress={handleAddSet}
          />
          <ConfirmButton
            label={t('buttonLabels.confirm')}
            onPress={handleConfirmSet}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  title: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.bodyLarge,
    marginRight: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    gap: Spacing.sm,
  },
  headerRow: { minHeight: 28 },
  headerText: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.caption,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  colSet: { width: 44, alignItems: 'center' },
  col: { flex: 1, textAlign: 'center' },
  colAction: { width: 36, alignItems: 'center' },
  setBadge: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setBadgeText: { fontFamily: Fonts.semiBold, fontSize: FontSize.small },
  value: { fontFamily: Fonts.medium, fontSize: FontSize.bodyLarge },
  input: {
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    fontSize: FontSize.bodyLarge,
    paddingVertical: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.lg,
  },
});
