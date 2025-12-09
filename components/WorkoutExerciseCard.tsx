import { View, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import CustomTextInput from './CustomTextInput';
import AddButton from './Buttons/AddButton';
import ConfirmButton from './Buttons/ConfirmButton';
import DeleteButton from './Buttons/DeleteButton';
import CustomText from './CustomText';
import useThemeColors from '@/hooks/UseThemeColors';

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
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);
  const [editedSet, setEditedSet] = useState(['0', '0']);
  const [orderIndex, setOrderIndex] = useState(0);
  const [setList, setSetList] = useState<string[][]>([]);
  const [fontSize, setFontSize] = useState<number>(26);
  const setListRef = useRef<string[]>(['0', '0']);
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';

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
          const result = db.runSync(
            'INSERT INTO sets (exercise_id, order_index, reps, weight) VALUES ( ?, ?, ?, ?)',
            [id, index + 1, set[0], set[1]]
          );
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
    function adjustFontSize() {
      if (name.length > 18) {
        let adjustedFontSize = 28 - (name.length - 18);

        if (adjustedFontSize <= 18) {
          setFontSize(18);
        } else {
          setFontSize(adjustedFontSize);
        }
      }
    }
    adjustFontSize();
    refreshTrigger?.();
  }, []);
  return (
    <View
      style={[
        styles.exerciseCardContainer,
        { borderColor: colors.borderColor },
      ]}
    >
      <LinearGradient
        start={{ x: 0.375, y: 0.375 }}
        end={{ x: 0.75, y: 0.75 }}
        colors={[colors.alpha, colors.mainOne, colors.mainTwo]}
        style={[StyleSheet.absoluteFill, { borderRadius: 10 }]}
      />
      {editable && (
        <View>
          <CustomText style={styles.exerciseCardHeader}>{name}</CustomText>
          <View style={styles.setContainer}>
            <CustomText
              style={[
                styles.setTextEditable,
                { borderColor: colors.borderColor },
              ]}
            >
              Set
            </CustomText>
            <CustomText
              style={[
                styles.setTextEditable,
                { borderColor: colors.borderColor },
              ]}
            >
              Reps
            </CustomText>
            <CustomText
              style={[
                styles.setTextEditable,
                { borderColor: colors.borderColor },
              ]}
            >
              Weight
            </CustomText>
          </View>
        </View>
      )}
      {!editable && (
        <View>
          <View style={styles.exerciseCardHeaderContainer}>
            <CustomText
              style={[styles.exerciseCardHeader, { fontSize: fontSize }]}
            >
              {name}
            </CustomText>
            <DeleteButton
              componentStyle={styles.deleteButtonComponent}
              onPress={() => deleteExercise(exercise_id)}
              iconSize={23}
            />
          </View>
          <View style={styles.setContainer}>
            <CustomText
              style={[styles.setText, { borderColor: colors.borderColor }]}
            >
              Set
            </CustomText>
            <CustomText
              style={[styles.setText, { borderColor: colors.borderColor }]}
            >
              Reps
            </CustomText>
            <CustomText
              style={[styles.setText, { borderColor: colors.borderColor }]}
            >
              Weight
            </CustomText>
          </View>
        </View>
      )}
      <ScrollView>
        {editable &&
          setList.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <CustomText
                style={[
                  styles.setTextEditable,
                  { borderColor: colors.borderColor },
                ]}
              >
                {index + 1}
              </CustomText>
              <CustomText
                style={[
                  styles.setTextEditable,
                  { borderColor: colors.borderColor },
                ]}
              >
                {set[0]}
              </CustomText>
              <CustomText
                style={[
                  styles.setTextEditable,
                  { borderColor: colors.borderColor },
                ]}
              >
                {set[1]}
              </CustomText>
              <DeleteButton
                componentStyle={{ marginLeft: 'auto', marginRight: 8 }}
                onPress={() => setSetList(setList.toSpliced(index, 1))}
                iconSize={23}
              />
            </View>
          ))}
        {!editable &&
          sets.map((set, index) => (
            <View key={set.id} style={styles.setContainer}>
              <CustomText
                style={[styles.setText, { borderColor: colors.borderColor }]}
              >
                {index + 1}
              </CustomText>
              <CustomText
                style={[styles.setText, { borderColor: colors.borderColor }]}
              >
                {set.reps}
              </CustomText>
              <CustomText
                style={[styles.setText, { borderColor: colors.borderColor }]}
              >
                {set.weight}
              </CustomText>
            </View>
          ))}
        {editing && (
          <View style={styles.setContainer}>
            <CustomText
              style={[
                styles.setTextEditable,
                { borderColor: colors.borderColor },
              ]}
            >
              {setList.length + 1}
            </CustomText>
            <CustomTextInput
              onChangeText={(text) => handleChangeText(text, 0)}
              inputMode="numeric"
              style={[
                styles.setTextEditable,
                { borderColor: colors.borderColor },
              ]}
            ></CustomTextInput>
            <CustomTextInput
              onChangeText={(text) => handleChangeText(text, 1)}
              inputMode="numeric"
              style={[
                styles.setTextEditable,
                { borderColor: colors.borderColor },
              ]}
            ></CustomTextInput>
          </View>
        )}
      </ScrollView>
      {editable && (
        <View style={styles.buttonContainer}>
          <ConfirmButton
            label="Confirm"
            componentStyle={styles.buttonComponent}
            onPress={handleConfirmSet}
          />
          <AddButton
            label="Add set"
            componentStyle={styles.buttonComponent}
            onPress={handleAddSet}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCardContainer: {
    width: '75%',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    margin: 3,
  },
  setContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  exerciseCardHeader: {
    alignSelf: 'center',
    fontSize: 28,
  },
  exerciseCardHeaderContainer: { flexDirection: 'row' },
  deleteButtonComponent: { marginLeft: 'auto', marginRight: '3%' },
  setText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    borderWidth: 1,
    fontSize: 22,
    width: '33.3%',
  },
  setTextEditable: {
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 50,
    borderWidth: 1,
    fontSize: 22,
    width: '28%',
  },
  buttonComponent: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
