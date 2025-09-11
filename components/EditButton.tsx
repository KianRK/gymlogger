import {
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label?: string;
  onPress?: () => void;
  componentStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  labelStyle?: TextStyle;
  iconSize?: number;
};

export default function EditButton({
  label,
  onPress,
  componentStyle,
  buttonStyle,
  labelStyle,
  iconSize = 35,
}: Props) {
  return (
    <View style={[styles.componentContainer, componentStyle]}>
      {label && (
        <Text style={[styles.editButtonLabel, labelStyle]}>{label}</Text>
      )}
      <View style={[styles.editButtonContainer, buttonStyle]}>
        <Pressable style={styles.editButton} onPress={onPress}>
          <Ionicons name="menu-outline" size={iconSize} color={'black'} />
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
  editButtonContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },

  editButton: { alignSelf: 'center' },
  editButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
