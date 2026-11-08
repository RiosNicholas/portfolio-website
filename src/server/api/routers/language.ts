import { revalidateTag } from "next/cache";
import { z } from "zod";
import { languageInput } from "~/server/api/schemas/language";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";

export const languageRouter = createTRPCRouter({
	// Read straight from the database, not the data cache, so /admin never
	// lists a row that is already gone.
	all: publicProcedure.query(({ ctx }) =>
		ctx.db.language.findMany({ orderBy: { sortOrder: "asc" } }),
	),

	create: adminProcedure
		.input(languageInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.language.create({ data: input });
			revalidateTag("languages");
			return created;
		}),

	update: adminProcedure
		.input(languageInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const updated = await ctx.db.language.update({ where: { id }, data });
			revalidateTag("languages");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// deleteMany, not delete: a row that is already gone is not an error,
			// and the cache below still gets cleared.
			await ctx.db.language.deleteMany({ where: { id: input.id } });
			revalidateTag("languages");
		}),
});
