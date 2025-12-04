import {
  Pressable,
  View,
  StyleSheet,
  Image,
  ImageStyle,
  ViewStyle,
} from 'react-native';

import { useRouter } from 'expo-router';

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

  const goToProfile = () => {
    router.push({
      pathname: '/profile',
    });
  };

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <Pressable
        style={styles.profileButton}
        onPress={onPress ? () => onPress() : goToProfile}
      >
        <Image
          source={require('@/assets/images/comic_style_img.png')}
          style={[styles.profileImage, imageStyle]}
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
    alignSelf: 'center',
    marginRight: 10,
  },
  profileButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 23,
    resizeMode: 'cover',
  },
});
