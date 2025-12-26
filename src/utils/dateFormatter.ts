/**
 * Date formatting utilities
 */

import { format } from 'date-fns';

/**
 * Format date to DD/MM/YYYY format
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'dd/MM/yyyy');
  } catch (error) {
    return '';
  }
};

/**
 * Format date to "d MMMM yyyy" format (e.g., "19 July 2023")
 */
export const formatDateLong = (dateString: string): string => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'd MMMM yyyy');
  } catch (error) {
    return '';
  }
};

/**
 * Extract year from date string
 */
export const getYearFromDate = (dateString: string): number => {
  if (!dateString) return new Date().getFullYear();
  try {
    return new Date(dateString).getFullYear();
  } catch (error) {
    return new Date().getFullYear();
  }
};

