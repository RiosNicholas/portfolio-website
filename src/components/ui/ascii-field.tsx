"use client";

import { useEffect, useRef } from "react";

import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";

// Light to dense. Index 0 is "nothing" and is never drawn.
const GLYPHS = " .·:-=+*#%@";
const ALPHA_LEVELS = 8;
const FRAME_MS = 1000 / 30;
const LENS_RADIUS = 190;

/**
 * Live ASCII texture for the hero field.
 *
 * Performance: every glyph is pre-rendered once per color and alpha level
 * into an offscreen atlas, so a frame is a run of `drawImage` copies rather
 * than thousands of `fillText` calls. The wave field is split into
 * per-column and per-row terms (sin(a+b) = sin a·cos b + cos a·sin b), so
 * most trigonometry runs once per row/column, not once per cell; the
 * radial distance table is built once per resize. The loop runs at 30fps,
 * and stops entirely when the canvas is off-screen or the tab is hidden.
 *
 * Color: two semantic tokens only - `--hero-glyph` (a tint of the brand
 * blue) for the field and `--pop` for the pointer lens.
 *
 * Reduced motion: one still frame, no loop, no pointer tracking.
 */
export function AsciiField({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const enabled = useAnimationsEnabled();

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!canvas || !ctx) return;

		let dpr = 1;
		let width = 0;
		let height = 0;
		let cell = 15;
		let rowHeight = 20;
		let cols = 0;
		let rows = 0;
		let radial = new Float32Array(0);
		let colSin = new Float32Array(0);
		let colCos = new Float32Array(0);
		let rowSin = new Float32Array(0);
		let rowCos = new Float32Array(0);
		let fade = new Float32Array(0);
		let waveX = new Float32Array(0);
		const atlas = document.createElement("canvas");
		const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };

		// Atlas layout: row = color (0 field, 1 lens) × alpha level, column = glyph.
		const buildAtlas = () => {
			const styles = getComputedStyle(canvas);
			const colors = [
				styles.getPropertyValue("--hero-glyph").trim() || "#93c5fd",
				styles.getPropertyValue("--pop").trim() || "#fcd34d",
			];
			const tileW = Math.ceil(cell * dpr);
			const tileH = Math.ceil(rowHeight * dpr);
			atlas.width = tileW * GLYPHS.length;
			atlas.height = tileH * ALPHA_LEVELS * colors.length;
			const actx = atlas.getContext("2d");
			if (!actx) return;
			actx.clearRect(0, 0, atlas.width, atlas.height);
			actx.font = `500 ${Math.round(cell * dpr)}px ui-monospace, "SF Mono", Menlo, monospace`;
			actx.textBaseline = "top";
			colors.forEach((color, c) => {
				actx.fillStyle = color;
				for (let a = 0; a < ALPHA_LEVELS; a++) {
					actx.globalAlpha = (a + 1) / ALPHA_LEVELS;
					for (let g = 1; g < GLYPHS.length; g++) {
						actx.fillText(
							GLYPHS[g] ?? "",
							g * tileW,
							(c * ALPHA_LEVELS + a) * tileH,
						);
					}
				}
			});
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			cell = width < 640 ? 12 : 15;
			rowHeight = Math.round(cell * 1.3);
			cols = Math.ceil(width / cell);
			rows = Math.ceil(height / rowHeight);

			colSin = new Float32Array(cols);
			colCos = new Float32Array(cols);
			rowSin = new Float32Array(rows);
			rowCos = new Float32Array(rows);
			fade = new Float32Array(cols);
			waveX = new Float32Array(cols);
			radial = new Float32Array(cols * rows);
			for (let x = 0; x < cols; x++) {
				const nx = x / cols;
				// Quiet on the left where the text sits, fuller to the right.
				fade[x] = 0.12 + 0.88 * nx * nx;
				for (let y = 0; y < rows; y++) {
					const dx = nx - 0.72;
					const dy = y / rows - 0.42;
					radial[y * cols + x] = Math.sqrt(dx * dx + dy * dy) * 14;
				}
			}
			buildAtlas();
		};

		const draw = (t: number) => {
			pointer.x += (pointer.tx - pointer.x) * 0.12;
			pointer.y += (pointer.ty - pointer.y) * 0.12;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const tileW = Math.ceil(cell * dpr);
			const tileH = Math.ceil(rowHeight * dpr);
			const levels = GLYPHS.length - 1;

			for (let x = 0; x < cols; x++) {
				const a = (x / cols) * 4.2 + t * 0.0003;
				colSin[x] = Math.sin(a);
				colCos[x] = Math.cos(a);
			}
			for (let y = 0; y < rows; y++) {
				const b = (y / rows) * 4.2;
				rowSin[y] = Math.sin(b);
				rowCos[y] = Math.cos(b);
			}
			for (let x = 0; x < cols; x++) {
				waveX[x] = Math.sin((x / cols) * 7 + t * 0.00055);
			}

			for (let y = 0; y < rows; y++) {
				const py = y * rowHeight;
				const waveY = Math.sin((y / rows) * 5.5 - t * 0.0004);
				const ldy = py - pointer.y;
				const rowInLens = Math.abs(ldy) < LENS_RADIUS;
				for (let x = 0; x < cols; x++) {
					const px = x * cell;
					const diagonal =
						(colSin[x] ?? 0) * (rowCos[y] ?? 0) +
						(colCos[x] ?? 0) * (rowSin[y] ?? 0);
					let v =
						(waveX[x] ?? 0) +
						waveY +
						diagonal +
						Math.sin((radial[y * cols + x] ?? 0) - t * 0.0011);
					v = (v + 4) / 8;

					let lens = 0;
					if (rowInLens) {
						const ldx = px - pointer.x;
						if (Math.abs(ldx) < LENS_RADIUS) {
							lens = Math.max(
								0,
								1 - Math.sqrt(ldx * ldx + ldy * ldy) / LENS_RADIUS,
							);
						}
					}
					v = Math.min(1, v * v * 1.1 + lens * 0.7);

					const glyph = Math.floor(v * levels);
					if (glyph === 0) continue;
					const alpha = Math.min(
						1,
						(0.12 + v * 0.6) * (fade[x] ?? 1) + lens * 0.6,
					);
					const level = Math.round(alpha * ALPHA_LEVELS) - 1;
					if (level < 0) continue;
					const color = lens > 0.2 ? 1 : 0;

					ctx.drawImage(
						atlas,
						glyph * tileW,
						(color * ALPHA_LEVELS + level) * tileH,
						tileW,
						tileH,
						Math.round(px * dpr),
						Math.round(py * dpr),
						tileW,
						tileH,
					);
				}
			}
		};

		resize();

		// Theme switches change --hero-glyph; rebuild the atlas and repaint.
		const themeObserver = new MutationObserver(() => {
			buildAtlas();
			if (!enabled) draw(0);
		});
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		if (!enabled) {
			draw(0);
			const onResize = () => {
				resize();
				draw(0);
			};
			window.addEventListener("resize", onResize);
			return () => {
				themeObserver.disconnect();
				window.removeEventListener("resize", onResize);
			};
		}

		let frame = 0;
		let last = 0;
		let visible = true;

		const loop = (t: number) => {
			frame = requestAnimationFrame(loop);
			if (!visible || document.hidden || t - last < FRAME_MS) return;
			last = t;
			draw(t);
		};

		const onPointer = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			pointer.tx = event.clientX - rect.left;
			pointer.ty = event.clientY - rect.top;
			if (pointer.x < -1e3) {
				pointer.x = pointer.tx;
				pointer.y = pointer.ty;
			}
		};
		const onLeave = () => {
			pointer.tx = -1e4;
			pointer.ty = -1e4;
		};

		const visibility = new IntersectionObserver(([entry]) => {
			visible = entry?.isIntersecting ?? true;
		});
		visibility.observe(canvas);

		window.addEventListener("resize", resize);
		window.addEventListener("pointermove", onPointer, { passive: true });
		document.documentElement.addEventListener("pointerleave", onLeave);
		frame = requestAnimationFrame(loop);

		return () => {
			cancelAnimationFrame(frame);
			visibility.disconnect();
			themeObserver.disconnect();
			window.removeEventListener("resize", resize);
			window.removeEventListener("pointermove", onPointer);
			document.documentElement.removeEventListener("pointerleave", onLeave);
		};
	}, [enabled]);

	return (
		<canvas
			aria-hidden
			className={cn(
				"pointer-events-none absolute inset-0 z-0 h-full w-full",
				className,
			)}
			ref={canvasRef}
		/>
	);
}
