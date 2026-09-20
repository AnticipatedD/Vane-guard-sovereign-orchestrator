import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SchemaTree from "./SchemaTree";
import type { SchemaRowData } from "./types";

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

describe("SchemaTree Component Suite", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <SchemaTree rows={createMockRows()} schemaId="test-schema" />
    );
    expect(container).toBeDefined();
  });

  it("shows top-level property names", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);
    expect(screen.getByText("user")).toBeInTheDocument();
  });

  it("expands nested objects when clicked", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const expandButtons = screen.getAllByRole("button");
    expect(expandButtons.length).toBeGreaterThan(0);

    fireEvent.click(expandButtons[0]);

    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("age")).toBeInTheDocument();
  });

  it("filters rows by search term (matchesSearch)", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "street" } });

    expect(screen.getByText(/street/i)).toBeInTheDocument();
  });

  it("highlights matching text using mark elements", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "user" } });

    const marks = document.querySelectorAll("mark");
    expect(marks.length).toBeGreaterThan(0);
  });

  it("auto-expands ancestors of matching nodes (getExpandedForSearch)", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "city" } });

    expect(screen.getByText(/city/i)).toBeInTheDocument();
  });

  it("hides non-matching nodes during search filtering", () => {
    render(<SchemaTree rows={createMockRows()} schemaId="test-schema" />);

    const searchInput = screen.getByRole("textbox");
    fireEvent.change(searchInput, { target: { value: "nonexistent_field_query" } });

    expect(screen.queryByText("street")).toBeNull();
    expect(screen.queryByText("city")).toBeNull();
  });
});
