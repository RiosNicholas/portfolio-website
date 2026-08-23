"use client";

import {
	type AnimationPlaybackControlsWithThen,
	useAnimate,
} from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { useEffect, useRef } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
	/**
	 * Optional CSS class name to apply custom styles
	 */
	className?: string;
	/**
	 * Whether to reverse the animation direction
	 * @default false
	 */
	reverse?: boolean;
	/**
	 * Whether to pause the animation on hover
	 * @default false
	 */
	pauseOnHover?: boolean;
	/**
	 * Content to be displayed in the marquee
	 */
	children: React.ReactNode;
	/**
	 * Whether to animate vertically instead of horizontally
	 * @default false
	 */
	vertical?: boolean;
	/**
	 * Number of times to repeat the content
	 * @default 4
	 */
	repeat?: number;
	/**
	 * `aria-hidden` the duplicated copies so screen readers announce the
	 * content once. Only safe when `children` contain no focusable elements —
	 * a focusable node inside `aria-hidden` is itself an a11y violation.
	 * @default false
	 */
	ariaHideDuplicates?: boolean;
}

export function Marquee({
	className,
	reverse = false,
	pauseOnHover = false,
	children,
	vertical = false,
	repeat = 4,
	ariaHideDuplicates = false,
	...props
}: MarqueeProps) {
	const [scope, animate] = useAnimate<HTMLDivElement>();
	const controlsRef = useRef<AnimationPlaybackControlsWithThen | null>(null);
	const enabled = useAnimationsEnabled();

	useEffect(() => {
		const track = scope.current;

		if (!enabled || !track) {
			controlsRef.current?.stop();
			controlsRef.current = null;
			if (track) {
				animate(track, { x: "0%", y: "0%" }, { duration: 0 });
			}
			return;
		}

		const duration =
			Number.parseFloat(
				getComputedStyle(track).getPropertyValue("--duration"),
			) || 40;
		const delta = 100 / repeat;
		const axis = vertical ? "y" : "x";
		const range: [string, string] = reverse
			? [`-${delta}%`, "0%"]
			: ["0%", `-${delta}%`];

		controlsRef.current = animate(
			track,
			{ [axis]: range },
			{ duration, ease: "linear", repeat: Number.POSITIVE_INFINITY },
		);

		return () => {
			controlsRef.current?.stop();
			controlsRef.current = null;
		};
	}, [animate, enabled, repeat, reverse, scope, vertical]);

	// Duplicated copies exist only to make the animated loop seamless — in
	// the scrollable (disabled) state, render exactly one copy so a screen
	// reader (and a scrolling user) doesn't encounter the same content twice.
	const repeatCount = enabled ? repeat : 1;

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: mouse enter/leave only pauses a decorative animation, no keyboard/interactive semantics needed
		<div
			{...props}
			className={cn(
				"p-2 [--duration:40s] [--gap:1rem]",
				enabled
					? "overflow-hidden"
					: vertical
						? "overflow-y-auto overflow-x-hidden"
						: "overflow-x-auto overflow-y-hidden",
				className,
			)}
			onMouseEnter={
				pauseOnHover && enabled ? () => controlsRef.current?.pause() : undefined
			}
			onMouseLeave={
				pauseOnHover && enabled ? () => controlsRef.current?.play() : undefined
			}
			role={enabled ? undefined : "group"}
			tabIndex={enabled ? undefined : 0}
		>
			<div
				className={cn("flex", vertical ? "flex-col" : "flex-row")}
				ref={scope}
			>
				{Array(repeatCount)
					.fill(0)
					.map((_, i) => (
						<div
							aria-hidden={ariaHideDuplicates && i > 0 ? true : undefined}
							className={cn(
								"flex shrink-0 justify-around gap-(--gap)",
								vertical ? "flex-col pb-(--gap)" : "flex-row pr-(--gap)",
							)}
							key={i}
						>
							{children}
						</div>
					))}
			</div>
		</div>
	);
}
