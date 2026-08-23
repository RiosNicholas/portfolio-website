"use client";

import {
	animate,
	useInView,
	useMotionValue,
	useMotionValueEvent,
} from "motion/react";
import { useEffect, useRef } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";

type NumberTickerProps = {
	value: number;
	duration?: number;
	className?: string;
};

/**
 * In-view count-up primitive, replacing the manual `requestAnimationFrame` +
 * `IntersectionObserver` loop that used to live in `bento-grid.tsx`'s
 * `YearsCell`. Deliberately a plain `<span>` driven by a `MotionValue` (the
 * `custom-cursor.tsx` idiom) rather than a `MotionValue` rendered as a
 * motion-component child, so it has zero interaction with `LazyMotion strict`.
 *
 * The `0` literal in the initial render keeps server HTML stable — never
 * re-render this span with different children, since React would clobber
 * the imperatively written `textContent`.
 */
export function NumberTicker({
	value,
	duration = 0.9,
	className,
}: NumberTickerProps) {
	const ref = useRef<HTMLSpanElement>(null);
	const count = useMotionValue(0);
	const inView = useInView(ref, { once: true, amount: 0.5 });
	const enabled = useAnimationsEnabled();

	useMotionValueEvent(count, "change", (v) => {
		if (ref.current) ref.current.textContent = String(Math.round(v));
	});

	useEffect(() => {
		if (!inView) return;

		if (!enabled) {
			count.set(value);
			return;
		}

		const controls = animate(count, value, {
			duration,
			ease: [0.33, 1, 0.68, 1],
		});
		return () => controls.stop();
	}, [inView, enabled, value, duration, count]);

	return (
		<span className={className} ref={ref}>
			0
		</span>
	);
}
