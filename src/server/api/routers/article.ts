import { revalidateTag } from "next/cache";
import { z } from "zod";

import { articleInput } from "~/server/api/schemas/article";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { getArticleBySlug } from "~/server/data/writing";

export const articleRouter = createTRPCRouter({
	// Admin only: unlike other models this includes unpublished drafts.
	// Reads the database, not the data cache, so /admin is never stale.
	all: adminProcedure.query(({ ctx }) =>
		ctx.db.article.findMany({ orderBy: { createdAt: "desc" } }),
	),
	bySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ input }) => getArticleBySlug(input.slug)),

	create: adminProcedure
		.input(articleInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.article.create({
				data: { ...input, publishedAt: input.published ? new Date() : null },
			});
			revalidateTag("articles");
			return created;
		}),

	update: adminProcedure
		.input(articleInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const existing = await ctx.db.article.findUniqueOrThrow({
				where: { id },
				select: { publishedAt: true },
			});
			// publishedAt marks the first publish, so unpublishing and
			// republishing keeps the original date.
			const updated = await ctx.db.article.update({
				where: { id },
				data: {
					...data,
					...(data.published && !existing.publishedAt
						? { publishedAt: new Date() }
						: {}),
				},
			});
			revalidateTag("articles");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.article.deleteMany({ where: { id: input.id } });
			revalidateTag("articles");
		}),
});
