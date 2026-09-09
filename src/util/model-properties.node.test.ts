import { describe, expect, it } from "vitest";
import {
	getAllCapabilityLabels,
	getCapabilities,
	getCategoryForLabel,
	getLabelsByCategory,
	hasProperty,
} from "./model-properties";

type TestProperty = {
	property_id: string;
	value: string;
};

const model = (properties: TestProperty[]) =>
	({ properties }) as never;

describe("model property utilities", () => {
	it("extracts enabled capability labels", () => {
		expect(
			getCapabilities([
				{ property_id: "vision", value: "true" },
				{ property_id: "reasoning", value: "false" },
				{ property_id: "unknown", value: "true" },
			] as never),
		).toEqual(["Vision"]);
	});

	it("ignores known properties whose value is not true", () => {
		expect(
			getCapabilities([
				{ property_id: "vision", value: "false" },
				{ property_id: "reasoning", value: "false" },
				{ property_id: "lora", value: "false" },
			] as never),
		).toEqual([]);
	});

	it("checks an individual property", () => {
		expect(
			hasProperty(
				[{ property_id: "reasoning", value: "true" }] as never,
				"reasoning",
			),
		).toBe(true);

		expect(
			hasProperty(
				[{ property_id: "reasoning", value: "false" }] as never,
				"reasoning",
			),
		).toBe(false);
	});

	it("returns false for an absent property", () => {
		expect(
			hasProperty(
				[{ property_id: "vision", value: "true" }] as never,
				"reasoning",
			),
		).toBe(false);
	});

	it("returns unique capability labels", () => {
		expect(
			getAllCapabilityLabels([
				model([{ property_id: "vision", value: "true" }]),
				model([{ property_id: "vision", value: "true" }]),
				model([{ property_id: "reasoning", value: "true" }]),
			]),
		).toEqual(["Vision", "Reasoning"]);
	});

	it("groups labels by model and platform category", () => {
		const models = [
			model([
				{ property_id: "vision", value: "true" },
				{ property_id: "lora", value: "true" },
			]),
		];

		expect(getLabelsByCategory(models, "model")).toEqual(["Vision"]);
		expect(getLabelsByCategory(models, "platform")).toEqual(["LoRA"]);
	});

	it("deduplicates labels within a category", () => {
		const models = [
			model([{ property_id: "vision", value: "true" }]),
			model([{ property_id: "vision", value: "true" }]),
		];

		expect(getLabelsByCategory(models, "model")).toEqual(["Vision"]);
	});

	it("maps labels back to their category", () => {
		expect(getCategoryForLabel("Vision")).toBe("model");
		expect(getCategoryForLabel("LoRA")).toBe("platform");
		expect(getCategoryForLabel("Real-time")).toBe("platform");
		expect(getCategoryForLabel("Not real")).toBeUndefined();
	});
});
