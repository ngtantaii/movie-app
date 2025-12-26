/**
 * Options for Home screen filters
 */

import { IAccordionOption } from '../components';
import { EMovieCategory } from '../api/types';
import { SortOption } from './sortOptions';

/**
 * Category options for Home screen
 */
export const CATEGORY_OPTIONS: IAccordionOption[] = Object.values(
  EMovieCategory,
).map(cat => ({
  label: cat.replace('_', ' '),
  value: cat,
}));

/**
 * Sort by options for Home screen
 */
export const SORT_BY_OPTIONS: IAccordionOption[] = [
  { label: 'By Alphabetical Order', value: SortOption.ALPHABETICAL },
  { label: 'By Rating', value: SortOption.RATING },
  { label: 'By Release Date', value: SortOption.RELEASE_DATE },
];

