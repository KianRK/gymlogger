import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import useThemeColors from '@/hooks/UseThemeColors';
import AddButton from '@/components/Buttons/AddButton';
import WorkoutTemplateCard from '@/components/WorkoutTemplateCard';

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

        <ScrollView
          style={styles.scrollViewContainer}
          {...(Platform.OS === 'android' ? { fadingEdgeLength: 10 } : {})}
        >
          {templates.map((template, index) => (
            <View key={template.id} style={styles.workoutTemplateContainer}>
              <WorkoutTemplateCard
                template_id={template.id.toString()}
                template_number={index + 1}
                name={template.name}
                pressedDropDownNumber={dropDownNumber}
                refreshKey={refreshTemplateKey}
                refreshTrigger={() => setRefreshKey(refreshKey + 1)}
                onPressEdit={() => goToEditMode(template.id.toString())}
                onPress={() => registrationHandler(index + 1)}
              />
            </View>
          ))}
        </ScrollView>
        <AddButton
          label={t('buttonLabels.addTemplate')}
          componentStyle={styles.buttonComponent}
          onPress={handleAddTemplate}
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
  workoutTemplateContainer: {
    alignItems: 'center',
    margin: 6,
    marginBottom: 6,
  },
  buttonComponent: {
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
  },
});
