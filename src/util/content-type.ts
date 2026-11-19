import { z } from "astro/zod";

/** Formats a content type for display in the UI. */
export function formatContentType(contentType: string): string {
	return contentType
		? (contentType.charAt(0).toUpperCase() + contentType.slice(1)).replaceAll("-", " ")
		: "";
}

export const contentTypeProps = z.string();
