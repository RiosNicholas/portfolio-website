import { revalidateTag } from "next/cache";
import { z } from "zod";
import { skillInput } from "~/server/api/schemas/skill";
import {
	adminProcedure,
	createTRPCRouter,
	publicProcedure,
} from "~/server/api/trpc";
import { getSkills, getSkillsByKind } from "~/server/data/skills";
import { SkillKind } from "../../../../generated/prisma";

export const skillRouter = createTRPCRouter({
	all: publicProcedure.query(() => getSkills()),
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
			await ctx.db.skill.delete({ where: { id: input.id } });
			revalidateTag("skills");
		}),
});
