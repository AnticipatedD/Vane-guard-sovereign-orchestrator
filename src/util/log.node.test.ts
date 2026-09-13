import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createLogger } from "./log";

describe("createLogger", () => {
    beforeEach(() => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("logs info as structured JSON", () => {
        const log = createLogger({ service: "test" });
        log.info("hello", { requestId: "abc" });

        expect(console.log).toHaveBeenCalledTimes(1);
        const payload = JSON.parse(
            (console.log as unknown as { mock: { calls: string[][] } }).mock
                .calls[0][0],
        );
        expect(payload.level).toBe("info");
        expect(payload.message).toBe("hello");
        expect(payload.service).toBe("test");
        expect(payload.requestId).toBe("abc");
        expect(payload.timestamp).toBeTruthy();
    });

    it("logs warn via console.warn", () => {
        const log = createLogger();
        log.warn("caution");
        expect(console.warn).toHaveBeenCalledTimes(1);
    });

    it("logs error via console.error", () => {
        const log = createLogger();
        log.error("failed", { code: 500 });
        expect(console.error).toHaveBeenCalledTimes(1);
        const payload = JSON.parse(
            (console.error as unknown as { mock: { calls: string[][] } }).mock
                .calls[0][0],
        );
        expect(payload.level).toBe("error");
        expect(payload.code).toBe(500);
    });

    it("logs debug via console.log", () => {
        const log = createLogger();
        log.debug("detail");
        expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("merges default context with call context", () => {
        const log = createLogger({ app: "docs" });
        log.info("msg", { step: 1 });
        const payload = JSON.parse(
            (console.log as unknown as { mock: { calls: string[][] } }).mock
                .calls[0][0],
        );
        expect(payload.app).toBe("docs");
        expect(payload.step).toBe(1);
    });
});
