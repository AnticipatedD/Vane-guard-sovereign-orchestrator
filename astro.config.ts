
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightDocSearch from "@astrojs/starlight-docsearch";
import starlightImageZoom from "starlight-image-zoom";
import liveCode from "astro-live-code";
import starlightLinksValidator from "starlight-links-validator";
import starlightScrollToTop from "starlight-scroll-to-top";
import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";

import remarkValidateImages from "./src/plugins/remark/validate-images";

import rehypeTitleFigure from "rehype-title-figure";
import rehypeMermaid from "./src/plugins/rehype/mermaid.ts";
import rehypeAutolinkHeadings from "./src/plugins/rehype/autolink-headings.ts";
import rehypeExternalLinks from "./src/plugins/rehype/external-links.ts";
import rehypeHeadingSlugs from "./src/plugins/rehype/heading-slugs.ts";
import rehypeShiftHeadings from "./src/plugins/rehype/shift-headings.ts";
import { createSitemapLastmodSerializer } from "./sitemap.serializer.ts";

import skills from "astro-skills";

import { isDisallowedByRobots } from "./src/util/robots.ts";

async function autogenSections() {
	const sections = (
		await readdir("./src/content/docs/", {
			withFileTypes: true,
		})
	)
		.filter((x) => x.isDirectory())
		.filter((x) => !["agent-setup"].includes(x.name))
		.map((x) => x.name);

	return sections.map((x) => ({
		label: x,
		items: [
			{
				autogenerate: {
					directory: x,
					collapsed: true,
				},
			},
		],
	}));
}

async function autogenStyles() {
	const styles = (
		await readdir("./src/styles/", {
			withFileTypes: true,
			recursive: true,
		})
	)
		.filter((x) => x.isFile())
		.map((x) => x.parentPath + x.name)
		.filter((x) => x !== "./src/styles/landing.css")
		.sort((a) => (a === "./src/styles/tailwind.css" ? -1 : 1));

	return styles;
}

async function getExternalLinkPaths(dir: string): Promise<Set<string>> {
	const paths = new Set<string>();
	const entries = await readdir(dir, { withFileTypes: true });

	for (const entry of entries) {
		const full = join(dir, entry.name);

		if (entry.isDirectory()) {
			for (const p of await getExternalLinkPaths(full)) {
				paths.add(p);
			}
		} else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
			const content = await readFile(full, "utf-8");
			const match = content.match(/^---\n([\s\S]*?)\n---/);

			if (match?.[1].includes("external_link:")) {
				let rel = full.slice("src/content/docs".length);
				rel = rel.replace(/\.(mdx|md)$/, "");
				rel = rel.replace(/\/index$/, "/");

				if (!rel.endsWith("/")) rel += "/";
				paths.add(rel.toLowerCase());
			}
		}
	}

	return paths;
}

const sidebar = await autogenSections();
const customCss = await autogenStyles();
const externalLinkPaths = await getExternalLinkPaths("src/content/docs");

const RUN_LINK_CHECK =
	process.env.RUN_LINK_CHECK?.toLowerCase() === "true" || false;

