"use client";

import { m, useInView } from "motion/react";
import { useRef } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";

const TAGS = {
	div: m.div,
	p: m.p,
	h1: m.h1,
	h2: m.h2,
} as const;

type RevealTag = keyof typeof TAGS;

type RevealProps = {
	as?: RevealTag;
	className?: string;
	children: React.ReactNode;
	delay?: number;
};

const variants = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0 },
};

/**
 * Polymorphic scroll-reveal. Replaces the old `.reveal` class +
 * `RevealObserver` IntersectionObserver singleton — this is the bug fix.
 * Each `<Reveal>` owns its own `useInView`, so it re-arms on every mount
 * (including client-side route transitions), unlike the old observer which
 * only ever scanned the DOM once at root layout mount.
 *
 * `initial={false}` plus seeding `useAnimationsEnabled()` to `true` keeps
 * the server-rendered markup and the first client render byte-identical
 * (both render "hidden"), avoiding hydration mismatches.
 */
export function Reveal({
	as = "div",
	className,
	children,
	delay = 0,
}: RevealProps) {
	const ref = useRef(null);
	const inView = useInView(ref, {
		once: true,
		amount: 0.12,
		margin: "0px 0px -40px 0px",
	});
	const enabled = useAnimationsEnabled();

	const Component = TAGS[as];

	return (
		<Component
			animate={enabled ? (inView ? "show" : "hidden") : "show"}
			className={className}
			initial={false}
			ref={ref}
			transition={{
				duration: enabled ? 0.8 : 0,
				ease: [0.2, 0.7, 0.2, 1],
				delay: enabled ? delay : 0,
			}}
			variants={variants}
		>
			{children}
		</Component>
	);
}
