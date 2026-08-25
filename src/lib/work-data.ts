/** Static case study content for the Work page. `work-teaser.tsx` derives its
 * rows from `featuredCases` below, so this is the single source of truth —
 * no separate list to keep in sync. */
export type CaseStat = { k: string; v: string };

export type CaseStudy = {
	/** Anchor target, matches `/work#<id>` links from `work-teaser.tsx`. */
	id: string;
	num: string;
	/** Mono display year, e.g. "2025 —", "2025", "2024", "2023 —". */
	year: string;
	/** Leading plain text before the accent `<em>`. Empty string is valid. */
	title: string;
	/** Accent-em word rendered inside the title. */
	titleEm?: string;
	/** Trailing plain text after the accent `<em>`. */
	titleSuffix?: string;
	role: string;
	org: string;
	description: string;
	tags: string[];
	/** Exactly 3 stats per case. */
	stats: CaseStat[];
	/** Shown in the home page's `WorkTeaser`. Not every case study needs to be. */
	featured?: boolean;
};

export const cases: CaseStudy[] = [
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
		id: "acountabuddy",
		num: "003",
		year: "2024",
		title: "",
		titleEm: "Acountabuddy",
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
		year: "2023 —",
		title: "",
		titleEm: "gslsamp",
		titleSuffix: " Run Club",
		role: "Co-maintainer · Community",
		org: "Astro · MDX · Open source",
		description:
			"Scrappy static site for a weekly run club — schedule, routes, shoe opinions, an active blog. Maintained with friends. Exists to make Sunday mornings less negotiable.",
		tags: ["Astro", "MDX", "Mapbox", "OSS"],
		stats: [
			{ k: "Runs logged", v: "312" },
			{ k: "Contributors", v: "9" },
			{ k: "Pace", v: "easy" },
		],
	},
];

export const featuredCases: CaseStudy[] = cases.filter(
	(study) => study.featured,
);
