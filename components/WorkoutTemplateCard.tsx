import { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import { db } from '@/src/database';
import { TemplateExercise } from '@/src/Interfaces/db_interfaces';
import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';
import MenuButton from './Buttons/MenuButton';
import useThemeColors from '@/hooks/UseThemeColors';
import Card from './Card';
import ActionDialog from './ActionDialog';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/Theme';

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
  const { t } = useTranslation();
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

  const displayName = name
    ? name
    : `${t('buttonLabels.template')} ${template_number}`;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View
          style={[styles.iconBadge, { backgroundColor: colors.primarySoft }]}
        >
          <Ionicons name="clipboard-outline" size={18} color={colors.primary} />
        </View>
        <CustomTextInput
          onEndEditing={() => {
            setNameEditable(false);
            updateName(text);
          }}
          enterKeyHint="done"
          ref={textInputRef}
          editable={nameEditable}
          onChangeText={(text) => setText(text)}
          style={[
            styles.title,
            nameEditable && {
              backgroundColor: colors.surfaceAlt,
              borderColor: colors.primary,
              borderWidth: 1,
            },
          ]}
        >
          {displayName}
        </CustomTextInput>
        <MenuButton onPress={onPress} />
      </View>
      {templateExercises.length > 0 && (
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      )}
      {templateExercises.map((exercise) => (
        <View key={exercise.id} style={styles.exerciseRow}>
          <CustomText style={styles.exerciseName} numberOfLines={1}>
            {t(exercise.name)}
          </CustomText>
          <View style={[styles.badge, { backgroundColor: colors.surfaceAlt }]}>
            <CustomText style={[styles.badgeText, { color: colors.textMuted }]}>
              {countSets(exercise.id)} Sets
            </CustomText>
          </View>
        </View>
      ))}
      <ActionDialog
        visible={dropDownVisible}
        title={displayName}
        onRequestClose={() => setDropDownVisible(false)}
        actions={[
          {
            label: t('buttonLabels.edit'),
            variant: 'primary',
            onPress: () => {
              setDropDownVisible(false);
              onPressEdit();
            },
          },
          {
            label: t('buttonLabels.rename'),
            onPress: () => {
              setNameEditable(true);
              setDropDownVisible(false);
              handleFocus();
            },
          },
          {
            label: t('buttonLabels.delete'),
            variant: 'danger',
            onPress: () => {
              setDropDownVisible(false);
              setDeleteConfirmationVisible(!deleteConfirmationVisible);
            },
          },
        ]}
      />
      <ActionDialog
        visible={deleteConfirmationVisible}
        title={t('templates.deleteTemplate')}
        onRequestClose={() => setDeleteConfirmationVisible(false)}
        actions={[
          {
            label: t('buttonLabels.cancel'),
            onPress: () => setDeleteConfirmationVisible(false),
          },
          {
            label: t('buttonLabels.delete'),
            variant: 'danger',
            onPress: () => deleteTemplate(template_id),
          },
        ]}
      />
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
  title: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.bodyLarge,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  divider: { height: StyleSheet.hairlineWidth, marginVertical: Spacing.sm },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
  },
  exerciseName: {
    flex: 1,
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
    marginRight: Spacing.md,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 2,
  },
  badgeText: { fontFamily: Fonts.medium, fontSize: FontSize.caption },
});
