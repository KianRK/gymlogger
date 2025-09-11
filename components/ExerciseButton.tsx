import {
  ImageSourcePropType,
  View,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { Image } from 'expo-image';

type Props = {
  imgSource: ImageSourcePropType;
  name: string;
};

export default function ExerciseButton({ imgSource, name }: Props) {
  return (
    <View style={styles.workoutButtonContainer}>
      <Pressable style={styles.workoutButton}>
        <Text style={styles.workoutButtonLabel}>{name}</Text>
        <Image source={imgSource} style={styles.workoutButtonImage}></Image>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  workoutButtonContainer: {
    width: 256,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    justifyContent: 'center',
  },
  workoutButton: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  workoutButtonLabel: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
  },
  workoutButtonImage: {
    flex: 1,
    resizeMode: 'contain',
    height: 72,
  },
});
