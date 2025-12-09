import {
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { useTheme } from '@react-navigation/native';

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
};

export default function DeleteButton({
  label,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 35,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      {label && (
        <CustomText style={[styles.deleteButtonLabel, labelStyle]}>
          {label}
        </CustomText>
      )}
      <View
        style={[
          styles.deleteButtonContainer,
          {
            borderColor: colors.borderColor,
          },
          buttonStyle,
        ]}
      >
        <Pressable onPress={onPress}>
          <Ionicons name="trash-outline" size={iconSize} color={colors.icon} />
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
  deleteButtonContainer: {
    width: 30,
    height: 30,
    position: 'relative',
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  deleteButton: { alignItems: 'center' },
  deleteButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
