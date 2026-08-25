import { z } from "zod";

import { SkillKind } from "../../../../generated/prisma";

/** Shared between `skill.ts` (server mutation input) and the `/admin/skills`
 * form (client-side validation). */
export const skillInput = z.object({
	kind: z.nativeEnum(SkillKind),
	label: z.string().min(1),
	accent: z.string().optional(),
	sortOrder: z.number().int().default(0),
});

export type SkillInput = z.infer<typeof skillInput>;
