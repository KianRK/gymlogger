import { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { db } from '@/src/database';
import { TemplateExercise } from '@/src/Interfaces/db_interfaces';
import CustomText from './CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import Card from './Card';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/Theme';

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
  const { t } = useTranslation();
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
    <Card style={styles.card}>
      <View style={styles.header}>
        <View
          style={[styles.iconBadge, { backgroundColor: colors.primarySoft }]}
        >
          <Ionicons name="clipboard-outline" size={18} color={colors.primary} />
        </View>
        <CustomText style={styles.title} numberOfLines={1}>
          {name ? name : `${t('buttonLabels.template')} ${template_number}`}
        </CustomText>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </View>
      {templateExercises.length > 0 && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
      {templateExercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseRow}>
          <CustomText style={styles.exerciseName} numberOfLines={1}>
            {t(exercise.name)}
          </CustomText>
          <CustomText style={[styles.sets, { color: colors.textMuted }]}>
            {countSets(exercise.id)} Sets
          </CustomText>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', paddingVertical: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { flex: 1, fontFamily: Fonts.semiBold, fontSize: FontSize.bodyLarge },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.sm },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  exerciseName: { flex: 1, fontSize: FontSize.small, marginRight: Spacing.md },
  sets: { fontSize: FontSize.small },
});
