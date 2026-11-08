import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

export const getPublishedLanguages = unstable_cache(
	() =>
		db.language.findMany({
			where: { published: true },
			orderBy: { sortOrder: "asc" },
		}),
	["languages:published:v2"],
	{ tags: ["languages"] },
);
