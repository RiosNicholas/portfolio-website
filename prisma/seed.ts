/**
 * Seed: originally a one-time migration of the static content that used to
 * live in `src/lib/{work-data,about-data,bento-data}.ts` into Postgres; now
 * also the supported way to apply post-migration content edits (skills,
 * case-study copy fixes/additions) to a fresh or existing DB. Run via
 * `npx prisma db seed` (or automatically after `prisma migrate dev`).
 *
 * Endorsements are real recommendations copy-pasted from LinkedIn (not the
 * 12 fabricated placeholders that used to live in `src/lib/endorsements.ts`
 * — those are gone for good), one recommendation quoted whole as a single
 * marquee card per person. The `linkedinUrl` column is still deliberately
 * non-unique (a person could get a second card in the future), so unlike
 * `CaseStudy` there's no natural per-row unique key — this table falls
 * into the same "clear and reinsert" bucket as `CvEntry`/`Skill` below.
 *
 * `CaseStudy` and `Language` rows are upserted by their natural key (slug
 * `id`, load-bearing as `/work#<id>` anchors, and `name` respectively) so
 * re-running this script is safe for those two. `CvEntry`, `Skill`, and
 * `Endorsement` have no natural unique key from the source data, so this
 * script clears and re-inserts those three tables on every run — fine for
 * the initial migration, but don't re-run it after you've started editing
 * CV entries, skills, or endorsements by hand via /admin, or those edits
 * will be wiped.
 *
 * IMPORTANT: this script writes to Postgres directly, bypassing tRPC, so it
 * never calls `revalidateTag()` — unlike an edit made through /admin, a
 * change here won't show up on the public pages until the Next.js data
 * cache is cleared (restart `next dev` locally, or redeploy in production).
 *
 * 2026-08-31 (admin-instant-feedback-and-photoshop task): the `Skill` table
 * had drifted from this file — three rows had been created by hand via
 * /admin (an errant SKILL-kind "Adobe Photoshop", a TOOL-kind "Adobe
 * Photoshop", and a re-added "Glove80 Keyboard" that landed at sortOrder 0
 * instead of the end of the list) during an earlier admin-UI debugging
 * session. Reconciled here: the SKILL-kind Photoshop entry is gone for
 * good (never belonged in `skills` below), "Adobe Photoshop" is folded into
 * `favoriteTools` as the last TOOL, "Glove80 Keyboard" is restored to its
 * correct end-of-tools position, and "Photography"/"Photo editing" were
 * added as new SKILL entries. `seedSkills()` must be re-run against the
 * live DB to apply this and close the drift.
 */
import { PrismaClient } from "../generated/prisma";

// ─── Case studies (verbatim from src/lib/work-data.ts) ──────────────────────

type CaseStat = { k: string; v: string };
type SeedCaseStudy = {
	id: string;
	num: string;
	year: string;
	title: string;
	titleEm?: string;
	titleSuffix?: string;
	role: string;
	org: string;
	description: string;
	tags: string[];
	stats: CaseStat[];
	featured?: boolean;
};

