import { TextInput, View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import ConfirmButton from './Buttons/ConfirmButton';
import CustomText from './CustomText';

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
  const [fontSize, setFontSize] = useState(26);
  const handleConfirm = () => {
    onConfirm();
  };
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';

  const filteredExercises = exercises.filter((item) =>
    item.name.toLowerCase().includes(text.toLowerCase())
  );
  const handleChange = (text: string) => {
    if (text.length > 18) {
      let adjustedFontSize = 26 - (text.length - 16);
      if (adjustedFontSize <= 16) {
        setFontSize(16);
      } else {
        setFontSize(adjustedFontSize);
      }
    }
    setText(text);
  };

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
    <LinearGradient
      start={{ x: 0.375, y: 0.375 }}
      end={{ x: 0.75, y: 0.75 }}
      colors={[colorOneAlpha, colorTwo, colorOne]}
      style={{ borderRadius: 8 }}
    >
      <View style={styles.selectExerciseCardContainer}>
        <View style={styles.selectionContainer}>
          <TextInput
            style={[styles.inputText, { fontSize: fontSize }]}
            onChangeText={handleChange}
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
                    handleChange(item.name);
                    updateExerciseName(item.name);
                    setTyping(false);
                  }}
                >
                  <CustomText style={styles.listItems}>{item.name}</CustomText>
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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  selectExerciseCardContainer: {
    width: '75%',
    position: 'relative',
    borderColor: 'black',
    flexDirection: 'row',
    maxHeight: 120,
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
    fontFamily: 'Outfit-Regular',
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
  confirmButtonLabel: { fontFamily: 'Outfit-Regular' },
});
