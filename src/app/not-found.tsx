import Link from "next/link";

export default function NotFound() {
	return (
		<main
			className="shell flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center"
			id="main-content"
		>
			<span className="font-medium font-mono text-(--ink-4) text-xs uppercase tracking-wider">
				404
			</span>
			<h1 className="font-display font-semibold text-4xl text-foreground leading-none tracking-tighter md:text-6xl">
				Page <em className="mark">not found</em>
			</h1>
			<p className="max-w-md font-sans text-(--ink-2) text-base leading-relaxed">
				The page you're looking for doesn't exist or has moved.
			</p>
			<Link
				className="inline-flex cursor-none items-center gap-2 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-5 py-3 font-display font-semibold text-(--cta-ink) text-sm tracking-tight no-underline shadow-(--shadow-pop) transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
				href="/"
			>
				<span>Back to home</span>
				<span>↗</span>
			</Link>
		</main>
	);
}
