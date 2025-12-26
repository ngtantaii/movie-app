import { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCategory, setSortBy } from '../../store/slices/settingsSlice';
import { movieApi } from '../../api/movies';
import { IMovie, EMovieCategory } from '../../api/types';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Details: { movieId: number };
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export const useHomeLogic = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const dispatch = useAppDispatch();

  // Get selected category and sortBy from Redux
  const selectedCategory = useAppSelector(
    state => state.settings.selectedCategory,
  );
  const sortBy = useAppSelector(state => state.settings.sortBy);

  const [movies, setMovies] = useState<IMovie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch Movies
  const fetchMovies = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        let data;

        if (searchQuery.trim()) {
          data = await movieApi.searchMovies(searchQuery, currentPage);
        } else {
          data = await movieApi.getMoviesByCategory(
            selectedCategory,
            currentPage,
          );
        }

        if (reset) {
          setMovies(data.results);
        } else {
          setMovies(prev => [...prev, ...data.results]);
        }

        // Increase page
        setPage(currentPage + 1);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    },
    [selectedCategory, page, searchQuery],
  ); 

  // Reset when changing category
  useEffect(() => {
    if (!isSearching) {
      setPage(1);
      fetchMovies(true);
    }
  }, [selectedCategory, isSearching]);

  // Handler: Change Category
  const handleCategoryChange = (cat: EMovieCategory) => {
    setIsSearching(false);
    setSearchQuery('');
    dispatch(setCategory(cat));
  };

  // Handler: Change Sort By
  const handleSortByChange = (sortValue: string) => {
    dispatch(setSortBy(sortValue));
    // Sorting logic will be implemented when needed
  };

  // Handler: Search
  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      setPage(1);
      fetchMovies(true);
    }
  };

  // Handler: Load More
  const handleLoadMore = () => {
    fetchMovies(false);
  };

  // Handler: Go to Detail
  const navigateToDetail = (movie: IMovie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  return {
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
    isSearching,
  };
};
