import type { DateFields } from "./dates";

const MONTHS = [
	"jan",
	"feb",
	"mar",
	"apr",
	"may",
	"jun",
	"jul",
	"aug",
	"sep",
	"oct",
	"nov",
	"dec",
];
const CENTURY = 2000;
const PART = /^(?:([a-z]{3})\s+(?:['’](\d{2})|(\d{4}))|(\d{4}))$/i;

function parsePart(text: string) {
	const match = text.trim().match(PART);
	if (!match) return null;
	const [, monthName, shortYear, longYear, bareYear] = match;
	const year = shortYear
		? CENTURY + Number(shortYear)
		: Number(longYear ?? bareYear);
	if (monthName === undefined) return { year, month: null };
	const index = MONTHS.indexOf(monthName.toLowerCase());
	return index < 0 ? null : { year, month: index + 1 };
}

// Parses strings like "Feb '25 - Present", "Oct '23", "2024" or "2025 -".
export function parseLegacyDate(text: string): DateFields | null {
	const [startText = "", endText, extra] = text.trim().split(/\s*[-–—]\s*/);
	const start = parsePart(startText);
	if (!start || extra !== undefined) return null;
	const base = { startYear: start.year, startMonth: start.month };
	if (endText === undefined)
		return { ...base, endYear: null, endMonth: null, present: false };
	if (endText === "" || /^present$/i.test(endText)) {
		return { ...base, endYear: null, endMonth: null, present: true };
	}
	const end = parsePart(endText);
	return end
		? { ...base, endYear: end.year, endMonth: end.month, present: false }
		: null;
}
