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

export default function MenuButton({
  label,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 22,
}: Props) {
  const colors = useThemeColors();

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <IconButton
        onPress={onPress}
        style={buttonStyle}
        accessibilityLabel={label ?? 'More options'}
      >
        <Ionicons
          name="ellipsis-horizontal"
          size={Math.min(iconSize, 24)}
          color={colors.textMuted}
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
