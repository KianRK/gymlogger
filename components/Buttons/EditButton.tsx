import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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

export default function EditButton({
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
        variant="soft"
        style={buttonStyle}
        accessibilityLabel={label ?? 'Edit'}
      >
        <MaterialCommunityIcons
          name="pencil-outline"
          size={Math.min(iconSize, 24)}
          color={colors.icon}
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
