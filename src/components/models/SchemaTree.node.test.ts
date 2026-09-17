import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SchemaTree from "./SchemaTree";
import type { SchemaRowData } from "./types";

// Helper to create realistic nested rows
function createMockRows(): SchemaRowData[] {
  return [
    {
      id: "user",
      name: "user",
      type: "object",
      depth: 0,
      required: true,
      description: "User object",
      isObject: true,
      children: [
        {
          id: "user.name",
          name: "name",
          type: "string",
          depth: 1,
          required: true,
          description: "Full name of the user",
        },
        {
          id: "user.age",
          name: "age",
          type: "number",
          depth: 1,
          required: false,
          description: "Age in years",
        },
        {
          id: "user.address",
          name: "address",
          type: "object",
          depth: 1,
          isObject: true,
          description: "Shipping address",
          children: [
            {
              id: "user.address.street",
              name: "street",
              type: "string",
              depth: 2,
              description: "Street address",
            },
            {
              id: "user.address.city",
              name: "city",
              type: "string",
              depth: 2,
              description: "City name",
            },
          ],
        },
      ],
    },
  ];
}

describe("SchemaTree", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <SchemaTree rows={createMockRows()} schemaId="test-schema" />
    );
    expect(container).toBeTruthy();
  });

  it("shows top-level property names", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);
    expect(screen.getByText("user")).toBeTruthy();
  });

  it("expands nested objects when clicked", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    // The expandable row has role="button"
    const expandButtons = screen.getAllByRole("button");
    expect(expandButtons.length).toBeGreaterThan(0);

    fireEvent.click(expandButtons[0]);

    // After expand we should see child properties
    expect(screen.getByText("name")).toBeTruthy();
    expect(screen.getByText("age")).toBeTruthy();
  });

  it("filters rows by search term (matchesSearch)", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "street" } });

    // Should still find the matching nested field after search
    expect(screen.getByText(/street/i)).toBeTruthy();
  });

  it("highlights matching text", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "user" } });

    // The <mark> element is used for highlighting
    const marks = document.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);
  });

  it("auto-expands ancestors of matching nodes (getExpandedForSearch)", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "city" } });

    // Searching for a deeply nested field should expand parents
    expect(screen.getByText(/city/i)).toBeTruthy();
  });
});
