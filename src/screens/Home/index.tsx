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
import { MovieCard, Icon } from '../../components';
import { EMovieCategory } from '../../api/types';
import Logo from '../../assets/svgs/Logo.svg';

// Component Dropdown
const CategorySelector = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (c: EMovieCategory) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = Object.values(EMovieCategory);

  return (
    <View style={{ zIndex: 100 }}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownText}>
          {selected.replace('_', ' ').toUpperCase()}
        </Text>
        <Icon name="ChevronDown" size={16} color="#000" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(cat);
                setIsOpen(false);
              }}
            >
              <Text>{cat.replace('_', ' ').toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// Sort By Dropdown Component
const SortBySelector = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (sort: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const sortOptions = ['Rating', 'Release Date', 'Title'];

  return (
    <View style={{ zIndex: 99 }}>
      <TouchableOpacity
        style={styles.dropdownHeader}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={styles.dropdownText}>Sort by: {selected}</Text>
        <Icon name="ChevronDown" size={16} color="#000" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownList}>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option}
              style={styles.dropdownItem}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export const HomeScreen = () => {
  const {
    movies,
    loading,
    selectedCategory,
    searchQuery,
    setSearchQuery,
    handleCategoryChange,
    handleSearch,
    handleLoadMore,
    navigateToDetail,
  } = useHomeLogic();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Logo width={120} height={40} />
      </View>

      <View style={styles.controls}>
        {/* Dropdown Category */}
        <CategorySelector
          selected={selectedCategory}
          onSelect={handleCategoryChange}
        />

        {/* Sort By Dropdown */}
        <SortBySelector selected="Rating" onSelect={() => {}} />

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
  logoText: { fontSize: 20, fontWeight: 'bold', color: '#01B4E4' },
  controls: { padding: 16, zIndex: 1 },

  // Dropdown Styles
  dropdownHeader: {
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownText: { fontWeight: '600', fontSize: 14 },
  dropdownList: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  // Search Styles
  searchContainer: {
    flexDirection: 'column',
    gap: 10,
    marginTop: 10,
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

  // Search Styles - before
  //   searchContainer: { flexDirection: 'row', gap: 10 },
  //   searchInput: {
  //     flex: 1,
  //     backgroundColor: 'white',
  //     padding: 10,
  //     borderRadius: 4,
  //     borderWidth: 1,
  //     borderColor: '#ddd',
  //   },
  //   searchButton: {
  //     backgroundColor: '#ddd',
  //     padding: 10,
  //     borderRadius: 4,
  //     justifyContent: 'center',
  //   },

  // Footer
  loadMoreBtn: {
    backgroundColor: '#01B4E4',
    padding: 15,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: { color: 'white', fontWeight: 'bold' },
});
