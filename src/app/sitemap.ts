import type { MetadataRoute } from "next";

import { navLinks, siteUrl } from "~/lib/site-links";

/**
 * Derived from `navLinks` so adding a nav link keeps this in sync — nothing
 * here is read from the filesystem.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return navLinks.map(({ href }) => ({
		url: `${siteUrl}${href}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: href === "/" ? 1 : 0.8,
	}));
}
