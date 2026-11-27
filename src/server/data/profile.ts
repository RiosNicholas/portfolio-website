import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

export const getProfile = unstable_cache(
	() => db.profile.findUniqueOrThrow({ where: { id: "profile" } }),
	["profile:v1"],
	{ tags: ["profile"] },
);
