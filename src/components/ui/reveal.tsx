"use client";

import { m, useInView } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";

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
	/** Forwarded to the rendered element — e.g. for `aria-labelledby` targets. */
	id?: string;
};

const variants = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0 },
};

/**
 * Polymorphic scroll-reveal. Each `<Reveal>` owns its own `useInView`, so
 * it re-arms on every mount, including client-side route transitions — a
 * single shared observer scanned once at root-layout mount would not.
 *
 * Renders the `show` variant by default so prerendered/server HTML never
 * ships `opacity:0` — content is readable immediately and with JS disabled.
 * A layout effect checks, once per mount, whether the element started
 * off-screen (`getBoundingClientRect().top > innerHeight`); only then does
 * it "arm" the reveal, snapping to `hidden` (duration 0 — this happens
 * before the browser's first paint of that state, and only ever for
 * elements that are off-screen to begin with, so it's never visible) and
 * letting `useInView` animate it back to `show` once scrolled into view.
 * Above-the-fold elements never arm and simply stay visible.
 */
export function Reveal({
	as = "div",
	className,
	children,
	delay = 0,
	id,
}: RevealProps) {
	const ref = useRef(null);
	const [hasArmed, setHasArmed] = useState(false);
	const inView = useInView(ref, {
		once: true,
		amount: 0.12,
		margin: "0px 0px -40px 0px",
	});
	const enabled = useAnimationsEnabled();

	// Runs once per mount, synchronously before paint. Only elements that
	// start below the fold get armed — above-the-fold content never enters
	// the hidden state at all.
	useLayoutEffect(() => {
		const el = ref.current as HTMLElement | null;
		if (!el) return;
		const startsOffscreen = el.getBoundingClientRect().top > window.innerHeight;
		if (startsOffscreen) setHasArmed(true);
	}, []);

	const armed = enabled && hasArmed;
	const target = armed ? (inView ? "show" : "hidden") : "show";
	// Only the hidden -> show transition (the actual scroll reveal) animates;
	// arming into "hidden" and the disabled/above-the-fold "show" case both
	// snap instantly so nothing ever visibly fades out.
	const isRevealing = armed && target === "show";

	const Component = TAGS[as];

	return (
		<Component
			animate={target}
			className={className}
			id={id}
			initial={false}
			ref={ref}
			transition={{
				duration: isRevealing ? 0.8 : 0,
				ease: [0.2, 0.7, 0.2, 1],
				delay: isRevealing ? delay : 0,
			}}
			variants={variants}
		>
			{children}
		</Component>
	);
}
