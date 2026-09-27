/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import SchemaTree from "./SchemaTree";
import type { SchemaRowData } from "./types";

// Minimal realistic schema tree used across tests
const sampleRows: SchemaRowData[] = [
    {
        id: "root-prompt",
        name: "prompt",
        type: "string",
        description: "The main user prompt",
        required: true,
        depth: 0,
    },
    {
        id: "root-options",
        name: "options",
        type: "object",
        description: "Advanced generation options",
        required: false,
        depth: 0,
        isObject: true,
        children: [
            {
                id: "options-temperature",
                name: "temperature",
                type: "number",
                description: "Sampling temperature",
                required: false,
                depth: 1,
                defaultValue: "0.7",
            },
            {
                id: "options-max-tokens",
                name: "max_tokens",
                type: "integer",
                description: "Maximum tokens to generate",
                required: false,
                depth: 1,
            },
        ],
    },
    {
        id: "root-stream",
        name: "stream",
        type: "boolean",
        description: "Enable streaming responses",
        required: false,
        depth: 0,
        defaultValue: "false",
    },
];

describe("SchemaTree", () => {
    beforeEach(() => {
        // sessionStorage mock
        const store: Record<string, string> = {};
        vi.stubGlobal("sessionStorage", {
            getItem: (key: string) => store[key] ?? null,
            setItem: (key: string, value: string) => {
                store[key] = value;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                Object.keys(store).forEach((k) => delete store[k]);
            },
        });
    });

    afterEach(() => {
        cleanup();
        vi.unstubAllGlobals();
    });

    it("renders all top-level parameter names", () => {
        render(<SchemaTree rows={sampleRows} schemaId="test-schema" />);

        expect(screen.getByText("prompt")).toBeTruthy();
        expect(screen.getByText("options")).toBeTruthy();
        expect(screen.getByText("stream")).toBeTruthy();
    });

    it("filters rows by search term and shows empty state when nothing matches", () => {
        render(<SchemaTree rows={sampleRows} schemaId="test-schema" />);

        const input = screen.getByPlaceholderText("Filter parameters...");
        fireEvent.change(input, { target: { value: "temperature" } });

        // Parent "options" stays visible because a child matches
        expect(screen.getByText("options")).toBeTruthy();
        // Unrelated top-level rows are filtered out
        expect(screen.queryByText("stream")).toBeNull();

        fireEvent.change(input, { target: { value: "zzzz-nonexistent" } });
        expect(screen.getByText("No parameters match your search.")).toBeTruthy();
    });

    it("highlights matching text inside parameter names", () => {
        render(<SchemaTree rows={sampleRows} schemaId="test-schema" />);

        const input = screen.getByPlaceholderText("Filter parameters...");
        fireEvent.change(input, { target: { value: "prompt" } });

        const mark = document.querySelector("mark");
        expect(mark).toBeTruthy();
        expect(mark?.textContent).toBe("prompt");
    });

    it("expands nested children when search matches a descendant", () => {
        render(<SchemaTree rows={sampleRows} schemaId="test-schema" />);

        // Before search the nested child is not in the document (lazy + collapsed)
        expect(screen.queryByText("temperature")).toBeNull();

        const input = screen.getByPlaceholderText("Filter parameters...");
        fireEvent.change(input, { target: { value: "temperature" } });

        // Search forces expand of ancestors so the match becomes visible
        expect(screen.getByText("temperature")).toBeTruthy();
        expect(screen.getByText("Sampling temperature")).toBeTruthy();
    });

    it("toggles expand/collapse on click and persists state to sessionStorage", () => {
        render(<SchemaTree rows={sampleRows} schemaId="test-schema" />);

        // options starts collapsed
        expect(screen.queryByText("temperature")).toBeNull();

        // Click the options row to expand
        const optionsLabel = screen.getByText("options");
        fireEvent.click(optionsLabel.closest("[role='button']")!);

        expect(screen.getByText("temperature")).toBeTruthy();
        expect(screen.getByText("max_tokens")).toBeTruthy();

        // sessionStorage should now contain the expanded node id
        const saved = sessionStorage.getItem("schema-expanded-test-schema");
        expect(saved).toBeTruthy();
        const parsed = JSON.parse(saved!);
        expect(parsed).toContain("root-options");
    });

    it("shows required badge when hideRequired is false", () => {
        render(
            <SchemaTree rows={sampleRows} schemaId="test-schema" hideRequired={false} />,
        );
        expect(screen.getByText("required")).toBeTruthy();
    });

    it("hides required badge when hideRequired is true", () => {
        render(
            <SchemaTree rows={sampleRows} schemaId="test-schema" hideRequired={true} />,
        );
        expect(screen.queryByText("required")).toBeNull();
    });
});
