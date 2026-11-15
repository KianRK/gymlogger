import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import ConfirmButton from './Buttons/ConfirmButton';
import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';

import { db } from '@/src/database';
import { Exercise } from '@/src/Interfaces/db_interfaces';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

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
  const handleConfirm = () => {
    onConfirm();
  };

  const filteredExercises = exercises.filter((item) =>
    t(item.name).toLowerCase().includes(text.toLowerCase())
  );
  const handleChange = (text: string) => {
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
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        shadow(colors.shadow, 3),
      ]}
    >
      <CustomText style={styles.title}>{t('buttonLabels.addExercise')}</CustomText>
      <View style={styles.inputRow}>
        <View
          style={[
            styles.searchField,
            {
              backgroundColor: colors.surfaceAlt,
              borderColor: typing ? colors.primary : 'transparent',
            },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <CustomTextInput
            style={styles.input}
            onChangeText={handleChange}
            placeholder={t('buttonLabels.enterExercise')}
            placeholderTextColor={colors.textMuted}
            value={text}
            onPress={() => setTyping(true)}
            onFocus={() => setTyping(true)}
          />
        </View>
        <ConfirmButton onPress={handleConfirm} />
      </View>

      {typing && (
        <FlatList
          data={filteredExercises}
          style={[styles.list, { borderColor: colors.border }]}
          keyboardShouldPersistTaps="handled"
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <Pressable
              style={({ pressed }) => [
                styles.listItem,
                index > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.border,
                },
                pressed && { backgroundColor: colors.surfaceAlt },
              ]}
              onPress={() => {
                handleChange(t(item.name));
                updateExerciseName(item.name);
                setTyping(false);
              }}
            >
              <CustomText style={styles.listItemText}>{t(item.name)}</CustomText>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '88%',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.title,
    marginBottom: Spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  searchField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: FontSize.body,
    paddingVertical: 0,
  },
  list: {
    marginTop: Spacing.md,
    maxHeight: 240,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  listItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  listItemText: { fontSize: FontSize.body },
});
