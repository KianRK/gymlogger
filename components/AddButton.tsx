import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomText from './CustomText';

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
};

export default function AddButton({
  label,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 35,
}: Props) {
  return (
    <View style={[styles.componentContainer, componentStyle]}>
      <CustomText style={[styles.addButtonLabel, labelStyle]}>
        {label}
      </CustomText>
      <View style={[styles.addButtonContainer, buttonStyle]}>
        <Pressable style={styles.addButton} onPress={onPress}>
          <Ionicons name="add-sharp" size={iconSize} color={'black'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignContent: 'center',
  },
  addButtonContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },

  addButton: { alignItems: 'center' },
  addButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
