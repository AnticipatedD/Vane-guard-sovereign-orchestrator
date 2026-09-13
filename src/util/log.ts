type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
    [key: string]: unknown;
}

function formatEntry(
    level: LogLevel,
    message: string,
    context: LogContext = {},
): string {
    return JSON.stringify({
        level,
        message,
        timestamp: new Date().toISOString(),
        ...context,
    });
}

export function createLogger(defaultContext: LogContext = {}) {
    const log = (level: LogLevel, message: string, context: LogContext = {}) => {
        const entry = formatEntry(level, message, {
            ...defaultContext,
            ...context,
        });

        if (level === "error") {
            console.error(entry);
        } else if (level === "warn") {
            console.warn(entry);
        } else {
            console.log(entry);
        }
    };

    return {
        debug: (message: string, context?: LogContext) =>
            log("debug", message, context),
        info: (message: string, context?: LogContext) =>
            log("info", message, context),
        warn: (message: string, context?: LogContext) =>
            log("warn", message, context),
        error: (message: string, context?: LogContext) =>
            log("error", message, context),
    };
}

export const logger = createLogger({ service: "vane-guard" });
