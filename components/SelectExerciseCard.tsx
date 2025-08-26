import { TextInput, View, StyleSheet } from 'react-native';
import ConfirmButton from './ConfirmButton';

type Props = {
  onConfirm: () => void;
  updateExerciseName: (text: string) => void;
};

export default function SelectExerciseCard({
  onConfirm,
  updateExerciseName,
}: Props) {
  return (
    <View style={styles.selectExerciseCardContainer}>
      <TextInput
        style={styles.setText}
        onChangeText={(text) => updateExerciseName(text)}
        placeholder="Enter Exercise"
      ></TextInput>
      <ConfirmButton onPress={onConfirm} />
    </View>
  );
}

const styles = StyleSheet.create({
  selectExerciseCardContainer: {
    width: '75%',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setText: {
    borderWidth: 1,
    width: '75%',
    fontSize: 26,
    textAlign: 'center',
  },
});
