import { z } from "zod";

const text = (max: number) => z.string().trim().min(1).max(max);

export const profileInput = z.object({
	intro: text(280),
	summary: text(4000),
	status: text(160),
	city: text(60),
	region: text(60),
	employer: text(80),
	team: text(120),
	projectsLede: text(280),
	writingLede: text(280),
	contactLede: text(280),
});

export type ProfileInput = z.infer<typeof profileInput>;
