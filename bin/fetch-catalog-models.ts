import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import { parseArgs, isDeprecated } from "./fetch-catalog-models";

// Mock node:fs
vi.mock("node:fs", async () => {
    const actual = await vi.importActual<typeof import("node:fs")>("node:fs");
    return {
        ...actual,
        existsSync: vi.fn(),
        readFileSync: vi.fn(),
    };
});

describe("fetch-catalog-models utilities", () => {
    const originalArgv = process.argv;

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        process.argv = originalArgv;
    });

    describe("parseArgs", () => {
        it("should parse --file argument correctly", () => {
            process.argv = ["node", "script.ts", "--file", "catalog.json"];
            const args = parseArgs();
            expect(args.file).toBe("catalog.json");
        });

        it("should return empty object if --file is not present", () => {
            process.argv = ["node", "script.ts"];
            const args = parseArgs();
            expect(args.file).toBeUndefined();
        });
    });

    describe("isDeprecated", () => {
        it("should return false if no metadata or planned_deprecation_date exists", () => {
            const model: any = { model_id: "test", metadata: {} };
            expect(isDeprecated(model)).toBe(false);
        });

        it("should return true if planned_deprecation_date is in the past", () => {
            const model: any = {
                model_id: "test",
                metadata: { planned_deprecation_date: "2020-01-01T00:00:00Z" },
            };
            expect(isDeprecated(model)).toBe(true);
        });

        it("should return false if planned_deprecation_date is in the future", () => {
            const model: any = {
                model_id: "test",
                metadata: { planned_deprecation_date: "2099-01-01T00:00:00Z" },
            };
            expect(isDeprecated(model)).toBe(false);
        });
    });
});
