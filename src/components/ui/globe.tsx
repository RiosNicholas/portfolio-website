"use client";

import createGlobe, { type Marker } from "cobe";
import { useEffect, useRef, useState } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";

type GlobeProps = {
	markers: Marker[];
	className?: string;
};

/**
 * Facing angle that centers a marker on the front hemisphere: the marker's
 * horizontal screen position is `cos(phi)·x + sin(phi)·z`, independent of
 * `theta`, and is zero (front-facing) when `phi = 3π/2 - (lng · π / 180)`.
 * Derived for the Jersey City marker's longitude (-74.0347); it's both the
 * resting angle and the rotation's starting point.
 */
const INITIAL_PHI = (3 * Math.PI) / 2 - (-74.0347 * Math.PI) / 180;
/**
 * Camera tilt. cobe's orthographic projection always shows exactly one
 * hemisphere; `theta` rotates *which* one faces the camera, tilting more of
 * the northern latitudes into view as it increases toward `π/2` (it does not
 * "unlock" a north-pole cutoff at some threshold — there is no such
 * threshold). At this tilt the marker sits `sin(lat-theta)·(0.8+elevation)/0.8`
 * ≈ 24% of the sphere radius above center, tuned by eye against the Based
 * cell's framing. `theta` does not affect horizontal centering — that's
 * `phi` — so `INITIAL_PHI` is independent of this value.
 */
const THETA = 0.5;
/** ~42s per revolution — a small decorative globe should read as unhurried. */
const RAD_PER_SEC = 0.15;
/**
 * cobe's land dots are a fixed size in sphere space, so a larger on-screen
 * sphere (see the framing note below) needs more samples to keep coastlines
 * from reading as chunky blobs; `mapSamples` doesn't change shader cost, so
 * this is free to raise.
 */
const MAP_SAMPLES = 16_000;
/**
 * Marker elevation. Kept low deliberately: the marker orbits at radius
 * `0.8 + elevation` while the sphere is `0.8`, and cobe only culls a
 * back-facing marker when its own projection also falls inside the sphere's
 * silhouette (`if (l.z < 0 && length(l.xy) < 0.8) discard`). At `THETA`'s
 * tilt, a higher elevation pushes the marker's projection outside that
 * silhouette for part of the rotation, so it never gets culled and floats
 * past the limb while Jersey City is on the far side of the globe. Must
 * change together with `THETA` — see the globe deep-dive.
 */
const MARKER_ELEVATION = 0.03;
/** How long the reduced-motion resting state redraws identical frames for,
 * so the async-loading map texture has time to appear (see cobe deep-dive). */
const RESTING_BURST_MS = 1200;

type Palette = {
	dark: number;
	baseColor: [number, number, number];
	glowColor: [number, number, number];
	markerColor: [number, number, number];
};

const LIGHT_PALETTE: Palette = {
	dark: 0,
	baseColor: [0.6, 0.6, 0.62],
	glowColor: [1, 1, 1],
	markerColor: [0.145, 0.388, 0.922], // --accent (blue-600)
};

const DARK_PALETTE: Palette = {
	dark: 1,
	baseColor: [0.15, 0.15, 0.17],
	glowColor: [0.08, 0.08, 0.1],
	markerColor: [0.576, 0.772, 0.992], // dark-theme --accent-text (blue-300)
};

function getPalette(): Palette {
	return document.documentElement.dataset.theme === "dark"
		? DARK_PALETTE
		: LIGHT_PALETTE;
}

/**
 * Decorative, non-interactive rotating globe (cobe/WebGL) with a marker.
 * Auto-rotates only — no drag-to-spin — so it never becomes a pointer-only
 * control (that would be a fresh WCAG 2.1.1 failure). Gated on
 * `useAnimationsEnabled()`.
 *
 * The rendered element tree is identical in both motion states — only what
 * the mount effect *does* branches — because the animations context is
 * seeded `true` for hydration, and cobe re-parents the canvas into an
 * injected wrapper div that `destroy()` doesn't unwrap (recreating the globe
 * on a preference flip would nest another wrapper every time). See
 * `.claude/instructions/animation-accessibility.md`.
 *
 * Two effects on purpose: one (`[]` deps) owns canvas create/destroy and the
 * resize/theme/visibility observers; the other (`[enabled]` deps) owns only
 * the per-frame loop. Merging them would re-create the globe — and re-nest
 * cobe's wrapper — on every runtime motion-preference flip.
 *
 * On-screen zoom is owned by the consumer's `size-*`/inset classes, not by
 * this component: sphere radius = `0.4 × canvas px`, sphere center in cell
 * coordinates = `(cellWidth + right − size/2, cellHeight + bottom − size/2)`.
 * Grow `size` and both insets together (insets by half the size delta) to
 * zoom in without shifting the composition. Do not reach for cobe's `scale`
 * or `offset` options for this — `scale` cuts the sphere at a hard
 * canvas-edge line above ~1.25 (the glow above ~1.09), which shows up as a
 * straight line across the globe since the canvas sits inside the card
 * rather than flush with it; growing the canvas and letting the card's
 * rounded `overflow-hidden` crop it gives a clean edge instead.
 */
