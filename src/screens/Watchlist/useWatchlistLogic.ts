import { useState, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromWatchlist } from '../../store/slices/watchlistSlice';
import { IMovie } from '../../api/types';

type SortOption = 'Alphabetical order' | 'Rating' | 'Release date';
type SortOrder = 'asc' | 'desc';

export const useWatchlistLogic = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const watchlist = useAppSelector(state => state.watchlist.items);
  const username = useAppSelector(
    state => state.settings.username || 'John Lee',
  );
  const joinedDate = useAppSelector(
    state => state.settings.joinedDate || 'August 2023',
  );
  
  const [selectedSort, setSelectedSort] = useState<SortOption>('Alphabetical order');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const sortOptions: SortOption[] = ['Alphabetical order', 'Rating', 'Release date'];

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
    dispatch(removeFromWatchlist(movieId));
  };

  const handleMoviePress = (movie: IMovie) => {
    navigation.navigate('Details' as never, { movieId: movie.id } as never);
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

