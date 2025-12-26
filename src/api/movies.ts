import apiClient from './client';
import { IMovieResponse, IMovieDetail, EMovieCategory } from './types';

export const movieApi = {
  /**
   @description Get film list by category (now_playing, popular, upcoming)
   @param category The category of movies to fetch
   @param page The page number for pagination
   @returns A promise that resolves to a MovieResponse object
   */
  getMoviesByCategory: async (
    category: EMovieCategory,
    page = 1,
  ) => {
    const response = await apiClient.get<IMovieResponse>(`/movie/${category}`, {
      params: { page },
    });
    return response.data;
  },

  /**
   * @description Search movies by query string
   * @param query The search query string
   * @param page The page number for pagination
   * @returns A promise that resolves to a MovieResponse object
   */
  searchMovies: async (query: string, page = 1) => {
    const response = await apiClient.get<IMovieResponse>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  /**
   * @description Get detailed information about a specific movie by its ID
   * @param id The ID of the movie
   * @returns A promise that resolves to a MovieDetail object
   */
  getMovieDetail: async (id: number) => {
    const response = await apiClient.get<IMovieDetail>(`/movie/${id}`, {
      params: {
        append_to_response: 'credits', // Get the actors all at once!
      },
    });
    return response.data;
  },
};
