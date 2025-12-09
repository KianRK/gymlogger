import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import useThemeColors from '@/hooks/UseThemeColors';

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
};

export default function MenuButton({
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
        <Text style={[styles.menuButtonLabel, labelStyle]}>{label}</Text>
      )}
      <View
        style={[
          styles.menuButtonContainer,
          {
            backgroundColor: colors.background,
            borderColor: colors.borderColor,
          },
          buttonStyle,
        ]}
      >
        <Pressable style={styles.menuButton} onPress={onPress}>
          <Ionicons name="menu-outline" size={iconSize} color={colors.icon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    alignSelf: 'center',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButtonContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },

  menuButton: { alignSelf: 'center' },
  menuButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
