import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterDropdown, SortSelect } from "./ModelCatalog";

describe("FilterDropdown", () => {
    const items = [
        { value: "text-generation", label: "Text Generation" },
        { value: "image", label: "Image" },
        { value: "embedding", label: "Embedding" },
    ];

    it("renders the label when nothing is selected", () => {
        render(
            <FilterDropdown
                label="Task Types"
                items={items}
                selected={[]}
                onChange={() => {}}
            />,
        );
        expect(screen.getByText("Task Types")).toBeTruthy();
    });

    it("shows selection count when items are selected", () => {
        render(
            <FilterDropdown
                label="Task Types"
                items={items}
                selected={["text-generation", "image"]}
                onChange={() => {}}
            />,
        );
        expect(screen.getByText("Task Types (+2)")).toBeTruthy();
    });

    it("updates display when selected prop changes", () => {
        const onChange = vi.fn();
        const { rerender } = render(
            <FilterDropdown
                label="Task Types"
                items={items}
                selected={[]}
                onChange={onChange}
            />,
        );

        rerender(
            <FilterDropdown
                label="Task Types"
                items={items}
                selected={["embedding"]}
                onChange={onChange}
            />,
        );
        expect(screen.getByText("Task Types (+1)")).toBeTruthy();
    });

    it("renders with empty items list", () => {
        render(
            <FilterDropdown
                label="Authors"
                items={[]}
                selected={[]}
                onChange={() => {}}
            />,
        );
        expect(screen.getByText("Authors")).toBeTruthy();
    });

    it("accepts multiple selected values", () => {
        render(
            <FilterDropdown
                label="Capabilities"
                items={items}
                selected={["text-generation", "embedding"]}
                onChange={() => {}}
            />,
        );
        expect(screen.getByText("Capabilities (+2)")).toBeTruthy();
    });
});

describe("SortSelect", () => {
    it("renders Newest first by default", () => {
        render(<SortSelect sortOrder="newest" onChange={() => {}} />);
        expect(screen.getByText("Newest first")).toBeTruthy();
    });

    it("renders Oldest first when sortOrder is oldest", () => {
        render(<SortSelect sortOrder="oldest" onChange={() => {}} />);
        expect(screen.getByText("Oldest first")).toBeTruthy();
    });

    it("stays controlled when sortOrder prop changes", () => {
        const { rerender } = render(
            <SortSelect sortOrder="newest" onChange={() => {}} />,
        );
        expect(screen.getByText("Newest first")).toBeTruthy();

        rerender(<SortSelect sortOrder="oldest" onChange={() => {}} />);
        expect(screen.getByText("Oldest first")).toBeTruthy();
    });

    it("does not crash with rapid re-renders", () => {
        const { rerender } = render(
            <SortSelect sortOrder="newest" onChange={() => {}} />,
        );
        rerender(<SortSelect sortOrder="oldest" onChange={() => {}} />);
        rerender(<SortSelect sortOrder="newest" onChange={() => {}} />);
        expect(screen.getByText("Newest first")).toBeTruthy();
    });

    it("accepts onChange callback", () => {
        const onChange = vi.fn();
        render(<SortSelect sortOrder="newest" onChange={onChange} />);
        expect(screen.getByText("Newest first")).toBeTruthy();
    });
});
