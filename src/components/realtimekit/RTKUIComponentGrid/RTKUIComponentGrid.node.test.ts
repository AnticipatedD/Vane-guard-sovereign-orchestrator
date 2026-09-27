import { describe, it, expect } from "vitest";
import { createComponentLists, type ComponentItem } from "./RTKUIComponentGrid";

const identitySrc = (fileName: string) => `/images/${fileName}`;

describe("createComponentLists", () => {
    const lists = createComponentLists(identitySrc);

    it("returns all four component categories", () => {
        expect(lists).toHaveProperty("basicComponents");
        expect(lists).toHaveProperty("uiComponents");
        expect(lists).toHaveProperty("compositeComponents");
        expect(lists).toHaveProperty("screenComponents");
    });

    it("returns expected counts for each category", () => {
        expect(lists.basicComponents).toHaveLength(11);
        expect(lists.uiComponents).toHaveLength(11);
        expect(lists.compositeComponents).toHaveLength(16);
        expect(lists.screenComponents).toHaveLength(4);
    });

    it("every item has required ComponentItem fields", () => {
        const all: ComponentItem[] = [
            ...lists.basicComponents,
            ...lists.uiComponents,
            ...lists.compositeComponents,
            ...lists.screenComponents,
        ];

        for (const item of all) {
            expect(item.id).toBeTruthy();
            expect(item.name).toBeTruthy();
            expect(item.componentName).toBeTruthy();
            expect(item.imagePath).toMatch(/^\/images\/.+\.svg$/);
            expect(Array.isArray(item.tags)).toBe(true);
            expect(item.tags.length).toBeGreaterThan(0);
        }
    });

    it("basic components include expected ids and tags", () => {
        const ids = lists.basicComponents.map((c) => c.id);
        expect(ids).toContain("rtk-avatar");
        expect(ids).toContain("rtk-button");
        expect(ids).toContain("rtk-header");

        const avatar = lists.basicComponents.find((c) => c.id === "rtk-avatar")!;
        expect(avatar.tags).toEqual(expect.arrayContaining(["participant", "tile", "grid"]));
    });

    it("ui components include controlbar and dialog entries", () => {
        const ids = lists.uiComponents.map((c) => c.id);
        expect(ids).toContain("rtk-controlbar");
        expect(ids).toContain("rtk-dialog");
        expect(ids).toContain("rtk-participant-tile");
    });

    it("composite components include grid and settings variants", () => {
        const ids = lists.compositeComponents.map((c) => c.id);
        expect(ids).toContain("rtk-grid");
        expect(ids).toContain("rtk-settings");
        expect(ids).toContain("rtk-settings-audio");
        expect(ids).toContain("rtk-settings-video");
        expect(ids).toContain("rtk-sidebar");
    });

    it("screen components cover the four meeting lifecycle screens", () => {
        const ids = lists.screenComponents.map((c) => c.id);
        expect(ids).toEqual(
            expect.arrayContaining([
                "rtk-ended-screen",
                "rtk-idle-screen",
                "rtk-meeting",
                "rtk-setup-screen",
            ]),
        );
        expect(ids).toHaveLength(4);
    });

    it("imageSrc helper is applied to every imagePath", () => {
        const customSrc = (file: string) => `https://cdn.example.com/${file}`;
        const customLists = createComponentLists(customSrc);

        const all = [
            ...customLists.basicComponents,
            ...customLists.uiComponents,
            ...customLists.compositeComponents,
            ...customLists.screenComponents,
        ];

        for (const item of all) {
            expect(item.imagePath.startsWith("https://cdn.example.com/")).toBe(true);
            expect(item.imagePath.endsWith(".svg")).toBe(true);
        }
    });
});
