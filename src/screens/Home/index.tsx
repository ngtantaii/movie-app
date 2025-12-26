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
import { useHomeLogic } from './useHomeLogic';
import {
  MovieCard,
  Accordion,
  AppLogo,
} from '../../components';
import { capitalizeWords } from '../../utils';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';
import { CATEGORY_OPTIONS, SORT_BY_OPTIONS } from '../../constants';

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
          options={CATEGORY_OPTIONS}
          selectedValue={selectedCategory}
          onSelect={handleCategoryChange}
          isExpanded={expandedAccordion === 'category'}
          onToggle={handleCategoryToggle}
          isCapitalizeWords
          titleStyle={styles.selectedValueStyle}
        />

        {/* Sort By Accordion */}
        <Accordion
          title="Sort by"
          options={SORT_BY_OPTIONS}
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
          <ActivityIndicator size="large" color={colors.primary} />
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
              colors={[colors.primary]}
              tintColor={colors.primary}
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
  container: { flex: 1, backgroundColor: colors.background.white },
  header: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background.white,
  },
  controls: { padding: spacing.lg },

  // Search Styles
  searchContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.white,
    borderWidth: 1,
    borderColor: colors.border.medium,
    borderRadius: borderRadius.sm,
    ...shadows.small,
  },
  searchInput: {
    flex: 1,
    padding: spacing.md,
  },
  clearButton: {
    padding: spacing.sm,
    marginRight: spacing.xs,
  },
  clearButtonText: {
    fontSize: typography.fontSize.xl,
    color: colors.text.tertiary,
  },
  searchButton: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchButtonEnabled: {
    backgroundColor: colors.primary,
  },
  searchButtonDisabled: {
    backgroundColor: colors.gray[500],
  },
  searchButtonText: {
    fontWeight: typography.fontWeight.semibold,
  },
  searchButtonTextEnabled: {
    color: colors.text.white,
  },
  searchButtonTextDisabled: {
    color: colors.text.secondary,
  },

  // Footer
  loadMoreBtn: {
    backgroundColor: colors.primary,
    padding: 15,
    margin: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  loadMoreText: {
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
  },
  selectedValueStyle: { fontWeight: typography.fontWeight.semibold },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  noMoreContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
  },
});
