import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import ConfirmButton from './Buttons/ConfirmButton';
import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';

import { db } from '@/src/database';
import { Exercise } from '@/src/Interfaces/db_interfaces';
import useThemeColors from '@/hooks/UseThemeColors';

type Props = {
  onConfirm: () => void;
  updateExerciseName: (text: string) => void;
};

export default function SelectExerciseCard({
  onConfirm,
  updateExerciseName,
}: Props) {
  const colors = useThemeColors();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const handleConfirm = () => {
    onConfirm();
  };

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
    <View style={styles.cardWrapper}>
      <LinearGradient
        start={{ x: 0.375, y: 0.375 }}
        end={{ x: 0.75, y: 0.75 }}
        colors={[colors.mainOne, colors.mainTwo]}
        style={{ borderRadius: 36, overflow: 'visible' }}
      >
        <View
          style={[
            styles.selectExerciseCardContainer,
            { borderColor: colors.borderColor },
          ]}
        >
          <View style={styles.selectionContainer}>
            <CustomTextInput
              style={[styles.inputText, { fontSize: fontSize }]}
              onChangeText={handleChange}
              placeholder="Enter Exercise"
              placeholderTextColor={colors.text}
              value={text}
              onPress={() => setTyping(true)}
            />
          </View>
          <ConfirmButton
            onPress={handleConfirm}
            componentStyle={styles.confirmButtonContainer}
            buttonStyle={styles.confirmButton}
            labelStyle={styles.confirmButtonLabel}
          />
        </View>
      </LinearGradient>

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
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    width: '75%',
    position: 'relative',
  },
  selectExerciseCardContainer: {
    width: '100%',
    flexDirection: 'row',
    maxHeight: 120,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  selectionContainer: { width: '75%' },
  flatListContainer: {
    width: '70%',
    marginLeft: 10,
    maxHeight: 150,
    borderWidth: 1,
    zIndex: 999999,
  },
  inputText: {
    borderWidth: 1,
    width: '100%',
    borderRadius: 36,
    paddingLeft: 10,
    fontSize: 26,
    fontFamily: 'Outfit-Regular',
    textAlign: 'left',
    padding: 5,
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
