export interface ComponentItem {
    id: string;
    name: string;
    imagePath: string;
    componentName: string;
    tags: string[];
}

export const createComponentLists = (imageSrc: (fileName: string) => string) => {
    const basicComponents: ComponentItem[] = [
        {
            id: "rtk-avatar",
            name: "Avatar",
            imagePath: imageSrc("rtk-avatar.svg"),
            componentName: "rtk-avatar",
            tags: ["participant", "tile", "grid"],
        },
        {
            id: "rtk-audio-visualizer",
            name: "Audio Visualizer",
            imagePath: imageSrc("rtk-audio-visualizer.svg"),
            componentName: "rtk-audio-visualizer",
            tags: ["participant", "audio", "visualizer", "grid"],
        },
        {
            id: "rtk-button",
            name: "Button",
            imagePath: imageSrc("rtk-button.svg"),
            componentName: "rtk-button",
            tags: ["button", "controlbar", "controlbar-button"],
        },
        {
            id: "rtk-clock",
            name: "Clock",
            imagePath: imageSrc("rtk-clock.svg"),
            componentName: "rtk-clock",
            tags: ["clock", "header", "sidebar"],
        },
        {
            id: "rtk-header",
            name: "Header",
            imagePath: imageSrc("rtk-header.svg"),
            componentName: "rtk-header",
            tags: ["header", "sidebar"],
        },
        {
            id: "rtk-logo",
            name: "Logo",
            imagePath: imageSrc("rtk-logo.svg"),
            componentName: "rtk-logo",
            tags: ["logo", "header", "sidebar"],
        },
        {
            id: "rtk-meeting-title",
            name: "Meeting Title",
            imagePath: imageSrc("rtk-meeting-title.svg"),
            componentName: "rtk-meeting-title",
            tags: ["meeting-title", "header", "sidebar"],
        },
        {
            id: "rtk-recording-indicator",
            name: "Recording Indicator",
            imagePath: imageSrc("rtk-recording-indicator.svg"),
            componentName: "rtk-recording-indicator",
            tags: ["recording", "indicator", "header", "sidebar", "controlbar"],
        },
        {
            id: "rtk-spinner",
            name: "Spinner",
            imagePath: imageSrc("rtk-spinner.svg"),
            componentName: "rtk-spinner",
            tags: ["spinner", "controlbar", "controlbar-button"],
        },
        {
            id: "rtk-switch",
            name: "Switch",
            imagePath: imageSrc("rtk-switch.svg"),
            componentName: "rtk-switch",
            tags: ["switch", "controlbar", "button"],
        },
        {
            id: "rtk-tooltip",
            name: "Tooltip",
            imagePath: imageSrc("rtk-tooltip.svg"),
            componentName: "rtk-tooltip",
            tags: ["tooltip", "controlbar", "button"],
        },
    ];

    const uiComponents: ComponentItem[] = [
        {
            id: "rtk-controlbar",
            name: "Control Bar",
            imagePath: imageSrc("rtk-controlbar.svg"),
            componentName: "rtk-controlbar",
            tags: ["controlbar", "button"],
        },
        {
            id: "rtk-controlbar-button",
            name: "Control Bar Button",
            imagePath: imageSrc("rtk-controlbar-button.svg"),
            componentName: "rtk-controlbar-button",
            tags: ["controlbar", "button"],
        },
        {
            id: "rtk-dialog",
            name: "Dialog",
            imagePath: imageSrc("rtk-dialog.svg"),
            componentName: "rtk-dialog",
            tags: ["dialog", "modal", "popup"],
        },
        {
            id: "rtk-emoji-picker",
            name: "Emoji Picker",
            imagePath: imageSrc("rtk-emoji-picker.svg"),
            componentName: "rtk-emoji-picker",
            tags: ["emoji-picker", "sidebar", "chat", "message"],
        },
        {
            id: "rtk-grid-pagination",
            name: "Grid Pagination",
            imagePath: imageSrc("rtk-grid-pagination.svg"),
            componentName: "rtk-grid-pagination",
            tags: ["pagination", "grid", "participant", "tile", "header"],
        },
        {
            id: "rtk-menu",
            name: "Menu",
            imagePath: imageSrc("rtk-menu.svg"),
            componentName: "rtk-menu",
            tags: ["menu", "sidebar", "controlbar", "button"],
        },
        {
            id: "rtk-name-tag",
            name: "Name Tag",
            imagePath: imageSrc("rtk-name-tag.svg"),
            componentName: "rtk-name-tag",
            tags: ["name-tag", "participant", "tile", "grid"],
        },
        {
            id: "rtk-notification",
            name: "Notification",
            imagePath: imageSrc("rtk-notification.svg"),
            componentName: "rtk-notification",
            tags: ["notification", "sidebar", "popup", "chat"],
        },
        {
            id: "rtk-participant-count",
            name: "Participant Count",
            imagePath: imageSrc("rtk-participant-count.svg"),
            componentName: "rtk-participant-count",
            tags: ["participant-count", "header", "sidebar"],
        },
        {
            id: "rtk-participant-tile",
            name: "Participant Tile",
            imagePath: imageSrc("rtk-participant-tile.svg"),
            componentName: "rtk-participant-tile",
            tags: ["participant-tile", "participant", "tile", "grid"],
        },
        {
            id: "rtk-plugin-main",
            name: "Plugin Main View",
            imagePath: imageSrc("rtk-plugin-main.svg"),
            componentName: "rtk-plugin-main",
            tags: ["plugin-main", "plugin", "sidebar", "controlbar", "button"],
        },
    ];

    const compositeComponents: ComponentItem[] = [
        {
            id: "rtk-chat",
            name: "Chat",
            imagePath: imageSrc("rtk-chat.svg"),
            componentName: "rtk-chat",
            tags: ["chat", "message", "sidebar"],
        },
        {
            id: "rtk-grid",
            name: "Grid",
            imagePath: imageSrc("rtk-grid.svg"),
            componentName: "rtk-grid",
            tags: ["grid", "participant", "tile", "layout"],
        },
        {
            id: "rtk-image-viewer",
            name: "Image Viewer",
            imagePath: imageSrc("rtk-image-viewer.svg"),
            componentName: "rtk-image-viewer",
            tags: ["image-viewer", "media", "chat", "sidebar"],
        },
        {
            id: "rtk-leave-meeting",
            name: "Leave Meeting",
            imagePath: imageSrc("rtk-leave-meeting.svg"),
            componentName: "rtk-leave-meeting",
            tags: ["leave", "dialog", "modal", "controlbar", "button", "end"],
        },
        {
            id: "rtk-mixed-grid",
            name: "Mixed Grid",
            imagePath: imageSrc("rtk-mixed-grid.svg"),
            componentName: "rtk-mixed-grid",
            tags: ["mixed", "grid", "participant", "tile", "layout"],
        },
        {
            id: "rtk-participants",
            name: "Participants",
            imagePath: imageSrc("rtk-participants.svg"),
            componentName: "rtk-participants",
            tags: ["participants", "sidebar", "list", "participant", "tile"],
        },
        {
            id: "rtk-participants-audio",
            name: "Participants Audio",
            imagePath: imageSrc("rtk-participants-audio.svg"),
            componentName: "rtk-participants-audio",
            tags: ["participants-audio", "audio", "sidebar", "participant", "list"],
        },
        {
            id: "rtk-plugins",
            name: "Plugins",
            imagePath: imageSrc("rtk-plugins.svg"),
            componentName: "rtk-plugins",
            tags: ["plugins", "sidebar", "list", "plugin"],
        },
        {
            id: "rtk-polls",
            name: "Polls",
            imagePath: imageSrc("rtk-polls.svg"),
            componentName: "rtk-polls",
            tags: ["polls", "sidebar", "voting", "interactive"],
        },
        {
            id: "rtk-screenshare-view",
            name: "Screenshare View",
            imagePath: imageSrc("rtk-screenshare-view.svg"),
            componentName: "rtk-screenshare-view",
            tags: ["screenshare-view", "screenshare", "media", "grid"],
        },
        {
            id: "rtk-settings",
            name: "Settings",
            imagePath: imageSrc("rtk-settings.svg"),
            componentName: "rtk-settings",
            tags: ["settings", "sidebar", "configuration", "preferences", "dialog", "modal"],
        },
        {
            id: "rtk-settings-audio",
            name: "Settings Audio",
            imagePath: imageSrc("rtk-settings-audio.svg"),
            componentName: "rtk-settings-audio",
            tags: ["settings-audio", "audio", "settings", "sidebar", "configuration", "dialog", "modal"],
        },
        {
            id: "rtk-settings-video",
            name: "Settings Video",
            imagePath: imageSrc("rtk-settings-video.svg"),
            componentName: "rtk-settings-video",
            tags: ["settings-video", "video", "settings", "sidebar", "configuration", "dialog", "modal"],
        },
        {
            id: "rtk-sidebar",
            name: "Sidebar",
            imagePath: imageSrc("rtk-sidebar.svg"),
            componentName: "rtk-sidebar",
            tags: ["sidebar", "layout", "navigation", "panel"],
        },
        {
            id: "rtk-simple-grid",
            name: "Simple Grid",
            imagePath: imageSrc("rtk-simple-grid.svg"),
            componentName: "rtk-simple-grid",
            tags: ["simple", "grid", "participant", "tile", "layout", "basic"],
        },
        {
            id: "rtk-spotlight-grid",
            name: "Spotlight Grid",
            imagePath: imageSrc("rtk-spotlight-grid.svg"),
            componentName: "rtk-spotlight-grid",
            tags: ["spotlight", "grid", "participant", "tile", "layout", "pinned"],
        },
    ];

    const screenComponents: ComponentItem[] = [
        {
            id: "rtk-ended-screen",
            name: "Ended Screen",
            imagePath: imageSrc("rtk-ended-screen.svg"),
            componentName: "rtk-ended-screen",
            tags: ["ended", "screen", "meeting", "end", "leave"],
        },
        {
            id: "rtk-idle-screen",
            name: "Idle Screen",
            imagePath: imageSrc("rtk-idle-screen.svg"),
            componentName: "rtk-idle-screen",
            tags: ["idle", "screen", "waiting", "lobby", "standby"],
        },
        {
            id: "rtk-meeting",
            name: "Meeting Screen",
            imagePath: imageSrc("rtk-meeting.svg"),
            componentName: "rtk-meeting",
            tags: ["meeting", "screen", "main", "active"],
        },
        {
            id: "rtk-setup-screen",
            name: "Setup Screen",
            imagePath: imageSrc("rtk-setup-screen.svg"),
            componentName: "rtk-setup-screen",
            tags: ["setup", "screen", "configuration", "preview"],
        },
    ];

    return {
        basicComponents,
        uiComponents,
        compositeComponents,
        screenComponents,
    };
};