const cases: SeedCaseStudy[] = [
	{
		id: "risk-agents",
		num: "001",
		year: "2026 — Present",
		title: "Risk Tech ",
		titleEm: "Agents",
		featured: true,
		// 2026-08-31 (risk-agents-employer-attribution task, expanded scope):
		// role/org/description/stats rewritten for explicit JPMorganChase
		// employer attribution and updated impact framing. Revert path:
		// /admin/case-studies, row "risk-agents".
		role: "UI Subject Matter Expert · Core Developer",
		org: "JPMorganChase · Risk Technology · Internal agent platform",
		description:
			"Agents that shift risk and compliance checks left in the SDLC, closing the gap between developers, product, and design. Built the agents and guardrails that keep generated code aligned with the design system and architecture — cutting technical debt instead of adding to it.",
		tags: ["MCP", "Claude Code", "GitHub Copilot", "React", "Cypress"],
		stats: [
			{ k: "Scope", v: "Design system & UI" },
			{ k: "Impact", v: "+40% productivity" },
			{ k: "Status", v: "Ongoing" },
		],
	},
	{
		id: "accountabuddy",
		num: "002",
		year: "2024",
		title: "",
		titleEm: "Accountabuddy",
		featured: true,
		role: "Solo · Capstone",
		org: "Habit pairing app · React · Supabase",
		description:
			"Accountability app pairing you with exactly one other person — not a feed, not a streak machine. You set a thing, they set a thing, the app handles nudges. Designed, built, shipped in 8 weeks.",
		tags: [
			"React",
			"Next.js",
			"Redux",
			"Tailwind",
			"shadcn/ui",
			"NextAuth.js",
			"Supabase",
			"Vercel",
		],
		stats: [
			{ k: "Scope", v: "Solo build" },
			{ k: "Duration", v: "8 weeks" },
			{ k: "Status", v: "Shipped 2024" },
		],
	},
	{
		id: "gslsamp",
		num: "003",
		year: "Feb '23 — May '24",
		title: "",
		titleEm: "GS-LSAMP",
		titleSuffix: " Website",
		featured: true,
		role: "Lead Web Developer",
		org: "Rutgers University–Newark · National Science Foundation GS-LSAMP",
		description:
			"Official site for the NSF-sponsored GS-LSAMP program at Rutgers–Newark. Surfaces undergraduate research, funding, and post-bacc pathways in STEM. Built and maintained from first commit through handoff.",
		tags: ["Next.js", "React", "TypeScript", "Tailwind", "Vercel"],
		stats: [
			{ k: "Students & staff", v: "500+" },
			{ k: "Tenure", v: "16 mo" },
			{ k: "Shipped", v: "May '24" },
		],
	},
	{
		id: "groove-exchange",
		num: "004",
		year: "Nov '23",
		title: "",
		titleEm: "Groove",
		titleSuffix: " Exchange",
		role: "Solo · Full-stack",
		org: "Anonymous music forum · React · Node · Express",
		description:
			"Full-stack music forum built in the spirit of Reddit and RateYourMusic — a collaborative space for talking about records without a username attached. Anonymous threads, posts, and critique on whatever's in rotation. Built and deployed end to end as a CodePath capstone.",
		tags: [
			"React",
			"JavaScript",
			"Node",
			"REST",
			"Supabase",
			"PostgreSQL",
			"Tailwind",
			"Netlify",
		],
		stats: [
			{ k: "Scope", v: "Full-stack" },
			{ k: "Program", v: "CodePath" },
			{ k: "Shipped", v: "Nov '23" },
		],
	},
	{
		id: "datawell",
		num: "005",
		year: "Sep '23",
		title: "",
		titleEm: "DataWell",
		role: "Co-developer · Frontend",
		org: "Wellfare · NYC food nonprofit · React · Tailwind",
		description:
			"In-house CRM dashboards for Wellfare, a NYC food nonprofit. Staff-facing views that personalize each recipient's shopping experience and make tracking legible instead of spreadsheet archaeology. Co-built with a team at JPMorganChase Code for Good.",
		tags: ["React", "Tailwind", "JavaScript", "CRM"],
		stats: [
			{ k: "Scope", v: "Frontend" },
			{ k: "Program", v: "JPMorganChase Code for Good Hackathon" },
			{ k: "Shipped", v: "Sep '23" },
		],
	},
	{
		id: "spotify-valence",
		num: "006",
		year: "2023",
		title: "Spotify ",
		titleEm: "Valence Trends",
		role: "Data Analysis · Data Wrangling",
		org: "Rutgers University · Data Science minor · Spotify Web API · Python",
		description:
			"Study of valence — the musical-positivity measure of how happy or somber a track sounds — across 44,894 US tracks, 1960s through 2010s. Pulled with Spotipy, deduplicated, split into hits and flops by popularity, then banded happy vs. somber. Delivered as a Jupyter notebook and presentation.",
		tags: [
			"Python",
			"Pandas",
			"NumPy",
			"Seaborn",
			"Matplotlib",
			"Jupyter",
			"Spotify API",
		],
		stats: [
			{ k: "Dataset", v: "44,894 tracks" },
			{ k: "Hypothesis", v: "Valence decline, 2000s–2010s" },
			{ k: "Presented", v: "2023" },
		],
	},
];

