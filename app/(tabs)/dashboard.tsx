import { Dimensions, View, StyleSheet, ScrollView, Image } from 'react-native';
import { ImageSourcePropType } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '@/components/CustomText';
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

  function adjustFontSize(name: string) {
    let translatedName = t(name);
    let adjustedFontSize = 32 - (translatedName.length - 16);

    if (adjustedFontSize <= 14) {
      return 14;
    } else {
      return adjustedFontSize;
    }
  }

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
          legendFontColor: colors.text,
          legendFontSize: 15,
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
          legendFontColor: colors.text,
          legendFontSize: 15,
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

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
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
        style={{ width: '100%' }}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={[styles.statRow, { backgroundColor: colors.mainTwo }]}>
          <View
            style={[styles.statContainer, { backgroundColor: colors.mainTwo }]}
          >
            <CustomText style={styles.statText}>
              {t('dashboard.totalWorkouts')}
            </CustomText>
            <CustomText style={styles.statValue}>{totalWorkouts}</CustomText>
          </View>
          <View
            style={[
              styles.statContainer,
              {
                backgroundColor: colors.mainTwo,
                borderRightWidth: 1,
                borderLeftWidth: 1,
                borderColor: colors.borderColor,
              },
            ]}
          >
            <CustomText style={styles.statText}>
              {t('dashboard.trainingSince')}
            </CustomText>
            <CustomText style={styles.statValue}>
              {firstWorkoutDate?.getDate()}
            </CustomText>
          </View>
          <View
            style={[styles.statContainer, { backgroundColor: colors.mainTwo }]}
          >
            <CustomText style={styles.statText}>
              {t('dashboard.workoutsPerWeek')}
            </CustomText>
            <CustomText style={styles.statValue}>
              {totalWorkouts &&
                weeksTraining &&
                Math.round((totalWorkouts / weeksTraining) * 10) / 10}
            </CustomText>
          </View>
        </View>
        <View
          style={{
            height: 200,
            marginVertical: '5%',
            width: '90%',
          }}
        >
          <ScrollView
            horizontal={true}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {exRegionsData && (
              <View
                style={{
                  backgroundColor: colors.mainTwo,
                  borderRadius: 4,
                  marginRight: 5,
                }}
              >
                <CustomText style={styles.pieChartHeader}>
                  {t('dashboard.regionsAfterExercises')}
                </CustomText>
                <PieChart
                  data={exRegionsData}
                  width={screenWidth * 0.75}
                  height={160}
                  accessor={'freq'}
                  chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: '#08130D',
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    useShadowColorFromDataset: false, // optional
                  }}
                  backgroundColor={'transparent'}
                  paddingLeft={'0'}
                  center={[10, 0]}
                  absolute={false}
                />
              </View>
            )}
            {setRegionsData && (
              <View
                style={{ backgroundColor: colors.mainTwo, borderRadius: 4 }}
              >
                <CustomText style={styles.pieChartHeader}>
                  {t('dashboard.regionsAfterSets')}
                </CustomText>
                <PieChart
                  data={setRegionsData}
                  width={screenWidth * 0.75}
                  height={160}
                  accessor={'freq'}
                  chartConfig={{
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: '#08130D',
                    backgroundGradientToOpacity: 0.5,
                    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    useShadowColorFromDataset: false, // optional
                  }}
                  backgroundColor={'transparent'}
                  paddingLeft={'0'}
                  center={[10, 0]}
                  absolute={false}
                />
              </View>
            )}
          </ScrollView>
        </View>
        <View style={styles.favExerciseContainer}>
          <View style={styles.favExerciseColumn}>
            <CustomText style={styles.favExerciseHeader}>
              {t('dashboard.favoriteExerciseFrequency')}
            </CustomText>
            {favFreqExercises &&
              favFreqExercises.map((item: any, index: number) => {
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.favExercise,
                      { backgroundColor: colors.mainTwo },
                    ]}
                  >
                    <Image
                      source={imagePaths[index]}
                      style={{ width: 40, height: 40 }}
                    />
                    <CustomText
                      style={[
                        styles.favExerciseText,
                        {
                          fontSize:
                            t(item.name).length > 22
                              ? adjustFontSize(t(item.name))
                              : 22,
                        },
                      ]}
                    >
                      {t(item.name)}
                    </CustomText>
                  </View>
                );
              })}
          </View>
          <View style={styles.favExerciseColumn}>
            <CustomText style={styles.favExerciseHeader}>
              {t('dashboard.favoriteExerciseSets')}
            </CustomText>
            {favSetExercises &&
              favSetExercises.map((item: any, index: number) => {
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.favExercise,
                      { backgroundColor: colors.mainTwo },
                    ]}
                  >
                    <Image
                      source={imagePaths[index]}
                      style={{ width: 40, height: 40 }}
                    />
                    <CustomText
                      style={[
                        styles.favExerciseText,
                        {
                          fontSize:
                            t(item.name).length > 22
                              ? adjustFontSize(t(item.name))
                              : 22,
                        },
                      ]}
                    >
                      {t(item.name)}
                    </CustomText>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 4,
    width: '90%',
    marginTop: '5%',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  statContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '30%',
    height: 80,
  },
  statText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    height: '60%',
    fontSize: 14,
  },
  statValue: {
    textAlign: 'center',
    textAlignVertical: 'top',
    height: '40%',
    fontSize: 28,
  },
  pieChartHeader: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    paddingTop: 15,
  },
  favExerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  favExerciseColumn: { width: '49%' },
  favExerciseHeader: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 60,
  },
  favExercise: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: '100%',
    height: 112,
    paddingVertical: 5,
    marginVertical: 5,
  },
  favExerciseText: {
    fontSize: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