// Vane-Guard Sovereign Orchestrator — production site configuration.
export default defineConfig({
	site: "https://vane-guard-sovereign-orchestrator.harigov63.workers.dev",

	markdown: {
		smartypants: false,
		remarkPlugins: [remarkValidateImages],
		rehypePlugins: [
			rehypeMermaid,
			rehypeExternalLinks,
			rehypeHeadingSlugs,
			rehypeAutolinkHeadings,
			// @ts-expect-error plugins types are outdated but functional
			rehypeTitleFigure,
			rehypeShiftHeadings,
		],
	},

	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
			config: {
				limitInputPixels: false,
			},
		},
	},

	experimental: {
		contentIntellisense: true,
	},

	server: {
		port: 1111,
	},

	integrations: [
		starlight({
			title: "Vane-Guard Sovereign Orchestrator",

			logo: {
				src: "./src/assets/logo.svg",
			},

			favicon: "/favicon.png",

					social: [
			{
				icon: "github",
				label: "GitHub — Primary Architecture",
				href: "https://github.com/AnticipatedD",
			},
			{
				icon: "github",
				label: "GitHub — Principles",
				href: "https://github.com/myou260312-eng",
			},
			{
				icon: "linkedin",
				label: "LinkedIn",
				href: "https://www.linkedin.com/in/mdabul1008",
			},
			{
				icon: "open-book",
				label: "Microsoft Learn",
				href: "https://learn.microsoft.com/en-gb/users/mdhossain",
			},
			{
				icon: "approve-check-circle",
				label: "Credly — Professional",
				href: "https://www.credly.com/users/mdahossain/badges/credly",
			},
			{
				icon: "approve-check-circle",
				label: "Credly — Personal",
				href: "https://www.credly.com/users/mdhossain/badges/credly",
			},
			{
				icon: "openCollective",
				label: "Open Collective — Vane-Guard",
				href: "https://opencollective.com/vane-guard",
			},
			{
				icon: "information",
				label: "IMLC — Bangladesh Ambassador",
				href: "https://imlco.org/en/mhossain",
			},
			{
				icon: "facebook",
				label: "Facebook",
				href: "https://www.facebook.com/mdabulhossain1008",
			},
			{
				icon: "instagram",
				label: "Instagram",
				href: "https://www.instagram.com/mdabulhossain2026/",
			},
		],

		editLink: {
			baseUrl:
				"https://github.com/AnticipatedD/Vane-Guard-Sovereign-Orchestrator/edit/production/",
		},

			components: {
				Banner: "./src/components/overrides/Banner.astro",
				Footer: "./src/components/overrides/Footer.astro",
				Head: "./src/components/overrides/Head.astro",
				Header: "./src/components/overrides/Header.astro",
				Hero: "./src/components/overrides/Hero.astro",
				MarkdownContent: "./src/components/overrides/MarkdownContent.astro",
				Sidebar: "./src/components/overrides/Sidebar.astro",
				PageTitle: "./src/components/overrides/PageTitle.astro",
				SkipLink: "./src/components/overrides/SkipLink.astro",
				TableOfContents: "./src/components/overrides/TableOfContents.astro",
			},

			sidebar,
			customCss,
			pagination: false,

			plugins: [
				...(RUN_LINK_CHECK
					? [
							starlightLinksValidator({
								failOnError: false,
								errorOnInvalidHashes: false,
								errorOnLocalLinks: false,
								reporters: {
									json: true,
								},
								exclude: [
									"/api/",
									"/api/**",
									"/changelog/**",
									"/http/resources/**",
									"/llms.txt",
									"/llms-full.txt",
									"**/llms.txt",
									"**/index.md",
									"{props.*}",
									"/",
									"/glossary/",
									"/directory/",
									"/rules/snippets/examples/?operation=*",
									"/rules/transform/examples/?operation=*",
									"/ruleset-engine/rules-language/fields/reference/**",
									"/workers/examples/?languages=*",
									"/workers/llms-full.txt",
									"/workers-ai/models/**",
									"/markdown.zip",
									"/style-guide/index.md",
									"/agent-setup/",
									"/videos/**",
								],
							}),
						]
					: []),

				starlightDocSearch({
					clientOptionsModule: "./src/plugins/docsearch/index.ts",
				}),

				starlightImageZoom(),

				starlightScrollToTop({
					tooltipText: "Back to top",
					showTooltip: true,
					svgPath: "M12 6L6 12M12 6L18 12M12 12L6 18M12 12L18 18",
					showProgressRing: true,
					progressRingColor: "white",
					showOnHomepage: false,
				}),
			],

			lastUpdated: true,

			markdown: {
				headingLinks: false,
				processedDirs: ["./src/content/partials/", "./src/content/changelog/"],
			},

			disable404Route: true,
		}),

		liveCode({}),
		icon(),

		sitemap({
			filter(page) {
				if (page.includes("/style-guide/")) {
					return false;
				}

				if (page.endsWith("/404/")) {
					return false;
				}

				const pathname = new URL(page).pathname;

				if (externalLinkPaths.has(pathname)) {
					return false;
				}

				if (isDisallowedByRobots(pathname)) {
					return false;
				}

				return true;
			},

			serialize: createSitemapLastmodSerializer(),
		}),

		react(),
		skills(),
	],

	vite: {
		resolve: {
			alias: {
				"./Page.astro": fileURLToPath(
					new URL("./src/components/overrides/Page.astro", import.meta.url),
				),

				"../components/Page.astro": fileURLToPath(
					new URL("./src/components/overrides/Page.astro", import.meta.url),
				),

				"./SidebarSublist.astro": fileURLToPath(
					new URL(
						"./src/components/overrides/SidebarSublist.astro",
						import.meta.url,
					),
				),
			},
		},
	},
});
