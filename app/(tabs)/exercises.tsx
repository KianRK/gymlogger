import { Text, View } from 'react-native';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/Colors';
import WorkoutButton from '@/components/WorkoutButton';

export default function ExercisesScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Exercise tab</Text>
      <WorkoutButton
        imgSource={require('@/assets/images/latpull_target_muscles.png')}
        name="latpull"
      />
    </View>
  );
}
