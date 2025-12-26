import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useHomeLogic } from './useHomeLogic';
import {
  MovieCard,
  Accordion,
  IAccordionOption,
  AppLogo,
} from '../../components';
import { EMovieCategory } from '../../api/types';
import { capitalizeWords } from '../../utils';

type ExpandedAccordion = 'category' | 'sortBy' | null;

export const HomeScreen = () => {
  const {
    movies,
    loading,
    selectedCategory,
    sortBy,
    searchQuery,
    setSearchQuery,
    handleCategoryChange,
    handleSortByChange,
    handleSearch,
    handleLoadMore,
    navigateToDetail,
  } = useHomeLogic();

  const [expandedAccordion, setExpandedAccordion] =
    useState<ExpandedAccordion>(null);

  const handleCategoryToggle = () => {
    setExpandedAccordion(prev => (prev === 'category' ? null : 'category'));
  };

  const handleSortByToggle = () => {
    setExpandedAccordion(prev => (prev === 'sortBy' ? null : 'sortBy'));
  };

  // Category options
  const categoryOptions: IAccordionOption[] = Object.values(EMovieCategory).map(
    cat => ({
      label: cat.replace('_', ' '),
      value: cat,
    }),
  );

  // Sort by options
  const sortByOptions: IAccordionOption[] = [
    { label: 'By Alphabetical Order', value: 'alphabetical' },
    { label: 'By Rating', value: 'rating' },
    { label: 'By Release Date', value: 'release_date' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppLogo width={120} height={40} />
      </View>

      <View style={styles.controls}>
        {/* Category Accordion */}
        <Accordion
          title="Category"
          options={categoryOptions}
          selectedValue={selectedCategory}
          onSelect={handleCategoryChange}
          isExpanded={expandedAccordion === 'category'}
          onToggle={handleCategoryToggle}
          // renderSelectedLabel={value =>
          //   capitalizeWords(value.replace('_', ' '))
          // }
          isCapitalizeWords
          titleStyle={styles.selectedValueStyle}
        />

        {/* Sort By Accordion */}
        <Accordion
          title="Sort by"
          options={sortByOptions}
          selectedValue={sortBy}
          onSelect={handleSortByChange}
          isExpanded={expandedAccordion === 'sortBy'}
          onToggle={handleSortByToggle}
          // renderSelectedLabel={value => {
          //   const option = sortByOptions.find(opt => opt.value === value);
          //   return option ? option.label : 'Sort by';
          // }}
          titleStyle={styles.selectedValueStyle}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={navigateToDetail} />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.loadMoreBtn}
            onPress={handleLoadMore}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loadMoreText}>Load More</Text>
            )}
          </TouchableOpacity>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { padding: 16, alignItems: 'center', backgroundColor: 'white' },
  controls: { padding: 16 },

  // Search Styles
  searchContainer: {
    flexDirection: 'column',
    gap: 10,
    // marginTop: 10,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    elevation: 1,
  },
  searchButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonText: {
    color: '#666',
    fontWeight: '600',
  },

  // Footer
  loadMoreBtn: {
    backgroundColor: '#01B4E4',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: { color: 'white', fontWeight: 'bold' },
  selectedValueStyle: { fontWeight: '600' },
});
