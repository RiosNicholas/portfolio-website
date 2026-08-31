"use client";

import type {
	ComponentPropsWithoutRef,
	PointerEvent as ReactPointerEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

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
	 * Number of times to repeat the content. Must satisfy
	 * `(repeat − 1) × copySize ≥ containerSize` for a seamless loop, or, if
	 * `draggable` is set, the tighter `(repeat − 2) × copySize ≥
	 * containerSize` — a drag offset can shift the track by up to one full
	 * copy in either direction before the modulo wrap kicks in.
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
	/**
	 * Opt in to mouse-drag / touch-swipe control. Dragging pauses the CSS
	 * animation (via `animation-play-state`, which resumes from wherever it
	 * stopped) and moves the track 1:1 with the pointer, wrapping infinitely
	 * via modulo. No-op when animations are disabled — the container is
	 * already natively scrollable on its own axis in that state.
	 * @default false
	 */
	draggable?: boolean;
}

export function Marquee({
	className,
	reverse = false,
	pauseOnHover = false,
	children,
	vertical = false,
	repeat = 4,
	ariaHideDuplicates = false,
	draggable = false,
	...props
}: MarqueeProps) {
	const enabled = useAnimationsEnabled();
	const canDrag = draggable && enabled;

	const [dragging, setDragging] = useState(false);
	const offsetRef = useRef(0);
	const lastPosRef = useRef(0);
	const movedDistanceRef = useRef(0);
	const trackRef = useRef<HTMLDivElement>(null);
	const firstGroupRef = useRef<HTMLDivElement>(null);

	// Reset on disable — a leftover inline transform after a runtime
	// motion-preference flip would open the (now-scrollable) container
	// pre-offset and clip content. See animation-accessibility.md.
	useEffect(() => {
		if (canDrag) return;
		offsetRef.current = 0;
		if (trackRef.current) {
			trackRef.current.style.transform = "";
		}
	}, [canDrag]);

	function getPeriod() {
		const group = firstGroupRef.current;
		const track = trackRef.current;
		if (!group || !track) return 0;
		const groupSize = vertical ? group.offsetHeight : group.offsetWidth;
		const gap =
			Number.parseFloat(
				getComputedStyle(track)[vertical ? "rowGap" : "columnGap"],
			) || 0;
		return groupSize + gap;
	}

	function applyTransform() {
		const track = trackRef.current;
		if (!track) return;
		track.style.transform = vertical
			? `translate3d(0, ${offsetRef.current}px, 0)`
			: `translate3d(${offsetRef.current}px, 0, 0)`;
	}

	function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
		if (e.pointerType === "mouse" && e.button !== 0) return;
		e.currentTarget.setPointerCapture(e.pointerId);
		lastPosRef.current = vertical ? e.clientY : e.clientX;
		movedDistanceRef.current = 0;
		setDragging(true);
	}

	function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
		if (!dragging) return;
		const pos = vertical ? e.clientY : e.clientX;
		const delta = pos - lastPosRef.current;
		lastPosRef.current = pos;
		movedDistanceRef.current += Math.abs(delta);

		let offset = offsetRef.current + delta;
		const period = getPeriod();
		if (period > 0) {
			// Normalize into (-period, 0] — one copy of the content is
			// visually identical to the next, so this makes the drag
			// infinite in both directions instead of eventually dragging
			// into empty space.
			offset = ((offset % period) + period) % period;
			offset -= period;
		}
		offsetRef.current = offset;
		applyTransform();
	}

	function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
		setDragging(false);
		if (e.currentTarget.hasPointerCapture(e.pointerId)) {
			e.currentTarget.releasePointerCapture(e.pointerId);
		}
	}

	function handleClickCapture(e: React.MouseEvent<HTMLDivElement>) {
		// Without this, every swipe over a link/card inside the marquee
		// (e.g. an endorsement card) also fires its click and navigates away.
		if (movedDistanceRef.current > 5) {
			e.preventDefault();
			e.stopPropagation();
		}
	}

	// Duplicated copies exist only to make the animated loop seamless — in
	// the scrollable (disabled) state, render exactly one copy so a screen
	// reader (and a scrolling user) doesn't encounter the same content twice.
	const repeatCount = enabled ? repeat : 1;

	return (
		<div
			{...props}
			className={cn(
				"group p-2 [--duration:40s] [--gap:1rem]",
				enabled
					? "overflow-hidden"
					: vertical
						? "overflow-y-auto overflow-x-hidden"
						: "overflow-x-auto overflow-y-hidden",
				canDrag && "cursor-grab select-none active:cursor-grabbing",
				canDrag && (vertical ? "touch-pan-x" : "touch-pan-y"),
				className,
			)}
			onClickCapture={canDrag ? handleClickCapture : undefined}
			onPointerCancel={canDrag ? handlePointerUp : undefined}
			onPointerDown={canDrag ? handlePointerDown : undefined}
			onPointerMove={canDrag ? handlePointerMove : undefined}
			onPointerUp={canDrag ? handlePointerUp : undefined}
			role={enabled ? undefined : "group"}
			tabIndex={enabled ? undefined : 0}
		>
			<div
				className={cn("flex gap-(--gap)", vertical ? "flex-col" : "flex-row")}
				ref={trackRef}
			>
				{Array(repeatCount)
					.fill(0)
					.map((_, i) => (
						<div
							aria-hidden={ariaHideDuplicates && i > 0 ? true : undefined}
							className={cn(
								"flex shrink-0 justify-around gap-(--gap)",
								vertical ? "flex-col" : "flex-row",
								enabled &&
									(vertical ? "animate-marquee-vertical" : "animate-marquee"),
								enabled && reverse && "[animation-direction:reverse]",
								enabled &&
									pauseOnHover &&
									"group-hover:[animation-play-state:paused]",
								dragging && "[animation-play-state:paused]",
							)}
							data-marquee-group={enabled ? "" : undefined}
							key={i}
							ref={i === 0 ? firstGroupRef : undefined}
						>
							{children}
						</div>
					))}
			</div>
		</div>
	);
}
