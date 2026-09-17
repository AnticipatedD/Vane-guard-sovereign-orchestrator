export interface LogContext {
  module?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export const logger = {
  info: (message: string, context: LogContext = {}) => {
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), level: 'INFO', message, ...context }));
  },
  warn: (message: string, context: LogContext = {}) => {
    console.warn(JSON.stringify({ timestamp: new Date().toISOString(), level: 'WARN', message, ...context }));
  },
  error: (message: string, error?: Error | unknown, context: LogContext = {}) => {
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message,
      error: error instanceof Error ? error.message : error,
      ...context
    }));
  }
};
