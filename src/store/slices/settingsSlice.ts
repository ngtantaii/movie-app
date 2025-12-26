import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EMovieCategory } from '../../api/types';

interface SettingsState {
  selectedCategory: EMovieCategory;
  username: string;
  joinedDate: string;
}

const initialState: SettingsState = {
  selectedCategory: EMovieCategory.NOW_PLAYING,
  username: 'John Lee',
  joinedDate: 'August 2023',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<EMovieCategory>) => {
      state.selectedCategory = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setJoinedDate: (state, action: PayloadAction<string>) => {
      state.joinedDate = action.payload;
    },
  },
});

export const { setCategory, setUsername, setJoinedDate } = settingsSlice.actions;
export default settingsSlice.reducer;