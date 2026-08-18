"use client";

import { domAnimation, LazyMotion } from "motion/react";
import { createContext, useEffect, useState } from "react";

/**
 * Context backing `useAnimationsEnabled` (`~/lib/use-animations-enabled`).
 * Seeded `true` to match the server's "assume motion is on" render — every
 * consumer must stay hydration-safe against that seed, so don't change it.
 */
export const AnimationsEnabledContext = createContext(true);

/**
 * Single `matchMedia` + `MutationObserver` pair for the whole tree.
 * Previously every `Reveal`/`GeoDecoration`/`Marquee`/`CustomCursor`
 * instance created its own pair of each (20+ per page, torn down and
 * recreated on every navigation) — this hoists that subscription here,
 * once, since `MotionProvider` already wraps the entire app.
 */
function useAnimationsEnabledValue(): boolean {
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

/**
 * Loads only the `domAnimation` feature bundle (variants, gestures,
 * exit animations) instead of the full `motion` package — keeps the
 * animation runtime small. `strict` forces every animated element in the
 * tree to use `m.*` (never `motion.*`), matching the project's
 * bundle-size goals for this migration.
 *
 * Also provides `AnimationsEnabledContext` — the single accessibility-motion
 * subscription every `useAnimationsEnabled()` call site reads from.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
	const enabled = useAnimationsEnabledValue();

	return (
		<LazyMotion features={domAnimation} strict>
			<AnimationsEnabledContext.Provider value={enabled}>
				{children}
			</AnimationsEnabledContext.Provider>
		</LazyMotion>
	);
}
