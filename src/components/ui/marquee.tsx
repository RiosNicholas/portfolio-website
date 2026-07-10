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
}

export function Marquee({
	className,
	reverse = false,
	pauseOnHover = false,
	children,
	vertical = false,
	repeat = 4,
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

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: mouse enter/leave only pauses a decorative animation, no keyboard/interactive semantics needed
		<div
			{...props}
			className={cn(
				"overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
				className,
			)}
			onMouseEnter={() => {
				if (pauseOnHover) controlsRef.current?.pause();
			}}
			onMouseLeave={() => {
				if (pauseOnHover) controlsRef.current?.play();
			}}
		>
			<div
				className={cn("flex", vertical ? "flex-col" : "flex-row")}
				ref={scope}
			>
				{Array(repeat)
					.fill(0)
					.map((_, i) => (
						<div
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
