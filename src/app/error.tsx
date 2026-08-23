"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RouteError({
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
		<main
			className="shell flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center"
			id="main-content"
		>
			<span className="font-medium font-mono text-(--ink-4) text-xs uppercase tracking-wider">
				Something broke
			</span>
			<h1 className="font-display font-semibold text-4xl text-foreground leading-none tracking-tighter md:text-6xl">
				<em className="mark">Unexpected</em> error
			</h1>
			<p className="max-w-md font-sans text-(--ink-2) text-base leading-relaxed">
				This page hit a runtime error. You can try again, or head back home.
			</p>
			<div className="flex flex-wrap items-center justify-center gap-3">
				<button
					className="inline-flex cursor-none items-center gap-2 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5 py-3 font-display font-semibold text-(--cta-ink) text-sm tracking-tight shadow-(--shadow-pop) transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
					onClick={() => reset()}
					type="button"
				>
					Try again
				</button>
				<Link
					className="inline-flex cursor-none items-center gap-2 whitespace-nowrap rounded-(--r-md) border border-(--border-2) px-5 py-3 font-display font-semibold text-foreground text-sm tracking-tight no-underline transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--frosted)"
					href="/"
				>
					Go home
				</Link>
			</div>
		</main>
	);
}
