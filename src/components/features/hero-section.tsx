import Link from "next/link";
import { MorphingText } from "../ui/morphing-text";

export function HeroSection() {
	return (
		<section
			className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-10"
			id="home"
		>
			<p className="text-xs text-zinc-400 uppercase tracking-[0.18em]">Landing</p>
			<h1 className="mt-3 max-w-3xl font-semibold text-3xl tracking-tight md:text-6xl">
				Hey, I'm Nicholas.
			</h1>
			<p className="mt-4 max-w-2xl text-lg text-zinc-200">
				I'm a Software Engineer focused on{" "}
				<span className="text-white">UI platform systems</span> and{" "}
				<span className="text-white">frontend architecture</span>.
			</p>
			<p className="mt-2 max-w-2xl text-zinc-300">
				I build scalable interfaces, design-system guardrails, and developer
				workflows that help product teams ship faster with confidence.
			</p>
			<div className="mt-6 flex flex-wrap gap-3">
				<Link
					className="rounded-full border border-zinc-600 bg-zinc-100 px-5 py-2.5 font-medium text-sm text-zinc-900 hover:bg-white"
					href="/work"
				>
					Explore my role in practice
				</Link>
				<Link
					className="rounded-full border border-zinc-700 px-5 py-2.5 text-sm text-zinc-200 hover:bg-zinc-800"
					href="https://www.linkedin.com/in/nicholas-rios/"
					target="_blank"
				>
					View LinkedIn
				</Link>
			</div>
		</section>
	);
}
