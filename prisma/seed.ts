/**
 * Seed: originally a one-time migration of the static content that used to
 * live in `src/lib/{work-data,about-data,bento-data}.ts` into Postgres; now
 * also the supported way to apply post-migration content edits (skills,
 * case-study copy fixes/additions) to a fresh or existing DB. Run via
 * `npx prisma db seed` (or automatically after `prisma migrate dev`).
 *
 * Endorsements are real recommendations copy-pasted from LinkedIn (not the
 * 12 fabricated placeholders that used to live in `src/lib/endorsements.ts`
 * — those are gone for good), split into multiple single-sentence quote
 * cards per person rather than one long paragraph each. Same person can
 * legitimately have several rows sharing one `linkedinUrl`, so unlike
 * `CaseStudy` there's no natural per-row unique key — this table falls
 * into the same "clear and reinsert" bucket as `CvEntry`/`Skill` below.
 *
 * `CaseStudy` rows are upserted by their slug `id` (stable, load-bearing as
 * `/work#<id>` anchors) so re-running this script is safe. `CvEntry`,
 * `Skill`, and `Endorsement` have no natural unique key from the source
 * data, so this script clears and re-inserts those three tables on every
 * run — fine for the initial migration, but don't re-run it after you've
 * started editing CV entries, skills, or endorsements by hand via /admin,
 * or those edits will be wiped.
 *
 * IMPORTANT: this script writes to Postgres directly, bypassing tRPC, so it
 * never calls `revalidateTag()` — unlike an edit made through /admin, a
 * change here won't show up on the public pages until the Next.js data
 * cache is cleared (restart `next dev` locally, or redeploy in production).
 */
import { PrismaClient } from "../generated/prisma";

