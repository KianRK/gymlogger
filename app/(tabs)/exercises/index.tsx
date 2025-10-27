import {
  View,
  useColorScheme,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Colors } from '@/constants/Colors';
import ExerciseCard from '@/components/ExerciseCard';
import { Exercise } from '@/src/database/db_interfaces';
import { db } from '@/src/database';

import DeleteButton from '@/components/Buttons/DeleteButton';
import FilterButton from '@/components/Buttons/FilterButton';
import FavoritesButton from '@/components/Buttons/FavoritesButton';
import EditButton from '@/components/Buttons/EditButton';
import FilterOptionButton from '@/components/Buttons/FilterOption';

const colorScheme = useColorScheme() ?? 'light';
const colors = Colors[colorScheme];

export default function ExercisesScreen() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filterSelect, setFilterSelect] = useState<boolean>(false);
  const [favSelect, setFavSelect] = useState<boolean>(false);
  const [text, setText] = useState<string>();

  const goToDetailPage = (id: number) => {
    router.push({
      pathname: '/exercises/[id]',
      params: {
        id: id,
      },
    });
  };

  useEffect(() => {
    function setup() {
      try {
        const result = db.getAllSync<Exercise>('SELECT * FROM exercises');
        setExercises(result);
      } catch (error) {
        console.error('Failed to fetch exercises', error);
      }
    }
    setup();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeViewContainer}>
        <LinearGradient
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={['#ddeaf6ff', '#b3cbe4ff']}
          style={StyleSheet.absoluteFillObject}
        >
          <View style={styles.filterBarContainer}>
            <FilterButton
              onPress={() => {
                setFilterSelect(!filterSelect);
              }}
              iconSize={25}
              selected={filterSelect}
              buttonStyle={{ width: 40, height: 40 }}
            />
            <FavoritesButton
              onPress={() => setFavSelect(!favSelect)}
              iconSize={25}
              buttonStyle={{ width: 40, height: 40 }}
              selected={favSelect}
            />
            <EditButton iconSize={25} buttonStyle={{ width: 40, height: 40 }} />
          </View>
          {filterSelect && (
            <View style={styles.filterOptionsContainer}>
              <FilterOptionButton buttonText="Region" />
              <FilterOptionButton buttonText="Primary" />
              <FilterOptionButton buttonText="Secondary" />
            </View>
          )}
          <View style={styles.searchBarContainer}>
            <MaterialCommunityIcons name="magnify" size={30} color={'black'} />
            <TextInput
              placeholder="Search"
              value={text}
              style={{
                fontFamily: 'Outfit-Regular',
                fontSize: 20,
                flexGrow: 1,
              }}
            ></TextInput>
          </View>
          <FlatList
            data={exercises}
            renderItem={({ item }) => (
              <ExerciseCard
                name={item.name}
                is_favorite={false}
                region="Chest"
                primary="Upper Chest"
                secondary="Triceps"
                onPress={() => goToDetailPage(item.id)}
              />
            )}
          />
        </LinearGradient>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBarContainer: {
    flexDirection: 'row',
    height: 50,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 20,
  },
  filterOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    padding: 10,
    marginLeft: '3%',
    marginRight: '3%',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    width: '95%',
    borderWidth: 1,
    borderRadius: 36,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    padding: 5,
    paddingLeft: 12,
    backgroundColor: '#cfcecfff',
  },
});
