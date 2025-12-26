/**
 * Runtime formatting utilities
 */

/**
 * Format runtime in minutes to "Xh Ym" format
 * @param runtimeMinutes - Runtime in minutes
 * @returns Formatted string (e.g., "1h 54m")
 */
export const formatRuntime = (runtimeMinutes: number): string => {
  if (!runtimeMinutes || runtimeMinutes <= 0) return '0m';
  
  const hours = Math.floor(runtimeMinutes / 60);
  const minutes = runtimeMinutes % 60;
  
  if (hours === 0) {
    return `${minutes}m`;
  }
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
};