const db = new PrismaClient();

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
		year: "2025 —",
		title: "Risk Tech ",
		titleEm: "Agents",
		featured: true,
		role: "Platform · Lead UI",
		org: "Credit Risk Technology · Internal · NDA",
		description:
			"Purpose-built agents sitting between risk analysts and internal tooling. Lead UI design system, streaming patterns, review flows, audit surfaces.",
		tags: ["Next.js", "shadcn/ui", "MCP", "Claude · GPT", "Pydantic"],
		stats: [
			{ k: "Hours reclaimed/wk", v: "~32" },
			{ k: "Surfaces shipped", v: "14" },
			{ k: "DS coverage", v: "94%" },
		],
	},
	{
		id: "evangeliu",
		num: "002",
		year: "2025",
		title: "",
		titleEm: "Evangeliu",
		titleSuffix: " Coffee",
		featured: true,
		role: "Freelance · Full-stack",
		org: "Roaster & green distributor · Next · Sanity · Stripe",
		description:
			"Website for a specialty roaster with green bean sourcing. Editorial product pages, subscriptions, wholesale portal. Feels like the shop — records, plants, chalkboard menu.",
		tags: ["Next.js", "Sanity", "Stripe", "Tailwind", "GSAP"],
		stats: [
			{ k: "Return visitors", v: "+41%" },
			{ k: "Subscribers", v: "280" },
			{ k: "Launched", v: "Mar '25" },
		],
	},
	{
		id: "accountabuddy",
		num: "003",
		year: "2024",
		title: "",
		titleEm: "Accountabuddy",
		featured: true,
		role: "Solo · Product & Engineering",
		org: "Habit pairing app · React Native · Supabase",
		description:
			"Accountability app pairing you with exactly one other person — not a feed, not a streak machine. You set a thing, they set a thing, the app handles nudges. Designed, built, shipped in 8 weeks.",
		tags: ["Expo", "Supabase", "Push", "Tamagui"],
		stats: [
			{ k: "DAU/MAU", v: "0.48" },
			{ k: "Pair completion", v: "63%" },
			{ k: "Beta users", v: "~900" },
		],
	},
	{
		id: "gslsamp",
		num: "004",
		year: "Feb '23 — May '24",
		title: "",
		titleEm: "GS-LSAMP",
		titleSuffix: " Website",
		role: "Lead Web Developer",
		org: "Rutgers University–Newark · NSF GS-LSAMP · Next · TypeScript",
		description:
			"Official site for the NSF-sponsored GS-LSAMP program at Rutgers–Newark. Surfaces undergraduate research, funding, and post-bacc pathways in STEM for 500+ students and staff from historically underrepresented backgrounds. Built and maintained from first commit through handoff.",
		tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
		stats: [
			{ k: "Students & staff", v: "500+" },
			{ k: "Tenure", v: "16 mo" },
			{ k: "Shipped", v: "May '24" },
		],
	},
	{
		id: "groove-exchange",
		num: "005",
		year: "Nov '23",
		title: "",
		titleEm: "Groove",
		titleSuffix: " Exchange",
		role: "Solo · Full-stack",
		org: "Anonymous music forum · React · Node · Express",
		description:
			"Full-stack forum where music people argue about records without a username attached. Anonymous threads, posts, and critique on whatever's in rotation. Built and deployed end to end as a CodePath capstone.",
		tags: ["React", "JavaScript", "Node", "REST"],
		stats: [
			{ k: "Scope", v: "Full-stack" },
			{ k: "Program", v: "CodePath" },
			{ k: "Shipped", v: "Nov '23" },
		],
	},
	{
		id: "datawell",
		num: "006",
		year: "Sep '23",
		title: "",
		titleEm: "DataWell",
		role: "Co-developer · Frontend",
		org: "Wellfare · NYC nonprofit · React · Tailwind",
		description:
			"In-house CRM dashboards for Wellfare, a NYC nonprofit. Staff-facing views that personalize each recipient's shopping experience and make tracking legible instead of spreadsheet archaeology. Co-built with a team at Code for Good.",
		tags: ["React", "Tailwind", "JavaScript", "CRM"],
		stats: [
			{ k: "Scope", v: "Frontend" },
			{ k: "Program", v: "Code for Good" },
			{ k: "Shipped", v: "Sep '23" },
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
	{ label: "React · Next.js", accent: "Next.js" },
	{ label: "TypeScript" },
	{ label: "Design systems" },
	{ label: "Tailwind · shadcn/ui", accent: "shadcn/ui" },
	{ label: "Framer Motion" },
	{ label: "Agents · LLM UX", accent: "LLM UX" },
	{ label: "Agentic AI development" },
	{ label: "Prompt engineering" },
	{ label: "Node · Python" },
	{ label: "Postgres" },
	{ label: "Platform engineering" },
	{ label: "Observability" },
	{ label: "CI / CD" },
	{ label: "Animation & motion" },
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
];

// ─── Endorsements (real LinkedIn recommendations) ───────────────────────────

type SeedEndorsement = {
	name: string;
	role: string;
	quote: string;
	linkedinUrl: string;
};

type SeedRecommender = {
	name: string;
	role: string;
	linkedinUrl: string;
	/** Each entry becomes its own marquee card -- split from one LinkedIn
	 * recommendation into separate sentence-level quotes, verbatim. */
	quotes: string[];
};

const recommenders: SeedRecommender[] = [
	{
		name: "Matthew Baker",
		role: "Senior Lead Software Engineer · JPMorganChase",
		linkedinUrl: "https://www.linkedin.com/in/matthew-baker-a339063/",
		quotes: [
			"Nicholas is a super smart software engineer… he was able to land a position with our front-end architecture group very early in his career… not an easy feat.",
			"Nick has a strong work ethic and is passionate about technology.",
			"He's also a really nice guy, easy to get along with, etc.",
			"Nicholas is one of the rare people who is both highly technical but also aesthetically / design oriented.",
			"He was a strong member of our architecture team at JPMorgan Chase.",
		],
	},
	{
		name: "Steven Tejeda",
		role: "Senior Software Engineer II · Fiserv",
		linkedinUrl: "https://www.linkedin.com/in/steventejeda/",
		quotes: [
			"Nick consistently demonstrated a high level of dedication, technical prowess, and professionalism that greatly impressed the team.",
			"During his internship, Nick consistently stood out for his strong work ethic and eagerness to learn.",
			"He quickly adapted to our development environment and showcased a deep understanding of our software engineering principles.",
			"His ability to grasp complex concepts and apply them effectively was evident in the projects he undertook.",
		],
	},
	{
		name: "Joshua Hwang",
		role: "Software Engineer · Fiserv",
		linkedinUrl: "https://www.linkedin.com/in/joshuaphwang/",
		quotes: [
			"While working on the API development team at Fiserv, I had the pleasure of working with Nick as he took on his first internship.",
			"Nick came in every day ready to learn and made an effort to always deliver on tasks assigned to him.",
			"In the span of 10 weeks, Nick quickly learned C# and TypeScript, and frameworks such as Asp.Net Core, Entity Framework, and Angular.",
			"His ability to take on challenges, gain background knowledge through research, and then seeing tasks to their completion allows me to confidently say that Nick would be a great addition to any team as a software engineer.",
		],
	},
];

// Interleave round-robin across people so the marquee doesn't show the same
// name several times in a row.
const endorsements: SeedEndorsement[] = [];
const maxQuotes = Math.max(...recommenders.map((r) => r.quotes.length));
for (let i = 0; i < maxQuotes; i++) {
	for (const r of recommenders) {
		const quote = r.quotes[i];
		if (quote) {
			endorsements.push({
				name: r.name,
				role: r.role,
				quote,
				linkedinUrl: r.linkedinUrl,
			});
		}
	}
}

async function main() {
	// One-time: the "acountabuddy" → "accountabuddy" rename (Aug 2026)
	// changes a primary key, which upsert can't do — it would leave the
	// old row orphaned. Idempotent no-op on a DB that never had it.
	await db.caseStudy.deleteMany({ where: { id: "acountabuddy" } });

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

	// Endorsements — no natural unique key once one person can have several
	// quote cards, so same clear-and-reinsert approach as CvEntry/Skill.
	await db.endorsement.deleteMany({});
	await db.endorsement.createMany({
		data: endorsements.map((endorsement, index) => ({
			name: endorsement.name,
			role: endorsement.role,
			quote: endorsement.quote,
			linkedinUrl: endorsement.linkedinUrl,
			sortOrder: index,
		})),
	});
	console.log(`Seeded ${endorsements.length} endorsements.`);
}

main()
	.then(async () => {
		await db.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await db.$disconnect();
		process.exit(1);
	});
