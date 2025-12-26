import { useState, useEffect, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCategory } from '../../store/slices/settingsSlice';
import { movieApi } from '../../api/movies';
import { IMovie, EMovieCategory } from '../../api/types';
import { useNavigation } from '@react-navigation/native';

export const useHomeLogic = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  // Get selected category from Redux
  const selectedCategory = useAppSelector(
    state => state.settings.selectedCategory,
  );

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
    dispatch(setCategory(cat)); // Lưu vào Redux
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
    searchQuery,
    setSearchQuery,
    handleCategoryChange,
    handleSearch,
    handleLoadMore,
    navigateToDetail,
    isSearching,
  };
};
