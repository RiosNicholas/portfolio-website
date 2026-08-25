/**
 * Languages spoken, with proficiency level. Low-churn, non-user-generated
 * content — kept as a typed const per README §"Content & admin" precedent
 * (`site-links.ts`, `structured-data.ts`) rather than a Prisma model.
 */
export type Language = { name: string; level: string };

export const languages: Language[] = [
	{ name: "English", level: "Native" },
	{ name: "Spanish", level: "Native" },
	{ name: "Portuguese", level: "Learning" },
];
