export const profileLinks = {
	github: "https://github.com/RiosNicholas",
	linkedin: "https://www.linkedin.com/in/nicholas-rios/",
	resume:
		"https://drive.google.com/file/d/1Ev17k23REU0jirDuQRYNnxMCiXLzan31/view?usp=sharing",
} as const;

/**
 * Every canonical URL, OG tag, and `robots.txt`/`sitemap.xml` entry is
 * generated from this value, so it must match the domain the site is
 * actually served from. Static content rather than an env var so
 * `npm run build` never requires a domain to be configured to succeed.
 */
export const siteUrl = "https://nicholasrios.dev";

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/work", label: "Work" },
	{ href: "/about", label: "About" },
];
