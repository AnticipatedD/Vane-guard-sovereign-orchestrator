import { describe, expect, it } from "vitest";
import { generateDescription, generateTableOfContents } from "./props";

describe("generateTableOfContents", () => {
	it("always creates the overview entry", async () => {
		const result = await generateTableOfContents("");

		expect(result).toEqual([
			{
				text: "Overview",
				slug: "_top",
				depth: 1,
				children: [],
			},
		]);
	});

	it("creates an overview and nested heading entries", async () => {
		const result = await generateTableOfContents(
			'<h2 id="intro">Introduction</h2><h3 id="setup">Setup</h3>',
		);

		expect(result[0]).toMatchObject({
			text: "Overview",
			slug: "_top",
			depth: 1,
		});

		expect(result[1]).toMatchObject({
			text: "Introduction",
			slug: "intro",
			depth: 2,
		});

		expect(result[1].children[0]).toMatchObject({
			text: "Setup",
			slug: "setup",
			depth: 3,
		});
	});

	it("decodes HTML entities in heading text", async () => {
		const result = await generateTableOfContents(
			'<h2 id="special">Tom &amp; Jerry</h2>',
		);

		expect(result[1].text).toBe("Tom & Jerry");
	});

	it("ignores the generated footnote heading", async () => {
		const result = await generateTableOfContents(
			'<h2 id="footnote-label">Footnotes</h2><h2 id="real">Real</h2>',
		);

		expect(result.map((item) => item.slug)).toEqual(["_top", "real"]);
	});

	it("ignores headings that are not h2 or h3", async () => {
		const result = await generateTableOfContents(
			'<h1 id="title">Title</h1><h4 id="details">Details</h4>',
		);

		expect(result).toHaveLength(1);
	});
});

describe("generateDescription", () => {
	it("prefers stripped markdown", async () => {
		await expect(
			generateDescription({
				markdown: "**Hello** _world_",
				html: "<p>HTML fallback</p>",
			}),
		).resolves.toBe("Hello world");
	});

	it("strips markdown syntax", async () => {
		await expect(
			generateDescription({
				markdown: "# Heading\n\nA [useful](https://example.com) description.",
			}),
		).resolves.toContain("A useful description.");
	});

	it("falls back to the first root paragraph in HTML", async () => {
		await expect(
			generateDescription({
				html: "<p>Hello &amp; world</p><p>ignored</p>",
			}),
		).resolves.toBe("Hello & world");
	});

	it("returns undefined when no description source exists", async () => {
		await expect(
			generateDescription({}),
		).resolves.toBeUndefined();
	});

	it("returns undefined when HTML has no root paragraph", async () => {
		await expect(
			generateDescription({
				html: "<div><p>Nested paragraph</p></div>",
			}),
		).resolves.toBeUndefined();
	});
});
