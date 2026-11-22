import type { AstroGlobal } from "astro";
import type { StarlightRouteData } from "@astrojs/starlight/route-data";
import { getEntry } from "astro:content";
import { externalLinkArrow } from "~/plugins/rehype/external-links";

type SidebarLink = Extract<StarlightRouteData["sidebar"][number], { type: "link" }> & {
	order?: number;
};
type SidebarGroup = Extract<StarlightRouteData["sidebar"][number], { type: "group" }> & {
	order?: number;
	hasActivePage?: boolean;
};
export type SidebarEntry = SidebarLink | SidebarGroup;

export async function getSidebar(context: AstroGlobal): Promise<SidebarGroup> {
	const segments = context.url.pathname.split("/").filter(Boolean);
	const product = segments[0];
	if (!product) {
		throw new Error(`[Sidebar] Splitting ${context.url.pathname} resulted in 0 segments`);
	}

	let group = context.locals.starlightRoute.sidebar.find(
		(entry) => entry.type === "group" && entry.label === product,
	) as SidebarGroup | undefined;
	if (product === "learning-paths" && segments[1] && group) {
		group = group.entries.find(
			(entry) => entry.type === "group" && entry.label === segments[1],
		) as SidebarGroup | undefined;
	}
	if (!group) throw new Error(`[Sidebar] Couldn't find a group for ${product}`);

	const result = await generateSidebar(structuredClone(group));
	setSidebarCurrentEntry(result.entries, context.url.pathname);
	return result;
}

export async function generateSidebar(group: SidebarGroup): Promise<SidebarGroup> {
	const entries = await Promise.all(
		group.entries.map(async (entry) => {
			if (entry.type === "group") return generateSidebar(entry as SidebarGroup);
			const link = entry as SidebarLink;
			const docId = link.href.replace(/^\/+|\/+$/g, "");
			const doc = await getEntry("docs", docId);
			if (doc) link.order = doc.data.sidebar.order ?? Number.MAX_VALUE;
			link.isCurrent = false;
			if (doc?.data.external_link && !doc.data.sidebar.group?.hideIndex) {
				link.label += externalLinkArrow;
				link.href = doc.data.external_link;
				link.attrs = { ...link.attrs, target: "_blank", "data-external-link": true };
			}
			return link;
		}),
	);
	group.entries = entries.sort(sortBySidebarOrder) as typeof group.entries;
	return group;
}

export function setSidebarCurrentEntry(sidebar: SidebarEntry[], pathname: string): boolean {
	for (const entry of sidebar) {
		if (entry.type === "group") {
			if (setSidebarCurrentEntry(entry.entries as SidebarEntry[], pathname)) {
				entry.hasActivePage = true;
				return true;
			}
			continue;
		}
		if (entry.attrs["data-external-link"]) continue;
		const trimSlash = (value: string) => value.endsWith("/") ? value.slice(0, -1) : value;
		if (trimSlash(entry.href) === trimSlash(pathname)) {
			entry.isCurrent = true;
			return true;
		}
	}
	return false;
}

export function flattenSidebar(sidebar: SidebarEntry[]): SidebarLink[] {
	return sidebar.flatMap((entry) => entry.type === "group"
		? flattenSidebar(entry.entries as SidebarEntry[])
		: [entry]);
}

export async function lookupProductTitle(product: string, module: string): Promise<string | undefined> {
	if (product === "learning-paths") {
		const entry = await getEntry("learning-paths", module);
		return entry?.data?.title ? `${entry.data.title} (Learning Paths)` : undefined;
	}
	const entry = await getEntry("directory", product === "1.1.1.1" ? "1111" : product);
	return entry?.data?.entry?.title ?? entry?.data?.name ?? "Unknown";
}

export function sortBySidebarOrder(a: any, b: any): number {
	const orderA = a.order ?? a.data?.sidebar?.order ?? Number.MAX_VALUE;
	const orderB = b.order ?? b.data?.sidebar?.order ?? Number.MAX_VALUE;
	if (orderA !== orderB) return orderA - orderB;
	return new Intl.Collator("en").compare(a.label ?? a.data?.title ?? "", b.label ?? b.data?.title ?? "");
}