// ─── CV entries (verbatim from src/lib/about-data.ts) ────────────────────────

type SeedCvEntry = {
	years: string;
	title: string;
	titleAccent?: string[];
	where: string;
};

const experience: SeedCvEntry[] = [
	{
		years: "Feb '25 — Present",
		title: "Software Engineer",
		where: "JPMorgan Chase & Co. · Jersey City, NJ",
	},
	{
		years: "Jun '24 — Aug '24",
		title: "Software Engineer Intern",
		where: "JPMorgan Chase & Co. · Jersey City, NJ",
	},
	{
		years: "Feb '23 — May '24",
		title: "Lead Web Developer",
		where: "Rutgers University–Newark GS-LSAMP · Newark, NJ",
	},
	{
		years: "Jun '23 — Aug '23",
		title: "Software Engineer Intern",
		where: "Fiserv · Berkeley Heights, NJ",
	},
];

const education: SeedCvEntry[] = [
	{
		years: "Sep '21 — Dec '24",
		title: "B.A. Computer Science, Minor in Data Science",
		titleAccent: ["Computer Science"],
		where: "Rutgers University · Magna Cum Laude",
	},
	{
		years: "Feb '23 — Nov '23",
		title: "Certificate in Web Development",
		where: "CodePath",
	},
];

const activities: SeedCvEntry[] = [
	{
		years: "Apr '23 — Dec '24",
		title: "Co-Founder & President",
		where: "ColorStack Chapter @ Rutgers University–Newark",
	},
	{
		years: "Oct '24 — Dec '24",
		title: "Chapter Ambassador",
		where: "ColorStack",
	},
	{
		years: "Oct '24 — Dec '24",
		title: "Fellow",
		where: "Braven",
	},
	{
		years: "Oct '23",
		title: "Apprentice",
		where: "#ChangeMakers Summit · Wells Fargo",
	},
];

// ─── Skills & tools ────────────────────────────────────────────────────────

type SeedSkill = { label: string; accent?: string };

const skills: SeedSkill[] = [
	// Leads the list per the Aug 2026 skills-reorder task — no existing skill
	// label matched "UI development" closely enough to rename in place (the
	// list already led with UI-adjacent skills), so this is a new literal
	// entry rather than a reordering of the 14 below it. One-field revert via
	// /admin/skills if a different label was intended.
	{ label: "UI development" },
	{ label: "React · Next.js", accent: "Next.js" },
	{ label: "TypeScript" },
	{ label: "Design systems" },
	{ label: "Tailwind · shadcn/ui", accent: "shadcn/ui" },
	{ label: "Framer Motion" },
	{ label: "Agents · LLM UX", accent: "LLM UX" },
	{ label: "Agentic AI development" },
	{ label: "Prompt engineering" },
	{ label: "Node · Python" },
	// Aug 2026 skills-expansion task: "Postgres" split into the data/backend
	// tooling actually used in this project (Prisma, tRPC, Supabase). SQLite
	// and Cassandra are real skills but not used in this repo, so per
	// explicit direction they're appended at the very end of the list below
	// instead of alongside Prisma/tRPC/Postgres, keeping them visually
	// de-emphasized relative to what this project's stack actually runs on.
	// Revert path for any of these: /admin/skills.
	{ label: "Postgres · Supabase", accent: "Supabase" },
	{ label: "Prisma · tRPC", accent: "tRPC" },
	{ label: "Platform engineering" },
	{ label: "Observability" },
	{ label: "CI / CD" },
	{ label: "Animation & motion" },
	// Aug 2026 admin-instant-feedback-and-photoshop task: grouped with the
	// existing visual/creative entry above, deliberately NOT the
	// de-emphasized tail slot that "SQLite · Cassandra" occupies below.
	// Photoshop itself is a TOOL, not a SKILL (see favoriteTools). Revert
	// path: /admin/skills.
	{ label: "Photography" },
	{ label: "Photo editing" },
	{ label: "Pandas · NumPy", accent: "NumPy" },
	{ label: "Matplotlib" },
	{ label: "SQLite · Cassandra", accent: "Cassandra" },
];

