import { defineConfig, defineProject } from "vitest/config";
import { cloudflareTest } from "@cloudflare/vitest-pool-workers";
import { getViteConfig } from "astro/config";

import tsconfigPaths from "vite-tsconfig-paths";

const coverage = {
	provider: "v8" as const,
	reporter: ["text", "json", "html"] as const,
	reportsDirectory: "./coverage",
	exclude: [
		"**/*.d.ts",
		"**/*.config.*",
		"**/node_modules/**",
		"**/dist/**",
		"**/.astro/**",
		"**/.flue/**",
		"**/coverage/**",
		"**/worker-configuration.d.ts",
		"**/env.d.ts",
		"**/test/**",
		"**/*.test.ts",
		"**/*.spec.ts",
	],
	thresholds: {
		lines: 50,
		functions: 50,
		branches: 50,
		statements: 50,
	},
};

export default defineConfig({
	test: {
		coverage,
		projects: [
			defineConfig({
				plugins: [
					cloudflareTest({
						wrangler: { configPath: "./wrangler.jsonc" },
					}),
				],
				test: {
					name: "Workers",
					include: ["**/*.worker.test.ts"],
					deps: {
						optimizer: {
							ssr: {
								enabled: true,
								include: ["node-html-parser", "yaml"],
							},
						},
					},
				},
			}),
			defineProject({
				test: {
					name: "Node",
					include: ["**/*.node.test.ts"],
					environment: "happy-dom",
				},
				plugins: [tsconfigPaths()],
			}),
			getViteConfig({
				test: {
					name: "Astro",
					include: ["**/*.astro.test.ts"],
				},
				plugins: [tsconfigPaths()],
			}),
		],
	},
});
