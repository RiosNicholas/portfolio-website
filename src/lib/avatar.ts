/** Client-side avatar fallback helpers for cards that render a person (e.g.
 * endorsements) without a photo. Not persisted — derived from `name` at
 * render time, so there's no DB column for these. */
const AVATAR_PALETTE = [
	"#2f4a3a",
	"#a8433a",
	"#27477a",
	"#556b2f",
	"#b98a2e",
	"#b0613e",
] as const;

export function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function getAvatarColor(name: string): string {
	const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
	return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0];
}
