import { revalidateTag } from "next/cache";
import { z } from "zod";
import { cvEntryInput } from "~/server/api/schemas/cv-entry";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { getCvEntriesByCategory } from "~/server/data/cv-entries";
import { CvCategory } from "../../../../generated/prisma";

export const cvEntryRouter = createTRPCRouter({
	// Read straight from the database, not the data cache, so /admin never
	// lists a row that is already gone.
	all: publicProcedure.query(({ ctx }) =>
		ctx.db.cvEntry.findMany({ orderBy: { sortOrder: "asc" } }),
	),
	byCategory: publicProcedure
		.input(z.object({ category: z.nativeEnum(CvCategory) }))
		.query(({ input }) => getCvEntriesByCategory(input.category)),

	create: adminProcedure
		.input(cvEntryInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.cvEntry.create({ data: input });
			revalidateTag("cv-entries");
			return created;
		}),

	update: adminProcedure
		.input(cvEntryInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const updated = await ctx.db.cvEntry.update({ where: { id }, data });
			revalidateTag("cv-entries");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// deleteMany, not delete: a row that is already gone is not an error,
			// and the cache below still gets cleared.
			await ctx.db.cvEntry.deleteMany({ where: { id: input.id } });
			revalidateTag("cv-entries");
		}),
});
