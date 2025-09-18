import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import AddButton from './AddButton';
import ConfirmButton from './ConfirmButton';
import DeleteButton from './DeleteButton';

import { db } from '@/src/database';
import { Set } from '@/src/database/db_interfaces';

type Props = {
  name: string;
  exercise_id: string;
  editable: boolean;
  workout_id: string;
  dateName: string;
  onConfirm?: () => void;
  refreshTrigger?: () => void;
};

export default function ExerciseCard({
  name,
  exercise_id,
  editable,
  workout_id,
  dateName,
  onConfirm,
  refreshTrigger,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);
  const [editedSet, setEditedSet] = useState(['0', '0']);
  const [orderIndex, setOrderIndex] = useState(0);
  const [setList, setSetList] = useState<string[][]>([]);
  const setListRef = useRef<string[]>([]);

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
      {editable && (
        <View>
          <Text style={styles.exerciseCardHeader}>{name}</Text>
          <View style={styles.setContainer}>
            <Text style={styles.setTextEditable}>Set</Text>
            <Text style={styles.setTextEditable}>Reps</Text>
            <Text style={styles.setTextEditable}>Weight</Text>
            <Text style={{ flex: 1 }}></Text>
          </View>
        </View>
      )}
      {!editable && (
        <View>
          <View style={styles.exerciseCardHeaderContainer}>
            <Text style={styles.exerciseCardHeader}>{name}</Text>
            <DeleteButton
              componentStyle={styles.deleteButtonComponent}
              onPress={() => deleteExercise(exercise_id)}
            />
          </View>
          <View style={styles.setContainer}>
            <Text style={styles.setText}>Set</Text>
            <Text style={styles.setText}>Reps</Text>
            <Text style={styles.setText}>Weight</Text>
          </View>
        </View>
      )}
      <ScrollView>
        {editable &&
          setList.map((set, index) => (
            <View key={index} style={styles.setContainer}>
              <Text style={styles.setTextEditable}>{index + 1}</Text>
              <Text style={styles.setTextEditable}>{set[0]}</Text>
              <Text style={styles.setTextEditable}>{set[1]}</Text>

              <DeleteButton
                componentStyle={{ marginLeft: 'auto', marginRight: 'auto' }}
                onPress={() => setSetList(setList.toSpliced(index, 1))}
              />
            </View>
          ))}
        {!editable &&
          sets.map((set, index) => (
            <View key={set.id} style={styles.setContainer}>
              <Text style={styles.setText}>{index + 1}</Text>
              <Text style={styles.setText}>{set.reps}</Text>
              <Text style={styles.setText}>{set.weight}</Text>
            </View>
          ))}
        {editing && (
          <View style={styles.setContainer}>
            <Text style={styles.setTextEditable}>{setList.length + 1}</Text>
            <TextInput
              onChangeText={(text) => handleChangeText(text, 0)}
              inputMode="numeric"
              style={styles.setTextEditable}
            ></TextInput>
            <TextInput
              onChangeText={(text) => handleChangeText(text, 1)}
              inputMode="numeric"
              style={styles.setTextEditable}
            ></TextInput>
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
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    margin: 3,
  },
  setContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  exerciseCardHeader: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 28,
  },
  exerciseCardHeaderContainer: { flexDirection: 'row' },
  deleteButtonComponent: { marginLeft: 'auto', marginRight: '3%' },
  setText: {
    textAlign: 'center',
    minHeight: 35,
    borderWidth: 1,
    fontSize: 22,
    width: '33.3%',
  },
  setTextEditable: {
    textAlign: 'center',
    minHeight: 35,
    borderWidth: 1,
    fontSize: 22,
    width: '25%',
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
