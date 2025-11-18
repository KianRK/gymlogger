import { View, Pressable, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import CustomText from './CustomText';

type Props = {
  name: string;
  is_favorite: boolean;
  region?: string;
  primary?: string[] | undefined;
  secondary?: string[] | undefined;
  onPressInfo?: () => void;
  onPressFav?: () => void;
};

export default function ExerciseCard({
  name,
  is_favorite = false,
  region,
  primary,
  secondary,
  onPressInfo,
  onPressFav,
}: Props) {
  const colorOne = '#b3cbe4ff';
  const colorOneAlpha = '#b3cbe490';
  const colorTwo = '#ddeaf6ff';
  const primaryText = primary ? primary[0] : '';
  const secondaryText = secondary ? secondary[0] : '';
  const [fontSize, setFontSize] = useState<number>(18);

  useEffect(() => {
    function adjustFontSize() {
      if (name.length > 21) {
        let adjustedFontSize = 18 - (name.length - 20) / 2;

        if (adjustedFontSize <= 10) {
          setFontSize(10);
        } else {
          setFontSize(adjustedFontSize);
        }
      }
    }
    adjustFontSize();
  }, []);

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
      <View style={styles.exerciseCardContainer}>
        <Pressable style={styles.favoritesButton} onPress={onPressFav}>
          <MaterialCommunityIcons
            name={is_favorite ? 'heart' : 'heart-outline'}
            size={30}
            color="black"
          />
        </Pressable>
        <View style={styles.mainTextContainer}>
          <CustomText style={[styles.exerciseName, { fontSize: fontSize }]}>
            {name}
          </CustomText>
          <CustomText style={styles.regionText}>{region}</CustomText>
        </View>
        <Pressable style={styles.infoButton} onPress={onPressInfo}>
          <MaterialCommunityIcons name="information" size={30} color="black" />
        </Pressable>
        <View style={styles.targetsContainer}>
          <CustomText style={styles.primaryTarget}>{primaryText}</CustomText>
          <CustomText style={styles.secondaryTarget}>
            {secondaryText}
          </CustomText>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  exerciseCardContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 54,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  favoritesButton: {},
  mainTextContainer: {
    width: '55%',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
  },
  exerciseName: {
    width: '100%',
    textAlign: 'left',
    height: 25,
    color: 'black',
    fontSize: 18,
  },
  regionText: { height: 12, textAlign: 'center', color: 'black', fontSize: 12 },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  targetsContainer: { width: '20%' },
  primaryTarget: { textAlign: 'center', color: 'black', fontSize: 11 },
  secondaryTarget: { textAlign: 'center', color: 'black', fontSize: 11 },
});
