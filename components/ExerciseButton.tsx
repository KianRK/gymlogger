import {
  ImageSourcePropType,
  View,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { Image } from 'expo-image';

import CustomText from './CustomText';

type Props = {
  imgSource: ImageSourcePropType;
  name: string;
  onPress?: () => void;
};

export default function ExerciseButton({ imgSource, name, onPress }: Props) {
  return (
    <View style={styles.workoutButtonContainer}>
      <Pressable style={styles.workoutButton} onPress={onPress}>
        <CustomText style={styles.workoutButtonLabel}>{name}</CustomText>
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
    fontSize: 16,
  },
  workoutButtonImage: {
    flex: 1,
    resizeMode: 'contain',
    height: 72,
  },
});
