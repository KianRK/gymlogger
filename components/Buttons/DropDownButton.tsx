import {
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import useThemeColors from '@/hooks/UseThemeColors';
import CustomText from '../CustomText';
import { useSettings } from '@/src/providers/SettingsProvider';
import { Settings } from '@/src/Interfaces/settings_interfaces';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

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
    <View style={[styles.container, componentStyle]}>
      <Pressable
        style={styles.trigger}
        hitSlop={8}
        onPress={() => {
          registrationHandler();
          visibilitySetter(!visible);
        }}
      >
        <CustomText
          style={[styles.value, { color: colors.textMuted }, textStyle]}
          numberOfLines={1}
        >
          {t('settings.' + settingName + '.' + currentSelection)}
        </CustomText>
        <Ionicons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textMuted}
        />
      </Pressable>
      {visible && (
        <View
          style={[
            styles.options,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 2),
            optionsStyle,
          ]}
        >
          {options.map((item, index) => {
            const selected = item === currentSelection;
            return (
              <Pressable
                key={item}
                style={({ pressed }) => [
                  styles.option,
                  index > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                  pressed && { backgroundColor: colors.surfaceAlt },
                ]}
                onPress={() => {
                  selectionSetter(item);
                  visibilitySetter(!visible);
                  updateSetting(settingName, item);
                }}
              >
                <CustomText
                  style={[
                    styles.optionText,
                    selected && {
                      color: colors.primary,
                      fontFamily: Fonts.semiBold,
                    },
                  ]}
                >
                  {t('settings.' + settingName + '.' + item)}
                </CustomText>
                {selected && (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  value: { fontSize: FontSize.body },
  options: {
    position: 'absolute',
    top: 28,
    right: 0,
    minWidth: 160,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    zIndex: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  optionText: { fontSize: FontSize.body },
});
