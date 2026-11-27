"use client";

// PROTOTYPE - throwaway. Cycles ?variant= and mirrors it onto html[data-density]
// for src/styles/density-prototype.css. Never merge to main.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const VARIANTS = [
	["a", "Current"],
	["b", "One step down"],
	["c", "Two steps down"],
] as const;

export function PrototypeSwitcher() {
	const router = useRouter();
	const pathname = usePathname();
	const params = useSearchParams();
	const current = Math.max(
		0,
		VARIANTS.findIndex(([key]) => key === params.get("variant")),
	);
	const go = (step: number) => {
		const next = VARIANTS[(current + step + VARIANTS.length) % VARIANTS.length];
		router.replace(`${pathname}?variant=${next?.[0]}`, { scroll: false });
	};

	useEffect(() => {
		document.documentElement.dataset.density = VARIANTS[current]?.[0];
	}, [current]);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (
				(e.target as HTMLElement).closest("input, textarea, [contenteditable]")
			)
				return;
			if (e.key === "ArrowLeft") go(-1);
			if (e.key === "ArrowRight") go(1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	if (process.env.NODE_ENV === "production") return null;
	const [key, name] = VARIANTS[current] ?? VARIANTS[0];

	return (
		<div className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full bg-black px-4 py-2 font-mono text-sm text-white shadow-lg">
			<button onClick={() => go(-1)} type="button">
				←
			</button>
			<span>
				{key.toUpperCase()} ({name})
			</span>
			<button onClick={() => go(1)} type="button">
				→
			</button>
		</div>
	);
}
