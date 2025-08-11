import { useColorScheme, Modal, View } from 'react-native';
import { useState } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import ExerciseCard from '@/components/ExerciseCard';

import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import CalendarButton from '@/components/CalendarButton';
import AddButton from '@/components/AddButton';

import { Colors } from '@/constants/Colors';

export default function Workouts() {
  const colorScheme = useColorScheme() ?? 'light';
  const { date } = useLocalSearchParams<{ date: string }>();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          backgroundColor: colors.background,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CalendarButton date={date} />
        <Modal
          style={{ alignSelf: 'center' }}
          visible={modalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ExerciseCard name="Exercise" />
          </View>
        </Modal>
        <AddButton
          label="Add Exercise"
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
