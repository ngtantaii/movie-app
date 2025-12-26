import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Icon } from '../../components';
import { useWatchlistLogic } from './useWatchlistLogic';
import { IMovie } from '../../api/types';
import { IMAGE_BASE_URL } from '@env';
import Logo from '../../assets/svgs/Logo.svg';

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

  const renderMovieItem = ({ item }: { item: IMovie }) => {
    const imageUrl = item.poster_path
      ? `${IMAGE_BASE_URL}${item.poster_path}`
      : null;

    return (
      <TouchableOpacity
        style={styles.movieCard}
        onPress={() => handleMoviePress(item)}
      >
        <Image
          source={{ uri: imageUrl || 'https://via.placeholder.com/100' }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.movieDate}>{item.release_date}</Text>
          <Text style={styles.movieOverview} numberOfLines={3}>
            {item.overview}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item.id)}
        >
          <Icon name="Close" size={20} color="#000" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#032541" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Icon name="ArrowLeft" size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Logo width={120} height={40} />
        </View>
      </View>

      {/* User Profile Section */}
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

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={toggleFilterDropdown}
          >
            <Text style={styles.filterText}>Filter by: {selectedSort}</Text>
            <Icon name="ChevronDown" size={16} color="#000" />
          </TouchableOpacity>

          {isFilterOpen && (
            <View style={styles.filterDropdown}>
              {sortOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.filterOption}
                  onPress={() => handleFilterSelect(option)}
                >
                  <Text>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.orderContainer}
          onPress={toggleSortOrder}
        >
          <Text style={styles.orderText}>
            Order: {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#032541',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    marginRight: 40, // Compensate for back button
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9C27B0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterContainer: {
    flex: 1,
    position: 'relative',
  },
  filterButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterDropdown: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  filterOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  orderContainer: {
    marginLeft: 16,
  },
  orderText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  poster: {
    width: 100,
    height: 140,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  movieDate: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  movieOverview: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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