const favoriteTools: string[] = [
	"Claude Code",
	"GitHub Copilot",
	"VS Code",
	"Vim",
	"Raycast",
	"Rectangle",
	"Ghostty",
	"Figma",
	"Fish Shell",
	"Glove80 Keyboard",
	// Aug 2026 admin-instant-feedback-and-photoshop task: intentionally last
	// in the tools order per explicit user direction.
	"Adobe Photoshop",
];

// ─── Languages ────────────────────────────────────────────────────────────

type SeedLanguage = { name: string; level: string };

const languages: SeedLanguage[] = [
	{ name: "English", level: "Native" },
	{ name: "Spanish", level: "Native" },
	{ name: "Portuguese", level: "Elementary" },
];

// ─── Endorsements (real LinkedIn recommendations) ───────────────────────────

type SeedRecommender = {
	name: string;
	role: string;
	linkedinUrl: string;
	/** One LinkedIn recommendation, quoted whole -- one card per person. */
	quote: string;
};

// Array index is sortOrder (see seedEndorsements below), so display order
// (sortOrder asc) is Steven → Matthew → Joshua. Aug 2026 reorder task:
// Matthew moved to the middle slot; Steven took slot 0 to preserve the
// pre-existing Steven-before-Joshua relative order — the smallest change
// that satisfies "Matthew in the middle." Quote/role/URL text untouched.
const recommenders: SeedRecommender[] = [
	{
		name: "Steven Tejeda",
		role: "Senior Software Engineer II · Fiserv",
		linkedinUrl: "https://www.linkedin.com/in/steventejeda/",
		quote:
			"Nick consistently demonstrated a high level of dedication, technical prowess, and professionalism that greatly impressed the team. During his internship, Nick consistently stood out for his strong work ethic and eagerness to learn. He quickly adapted to our development environment and showcased a deep understanding of our software engineering principles. His ability to grasp complex concepts and apply them effectively was evident in the projects he undertook.",
	},
	{
		name: "Matthew Baker",
		role: "Senior Lead Software Engineer · JPMorganChase",
		linkedinUrl: "https://www.linkedin.com/in/matthew-baker-a339063/",
		quote:
			"Nicholas is a super smart software engineer — he was able to land a position with our front-end architecture group very early in his career, not an easy feat. Nick has a strong work ethic and is passionate about technology. He's also a really nice guy, easy to get along with. Nicholas is one of the rare people who is both highly technical but also aesthetically / design oriented. He was a strong member of our architecture team at JPMorgan Chase.",
	},
	{
		name: "Joshua Hwang",
		role: "Software Engineer · Fiserv",
		linkedinUrl: "https://www.linkedin.com/in/joshuaphwang/",
		quote:
			"While working on the API development team at Fiserv, I had the pleasure of working with Nick as he took on his first internship. Nick came in every day ready to learn and made an effort to always deliver on tasks assigned to him. In the span of 10 weeks, Nick quickly learned C# and TypeScript, and frameworks such as Asp.Net Core, Entity Framework, and Angular. His ability to take on challenges, gain background knowledge through research, and then seeing tasks to their completion allows me to confidently say that Nick would be a great addition to any team as a software engineer.",
	},
];

// Exported per-table so the deploy pipeline (scripts/seed-if-empty.ts) can
// seed only whichever tables are currently empty, instead of an all-or-
// nothing run — a DB can legitimately have some tables populated (by a
// prior seed, or by hand via /admin) and others still empty.

