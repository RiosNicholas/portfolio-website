/**
 * Deploy-pipeline guard around `prisma db seed`. `prisma/seed.ts` is also
 * the supported way to apply post-migration content edits by hand to a DB
 * that already has data (see its own docstring) — this wrapper must never
 * interfere with that manual workflow, so it only runs from `vercel-build`
 * and skips outright the moment any seeded table already has rows.
 */
import { execSync } from "node:child_process";
import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

async function main() {
	const [
		caseStudyCount,
		cvEntryCount,
		skillCount,
		endorsementCount,
		languageCount,
	] = await Promise.all([
		db.caseStudy.count(),
		db.cvEntry.count(),
		db.skill.count(),
		db.endorsement.count(),
		db.language.count(),
	]);
	await db.$disconnect();

	const total =
		caseStudyCount +
		cvEntryCount +
		skillCount +
		endorsementCount +
		languageCount;
	if (total > 0) {
		console.log("Seed skipped: database already has content.");
		return;
	}

	console.log("Database is empty — running initial seed.");
	execSync("tsx prisma/seed.ts", { stdio: "inherit" });
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
