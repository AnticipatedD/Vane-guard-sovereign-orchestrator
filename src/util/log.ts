export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogContext {
  [key: string]: unknown;
}

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
    console.log(JSON.stringify(payload));
  } else {
    const formattedContext = Object.keys(context).length ? JSON.stringify(context) : '';
    console.log(`[${payload.timestamp}] [${level.toUpperCase()}]: ${message} ${formattedContext}`);
  }
}
