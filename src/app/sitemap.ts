import type { MetadataRoute } from "next";

import { navLinks, siteUrl } from "~/lib/site-links";
import { getPublishedArticleSlugs } from "~/server/data/writing";

/**
 * Nav pages come from `navLinks`, so adding a nav link keeps this in sync.
 * Published articles come from the database, one entry per article.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const articles = await getPublishedArticleSlugs();

	return [
		...navLinks.map(({ href }) => ({
			url: `${siteUrl}${href}`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: href === "/" ? 1 : 0.8,
		})),
		...articles.map(({ slug, updatedAt }) => ({
			url: `${siteUrl}/writing/${slug}`,
			lastModified: new Date(updatedAt),
		})),
	];
}