export function Globe({ markers, className }: GlobeProps) {
	const enabled = useAnimationsEnabled();
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
	const phiRef = useRef(INITIAL_PHI);
	const visibleRef = useRef(true);
	// Captured once — this is a decorative primitive with a fixed marker set
	// in practice, and reading only the initial value keeps this effect's
	// deps genuinely `[]` (a changing `markers` identity must not re-create
	// the globe; see cobe deep-dive #4).
	const markersRef = useRef(markers);
	const [ready, setReady] = useState(false);

	// Effect A — canvas lifecycle only. Never re-run on a motion-preference
	// flip; see the two-effect note above.
	useEffect(() => {
		const canvas = canvasRef.current;
		const container = containerRef.current;
		if (!canvas || !container) return;

		const width = canvas.offsetWidth || container.offsetWidth;
		if (!width) return;

		const globe = createGlobe(canvas, {
			width,
			height: width,
			phi: INITIAL_PHI,
			theta: THETA,
			mapSamples: MAP_SAMPLES,
			mapBrightness: 6,
			diffuse: 1.2,
			devicePixelRatio: Math.min(window.devicePixelRatio, 2),
			markers: markersRef.current,
			markerElevation: MARKER_ELEVATION,
			...getPalette(),
		});
		globeRef.current = globe;

		const resizeObserver = new ResizeObserver(([entry]) => {
			const w = entry?.contentRect.width;
			if (w) globe.update({ width: w, height: w });
		});
		resizeObserver.observe(container);

		const themeObserver = new MutationObserver(() => {
			globe.update(getPalette());
		});
		themeObserver.observe(document.documentElement, {
			attributeFilter: ["data-theme"],
		});

		const intersectionObserver = new IntersectionObserver(([entry]) => {
			visibleRef.current = entry?.isIntersecting ?? true;
		});
		intersectionObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
			themeObserver.disconnect();
			intersectionObserver.disconnect();
			globe.destroy();
			globeRef.current = null;
		};
	}, []);

	// Effect B — frame loop only, never canvas creation.
	useEffect(() => {
		const globe = globeRef.current;
		if (!globe) return;

		let rafId: number;

		if (enabled) {
			// Resume from wherever `phiRef` currently sits (either its initial
			// value, or wherever the resting state last froze it) rather than
			// resetting to `INITIAL_PHI` — a runtime flip back to enabled must
			// resume smoothly, not snap the globe back to its start angle.
			const startPhi = phiRef.current;
			const start = performance.now();
			let frameCount = 0;
			const tick = (now: number) => {
				rafId = requestAnimationFrame(tick);
				frameCount += 1;
				if (frameCount === 2) setReady(true);
				// Keep the rAF loop itself ticking even while backgrounded or
				// scrolled out of view — just skip the (expensive) redraw —
				// so it resumes instantly rather than needing to be re-armed.
				if (!visibleRef.current || document.hidden) return;
				const elapsed = now - start;
				const phi = startPhi + (elapsed / 1000) * RAD_PER_SEC;
				phiRef.current = phi;
				globe.update({ phi });
			};
			rafId = requestAnimationFrame(tick);
		} else {
			// Resting state: redraw the *same* frame for a short burst so the
			// async-loading map texture has time to appear, then stop — never
			// animate toward INITIAL_PHI, freeze at the current phi instead.
			const restStart = performance.now();
			let frameCount = 0;
			const tick = (now: number) => {
				frameCount += 1;
				if (frameCount === 2) setReady(true);
				globe.update({ phi: phiRef.current });
				if (now - restStart < RESTING_BURST_MS) {
					rafId = requestAnimationFrame(tick);
				}
			};
			rafId = requestAnimationFrame(tick);
		}

		return () => cancelAnimationFrame(rafId);
	}, [enabled]);

	return (
		<div
			aria-hidden
			className={cn("pointer-events-none", className)}
			ref={containerRef}
		>
			<canvas
				className={cn(
					"size-full",
					ready ? "opacity-100" : "opacity-0",
					enabled && "transition-opacity duration-500",
				)}
				ref={canvasRef}
			/>
		</div>
	);
}
