/** Static CV content for the About page. Overlapping Fiserv/Rutgers `'23` dates are
 * intentional (correct per resume) — do not reconcile them. */
export type CvEntry = {
	/** Mono display years, e.g. "'25 — Now", "'23 — '24", "'23". Empty string is valid
	 * (no invented dates for entries without a clear range). */
	years: string;
	title: string;
	/** Optional word rendered as a subtle accent-text `<em>` within the title. */
	titleAccent?: string;
	/** "Employer · City, ST" meta line. */
	where: string;
};

export const experience: CvEntry[] = [
	{
		years: "'25 — Now",
		title: "Software Engineer I",
		where: "JPMorgan Chase & Co. · Jersey City, NJ",
	},
	{
		years: "'24",
		title: "Software Engineer Intern",
		where: "JPMorgan Chase & Co. · Jersey City, NJ",
	},
	{
		years: "'23 — '24",
		title: "Lead Web Developer",
		where: "Rutgers University–Newark GS-LSAMP · Newark, NJ",
	},
	{
		years: "'23",
		title: "Software Engineer Intern",
		where: "Fiserv · Berkeley Heights, NJ",
	},
];

export const education: CvEntry[] = [
	{
		years: "'21 — '24",
		title: "B.A. Computer Science",
		where: "Rutgers–Newark · Magna Cum Laude · Data Science minor",
	},
	{
		years: "",
		title: "Co-Founder & President",
		where: "ColorStack @ Rutgers",
	},
	{
		years: "",
		title: "Fellow",
		where: "Braven",
	},
];
