export const profileLinks = {
	github: "https://github.com/RiosNicholas",
	linkedin: "https://www.linkedin.com/in/nicholas-rios/",
	resume:
		"https://drive.google.com/file/d/1Ev17k23REU0jirDuQRYNnxMCiXLzan31/view?usp=sharing",
} as const;

/**
 * OWNER TODO: placeholder domain, not a real deploy target. Metadata
 * (canonical URLs, OG tags, robots.txt/sitemap.xml) is generated from this
 * value — replace it with the real production domain before launch. Kept as
 * static content here (not an env var) so `npm run build` never requires a
 * domain to be configured to succeed.
 */
export const siteUrl = "https://nicholasrios.dev";

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/work", label: "Work" },
	{ href: "/about", label: "About" },
];
