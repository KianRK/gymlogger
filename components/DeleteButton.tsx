import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label?: string;
  componentStyle?: ViewStyle;
  iconSize?: number;
  onPress?: () => void;
};

export default function DeleteButton({
  label,
  componentStyle,
  iconSize = 25,
  onPress,
}: Props) {
  return (
    <View style={[styles.deleteButtonContainer, componentStyle]}>
      <Pressable onPress={onPress}>
        <Ionicons name="trash-outline" size={iconSize} color={'black'} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButtonContainer: {
    width: 30,
    height: 30,
    position: 'relative',
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
