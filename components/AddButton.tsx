import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  label: string;
  onPress?: () => void;
};

export default function AddButton({ label, onPress }: Props) {
  return (
    <View style={styles.componentContainer}>
      <Text style={styles.addButtonLabel}>{label}</Text>
      <View style={styles.addButtonContainer}>
        <Pressable style={styles.addButton} onPress={onPress}>
          <Ionicons name="add-sharp" size={40} color={'black'} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  componentContainer: {
    position: 'relative',
    marginTop: 'auto',
    marginLeft: 'auto',
    marginBottom: '10%',
    marginRight: '10%',
    alignContent: 'center',
  },
  addButtonContainer: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'white',
  },

  addButton: {
    alignSelf: 'center',
  },
  addButtonLabel: {
    width: 140,
    textAlign: 'center',
    color: 'black',
    fontSize: 18,
  },
});
