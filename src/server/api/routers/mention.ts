import { revalidateTag } from "next/cache";
import { z } from "zod";

import { mentionInput } from "~/server/api/schemas/mention";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const mentionRouter = createTRPCRouter({
	// Admin only: includes unpublished rows. Reads the database, not the
	// data cache, so /admin is never stale.
	all: adminProcedure.query(({ ctx }) =>
		ctx.db.mention.findMany({ orderBy: { publishedAt: "desc" } }),
	),

	create: adminProcedure
		.input(mentionInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.mention.create({ data: input });
			revalidateTag("mentions");
			return created;
		}),

	update: adminProcedure
		.input(mentionInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const updated = await ctx.db.mention.update({ where: { id }, data });
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
