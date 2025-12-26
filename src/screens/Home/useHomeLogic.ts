import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setCategory, setSortBy } from '../../store/slices/settingsSlice';
import { movieApi } from '../../api/movies';
import { IMovie, EMovieCategory } from '../../api/types';
import { useNavigation, StackNavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SortOption } from '../../constants';

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
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.RELEASE_DATE);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Fetch Movies
  const fetchMovies = useCallback(
    async (reset = false) => {
      if (loading) return;
      setLoading(true);
      try {
        const currentPage = reset ? 1 : page;
        let data;

        if (searchQuery.trim()) {
          data = await movieApi.searchMovies(searchQuery.trim(), currentPage);
        } else {
          data = await movieApi.getMoviesByCategory(
            selectedCategory,
            currentPage,
          );
        }

        // Update total pages and hasMore
        setTotalPages(data.total_pages);
        setHasMore(currentPage < data.total_pages);

        if (reset) {
          setMovies(data.results);
          setPage(2); // Next page will be 2
        } else {
          setMovies(prev => [...prev, ...data.results]);
          setPage(prev => prev + 1);
        }
      } catch (error) {
        logger.error('Failed to fetch movies', error);
        // Reset on error
        if (reset) {
          setMovies([]);
        }
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
      setHasMore(true);
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
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setIsSearching(true);
      setPage(1);
      setHasMore(true);
      fetchMovies(true);
    } else {
      // Clear search and reset to category view
      setIsSearching(false);
      setSearchQuery('');
      setPage(1);
      setHasMore(true);
      fetchMovies(true);
    }
  };

  // Handler: Clear Search
  const handleClearSearch = async () => {
    setIsSearching(false);
    setSearchQuery('');
    setPage(1);
    setHasMore(true);
    // Force fetch with empty query to get category movies
    setLoading(true);
    try {
      const data = await movieApi.getMoviesByCategory(selectedCategory, 1);
      setTotalPages(data.total_pages);
      setHasMore(1 < data.total_pages);
      setMovies(data.results);
      setPage(2);
    } catch (error) {
      console.error('Fetch error:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  // Client-side sorting logic
  const sortedMovies = useMemo(() => {
    const moviesCopy = [...movies];

    switch (sortOption) {
      case SortOption.ALPHABETICAL:
        moviesCopy.sort((a, b) => {
          return a.title.localeCompare(b.title); // Alphabetical order
        });
        break;

      case SortOption.RATING:
        moviesCopy.sort((a, b) => {
          return b.vote_average - a.vote_average; // Highest rated first
        });
        break;

      case SortOption.RELEASE_DATE:
        moviesCopy.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          return dateB - dateA; // Latest release first
        });
        break;

      case SortOption.DATE_DESC:
        moviesCopy.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          return dateB - dateA; // Descending (latest first)
        });
        break;

      case SortOption.DATE_ASC:
        moviesCopy.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          return dateA - dateB; // Ascending (oldest first)
        });
        break;

      case SortOption.RATING_DESC:
        moviesCopy.sort((a, b) => {
          return b.vote_average - a.vote_average; // Descending (highest first)
        });
        break;

      case SortOption.RATING_ASC:
        moviesCopy.sort((a, b) => {
          return a.vote_average - b.vote_average; // Ascending (lowest first)
        });
        break;

      default:
        // Default to RELEASE_DATE if unknown option
        moviesCopy.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          return dateB - dateA;
        });
    }

    return moviesCopy;
  }, [movies, sortOption]);

  // Handler: Load More
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMovies(false);
    }
  };

  // Handler: Refresh
  const handleRefresh = () => {
    if (isSearching && searchQuery.trim()) {
      // Refresh search results
      setPage(1);
      setHasMore(true);
      fetchMovies(true);
    } else {
      // Refresh category movies
      setPage(1);
      setHasMore(true);
      fetchMovies(true);
    }
  };

  // Handler: Go to Detail
  const navigateToDetail = (movie: IMovie) => {
    navigation.navigate('Details', { movieId: movie.id });
  };

  return {
    movies: sortedMovies,
    loading,
    selectedCategory,
    sortBy,
    sortOption,
    setSortOption,
    searchQuery,
    setSearchQuery,
    handleCategoryChange,
    handleSortByChange,
    handleSearch,
    handleClearSearch,
    handleLoadMore,
    handleRefresh,
    navigateToDetail,
    isSearching,
    hasMore,
  };
};
