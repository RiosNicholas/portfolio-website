import { z } from "zod";
import { titleRequired } from "~/lib/sources";
import { month, year } from "~/server/api/schemas/dates";
import { topicTags } from "~/server/api/schemas/topic-tags";

export const MAX_DAY = 31;

const mentionFields = z.object({
	url: z
		.string()
		.trim()
		.url()
		.regex(/^https?:\/\//i, "Use an http(s) link"),
	title: z.string().trim().min(1).nullable(),
	sourceName: z.string().trim().min(1).nullable(),
	// Omitted keeps the fetched image, a URL overrides it, null clears it.
	imageUrl: z
		.string()
		.trim()
		.url()
		.startsWith("https://")
		.nullable()
		.optional(),
	year,
	month: month.nullable(),
	day: z.number().int().min(1).max(MAX_DAY).nullable(),
	topicTags,
	published: z.boolean().default(true),
});

function checkMention(m: z.infer<typeof mentionFields>, ctx: z.RefinementCtx) {
	if (!m.title && titleRequired(m.url)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["title"],
			message: "Required for links that don't embed",
		});
	}
	// Day 0 of the next month is the last day of this one.
	if (
		m.day !== null &&
		(m.month === null ||
			m.day > new Date(Date.UTC(m.year, m.month, 0)).getUTCDate())
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			path: ["day"],
			message: "Pick a month first, and a day that exists in it",
		});
	}
}

/** Shared between `mention.ts` (server mutation input) and the
 * `/admin/mentions` form (client-side validation). */
export const mentionInput = mentionFields.superRefine(checkMention);
export const mentionUpdateInput = mentionFields
	.extend({ id: z.string() })
	.superRefine(checkMention);

export type MentionInput = z.infer<typeof mentionInput>;
