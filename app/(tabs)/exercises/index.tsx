import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import useThemeColors from '@/hooks/UseThemeColors';
import ExerciseCard from '@/components/ExerciseCard';
import { Exercise, ExerciseParsed } from '@/src/Interfaces/db_interfaces';
import { db } from '@/src/database';

import DeleteButton from '@/components/Buttons/DeleteButton';
import FilterButton from '@/components/Buttons/FilterButton';
import FavoritesButton from '@/components/Buttons/FavoritesButton';
import EditButton from '@/components/Buttons/EditButton';
import FilterOptionButton from '@/components/Buttons/FilterOptionButton';
import CustomText from '@/components/CustomText';

export default function ExercisesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const [exercises, setExercises] = useState<ExerciseParsed[]>([]);
  const [filterSelect, setFilterSelect] = useState<boolean>(false);
  const [favSelect, setFavSelect] = useState<boolean>(false);
  const [text, setText] = useState('');
  const [activeRegionFilter, setActiveRegionFilter] = useState<string[]>([]);
  const [activePrimaryFilter, setActivePrimaryFilter] = useState<string[]>([]);
  const [activeSecondaryFilter, setActiveSecondaryFilter] = useState<string[]>(
    []
  );
  const [regionDropDownVisible, setRegionDropDownVisible] = useState(false);
  const [primaryDropDownVisible, setPrimaryDropDownVisible] = useState(false);
  const [secondaryDropDownVisible, setSecondaryDropDownVisible] =
    useState(false);
  const [currentDropDownVisible, setCurrentDropDownVisible] = useState('');
  const regionOptions = [
    'Abs',
    'Back',
    'Biceps',
    'Calves',
    'Chest',
    'Forearm',
    'Leg',
    'Shoulder',
    'Triceps',
  ];
  const primaryOptions = [
    'Abductors',
    'Abs',
    'Adductors',
    'Biceps',
    'Calves',
    'Chest',
    'Forearm flexors',
    'Front Deltoid',
    'Glutes',
    'Hamstrings',
    'Hip flexor',
    'Lateral Deltoid',
    'Lats',
    'Lower Back',
    'Obliques',
    'Quads',
    'Rear Deltoid',
    'Rotator Cuff',
    'Trapezius',
    'Triceps',
  ];
  const secondaryOptions = [
    'Abductors',
    'Abs',
    'Adductors',
    'Biceps',
    'Calves',
    'Chest',
    'Forearm flexors',
    'Front Deltoid',
    'Glutes',
    'Hamstrings',
    'Hip flexor',
    'Lateral Deltoid',
    'Lats',
    'Lower Back',
    'Obliques',
    'Quads',
    'Rear Deltoid',
    'Rotator Cuff',
    'Trapezius',
    'Triceps',
  ];

  const goToDetailPage = (id: number) => {
    router.push({
      pathname: '/exercises/[id]',
      params: {
        id: id,
      },
    });
  };

  useEffect(() => {
    if (currentDropDownVisible === 'Region') {
      setPrimaryDropDownVisible(false);
      setSecondaryDropDownVisible(false);
    }
    if (currentDropDownVisible === 'Primary') {
      setRegionDropDownVisible(false);
      setSecondaryDropDownVisible(false);
    }
    if (currentDropDownVisible === 'Secondary') {
      setRegionDropDownVisible(false);
      setPrimaryDropDownVisible(false);
    }
  }, [currentDropDownVisible]);

  useEffect(() => {
    function setup() {
      try {
        const result = db.getAllSync<Exercise>('SELECT * FROM exercises');
        const parsed_result = result.map((exercise) => {
          let parsed_primary = [];
          let parsed_secondary = [];
          try {
            parsed_primary = JSON.parse(exercise.primary_target);
            parsed_secondary = JSON.parse(exercise.secondary_target);
          } catch (e) {
            console.error(
              'Failed to parse targets for exercise ID: ${exercise.id}',
              e
            );
          }
          return {
            ...exercise,
            primary_target: parsed_primary,
            secondary_target: parsed_secondary,
          };
        });

        setExercises(parsed_result);
      } catch (error) {
        console.error('Failed to fetch exercises', error);
      }
    }
    setup();
  }, []);

  const updateFav = (item: ExerciseParsed) => {
    let newFavStatus = !item.favorite;
    db.runSync('UPDATE exercises SET is_favorite = ? WHERE id = ?', [
      newFavStatus,
      item.id,
    ]);
    setExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === item.id
          ? { ...exercise, favorite: Number(newFavStatus) }
          : exercise
      )
    );
  };

  function filteredExercises(): ExerciseParsed[] {
    let ex = exercises;
    if (favSelect) {
      ex = ex
        .filter((item) => {
          return item.favorite;
        })
        .filter((item) => {
          return item.name.toLowerCase().includes(text.toLowerCase());
        });
    }
    if (filterSelect) {
      if (activeRegionFilter.length > 0) {
        ex = ex.filter((item) => {
          return activeRegionFilter.includes(item.region);
        });
      }
      if (activePrimaryFilter.length > 0) {
        ex = ex.filter((item) => {
          if (item.primary_target) {
            return item.primary_target.some((element) =>
              activePrimaryFilter.includes(element)
            );
          }
        });
      }
      if (activeSecondaryFilter.length > 0) {
        ex = ex.filter((item) => {
          if (item.secondary_target) {
            return item.secondary_target.some((element) =>
              activeSecondaryFilter.includes(element)
            );
          }
        });
      }
    }
    return ex.filter((item) => {
      return item.name.toLowerCase().includes(text.toLowerCase());
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeViewContainer}>
        <LinearGradient
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 1, y: 1 }}
          colors={[colors.mainOne, colors.mainTwo]}
          style={[{ overflow: 'visible' }]}
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
              <View style={{ flexDirection: 'column' }}>
                <View>
                  <FilterOptionButton
                    buttonText="Region"
                    data={regionOptions}
                    activeFilters={activeRegionFilter}
                    setActiveFilter={setActiveRegionFilter}
                    dropDownVisible={regionDropDownVisible}
                    visibilitySetter={setRegionDropDownVisible}
                    registrationHandler={() =>
                      setCurrentDropDownVisible('Region')
                    }
                  />
                </View>
                <ScrollView style={styles.activeFilterScrollView}>
                  {activeRegionFilter.map((filterOption) => (
                    <Pressable
                      key={filterOption}
                      style={styles.activeFilterButton}
                      onPress={() => {
                        setActiveRegionFilter(
                          activeRegionFilter.filter(
                            (item) => item !== filterOption
                          )
                        );
                      }}
                    >
                      <View style={styles.activeFilterButtonContent}>
                        <CustomText
                          style={styles.activeFilterButtonText}
                          key={filterOption}
                        >
                          {filterOption}
                        </CustomText>
                        <MaterialCommunityIcons
                          style={styles.activeFilterButtonIcon}
                          name="close"
                          size={15}
                          color={'black'}
                        />
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View>
                <View>
                  <FilterOptionButton
                    buttonText="Primary"
                    data={primaryOptions}
                    activeFilters={activePrimaryFilter}
                    setActiveFilter={setActivePrimaryFilter}
                    dropDownVisible={primaryDropDownVisible}
                    visibilitySetter={setPrimaryDropDownVisible}
                    registrationHandler={() =>
                      setCurrentDropDownVisible('Primary')
                    }
                  />
                </View>
                <ScrollView style={styles.activeFilterScrollView}>
                  {activePrimaryFilter.map((filterOption) => (
                    <Pressable
                      key={filterOption}
                      style={styles.activeFilterButton}
                      onPress={() => {
                        setActivePrimaryFilter(
                          activePrimaryFilter.filter(
                            (item) => item !== filterOption
                          )
                        );
                      }}
                    >
                      <View style={styles.activeFilterButtonContent}>
                        <CustomText
                          style={styles.activeFilterButtonText}
                          key={filterOption}
                        >
                          {filterOption}
                        </CustomText>
                        <MaterialCommunityIcons
                          style={styles.activeFilterButtonIcon}
                          name="close"
                          size={15}
                          color={'black'}
                        />
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              <View>
                <View>
                  <FilterOptionButton
                    buttonText="Secondary"
                    data={secondaryOptions}
                    activeFilters={activeSecondaryFilter}
                    setActiveFilter={setActiveSecondaryFilter}
                    dropDownVisible={secondaryDropDownVisible}
                    visibilitySetter={setSecondaryDropDownVisible}
                    registrationHandler={() =>
                      setCurrentDropDownVisible('Secondary')
                    }
                  />
                </View>
                <ScrollView style={styles.activeFilterScrollView}>
                  {activeSecondaryFilter.map((filterOption) => (
                    <Pressable
                      style={styles.activeFilterButton}
                      key={filterOption}
                      onPress={() => {
                        setActiveSecondaryFilter(
                          activeSecondaryFilter.filter(
                            (item) => item !== filterOption
                          )
                        );
                      }}
                    >
                      <View style={styles.activeFilterButtonContent}>
                        <CustomText
                          style={styles.activeFilterButtonText}
                          key={filterOption}
                        >
                          {filterOption}
                        </CustomText>
                        <MaterialCommunityIcons
                          style={styles.activeFilterButtonIcon}
                          name="close"
                          size={15}
                          color={'black'}
                        />
                      </View>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
          <View style={styles.searchBarContainer}>
            <MaterialCommunityIcons name="magnify" size={30} color={'black'} />
            <TextInput
              placeholder="Search"
              value={text}
              onChangeText={(text) => setText(text)}
              style={{
                fontFamily: 'Outfit-Regular',
                fontSize: 20,
                flexGrow: 1,
              }}
            ></TextInput>
          </View>
          <FlatList
            data={filteredExercises()}
            renderItem={({ item }) => (
              <ExerciseCard
                name={item.name}
                is_favorite={Boolean(item.favorite)}
                region={item.region}
                primary={item.primary_target}
                secondary={item.secondary_target}
                onPressInfo={() => goToDetailPage(item.id)}
                onPressFav={() => updateFav(item)}
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
    zIndex: 999,
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
  activeFilterScrollView: {
    maxHeight: 120,
  },
  activeFilterButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
  },
  activeFilterButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'flex-start',
    borderRadius: 8,
    backgroundColor: '#b8b8b8ff',
    margin: 2,
    padding: 2,
  },
  activeFilterButtonText: { textAlignVertical: 'center' },
  activeFilterButtonIcon: { alignSelf: 'center' },
});
