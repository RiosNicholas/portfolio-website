import { profileLinks, siteUrl } from "~/lib/site-links";

export type PersonJsonLd = {
	"@context": "https://schema.org";
	"@type": "Person";
	name: string;
	jobTitle: string;
	url: string;
	sameAs: string[];
	worksFor: { "@type": "Organization"; name: string };
	address: { "@type": "PostalAddress"; addressLocality: string };
};

/** Rendered as a `<script type="application/ld+json">` in the root layout. */
export const personJsonLd: PersonJsonLd = {
	"@context": "https://schema.org",
	"@type": "Person",
	name: "Nicholas Rios",
	jobTitle: "Software Engineer",
	url: siteUrl,
	sameAs: [profileLinks.github, profileLinks.linkedin],
	worksFor: { "@type": "Organization", name: "JPMorganChase" },
	address: { "@type": "PostalAddress", addressLocality: "Jersey City, NJ" },
};
