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
  RefreshControl,
} from 'react-native';
import { useHomeLogic, SortOption } from './useHomeLogic';
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
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    handleCategoryChange,
    handleSearch,
    handleClearSearch,
    handleLoadMore,
    handleRefresh,
    navigateToDetail,
    isSearching,
    hasMore,
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

  // Sort by options - keeping the original labels
  const sortByOptions: IAccordionOption[] = [
    { label: 'By Alphabetical Order', value: SortOption.ALPHABETICAL },
    { label: 'By Rating', value: SortOption.RATING },
    { label: 'By Release Date', value: SortOption.RELEASE_DATE },
  ];

  // Handler for sort option change
  const handleSortByChange = (value: string) => {
    setSortOption(value as SortOption);
  };

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
          selectedValue={sortOption}
          onSelect={handleSortByChange}
          isExpanded={expandedAccordion === 'sortBy'}
          onToggle={handleSortByToggle}
          titleStyle={styles.selectedValueStyle}
        />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchQuery.trim().length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearSearch}
              >
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.searchButton,
              searchQuery.trim().length > 0
                ? styles.searchButtonEnabled
                : styles.searchButtonDisabled,
            ]}
            onPress={handleSearch}
            disabled={searchQuery.trim().length === 0}
          >
            <Text
              style={[
                styles.searchButtonText,
                searchQuery.trim().length > 0
                  ? styles.searchButtonTextEnabled
                  : styles.searchButtonTextDisabled,
              ]}
            >
              Search
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && movies.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#01B4E4" />
          <Text style={styles.loadingText}>Loading movies...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={navigateToDetail} />
          )}
          refreshControl={
            <RefreshControl
              refreshing={loading && movies.length > 0}
              onRefresh={handleRefresh}
              colors={['#01B4E4']}
              tintColor="#01B4E4"
            />
          }
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {isSearching
                    ? 'No movies found. Try a different search term.'
                    : 'No movies available.'}
                </Text>
              </View>
            )
          }
          ListFooterComponent={
            movies.length > 0 && (
              <View>
                {hasMore ? (
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
                ) : (
                  <View style={styles.noMoreContainer}>
                    <Text style={styles.noMoreText}>
                      {isSearching
                        ? 'No more results'
                        : 'No more movies to load'}
                    </Text>
                  </View>
                )}
              </View>
            )
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
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
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    padding: 12,
  },
  clearButton: {
    padding: 8,
    marginRight: 4,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#999',
  },
  searchButton: {
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonEnabled: {
    backgroundColor: '#01B4E4',
  },
  searchButtonDisabled: {
    backgroundColor: '#ddd',
  },
  searchButtonText: {
    fontWeight: '600',
  },
  searchButtonTextEnabled: {
    color: 'white',
  },
  searchButtonTextDisabled: {
    color: '#666',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  noMoreContainer: {
    padding: 16,
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 14,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#999',
  },
});
