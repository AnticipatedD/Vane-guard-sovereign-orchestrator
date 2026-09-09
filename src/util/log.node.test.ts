import { afterEach, describe, expect, it, vi } from "vitest";
import { logger } from "./log";

describe("logger", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("emits structured info records", () => {
		const spy = vi.spyOn(console, "info").mockImplementation(() => {});

		logger.info("loaded", {
			component: "docs",
			operation: "startup",
		});

		expect(spy).toHaveBeenCalledOnce();

		const record = JSON.parse(spy.mock.calls[0][0] as string) as {
			level: string;
			message: string;
			context: {
				component: string;
				operation: string;
			};
			timestamp: string;
		};

		expect(record.level).toBe("info");
		expect(record.message).toBe("loaded");
		expect(record.context.component).toBe("docs");
		expect(record.context.operation).toBe("startup");
		expect(Number.isNaN(Date.parse(record.timestamp))).toBe(false);
	});

	it("emits warning records", () => {
		const spy = vi.spyOn(console, "warn").mockImplementation(() => {});

		logger.warn("degraded", {
			component: "search",
		});

		expect(spy).toHaveBeenCalledOnce();

		const record = JSON.parse(spy.mock.calls[0][0] as string) as {
			level: string;
			message: string;
		};

		expect(record.level).toBe("warn");
		expect(record.message).toBe("degraded");
	});

	it("emits error records", () => {
		const spy = vi.spyOn(console, "error").mockImplementation(() => {});

		logger.error("request failed", {
			status: 500,
		});

		expect(spy).toHaveBeenCalledOnce();

		const record = JSON.parse(spy.mock.calls[0][0] as string) as {
			level: string;
			message: string;
			context: {
				status: number;
			};
		};

		expect(record.level).toBe("error");
		expect(record.message).toBe("request failed");
		expect(record.context.status).toBe(500);
	});
});
