import { z } from "zod";

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const MIN_MONTH = 1;
const MAX_MONTH = 12;

const year = z.number().int().min(MIN_YEAR).max(MAX_YEAR);
const month = z.number().int().min(MIN_MONTH).max(MAX_MONTH);

/** Structured date range shared by CV entries and case studies. */
export const dateFieldsSchema = z.object({
	startYear: year,
	startMonth: month.nullable(),
	endYear: year.nullable(),
	endMonth: month.nullable(),
	present: z.boolean(),
});
