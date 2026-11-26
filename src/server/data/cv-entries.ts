import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

export const getCvEntries = unstable_cache(
	() => db.cvEntry.findMany({ orderBy: { sortOrder: "asc" } }),
	["cv-entries:all:v3"],
	{ tags: ["cv-entries"] },
);
