export interface LogContext {
  [key: string]: unknown;
}

export class WorkerLogger {
  private format: string;

  constructor() {
    this.format = process.env.LOG_FORMAT || 'json';
  }

  info(message: string, context: LogContext = {}) {
    const payload = { level: 'info', message, timestamp: new Date().toISOString(), ...context };
    console.log(this.format === 'json' ? JSON.stringify(payload) : `[INFO] ${message}`);
  }

  error(message: string, error?: Error, context: LogContext = {}) {
    const payload = {
      level: 'error',
      message,
      errorMessage: error?.message,
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      ...context,
    };
    console.error(this.format === 'json' ? JSON.stringify(payload) : `[ERROR] ${message}`);
  }
}

export const logger = new WorkerLogger();
