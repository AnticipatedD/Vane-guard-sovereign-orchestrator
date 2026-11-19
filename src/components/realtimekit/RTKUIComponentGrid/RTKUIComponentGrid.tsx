import { useMemo, useState } from "react";
import RTKUIComponent from "../RTKUIComponent/RTKUIComponent";
import { createComponentLists, type ComponentItem } from "./data";

const componentGalleryImageModules = import.meta.glob(
	"../../../assets/images/realtime/realtimekit/web/components-gallery/*.svg",
	{ eager: true },
);
const componentGalleryImageSrcByFileName = Object.fromEntries(
	Object.entries(componentGalleryImageModules).map(([path, mod]) => {
		const fileName = path.split("/").pop() ?? "";
		const moduleValue = mod as { default?: { src?: string } | string };
		const defaultExport = moduleValue.default;
		return [fileName, typeof defaultExport === "object" ? defaultExport?.src ?? "" : defaultExport ?? ""];
	}),
) as Record<string, string>;
const imageSrc = (fileName: string) => componentGalleryImageSrcByFileName[fileName] ?? "";
const { basicComponents, uiComponents, compositeComponents, screenComponents } = createComponentLists(imageSrc);

const RTKUIComponentGrid = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const filterComponents = (components: ComponentItem[]) => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return components;
		return components.filter((component) =>
			component.name.toLowerCase().includes(query) ||
			component.componentName.toLowerCase().includes(query) ||
			component.tags.some((tag) => tag.toLowerCase().includes(query)),
		);
	};
	const filteredBasicComponents = useMemo(() => filterComponents(basicComponents), [searchTerm]);
	const filteredUiComponents = useMemo(() => filterComponents(uiComponents), [searchTerm]);
	const filteredCompositeComponents = useMemo(() => filterComponents(compositeComponents), [searchTerm]);
	const filteredScreenComponents = useMemo(() => filterComponents(screenComponents), [searchTerm]);
	const renderComponents = (components: ComponentItem[]) => (
		<div className="flex flex-wrap items-start gap-4">
			{components.map((component) => <RTKUIComponent key={component.id} id={component.id} name={component.name} imagePath={component.imagePath} componentName={component.componentName} />)}
		</div>
	);
	return (
		<div>
			<h2 className="mb-2 text-2xl font-bold">Component Gallery</h2>
			<p className="mb-4">Search through the component gallery for the component you need.</p>
			<input className="mb-2 w-full rounded-md border bg-neutral-50 p-1 px-2 dark:border-neutral-600 dark:bg-neutral-800" placeholder="Search for 'Chat'" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
			{searchTerm.trim() && !filteredBasicComponents.length && !filteredUiComponents.length && !filteredCompositeComponents.length && !filteredScreenComponents.length && <div className="py-8 text-center"><p className="text-gray-500">No components found for &quot;{searchTerm}&quot;</p><p className="mt-2 text-sm text-gray-400">Try searching for terms like &quot;grid&quot;, &quot;chat&quot;, &quot;button&quot;, or &quot;settings&quot;</p></div>}
			{filteredBasicComponents.length > 0 && <><h2 className="mb-2 text-2xl font-bold">Basic Components</h2><p className="mb-4">Small, reusable building blocks for your UI.</p>{renderComponents(filteredBasicComponents)}</>}
			{filteredUiComponents.length > 0 && <><h2 className="mb-2 text-2xl font-bold">UI Components</h2><p className="mb-4">Interactive controls and interface elements.</p>{renderComponents(filteredUiComponents)}</>}
			{filteredCompositeComponents.length > 0 && <><h2 className="mb-2 text-2xl font-bold">Composite Components</h2><p className="mb-4">Complete, feature-rich components combining multiple elements.</p>{renderComponents(filteredCompositeComponents)}</>}
			{filteredScreenComponents.length > 0 && <><h2 className="mb-2 text-2xl font-bold">Screen Components</h2><p className="mb-4">Full-screen views for different meeting states.</p>{renderComponents(filteredScreenComponents)}</>}
		</div>
	);
};
export default RTKUIComponentGrid;
