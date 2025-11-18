import {
  FlatList,
  Pressable,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import CustomText from '../CustomText';
import { useState } from 'react';

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
  const filteredData = () => {
    let filtered = data.filter((item) => {
      return !activeFilters.includes(item);
    });
    if (activeFilters.length == data.length) {
      visibilitySetter(false);
    }
    return filtered;
  };

  const updateActiveFilters = (newFilter: string) => {
    setActiveFilter([...activeFilters, newFilter].sort());
  };

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
            color={'black'}
          />
        </Pressable>
      </View>
      {dropDownVisible && (
        <View
          style={{
            position: 'absolute',
            width: '90%',
            justifyContent: 'center',
            maxHeight: 80,
            top: 30,
            zIndex: 999,
            backgroundColor: '#f9f9f9ee',
          }}
        >
          <FlatList
            data={filteredData()}
            renderItem={({ item }) => (
              <Pressable onPress={() => updateActiveFilters(item)}>
                <CustomText style={{ textAlign: 'center' }}>{item}</CustomText>
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
    backgroundColor: 'white',
  },

  optionButton: { alignItems: 'center', flexDirection: 'row' },
  optionButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
