"use client";

import { m } from "motion/react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";

type StatusDotProps = {
	className?: string;
};

const BASE_CLASS =
	"h-2 w-2 shrink-0 rounded-full bg-(--c-lime) shadow-[0_0_0_3px_color-mix(in_srgb,var(--c-lime)_30%,transparent)]";

/**
 * "Available" status dot with a continuous Framer Motion pulse, replacing
 * Tailwind's `animate-pulse` at its three call sites. Respects
 * `useAnimationsEnabled()` — renders statically (fully opaque) when reduced
 * motion or `data-motion="low"` is active, since `animate-pulse` doesn't.
 */
export function StatusDot({ className }: StatusDotProps) {
	const enabled = useAnimationsEnabled();

	if (!enabled) {
		return <m.span className={cn(BASE_CLASS, className)} />;
	}

	return (
		<m.span
			animate={{ opacity: [1, 0.5, 1] }}
			className={cn(BASE_CLASS, className)}
			transition={{ duration: 2, ease: [0.4, 0, 0.6, 1], repeat: Infinity }}
		/>
	);
}
