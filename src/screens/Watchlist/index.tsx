import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Icon, AppLogo, MovieCard } from '../../components';
import { useWatchlistLogic } from './useWatchlistLogic';
import { IMovie } from '../../api/types';
import { colors, spacing, typography, borderRadius, shadows } from '../../theme';

export const WatchlistScreen = () => {
  const {
    watchlist,
    selectedSort,
    sortOrder,
    isFilterOpen,
    sortOptions,
    username,
    joinedDate,
    handleRemove,
    handleMoviePress,
    handleFilterSelect,
    toggleFilterDropdown,
    toggleSortOrder,
    goBack,
  } = useWatchlistLogic();

  const dropdownRef = useRef<View>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handlePressOutside = (event: { target: unknown }) => {
      if (
        isFilterOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        toggleFilterDropdown();
      }
    };

    if (isFilterOpen) {
      // Use setTimeout to avoid immediate closure
      const timer = setTimeout(() => {
        // This will be handled by TouchableOpacity onPress
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFilterOpen, toggleFilterDropdown]);

  const renderMovieItem = ({ item }: { item: IMovie }) => {
    return (
      <MovieCard
        movie={item}
        onPress={handleMoviePress}
        onRemove={handleRemove}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primaryDark} />

      {/* Logo Header */}
      <View style={styles.logoHeader}>
        <AppLogo width={120} height={40} />
      </View>

      {/* User Profile Section */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={goBack}>
          <Icon name="ArrowLeft" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.memberSince}>Member since {joinedDate}</Text>
          </View>
        </View>
      </View>

      {/* Watchlist Title and Filters */}
      <View style={styles.filterSection}>
        <Text style={styles.watchlistTitle}>My Watchlist</Text>
        <View style={styles.filterBar}>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter by:</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={toggleFilterDropdown}
              >
                <Text style={styles.dropdownText}>{selectedSort}</Text>
                <Icon name="ChevronDown" size={14} color={colors.text.primary} />
              </TouchableOpacity>

              {isFilterOpen && (
                <View ref={dropdownRef} style={styles.dropdown}>
                  {sortOptions.map(option => {
                    const isSelected = option === selectedSort;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownOption,
                          isSelected && styles.dropdownOptionSelected,
                        ]}
                        onPress={() => handleFilterSelect(option)}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            isSelected && styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          <View style={styles.orderContainer}>
            <Text style={styles.orderLabel}>Order:</Text>
            <TouchableOpacity
              style={styles.orderButton}
              onPress={toggleSortOrder}
            >
              <Icon
                name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                size={14}
                        color={colors.text.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Movie List */}
      <FlatList
        data={watchlist}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMovieItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your watchlist is empty</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.white,
  },
  logoHeader: {
    padding: spacing.lg,
    alignItems: 'center',
    backgroundColor: colors.background.white,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  profileContainer: {
    backgroundColor: colors.primaryDark,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.text.white,
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  memberSince: {
    fontSize: typography.fontSize.md,
    color: colors.text.white,
  },
  filterSection: {
    backgroundColor: colors.background.white,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  watchlistTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    marginRight: spacing.sm,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    minHeight: 44,
  },
  dropdownText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginTop: spacing.xs,
    zIndex: 1000,
    ...shadows.large,
    overflow: 'hidden',
  },
  dropdownOption: {
    padding: spacing.md,
    paddingVertical: spacing.md + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[100],
    minHeight: 44,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.gray[200],
  },
  dropdownOptionText: {
    fontSize: typography.fontSize.md,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.normal,
  },
  dropdownOptionTextSelected: {
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    textDecorationLine: 'underline',
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.lg,
  },
  orderLabel: {
    fontSize: typography.fontSize.md,
    color: colors.text.tertiary,
    marginRight: spacing.sm,
  },
  orderButton: {
    padding: spacing.xs,
  },
  listContent: {
    paddingTop: spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.tertiary,
  },
});
