import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMovie } from '../../api/types';

interface WatchlistState {
  items: IMovie[];
}

const initialState: WatchlistState = {
  items: [],
};

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addToWatchlist: (state, action: PayloadAction<IMovie>) => {
      // Check if the movie already exists in the watchlist
      const exists = state.items.some((movie) => movie.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWatchlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((movie) => movie.id !== action.payload);
    },
  },
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;