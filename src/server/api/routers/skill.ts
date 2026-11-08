import { revalidateTag } from "next/cache";
import { z } from "zod";
import { skillInput } from "~/server/api/schemas/skill";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { getSkillsByKind } from "~/server/data/skills";
import { SkillKind } from "../../../../generated/prisma";

export const skillRouter = createTRPCRouter({
	// Read straight from the database, not the data cache, so /admin never
	// lists a row that is already gone.
	all: publicProcedure.query(({ ctx }) =>
		ctx.db.skill.findMany({ orderBy: { sortOrder: "asc" } }),
	),
	byKind: publicProcedure
		.input(z.object({ kind: z.nativeEnum(SkillKind) }))
		.query(({ input }) => getSkillsByKind(input.kind)),

	create: adminProcedure.input(skillInput).mutation(async ({ ctx, input }) => {
		const created = await ctx.db.skill.create({ data: input });
		revalidateTag("skills");
		return created;
	}),

	update: adminProcedure
		.input(skillInput.partial().extend({ id: z.string() }))
		.mutation(async ({ ctx, input: { id, ...data } }) => {
			const updated = await ctx.db.skill.update({ where: { id }, data });
			revalidateTag("skills");
			return updated;
		}),

	delete: adminProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// deleteMany, not delete: a row that is already gone is not an error,
			// and the cache below still gets cleared.
			await ctx.db.skill.deleteMany({ where: { id: input.id } });
			revalidateTag("skills");
		}),
});
