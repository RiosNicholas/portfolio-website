import { z } from "zod";

import { dateFieldsSchema } from "~/server/api/schemas/dates";

/** Shared between `case-study.ts` (server mutation input) and the
 * `/admin/case-studies` form (client-side validation) so the two can't
 * drift. Only depends on `zod` - safe to import from a Client Component. */
export const caseStatInput = z.object({
	k: z.string().min(1),
	v: z.string().min(1),
});

export const caseStudyInput = z.object({
	id: z.string().min(1),
	num: z.string().min(1),
	...dateFieldsSchema.shape,
	title: z.string(),
	titleEm: z.string().nullish(),
	titleSuffix: z.string().nullish(),
	role: z.string().min(1),
	org: z.string().min(1),
	description: z.string().min(1),
	tags: z.array(z.string()),
	stats: z.array(caseStatInput).length(3),
	featured: z.boolean().default(false),
});

export type CaseStudyInput = z.infer<typeof caseStudyInput>;
