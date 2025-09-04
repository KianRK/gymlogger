import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

import AddButton from './AddButton';
import ConfirmButton from './ConfirmButton';
import DeleteButton from './DeleteButton';
import { WorkoutExercise } from '@/src/database/db_interfaces';

import { db } from '@/src/database';
import { Set } from '@/src/database/db_interfaces';

type Props = {
  name: string;
  exercise_id: string;
  editable: boolean;
  workout_id: string;
  onConfirm?: () => void;
  refreshKey?: number;
};

export default function ExerciseCard({
  name,
  exercise_id,
  editable,
  workout_id,
  onConfirm,
  refreshKey,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);
  const [editedSet, setEditedSet] = useState(['0', '0']);
  const [orderIndex, setOrderIndex] = useState(0);
  const [setList, setSetList] = useState<string[][]>([]);

  const handleAddSet = () => {
    if (editing) {
      setSetList((prev) => [...prev, [editedSet[0], editedSet[1]]]);
    }
    setEditing(true);
  };

  const handleConfirmSet = () => {
    setSetList((prev) => [...prev, [editedSet[0], editedSet[1]]]);
    if (setList.length > 0) {
      try {
        let result = db.runSync(
          'INSERT INTO workout_exercises (workout_id, name, order_index) VALUES (?, ?, ?)',
          [workout_id, name, orderIndex]
        );
        let id = result.lastInsertRowId.toString();
        setOrderIndex(orderIndex + 1);
        setList.map((set, index) => {
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
          setSets((r) => result);
        } catch (error) {
          console.error('Failed to fetch sets', error);
        }
      }
    }
    setup();
  }, []);

  return (
    <View style={styles.exerciseCardContainer}>
      <Text style={styles.exerciseCardHeader}>{name}</Text>
      <View style={styles.setContainer}>
        <Text style={styles.setText}>Set</Text>
        <Text style={styles.setText}>Reps</Text>
        <Text style={styles.setText}>Weight</Text>
        <Text style={{ flex: 1 }}></Text>
      </View>
      <ScrollView>
        {!editable &&
          sets.map((set, index) => (
            <View key={set.id} style={styles.setContainer}>
              <Text style={styles.setText}>{index + 1}</Text>
              <Text style={styles.setText}>{set.reps}</Text>
              <Text style={styles.setText}>{set.weight}</Text>
            </View>
          ))}
        {editable &&
          setList.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <Text style={styles.setText}>{index + 1}</Text>
              <Text style={styles.setText}>{set[0]}</Text>
              <Text style={styles.setText}>{set[1]}</Text>
              <DeleteButton
                onPress={() => setSetList(setList.toSpliced(index, 1))}
              />
            </View>
          ))}
        {editing && (
          <View style={styles.setContainer}>
            <Text style={styles.setText}>{sets.length + 1}</Text>
            <TextInput
              onChangeText={(text) => handleChangeText(text, 0)}
              inputMode="numeric"
              style={styles.setText}
            ></TextInput>
            <TextInput
              onChangeText={(text) => handleChangeText(text, 1)}
              inputMode="numeric"
              style={styles.setText}
            ></TextInput>
          </View>
        )}
      </ScrollView>
      {editable && (
        <View style={styles.buttonContainer}>
          <ConfirmButton
            label="Confirm"
            componentStyle={styles.confirmButtonComponent}
            onPress={handleConfirmSet}
          />
          <AddButton label="Add set" onPress={handleAddSet} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCardContainer: {
    width: '75%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    margin: 3,
  },
  setContainer: {
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseCardHeader: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 28,
  },
  setText: {
    borderWidth: 1,
    flex: 2,
    fontSize: 26,
    width: '30%',
  },
  confirmButtonComponent: {
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
