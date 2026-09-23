import { useState, useMemo } from "react";
import RTKUIComponent from "../RTKUIComponent/RTKUIComponent";
import { createComponentLists, ComponentItem } from "./data";

const componentGalleryImageModules = import.meta.glob(
	"../../../assets/images/realtime/realtimekit/web/components-gallery/*.svg",
	{ eager: true },
);

const componentGalleryImageSrcByFileName = Object.fromEntries(
	Object.entries(componentGalleryImageModules).map(([path, mod]) => {
		const fileName = path.split("/").pop() as string;
		const defaultExport = (mod as any).default;
		const src = defaultExport?.src ?? defaultExport;
		return [fileName, src];
	}),
) as Record<string, string>;

const imageSrc = (fileName: string) =>
	componentGalleryImageSrcByFileName[fileName];

const { basicComponents, uiComponents, compositeComponents, screenComponents } =
	createComponentLists(imageSrc);

const RTKUIComponentGrid = () => {
	const [searchTerm, setSearchTerm] = useState("");

	// Filter function to search through components
	const filterComponents = (components: ComponentItem[]) => {
		if (!searchTerm.trim()) return components;

		const lowercaseSearch = searchTerm.toLowerCase();
		return components.filter((component) => {
			if (component.name.toLowerCase().includes(lowercaseSearch)) return true;
			if (component.componentName.toLowerCase().includes(lowercaseSearch))
				return true;
			if (
				component.tags.some((tag) =>
					tag.toLowerCase().includes(lowercaseSearch),
				)
			)
				return true;
			return false;
		});
	};

	const filteredBasicComponents = useMemo(
		() => filterComponents(basicComponents),
		[searchTerm],
	);
	const filteredUiComponents = useMemo(
		() => filterComponents(uiComponents),
		[searchTerm],
	);
	const filteredCompositeComponents = useMemo(
		() => filterComponents(compositeComponents),
		[searchTerm],
	);
	const filteredScreenComponents = useMemo(
		() => filterComponents(screenComponents),
		[searchTerm],
	);

	return (
		<div>
			<h2 className="mb-2 text-2xl font-bold">Component Gallery</h2>
			<p className="mb-4">
				Search through the component gallery for the component you need.
			</p>
			<input
				className="mb-2 w-full rounded-md border bg-neutral-50 p-1 px-2 dark:border-neutral-600 dark:bg-neutral-800"
				placeholder="Search for 'Chat'"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>

			{searchTerm.trim() &&
				filteredBasicComponents.length === 0 &&
				filteredUiComponents.length === 0 &&
				filteredCompositeComponents.length === 0 &&
				filteredScreenComponents.length === 0 && (
					<div className="py-8 text-center">
						<p className="text-gray-500">
							No components found for "{searchTerm}"
						</p>
						<p className="mt-2 text-sm text-gray-400">
							Try searching for terms like "grid", "chat", "button", or
							"settings"
						</p>
					</div>
				)}

			{filteredBasicComponents.length > 0 && (
				<>
					<h2 className="mb-2 text-2xl font-bold">Basic Components</h2>
					<p className="mb-4">Small, reusable building blocks for your UI.</p>
					<div className="flex flex-wrap items-start gap-4">
						{filteredBasicComponents.map((component) => (
							<RTKUIComponent
								key={component.id}
								id={component.id}
								name={component.name}
								imagePath={component.imagePath}
								componentName={component.componentName}
							/>
						))}
					</div>
				</>
			)}

			{filteredUiComponents.length > 0 && (
				<>
					<h2 className="mb-2 text-2xl font-bold">UI Components</h2>
					<p className="mb-4">Interactive controls and interface elements.</p>
					<div className="flex flex-wrap items-start gap-4">
						{filteredUiComponents.map((component) => (
							<RTKUIComponent
								key={component.id}
								id={component.id}
								name={component.name}
								imagePath={component.imagePath}
								componentName={component.componentName}
							/>
						))}
					</div>
				</>
			)}

			{filteredCompositeComponents.length > 0 && (
				<>
					<h2 className="mb-2 text-2xl font-bold">Composite Components</h2>
					<p className="mb-4">
						Complete, feature-rich components combining multiple elements.
					</p>
					<div className="flex flex-wrap items-start gap-4">
						{filteredCompositeComponents.map((component) => (
							<RTKUIComponent
								key={component.id}
								id={component.id}
								name={component.name}
								imagePath={component.imagePath}
								componentName={component.componentName}
							/>
						))}
					</div>
				</>
			)}

			{filteredScreenComponents.length > 0 && (
				<>
					<h2 className="mb-2 text-2xl font-bold">Screen Components</h2>
					<p className="mb-4">
						Full-screen views for different meeting states.
					</p>
					<div className="flex flex-wrap items-start gap-4">
						{filteredScreenComponents.map((component) => (
							<RTKUIComponent
								key={component.id}
								id={component.id}
								name={component.name}
								imagePath={component.imagePath}
								componentName={component.componentName}
							/>
						))}
					</div>
				</>
			)}
		</div>
	);
};

export default RTKUIComponentGrid;
