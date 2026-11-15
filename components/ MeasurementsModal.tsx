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
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

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

  const colors = useThemeColors();

  return (
    <Modal {...otherProps}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface },
            shadow(colors.shadow, 3),
            viewStyle,
          ]}
        >
          <CustomText style={styles.title}>
            {t('profile.measurements')}
          </CustomText>
          <ScrollView
            style={styles.scrollView}
            keyboardShouldPersistTaps="handled"
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
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, { backgroundColor: colors.surfaceAlt }]}
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
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => {
                updateSetting('measurements', tempMeasurements);
                setMeasureModalVisible(false);
              }}
            >
              <CustomText
                style={[styles.buttonText, { color: colors.onPrimary }]}
              >
                {t('buttonLabels.save')}
              </CustomText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: FontSize.heading,
    marginBottom: Spacing.md,
  },
  scrollView: { flexGrow: 0 },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontFamily: Fonts.semiBold, fontSize: FontSize.body },
});
