import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import CustomText from '../CustomText';

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
  selected: boolean;
};

export default function FavoritesButton({
  label,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 35,
  selected,
}: Props) {
  return (
    <View style={[styles.componentContainer, componentStyle]}>
      {label && (
        <CustomText style={[styles.favButtonLabel, labelStyle]}>
          {label}
        </CustomText>
      )}
      <View style={[styles.favButtonContainer, buttonStyle]}>
        <Pressable style={styles.favButton} onPress={onPress}>
          <MaterialCommunityIcons
            name={selected ? 'heart' : 'heart-outline'}
            size={iconSize}
            color={'black'}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
  },
  favButtonContainer: {
    width: 30,
    height: 30,
    position: 'relative',
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },

  favButton: { alignItems: 'center' },
  favButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
