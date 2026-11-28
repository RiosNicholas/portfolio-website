import { unstable_cache } from "next/cache";
import { formatDateParts } from "~/lib/dates";
import { embedUrlFor, type SourceMatch, sourceFor } from "~/lib/sources";
import { db } from "~/server/db";

// unstable_cache stores results as JSON, so dates leave these functions as
// ISO strings rather than Date objects that would silently turn into strings
// on a cache hit.

export type WritingItem = {
	kind: "article" | "mention";
	id: string;
	/** Always set for an Article. Optional for a Mention whose Source embeds. */
	title: string | null;
	/** `/writing/<slug>` for an Article, the external URL for a Mention. */
	href: string;
	/** Null for an Article. */
	source: SourceMatch | null;
	/** The iframe src when a Mention's Source embeds it. */
	embedUrl: string | null;
	/** Hotlinked preview for a link Mention. Null shows a text card. */
	imageUrl: string | null;
	summary: string | null;
	topicTags: string[];
	year: number;
	month: number | null;
	day: number | null;
	/** "2025", "Mar 2025" or "Mar 4, 2025". */
	dateLabel: string;
	/** The same precision for `<time dateTime>`: "2025", "2025-03" or "2025-03-04". */
	dateTime: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

const dateParts = (year: number, month: number | null, day: number | null) => ({
	year,
	month,
	day,
	dateLabel: formatDateParts(year, month, day),
	dateTime: month
		? `${year}-${pad(month)}${day ? `-${pad(day)}` : ""}`
		: `${year}`,
});

// YYYYMMDD. A missing month or day counts as the first, so a year-only date
// sorts as the start of that year.
const sortKey = (item: WritingItem) =>
	item.year * 10000 + (item.month ?? 1) * 100 + (item.day ?? 1);

/** Published Articles and Mentions merged into one feed, newest first. */
export const getWritingFeed = unstable_cache(
	async (): Promise<WritingItem[]> => {
		const [articles, mentions] = await Promise.all([
			db.article.findMany({
				where: { published: true },
				select: {
					id: true,
					slug: true,
					title: true,
					summary: true,
					topicTags: true,
					publishedAt: true,
					createdAt: true,
				},
			}),
			db.mention.findMany({ where: { published: true } }),
		]);

		return [
			...articles.map((a) => {
				// Always set once published (see the article router).
				const date = a.publishedAt ?? a.createdAt;
				return {
					kind: "article" as const,
					id: a.id,
					title: a.title,
					href: `/writing/${a.slug}`,
					source: null,
					embedUrl: null,
					imageUrl: null,
					summary: a.summary,
					topicTags: a.topicTags,
					...dateParts(
						date.getUTCFullYear(),
						date.getUTCMonth() + 1,
						date.getUTCDate(),
					),
				};
			}),
			...mentions.map((m) => ({
				kind: "mention" as const,
				id: m.id,
				title: m.title,
				href: m.url,
				source: sourceFor(m.url, m.sourceName),
				embedUrl: embedUrlFor(m.url),
				imageUrl: m.imageUrl,
				summary: null,
				topicTags: m.topicTags,
				...dateParts(m.year, m.month, m.day),
			})),
		].sort((a, b) => sortKey(b) - sortKey(a));
	},
	["writing:feed:v2"],
	{ tags: ["articles", "mentions"] },
);

export const getArticleBySlug = unstable_cache(
	async (slug: string) => {
		const article = await db.article.findFirst({
			where: { slug, published: true },
		});
		if (!article) return null;
		return {
			...article,
			publishedAt: (article.publishedAt ?? article.createdAt).toISOString(),
			createdAt: article.createdAt.toISOString(),
			updatedAt: article.updatedAt.toISOString(),
		};
	},
	["articles:by-slug:v2"],
	{ tags: ["articles"] },
);

/** Slugs for `generateStaticParams` and the sitemap. */
export const getPublishedArticleSlugs = unstable_cache(
	async () =>
		(
			await db.article.findMany({
				where: { published: true },
				select: { slug: true, updatedAt: true },
			})
		).map((a) => ({ slug: a.slug, updatedAt: a.updatedAt.toISOString() })),
	["articles:slugs:v1"],
	{ tags: ["articles"] },
);
