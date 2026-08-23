export type CvEntry = {
	/** Mono display range with month precision, e.g. "Feb '25 — Now", "Jun '24 — Aug '24".
	 * Empty string is valid (no invented dates for entries without a clear range). */
	years: string;
	title: string;
	/** Optional word(s) rendered as a subtle accent-text `<em>` within the title. */
	titleAccent?: string[];
	/** "Employer · City, ST" meta line. */
	where: string;
};

export const experience: CvEntry[] = [
	{
		years: "Feb '25 — Now",
		title: "Software Engineer",
		where: "JPMorgan Chase & Co. · Jersey City, NJ",
	},
	{
		years: "Jun '24 — Aug '24",
		title: "Software Engineer Intern",
		where: "JPMorgan Chase & Co. · Jersey City, NJ",
	},
	{
		years: "Feb '23 — May '24",
		title: "Lead Web Developer",
		where: "Rutgers University–Newark GS-LSAMP · Newark, NJ",
	},
	{
		years: "Jun '23 — Aug '23",
		title: "Software Engineer Intern",
		where: "Fiserv · Berkeley Heights, NJ",
	},
];

export const education: CvEntry[] = [
	{
		years: "Sep '21 — Dec '24",
		title: "B.A. Computer Science, Minor in Data Science",
		titleAccent: ["Computer Science"],
		where: "Rutgers University · Magna Cum Laude",
	},
	{
		years: "Feb '23 — Nov '23",
		title: "Certificate in Web Development",
		where: "CodePath",
	},
];

export const activities: CvEntry[] = [
	{
		years: "Apr '23 — Now",
		title: "Co-Founder & President",
		where: "ColorStack Chapter @ Rutgers University–Newark",
	},
	{
		years: "Oct '24 — Dec '24",
		title: "Chapter Ambassador",
		where: "ColorStack",
	},
	{
		years: "Oct '24 — Dec '24",
		title: "Fellow",
		where: "Braven",
	},
	{
		years: "Oct '23",
		title: "Apprentice",
		where: "#ChangeMakers Summit · Wells Fargo",
	},
];
