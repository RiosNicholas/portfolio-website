import type { MetadataRoute } from "next";

import { navLinks, siteUrl } from "~/lib/site-links";

/**
 * Derived from `navLinks` plus `/resume`, which is linked from the site but
 * kept out of the nav. Nothing here is read from the filesystem.
 */
export default function sitemap(): MetadataRoute.Sitemap {
	return [...navLinks, { href: "/resume" }].map(({ href }) => ({
		url: `${siteUrl}${href}`,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: href === "/" ? 1 : 0.8,
	}));
}
