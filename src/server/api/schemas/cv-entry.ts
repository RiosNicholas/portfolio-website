import { z } from "zod";
import { dateFieldsSchema } from "~/server/api/schemas/dates";
import { CvCategory } from "../../../../generated/prisma";

/** Shared between `cv-entry.ts` (server mutation input) and the
 * `/admin/cv` form (client-side validation). `CvCategory` is a plain enum
 * object from the generated Prisma client's browser build - no query
 * engine, safe to import from a Client Component. */
export const cvEntryInput = z
	.object({
		category: z.nativeEnum(CvCategory),
		title: z.string().min(1),
		titleAccent: z.array(z.string()).default([]),
		where: z.string().min(1),
	})
	.extend(dateFieldsSchema.shape);

export type CvEntryInput = z.infer<typeof cvEntryInput>;
