import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';

import AddButton from './AddButton';
import ConfirmButton from './ConfirmButton';
import DeleteButton from './DeleteButton';

import { db } from '@/src/database';
import { Set } from '@/src/database/db_interfaces';

type Props = {
  name: string;
  exercise_id: string;
  editable: boolean;
  onConfirm?: () => void;
  refreshKey?: number;
};

export default function ExerciseCard({
  name,
  exercise_id,
  editable,
  onConfirm,
  refreshKey,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [sets, setSets] = useState<Set[]>([]);
  const [editedSet, setEditedSet] = useState(['0', '0']);
  const [orderIndex, setOrderIndex] = useState(0);

  const handleAddSet = () => {
    if (editing) {
      try {
        const changes = db.runSync(
          'INSERT INTO sets (exercise_id, reps, weight, order_index) VALUES (?, ?, ?, ?)',
          [exercise_id, editedSet[0], editedSet[1], orderIndex + 1]
        );
        setOrderIndex(orderIndex + 1);
        let result = db.getAllSync<Set>(
          'SELECT * FROM sets WHERE exercise_id = (?) ORDER BY order_index',
          [exercise_id]
        );
        setSets(result);
      } catch (error) {
        console.error('Could not insert into sets: ', error);
      }
    }
    setEditing(true);
  };
  const handleConfirmSet = () => {
    if (sets.length > 0) {
      try {
        let changes = db.runSync(
          'INSERT INTO sets (exercise_id, reps, weight, order_index) VALUES (?, ?, ?, ?)',
          [exercise_id, editedSet[0], editedSet[1], orderIndex + 1]
        );
        setOrderIndex(orderIndex + 1);
        let result = db.getAllSync<Set>(
          'SELECT * FROM sets WHERE exercise_id = (?) ORDER BY order_index',
          [exercise_id]
        );
        setSets(result);
        setEditing(false);
        onConfirm?.();
      } catch (error) {
        console.error('Could not insert into sets: ', error);
      }
    } else {
      setEditing(false);
      onConfirm?.();
    }
  };

  const handleChangeText = (text: string, fieldIndex: number) => {
    let updatedEditedSet = editedSet;
    updatedEditedSet[fieldIndex] = text;
    setEditedSet(updatedEditedSet);
  };

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
      } else {
        const result = db.getFirstSync<Set>(
          `SELECT IFNULL(MAX(order_index), 0) AS max_order_index
   FROM sets
   WHERE exercise_id = ?`,
          [exercise_id]
        );
        let order_index = result?.order_index;
        if (order_index) {
          setOrderIndex(order_index);
        }
      }
    }
    setup();
  }, [refreshKey]);

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
        {sets.map((set) => (
          <View key={set.id} style={styles.setContainer}>
            <Text style={styles.setText}>{set.order_index}</Text>
            <Text style={styles.setText}>{set.reps}</Text>
            <Text style={styles.setText}>{set.weight}</Text>
            <DeleteButton label="HI" />
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
