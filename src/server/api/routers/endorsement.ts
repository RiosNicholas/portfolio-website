import { revalidateTag } from "next/cache";
import { z } from "zod";

import { endorsementInput } from "~/server/api/schemas/endorsement";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { getPublishedEndorsements } from "~/server/data/endorsements";

export const endorsementRouter = createTRPCRouter({
	// Read straight from the database, not the data cache, so /admin never
	// lists a row that is already gone.
	all: publicProcedure.query(({ ctx }) =>
		ctx.db.endorsement.findMany({ orderBy: { sortOrder: "asc" } }),
	),
	published: publicProcedure.query(() => getPublishedEndorsements()),

	create: adminProcedure
		.input(endorsementInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.endorsement.create({ data: input });
			revalidateTag("endorsements");
			return created;
		}),

	update: adminProcedure
		.input(endorsementInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const updated = await ctx.db.endorsement.update({
				where: { id },
				data,
			});
			revalidateTag("endorsements");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// deleteMany, not delete: a row that is already gone is not an error,
			// and the cache below still gets cleared.
			await ctx.db.endorsement.deleteMany({ where: { id: input.id } });
			revalidateTag("endorsements");
		}),
});
