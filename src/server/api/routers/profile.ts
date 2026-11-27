import { revalidateTag } from "next/cache";
import { profileInput } from "~/server/api/schemas/profile";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
	get: adminProcedure.query(({ ctx }) =>
		ctx.db.profile.findUniqueOrThrow({ where: { id: "profile" } }),
	),

	update: adminProcedure
		.input(profileInput)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.db.profile.upsert({
				where: { id: "profile" },
				create: { id: "profile", ...input },
				update: input,
			});
			revalidateTag("profile");
			return updated;
		}),
});
