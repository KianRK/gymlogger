import { Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';

import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';

import { Measurements } from '@/constants/Interfaces';
import { metricsDict } from '@/constants/Constants';

type Props = {
  metric: keyof Measurements;
  units: string;
  currentTempMeasurements: Measurements;
  setTempMeasurements: (meas: Measurements) => void;
};

export default function MeasurementsRow({
  metric,
  units,
  currentTempMeasurements,
  setTempMeasurements,
}: Props) {
  const [value, setValue] = useState(currentTempMeasurements[metric]);
  const [unit, setUnit] = useState('');
  const metricName = metricsDict[metric];
  const lengthUnit = units === 'metric' ? 'cm' : 'in';
  const weightUnit = units === 'metric' ? 'kg' : 'lb';
  const textInputRef = useRef<TextInput | null>(null);

  const updateMetric = (text: string) => {
    setTempMeasurements({
      ...currentTempMeasurements,
      [metric]: text,
    });
  };

  useEffect(() => {}, [currentTempMeasurements]);

  useEffect(() => {
    function convertValue() {
      if (value) {
        if (unit === 'lb') {
          setValue(value * 2.20462);
        } else if (unit === 'in') {
          setValue(value * 0.393701);
        }
      }
    }
    convertValue();
  }, [unit]);

  useEffect(() => {
    function defineUnit() {
      if (metric === 'Weight') {
        setUnit(weightUnit);
      } else if (metric === 'BodyFat') {
        setUnit('%');
      } else {
        setUnit(lengthUnit);
      }
    }
    defineUnit();
  }, []);

  const handleFocus = () => {
    if (textInputRef.current) {
      setTimeout(() => textInputRef.current?.focus(), 50);
    }
  };

  return (
    <Pressable onPress={handleFocus}>
      <View style={styles.rowContainer}>
        <CustomText style={styles.settingsText}>
          {metricName} ({unit})
        </CustomText>
        <CustomTextInput
          ref={textInputRef}
          style={[styles.settingsText, { textAlign: 'right' }]}
          onChangeText={(text) => updateMetric(text)}
          returnKeyType="done"
          keyboardType="number-pad"
          placeholder="no data"
        >
          {value}
        </CustomTextInput>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    borderBottomWidth: 1,
    marginBottom: Platform.OS === 'ios' ? '3%' : undefined,
  },
  settingsText: {
    fontSize: 18,
    textAlignVertical: 'bottom',
    color: '#222222',
  },
});
