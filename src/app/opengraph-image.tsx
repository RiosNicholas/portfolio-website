import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
	"Nicholas Rios - Software Engineer building agentic AI tooling @JPMorganChase.";

// Light-theme hero tokens as hex: CSS custom properties from globals.css
// aren't available in this isolated render, and Satori can't parse oklch.
const hero = "#1447e6";
const glyphColor = "142, 197, 255";
const pop = "#ffd230";
const subtle = "#bedbff";

// A still frame of the hero's ASCII field (ascii-field.tsx at t = 0),
// mirrored so its densest patch sits right of the text. The default font
// isn't monospace, so each glyph sits in its own fixed cell.
const GLYPHS = " .·:-=+*#%@";
const CELL = 20;
const ROW = 26;
const cols = size.width / CELL;
const rows = Math.ceil(size.height / ROW);
const field = Array.from({ length: rows * cols }, (_, i) => {
	const x = i % cols;
	const y = Math.floor(i / cols);
	const nx = x / cols;
	const mx = 1 - nx;
	const ny = y / rows;
	const radial = Math.hypot(mx - 0.72, ny - 0.42) * 14;
	const v =
		((Math.sin(mx * 7) +
			Math.sin(ny * 5.5) +
			Math.sin(mx * 4.2 + ny * 4.2) +
			Math.sin(radial) +
			4) /
			8) **
			2 *
		1.1;
	const glyph = GLYPHS[Math.floor(Math.min(1, v) * (GLYPHS.length - 1))];
	// Quiet on the left where the text sits, fuller to the right.
	const alpha = (0.12 + v * 0.6) * (0.12 + 0.88 * nx * nx);
	return { x, y, glyph, alpha };
}).filter((cell) => cell.glyph !== " " && cell.alpha > 0.06);

/**
 * Uses Satori's default sans, not next/font - ImageResponse needs fonts
 * loaded as raw buffers, and that isn't worth it for a social card.
 */
export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				position: "relative",
				background: hero,
				color: "#fff",
			}}
		>
			{field.map(({ x, y, glyph, alpha }) => (
				<div
					key={`${x}-${y}`}
					style={{
						position: "absolute",
						left: x * CELL,
						top: y * ROW,
						width: CELL,
						display: "flex",
						justifyContent: "center",
						fontSize: 18,
						color: `rgba(${glyphColor}, ${Math.min(1, alpha)})`,
					}}
				>
					{glyph}
				</div>
			))}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					width: "100%",
					padding: "72px 80px",
				}}
			>
				<div style={{ display: "flex", fontSize: 30, color: subtle }}>
					Nicholas Rios
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						fontSize: 64,
						lineHeight: 1.1,
					}}
				>
					<div style={{ fontSize: 96 }}>Software Engineer</div>
					<div>building</div>
					<div style={{ color: pop }}>agentic AI tooling</div>
					<div style={{ color: subtle }}>@JPMorganChase.</div>
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
