import { unstable_cache } from "next/cache";
import { sortByDate, yearsOfExperience } from "~/lib/dates";
import { db } from "~/server/db";

export const getCvEntries = unstable_cache(
	async () => sortByDate(await db.cvEntry.findMany()),
	["cv-entries:all:v4"],
	{ tags: ["cv-entries"] },
);

export const getYearsOfExperience = async () =>
	yearsOfExperience(
		(await getCvEntries()).filter((e) => e.category === "EXPERIENCE"),
	);
