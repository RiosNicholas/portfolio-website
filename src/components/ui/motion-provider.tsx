"use client";

import { domAnimation, LazyMotion } from "motion/react";

/**
 * Loads only the `domAnimation` feature bundle (variants, gestures,
 * exit animations) instead of the full `motion` package — keeps the
 * animation runtime small. `strict` forces every animated element in the
 * tree to use `m.*` (never `motion.*`), matching the project's
 * bundle-size goals for this migration.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
	return (
		<LazyMotion features={domAnimation} strict>
			{children}
		</LazyMotion>
	);
}
