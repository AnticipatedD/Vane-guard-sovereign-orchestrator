import { describe, expect, it } from "vitest";
import { getModelAuthor } from "./model-helpers";

describe("getModelAuthor", () => {
	it("extracts the author from the Cloudflare @cf format", () => {
		expect(
			getModelAuthor("@cf/meta/llama-3.1-8b-instruct"),
		).toBe("meta");
	});

	it("extracts the author from the catalog format", () => {
		expect(getModelAuthor("google/nano-banana")).toBe("google");
	});

	it("handles a model ID with only an author", () => {
		expect(getModelAuthor("meta")).toBe("meta");
	});

	it("falls back to the input for a malformed @-prefixed ID", () => {
		expect(getModelAuthor("@legacy")).toBe("@legacy");
	});

	it("handles an empty model ID without throwing", () => {
		expect(getModelAuthor("")).toBe("");
	});
});
