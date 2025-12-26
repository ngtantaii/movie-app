import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import settingsReducer from './slices/settingsSlice';
import watchlistReducer from './slices/watchlistSlice';

const rootReducer = combineReducers({
  settings: settingsReducer,
  watchlist: watchlistReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['settings', 'watchlist'], // Slices to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable to avoid issues with non-serializable data in redux-persist
    }),
});

export const persistor = persistStore(store);

// Types cho TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;