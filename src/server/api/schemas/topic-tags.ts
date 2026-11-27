import { z } from "zod";

/** Trims, drops empty tags and case-insensitive duplicates, keeping the first casing. */
export function dedupeTopicTags(tags: string[]) {
	const seen = new Set<string>();
	return tags
		.map((tag) => tag.trim())
		.filter((tag) => {
			const key = tag.toLowerCase();
			if (!tag || seen.has(key)) return false;
			seen.add(key);
			return true;
		});
}

export const topicTags = z
	.array(z.string())
	.default([])
	.transform(dedupeTopicTags);
