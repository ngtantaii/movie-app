import { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { movieApi } from '../../api/movies';
import { IMovieDetail } from '../../api/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addToWatchlist,
  removeFromWatchlist,
} from '../../store/slices/watchlistSlice';

type ParamList = {
  Detail: { movieId: number };
};

export const useDetailLogic = () => {
  const route = useRoute<RouteProp<ParamList, 'Detail'>>();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { movieId } = route.params;

  const [movie, setMovie] = useState<IMovieDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Get watchlist from Redux
  const watchlist = useAppSelector(state => state.watchlist.items);
  const isFavorite = watchlist.some(item => item.id === movieId);

  useEffect(() => {
    fetchDetail();
  }, [movieId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const data = await movieApi.getMovieDetail(movieId);
      setMovie(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = () => {
    if (!movie) return;

    if (isFavorite) {
      dispatch(removeFromWatchlist(movie.id));
    } else {
      dispatch(addToWatchlist(movie));
    }
  };

  return {
    movie,
    loading,
    isFavorite,
    toggleWatchlist,
    goBack: navigation.goBack,
  };
};
