/**
 * One-off: fills the structured date columns from the legacy `years` / `year`
 * strings on rows that haven't been backfilled yet. Safe to re-run - rows with
 * `startYear` already set are skipped. Run via `npx tsx prisma/backfill-dates.ts`.
 */
import { PrismaClient } from "../generated/prisma";
import { parseLegacyDate } from "../src/lib/legacy-date";

const db = new PrismaClient();

async function main() {
	let updated = 0;
	let skipped = 0;

	const cvEntries = await db.cvEntry.findMany({
		where: { years: { not: null }, startYear: null },
	});
	for (const entry of cvEntries) {
		const fields = parseLegacyDate(entry.years ?? "");
		if (!fields) {
			console.log(`Skipped CvEntry ${entry.id}: unparseable "${entry.years}"`);
			skipped++;
			continue;
		}
		await db.cvEntry.update({ where: { id: entry.id }, data: fields });
		updated++;
	}

	const caseStudies = await db.caseStudy.findMany({
		where: { year: { not: null }, startYear: null },
	});
	for (const study of caseStudies) {
		const fields = parseLegacyDate(study.year ?? "");
		if (!fields) {
			console.log(`Skipped CaseStudy ${study.id}: unparseable "${study.year}"`);
			skipped++;
			continue;
		}
		await db.caseStudy.update({ where: { id: study.id }, data: fields });
		updated++;
	}

	console.log(`Backfilled ${updated} rows, skipped ${skipped}.`);
	await db.$disconnect();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
