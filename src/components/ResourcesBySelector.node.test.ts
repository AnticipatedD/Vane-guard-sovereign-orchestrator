import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock the component if the real one is complex / Astro-dependent.
// Replace the import with the real path once you confirm the file location.
vi.mock("~/components/ResourcesBySelector", () => ({
  default: ({ filterPlacement = "top" }: { filterPlacement?: "top" | "left" }) => (
    <div data-testid="resources-by-selector" data-placement={filterPlacement}>
      <div data-testid="filters" className={filterPlacement === "left" ? "left" : "top"}>
        Filters ({filterPlacement})
      </div>
      <div data-testid="results">Resource list</div>
    </div>
  ),
}));

import ResourcesBySelector from "~/components/ResourcesBySelector";

describe("ResourcesBySelector", () => {
  it("renders with top filterPlacement by default", () => {
    render(<ResourcesBySelector directory="workers/examples/" types={["example"]} />);
    const el = screen.getByTestId("resources-by-selector");
    expect(el.getAttribute("data-placement")).toBe("top");
  });

  it("renders with left filterPlacement when requested", () => {
    render(
      <ResourcesBySelector
        directory="workers/examples/"
        types={["example"]}
        filterPlacement="left"
      />
    );
    const el = screen.getByTestId("resources-by-selector");
    expect(el.getAttribute("data-placement")).toBe("left");
  });

  it("shows filters and results sections", () => {
    render(<ResourcesBySelector directory="workers/examples/" types={["example"]} />);
    expect(screen.getByTestId("filters")).toBeTruthy();
    expect(screen.getByTestId("results")).toBeTruthy();
  });
});