export async function seedCaseStudies(db: PrismaClient) {
	// One-time: the "acountabuddy" → "accountabuddy" rename (Aug 2026)
	// changes a primary key, which upsert can't do — it would leave the
	// old row orphaned. Idempotent no-op on a DB that never had it.
	await db.caseStudy.deleteMany({ where: { id: "acountabuddy" } });

	// One-time: Evangeliu Coffee pulled from the site (Aug 2026) — not
	// enough shipped yet to show. Upsert can't delete a dropped row, so
	// remove it explicitly. Idempotent no-op once applied.
	await db.caseStudy.deleteMany({ where: { id: "evangeliu" } });

	// Case studies — upsert by slug id.
	for (const [index, study] of cases.entries()) {
		await db.caseStudy.upsert({
			where: { id: study.id },
			create: {
				id: study.id,
				num: study.num,
				year: study.year,
				title: study.title,
				titleEm: study.titleEm,
				titleSuffix: study.titleSuffix,
				role: study.role,
				org: study.org,
				description: study.description,
				tags: study.tags,
				stats: study.stats,
				featured: study.featured ?? false,
				sortOrder: index,
			},
			update: {
				num: study.num,
				year: study.year,
				title: study.title,
				titleEm: study.titleEm,
				titleSuffix: study.titleSuffix,
				role: study.role,
				org: study.org,
				description: study.description,
				tags: study.tags,
				stats: study.stats,
				featured: study.featured ?? false,
				sortOrder: index,
			},
		});
	}
	console.log(`Seeded ${cases.length} case studies.`);
}

export async function seedCvEntries(db: PrismaClient) {
	// CV entries — no natural unique key in the source data, so clear + reinsert.
	await db.cvEntry.deleteMany({});
	await db.cvEntry.createMany({
		data: [
			...experience.map((entry, index) => ({
				category: "EXPERIENCE" as const,
				years: entry.years,
				title: entry.title,
				titleAccent: entry.titleAccent ?? [],
				where: entry.where,
				sortOrder: index,
			})),
			...education.map((entry, index) => ({
				category: "EDUCATION" as const,
				years: entry.years,
				title: entry.title,
				titleAccent: entry.titleAccent ?? [],
				where: entry.where,
				sortOrder: index,
			})),
			...activities.map((entry, index) => ({
				category: "ACTIVITY" as const,
				years: entry.years,
				title: entry.title,
				titleAccent: entry.titleAccent ?? [],
				where: entry.where,
				sortOrder: index,
			})),
		],
	});
	console.log(
		`Seeded ${experience.length + education.length + activities.length} CV entries.`,
	);
}

export async function seedSkills(db: PrismaClient) {
	// Skills & tools — same "no natural key" situation as CV entries.
	await db.skill.deleteMany({});
	await db.skill.createMany({
		data: [
			...skills.map((skill, index) => ({
				kind: "SKILL" as const,
				label: skill.label,
				accent: skill.accent,
				sortOrder: index,
			})),
			...favoriteTools.map((label, index) => ({
				kind: "TOOL" as const,
				label,
				sortOrder: index,
			})),
		],
	});
	console.log(`Seeded ${skills.length + favoriteTools.length} skills/tools.`);
}

export async function seedEndorsements(db: PrismaClient) {
	// Endorsements — no natural unique key, so same clear-and-reinsert
	// approach as CvEntry/Skill.
	await db.endorsement.deleteMany({});
	await db.endorsement.createMany({
		data: recommenders.map((recommender, index) => ({
			name: recommender.name,
			role: recommender.role,
			quote: recommender.quote,
			linkedinUrl: recommender.linkedinUrl,
			sortOrder: index,
		})),
	});
	console.log(`Seeded ${recommenders.length} endorsements.`);
}

export async function seedLanguages(db: PrismaClient) {
	// Languages — upsert by name (natural key), same approach as CaseStudy.
	for (const [index, language] of languages.entries()) {
		await db.language.upsert({
			where: { name: language.name },
			create: {
				name: language.name,
				level: language.level,
				sortOrder: index,
			},
			update: {
				level: language.level,
				sortOrder: index,
			},
		});
	}
	console.log(`Seeded ${languages.length} languages.`);
}

async function main() {
	const db = new PrismaClient();
	await seedCaseStudies(db);
	await seedCvEntries(db);
	await seedSkills(db);
	await seedEndorsements(db);
	await seedLanguages(db);
	await db.$disconnect();
}

// Only run when invoked directly (`npx prisma db seed` / `tsx prisma/seed.ts`),
// not when scripts/seed-if-empty.ts imports the functions above.
if (import.meta.url === `file://${process.argv[1]}`) {
	main().catch((e) => {
		console.error(e);
		process.exit(1);
	});
}
