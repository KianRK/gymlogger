import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import useThemeColors from '@/hooks/UseThemeColors';
import AddButton from '@/components/Buttons/AddButton';
import WorkoutTemplateCard from '@/components/WorkoutTemplateCard';
import EmptyState from '@/components/EmptyState';
import { Spacing } from '@/constants/Theme';

import { db } from '@/src/database';
import { Template } from '@/src/Interfaces/db_interfaces';

export default function Index() {
  const router = useRouter();
  const colors = useThemeColors();
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [refreshTemplateKey, setRefreshTemplateKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [show, setShow] = useState(false);
  const [dropDownNumber, setDropDownNumber] = useState<{ num: number }>({
    num: 0,
  });

  const registrationHandler = (templateNum: number) => {
    setDropDownNumber({ num: templateNum });
  };

  const goToEditMode = (templateId: string) => {
    router.push({
      pathname: './templates/template',
      params: {
        template_id: templateId,
      },
    });
  };

  const handleAddTemplate = () => {
    try {
      const result = db.runSync('INSERT INTO template_workouts DEFAULT VALUES');
      let template_id = result.lastInsertRowId.toString();
      router.push({
        pathname: './templates/template',
        params: {
          template_id,
        },
      });
    } catch (error) {
      console.error('Inserting and rerouting did not work: ', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshTemplateKey(refreshTemplateKey + 1);
      function fetchTemplates() {
        try {
          const result = db.getAllSync<Template>(
            'SELECT * FROM template_workouts ORDER BY id'
          );
          setTemplates(result);
        } catch (error) {
          console.error('Failed to fetch templates:', error);
        }
      }
      fetchTemplates();
      return () => {
        setDropDownNumber({ num: 0 });
      };
    }, [refreshKey])
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        {...(Platform.OS === 'android' ? { fadingEdgeLength: 10 } : {})}
      >
        {templates.length === 0 && (
          <EmptyState
            icon="clipboard-outline"
            title={t('templates.empty')}
            hint={t('templates.emptyHint')}
          />
        )}
        {templates.map((template, index) => (
          <WorkoutTemplateCard
            key={template.id}
            template_id={template.id.toString()}
            template_number={index + 1}
            name={template.name}
            pressedDropDownNumber={dropDownNumber}
            refreshKey={refreshTemplateKey}
            refreshTrigger={() => setRefreshKey(refreshKey + 1)}
            onPressEdit={() => goToEditMode(template.id.toString())}
            onPress={() => registrationHandler(index + 1)}
          />
        ))}
      </ScrollView>
      <AddButton
        label={t('buttonLabels.addTemplate')}
        componentStyle={styles.fab}
        onPress={handleAddTemplate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
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
});
