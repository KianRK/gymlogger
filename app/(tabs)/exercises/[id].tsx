import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RelativePathString, useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import useThemeColors from '@/hooks/UseThemeColors';
import { useSettings } from '@/src/providers/SettingsProvider';
import { db } from '@/src/database';
import { Exercise, WorkoutExercise } from '@/src/Interfaces/db_interfaces';

import { DateDictionary } from '@/constants/DataTypes';
import CustomText from '@/components/CustomText';
import BackButton from '@/components/Buttons/BackButton';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';
import { Rect, Text as TextSVG, Svg } from 'react-native-svg';

export default function ExerciseId() {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const { settings } = useSettings();
  const screenWidth = Dimensions.get('window').width;
  const { id, source } = useLocalSearchParams<{
    id: string;
    source: RelativePathString;
  }>();
  const [exercise, setExercise] = useState<Exercise>();

  const dateDict: DateDictionary = {};
  const [oneRM, setOneRM] = useState<any>();
  const [oneRMReps, setOneRMReps] = useState(0);
  const [oneRMWeight, setOneRMWeight] = useState(0);
  const [dataLabels, setDataLabels] = useState<string[]>([]);
  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [maxVolume, setMaxVolume] = useState<number>(0);
  const [weightUnit, setWeightUnit] = useState('');
  const [volumeChartData, setVolumeChartData] = useState<any>(null);
  const [dailyMaxChartData, setDailyMaxChartData] = useState<any>(null);
  const [setsChartData, setSetsChartData] = useState<any>(null);
  const [repsChartData, setRepsChartData] = useState<any>(null);

  const chartHeight = 220;

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

  function determineOneRMPercentage(reps: number) {
    let percentage;
    if (reps < 3) {
      percentage = reps == 1 ? 100 : 95;
    } else if (reps == 3 || reps == 4) {
      percentage = 90;
    } else if (reps <= 12) {
      percentage = 90 - (reps - 4) * 2.5;
    } else if (reps <= 15) {
      percentage = 70 - ((reps - 12) * 10) / 3;
    } else if (reps <= 25) {
      percentage = 60 - (reps - 15);
    } else if (reps <= 30) {
      percentage = 50 - (reps - 25) * 2;
    } else if (reps <= 40) {
      percentage = 40 - (reps - 30);
    } else {
      percentage = 30;
    }
    return percentage;
  }
  useEffect(() => {
    function calcOneRM() {
      let perc = determineOneRMPercentage(oneRMReps);
      let oRM =
        settings.units == 'metric'
          ? (oneRMWeight * 100) / perc
          : ((oneRMWeight * 100) / perc) * 2.20462;
      setOneRM(oRM);
    }
    calcOneRM();
  }, [oneRMWeight, oneRMReps, settings.units]);

  function dailyMaxDec() {
    return tooltipPos.dailyMaxVisible ? (
      <View>
        <Svg>
          <Rect
            x={tooltipPos.x - 30}
            y={tooltipPos.y + 15}
            width="70"
            height="40"
            rx="8"
            fill={colors.text}
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill={colors.background}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {Math.round(tooltipPos.value) + ' ' + weightUnit}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill={colors.background}
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
            rx="8"
            fill={colors.text}
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill={colors.background}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {Math.round(tooltipPos.value) + ' ' + weightUnit}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill={colors.background}
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
            rx="8"
            fill={colors.text}
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill={colors.background}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.value}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill={colors.background}
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
            rx="8"
            fill={colors.text}
          />
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 30}
            fill={colors.background}
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            {tooltipPos.value}
          </TextSVG>
          <TextSVG
            x={tooltipPos.x + 5}
            y={tooltipPos.y + 45}
            fill={colors.background}
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
    let rmReps = 0;
    let rmWeight = 0;
    let oneRMVol = 0;
    for (const row of workoutEx) {
      let volResult = db.getFirstSync<{
        vol: number;
      }>('SELECT SUM(reps * weight) AS vol FROM sets WHERE exercise_id = ?', [
        row.id,
      ]);
      let maxVolResult = db.getFirstSync<{ reps: number; weight: number }>(
        'SELECT reps, weight, MAX(reps*weight) FROM sets where exercise_id = ?',
        [row.id]
      );
      let volume = volResult?.vol ?? 0;
      if (maxVolResult && maxVolResult.reps * maxVolResult.weight > oneRMVol) {
        rmReps = maxVolResult.reps;
        rmWeight = maxVolResult.weight;
      }
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
    setOneRMReps(rmReps);
    setOneRMWeight(rmWeight);
    return dDict;
  }

  function createChartData(dDict: DateDictionary) {
    setDataLabels(Object.keys(dDict));
    let vd;
    let dmd;
    if (settings.units == 'metric') {
      vd = Object.values(dDict).map((data) => data.volume);
      dmd = Object.values(dDict).map((data) => data.dailyMax);
    } else {
      vd = Object.values(dDict).map((data) => data.volume * 2.20462);
      dmd = Object.values(dDict).map((data) => data.dailyMax * 2.20462);
    }
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
      settings.units == 'metric' ? setWeightUnit('kg') : setWeightUnit('lb');
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
    }, [settings.units])
  );

  const chartWidth = screenWidth - Spacing.lg * 2 - Spacing.md * 2;
  const primaryRgb = hexToRgb(colors.primary);
  const textRgb = hexToRgb(colors.textMuted);
  const chartConfig = {
    decimalPlaces: 0,
    backgroundGradientFrom: colors.surface,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: colors.surface,
    backgroundGradientToOpacity: 0,
    fillShadowGradientFrom: colors.primary,
    fillShadowGradientFromOpacity: 0.25,
    fillShadowGradientTo: colors.primary,
    fillShadowGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(${primaryRgb}, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(${textRgb}, ${opacity})`,
    strokeWidth: 2.5,
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: '4 6',
    },
    propsForDots: { r: '4', strokeWidth: '2', stroke: colors.surface },
    propsForLabels: { fontFamily: Fonts.regular, fontSize: 11 },
    useShadowColorFromDataset: false,
  };

  const stats = [
    { label: t('exercises.maxWeight'), value: Math.round(maxWeight) },
    { label: t('exercises.maxVol'), value: Math.round(maxVolume) },
    { label: '1RM', value: Math.round(oneRM) },
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.pageHeader}>
        <BackButton componentStyle={styles.backButton} sourceRoute={source} />
        <CustomText
          style={styles.pageTitle}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {exercise?.name && t(exercise.name)}
        </CustomText>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.factsCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 1),
          ]}
        >
          <View style={styles.factRow}>
            <CustomText style={[styles.factLabel, { color: colors.textMuted }]}>
              Region
            </CustomText>
            <View style={styles.chipRow}>
              {exercise && (
                <View
                  style={[styles.chip, { backgroundColor: colors.primarySoft }]}
                >
                  <CustomText style={[styles.chipText, { color: colors.primary }]}>
                    {t('targets.' + exercise.region)}
                  </CustomText>
                </View>
              )}
            </View>
          </View>
          {exercise?.primary_target && (
            <View style={styles.factRow}>
              <CustomText style={[styles.factLabel, { color: colors.textMuted }]}>
                {t('exercises.primary')}
              </CustomText>
              <View style={styles.chipRow}>
                {JSON.parse(exercise.primary_target).map((target: string) => (
                  <View
                    key={target}
                    style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}
                  >
                    <CustomText style={styles.chipText}>
                      {t('targets.' + target)}
                    </CustomText>
                  </View>
                ))}
              </View>
            </View>
          )}
          {exercise?.secondary_target && (
            <View style={styles.factRow}>
              <CustomText style={[styles.factLabel, { color: colors.textMuted }]}>
                {t('exercises.secondary')}
              </CustomText>
              <View style={styles.chipRow}>
                {JSON.parse(exercise.secondary_target).map((target: string) => (
                  <View
                    key={target}
                    style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}
                  >
                    <CustomText style={styles.chipText}>
                      {t('targets.' + target)}
                    </CustomText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.statRow}>
          {stats.map((stat) => (
            <View
              key={stat.label}
              style={[
                styles.statTile,
                { backgroundColor: colors.surface, borderColor: colors.border },
                shadow(colors.shadow, 1),
              ]}
            >
              <CustomText style={styles.statValue}>
                {isFinite(stat.value) ? stat.value : 0}
              </CustomText>
              <CustomText style={[styles.statUnit, { color: colors.textMuted }]}>
                {weightUnit}
              </CustomText>
              <CustomText
                style={[styles.statLabel, { color: colors.textMuted }]}
                numberOfLines={2}
              >
                {stat.label}
              </CustomText>
            </View>
          ))}
        </View>

        <View
          style={[
            styles.chartCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 1),
          ]}
        >
          <CustomText style={styles.chartTitle}>{t('exercises.maxWeight')}</CustomText>
          {dailyMaxChartData != null && (
            <LineChart
              data={dailyMaxChartData}
              width={chartWidth}
              height={chartHeight}
              fromZero={true}
              withVerticalLabels={false}
              withOuterLines={false}
              bezier
              onDataPointClick={(data) => handleClickOnDataPoint(data)}
              decorator={() => dailyMaxDec()}
              yAxisSuffix={' ' + weightUnit}
              formatXLabel={(xValue) =>
                xValue.slice(2, 4) +
                '/' +
                xValue.slice(4, 6) +
                '/' +
                xValue.slice(6, 8)
              }
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
          {dailyMaxChartData == null && (
            <View style={styles.emptyChart}>
              <CustomText style={[styles.emptyChartText, { color: colors.textMuted }]}>
                {t('exercises.noData')}
              </CustomText>
            </View>
          )}
        </View>
        <View
          style={[
            styles.chartCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 1),
          ]}
        >
          <CustomText style={styles.chartTitle}>{t('exercises.volume')}</CustomText>
          {volumeChartData != null && (
            <LineChart
              data={volumeChartData}
              width={chartWidth}
              height={chartHeight}
              fromZero={true}
              withVerticalLabels={false}
              withOuterLines={false}
              bezier
              onDataPointClick={(data) => handleClickOnDataPoint(data)}
              decorator={() => volumeDec()}
              formatXLabel={(xValue) =>
                xValue.slice(2, 4) +
                '/' +
                xValue.slice(4, 6) +
                '/' +
                xValue.slice(6, 8)
              }
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
          {volumeChartData == null && (
            <View style={styles.emptyChart}>
              <CustomText style={[styles.emptyChartText, { color: colors.textMuted }]}>
                {t('exercises.noData')}
              </CustomText>
            </View>
          )}
        </View>
        <View
          style={[
            styles.chartCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 1),
          ]}
        >
          <CustomText style={styles.chartTitle}>{t('exercises.totalReps')}</CustomText>
          {repsChartData != null && (
            <LineChart
              data={repsChartData}
              width={chartWidth}
              height={chartHeight}
              fromZero={true}
              withVerticalLabels={false}
              withOuterLines={false}
              bezier
              onDataPointClick={(data) => handleClickOnDataPoint(data)}
              decorator={() => repsDec()}
              formatXLabel={(xValue) =>
                xValue.slice(2, 4) +
                '/' +
                xValue.slice(4, 6) +
                '/' +
                xValue.slice(6, 8)
              }
              formatYLabel={(yValue) => yValue.split('.')[0]}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
          {repsChartData == null && (
            <View style={styles.emptyChart}>
              <CustomText style={[styles.emptyChartText, { color: colors.textMuted }]}>
                {t('exercises.noData')}
              </CustomText>
            </View>
          )}
        </View>
        <View
          style={[
            styles.chartCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 1),
          ]}
        >
          <CustomText style={styles.chartTitle}>Sets</CustomText>
          {setsChartData != null && (
            <LineChart
              data={setsChartData}
              width={chartWidth}
              height={chartHeight}
              fromZero={true}
              withVerticalLabels={false}
              withOuterLines={false}
              bezier
              onDataPointClick={(data) => handleClickOnDataPoint(data)}
              decorator={() => setsDec()}
              segments={Math.max(...setsChartData.datasets[0].data)}
              formatXLabel={(xValue) =>
                xValue.slice(2, 4) +
                '/' +
                xValue.slice(4, 6) +
                '/' +
                xValue.slice(6, 8)
              }
              formatYLabel={(yValue) => yValue.split('.')[0]}
              chartConfig={chartConfig}
              style={styles.chart}
            />
          )}
          {setsChartData == null && (
            <View style={styles.emptyChart}>
              <CustomText style={[styles.emptyChartText, { color: colors.textMuted }]}>
                {t('exercises.noData')}
              </CustomText>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function hexToRgb(hex: string) {
  const value = hex.replace('#', '').slice(0, 6);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  backButton: { marginLeft: Spacing.lg },
  pageTitle: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.heading,
    textAlign: 'center',
    marginHorizontal: Spacing.sm,
  },
  headerSpacer: { width: 40 + Spacing.lg },
  scrollView: { flex: 1, width: '100%' },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  factsCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  factRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  factLabel: { fontSize: FontSize.small, paddingTop: 4 },
  chipRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: Spacing.xs,
  },
  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
  },
  chipText: { fontFamily: Fonts.medium, fontSize: FontSize.caption },
  statRow: { flexDirection: 'row', gap: Spacing.sm },
  statTile: {
    flex: 1,
    alignItems: 'center',
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  statValue: { fontFamily: Fonts.bold, fontSize: FontSize.heading },
  statUnit: { fontSize: FontSize.caption },
  statLabel: {
    fontSize: FontSize.caption,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  chartCard: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    overflow: 'hidden',
  },
  chartTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.body,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  chart: { marginLeft: -Spacing.sm },
  emptyChart: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChartText: { fontSize: FontSize.body },
});
