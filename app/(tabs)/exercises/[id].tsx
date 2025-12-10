import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { LineChart } from 'react-native-chart-kit';

import useThemeColors from '@/hooks/UseThemeColors';
import { db } from '@/src/database';
import { Exercise, WorkoutExercise } from '@/src/Interfaces/db_interfaces';

import { DateDictionary } from '@/constants/DataTypes';
import CustomText from '@/components/CustomText';
import BackButton from '@/components/Buttons/BackButton';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';

export default function ExerciseId() {
  const colors = useThemeColors();
  const screenWidth = Dimensions.get('window').width;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise>();

  const dateDict: DateDictionary = {};
  const [dataLabels, setDataLabels] = useState<string[]>([]);
  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [maxVolume, setMaxVolume] = useState<number>(0);
  const [volumeChartData, setVolumeChartData] = useState<any>(null);
  const [dailyMaxChartData, setDailyMaxChartData] = useState<any>(null);
  const [headerFontSize, setHeaderFontSize] = useState<number>(32);
  const [setsChartData, setSetsChartData] = useState<any>(null);
  const [repsChartData, setRepsChartData] = useState<any>(null);

  const [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    dailyMaxVisible: false,
    volumeVisible: false,
    setsVisible: false,
    repsVisible: false,
    label: '',
    chartName: '',
    value: 0,
  });

  const chartWidthRatio = 0.9;
  const chartHeight = 264;

  useEffect(() => {
    function adjustFontSize() {
      if (exercise) {
        if (exercise.name.length > 16) {
          let adjustedFontSize = 32 - (exercise.name.length - 16);

          if (adjustedFontSize <= 14) {
            setHeaderFontSize(14);
          } else {
            setHeaderFontSize(adjustedFontSize);
          }
        }
      }
    }
    adjustFontSize();
  }, []);

  function dailyMaxDec() {
    return tooltipPos.dailyMaxVisible ? (
      <View>
        <Svg>
          <Rect
            x={tooltipPos.x - 30}
            y={tooltipPos.y + 15}
            width="70"
            height="40"
            fill="black"
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.value + ' kg'}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.label}
          </TextSVG>
        </Svg>
      </View>
    ) : null;
  }

  function volumeDec() {
    return tooltipPos.volumeVisible ? (
      <View>
        <Svg>
          <Rect
            x={tooltipPos.x - 30}
            y={tooltipPos.y + 15}
            width="70"
            height="40"
            fill="black"
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.value + ' kg'}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.label}
          </TextSVG>
        </Svg>
      </View>
    ) : null;
  }
  function setsDec() {
    return tooltipPos.setsVisible ? (
      <View>
        <Svg>
          <Rect
            x={tooltipPos.x - 30}
            y={tooltipPos.y + 15}
            width="70"
            height="40"
            fill="black"
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.value}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.label}
          </TextSVG>
        </Svg>
      </View>
    ) : null;
  }
  function repsDec() {
    return tooltipPos.repsVisible ? (
      <View>
        <Svg>
          <Rect
            x={tooltipPos.x - 30}
            y={tooltipPos.y + 15}
            width="70"
            height="40"
            fill="black"
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.value}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill="white"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.label}
          </TextSVG>
        </Svg>
      </View>
    ) : null;
  }

  function handleClickOnDataPoint(data: any) {
    let maxData = dailyMaxChartData.datasets[0].data;
    let volData = volumeChartData.datasets[0].data;
    let repsData = repsChartData.datasets[0].data;
    let setsData = setsChartData.datasets[0].data;
    let label = dataLabels[data.index];
    let formatted_label = `${label.slice(2, 4)}/${label.slice(
      4,
      6
    )}/${label.slice(6, 8)}`;

    let pointData = data.dataset.data;

    let isMaxData = pointData === maxData;
    let isVolData = pointData === volData;
    let isRepsData = pointData === repsData;
    let isSetsData = pointData === setsData;

    let chartName: string = '';

    if (isMaxData) {
      chartName = 'max';
    } else if (isVolData) {
      chartName = 'vol';
    } else if (isRepsData) {
      chartName = 'reps';
    } else if (isSetsData) {
      chartName = 'sets';
    }

    let isSamePoint =
      tooltipPos.x === data.x &&
      tooltipPos.y === data.y &&
      tooltipPos.chartName === chartName;

    isSamePoint
      ? setTooltipPos((previousState) => {
          return {
            ...previousState,
            value: data.value,
            dailyMaxVisible: isMaxData && !previousState.dailyMaxVisible,
            volumeVisible: isVolData && !previousState.volumeVisible,
            repsVisible: isRepsData && !previousState.repsVisible,
            setsVisible: isSetsData && !previousState.setsVisible,
          };
        })
      : setTooltipPos({
          x: data.x,
          y: data.y,
          value: data.value,
          dailyMaxVisible: isMaxData,
          volumeVisible: isVolData,
          repsVisible: isRepsData,
          setsVisible: isSetsData,
          label: formatted_label,
          chartName: chartName,
        });
  }

  function fetchExercise() {
    let result;
    try {
      result = db.getFirstSync<Exercise>(
        'SELECT * FROM exercises where id = ?',
        [id]
      );
      if (result != null) {
        setExercise(result);
      }
    } catch (error) {
      console.error('Could not fetch exercise details', error);
    }
    return result;
  }

  function fetchWorkoutExercises(ex: Exercise) {
    let result;
    if (ex != null) {
      try {
        result = db.getAllSync<WorkoutExercise>(
          'SELECT * FROM workout_exercises WHERE name = ? ORDER BY date',
          [ex.name]
        );
      } catch (error) {
        console.error('Could not fetch all workout exercises from name', error);
      }
    }
    return result;
  }

  function prepareData(workoutEx: WorkoutExercise[]) {
    let dDict: DateDictionary = {};
    for (const row of workoutEx) {
      let volResult = db.getFirstSync<{ vol: number }>(
        'SELECT SUM(reps * weight) AS vol FROM sets WHERE exercise_id = ?',
        [row.id]
      );
      let volume = volResult?.vol ?? 0;
      let maxResult = db.getFirstSync<{ dailyMax: number }>(
        'SELECT MAX(weight) AS dailyMax FROM sets WHERE exercise_id = ?',
        [row.id]
      );
      let dailyMax = maxResult?.dailyMax ?? 0;
      let setsResult = db.getFirstSync<{ numSets: number }>(
        'SELECT COUNT(*) AS numSets FROM sets WHERE exercise_id = ?',
        [row.id]
      );
      let numSets = setsResult?.numSets ?? 0;
      let repsResult = db.getFirstSync<{ numReps: number }>(
        'SELECT SUM(reps) AS numReps FROM sets WHERE exercise_id = ?',
        [row.id]
      );
      let numReps = repsResult?.numReps ?? 0;
      if (row.date in dateDict) {
        dDict[row.date] = {
          volume: dDict[row.date].volume + (volume ?? 0),
          dailyMax: dDict[row.date].dailyMax + (dailyMax ?? 0),
          sets: dDict[row.date].sets + (numSets ?? 0),
          reps: dDict[row.date].reps + (numReps ?? 0),
        };
      } else {
        dDict[row.date] = {
          volume: volume ?? 0,
          dailyMax: dailyMax ?? 0,
          sets: numSets ?? 0,
          reps: numReps ?? 0,
        };
      }
    }
    return dDict;
  }

  function createChartData(dDict: DateDictionary) {
    setDataLabels(Object.keys(dDict));
    let vd = Object.values(dDict).map((data) => data.volume);
    let dmd = Object.values(dDict).map((data) => data.dailyMax);
    let sd = Object.values(dDict).map((data) => data.sets);
    let rd = Object.values(dDict).map((data) => data.reps);

    if (vd.length > 0) {
      setMaxVolume(Math.max(...vd));
      setVolumeChartData({
        labels: dataLabels,
        datasets: [
          {
            data: vd,
            strokeWidth: 2,
          },
        ],
      });
    }

    if (dmd.length > 0) {
      setMaxWeight(Math.max(...dmd));
      setDailyMaxChartData({
        labels: dataLabels,
        datasets: [
          {
            data: dmd,
            strokeWidth: 2,
          },
        ],
      });
    }
    if (sd.length > 0) {
      setSetsChartData({
        labels: dataLabels,
        datasets: [
          {
            data: sd,
            strokeWidth: 2,
          },
        ],
      });
    }
    if (rd.length > 0) {
      setRepsChartData({
        labels: dataLabels,
        datasets: [
          {
            data: rd,
            strokeWidth: 2,
          },
        ],
      });
    }
  }

  useFocusEffect(
    useCallback(() => {
      let ex;
      let workEx;
      let dDict;
      ex = fetchExercise();
      if (ex != null) {
        workEx = fetchWorkoutExercises(ex);
      }
      if (workEx != null) {
        dDict = prepareData(workEx);
      }
      if (dDict != null) {
        createChartData(dDict);
      }
      return () => {
        setTooltipPos((previousState) => {
          return {
            ...previousState,
            dailyMaxVisible: false,
            volumeVisible: false,
            setsVisible: false,
            repsVisible: false,
          };
        });
      };
    }, [])
  );

  return (
    <View style={{ flex: 12, justifyContent: 'center', alignItems: 'center' }}>
      <LinearGradient
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 1, y: 1 }}
        colors={[colors.mainOne, colors.mainTwo]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.pageHeader}>
        <BackButton componentStyle={{ position: 'absolute', right: '85%' }} />
        <CustomText
          style={{
            fontSize: headerFontSize,
            textAlign: 'center',
            textAlignVertical: 'center',
            flexWrap: 'wrap',
            width: '75%',
          }}
        >
          {exercise?.name}
        </CustomText>
      </View>
      {/*<View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/latpull_target_muscles.png')}
              style={styles.exerciseImage}
            />
          </View>
          */}
      <View style={{ marginTop: '3%' }}>
        <View style={[styles.factRow, { borderColor: colors.borderColor }]}>
          <CustomText style={styles.factText}>Region:</CustomText>
          <CustomText style={styles.factValueText}>
            {exercise?.region}
          </CustomText>
        </View>
        {exercise?.primary_target && (
          <View style={[styles.factRow, { borderColor: colors.borderColor }]}>
            <CustomText style={styles.factText}>Primary:</CustomText>
            <CustomText style={styles.factValueText}>
              {JSON.parse(exercise?.primary_target).map(
                (target: string, index: number) => {
                  return index ===
                    JSON.parse(exercise.primary_target).length - 1
                    ? target
                    : target + '\n';
                }
              )}
            </CustomText>
          </View>
        )}
        {exercise?.secondary_target && (
          <View style={[styles.factRow, { borderColor: colors.borderColor }]}>
            <CustomText style={styles.factText}>Secondary:</CustomText>
            <CustomText style={styles.factValueText}>
              {JSON.parse(exercise?.secondary_target).map(
                (target: string, index: number) => {
                  return index ==
                    JSON.parse(exercise.secondary_target).length - 1
                    ? target
                    : target + '\n';
                }
              )}
            </CustomText>
          </View>
        )}
      </View>
      <View style={styles.statContainer}>
        <View style={[styles.statRow, { borderColor: colors.borderColor }]}>
          <CustomText style={styles.statRowText}>Maximum weight:</CustomText>
          <CustomText style={styles.statRowText}>{maxWeight}</CustomText>
        </View>
        <View style={[styles.statRow, { borderColor: colors.borderColor }]}>
          <CustomText style={styles.statRowText}>Maximum volume:</CustomText>
          <CustomText style={styles.statRowText}>{maxVolume}</CustomText>
        </View>
        <View style={[styles.statRow, { borderColor: colors.borderColor }]}>
          <CustomText style={styles.statRowText}>1RM:</CustomText>
          <CustomText style={styles.statRowText}>250</CustomText>
        </View>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', width: '95%' }}>
        <ScrollView
          style={{ height: '100%' }}
          contentContainerStyle={styles.scrollContainer}
        >
          <View
            style={[
              styles.chartContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <CustomText style={styles.chartTitle}>Maximum Weight</CustomText>
            {dailyMaxChartData != null && (
              <LineChart
                data={dailyMaxChartData}
                width={screenWidth * chartWidthRatio}
                height={chartHeight}
                yAxisSuffix=" kg"
                fromZero={true}
                withOuterLines={false}
                decorator={() => dailyMaxDec()}
                withVerticalLabels={false}
                onDataPointClick={(data) => handleClickOnDataPoint(data)}
                formatXLabel={(xValue) => {
                  return (
                    xValue.slice(2, 4) +
                    '/' +
                    xValue.slice(4, 6) +
                    '/' +
                    xValue.slice(6, 8)
                  );
                }}
                chartConfig={{
                  decimalPlaces: 0,
                  backgroundGradientFrom: colors.background,
                  backgroundGradientFromOpacity: 0.5,
                  backgroundGradientTo: colors.background,
                  backgroundGradientToOpacity: 0.5,
                  color: () => colors.text,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            )}
            {dailyMaxChartData == null && (
              <CustomText style={styles.emptyChartText}>
                NO DATA YET!
              </CustomText>
            )}
          </View>

          <View
            style={[
              styles.chartContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <CustomText style={styles.chartTitle}>Volume</CustomText>
            {volumeChartData != null && (
              <LineChart
                data={volumeChartData}
                width={screenWidth * chartWidthRatio}
                height={chartHeight}
                fromZero={true}
                withVerticalLabels={false}
                onDataPointClick={(data) => handleClickOnDataPoint(data)}
                decorator={() => volumeDec()}
                formatXLabel={(xValue) => {
                  return (
                    xValue.slice(2, 4) +
                    '/' +
                    xValue.slice(4, 6) +
                    '/' +
                    xValue.slice(6, 8)
                  );
                }}
                chartConfig={{
                  decimalPlaces: 0,
                  backgroundGradientFrom: colors.background,
                  backgroundGradientFromOpacity: 0.5,
                  backgroundGradientTo: colors.background,
                  backgroundGradientToOpacity: 0.5,
                  color: () => colors.text,
                  strokeWidth: 2,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            )}
            {volumeChartData == null && (
              <CustomText style={styles.emptyChartText}>
                NO DATA YET!
              </CustomText>
            )}
          </View>

          <View
            style={[
              styles.chartContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <CustomText style={styles.chartTitle}>Total Reps</CustomText>
            {repsChartData != null && (
              <LineChart
                data={repsChartData}
                width={screenWidth * chartWidthRatio}
                height={chartHeight}
                fromZero={true}
                withVerticalLabels={false}
                onDataPointClick={(data) => handleClickOnDataPoint(data)}
                decorator={() => repsDec()}
                formatXLabel={(xValue) => {
                  return (
                    xValue.slice(2, 4) +
                    '/' +
                    xValue.slice(4, 6) +
                    '/' +
                    xValue.slice(6, 8)
                  );
                }}
                formatYLabel={(yValue) => {
                  return yValue.split('.')[0];
                }}
                chartConfig={{
                  backgroundGradientFrom: colors.background,
                  backgroundGradientFromOpacity: 0.5,
                  backgroundGradientTo: colors.background,
                  backgroundGradientToOpacity: 0.5,
                  color: () => colors.text,
                  strokeWidth: 2,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            )}
            {repsChartData == null && (
              <CustomText style={styles.emptyChartText}>
                NO DATA YET!
              </CustomText>
            )}
          </View>

          <View
            style={[
              styles.chartContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <CustomText style={styles.chartTitle}>Sets</CustomText>
            {setsChartData != null && (
              <LineChart
                data={setsChartData}
                width={screenWidth * chartWidthRatio}
                height={chartHeight}
                fromZero={true}
                withVerticalLabels={false}
                onDataPointClick={(data) => handleClickOnDataPoint(data)}
                decorator={() => setsDec()}
                formatXLabel={(xValue) => {
                  return (
                    xValue.slice(2, 4) +
                    '/' +
                    xValue.slice(4, 6) +
                    '/' +
                    xValue.slice(6, 8)
                  );
                }}
                formatYLabel={(yValue) => {
                  return yValue.split('.')[0];
                }}
                chartConfig={{
                  backgroundGradientFrom: colors.background,
                  backgroundGradientFromOpacity: 0.5,
                  backgroundGradientTo: colors.background,
                  backgroundGradientToOpacity: 0.5,
                  color: () => colors.text,
                  strokeWidth: 2,
                  useShadowColorFromDataset: false, // optional
                }}
              />
            )}
            {setsChartData == null && (
              <CustomText style={styles.emptyChartText}>
                NO DATA YET!
              </CustomText>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  factRow: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingLeft: 3,
    paddingRight: 3,
    paddingBottom: 3,
  },
  factText: {
    fontSize: 22,
    height: '100%',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  factValueText: {
    fontSize: 22,
    textAlign: 'right',
    textAlignVertical: 'center',
  },
  targetContainer: {},
  targetColumn: {},
  statContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    marginBottom: '3%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 1,
    marginTop: 1,
    marginBottom: 1,
    paddingLeft: 3,
    paddingRight: 3,
  },
  statRowText: { fontSize: 22 },
  imageContainer: { borderWidth: 2, margin: 2, flex: 4, height: 100 },
  exerciseImage: {
    width: '25%',
    resizeMode: 'contain',
    height: 50,
  },
  scrollContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 1320,
  },
  chartTitle: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 18,
    width: '100%',
    margin: 6,
    marginBottom: 15,
    paddingLeft: 6,
  },
  chartContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: 314,
    width: '100%',
    borderWidth: 2,
    borderColor: 'gray',
    marginBottom: 16,
  },
  emptyChartText: {
    fontSize: 30,
    marginTop: 'auto',
    marginBottom: 'auto',
    alignSelf: 'center',
  },
});
