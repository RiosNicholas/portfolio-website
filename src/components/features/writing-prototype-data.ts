// PROTOTYPE ONLY. Hardcoded sample entries for the /writing layout prototype.

export type SampleEntry = {
	id: string;
	kind: "embed" | "link" | "article";
	/** Shown outside any iframe. */
	source: string;
	/** Fuzzy date, already formatted: "2025", "Mar 2024", "Nov 12, 2026". */
	date: string;
	title?: string;
	summary?: string;
	tags: string[];
	/** Real link to the original post, page or article. */
	href: string;
	embed?: { provider: "linkedin" | "youtube"; src: string; id: string };
	image?: string;
};

export const sampleEntries: SampleEntry[] = [
	{
		id: "linkedin-lsamp",
		kind: "embed",
		source: "LinkedIn",
		date: "2025",
		title: "LSAMP Shout-Out",
		tags: ["Community"],
		href: "https://www.linkedin.com/feed/update/urn:li:activity:7282169875932790785",
		embed: {
			provider: "linkedin",
			id: "7282169875932790785",
			src: "https://www.linkedin.com/embed/feed/update/urn:li:activity:7282169875932790785",
		},
	},
	{
		id: "youtube-streaming",
		kind: "embed",
		source: "YouTube",
		date: "Mar 2024",
		tags: ["Next.js"],
		href: "https://www.youtube.com/watch?v=Nl4OwNhh2QI",
		embed: {
			provider: "youtube",
			id: "Nl4OwNhh2QI",
			src: "https://www.youtube-nocookie.com/embed/Nl4OwNhh2QI",
		},
	},
	{
		id: "link-github",
		kind: "link",
		source: "GitHub",
		date: "Jun 2024",
		title: "vercel/next.js",
		summary: "The React framework. Sample link with a preview image.",
		tags: ["AI"],
		href: "https://github.com/vercel/next.js",
		image: "https://opengraph.githubassets.com/1/vercel/next.js",
	},
	{
		id: "link-nytimes",
		kind: "link",
		source: "nytimes.com",
		date: "2023",
		title: "Sample text-only mention",
		tags: [],
		href: "https://www.nytimes.com/",
	},
	{
		id: "article-design-systems",
		kind: "article",
		source: "Article",
		date: "Nov 12, 2026",
		title: "Sample article about design systems",
		summary:
			"A short summary of a piece written for this site. Used only to test the card layout.",
		tags: ["design systems"],
		href: "/writing/sample-article",
	},
];
