import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '@/components/CustomText';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';
import { Workout } from '@/src/Interfaces/db_interfaces';
import { RegionCount } from '@/constants/Interfaces';

import image1 from '@/assets/images/medal_one.png';
import image2 from '@/assets/images/medal_two.png';
import image3 from '@/assets/images/medal_three.png';

import { db } from '@/src/database';
// Fav Exercise, region pie chart, wo per week, total workouts, fav day, Data export

export default function Dashboard() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const [totalWorkouts, setTotalWorkouts] = useState<number | null>();
  const [firstWorkoutDate, setFirstWorkoutDate] = useState<Date | null>();
  const [weeksTraining, setWeeksTraining] = useState<number | null>();
  const [favFreqExercises, setFavFreqExercises] = useState<any>();
  const [favSetExercises, setFavSetExercises] = useState<any>();
  const [exRegionsData, setExRegionsData] = useState<any>();
  const [setRegionsData, setSetRegionsData] = useState<any>();
  const [setRegions, setSetRegions] = useState<RegionCount>({
    Abs: 0,
    Back: 0,
    Biceps: 0,
    Calves: 0,
    Chest: 0,
    Forearm: 0,
    Legs: 0,
    Shoulders: 0,
    Triceps: 0,
  });
  const [exerciseRegions, setExerciseRegions] = useState<RegionCount>({
    Abs: 0,
    Back: 0,
    Biceps: 0,
    Calves: 0,
    Chest: 0,
    Forearm: 0,
    Legs: 0,
    Shoulders: 0,
    Triceps: 0,
  });
  const imagePaths: ImageSourcePropType[] = [image1, image2, image3];
  const date = new Date();

  function parseDate(date: string) {
    const year = parseInt(date.substring(0, 4));
    const month = parseInt(date.substring(4, 6)) - 1;
    const day = parseInt(date.substring(6, 8));

    const dateObj = new Date(year, month, day);

    return dateObj;
  }

  function calculateWeeks(date1: Date, date2: Date) {
    let diffInMS = date2.getTime() - date1.getTime();
    let diffInWeeks = diffInMS / (1000 * 60 * 60 * 24 * 7);
    return diffInWeeks;
  }
  useEffect(() => {
    let chartData: any = [];
    let index = 0;
    let sum = 0;
    for (const val of Object.values(exerciseRegions)) {
      sum += val;
    }
    for (const [key, value] of Object.entries(exerciseRegions)) {
      if (value > 0) {
        chartData = chartData.concat({
          name: t('targets.' + key),
          freq: Math.round((value / sum) * 10000) / 100,
          color: colors.pieChartColors[index],
          legendFontColor: colors.textMuted,
          legendFontSize: 12,
        });
        index++;
      }
    }
    setExRegionsData(chartData);
  }, [exerciseRegions]);

  useEffect(() => {
    let chartData: any = [];
    let index = 0;
    let sum = 0;
    for (const val of Object.values(setRegions)) {
      sum += val;
    }
    for (const [key, value] of Object.entries(setRegions)) {
      if (value > 0) {
        chartData = chartData.concat({
          name: t('targets.' + key),
          freq: Math.round((value / sum) * 10000) / 100,
          color: colors.pieChartColors[index],
          legendFontColor: colors.textMuted,
          legendFontSize: 12,
        });
        index++;
      }
    }
    setSetRegionsData(chartData);
  }, [setRegions]);

  useFocusEffect(
    useCallback(() => {
      function fetchTotalWorkouts() {
        let result = db.getFirstSync<{ count: number }>(
          'SELECT COUNT(*) as count from workouts'
        );
        setTotalWorkouts(result?.count);
      }
      function calcTime() {
        let result = db.getFirstSync<Workout>(
          'SELECT * FROM workouts ORDER BY date ASC'
        );
        if (result) {
          let parsedDate = parseDate(result?.date);
          setFirstWorkoutDate(parsedDate);
          let weeksTrain = calculateWeeks(parsedDate, date);
          setWeeksTraining(weeksTrain);
        }
      }
      function countRegionExercises() {
        let result = db.getAllSync<{
          region: keyof RegionCount;
          regionCount: number;
        }>(
          'SELECT ex.region, COUNT(ex.region) AS regionCount FROM workout_exercises we JOIN exercises ex ON we.name = ex.name GROUP BY ex.region'
        );
        let regionObj: Record<keyof RegionCount, number> = {
          Abs: 0,
          Back: 0,
          Biceps: 0,
          Calves: 0,
          Chest: 0,
          Forearm: 0,
          Legs: 0,
          Shoulders: 0,
          Triceps: 0,
        };
        result.map((item) => {
          regionObj[item.region] = item.regionCount;
        });
        setExerciseRegions(regionObj);
      }
      function countRegionSets() {
        let result = db.getAllSync<{
          region: keyof RegionCount;
          regionCount: number;
        }>(
          'SELECT ex.region, COUNT(ex.region) AS regionCount FROM sets JOIN workout_exercises we ON sets.exercise_id = we.id JOIN exercises ex ON we.name = ex.name GROUP BY ex.region'
        );
        let regionObj: Record<keyof RegionCount, number> = {
          Abs: 0,
          Back: 0,
          Biceps: 0,
          Calves: 0,
          Chest: 0,
          Forearm: 0,
          Legs: 0,
          Shoulders: 0,
          Triceps: 0,
        };
        result.map((item) => {
          regionObj[item.region] = item.regionCount;
        });
        setSetRegions(regionObj);
      }
      function fetchFavFreqExercises() {
        let result = db.getAllSync<{ name: string; id: number }>(
          'SELECT we.name AS name, ex.id AS id FROM workout_exercises we JOIN exercises ex ON we.name=ex.name GROUP BY we.name, ex.id ORDER BY COUNT(we.name) DESC LIMIT 3'
        );
        setFavFreqExercises(result);
      }
      function fetchFavSetExercises() {
        let result = db.getAllSync<{ name: string; id: number }>(
          'SELECT ex.name AS name, ex.id AS id FROM sets JOIN workout_exercises we ON sets.exercise_id=we.id JOIN exercises ex ON we.name=ex.name GROUP BY ex.id ORDER BY COUNT(ex.name) DESC LIMIT 3'
        );
        setFavSetExercises(result);
      }
      fetchTotalWorkouts();
      calcTime();
      countRegionExercises();
      countRegionSets();
      fetchFavFreqExercises();
      fetchFavSetExercises();
    }, [])
  );

  const chartCardWidth = screenWidth - Spacing.lg * 2;
  const cardColors = [
    { backgroundColor: colors.surface, borderColor: colors.border },
    shadow(colors.shadow, 1),
  ];
  const kpis = [
    { label: t('dashboard.totalWorkouts'), value: totalWorkouts ?? 0 },
    {
      label: t('dashboard.trainingSince'),
      value: weeksTraining ? Math.max(1, Math.round(weeksTraining)) : 0,
    },
    {
      label: t('dashboard.workoutsPerWeek'),
      value:
        totalWorkouts && weeksTraining
          ? Math.round((totalWorkouts / weeksTraining) * 10) / 10
          : 0,
    },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.kpiRow}>
          {kpis.map((kpi) => (
            <View key={kpi.label} style={[styles.card, styles.kpiTile, cardColors]}>
              <CustomText style={[styles.kpiValue, { color: colors.primary }]}>
                {kpi.value}
              </CustomText>
              <CustomText
                style={[styles.kpiLabel, { color: colors.textMuted }]}
                numberOfLines={2}
              >
                {kpi.label}
              </CustomText>
            </View>
          ))}
        </View>

        <ScrollView
          horizontal
          snapToInterval={chartCardWidth + Spacing.md}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: Spacing.md }}
        >
            {exRegionsData && (
              <View
                style={[
                  styles.card,
                  styles.chartCard,
                  { width: chartCardWidth },
                  cardColors,
                ]}
              >
                <CustomText style={styles.cardTitle}>
                  {t('dashboard.regionsAfterExercises')}
                </CustomText>
                <PieChart
                  data={exRegionsData}
                  width={chartCardWidth - Spacing.lg * 2}
                  height={170}
                  accessor={'freq'}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  backgroundColor={'transparent'}
                  paddingLeft={'0'}
                  center={[8, 0]}
                  absolute={false}
                />
              </View>
            )}
            {setRegionsData && (
              <View
                style={[
                  styles.card,
                  styles.chartCard,
                  { width: chartCardWidth },
                  cardColors,
                ]}
              >
                <CustomText style={styles.cardTitle}>
                  {t('dashboard.regionsAfterSets')}
                </CustomText>
                <PieChart
                  data={setRegionsData}
                  width={chartCardWidth - Spacing.lg * 2}
                  height={170}
                  accessor={'freq'}
                  chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  backgroundColor={'transparent'}
                  paddingLeft={'0'}
                  center={[8, 0]}
                  absolute={false}
                />
              </View>
            )}
        </ScrollView>

        <View style={[styles.card, cardColors]}>
          <CustomText style={styles.cardTitle}>
            {t('dashboard.favoriteExerciseFrequency')}
          </CustomText>
          {favFreqExercises &&
            favFreqExercises.map((item: any, index: number) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/exercises/[id]',
                    params: {
                      id: item.id,
                      source: '/dashboard',
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.rankRow,
                  index > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Image source={imagePaths[index]} style={styles.medal} />
                <CustomText style={styles.rankName} numberOfLines={1}>
                  {t(item.name)}
                </CustomText>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}
          {(!favFreqExercises || favFreqExercises.length === 0) && (
            <CustomText style={[styles.emptyText, { color: colors.textMuted }]}>
              {t('exercises.noData')}
            </CustomText>
          )}
        </View>
        <View style={[styles.card, cardColors]}>
          <CustomText style={styles.cardTitle}>
            {t('dashboard.favoriteExerciseSets')}
          </CustomText>
          {favSetExercises &&
            favSetExercises.map((item: any, index: number) => (
              <Pressable
                key={item.id}
                onPress={() =>
                  router.push({
                    pathname: '/exercises/[id]',
                    params: {
                      id: item.id,
                      source: '/dashboard',
                    },
                  })
                }
                style={({ pressed }) => [
                  styles.rankRow,
                  index > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Image source={imagePaths[index]} style={styles.medal} />
                <CustomText style={styles.rankName} numberOfLines={1}>
                  {t(item.name)}
                </CustomText>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}
          {(!favSetExercises || favSetExercises.length === 0) && (
            <CustomText style={[styles.emptyText, { color: colors.textMuted }]}>
              {t('exercises.noData')}
            </CustomText>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.lg,
  },
  cardTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.body,
    marginBottom: Spacing.sm,
  },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm },
  kpiTile: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  kpiValue: { fontFamily: Fonts.bold, fontSize: FontSize.display },
  kpiLabel: {
    fontSize: FontSize.caption,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  chartCard: { paddingBottom: Spacing.sm },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  medal: { width: 32, height: 32 },
  rankName: { flex: 1, fontFamily: Fonts.medium, fontSize: FontSize.body },
  emptyText: { fontSize: FontSize.small, paddingVertical: Spacing.md },
});
