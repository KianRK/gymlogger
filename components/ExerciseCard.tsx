import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

type Props = {
  name: string;
};

export default function ExerciseCard({ name }: Props) {
  const [sets, setSets] = useState([
    [1, 10, 30],
    [2, 9, 25],
  ]);

  // CHANGE KEY OF MAP TO UID WHEN READING FROM DB
  return (
    <View style={styles.exerciseCardContainer}>
      <Text style={styles.exerciseCardHeader}>{name}</Text>
      <View style={styles.setContainer}>
        <Text style={styles.setText}>Set</Text>
        <Text style={styles.setText}>Reps</Text>
        <Text style={styles.setText}>Weight</Text>
      </View>
      {sets.map((set, index) => (
        <View key={index} style={styles.setContainer}>
          <Text style={styles.setText}>{set[0]}</Text>
          <Text style={styles.setText}>{set[1]}</Text>
          <Text style={styles.setText}>{set[2]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCardContainer: {
    width: '75%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
  },
  setContainer: {
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseCardHeader: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 28,
  },
  setText: {
    fontSize: 26,
  },
});
