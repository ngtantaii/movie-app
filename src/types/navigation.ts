/**
 * Navigation type definitions
 * Centralized navigation types for type safety across the app
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Home: undefined;
  Details: { movieId: number };
};

export type TabParamList = {
  HomeTab: undefined;
  WatchlistTab: undefined;
};

export type RootTabParamList = TabParamList & RootStackParamList;

// Navigation prop types
export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

export type DetailsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Details'
>;

export type WatchlistScreenNavigationProp = BottomTabNavigationProp<
  RootTabParamList,
  'WatchlistTab'
>;

// Route prop types
export type DetailsScreenRouteProp = {
  params: { movieId: number };
};

