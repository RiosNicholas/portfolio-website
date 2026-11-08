import { unstable_cache } from "next/cache";
import { db } from "~/server/db";
import type { SkillKind } from "../../../generated/prisma";

export const getSkillsByKind = unstable_cache(
	(kind: SkillKind) =>
		db.skill.findMany({
			where: { kind },
			orderBy: { sortOrder: "asc" },
		}),
	["skills:by-kind"],
	{ tags: ["skills"] },
);
