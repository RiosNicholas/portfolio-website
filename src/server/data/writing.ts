import { unstable_cache } from "next/cache";
import { db } from "~/server/db";

// unstable_cache stores results as JSON, so dates leave these functions as
// ISO strings rather than Date objects that would silently turn into strings
// on a cache hit.

export type WritingItem = {
	kind: "article" | "mention";
	id: string;
	title: string;
	/** `/writing/<slug>` for an Article, the external URL for a Mention. */
	href: string;
	/** Null for an Article. */
	outlet: string | null;
	summary: string | null;
	tags: string[];
	publishedAt: string;
};

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
					tags: true,
					publishedAt: true,
				},
			}),
			db.mention.findMany({ where: { published: true } }),
		]);

		return [
			...articles.map((a) => ({
				kind: "article" as const,
				id: a.id,
				title: a.title,
				href: `/writing/${a.slug}`,
				outlet: null,
				summary: a.summary,
				tags: a.tags,
				// Always set once published (see the article router).
				publishedAt: (a.publishedAt ?? new Date()).toISOString(),
			})),
			...mentions.map((m) => ({
				kind: "mention" as const,
				id: m.id,
				title: m.title,
				href: m.url,
				outlet: m.outlet,
				summary: null,
				tags: m.tags,
				publishedAt: m.publishedAt.toISOString(),
			})),
		].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
	},
	["writing:feed:v1"],
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
	["articles:by-slug:v1"],
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
