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
  buttonText: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
};

export default function FilterOptionButton({
  label,
  buttonText,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 25,
}: Props) {
  return (
    <View style={[styles.componentContainer, componentStyle]}>
      {label && (
        <CustomText style={[styles.optionButtonLabel, labelStyle]}>
          {label}
        </CustomText>
      )}
      <View style={[styles.optionButtonContainer, buttonStyle]}>
        <Pressable style={styles.optionButton} onPress={onPress}>
          <CustomText>{buttonText}</CustomText>
          <MaterialCommunityIcons
            name="arrow-down-right"
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
  optionButtonContainer: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
  },

  optionButton: { alignItems: 'center', flexDirection: 'row' },
  optionButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
