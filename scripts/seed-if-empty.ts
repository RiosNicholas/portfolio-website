/**
 * Deploy-pipeline guard around the per-table seed functions in
 * `prisma/seed.ts`. Checks each content table independently and seeds only
 * the ones that are currently empty — a DB can legitimately have some
 * tables populated (a prior seed, or edits made by hand via /admin) and
 * others still empty, so this must never be all-or-nothing. Safe to run
 * unconditionally on every deploy.
 */
import { PrismaClient } from "../generated/prisma";
import {
	seedCaseStudies,
	seedCvEntries,
	seedEndorsements,
	seedLanguages,
	seedSkills,
} from "../prisma/seed";

const db = new PrismaClient();

async function seedIfEmpty(
	name: string,
	count: number,
	seedFn: (db: PrismaClient) => Promise<void>,
) {
	if (count > 0) {
		console.log(`${name}: already has content, skipping.`);
		return;
	}
	console.log(`${name}: empty, seeding.`);
	await seedFn(db);
}

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

	await seedIfEmpty("Case studies", caseStudyCount, seedCaseStudies);
	await seedIfEmpty("CV entries", cvEntryCount, seedCvEntries);
	await seedIfEmpty("Skills", skillCount, seedSkills);
	await seedIfEmpty("Endorsements", endorsementCount, seedEndorsements);
	await seedIfEmpty("Languages", languageCount, seedLanguages);

	await db.$disconnect();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
