import {
  Text,
  TextInput,
  View,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import { useEffect, useState } from 'react';

import ConfirmButton from './ConfirmButton';

import { db } from '@/src/database';
import { Exercise } from '@/src/database/db_interfaces';

type Props = {
  onConfirm: () => void;
  updateExerciseName: (text: string) => void;
};

export default function SelectExerciseCard({
  onConfirm,
  updateExerciseName,
}: Props) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(true);

  const handleConfirm = () => {
    onConfirm();
  };

  const filteredExercises = exercises.filter((item) =>
    item.name.toLowerCase().includes(text.toLowerCase())
  );

  useEffect(() => {
    function setup() {
      try {
        const result = db.getAllSync<Exercise>('SELECT * FROM exercises');
        setExercises(result);
      } catch (error) {
        console.error('Failed to fetch exercises', error);
      }
    }
    setup();
  }, []);

  return (
    <View style={styles.selectExerciseCardContainer}>
      <TextInput
        style={styles.inputText}
        onChangeText={(text) => setText(text)}
        placeholder="Enter Exercise"
        value={text}
        onPress={() => setTyping(true)}
      ></TextInput>
      {typing && (
        <FlatList
          data={filteredExercises}
          style={styles.flatListContainer}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setText(item.name);
                updateExerciseName(item.name);
                setTyping(false);
              }}
            >
              <Text style={styles.listItems}>{item.name}</Text>
            </Pressable>
          )}
        />
      )}
      <ConfirmButton onPress={handleConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  selectExerciseCardContainer: {
    width: '75%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    width: '75%',
    borderWidth: 1,
    borderColor: 'black',
  },
  inputText: {
    borderWidth: 1,
    width: '75%',
    fontSize: 26,
    textAlign: 'center',
  },
  listItems: {
    borderWidth: 1,
    fontSize: 18,
  },
});
