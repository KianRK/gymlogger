import {
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';

import CustomText from '../CustomText';

type Props = {
  componentStyle?: ViewStyle;
  textStyle?: TextStyle;
  optionsStyle?: ViewStyle;
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
  visible,
  currentSelection,
  options,
  registrationHandler,
  selectionSetter,
  visibilitySetter,
}: Props) {
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
            {currentSelection}
          </CustomText>
        </Pressable>
      )}
      {visible && (
        <View style={[styles.optionsStyleDefault, optionsStyle]}>
          {options.map((item, index) => (
            <Pressable
              key={item}
              onPress={() => {
                selectionSetter(item);
                visibilitySetter(!visible);
              }}
            >
              <CustomText style={[styles.textStyleDefault, textStyle]}>
                {item}
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
    width: '30%',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  textStyleDefault: { fontSize: 18, textAlign: 'right' },
  optionsStyleDefault: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: '#f6f6f6',
    top: 0,
    zIndex: 10,
  },
});
