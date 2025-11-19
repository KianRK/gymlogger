import { Pressable, View, ViewStyle, StyleSheet } from 'react-native';

import { useRouter } from 'expo-router';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = {
  componentStyle?: ViewStyle;
};

export default function BackButton({ componentStyle }: Props) {
  const router = useRouter();

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <MaterialCommunityIcons name="arrow-left" size={30} color={'#222222'} />
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
