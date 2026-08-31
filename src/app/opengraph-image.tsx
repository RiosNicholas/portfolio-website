import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Deliberately uses the system sans stack, not next/font — ImageResponse
 * needs fonts loaded as raw buffers, and fighting that isn't worth the
 * complexity for a social-card generator. Colors are the light-theme
 * `--paper`/`--ink`/`--accent` values hardcoded, since CSS custom properties
 * from globals.css aren't available in this isolated render.
 */
export default function OpengraphImage() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				gap: 24,
				padding: 96,
				background: "#fffbeb",
				color: "#1c1917",
				fontFamily:
					'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 12,
					fontSize: 28,
					color: "#57534e",
				}}
			>
				<div
					style={{
						width: 20,
						height: 20,
						borderRadius: 6,
						background: "#155dfc",
					}}
				/>
				Nicholas Rios
			</div>
			<div style={{ display: "flex", fontSize: 76, fontWeight: 700 }}>
				Software Engineer
			</div>
			<div style={{ display: "flex", fontSize: 32, color: "#57534e" }}>
				Platform engineering · Design systems · Agentic AI
			</div>
		</div>,
		{ ...size },
	);
}
