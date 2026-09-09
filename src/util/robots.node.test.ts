import { describe, expect, it } from "vitest";
import { isDisallowedByRobots } from "./robots";

describe("isDisallowedByRobots", () => {
	it("allows the site root", () => {
		expect(isDisallowedByRobots("/")).toBe(false);
	});

	it("matches checked-in disallowed path prefixes", () => {
		expect(isDisallowedByRobots("/cdn-cgi/")).toBe(true);
		expect(isDisallowedByRobots("/cdn-cgi/something")).toBe(true);
		expect(isDisallowedByRobots("/plans/")).toBe(true);
		expect(isDisallowedByRobots("/plans/example")).toBe(true);
	});

	it("does not reject an unrelated path", () => {
		expect(
			isDisallowedByRobots("/this-path-should-not-be-disallowed"),
		).toBe(false);
	});

	it("does not treat a similar but unrelated prefix as disallowed", () => {
		expect(isDisallowedByRobots("/planning")).toBe(false);
	});
});
