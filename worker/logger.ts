export interface LogPayload {
  level: 'info' | 'warn' | 'error';
  message: string;
  requestId?: string;
  context?: Record<string, unknown>;
  timestamp?: string;
}

export const logger = {
  log(payload: LogPayload): void {
    const formatted = {
      timestamp: payload.timestamp || new Date().toISOString(),
      level: payload.level,
      message: payload.message,
      requestId: payload.requestId || 'N/A',
      ...payload.context,
    };
    console.log(JSON.stringify(formatted));
  },
  info(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.log({ level: 'info', message, context, requestId });
  },
  error(message: string, context?: Record<string, unknown>, requestId?: string): void {
    this.log({ level: 'error', message, context, requestId });
  },
};
