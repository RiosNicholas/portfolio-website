"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";

const HOLD_MS = 2400;
// The last phrase closes the sentence, so it stays up a beat longer.
const FINAL_HOLD_MS = 3600;

/**
 * The hero's live line: reads as one sentence across a full loop
 * ("web applications," … "and agentic AI tooling") and then starts over.
 * Screen readers get the full sentence from the heading's sr-only text.
 * With reduced motion it shows `still` instead, a complete phrase that
 * doesn't end on a comma.
 */
export function RotatingPhrase({
	phrases,
	still,
}: {
	phrases: string[];
	still: string;
}) {
	const enabled = useAnimationsEnabled();
	const [index, setIndex] = useState(0);

	useEffect(() => {
		if (!enabled) return;
		const isLast = index === phrases.length - 1;
		const id = window.setTimeout(
			() => setIndex((i) => (i + 1) % phrases.length),
			isLast ? FINAL_HOLD_MS : HOLD_MS,
		);
		return () => window.clearTimeout(id);
	}, [enabled, index, phrases.length]);

	const phrase = enabled ? phrases[index] : still;

	return (
		<span
			aria-hidden
			className="relative block overflow-hidden whitespace-nowrap pb-[0.08em]"
		>
			<AnimatePresence initial={false} mode="popLayout">
				<m.span
					animate={{ y: "0%", opacity: 1 }}
					className="inline-block text-pop"
					exit={{ y: "-100%", opacity: 0 }}
					initial={{ y: "100%", opacity: 0 }}
					key={phrase}
					transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
				>
					{phrase}
				</m.span>
			</AnimatePresence>
		</span>
	);
}
