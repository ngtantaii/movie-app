/**
 * Theme configuration
 * Centralized theme for colors, spacing, typography, and common styles
 */

export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  typography,
} as const;

export type Theme = typeof theme;

/**
 * Common shadow styles
 */
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
} as const;

/**
 * Common border radius
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 10,
  xl: 20,
  full: 9999,
} as const;

