import {
  Pressable,
  View,
  StyleSheet,
  Image,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import { useRouter } from 'expo-router';

import useThemeColors from '@/hooks/UseThemeColors';
import { Radius, Spacing } from '@/constants/Theme';

type Props = {
  componentStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  onPress?: () => void;
};

export default function ProfileButton({
  componentStyle,
  imageStyle,
  onPress,
}: Props) {
  const router = useRouter();
  const colors = useThemeColors();

  const goToProfile = () => {
    router.push({
      pathname: '/profile',
    });
  };

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profile"
        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        onPress={onPress ? () => onPress() : goToProfile}
      >
        <Image
          source={require('@/assets/images/comic_style_img.png')}
          style={[
            styles.profileImage,
            { borderColor: colors.border },
            imageStyle,
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.xs,
    marginRight: Spacing.lg,
  },
  profileImage: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    borderWidth: 1,
    resizeMode: 'cover',
  },
});
