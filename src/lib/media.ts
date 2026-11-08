/**
 * Real pictures for the public pages. Nothing here is rendered until it
 * points at a real file: drop the image into `public/` and register it
 * below. Pages lay out cleanly without any entry, so never add a stand-in.
 *
 * - `heroPhoto`: one of your own street photographs, shown large on the
 *   home page next to the headline. Landscape or 4:5 portrait both work.
 * - `projectMedia`: one large, real screenshot (or poster frame) per case
 *   study, keyed by the case study's `id` (e.g. "accountabuddy").
 */

export type Media = {
	/** Path under `public/`, e.g. "/photos/journal-square.jpg". */
	src: string;
	alt: string;
	width: number;
	height: number;
	/** Short line under the picture: what and where. Optional. */
	caption?: string;
};

export const heroPhoto: Media | null = null;

export const projectMedia: Partial<Record<string, Media>> = {};
