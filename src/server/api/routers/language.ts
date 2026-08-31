import { revalidateTag } from "next/cache";
import { z } from "zod";
import { languageInput } from "~/server/api/schemas/language";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { getLanguages } from "~/server/data/languages";

export const languageRouter = createTRPCRouter({
	all: publicProcedure.query(() => getLanguages()),

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
			await ctx.db.language.delete({ where: { id: input.id } });
			revalidateTag("languages");
		}),
});
