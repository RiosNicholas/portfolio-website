"use client";

import { m } from "motion/react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";

type GeoDecorationProps = {
	/** Continuous animation to run: gentle vertical bob, or slow rotation. */
	variant: "float" | "spin";
	/** Shape/position/color/opacity classes — passed straight through. */
	className?: string;
	/** Baseline rotation in degrees (only meaningful for `variant="float"`). */
	rot?: number;
};

/**
 * Decorative geo shape with a continuous Framer Motion animation, replacing
 * the CSS `.geo.float` / `.geo.spin` keyframes. Respects
 * `useAnimationsEnabled()` — renders statically (still at its base rotation)
 * when reduced motion or `data-motion="low"` is active.
 */
export function GeoDecoration({
	variant,
	className,
	rot = 0,
}: GeoDecorationProps) {
	const enabled = useAnimationsEnabled();

	if (!enabled) {
		return <m.div aria-hidden className={className} style={{ rotate: rot }} />;
	}

	if (variant === "spin") {
		return (
			<m.div
				animate={{ rotate: 360 }}
				aria-hidden
				className={className}
				transition={{ duration: 26, ease: "linear", repeat: Infinity }}
			/>
		);
	}

	return (
		<m.div
			animate={{ y: [0, -18, 0], rotate: [rot, rot + 6, rot] }}
			aria-hidden
			className={className}
			transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
		/>
	);
}
