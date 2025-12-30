import { Pressable, View, ViewStyle, StyleSheet } from 'react-native';

import { RelativePathString, useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import useThemeColors from '@/hooks/UseThemeColors';

type Props = {
  componentStyle?: ViewStyle;
  sourceRoute?: RelativePathString;
};

export default function BackButton({ componentStyle, sourceRoute }: Props) {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <Pressable
        style={styles.backButton}
        onPress={() => {
          sourceRoute ? router.push({ pathname: sourceRoute }) : router.back();
        }}
      >
        <MaterialCommunityIcons
          name="arrow-left"
          size={30}
          color={colors.icon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    width: 45,
    height: 45,
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  backButton: { alignItems: 'center' },
});
