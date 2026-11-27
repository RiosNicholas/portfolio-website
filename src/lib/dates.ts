export type DateFields = {
	startYear: number | null;
	startMonth: number | null;
	endYear: number | null;
	endMonth: number | null;
	present: boolean;
};

export type DateForm = {
	startYear: string;
	startMonth: string;
	endYear: string;
	endMonth: string;
	present: boolean;
};

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const formatDate = (year: number, month: number | null) =>
	month ? `${MONTHS[month - 1]} ${year}` : `${year}`;

export function formatDateRange(d: DateFields): string {
	if (d.startYear === null) return "";
	const start = formatDate(d.startYear, d.startMonth);
	if (d.present) return `${start} - Present`;
	if (d.endYear === null) return start;
	return `${start} - ${formatDate(d.endYear, d.endMonth)}`;
}

// Month index from year 0; a year-only date counts as January.
const monthIndex = (year: number | null, month: number | null) =>
	(year ?? 0) * 12 + (month ?? 1) - 1;

export function sortByDate<T extends DateFields>(rows: T[]): T[] {
	return [...rows].sort((a, b) => {
		if (a.present !== b.present) return a.present ? -1 : 1;
		if (!a.present) {
			const endA = monthIndex(
				a.endYear ?? a.startYear,
				a.endYear === null ? a.startMonth : a.endMonth,
			);
			const endB = monthIndex(
				b.endYear ?? b.startYear,
				b.endYear === null ? b.startMonth : b.endMonth,
			);
			if (endA !== endB) return endB - endA;
		}
		return (
			monthIndex(b.startYear, b.startMonth) -
			monthIndex(a.startYear, a.startMonth)
		);
	});
}

const toInput = (n: number | null) => (n === null ? "" : String(n));
const toNumber = (s: string) => (s.trim() === "" ? null : Number(s));

export function toDateForm(d: DateFields): DateForm {
	return {
		startYear: toInput(d.startYear),
		startMonth: toInput(d.startMonth),
		endYear: toInput(d.endYear),
		endMonth: toInput(d.endMonth),
		present: d.present,
	};
}

export function fromDateForm(f: DateForm): DateFields {
	return {
		startYear: toNumber(f.startYear),
		startMonth: toNumber(f.startMonth),
		endYear: f.present ? null : toNumber(f.endYear),
		endMonth: f.present ? null : toNumber(f.endMonth),
		present: f.present,
	};
}
