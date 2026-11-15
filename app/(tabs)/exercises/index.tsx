import { View, StyleSheet, FlatList, TextInput, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import useThemeColors from '@/hooks/UseThemeColors';
import ExerciseCard from '@/components/ExerciseCard';
import { Exercise, ExerciseParsed } from '@/src/Interfaces/db_interfaces';
import { db } from '@/src/database';
import '@/src/i18n/i18n';
import { useTranslation } from 'react-i18next';

import FilterButton from '@/components/Buttons/FilterButton';
import FavoritesButton from '@/components/Buttons/FavoritesButton';
import FilterOptionButton from '@/components/Buttons/FilterOptionButton';
import CustomText from '@/components/CustomText';
import { Fonts, FontSize, Radius, Spacing } from '@/constants/Theme';

export default function ExercisesScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const { t } = useTranslation();
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
        source: '/exercises',
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
        const result = db.getAllSync<Exercise>(
          'SELECT *, is_favorite AS favorite FROM exercises'
        );
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
      return t(item.name).toLowerCase().includes(text.toLowerCase());
    });
  }

  const renderActiveChips = (
    active: string[],
    setActive: (filters: string[]) => void,
    translate: boolean
  ) =>
    active.map((filterOption) => (
      <Pressable
        key={filterOption}
        style={[styles.activeChip, { backgroundColor: colors.primarySoft }]}
        onPress={() =>
          setActive(active.filter((item) => item !== filterOption))
        }
      >
        <CustomText style={[styles.activeChipText, { color: colors.primary }]}>
          {translate ? t('targets.' + filterOption) : filterOption}
        </CustomText>
        <MaterialCommunityIcons name="close" size={14} color={colors.primary} />
      </Pressable>
    ));

  const allActive = [
    ...activeRegionFilter,
    ...activePrimaryFilter,
    ...activeSecondaryFilter,
  ];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.toolbar}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colors.textMuted}
          />
          <TextInput
            placeholder={t('exercises.search')}
            placeholderTextColor={colors.textMuted}
            value={text}
            onChangeText={(text) => setText(text)}
            style={[styles.searchInput, { color: colors.text }]}
          />
          {text.length > 0 && (
            <Pressable hitSlop={8} onPress={() => setText('')}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </Pressable>
          )}
        </View>
        <FilterButton
          onPress={() => {
            setFilterSelect(!filterSelect);
          }}
          selected={filterSelect}
          buttonStyle={styles.toolbarButton}
        />
        <FavoritesButton
          onPress={() => setFavSelect(!favSelect)}
          selected={favSelect}
          buttonStyle={styles.toolbarButton}
        />
      </View>
      {filterSelect && (
        <View
          style={[
            styles.filterPanel,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <View style={styles.filterRow}>
            <FilterOptionButton
              buttonText="Region"
              data={regionOptions}
              activeFilters={activeRegionFilter}
              setActiveFilter={setActiveRegionFilter}
              dropDownVisible={regionDropDownVisible}
              visibilitySetter={setRegionDropDownVisible}
              registrationHandler={() => setCurrentDropDownVisible('Region')}
            />
            <FilterOptionButton
              buttonText={t('exercises.primary')}
              data={primaryOptions}
              activeFilters={activePrimaryFilter}
              setActiveFilter={setActivePrimaryFilter}
              dropDownVisible={primaryDropDownVisible}
              visibilitySetter={setPrimaryDropDownVisible}
              registrationHandler={() => setCurrentDropDownVisible('Primary')}
            />
            <FilterOptionButton
              buttonText={t('exercises.secondary')}
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
          {allActive.length > 0 && (
            <View style={styles.activeChipRow}>
              {renderActiveChips(
                activeRegionFilter,
                setActiveRegionFilter,
                false
              )}
              {renderActiveChips(
                activePrimaryFilter,
                setActivePrimaryFilter,
                true
              )}
              {renderActiveChips(
                activeSecondaryFilter,
                setActiveSecondaryFilter,
                true
              )}
            </View>
          )}
        </View>
      )}
      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        data={filteredExercises()}
        keyExtractor={(item) => item.id.toString()}
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    height: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSize.body,
    paddingVertical: 0,
  },
  toolbarButton: { width: 44, height: 44 },
  filterPanel: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    zIndex: 999,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    zIndex: 999,
  },
  activeChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs + 2,
    marginTop: Spacing.md,
  },
  activeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: Radius.pill,
    paddingVertical: 4,
    paddingLeft: Spacing.sm + 2,
    paddingRight: Spacing.sm,
  },
  activeChipText: { fontFamily: Fonts.medium, fontSize: FontSize.caption },
  list: { flex: 1 },
  listContent: { paddingTop: Spacing.xs, paddingBottom: Spacing.xxl },
});
