import {
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '../CustomText';
import { useSettings } from '@/src/providers/SettingsProvider';
import { Settings } from '@/src/Interfaces/settings_interfaces';

type Props = {
  componentStyle?: ViewStyle;
  textStyle?: TextStyle;
  optionsStyle?: ViewStyle;
  settingName: keyof Settings;
  visible: boolean;
  currentSelection: string;
  options: string[];
  registrationHandler: () => void;
  selectionSetter: (selection: string) => void;
  visibilitySetter: (vis: boolean) => void;
};

export default function DropDownButton({
  componentStyle,
  textStyle,
  optionsStyle,
  settingName,
  visible,
  currentSelection,
  options,
  registrationHandler,
  selectionSetter,
  visibilitySetter,
}: Props) {
  const { t } = useTranslation();
  const { updateSetting } = useSettings();
  const colors = useThemeColors();

  return (
    <View style={[styles.componentStyleDefault, componentStyle]}>
      {!visible && (
        <Pressable
          onPress={() => {
            registrationHandler();
            visibilitySetter(!visible);
          }}
        >
          <CustomText style={[styles.textStyleDefault, textStyle]}>
            {t('settings.' + settingName + '.' + currentSelection)}
          </CustomText>
        </Pressable>
      )}
      {visible && (
        <View
          style={[
            styles.optionsStyleDefault,
            { backgroundColor: colors.total },
            optionsStyle,
          ]}
        >
          {options.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => {
                selectionSetter(item);
                visibilitySetter(!visible);
                updateSetting(settingName, item);
              }}
            >
              <CustomText style={[styles.textStyleDefault, textStyle]}>
                {t('settings.' + settingName + '.' + item)}
              </CustomText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  componentStyleDefault: {
    width: '35%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  textStyleDefault: { fontSize: 18, textAlign: 'right' },
  optionsStyleDefault: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    borderRadius: 4,
    padding: 2,
    top: 0,
    zIndex: 10,
  },
});
