/**
 * Centralized logging utility
 * Replace console.log/error with this for better error tracking
 */

type LogLevel = 'info' | 'warn' | 'error';

const log = (level: LogLevel, message: string, ...args: unknown[]) => {
  if (__DEV__) {
    switch (level) {
      case 'info':
        console.log(`[INFO] ${message}`, ...args);
        break;
      case 'warn':
        console.warn(`[WARN] ${message}`, ...args);
        break;
      case 'error':
        console.error(`[ERROR] ${message}`, ...args);
        break;
    }
  }
  // In production, you could send logs to a service like Sentry, Crashlytics, etc.
};

export const logger = {
  info: (message: string, ...args: unknown[]) => log('info', message, ...args),
  warn: (message: string, ...args: unknown[]) => log('warn', message, ...args),
  error: (message: string, ...args: unknown[]) => log('error', message, ...args),
};

