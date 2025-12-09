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

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
};

export default function ConfirmButton({
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
        <CustomText style={[styles.confirmButtonLabel, labelStyle]}>
          {label}
        </CustomText>
      )}
      <View
        style={[
          styles.confirmButtonContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.borderColor,
          },
          buttonStyle,
        ]}
      >
        <Pressable style={styles.confirmButton} onPress={onPress}>
          <Ionicons
            name="checkmark-outline"
            size={iconSize}
            color={colors.icon}
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
  confirmButtonContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  confirmButton: {
    alignItems: 'center',
  },
  confirmButtonLabel: {
    width: 140,
    textAlign: 'center',
    fontSize: 18,
  },
});
