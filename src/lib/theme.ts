/**
 * Shared theme constants for the pre-paint init script (`ThemeInitScript`),
 * the SSR-rendered `<html>` attribute seed in `layout.tsx`, and
 * `ThemeToggle`'s localStorage key.
 */

export const themeStorageKeys = {
	theme: "theme",
	accent: "accent",
	grid: "grid",
	motion: "motion",
} as const;

/**
 * SSR seed values only — what the server renders on `<html>` before any
 * client script runs. On the client, an absent stored `theme` resolves via
 * `prefers-color-scheme`, NOT via `themeDefaults.theme` — see
 * `ThemeInitScript`. Do not "simplify" that away.
 */
export const themeDefaults = {
	theme: "light",
	accent: "cobalt",
	grid: "subtle",
	motion: "high",
} as const;
