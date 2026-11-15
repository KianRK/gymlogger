import {
  Modal,
  Pressable,
  View,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import useThemeColors from '@/hooks/UseThemeColors';
import TemplateExerciseCard from '@/components/TemplateExerciseCard';
import SelectExerciseCard from '@/components/SelectExerciseCard';
import AddButton from '@/components/Buttons/AddButton';
import BackButton from '@/components/Buttons/BackButton';
import EmptyState from '@/components/EmptyState';
import { Spacing } from '@/constants/Theme';

import { db } from '@/src/database';
import { TemplateExercise } from '@/src/Interfaces/db_interfaces';

export default function Workouts() {
  const colors = useThemeColors();
  const { template_id } = useLocalSearchParams<{
    template_id: string;
  }>();

  const [orderIndex, setOrderIndex] = useState(0);
  const { t } = useTranslation();
  const [refreshKey, setRefreshKey] = useState(0);
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [templateExercises, setTemplateExercises] = useState<
    TemplateExercise[]
  >([]);
  const [exerciseId, setExerciseId] = useState('0');

  useFocusEffect(
    useCallback(() => {
      // If no exercise has been inserted the corresponding workout will be deleted again from db
      return () => {
        let result;
        try {
          result = db.getFirstSync<{ exist_check: number }>(
            'SELECT EXISTS(SELECT 1 FROM template_exercises WHERE template_id = ?) AS exist_check',
            [template_id]
          );
        } catch (error) {
          console.error('Exist check did not run:', error);
        }
        let hasExercises = result?.exist_check;
        if (!hasExercises) {
          db.runSync('DELETE FROM template_workouts WHERE id = ?', [
            parseInt(template_id),
          ]);
        }
      };
    }, [])
  );

  useEffect(() => {
    function fetchTemplateExercises() {
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
    fetchTemplateExercises();
  }, [exerciseModalVisible, refreshKey]);

  //Lege Workout an. Gebe Exercise die Workout ID.
  // Wenn keine Exercise angelegt wird lösche Eintrag wieder

  const handleAddExercise = () => {
    if (!selectionModalVisible) {
      setSelectionModalVisible(true);
    }
  };

  const handleConfirmExercise = () => {
    setSelectionModalVisible(false);
    if (!exerciseModalVisible && exerciseName) {
      setExerciseModalVisible(true);
    }
  };

  useEffect(() => {
    const result = db.getFirstSync<TemplateExercise>(
      `SELECT IFNULL(MAX(order_index), 0) AS max_order_index
       FROM template_exercises
       WHERE template_id = ?`,
      [template_id]
    );
    let order_index = result?.order_index;
    if (order_index) {
      setOrderIndex(order_index);
    }
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.topBar}>
        <BackButton componentStyle={styles.backButton} />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        {...(Platform.OS === 'android'
          ? { fadingEdgeLength: { start: 0, end: 10 } }
          : {})}
      >
        {templateExercises.length === 0 && (
          <EmptyState
            icon="add-circle-outline"
            title={t('buttonLabels.addExercise')}
            hint={t('workouts.emptyExercises')}
          />
        )}
        {templateExercises.map((exercise) => (
          <TemplateExerciseCard
            key={exercise.order_index}
            name={exercise.name}
            exercise_id={exercise.id.toString()}
            editable={false}
                template_id={template_id}
            refreshTrigger={() => setRefreshKey(refreshKey + 1)}
          />
        ))}
      </ScrollView>
      <Modal
        visible={selectionModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setSelectionModalVisible(!selectionModalVisible);
        }}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: colors.overlay }]}
          onPress={() => setSelectionModalVisible(false)}
        >
          <Pressable style={styles.modalContent}>
            <SelectExerciseCard
              updateExerciseName={setExerciseName}
              onConfirm={handleConfirmExercise}
            />
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        visible={exerciseModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => {
          setExerciseModalVisible(!exerciseModalVisible);
        }}
      >
        <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
          <TemplateExerciseCard
            name={exerciseName}
            exercise_id={exerciseId}
            editable={true}
            template_id={template_id}
            onConfirm={() => {
              setExerciseModalVisible(false);
              setRefreshKey((prev) => prev + 1);
            }}
          />
        </View>
      </Modal>
      <AddButton
        label={t('buttonLabels.addExercise')}
        componentStyle={styles.fab}
        onPress={handleAddExercise}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  backButton: { marginLeft: Spacing.lg },
  datePill: { alignSelf: 'auto' },
  scrollView: { flex: 1, width: '100%' },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: { width: '100%', alignItems: 'center' },
  fab: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
  },
});
