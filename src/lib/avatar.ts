/** Client-side avatar fallback helper for cards that render a person (e.g.
 * endorsements) without a photo. Not persisted — derived from `name` at
 * render time, so there's no DB column for these. */
export function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}
