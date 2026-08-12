"use client";

import { AnimatePresence, m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";

type CursorVariant = "default" | "link" | "text" | "photo";

type TrailParticle = {
	id: number;
	x: number;
	y: number;
};

const RING_TARGET: Record<
	CursorVariant,
	{
		width: number;
		height: number;
		borderRadius: string;
		borderColor: string;
		backgroundColor: string;
		mixBlendMode: "difference" | "normal";
	}
> = {
	default: {
		width: 28,
		height: 28,
		borderRadius: "9999px",
		borderColor: "var(--ink-3)",
		backgroundColor: "transparent",
		mixBlendMode: "difference",
	},
	link: {
		width: 46,
		height: 46,
		borderRadius: "9999px",
		borderColor: "var(--accent)",
		backgroundColor: "var(--accent-glow)",
		mixBlendMode: "normal",
	},
	text: {
		width: 2,
		height: 22,
		borderRadius: "1px",
		borderColor: "var(--accent)",
		backgroundColor: "var(--accent)",
		mixBlendMode: "normal",
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
		mixBlendMode: "difference",
	},
};

const RING_TRANSITION = {
	width: { duration: 0.26, ease: [0.2, 0.7, 0.2, 1] },
	height: { duration: 0.26, ease: [0.2, 0.7, 0.2, 1] },
	borderColor: { duration: 0.22 },
	backgroundColor: { duration: 0.22 },
	opacity: { duration: 0.2 },
} as const;

let nextTrailId = 0;

export function CustomCursor() {
	const [supportsHover, setSupportsHover] = useState(true);
	const [variant, setVariant] = useState<CursorVariant>("default");
	const [visible, setVisible] = useState(true);
	const [trails, setTrails] = useState<TrailParticle[]>([]);
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
		if (!supportsHover) return;

		let lastTrail = 0;

		const onMove = (e: MouseEvent) => {
			mouseX.set(e.clientX);
			mouseY.set(e.clientY);

			const target = e.target as Element;
			const isLink = target.closest("a, button, [role=button]");
			const isPhoto = target.closest("[data-cursor=photo]");
			const isText = target.closest("p, h1, h2, h3, h4, h5, h6");

			const nextVariant: CursorVariant = isPhoto
				? "photo"
				: isLink
					? "link"
					: isText
						? "text"
						: "default";

			if (variantRef.current !== nextVariant) {
				variantRef.current = nextVariant;
				setVariant(nextVariant);
			}

			if (!enabled) return;

			const now = performance.now();
			if (now - lastTrail > 60 && Math.random() < 0.35) {
				lastTrail = now;
				const id = nextTrailId++;
				setTrails((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
				setTimeout(() => {
					setTrails((prev) => prev.filter((t) => t.id !== id));
				}, 700);
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
		};
	}, [supportsHover, enabled, mouseX, mouseY]);

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
					transition={{ opacity: { duration: 0.2 } }}
				/>
			</m.div>

			{/* Ring — soft-follows via spring (or raw, when motion is disabled) */}
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
					transition={RING_TRANSITION}
				/>
			</m.div>

			{enabled && (
				<AnimatePresence>
					{trails.map((t) => (
						<m.div
							animate={{ opacity: 0, scale: 3 }}
							className="pointer-events-none fixed top-0 left-0 z-9999 size-1.25 rounded-full bg-(--accent)"
							initial={{ opacity: 0.4, scale: 1 }}
							key={t.id}
							style={{ translateX: "-50%", translateY: "-50%", x: t.x, y: t.y }}
							transition={{ duration: 0.5 }}
						/>
					))}
				</AnimatePresence>
			)}
		</>
	);
}
