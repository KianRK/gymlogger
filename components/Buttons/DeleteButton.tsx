import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomText from '../CustomText';
import IconButton from '../IconButton';
import useThemeColors from '@/hooks/UseThemeColors';
import { FontSize, Spacing } from '@/constants/Theme';

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
  iconSize = 20,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <IconButton
        onPress={onPress}
        size={36}
        style={buttonStyle}
        accessibilityLabel={label ?? 'Delete'}
      >
        <Ionicons
          name="trash-outline"
          size={Math.min(iconSize, 22)}
          color={colors.danger}
        />
      </IconButton>
      {label && (
        <CustomText style={[styles.label, labelStyle]}>{label}</CustomText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: FontSize.small, marginTop: Spacing.xs },
});
