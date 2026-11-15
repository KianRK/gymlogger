import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CustomText from './CustomText';
import CustomTextInput from './CustomTextInput';

import { Measurements } from '@/constants/Interfaces';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/Theme';

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
  const { t } = useTranslation();
  const colors = useThemeColors();
  const metricName = t('measurements.' + metric);
  const lengthUnit = units === 'metric' ? 'cm' : 'in';
  const weightUnit = units === 'metric' ? 'kg' : 'lb';
  const textInputRef = useRef<TextInput | null>(null);

  const updateMetric = (text: string) => {
    if (units != 'metric' && metric != 'Weight') {
      let convertedValue =
        unit == 'in' ? parseFloat(text) / 0.393701 : parseFloat(text) / 2.20462;
      setTempMeasurements({
        ...currentTempMeasurements,
        [metric]: convertedValue,
      });
    } else {
      setTempMeasurements({
        ...currentTempMeasurements,
        [metric]: text,
      });
    }
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
      <View style={[styles.rowContainer, { borderBottomColor: colors.border }]}>
        <CustomText style={styles.label}>{metricName}</CustomText>
        <View
          style={[styles.inputWrapper, { backgroundColor: colors.surfaceAlt }]}
        >
          <CustomTextInput
            ref={textInputRef}
            style={styles.input}
            onChangeText={(text) => updateMetric(text)}
            returnKeyType="done"
            keyboardType="number-pad"
            placeholder={t('measurements.nodata')}
            placeholderTextColor={colors.textMuted}
          >
            {value && Math.round(value * 100) / 100}
          </CustomTextInput>
          <CustomText style={[styles.unit, { color: colors.textMuted }]}>
            {unit}
          </CustomText>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontFamily: Fonts.medium, fontSize: FontSize.body },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    minWidth: 110,
    height: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.sm,
  },
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: FontSize.body,
    paddingVertical: 0,
  },
  unit: { fontSize: FontSize.small },
});
