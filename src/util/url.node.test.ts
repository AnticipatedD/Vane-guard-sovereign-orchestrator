import { beforeEach, describe, expect, it } from "vitest";
import { setSearchParams } from "./url";

describe("setSearchParams", () => {
	beforeEach(() => {
		history.replaceState(null, "", "/docs/example");
	});

	it("updates the query string when parameters exist", () => {
		setSearchParams(
			new URLSearchParams([
				["search", "hello world"],
			]),
		);

		expect(window.location.pathname).toBe("/docs/example");
		expect(window.location.search).toBe("?search=hello+world");
	});

	it("preserves multiple query parameters", () => {
		setSearchParams(
			new URLSearchParams([
				["search", "hello"],
				["page", "2"],
			]),
		);

		expect(window.location.search).toBe("?search=hello&page=2");
	});

	it("clears the query string when parameters are empty", () => {
		history.replaceState(
			null,
			"",
			"/docs/example?old=value",
		);

		setSearchParams(new URLSearchParams());

		expect(window.location.pathname).toBe("/docs/example");
		expect(window.location.search).toBe("");
	});
});
