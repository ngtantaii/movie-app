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
    const handlePressOutside = (event: any) => {
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
      <StatusBar barStyle="light-content" backgroundColor="#032541" />

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
                <Icon name="ChevronDown" size={14} color="#000" />
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
                color="#000"
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
    backgroundColor: 'white',
  },
  logoHeader: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  profileContainer: {
    backgroundColor: '#032541',
    gap: 16,
    padding: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: 'white',
  },
  filterSection: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 16,
  },
  watchlistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 44,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  dropdownOption: {
    padding: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    minHeight: 44,
  },
  dropdownOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '400',
  },
  dropdownOptionTextSelected: {
    color: '#01B4E4',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  orderLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  orderButton: {
    padding: 4,
  },
  listContent: {
    // paddingHorizontal: 8,
    paddingTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
