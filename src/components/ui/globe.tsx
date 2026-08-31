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
/**
 * Marker pulse. The globe itself is static (fixed at `INITIAL_PHI` — no
 * rotation), so the only motion left is the marker breathing in size,
 * `MARKER_PULSE_PERIOD_MS` per cycle, oscillating between `1×` and
 * `1 + MARKER_PULSE_AMPLITUDE` of its base size via a sine wave.
 */
const MARKER_PULSE_PERIOD_MS = 2200;
const MARKER_PULSE_AMPLITUDE = 0.6;
/**
 * cobe's land dots are a fixed size in sphere space, so a larger on-screen
 * sphere (see the framing note below) needs more samples to keep coastlines
 * from reading as chunky blobs; `mapSamples` doesn't change shader cost, so
 * this is free to raise.
 */
const MAP_SAMPLES = 16_000;
/**
 * Marker elevation — how far the marker sits above the sphere surface
 * (radius `0.8 + elevation` vs the sphere's `0.8`). The globe is static
 * and Jersey City is always front-facing (`INITIAL_PHI`), so nothing
 * ever occludes the marker; this value is purely a visual choice.
 */
const MARKER_ELEVATION = 0.03;
/** How long the reduced-motion resting state redraws identical frames for,
 * so the async-loading map texture has time to appear. */
const RESTING_BURST_MS = 1200;

type Palette = {
	dark: number;
	baseColor: [number, number, number];
	glowColor: [number, number, number];
	markerColor: [number, number, number];
};

// Shared 1×1 canvas used to turn a design-token color (oklch()/color-mix(),
// whatever it resolves to) into a cobe-compatible [r, g, b] float triplet —
// letting the browser's own color parser do the conversion instead of
// hand-rolling OKLch math.
let sampleCtx: CanvasRenderingContext2D | null | undefined;

function getSampleCtx(): CanvasRenderingContext2D | null {
	if (sampleCtx !== undefined) return sampleCtx;
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	sampleCtx = canvas.getContext("2d", { willReadFrequently: true });
	return sampleCtx;
}

/**
 * Resolves a design-system CSS custom property to the [r, g, b] (0–1) it
 * would actually paint as. `bgVar` is composited first so a semi-transparent
 * token (e.g. `--accent-glow`, a color-mix with `transparent`) blends against
 * the real card background it's drawn over on the page, rather than against
 * canvas black.
 */
function resolveToken(
	fgVar: string,
	bgVar = "--paper-2",
): [number, number, number] {
	const ctx = getSampleCtx();
	if (!ctx) return [0.5, 0.5, 0.5];
	const styles = getComputedStyle(document.documentElement);
	ctx.fillStyle = styles.getPropertyValue(bgVar).trim();
	ctx.fillRect(0, 0, 1, 1);
	ctx.fillStyle = styles.getPropertyValue(fgVar).trim();
	ctx.fillRect(0, 0, 1, 1);
	const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
	return [(r ?? 128) / 255, (g ?? 128) / 255, (b ?? 128) / 255];
}

/**
 * Base/glow/marker all read live design tokens instead of hardcoded RGB
 * guesses, so the globe tracks both light/dark and whichever `data-accent`
 * preset (pink/cobalt/lime/grape) is active. `--accent-glow` is the design
 * system's actual glow token, tinted and semi-transparent, in place of a
 * glow that used to equal the background exactly in light mode and sit
 * darker than it in dark mode — both of which made the glow invisible.
 *
 * `baseColor` deliberately reads a different token per theme rather than
 * one name resolved automatically by the cascade: `--ink-*` tokens are
 * calibrated for text legibility, which in light mode means dark enough to
 * read on `--paper` — but cobe's directional diffuse shading darkens the
 * sphere's far side further still, so a legibility-dark base crushes to a
 * muddy near-black hemisphere. `--border-2` is a mid-strength decorative
 * tone (not text) that survives that shading in light mode; in dark mode
 * `--ink-3` already reads correctly as a lit sphere, so it stays.
 */
function getPalette(): Palette {
	const dark = document.documentElement.dataset.theme === "dark";
	return {
		dark: dark ? 1 : 0,
		baseColor: resolveToken(dark ? "--ink-3" : "--border-2"),
		glowColor: resolveToken("--accent-glow"),
		markerColor: resolveToken("--accent-text"),
	};
}

/**
 * Decorative, non-interactive globe (cobe/WebGL) with a marker. Static —
 * fixed at `INITIAL_PHI`, never rotates — so the only motion is the marker
 * pulsing in place. Non-interactive (no drag-to-spin) so it never becomes a
 * pointer-only control (that would be a fresh WCAG 2.1.1 failure). The pulse
 * itself is gated on `useAnimationsEnabled()`.
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
	const visibleRef = useRef(true);
	// Captured once — this is a decorative primitive with a fixed marker set
	// in practice, and reading only the initial value keeps this effect's
	// deps genuinely `[]` (a changing `markers` identity must not re-create
	// the globe).
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
			attributeFilter: ["data-theme", "data-accent"],
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

	// Effect B — frame loop only, never canvas creation. The globe itself
	// never moves (`phi` is always `INITIAL_PHI`); this effect only decides
	// whether the marker pulses.
	useEffect(() => {
		const globe = globeRef.current;
		if (!globe) return;

		const baseMarkers = markersRef.current;
		let rafId: number;

		if (enabled) {
			// Continuous pulse: marker size oscillates sinusoidally between 1×
			// and `1 + MARKER_PULSE_AMPLITUDE`× its base size. `phi` is passed
			// on every frame too, since the resting-burst branch below may have
			// left the globe mid-fade-in and this is the frame loop that keeps
			// driving `ready`.
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
				const wave = Math.sin((elapsed / MARKER_PULSE_PERIOD_MS) * 2 * Math.PI);
				const scale = 1 + MARKER_PULSE_AMPLITUDE * (0.5 + 0.5 * wave);
				globe.update({
					phi: INITIAL_PHI,
					markers: baseMarkers.map((m) => ({
						...m,
						size: (m.size ?? 0.05) * scale,
					})),
				});
			};
			rafId = requestAnimationFrame(tick);
		} else {
			// Resting state: redraw the *same* frame (marker at its base size,
			// no pulse) for a short burst so the async-loading map texture has
			// time to appear, then stop.
			const restStart = performance.now();
			let frameCount = 0;
			const tick = (now: number) => {
				frameCount += 1;
				if (frameCount === 2) setReady(true);
				globe.update({ phi: INITIAL_PHI, markers: baseMarkers });
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
