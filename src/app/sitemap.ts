import type { MetadataRoute } from "next";

import { navLinks, siteUrl } from "~/lib/site-links";
import { getPublishedArticleSlugs } from "~/server/data/writing";

/**
 * Nav pages come from `navLinks` plus `/resume`, which is linked from the site
 * but kept out of the nav. Published articles come from the database.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const articles = await getPublishedArticleSlugs();

	return [
		...[...navLinks, { href: "/resume" }].map(({ href }) => ({
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
