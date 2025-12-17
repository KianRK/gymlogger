import {
  View,
  Pressable,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import '../../../src/i18n/i18n';
import i18n from '../../../src/i18n/i18n';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import useThemeColors from '@/hooks/UseThemeColors';
import CalendarButton from '@/components/Buttons/CalendarButton';
import AddButton from '@/components/Buttons/AddButton';
import WorkoutCard from '@/components/WorkoutCard';
import TemplateOverviewCard from '@/components/TemplateOverviewCard';
import CustomText from '@/components/CustomText';

import { db } from '@/src/database';
import {
  Workout,
  Template,
  TemplateExercise,
  Set,
} from '@/src/Interfaces/db_interfaces';

export default function Index() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const today = new Date();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [refreshWorkoutKey, setRefreshWorkoutKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [dropDownNumber, setDropDownNumber] = useState<{ num: number }>({
    num: 0,
  });
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [workoutSelectionVisible, setWorkoutSelectionVisible] = useState(false);
  const [activeWorkoutId, setActiveWorkoutId] = useState('');
  const [templateSelectModalVisible, setTemplateSelectModalVisible] =
    useState(false);

  //Month is zero indexed therefore needs to be increased by 1
  const dateString =
    `${date.getDate()}`.padStart(2, '0') +
    `.${date.getMonth() + 1}`.padStart(2, '0') +
    `.${date.getFullYear()}`;
  const dateName =
    `${date.getFullYear()}${date.getMonth() + 1}`.padStart(2, '0') +
    `${date.getDate()}`.padStart(2, '0');

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate) {
      setDate(currentDate);
    }
  };

  const registrationHandler = (workoutNum: number) => {
    setDropDownNumber({ num: workoutNum });
  };

  function isCurrentDateToday() {
    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
  }
  function deleteWorkout(workout_id: string) {
    try {
      db.runSync('DELETE FROM workouts WHERE id = ?', [workout_id]);
      setRefreshKey(refreshKey + 1);
    } catch (error) {
      console.log('Could not delete workout', error);
    }
  }

  const createWorkoutFromTemplate = (template_id: string) => {
    let template_exercises: TemplateExercise[] | null = null;
    let new_workout;
    let new_workout_id: number;

    try {
      template_exercises = db.getAllSync<TemplateExercise>(
        'SELECT * FROM template_exercises WHERE template_id = ?',
        [template_id]
      );
    } catch (error) {
      console.error('Failed to fetch template exercises: ', error);
    }
    try {
      new_workout = db.runSync('INSERT INTO workouts (date) VALUES (?)', [
        dateName,
      ]);
      new_workout_id = new_workout.lastInsertRowId;
    } catch (error) {
      console.error('Failed to insert into workouts: ', error);
    }
    const statement = db.prepareSync(
      'INSERT INTO workout_exercises (workout_id, name, date, order_index) VALUES (?,?,?,?) RETURNING id'
    );
    new_workout &&
      template_exercises?.forEach((element) => {
        try {
          let result = statement.executeSync<{ id: number }>(
            new_workout_id,
            element.name,
            dateName,
            element.order_index
          );
          let id = result.getFirstSync()?.id;
          if (id) {
            try {
              let sets = db.getAllSync<Set>(
                'SELECT * FROM template_sets where exercise_id = ?',
                [element.id]
              );
              sets?.forEach((set) => {
                try {
                  db.runSync(
                    'INSERT INTO sets (exercise_id, order_index, reps, weight) VALUES (?,?,?,?)',
                    [id, set.order_index, set.reps, set.weight]
                  );
                } catch (error) {
                  console.error('Failed to insert into sets: ', error);
                }
              });
            } catch (error) {
              console.error('Failed to fetch template sets: ', error);
            }
          }
        } catch (error) {
          console.error('Failed to insert into workout_exercises: ', error);
        }
      });
    setRefreshKey(refreshKey + 1);
  };

  const goToEditMode = (workoutId: string) => {
    router.push({
      pathname: './workouts/workout',
      params: {
        date: isCurrentDateToday() ? t('today') : dateString,
        dateName: dateName,
        workout_id: workoutId,
      },
    });
  };

  const handleAddWorkout = () => {
    try {
      const result = db.runSync('INSERT INTO workouts (date) VALUES (?)', [
        dateName,
      ]);
      let workout_id = result.lastInsertRowId.toString();
      router.push({
        pathname: './workouts/workout',
        params: {
          date: isCurrentDateToday() ? t('today') : dateString,
          dateName: dateName,
          workout_id,
        },
      });
    } catch (error) {
      console.error('Inserting and rerouting did not work: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshWorkoutKey(refreshWorkoutKey + 1);
      function fetchWorkouts() {
        try {
          const result = db.getAllSync<Workout>(
            'SELECT * FROM workouts WHERE date = ? ORDER BY id',
            [dateName]
          );
          setWorkouts(result);
        } catch (error) {
          console.error('Failed to fetch workouts:', error);
        }
      }
      fetchWorkouts();
      return () => {
        setDropDownNumber({ num: 0 });
      };
    }, [dateName, refreshKey])
  );

  useFocusEffect(
    useCallback(() => {
      function fetchTemplates() {
        try {
          const result = db.getAllSync<Template>(
            'SELECT * FROM template_workouts ORDER BY id'
          );
          setTemplates(result);
        } catch (error) {
          console.error('Failed to fetch templates: ', error);
        }
      }
      fetchTemplates();
    }, [])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LinearGradient
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={[colors.mainOne, colors.mainTwo]}
          style={StyleSheet.absoluteFillObject}
        />
        <CalendarButton
          date={isCurrentDateToday() ? t('today') : dateString}
          onPress={() => {
            setShow(!show);
          }}
        />
        {show && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onChange}
            display="inline"
          />
        )}
        <ScrollView
          style={styles.scrollViewContainer}
          {...(Platform.OS === 'android'
            ? { fadingEdgeLength: { start: 0, end: 10 } }
            : {})}
        >
          {workouts.map((workout, index) => (
            <View key={workout.id} style={styles.workoutContainer}>
              <WorkoutCard
                workout_id={workout.id.toString()}
                workout_number={index + 1}
                pressedDropDownNumber={dropDownNumber}
                refreshKey={refreshWorkoutKey}
                onPressMenu={() => registrationHandler(index + 1)}
                onPressEdit={() => goToEditMode(workout.id.toString())}
                onPressDelete={() => {
                  setActiveWorkoutId(workout.id.toString());
                  setDeleteConfirmationVisible(true);
                }}
              />
            </View>
          ))}
        </ScrollView>
        {/* RENDERS ALL WORKOUTCARDS IN ID ORDER AND PASSES WORKOUT ID TO WORKOUTCARD*/}
        <Modal transparent={true} visible={deleteConfirmationVisible}>
          <View
            style={[
              styles.confirmationContainer,
              { backgroundColor: colors.background },
            ]}
          >
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
              {t('workouts.deleteWorkout')}
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
                onPress={() => {
                  deleteWorkout(activeWorkoutId),
                    setDeleteConfirmationVisible(false);
                }}
                style={[
                  styles.deleteConfirmationButton,
                  { borderRightWidth: 1 },
                ]}
              >
                <CustomText
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                >
                  {t('buttonLabels.delete')}
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
                  {t('buttonLabels.cancel')}
                </CustomText>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal transparent={true} visible={workoutSelectionVisible}>
          <View
            style={[
              styles.workoutSelectionContainer,
              { backgroundColor: colors.background },
            ]}
          >
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
              {t('workouts.addWorkoutFrom')}
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
                onPress={() => {
                  handleAddWorkout();
                  setWorkoutSelectionVisible(false);
                }}
                style={[styles.workoutSourceButton, { borderRightWidth: 1 }]}
              >
                <CustomText
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                >
                  {t('buttonLabels.custom')}
                </CustomText>
              </Pressable>
              <Pressable
                onPress={() => {
                  setWorkoutSelectionVisible(false);
                  setTemplateSelectModalVisible(true);
                }}
                style={[styles.workoutSourceButton, { borderRightWidth: 1 }]}
              >
                <CustomText
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                >
                  {t('buttonLabels.template')}
                </CustomText>
              </Pressable>
              <Pressable
                onPress={() => setWorkoutSelectionVisible(false)}
                style={styles.workoutSourceButton}
              >
                <CustomText
                  style={{
                    fontSize: 20,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}
                >
                  {t('buttonLabels.cancel')}
                </CustomText>
              </Pressable>
            </View>
          </View>
        </Modal>
        <Modal
          onRequestClose={() => setTemplateSelectModalVisible(false)}
          visible={templateSelectModalVisible}
          allowSwipeDismissal={true}
          backdropColor={'#f9f9f922'}
          animationType="fade"
          style={{ justifyContent: 'center', flex: 1 }}
        >
          <View style={styles.templateContainer}>
            <ScrollView
              contentContainerStyle={{
                justifyContent: 'center',
              }}
            >
              {templates.map((template, index) => (
                <Pressable
                  key={index}
                  onPress={() => {
                    createWorkoutFromTemplate(template.id.toString());
                    setTemplateSelectModalVisible(false);
                  }}
                >
                  <TemplateOverviewCard
                    name={template.name}
                    template_id={template.id.toString()}
                    template_number={index + 1}
                  />
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={{}}
              onPress={() => setTemplateSelectModalVisible(false)}
            >
              <Ionicons name="close-outline" size={60} color={colors.icon} />
            </Pressable>
          </View>
        </Modal>
        <AddButton
          label={t('buttonLabels.addWorkout')}
          componentStyle={styles.buttonComponent}
          onPress={() => setWorkoutSelectionVisible(true)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    marginTop: '10%',
    width: '100%',
    margin: 8,
  },
  workoutContainer: {
    alignItems: 'center',
    margin: 6,
  },
  buttonComponent: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
  },
  confirmationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'static',
    borderWidth: 1,
    borderRadius: 3,
    width: '60%',
    height: '10%',
    margin: 'auto',
  },
  workoutSelectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'static',
    borderWidth: 1,
    borderRadius: 3,
    width: '80%',
    height: '10%',
    margin: 'auto',
  },
  workoutSourceButton: {
    justifyContent: 'center',
    width: '33%',
  },
  deleteConfirmationButton: {
    justifyContent: 'center',
    width: '50%',
  },
  templateContainer: {
    top: '20%',
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
