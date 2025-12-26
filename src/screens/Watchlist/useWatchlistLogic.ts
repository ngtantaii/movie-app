import { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromWatchlist } from '../../store/slices/watchlistSlice';
import { setUsername, setJoinedDate } from '../../store/slices/settingsSlice';
import { IMovie } from '../../api/types';
import { movieApi } from '../../api/movies';
import { format } from 'date-fns';

type SortOption = 'Alphabetical order' | 'Rating' | 'Release date';
type SortOrder = 'asc' | 'desc';

type RootStackParamList = {
  Home: undefined;
  Details: { movieId: number };
  HomeTab: undefined;
  WatchlistTab: undefined;
};

type WatchlistScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList
>;

export const useWatchlistLogic = () => {
  const navigation = useNavigation<WatchlistScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector(state => state.watchlist.items);
  const username = useAppSelector(
    state => state.settings.username || 'John Lee',
  );
  const joinedDate = useAppSelector(
    state => state.settings.joinedDate || 'August 2023',
  );
  
  const [selectedSort, setSelectedSort] = useState<SortOption>('Rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortOptions: SortOption[] = ['Alphabetical order', 'Rating', 'Release date'];

  // Fetch account details on mount
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const account = await movieApi.getAccountDetails();
        if (account.username) {
          dispatch(setUsername(account.username));
        }
        // Note: TMDB API doesn't provide joined date, so we'll keep the default
        // or you can use account.id to generate a date
      } catch (error) {
        console.error('Failed to fetch account details:', error);
        // Keep default values on error
      }
    };

    fetchAccountDetails();
  }, [dispatch]);

  // Sort watchlist based on selected option and order
  const sortedWatchlist = useMemo(() => {
    const movies = [...watchlist];

    switch (selectedSort) {
      case 'Alphabetical order':
        movies.sort((a, b) => {
          const comparison = a.title.localeCompare(b.title);
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'Rating':
        movies.sort((a, b) => {
          const comparison = a.vote_average - b.vote_average;
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
      case 'Release date':
        movies.sort((a, b) => {
          const dateA = new Date(a.release_date).getTime();
          const dateB = new Date(b.release_date).getTime();
          const comparison = dateA - dateB;
          return sortOrder === 'asc' ? comparison : -comparison;
        });
        break;
    }

    return movies;
  }, [watchlist, selectedSort, sortOrder]);

  const handleRemove = (movieId: number) => {
    try {
      const movie = watchlist.find((item) => item.id === movieId);
      dispatch(removeFromWatchlist(movieId));
      Toast.show({
        type: 'success',
        text1: 'Removed from Watchlist',
        text2: movie
          ? `${movie.title} has been removed from your watchlist`
          : 'Movie has been removed from your watchlist',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to remove from watchlist',
        position: 'bottom',
      });
    }
  };

  const handleMoviePress = (movie: IMovie) => {
    // Navigate to Details screen in HomeTab stack
    navigation.navigate('HomeTab' as any, {
      screen: 'Details',
      params: { movieId: movie.id },
    } as any);
  };

  const handleFilterSelect = (option: SortOption) => {
    setSelectedSort(option);
    setIsFilterOpen(false);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    watchlist: sortedWatchlist,
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
  };
};

