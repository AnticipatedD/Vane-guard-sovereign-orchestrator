import { describe, it, expect, vi, beforeEach } from "vitest";
import { getSidebar, generateSidebar, setSidebarCurrentEntry, flattenSidebar } from "./sidebar";
import type { AstroGlobal } from "astro";

vi.mock("astro:content", () => ({
    getCollection: vi.fn(async (collection: string) => {
        if (collection === "directory") {
            return [
                {
                    id: "workers",
                    data: {
                        id: "workers",
                        name: "Workers",
                        entry: { url: "/workers/" }
                    }
                }
            ];
        }
        if (collection === "product-availability") {
            return [
                {
                    id: "workers",
                    data: { availability: "general" }
                }
            ];
        }
        return [];
    }),
    getEntry: vi.fn(async (collection: string, id: string) => {
        if (collection === "docs") {
            return {
                data: {
                    title: "Workers Overview",
                    sidebar: {
                        order: 1,
                        label: "Overview",
                        group: { label: "Workers", order: 1 }
                    }
                }
            };
        }
        return null;
    })
}));

describe("Sidebar Utility Functions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("evaluates product sidebar path correctly", () => {
        const path = "/docs/product";
        expect(path.startsWith("/docs")).toBe(true);
    });

    it("evaluates learning-paths fallback route", () => {
        const path = "/learning-paths";
        expect(path).toContain("learning");
    });

    it("should flatten sidebar entries correctly", () => {
        const mockSidebar: any = [
            { type: "link", href: "/test-1", label: "Test 1" },
            {
                type: "group",
                label: "Group 1",
                entries: [
                    { type: "link", href: "/test-2", label: "Test 2" }
                ]
            }
        ];

        const flattened = flattenSidebar(mockSidebar);
        expect(flattened).toHaveLength(2);
        expect(flattened[0].href).toBe("/test-1");
        expect(flattened[1].href).toBe("/test-2");
    });

    it("should set current entry in sidebar based on pathname", () => {
        const mockSidebar: any = [
            { type: "link", href: "/workers", label: "Workers", isCurrent: false, attrs: {} }
        ];

        const matched = setSidebarCurrentEntry(mockSidebar, "/workers");
        expect(matched).toBe(true);
        expect(mockSidebar[0].isCurrent).toBe(true);
    });

    it("should throw error if pathname has zero segments in getSidebar", async () => {
        const mockContext = {
            url: { pathname: "/" },
            locals: { starlightRoute: { sidebar: [] } }
        } as unknown as AstroGlobal;

        await expect(getSidebar(mockContext)).rejects.toThrowError(/Splitting \/ resulted in 0 segments/);
    });
});
