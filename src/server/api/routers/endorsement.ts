import { revalidateTag } from "next/cache";
import { z } from "zod";

import { endorsementInput } from "~/server/api/schemas/endorsement";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import {
	getEndorsements,
	getPublishedEndorsements,
} from "~/server/data/endorsements";

export const endorsementRouter = createTRPCRouter({
	all: publicProcedure.query(() => getEndorsements()),
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
			await ctx.db.endorsement.delete({ where: { id: input.id } });
			revalidateTag("endorsements");
		}),
});
