import { z } from "zod";

import { topicTags } from "~/server/api/schemas/topic-tags";

/** Shared between `article.ts` (server mutation input) and the
 * `/admin/articles` form (client-side validation). */
export const articleInput = z.object({
	slug: z
		.string()
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase words joined by hyphens"),
	title: z.string().min(1),
	summary: z.string().min(1),
	body: z.string().min(1),
	topicTags,
	published: z.boolean().default(false),
});

export type ArticleInput = z.infer<typeof articleInput>;
