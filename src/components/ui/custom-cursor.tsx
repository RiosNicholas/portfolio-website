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
		backgroundColor: "transparent",
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
	// `[data-cursor=photo]` isn't styled differently today (see custom-cursor
	// implementation notes in the handoff doc) — kept as its own variant slot
	// so a future photo-hover treatment has somewhere to live without
	// reworking the hit-testing logic.
	photo: {
		width: 28,
		height: 28,
		borderRadius: "9999px",
		borderColor: "var(--ink-3)",
		backgroundColor: "transparent",
	},
};

const RING_TRANSITION = {
	width: { duration: 0.26, ease: [0.2, 0.7, 0.2, 1] },
	height: { duration: 0.26, ease: [0.2, 0.7, 0.2, 1] },
	borderColor: { duration: 0.22 },
	backgroundColor: { duration: 0.22 },
	opacity: { duration: 0.2 },
} as const;

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
		// Skip attaching listeners entirely when the cursor won't render —
		// no point tracking pointer position for a treatment that's disabled.
		if (!supportsHover || !enabled) return;

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
	}, [supportsHover, enabled, mouseX, mouseY]);

	// Reduced motion / low-motion mode: skip the custom cursor entirely and
	// let the native cursor take over (see globals.css `cursor: auto` rules).
	if (!supportsHover || !enabled) return null;

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
					transition={{ opacity: { duration: 0.2 } }}
				/>
			</m.div>

			{/* Ring — soft-follows via spring */}
			<m.div
				className="pointer-events-none fixed top-0 left-0 z-9999"
				style={{ x: ringSpringX, y: ringSpringY }}
			>
				<m.div
					animate={{ ...ringTarget, opacity: visible ? 1 : 0 }}
					className="-translate-x-1/2 -translate-y-1/2 border-2 border-solid"
					transition={RING_TRANSITION}
				/>
			</m.div>
		</>
	);
}
