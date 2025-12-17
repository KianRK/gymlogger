import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
      <View
        style={[
          styles.selectExerciseCardContainer,
          {
            borderColor: colors.borderColor,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.selectionContainer}>
          <CustomTextInput
            style={[
              styles.inputText,
              {
                fontSize: fontSize,
                borderColor: colors.borderColor,
              },
            ]}
            onChangeText={handleChange}
            placeholder={t('buttonLabels.enterExercise')}
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

      {typing && (
        <FlatList
          data={filteredExercises}
          style={[
            styles.flatListContainer,
            { backgroundColor: colors.background },
          ]}
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
    width: '80%',
    position: 'relative',
  },
  selectExerciseCardContainer: {
    width: '100%',
    flexDirection: 'row',
    maxHeight: 120,
    borderRadius: 36,
    borderWidth: 1,
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
