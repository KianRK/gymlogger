import { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  useColorScheme,
  Platform,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { db } from '@/src/database';
import { TemplateExercise } from '@/src/Interfaces/db_interfaces';
import { Colors } from '@/constants/Colors';
import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';
import MenuButton from './Buttons/MenuButton';
import useThemeColors from '@/hooks/UseThemeColors';

type Props = {
  template_id: string;
  template_number: number;
  name: string;
  pressedDropDownNumber: { num: number };
  refreshKey: number;
  refreshTrigger: () => void;
  onPressEdit: () => void;
  onPress: () => void;
};

export default function WorkoutTemplateCard({
  template_id,
  template_number,
  name,
  pressedDropDownNumber,
  refreshKey,
  refreshTrigger,
  onPressEdit,
  onPress,
}: Props) {
  const colors = useThemeColors();
  const [templateExercises, setTemplateExercises] = useState<
    TemplateExercise[]
  >([]);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [nameEditable, setNameEditable] = useState(false);

  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [text, setText] = useState('');

  const textInputRef = useRef<TextInput | null>(null);

  useEffect(() => {
    function setup() {
      pressedDropDownNumber.num === template_number
        ? setDropDownVisible(!dropDownVisible)
        : setDropDownVisible(false);
    }
    setup();
  }, [pressedDropDownNumber]);

  const handleFocus = () => {
    if (textInputRef.current) {
      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  };

  useFocusEffect(
    useCallback(() => {
      function setup() {
        try {
          const result = db.getAllSync<TemplateExercise>(
            'SELECT * FROM template_exercises WHERE template_id = ? order by order_index',
            [template_id]
          );
          setTemplateExercises(result);
        } catch (error) {
          console.error('Failed to fetch template exercises', error);
        }
      }
      setup();
    }, [refreshKey])
  );

  function updateName(name: string) {
    let result;
    try {
      result = db.runSync(
        'UPDATE template_workouts SET name = ? WHERE id = ?',
        [name, template_id]
      );
    } catch (error) {
      console.error('Failed to update template name', error);
    }
  }

  function countSets(exercise_id: number) {
    let result;
    try {
      result = db.getFirstSync<{ count: number }>(
        'SELECT COUNT(*) as count FROM template_sets WHERE exercise_id = ?',
        [exercise_id]
      );
    } catch (error) {
      console.error('Failed to fetch template_sets with exercise_id', error);
    }
    return result?.count ?? 0;
  }

  function deleteTemplate(template_id: string) {
    try {
      db.runSync('DELETE FROM template_workouts WHERE id = ?', [template_id]);
      refreshTrigger();
    } catch (error) {
      console.log('Could not delete template', error);
    }
  }

  return (
    <View style={styles.WorkoutCardContainer}>
      <LinearGradient
        start={{ x: 0.375, y: 0.375 }}
        end={{ x: 0.75, y: 0.75 }}
        colors={[colors.alpha, colors.mainOne, colors.mainTwo]}
        style={[StyleSheet.absoluteFill, styles.gradientStyle]}
      />
      <View style={styles.workoutCardHeaderContainer}>
        {name && (
          <CustomTextInput
            onEndEditing={() => {
              setNameEditable(false);
              updateName(text);
            }}
            enterKeyHint="done"
            ref={textInputRef}
            editable={nameEditable}
            onChangeText={(text) => setText(text)}
            style={styles.workoutCardLabel}
          >
            {name}
          </CustomTextInput>
        )}
        {!name && (
          <CustomTextInput
            onEndEditing={() => {
              setNameEditable(false);
              updateName(text);
            }}
            enterKeyHint="done"
            ref={textInputRef}
            editable={nameEditable}
            onChangeText={(text) => setText(text)}
            style={styles.workoutCardLabel}
          >
            Template {template_number}
          </CustomTextInput>
        )}
        <View style={styles.menuDropDownContainer}>
          <MenuButton
            componentStyle={styles.deletebuttonComponent}
            buttonStyle={{ width: 40, height: 40 }}
            iconSize={25}
            onPress={onPress}
          />
          {dropDownVisible && (
            <View style={styles.dropDownContainer}>
              <Pressable style={{ zIndex: 999 }} onPress={onPressEdit}>
                <CustomText style={styles.buttonText}>Edit</CustomText>
              </Pressable>
              <Pressable
                style={{ zIndex: 999 }}
                onPress={() => {
                  setNameEditable(true);
                  setDropDownVisible(false);
                  handleFocus();
                }}
              >
                <CustomText style={styles.buttonText}>Rename</CustomText>
              </Pressable>
              <Pressable
                style={{ zIndex: 999 }}
                onPress={() => {
                  setDropDownVisible(false);
                  setDeleteConfirmationVisible(!deleteConfirmationVisible);
                }}
              >
                <CustomText style={styles.buttonText}>Delete</CustomText>
              </Pressable>
            </View>
          )}
        </View>
      </View>
      <Modal transparent={true} visible={deleteConfirmationVisible}>
        <View style={styles.confirmationContainer}>
          <CustomText
            style={{
              height: '50%',
              width: '100%',
              alignSelf: 'center',
              borderBottomWidth: 1,
              textAlign: 'center',
              textAlignVertical: 'center',
              fontSize: 24,
            }}
          >
            Delete Template ?
          </CustomText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '100%',
              flex: 1,
            }}
          >
            <Pressable
              onPress={() => deleteTemplate(template_id)}
              style={[styles.deleteConfirmationButton, { borderRightWidth: 1 }]}
            >
              <CustomText
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                Delete
              </CustomText>
            </Pressable>
            <Pressable
              onPress={() => setDeleteConfirmationVisible(false)}
              style={styles.deleteConfirmationButton}
            >
              <CustomText
                style={{
                  fontSize: 20,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                Cancel
              </CustomText>
            </Pressable>
          </View>
        </View>
      </Modal>
      {templateExercises.map((exercise) => (
        <View key={exercise.id} style={styles.workoutCardExerciseContainer}>
          <CustomText style={styles.workoutCardExerciseName}>
            {exercise.name}
          </CustomText>
          <CustomText style={styles.workoutCardExerciseSets}>
            Sets: {countSets(exercise.id)}
          </CustomText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  WorkoutCardContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 8,
    overflow: 'visible',
    margin: 8,
    padding: 5,
  },
  gradientStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 8,
  },
  workoutCardHeaderContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 4,
    zIndex: 7,
    overflow: 'visible',
  },
  workoutCardLabel: {
    position: 'absolute',
    marginRight: 'auto',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 22,
  },
  menuDropDownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: 3,
    marginBottom: 2,
    overflow: 'visible',
    zIndex: 9999,
  },
  dropDownContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: 80,
    top: 40,
    marginLeft: 'auto',
    backgroundColor: '#f9f9f9',
    overflow: 'visible',
    zIndex: 9999,
  },
  deletebuttonComponent: {
    marginLeft: 'auto',
    marginRight: 3,
    marginBottom: 2,
  },
  buttonText: { fontSize: 17, padding: 1, zIndex: 9999 },
  workoutCardExerciseContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 2,
    zIndex: Platform.OS === 'ios' ? 0 : undefined,
  },
  workoutCardExerciseName: {
    fontWeight: 600,
    marginLeft: 3,
    fontSize: 16,
  },
  workoutCardExerciseSets: {
    marginRight: 3,
    fontSize: 16,
  },
  confirmationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'static',
    borderWidth: 1,
    borderRadius: 3,
    width: '60%',
    height: '10%',
    backgroundColor: '#f9f9f9',
    margin: 'auto',
  },
  deleteConfirmationButton: {
    justifyContent: 'center',
    width: '50%',
  },
});
