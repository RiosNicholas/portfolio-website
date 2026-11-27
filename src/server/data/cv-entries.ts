import { unstable_cache } from "next/cache";
import { sortByDate } from "~/lib/dates";
import { db } from "~/server/db";

export const getCvEntries = unstable_cache(
	async () => sortByDate(await db.cvEntry.findMany()),
	["cv-entries:all:v4"],
	{ tags: ["cv-entries"] },
);
