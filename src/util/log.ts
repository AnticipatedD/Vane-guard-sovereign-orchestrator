export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogContext {
  [key: string]: unknown;
}

/**
 * Structured logger that emits JSON when LOG_FORMAT=json or CI=true,
 * otherwise a human-readable line. Silent during unit tests.
 */
export function log(level: LogLevel, message: string, context: LogContext = {}): void {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  if (process.env.NODE_ENV === 'test') {
    return; // Suppress stdout noise during automated unit testing
  }

  if (process.env.CI || process.env.LOG_FORMAT === 'json') {
    // Use the appropriate console method so log level is preserved for collectors
    const line = JSON.stringify(payload);
    if (level === 'error') {
      console.error(line);
    } else if (level === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  } else {
    const formattedContext = Object.keys(context).length ? ` ${JSON.stringify(context)}` : '';
    const line = `[${payload.timestamp}] [${level.toUpperCase()}]: ${message}${formattedContext}`;
    if (level === 'error') {
      console.error(line);
    } else if (level === 'warn') {
      console.warn(line);
    } else {
      console.log(line);
    }
  }
}

export const logger = {
  info: (message: string, context?: LogContext) => log('info', message, context),
  warn: (message: string, context?: LogContext) => log('warn', message, context),
  error: (message: string, context?: LogContext) => log('error', message, context),
  debug: (message: string, context?: LogContext) => log('debug', message, context),
};
