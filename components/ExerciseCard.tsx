import {
  ImageSourcePropType,
  View,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import CustomText from './CustomText';

type Props = {
  imgSource: ImageSourcePropType;
  name: string;
  onPress?: () => void;
};

export default function ExerciseCard({ imgSource, name, onPress }: Props) {
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';

  return (
    <LinearGradient
      start={{ x: 0.375, y: 0.375 }}
      end={{ x: 0.75, y: 0.75 }}
      colors={[colorOneAlpha, colorTwo, colorOne]}
      style={{
        borderRadius: 8,
        width: '95%',
        alignSelf: 'center',
        marginTop: 3,
        marginBottom: 3,
      }}
    >
      <View style={styles.workoutButtonContainer}>
        <Pressable style={styles.workoutButton} onPress={onPress}>
          <CustomText style={styles.workoutButtonLabel}>{name}</CustomText>
          <Image source={imgSource} style={styles.workoutButtonImage}></Image>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  workoutButtonContainer: {
    width: '100%',
    height: 54,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
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
    fontSize: 18,
  },
  workoutButtonImage: {
    flex: 1,
    resizeMode: 'contain',
    height: 72,
  },
});
