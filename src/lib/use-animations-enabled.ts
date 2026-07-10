"use client";

import { useEffect, useState } from "react";

/**
 * Single source of truth for "should rich motion play."
 *
 * Returns `false` when the user prefers reduced motion OR the site's
 * `data-motion="low"` setting is active; `true` otherwise. Framer Motion
 * animates via JS, so the existing `:root[data-motion="low"] * { … }` CSS
 * throttle does not affect it — every migrated animation must route through
 * this hook instead.
 *
 * Hydration-safe: seeds `true` (matching the server's "assume motion is on"
 * render) and only corrects the value in an effect, never during render.
 * Stays reactive to live changes to either signal.
 */
export function useAnimationsEnabled(): boolean {
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");

		const evaluate = () => {
			const reduced = media.matches;
			const low = document.documentElement.dataset.motion === "low";
			setEnabled(!reduced && !low);
		};

		evaluate();

		media.addEventListener("change", evaluate);

		const observer = new MutationObserver(evaluate);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-motion"],
		});

		return () => {
			media.removeEventListener("change", evaluate);
			observer.disconnect();
		};
	}, []);

	return enabled;
}
