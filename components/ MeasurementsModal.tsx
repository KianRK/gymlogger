import {
  Modal,
  ModalProps,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal {...otherProps}>
      <View style={[styles.mainContainer, viewStyle]}>
        <CustomText style={styles.title}>
          {t('profile.measurements')}
        </CustomText>
        <View style={styles.scrollViewContainer}>
          <ScrollView
            fadingEdgeLength={{ start: 0, end: 20 }}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
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
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.button}
            onPress={() => {
              setTempMeasurements({ ...settings.measurements });
              setMeasureModalVisible(false);
            }}
          >
            <CustomText style={styles.buttonText}>
              {t('buttonLabels.cancel')}
            </CustomText>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => {
              updateSetting('measurements', tempMeasurements);
              setMeasureModalVisible(false);
            }}
          >
            <CustomText style={styles.buttonText}>
              {t('buttonLabels.save')}
            </CustomText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#222222',
    marginTop: '8%',
    marginBottom: '10%',
  },
  scrollViewContainer: { height: '70%', width: '100%' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 'auto',
    marginBottom: '8%',
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
    color: '#222222',
    textAlign: 'center',
    textAlignVertical: 'top',
  },
});
