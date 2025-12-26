/**
 * Color palette for the Movie App
 * All colors used throughout the application should be defined here
 */

export const colors = {
  // Primary Colors
  primary: '#01B4E4',
  primaryDark: '#032541',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Gray Scale
  gray: {
    50: '#F8F8F8',
    100: '#F5F5F5',
    200: '#E3F2FD',
    300: '#E0E0E0',
    400: '#EEEEEE',
    500: '#DDDDDD',
    600: '#999999',
    700: '#666666',
  },
  
  // Semantic Colors
  success: '#21d07a',
  successLight: '#89ed9fff',
  error: '#FF0000',
  warning: '#FFA500',
  
  // Special Colors
  darkGreen: '#081c22',
  purple: '#9C27B0',
  
  // Text Colors
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    white: '#FFFFFF',
  },
  
  // Background Colors
  background: {
    white: '#FFFFFF',
    light: '#F5F5F5',
    dark: '#032541',
    primary: '#01B4E4',
  },
  
  // Border Colors
  border: {
    light: '#E0E0E0',
    medium: '#EEEEEE',
    dark: '#CCCCCC',
  },
  
  // Shadow
  shadow: '#000000',
} as const;

export type Colors = typeof colors;

