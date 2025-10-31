import { Pressable, View, StyleSheet, Image } from 'react-native';

import { useRouter } from 'expo-router';

export default function ProfileButton() {
  const router = useRouter();

  const goToProfile = () => {
    router.push({
      pathname: '/profile',
    });
  };

  return (
    <View style={styles.componentContainer}>
      <Pressable style={styles.profileButton} onPress={goToProfile}>
        <Image
          source={require('@/assets/images/comic_style_img.png')}
          style={styles.profileImage}
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
