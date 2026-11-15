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
import ActionDialog from '@/components/ActionDialog';
import EmptyState from '@/components/EmptyState';
import IconButton from '@/components/IconButton';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.dateBar}>
        <CalendarButton
          date={isCurrentDateToday() ? t('today') : dateString}
          onPress={() => {
            setShow(!show);
          }}
        />
      </View>
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={onChange}
          display="inline"
          accentColor={colors.primary}
        />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        {...(Platform.OS === 'android'
          ? { fadingEdgeLength: { start: 0, end: 10 } }
          : {})}
      >
        {workouts.length === 0 && (
          <EmptyState
            icon="barbell-outline"
            title={t('workouts.empty')}
            hint={t('workouts.emptyHint')}
          />
        )}
        {workouts.map((workout, index) => (
          <WorkoutCard
            key={workout.id}
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
        ))}
      </ScrollView>
      <ActionDialog
        visible={deleteConfirmationVisible}
        title={t('workouts.deleteWorkout')}
        onRequestClose={() => setDeleteConfirmationVisible(false)}
        actions={[
          {
            label: t('buttonLabels.cancel'),
            onPress: () => setDeleteConfirmationVisible(false),
          },
          {
            label: t('buttonLabels.delete'),
            variant: 'danger',
            onPress: () => {
              deleteWorkout(activeWorkoutId);
              setDeleteConfirmationVisible(false);
            },
          },
        ]}
      />
      <ActionDialog
        visible={workoutSelectionVisible}
        title={t('workouts.addWorkoutFrom')}
        onRequestClose={() => setWorkoutSelectionVisible(false)}
        actions={[
          {
            label: t('buttonLabels.custom'),
            variant: 'primary',
            onPress: () => {
              handleAddWorkout();
              setWorkoutSelectionVisible(false);
            },
          },
          {
            label: t('buttonLabels.template'),
            onPress: () => {
              setWorkoutSelectionVisible(false);
              setTemplateSelectModalVisible(true);
            },
          },
          {
            label: t('buttonLabels.cancel'),
            onPress: () => setWorkoutSelectionVisible(false),
          },
        ]}
      />
      <Modal
        onRequestClose={() => setTemplateSelectModalVisible(false)}
        visible={templateSelectModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <View
            style={[
              styles.sheet,
              { backgroundColor: colors.background },
              shadow(colors.shadow, 3),
            ]}
          >
            <View style={styles.sheetHeader}>
              <CustomText style={styles.sheetTitle}>
                {t('workouts.chooseTemplate')}
              </CustomText>
              <IconButton
                variant="soft"
                accessibilityLabel={t('buttonLabels.cancel')}
                onPress={() => setTemplateSelectModalVisible(false)}
              >
                <Ionicons name="close" size={22} color={colors.icon} />
              </IconButton>
            </View>
            <ScrollView contentContainerStyle={styles.sheetContent}>
              {templates.length === 0 && (
                <CustomText
                  style={[styles.sheetEmpty, { color: colors.textMuted }]}
                >
                  {t('workouts.noTemplates')}
                </CustomText>
              )}
              {templates.map((template, index) => (
                <Pressable
                  key={index}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
          </View>
        </View>
      </Modal>
      <AddButton
        label={t('buttonLabels.addWorkout')}
        componentStyle={styles.fab}
        onPress={() => setWorkoutSelectionVisible(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  dateBar: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  scrollView: { flex: 1, width: '100%' },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
  },
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    maxHeight: '80%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingTop: Spacing.xl,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  sheetTitle: { fontFamily: Fonts.semiBold, fontSize: FontSize.heading },
  sheetContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  sheetEmpty: {
    textAlign: 'center',
    fontSize: FontSize.body,
    paddingVertical: Spacing.xl,
  },
});
