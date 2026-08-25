import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

export const getCaseStudies = unstable_cache(
	() => db.caseStudy.findMany({ orderBy: { sortOrder: "asc" } }),
	["case-studies:all"],
	{ tags: ["case-studies"] },
);

export const getFeaturedCaseStudies = unstable_cache(
	() =>
		db.caseStudy.findMany({
			where: { featured: true },
			orderBy: { sortOrder: "asc" },
		}),
	["case-studies:featured"],
	{ tags: ["case-studies"] },
);
