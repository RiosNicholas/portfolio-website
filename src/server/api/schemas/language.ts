import { z } from "zod";

/** Shared between `language.ts` (server mutation input) and the
 * `/admin/languages` form (client-side validation). */
export const languageInput = z.object({
	name: z.string().min(1),
	level: z.string().min(1),
	published: z.boolean().default(true),
	sortOrder: z.number().int().default(0),
});

export type LanguageInput = z.infer<typeof languageInput>;
