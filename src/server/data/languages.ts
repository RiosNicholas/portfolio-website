import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

export const getLanguages = unstable_cache(
	() => db.language.findMany({ orderBy: { sortOrder: "asc" } }),
	["languages:all"],
	{ tags: ["languages"] },
);

export const getPublishedLanguages = unstable_cache(
	() =>
		db.language.findMany({
			where: { published: true },
			orderBy: { sortOrder: "asc" },
		}),
	["languages:published"],
	{ tags: ["languages"] },
);
