import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("Algolia configuration", () => {
	beforeEach(() => {
		vi.resetModules();
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("fails clearly when the API key is absent", async () => {
		vi.stubEnv("ALGOLIA_APP_ID", "test-app");
		vi.stubEnv("ALGOLIA_API_KEY", "");

		await expect(import("./algolia")).rejects.toThrow(
			/Missing required environment variable ALGOLIA_API_KEY/,
		);
	});

	it("loads credentials from the environment", async () => {
		vi.stubEnv("ALGOLIA_APP_ID", "test-app");
		vi.stubEnv("ALGOLIA_API_KEY", "test-key");

		const module = await import("./algolia");

		expect(module.ALGOLIA_APP_ID).toBe("test-app");
		expect(module.ALGOLIA_API_KEY).toBe("test-key");
	});

	it("uses default index names when optional values are absent", async () => {
		vi.stubEnv("ALGOLIA_APP_ID", "test-app");
		vi.stubEnv("ALGOLIA_API_KEY", "test-key");
		vi.stubEnv("ALGOLIA_INDEX", "");
		vi.stubEnv("ALGOLIA_INDEX_STYLE_GUIDE", "");

		const module = await import("./algolia");

		expect(module.ALGOLIA_INDEX).toBe("prod_devdocs");
		expect(module.ALGOLIA_INDEX_STYLE_GUIDE).toBe(
			"prod_devdocs_styleguide",
		);
	});
});
