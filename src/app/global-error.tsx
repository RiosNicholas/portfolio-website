"use client";

import { useEffect } from "react";

/**
 * Fires only when the root layout itself throws — Next.js requires this file
 * render its own `<html>`/`<body>` since it replaces the layout entirely.
 * Deliberately dependency-free (no Reveal, no CustomCursor, no next/font):
 * if the layout failed, don't assume anything above this component works.
 * Inline styles are the one place in this codebase that's the right call —
 * there's no guarantee the Tailwind-processed stylesheet or the design
 * tokens it depends on are safe to reach for here.
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error.digest ?? error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					minHeight: "100vh",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: "1.5rem",
					padding: "2rem",
					textAlign: "center",
					background: "#fffbeb",
					color: "#1c1917",
					fontFamily:
						'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
				}}
			>
				<h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 600 }}>
					Something went wrong
				</h1>
				<p style={{ margin: 0, maxWidth: 420 }}>
					The app hit an unexpected error. Try reloading the page.
				</p>
				<button
					onClick={() => reset()}
					style={{
						padding: "0.75rem 1.5rem",
						borderRadius: 8,
						background: "#fcd34d",
						color: "#0c0a09",
						border: "none",
						fontWeight: 600,
						fontSize: "0.875rem",
						cursor: "pointer",
					}}
					type="button"
				>
					Try again
				</button>
			</body>
		</html>
	);
}
