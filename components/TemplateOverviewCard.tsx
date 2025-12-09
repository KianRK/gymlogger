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
import useThemeColors from '@/hooks/UseThemeColors';

import MenuButton from './Buttons/MenuButton';

type Props = {
  template_id: string;
  template_number: number;
  name: string;
};

export default function TemplateOverviewCard({
  template_id,
  template_number,
  name,
}: Props) {
  const colors = useThemeColors();
  const [templateExercises, setTemplateExercises] = useState<
    TemplateExercise[]
  >([]);
  useState(false);

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
    }, [])
  );

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

  return (
    <View
      style={[
        styles.TemplateCardContainer,
        { borderColor: colors.borderColor },
      ]}
    >
      <LinearGradient
        start={{ x: 0.375, y: 0.375 }}
        end={{ x: 0.75, y: 0.75 }}
        colors={[colors.alpha, colors.mainOne, colors.mainTwo]}
        style={[
          StyleSheet.absoluteFill,
          { borderColor: colors.borderColor },
          styles.gradientStyle,
        ]}
      />
      <View style={styles.templateCardHeaderContainer}>
        {name && (
          <CustomText style={styles.templateCardLabel}>{name}</CustomText>
        )}
        {!name && (
          <CustomText style={styles.templateCardLabel}>
            Template {template_number}
          </CustomText>
        )}
      </View>
      {templateExercises.map((exercise) => (
        <View key={exercise.id} style={styles.templateCardExerciseContainer}>
          <CustomText style={styles.templateCardExerciseName}>
            {exercise.name}
          </CustomText>
          <CustomText style={styles.templateCardExerciseSets}>
            Sets: {countSets(exercise.id)}
          </CustomText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  TemplateCardContainer: {
    width: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'visible',
    margin: 8,
    padding: 5,
  },
  gradientStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  templateCardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 20,
    width: '100%',
    alignItems: 'center',
    borderBottomWidth: 1,
    padding: 4,
    zIndex: 7,
    overflow: 'visible',
  },
  templateCardLabel: {
    position: 'absolute',
    marginRight: 'auto',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 18,
  },
  templateCardExerciseContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    padding: 2,
    zIndex: Platform.OS === 'ios' ? 0 : undefined,
  },
  templateCardExerciseName: {
    fontWeight: 600,
    marginLeft: 3,
    fontSize: 14,
  },
  templateCardExerciseSets: {
    marginRight: 3,
    fontSize: 14,
  },
});
