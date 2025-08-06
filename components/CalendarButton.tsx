import { StyleSheet, Text, Pressable, View } from 'react-native';

type Props = {
  date: string;
  onPress: () => void;
};

export default function CalendarButton({ date, onPress }: Props) {
  return (
    <View style={styles.calendarButtonContainer}>
      <Pressable style={styles.calendarButton} onPress={onPress}>
        <Text style={styles.calendarButtonLabel}>{date}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarButtonContainer: {
    minWidth: 180,
    height: '12%',
    marginTop: '2%',
    marginRight: '2%',
    marginLeft: 'auto',
    marginBottom: 'auto',
    borderWidth: 2,
    borderRadius: 10,
    padding: 3,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  calendarButton: {
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  calendarButtonLabel: {
    flex: 1,
    textAlign: 'center',
    color: 'black',
    fontSize: 24,
  },
});
