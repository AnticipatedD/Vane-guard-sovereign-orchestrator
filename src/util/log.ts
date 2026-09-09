export type LogLevel = "info" | "warn" | "error";

export interface LogContext {
	[key: string]: unknown;
}

export interface LogEntry {
	level: LogLevel;
	message: string;
	context?: LogContext;
	timestamp: string;
}

function writeLog(level: LogLevel, message: string, context?: LogContext) {
	const entry: LogEntry = {
		level,
		message,
		...(context && { context }),
		timestamp: new Date().toISOString(),
	};

	switch (level) {
		case "info":
			console.info(JSON.stringify(entry));
			break;
		case "warn":
			console.warn(JSON.stringify(entry));
			break;
		case "error":
			console.error(JSON.stringify(entry));
			break;
	}
}

export const logger = {
	info(message: string, context?: LogContext) {
		writeLog("info", message, context);
	},

	warn(message: string, context?: LogContext) {
		writeLog("warn", message, context);
	},

	error(message: string, context?: LogContext) {
		writeLog("error", message, context);
	},
};
