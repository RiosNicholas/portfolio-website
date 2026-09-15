import { z } from "zod";

/** Shared between `endorsement.ts` (server mutation input) and the
 * `/admin/endorsements` form (client-side validation). */
export const endorsementInput = z.object({
	name: z.string().min(1),
	role: z.string().min(1),
	quote: z.string().min(1),
	linkedinUrl: z.string().url(),
	avatarUrl: z.string().url().optional(),
	published: z.boolean().default(true),
	sortOrder: z.number().int().default(0),
});

export type EndorsementInput = z.infer<typeof endorsementInput>;
