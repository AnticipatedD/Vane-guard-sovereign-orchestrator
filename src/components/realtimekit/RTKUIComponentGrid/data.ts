export interface ComponentItem {
	id: string;
	name: string;
	imagePath: string;
	componentName: string;
	tags: string[];
}

export function createComponentLists(imageSrc: (fileName: string) => string) {
	const definitions: Array<[string, string, string[]]> = [
		["rtk-avatar", "Avatar", ["participant", "tile", "grid"]],
		["rtk-audio-visualizer", "Audio Visualizer", ["participant", "audio", "visualizer", "grid"]],
		["rtk-button", "Button", ["button", "controlbar"]],
		["rtk-clock", "Clock", ["clock", "header", "sidebar"]],
		["rtk-controlbar", "Control Bar", ["controlbar", "button"]],
		["rtk-controlbar-button", "Control Bar Button", ["controlbar", "button"]],
		["rtk-dialog", "Dialog", ["dialog", "modal", "popup"]],
		["rtk-emoji-picker", "Emoji Picker", ["emoji-picker", "sidebar", "chat", "message"]],
		["rtk-grid", "Grid", ["grid", "participant", "tile", "layout"]],
		["rtk-menu", "Menu", ["menu", "sidebar", "button"]],
		["rtk-notification", "Notification", ["notification", "sidebar", "popup", "chat"]],
		["rtk-participant-tile", "Participant Tile", ["participant", "tile", "grid"]],
		["rtk-settings", "Settings", ["settings", "sidebar", "configuration"]],
		["rtk-ended-screen", "Ended Screen", ["ended", "screen", "meeting"]],
		["rtk-idle-screen", "Idle Screen", ["idle", "screen", "waiting"]],
		["rtk-meeting", "Meeting Screen", ["meeting", "screen", "active"]],
		["rtk-setup-screen", "Setup Screen", ["setup", "screen", "configuration"]],
	];
	const components = definitions.map(([id, name, tags]) => ({ id, name, imagePath: imageSrc(`${id}.svg`), componentName: id, tags }));
	return {
		basicComponents: components.filter((item) => ["rtk-avatar", "rtk-audio-visualizer", "rtk-button", "rtk-clock"].includes(item.id)),
		uiComponents: components.filter((item) => item.id.includes("controlbar") || ["rtk-dialog", "rtk-emoji-picker", "rtk-menu", "rtk-notification"].includes(item.id)),
		compositeComponents: components.filter((item) => ["rtk-grid", "rtk-participant-tile", "rtk-settings"].includes(item.id)),
		screenComponents: components.filter((item) => item.id.includes("screen") || item.id === "rtk-meeting"),
	};
}
