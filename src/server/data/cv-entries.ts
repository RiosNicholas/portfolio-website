import { unstable_cache } from "next/cache";
import { db } from "~/server/db";
import type { CvCategory } from "../../../generated/prisma";

export const getCvEntries = unstable_cache(
	() => db.cvEntry.findMany({ orderBy: { sortOrder: "asc" } }),
	["cv-entries:all"],
	{ tags: ["cv-entries"] },
);

export const getCvEntriesByCategory = unstable_cache(
	(category: CvCategory) =>
		db.cvEntry.findMany({
			where: { category },
			orderBy: { sortOrder: "asc" },
		}),
	["cv-entries:by-category"],
	{ tags: ["cv-entries"] },
);
