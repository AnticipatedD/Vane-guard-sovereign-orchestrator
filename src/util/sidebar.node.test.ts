import { describe, it, expect, vi } from "vitest";

vi.mock("astro:content", () => ({
    getCollection: vi.fn().mockResolvedValue([]),
    getEntry: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("~/plugins/rehype/external-links", () => ({
    externalLinkArrow: " ↗",
}));

import {
    flattenSidebar,
    sortBySidebarOrder,
    setSidebarCurrentEntry,
    type SidebarEntry,
} from "./sidebar";

function makeLink(
    href: string,
    label = "Link",
    extra: Partial<Extract<SidebarEntry, { type: "link" }>> = {},
): Extract<SidebarEntry, { type: "link" }> {
    return {
        type: "link",
        href,
        label,
        isCurrent: false,
        attrs: {},
        badge: undefined,
        order: 0,
        ...extra,
    };
}

function makeGroup(
    label: string,
    entries: SidebarEntry[],
    extra: Partial<Extract<SidebarEntry, { type: "group" }>> = {},
): Extract<SidebarEntry, { type: "group" }> {
    return {
        type: "group",
        label,
        entries,
        collapsed: false,
        badge: undefined,
        ...extra,
    };
}

describe("flattenSidebar", () => {
    it("returns empty array for empty sidebar", () => {
        expect(flattenSidebar([])).toEqual([]);
    });

    it("returns links as-is", () => {
        const links = [makeLink("/a/"), makeLink("/b/")];
        expect(flattenSidebar(links)).toEqual(links);
    });

    it("flattens nested groups into links", () => {
        const sidebar: SidebarEntry[] = [
            makeGroup("outer", [
                makeLink("/outer/"),
                makeGroup("inner", [makeLink("/outer/inner/")]),
            ]),
        ];
        const flat = flattenSidebar(sidebar);
        expect(flat.map((l) => l.href)).toEqual(["/outer/", "/outer/inner/"]);
    });

    it("handles mixed top-level links and groups", () => {
        const sidebar: SidebarEntry[] = [
            makeLink("/root/"),
            makeGroup("g", [makeLink("/g/one/")]),
        ];
        expect(flattenSidebar(sidebar).map((l) => l.href)).toEqual([
            "/root/",
            "/g/one/",
        ]);
    });

    it("preserves link attributes through flattening", () => {
        const link = makeLink("/x/", "X", {
            attrs: { "data-hide-children": true },
        });
        const flat = flattenSidebar([makeGroup("g", [link])]);
        expect(flat[0].attrs["data-hide-children"]).toBe(true);
    });
});

describe("sortBySidebarOrder", () => {
    it("sorts by order ascending", () => {
        const a = { order: 2, label: "B" };
        const b = { order: 1, label: "A" };
        expect([a, b].sort(sortBySidebarOrder)).toEqual([b, a]);
    });

    it("falls back to label when order is equal", () => {
        const a = { order: 1, label: "Zebra" };
        const b = { order: 1, label: "Apple" };
        expect([a, b].sort(sortBySidebarOrder)).toEqual([b, a]);
    });

    it("treats missing order as Number.MAX_VALUE", () => {
        const a = { label: "NoOrder" };
        const b = { order: 1, label: "HasOrder" };
        expect([a, b].sort(sortBySidebarOrder)).toEqual([b, a]);
    });

    it("is stable for identical order and label", () => {
        const a = { order: 1, label: "Same" };
        const b = { order: 1, label: "Same" };
        expect(sortBySidebarOrder(a, b)).toBe(0);
    });

    it("handles data.sidebar.order shape", () => {
        const a = { data: { sidebar: { order: 5 }, title: "Z" } };
        const b = { data: { sidebar: { order: 1 }, title: "A" } };
        expect([a, b].sort(sortBySidebarOrder)).toEqual([b, a]);
    });
});

describe("setSidebarCurrentEntry", () => {
    it("marks a matching link as current", () => {
        const sidebar: SidebarEntry[] = [makeLink("/workers/"), makeLink("/pages/")];
        const found = setSidebarCurrentEntry(sidebar, "/workers/");
        expect(found).toBe(true);
        expect((sidebar[0] as any).isCurrent).toBe(true);
        expect((sidebar[1] as any).isCurrent).toBe(false);
    });

    it("matches with or without trailing slash", () => {
        const sidebar: SidebarEntry[] = [makeLink("/workers")];
        expect(setSidebarCurrentEntry(sidebar, "/workers/")).toBe(true);
        expect((sidebar[0] as any).isCurrent).toBe(true);
    });

    it("sets hasActivePage on ancestor groups", () => {
        const sidebar: SidebarEntry[] = [
            makeGroup("workers", [
                makeLink("/workers/"),
                makeLink("/workers/get-started/"),
            ]),
        ];
        const found = setSidebarCurrentEntry(sidebar, "/workers/get-started/");
        expect(found).toBe(true);
        expect((sidebar[0] as any).hasActivePage).toBe(true);
        expect((sidebar[0] as any).entries[1].isCurrent).toBe(true);
    });

    it("skips external links", () => {
        const sidebar: SidebarEntry[] = [
            makeLink("https://example.com", "Ext", {
                attrs: { "data-external-link": true },
            }),
            makeLink("/workers/"),
        ];
        setSidebarCurrentEntry(sidebar, "https://example.com");
        expect((sidebar[0] as any).isCurrent).toBe(false);
    });

    it("returns false when no match is found", () => {
        const sidebar: SidebarEntry[] = [makeLink("/workers/")];
        expect(setSidebarCurrentEntry(sidebar, "/pages/")).toBe(false);
    });
});
