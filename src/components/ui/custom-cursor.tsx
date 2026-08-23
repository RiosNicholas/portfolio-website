"use client";

import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";

type CursorVariant = "default" | "link" | "text" | "photo";

const RING_TARGET: Record<
	CursorVariant,
	{
		width: number;
		height: number;
		borderRadius: string;
		borderColor: string;
		backgroundColor: string;
	}
> = {
	default: {
		width: 28,
		height: 28,
		borderRadius: "9999px",
		borderColor: "var(--ink-3)",
		backgroundColor: "rgba(0, 0, 0, 0)",
	},
	link: {
		width: 46,
		height: 46,
		borderRadius: "9999px",
		borderColor: "var(--accent)",
		backgroundColor: "var(--accent-glow)",
	},
	text: {
		width: 2,
		height: 22,
		borderRadius: "1px",
		borderColor: "var(--accent)",
		backgroundColor: "var(--accent)",
	},
	photo: {
		width: 28,
		height: 28,
		borderRadius: "9999px",
		borderColor: "var(--ink-3)",
		backgroundColor: "rgba(0, 0, 0, 0)",
	},
};

const RING_TRANSITION = {
	width: { duration: 0.26, ease: [0.2, 0.7, 0.2, 1] },
	height: { duration: 0.26, ease: [0.2, 0.7, 0.2, 1] },
	borderColor: { duration: 0.22 },
	backgroundColor: { duration: 0.22 },
	opacity: { duration: 0.2 },
} as const;

// Reduced-motion / low-motion variants: same shape, zero duration so state
// changes are discrete swaps instead of tweens.
const RING_TRANSITION_REDUCED = { duration: 0 } as const;
const DOT_TRANSITION = { opacity: { duration: 0.2 } } as const;
const DOT_TRANSITION_REDUCED = { opacity: { duration: 0 } } as const;

// Single combined selector so hit-testing is one tree walk instead of three
// — classify the returned element afterwards by inspecting it.
const HIT_TARGET_SELECTOR =
	"a, button, [role=button], [data-cursor=photo], p, h1, h2, h3, h4, h5, h6";

function classifyHitTarget(hit: Element | null): CursorVariant {
	if (!hit) return "default";
	if ((hit as HTMLElement).dataset.cursor === "photo") return "photo";

	const tag = hit.tagName;
	const isLink =
		tag === "A" || tag === "BUTTON" || hit.getAttribute("role") === "button";

	return isLink ? "link" : "text";
}

export function CustomCursor() {
	const [supportsHover, setSupportsHover] = useState(true);
	const [variant, setVariant] = useState<CursorVariant>("default");
	const [visible, setVisible] = useState(true);
	const variantRef = useRef<CursorVariant>("default");
	const enabled = useAnimationsEnabled();

	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);
	const ringSpringX = useSpring(mouseX, {
		stiffness: 320,
		damping: 30,
		mass: 0.6,
	});
	const ringSpringY = useSpring(mouseY, {
		stiffness: 320,
		damping: 30,
		mass: 0.6,
	});

	useEffect(() => {
		setSupportsHover(!matchMedia("(hover: none)").matches);
	}, []);

	useEffect(() => {
		// Skip attaching listeners entirely on devices without a real pointer —
		// there's nothing to track. `enabled` (motion preference) does NOT gate
		// this: the cursor still exists under reduced motion, it just degrades
		// how it moves (see the render below), so listeners must stay attached
		// and must not tear down/re-attach when the preference flips.
		if (!supportsHover) return;

		const pendingTargetRef: { current: Element | null } = { current: null };
		let rafId: number | null = null;

		const runHitTest = () => {
			rafId = null;
			const target = pendingTargetRef.current;
			const nextVariant = classifyHitTarget(
				target?.closest(HIT_TARGET_SELECTOR) ?? null,
			);

			if (variantRef.current !== nextVariant) {
				variantRef.current = nextVariant;
				setVariant(nextVariant);
			}
		};

		const onMove = (e: MouseEvent) => {
			// Motion values are cheap and must stay responsive — set them
			// directly on every event.
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);

			// Hit-testing (DOM traversal) is coalesced to at most once per
			// frame: stash the latest target, queue a single rAF.
			pendingTargetRef.current = e.target as Element;
			if (rafId === null) {
				rafId = requestAnimationFrame(runHitTest);
			}
		};

		const onLeave = () => setVisible(false);
		const onEnter = () => setVisible(true);

		document.addEventListener("mousemove", onMove);
		document.addEventListener("mouseleave", onLeave);
		document.addEventListener("mouseenter", onEnter);

		return () => {
			document.removeEventListener("mousemove", onMove);
			document.removeEventListener("mouseleave", onLeave);
			document.removeEventListener("mouseenter", onEnter);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	}, [supportsHover, mouseX, mouseY]);

	// Only devices without a real pointer (touch/coarse) skip the custom
	// cursor entirely (see globals.css `cursor: auto` fallback for that case).
	// Reduced/low motion still renders the cursor — `enabled` only controls
	// spring-vs-raw ring position and animated-vs-instant transitions below.
	if (!supportsHover) return null;

	const ringTarget = RING_TARGET[variant];

	return (
		<>
			{/* Dot — tracks the raw pointer position, no LERP/spring */}
			<m.div
				className="pointer-events-none fixed top-0 left-0 z-9999"
				style={{ x: mouseX, y: mouseY }}
			>
				<m.div
					animate={{ opacity: visible ? 1 : 0 }}
					className="size-1.75 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--accent)"
					transition={enabled ? DOT_TRANSITION : DOT_TRANSITION_REDUCED}
				/>
			</m.div>

			{/* Ring — soft-follows via spring when motion is enabled; tracks the
			    raw pointer position with no lag under reduced/low motion. */}
			<m.div
				className="pointer-events-none fixed top-0 left-0 z-9999"
				style={{
					x: enabled ? ringSpringX : mouseX,
					y: enabled ? ringSpringY : mouseY,
				}}
			>
				<m.div
					animate={{ ...ringTarget, opacity: visible ? 1 : 0 }}
					className="-translate-x-1/2 -translate-y-1/2 border-2 border-solid"
					transition={enabled ? RING_TRANSITION : RING_TRANSITION_REDUCED}
				/>
			</m.div>
		</>
	);
}
