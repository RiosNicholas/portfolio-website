import { z } from "zod";

/** Shared between `mention.ts` (server mutation input) and the
 * `/admin/mentions` form (client-side validation). */
export const mentionInput = z.object({
	url: z.string().url(),
	title: z.string().min(1),
	outlet: z.string().min(1),
	publishedAt: z.date(),
	tags: z.array(z.string()).default([]),
	published: z.boolean().default(true),
});

export type MentionInput = z.infer<typeof mentionInput>;
