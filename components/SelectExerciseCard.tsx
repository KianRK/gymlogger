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
  const [typing, setTyping] = useState(false);

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
      <View style={styles.selectionContainer}>
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
            keyExtractor={(item) => item.id.toString()}
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
      </View>
      <ConfirmButton
        onPress={handleConfirm}
        componentStyle={styles.confirmButtonContainer}
        buttonStyle={styles.confirmButton}
        labelStyle={styles.confirmButtonLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  selectExerciseCardContainer: {
    width: '75%',
    position: 'relative',
    borderColor: 'black',
    flexDirection: 'row',
    maxHeight: 120,
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  selectionContainer: { width: '75%' },
  flatListContainer: {
    width: '100%',
    top: 60,
    backgroundColor: 'white',
    position: 'absolute',
    maxHeight: 150,
    borderWidth: 1,
    borderColor: 'black',
    zIndex: 100,
  },
  inputText: {
    borderWidth: 1,
    width: '100%',
    fontSize: 26,
    textAlign: 'center',
  },
  listItems: {
    borderWidth: 1,
    fontSize: 18,
  },
  confirmButton: { width: 40, height: 40 },
  confirmButtonContainer: {
    marginRight: '5%',
  },
  confirmButtonLabel: {},
});
