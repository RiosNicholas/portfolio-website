import { revalidateTag } from "next/cache";
import { z } from "zod";

import { caseStudyInput } from "~/server/api/schemas/case-study";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import {
	getCaseStudies,
	getFeaturedCaseStudies,
} from "~/server/data/case-studies";

export const caseStudyRouter = createTRPCRouter({
	all: publicProcedure.query(() => getCaseStudies()),
	featured: publicProcedure.query(() => getFeaturedCaseStudies()),

	create: adminProcedure
		.input(caseStudyInput)
		.mutation(async ({ ctx, input }) => {
			const created = await ctx.db.caseStudy.create({ data: input });
			revalidateTag("case-studies");
			return created;
		}),

	update: adminProcedure
		.input(caseStudyInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const updated = await ctx.db.caseStudy.update({ where: { id }, data });
			revalidateTag("case-studies");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			await ctx.db.caseStudy.delete({ where: { id: input.id } });
			revalidateTag("case-studies");
		}),
});
