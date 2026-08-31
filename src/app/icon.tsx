import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Matches the nav logo mark (site-nav.tsx: `h-5 w-5 rounded bg-(--accent)`,
 * default accent = --color-blue-600). Hardcoded to the light-theme cobalt
 * hex like opengraph-image.tsx, since CSS custom properties aren't
 * available in this isolated render and the favicon has no theme context.
 */
export default function Icon() {
	return new ImageResponse(
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					width: 26,
					height: 26,
					borderRadius: 8,
					background: "#155dfc",
				}}
			/>
		</div>,
		{ ...size },
	);
}
