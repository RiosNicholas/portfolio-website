import { TRPCError } from "@trpc/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

import { embedUrlFor, sourceFor } from "~/lib/sources";
import {
	type MentionInput,
	mentionInput,
	mentionUpdateInput,
} from "~/server/api/schemas/mention";
import { dedupeTopicTags } from "~/server/api/schemas/topic-tags";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";
import { fetchPreviewImage, resolveUrl } from "~/server/link-preview";

/** Resolves the URL, then picks the image: none for an embed, admin's choice
 * when given, the saved one when the URL is unchanged, else a fresh fetch. */
async function toRow(
	{ imageUrl, ...input }: MentionInput,
	previous?: { url: string; imageUrl: string | null },
) {
	const url = await resolveUrl(input.url);
	const embeds = embedUrlFor(url) !== null;
	if (!input.title && !embeds) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "title: Required for links that don't embed",
		});
	}
	return {
		...input,
		url,
		sourceName: sourceFor(url)?.known ? null : input.sourceName,
		imageUrl: embeds
			? null
			: imageUrl !== undefined
				? imageUrl
				: previous?.url === url
					? previous.imageUrl
					: await fetchPreviewImage(url),
	};
}

export const mentionRouter = createTRPCRouter({
	// Admin only: includes unpublished rows. Reads the database, not the
	// data cache, so /admin is never stale. A missing month or day is the
	// start of its period, so it sorts last within it.
	all: adminProcedure.query(({ ctx }) =>
		ctx.db.mention.findMany({
			orderBy: [
				{ year: "desc" },
				{ month: { sort: "desc", nulls: "last" } },
				{ day: { sort: "desc", nulls: "last" } },
			],
		}),
	),

	// Suggestions for the topic tag inputs on both writing admin pages.
	topicTags: adminProcedure.query(async ({ ctx }) => {
		const rows = await Promise.all([
			ctx.db.mention.findMany({ select: { topicTags: true } }),
			ctx.db.article.findMany({ select: { topicTags: true } }),
		]);
		return dedupeTopicTags(rows.flat().flatMap((r) => r.topicTags)).sort(
			(a, b) => a.localeCompare(b),
		);
	}),

	create: adminProcedure
		.input(mentionInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.mention.create({ data: await toRow(input) });
			revalidateTag("mentions");
			return created;
		}),

	update: adminProcedure
		.input(mentionUpdateInput)
		.mutation(async ({ ctx, input: { id, ...input } }) => {
			const previous = await ctx.db.mention.findUniqueOrThrow({
				where: { id },
				select: { url: true, imageUrl: true },
			});
			const updated = await ctx.db.mention.update({
				where: { id },
				data: await toRow(input, previous),
			});
			revalidateTag("mentions");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.mention.deleteMany({ where: { id: input.id } });
			revalidateTag("mentions");
		}),
});
