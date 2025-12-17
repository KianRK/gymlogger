import {
  FlatList,
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useEffect } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import CustomText from '../CustomText';
import useThemeColors from '@/hooks/UseThemeColors';

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
  iconSize = 25,
  data,
  activeFilters,
  setActiveFilter,
  dropDownVisible,
  visibilitySetter,
  registrationHandler,
}: Props) {
  const colors = useThemeColors();
  const { t } = useTranslation();

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
        <CustomText style={[styles.optionButtonLabel, labelStyle]}>
          {label}
        </CustomText>
      )}
      <View style={[styles.optionButtonContainer, buttonStyle]}>
        <Pressable
          style={styles.optionButton}
          onPress={() => {
            registrationHandler();
            visibilitySetter(!dropDownVisible);
          }}
        >
          <CustomText>{buttonText}</CustomText>
          <MaterialCommunityIcons
            name="arrow-down-right"
            size={iconSize}
            color={colors.icon}
          />
        </Pressable>
      </View>
      {dropDownVisible && (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            maxHeight: 80,
            flexWrap: 'nowrap',
            top: 30,
            zIndex: 999,
            backgroundColor: colors.background,
            overflow: 'visible',
          }}
        >
          <FlatList
            data={filteredData()}
            contentContainerStyle={{ alignItems: 'stretch', flexGrow: 1 }}
            renderItem={({ item }) => (
              <Pressable
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignSelf: 'stretch',
                  minWidth: '100%',
                }}
                onPress={() => updateActiveFilters(item)}
              >
                <CustomText
                  numberOfLines={1}
                  style={{
                    alignSelf: 'center',
                    textAlign: 'center',
                    flexWrap: 'nowrap',
                    flexShrink: 0,
                    flexGrow: 0,
                    minWidth: '100%',
                  }}
                >
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
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  optionButtonContainer: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 5,
  },
  optionButton: { alignItems: 'center', flexDirection: 'row' },
  optionButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
