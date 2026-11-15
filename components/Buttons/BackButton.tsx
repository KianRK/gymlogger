import { View, ViewStyle, StyleSheet } from 'react-native';
import { RelativePathString, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import IconButton from '../IconButton';
import useThemeColors from '@/hooks/UseThemeColors';
import { Spacing } from '@/constants/Theme';

type Props = {
  componentStyle?: ViewStyle;
  sourceRoute?: RelativePathString;
};

export default function BackButton({ componentStyle, sourceRoute }: Props) {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <IconButton
        variant="soft"
        accessibilityLabel="Back"
        onPress={() => {
          sourceRoute ? router.push({ pathname: sourceRoute }) : router.back();
        }}
      >
        <Ionicons name="chevron-back" size={22} color={colors.icon} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: { marginLeft: Spacing.lg },
});
