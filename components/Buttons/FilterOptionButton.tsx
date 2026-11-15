import {
  FlatList,
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import CustomText from '../CustomText';
import useThemeColors from '@/hooks/UseThemeColors';
import { Fonts, FontSize, Radius, Spacing, shadow } from '@/constants/Theme';

type Props = {
  label?: string;
  buttonText: string;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
  data: string[];
  activeFilters: string[];
  setActiveFilter: (active: string[]) => void;
  dropDownVisible: boolean;
  visibilitySetter: (vis: boolean) => void;
  registrationHandler: () => void;
};

export default function FilterOptionButton({
  label,
  buttonText,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 16,
  data,
  activeFilters,
  setActiveFilter,
  dropDownVisible,
  visibilitySetter,
  registrationHandler,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const hasActive = activeFilters.length > 0;

  const filteredData = () => {
    let filtered = data.filter((item) => {
      return !activeFilters.includes(item);
    });

    return filtered;
  };

  const updateActiveFilters = (newFilter: string) => {
    setActiveFilter([...activeFilters, newFilter].sort());
  };

  useEffect(() => {
    function setup() {
      if (activeFilters.length == data.length) {
        visibilitySetter(false);
      }
    }
    setup();
  }, []);

  return (
    <View style={[styles.componentContainer, componentStyle]}>
      {label && (
        <CustomText style={[styles.label, labelStyle]}>{label}</CustomText>
      )}
      <Pressable
        style={({ pressed }) => [
          styles.chip,
          {
            backgroundColor:
              hasActive || dropDownVisible
                ? colors.primarySoft
                : colors.surfaceAlt,
            borderColor: dropDownVisible ? colors.primary : 'transparent',
            opacity: pressed ? 0.8 : 1,
          },
          buttonStyle,
        ]}
        onPress={() => {
          registrationHandler();
          visibilitySetter(!dropDownVisible);
        }}
      >
        <CustomText
          style={[
            styles.chipText,
            { color: hasActive ? colors.primary : colors.text },
          ]}
        >
          {buttonText}
          {hasActive ? ` · ${activeFilters.length}` : ''}
        </CustomText>
        <Ionicons
          name={dropDownVisible ? 'chevron-up' : 'chevron-down'}
          size={iconSize}
          color={hasActive ? colors.primary : colors.textMuted}
        />
      </Pressable>
      {dropDownVisible && (
        <View
          style={[
            styles.dropDown,
            { backgroundColor: colors.surface, borderColor: colors.border },
            shadow(colors.shadow, 2),
          ]}
        >
          <FlatList
            data={filteredData()}
            keyExtractor={(item) => item}
            nestedScrollEnabled
            renderItem={({ item, index }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  index > 0 && {
                    borderTopWidth: StyleSheet.hairlineWidth,
                    borderTopColor: colors.border,
                  },
                  pressed && { backgroundColor: colors.surfaceAlt },
                ]}
                onPress={() => updateActiveFilters(item)}
              >
                <CustomText numberOfLines={1} style={styles.optionText}>
                  {t('targets.' + item)}
                </CustomText>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    position: 'relative',
    alignItems: 'flex-start',
  },
  label: { fontSize: FontSize.small, marginBottom: Spacing.xs },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipText: { fontFamily: Fonts.medium, fontSize: FontSize.small },
  dropDown: {
    position: 'absolute',
    top: 42,
    left: 0,
    minWidth: 160,
    maxHeight: 220,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    zIndex: 999,
  },
  option: {
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.md,
  },
  optionText: { fontSize: FontSize.small },
});
