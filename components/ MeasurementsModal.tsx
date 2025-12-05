import {
  Modal,
  ModalProps,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useSettings } from '@/src/providers/SettingsProvider';
import MeasurementsRow from './MeasurementRow';
import { Measurements } from '@/constants/Interfaces';
import { useState } from 'react';
import CustomText from './CustomText';

interface CustomModalProps extends ModalProps {
  viewStyle?: ViewStyle;
  setMeasureModalVisible: (vis: boolean) => void;
}

export default function MeasurementsModal({
  viewStyle,
  setMeasureModalVisible,
  ...otherProps
}: CustomModalProps) {
  const { settings, updateSetting } = useSettings();
  const [tempMeasurements, setTempMeasurements] = useState<Measurements>(
    settings.measurements
  );

  return (
    <Modal {...otherProps}>
      <View
        style={[
          {
            height: '75%',
            justifyContent: 'center',
            alignItems: 'center',
          },
          viewStyle,
        ]}
      >
        {Object.keys(settings.measurements).map((key, index) => (
          <MeasurementsRow
            key={index}
            metric={key as keyof Measurements}
            units={settings.units}
            currentTempMeasurements={tempMeasurements}
            setTempMeasurements={setTempMeasurements}
          />
        ))}
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setTempMeasurements({ ...settings.measurements });
              setMeasureModalVisible(false);
            }}
          >
            <CustomText style={styles.buttonText}>Cancel</CustomText>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => {
              updateSetting('measurements', tempMeasurements);
              setMeasureModalVisible(false);
            }}
          >
            <CustomText style={styles.buttonText}>Save</CustomText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: '5%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: 108,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 24,
    paddingTop: 6,
    paddingBottom: 8,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Outfit-SemiBold',
    textAlign: 'center',
    textAlignVertical: 'top',
  },
});
