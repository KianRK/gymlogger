import { Dimensions, Text, Image, StyleSheet, View } from 'react-native';
import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { LineChart } from 'react-native-chart-kit';

import { db } from '@/src/database';
import { Exercise, WorkoutExercise } from '@/src/database/db_interfaces';

import { DateDictionary } from '@/constants/DataTypes';

export default function ExerciseId() {
  const screenWidth = Dimensions.get('window').width;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [exercise, setExercise] = useState<Exercise>();
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>(
    []
  );

  const dateDict: DateDictionary = {};
  const [maxWeight, setMaxWeight] = useState<number>(0);
  const [volumeChartData, setVolumeChartData] = useState<any>(null);
  const [dailyMaxChartData, setDailyMaxChartData] = useState<any>(null);
  const [setsChartData, setSetsChartData] = useState<any>(null);
  const [repsChartData, setRepsChartData] = useState<any>(null);

  const [dateLabels, setDateLabels] = useState<string[]>([]);
  const [volumeData, setVolumeData] = useState<number[]>([]);
  const [dailyMaxData, setDailyMaxData] = useState<number[]>([]);
  const [setsData, setSetsData] = useState<number[]>([]);
  const [repsData, setRepsData] = useState<number[]>([]);

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
          'SELECT * FROM workout_exercises WHERE name = ?',
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
        'SELECT SUM(weight) AS vol FROM sets WHERE exercise_id = ?',
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
    let dl = Object.keys(dDict);
    let vd = Object.values(dDict).map((data) => data.volume);
    let dmd = Object.values(dDict).map((data) => data.dailyMax);
    let sd = Object.values(dDict).map((data) => data.sets);
    let rd = Object.values(dDict).map((data) => data.reps);

    if (vd.length > 0) {
      setVolumeChartData({
        labels: dl,
        datasets: [
          {
            data: vd,
            strokeWidth: 2,
          },
        ],
      });
    }

    if (dmd.length > 0) {
      setDailyMaxChartData({
        labels: dl,
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
        labels: dl,
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
        labels: dl,
        datasets: [
          {
            data: rd,
            strokeWidth: 2,
          },
        ],
      });
    }
  }

  useEffect(() => {
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
  }, []);

  return (
    <View>
      <View
        style={{
          borderWidth: 2,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'black', fontSize: 32 }}>{exercise?.name}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/latpull_target_muscles.png')}
            style={styles.exerciseImage}
          />
        </View>
        {dailyMaxChartData != null && (
          <View style={styles.chartContainer}>
            <LineChart
              data={dailyMaxChartData}
              width={screenWidth * 0.75}
              height={196}
              chartConfig={{
                backgroundGradientFrom: '#1E2923',
                backgroundGradientFromOpacity: 0.5,
                backgroundGradientTo: '#08130D',
                backgroundGradientToOpacity: 0.5,
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                strokeWidth: 2,
                useShadowColorFromDataset: false, // optional
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 12 },
  imageContainer: { borderWidth: 2, margin: 2, flex: 4 },
  exerciseImage: {
    width: '100%',
    resizeMode: 'contain',
    height: 196,
  },
  chartContainer: { borderWidth: 2, margin: 2 },
});
