/**
 * 2026-09 admin-crud-issues task: one-off, targeted content update for the
 * favorite-tools list — NOT a re-seed. `seedSkills()` in `prisma/seed.ts`
 * opens with `db.skill.deleteMany({})`, which would wipe every admin-created
 * row beyond the original seed batch; running it against the live DB is
 * exactly the kind of data loss this script exists to avoid. This script
 * only ever touches the two rows the task calls for:
 *
 *   1. Renames the existing TOOL row labeled "Glove80 Keyboard" to
 *      "MoErgo Glove80" (its manufacturer-qualified name), keeping the
 *      row's id, sortOrder, and everything else untouched.
 *   2. Adds a new TOOL row labeled "AeroSpace" (macOS tiling window
 *      manager) if one doesn't already exist — this is a pure addition,
 *      NOT a replacement for the existing "Rectangle" TOOL row, which is
 *      left alone.
 *
 * Idempotent: safe to run more than once. If the rename matches zero rows,
 * that's a strong signal this ran against the wrong database (see the two
 * diverged DBs documented in agentWork/admin-crud-issues/03-implementation.md)
 * — it does NOT create a new "MoErgo Glove80" row in that case.
 *
 * Run with: npx tsx scripts/update-favorite-tools.ts
 *
 * IMPORTANT: this writes to Postgres directly, bypassing tRPC, so it never
 * calls `revalidateTag()`. Unlike an edit made through /admin, the public
 * pages will keep serving the old content from the Next.js data cache until
 * it's cleared (restart `next dev` locally, or redeploy in production).
 */
import { PrismaClient } from "../generated/prisma";

const OLD_LABEL = "Glove80 Keyboard";
const NEW_LABEL = "MoErgo Glove80";
const NEW_TOOL_LABEL = "AeroSpace";

const db = new PrismaClient();

async function main() {
	const url = process.env.DATABASE_URL ?? "";
	const host = url.split("@")[1]?.split("/")[0] ?? "unknown";
	console.log(`Running against DB host: ${host}`);

	const before = await db.skill.findMany({
		where: { kind: "TOOL" },
		orderBy: { sortOrder: "asc" },
		select: { label: true, sortOrder: true },
	});
	console.log("\nTOOL rows before:", before);

	// 1. Rename Glove80 Keyboard -> MoErgo Glove80.
	const renamed = await db.skill.updateMany({
		where: { kind: "TOOL", label: OLD_LABEL },
		data: { label: NEW_LABEL },
	});
	if (renamed.count === 0) {
		console.log(
			`\nNo TOOL row labeled "${OLD_LABEL}" found — 0 rows renamed. This ` +
				"almost certainly means this ran against a DB that never had that " +
				"row (e.g. the stale local Postgres snapshot, not Neon/production). " +
				"Not creating a new row on a guess.",
		);
	} else {
		console.log(
			`\nRenamed ${renamed.count} row(s): "${OLD_LABEL}" -> "${NEW_LABEL}".`,
		);
	}

	// 2. Add AeroSpace if it doesn't already exist (pure addition, does not
	// touch the existing "Rectangle" row).
	const existingAeroSpace = await db.skill.findFirst({
		where: { kind: "TOOL", label: NEW_TOOL_LABEL },
	});
	if (existingAeroSpace) {
		console.log(`\n"${NEW_TOOL_LABEL}" already exists — skipping create.`);
	} else {
		const toolRows = await db.skill.findMany({
			where: { kind: "TOOL" },
			select: { sortOrder: true },
		});
		const maxSortOrder = toolRows.reduce(
			(max, row) => Math.max(max, row.sortOrder),
			0,
		);
		const created = await db.skill.create({
			data: {
				kind: "TOOL",
				label: NEW_TOOL_LABEL,
				sortOrder: maxSortOrder + 1,
			},
		});
		console.log(
			`\nCreated "${NEW_TOOL_LABEL}" at sortOrder ${created.sortOrder}.`,
		);
	}

	const after = await db.skill.findMany({
		where: { kind: "TOOL" },
		orderBy: { sortOrder: "asc" },
		select: { label: true, sortOrder: true },
	});
	console.log("\nTOOL rows after:", after);

	console.log(
		"\nReminder: this bypassed tRPC, so revalidateTag() never ran — the " +
			"public site will keep serving the old tools list from the Next.js " +
			"data cache until it's cleared (restart `next dev` locally, or " +
			"redeploy in production).",
	);

	await db.$disconnect();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
