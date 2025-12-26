import { useState, useEffect } from 'react';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { movieApi } from '../../api/movies';
import { IMovieDetail, IMovie } from '../../api/types';
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
  const [recommendations, setRecommendations] = useState<IMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Get watchlist from Redux
  const watchlist = useAppSelector(state => state.watchlist.items);
  const isFavorite = watchlist.some(item => item.id === movieId);

  useEffect(() => {
    fetchDetail();
    fetchRecommendations();
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

  const fetchRecommendations = async () => {
    try {
      setLoadingRecommendations(true);
      const data = await movieApi.getMovieRecommendations(movieId);
      setRecommendations(data.results.slice(0, 10));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRecommendations(false);
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
    recommendations,
    loading,
    loadingRecommendations,
    isFavorite,
    toggleWatchlist,
    goBack: navigation.goBack,
  };
};
