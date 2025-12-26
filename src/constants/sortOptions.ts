/**
 * Sort options for movie lists
 */

export enum SortOption {
  ALPHABETICAL = 'alphabetical',
  RATING = 'rating',
  RELEASE_DATE = 'release_date',
  DATE_DESC = 'Latest Release',
  DATE_ASC = 'Oldest Release',
  RATING_DESC = 'Highest Rated',
  RATING_ASC = 'Lowest Rated',
}

/**
 * Sort options for Watchlist screen
 */
export type WatchlistSortOption = 'Alphabetical order' | 'Rating' | 'Release date';
export type SortOrder = 'asc' | 'desc';

export const WATCHLIST_SORT_OPTIONS: WatchlistSortOption[] = [
  'Alphabetical order',
  'Rating',
  'Release date',
];
