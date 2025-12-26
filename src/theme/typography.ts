/**
 * Typography system for consistent text styling
 */

export const typography = {
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 28,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: 'bold' as const,
  },
  lineHeight: {
    sm: 18,
    md: 20,
    lg: 24,
  },
} as const;

export type Typography = typeof typography;

