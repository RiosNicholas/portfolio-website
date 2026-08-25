import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

export const getEndorsements = unstable_cache(
	() => db.endorsement.findMany({ orderBy: { sortOrder: "asc" } }),
	["endorsements:all"],
	{ tags: ["endorsements"] },
);

export const getPublishedEndorsements = unstable_cache(
	() =>
		db.endorsement.findMany({
			where: { published: true },
			orderBy: { sortOrder: "asc" },
		}),
	["endorsements:published"],
	{ tags: ["endorsements"] },
);
