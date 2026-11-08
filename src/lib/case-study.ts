import type { CaseStudy } from "../../generated/prisma";

/** Shape of `CaseStudy.stats` (Prisma `Json`), validated by Zod on write. */
export type CaseStat = { k: string; v: string };

export function caseTitle(study: CaseStudy) {
	return `${study.title ?? ""}${study.titleEm ?? ""}${study.titleSuffix ?? ""}`.trim();
}

// A date ("Nov '23", "2024", "May '24") is not the number that matters.
const DATE_LIKE = /'\d{2}\b|^(19|20)\d{2}$|\b(19|20)\d{2}\b/;

/**
 * The one figure worth showing large: the first stat whose value is a real
 * quantity ("+40% productivity", "500+", "44,894 tracks"), not a date or a
 * label. Returns undefined when a project has none.
 */
export function keyFigure(study: CaseStudy): CaseStat | undefined {
	const stats = study.stats as unknown as CaseStat[];
	return stats.find((stat) => /\d/.test(stat.v) && !DATE_LIKE.test(stat.v));
}
