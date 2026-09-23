import { useState, useMemo } from "react";
import ModelBadges from "./ModelBadges";
import ModelFeatures from "./ModelFeatures";
import ModelInfo from "./ModelInfo";

export interface ModelItem {
	id: string;
	name: string;
	description: string;
	version: string;
	task: {
		name: string;
	};
	created_at: string;
	properties?: Record<string, unknown>;
	tags: string[];
}

interface ModelCatalogProps {
	models: ModelItem[];
}

export default function ModelCatalog({ models }: ModelCatalogProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	const filteredAndSortedModels = useMemo(() => {
		const filtered = models.filter((model) => {
			const query = searchTerm.toLowerCase();
			return (
				model.name.toLowerCase().includes(query) ||
				model.description.toLowerCase().includes(query) ||
				model.task.name.toLowerCase().includes(query) ||
				model.tags.some((tag) => tag.toLowerCase().includes(query))
			);
		});

		return filtered.sort((a, b) => {
			const dateA = new Date(a.created_at).getTime();
			const dateB = new Date(b.created_at).getTime();
			return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
		});
	}, [models, searchTerm, sortOrder]);

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<input
					type="text"
					className="w-full rounded-md border bg-neutral-50 p-2 px-3 dark:border-neutral-600 dark:bg-neutral-800 sm:max-w-md"
					placeholder="Search models by name, task, or tags..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<button
					type="button"
					onClick={() =>
						setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
					}
					className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700"
				>
					Sort by Date: {sortOrder === "desc" ? "Newest First" : "Oldest First"}
				</button>
			</div>

			{filteredAndSortedModels.length === 0 ? (
				<div className="py-12 text-center text-neutral-500">
					No models found matching "{searchTerm}"
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{filteredAndSortedModels.map((model) => (
						<div
							key={model.id}
							className="flex flex-col justify-between rounded-lg border border-neutral-200 p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
						>
							<div>
								<div className="flex items-center justify-between">
									<h3 className="text-lg font-bold">{model.name}</h3>
									<span className="text-xs text-neutral-400">v{model.version}</span>
								</div>
								<p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
									{model.description}
								</p>
								<div className="mt-4">
									<ModelBadges tags={model.tags} task={model.task.name} />
								</div>
								<div className="mt-4">
									<ModelFeatures properties={model.properties} />
								</div>
							</div>
							<div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
								<ModelInfo createdAt={model.created_at} id={model.id} />
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
