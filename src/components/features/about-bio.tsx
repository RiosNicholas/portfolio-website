import Link from "next/link";

import { type CvEntry, education, experience } from "~/lib/about-data";

function CvRow({ years, title, titleAccent, where }: CvEntry) {
	return (
		<div className="grid grid-cols-[60px_1fr] gap-4 border-(--border) border-b py-3.5">
			<div className="font-mono text-(--ink-3) text-xs">{years}</div>
			<div>
				<div className="font-display font-semibold text-[20px] text-foreground">
					{titleAccent ? (
						<>
							{title.replace(titleAccent, "").trimEnd()}{" "}
							<em className="text-(--accent-text) not-italic">{titleAccent}</em>
						</>
					) : (
						title
					)}
				</div>
				<div className="font-mono text-(--ink-3) text-xs">{where}</div>
			</div>
		</div>
	);
}

export function AboutBio() {
	return (
		<>
			<p className="reveal max-w-[22ch] font-display font-semibold text-[clamp(32px,4vw,54px)] text-foreground leading-[1.06]">
				I&apos;m Nick — a full-stack engineer focused on{" "}
				<em className="mark">UI and platform</em>. Based in Jersey City.
			</p>

			<div className="grid grid-cols-1 gap-[clamp(32px,5vw,76px)] md:grid-cols-[1.4fr_1fr]">
				{/* Gist */}
				<div className="reveal">
					<h3 className="font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
						The gist
					</h3>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
						About 4 years of shipping software. Currently at JPMorgan in Risk
						Tech, building agentic tooling — observability, RAG, and shared UI
						platform components used across the org.
					</p>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
						Before that: a fintech frontend internship at Fiserv, and a stint
						leading web development for a Rutgers research program while
						finishing my degree.
					</p>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
						I care about legibility, ergonomics, documentation, and animation
						that earns its keep — not a fan of gradient soup or software that
						shouts. Also a co-founder of ColorStack&apos;s Rutgers chapter.
					</p>
				</div>

				{/* CV */}
				<div className="reveal">
					<h3 className="font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
						Experience
					</h3>
					<div className="mt-4">
						{experience.map((entry) => (
							<CvRow key={`${entry.title}-${entry.where}`} {...entry} />
						))}
					</div>

					<h3 className="mt-8 font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
						Education + etc
					</h3>
					<div className="mt-4">
						{education.map((entry) => (
							<CvRow key={`${entry.title}-${entry.where}`} {...entry} />
						))}
					</div>

					<div className="mt-6">
						{/* TODO(pre-launch): stub — do not wire to /resume.pdf yet per intake */}
						<Link
							className="inline-flex cursor-none items-center gap-2 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-4 py-2.5 font-display font-semibold text-(--cta-ink) text-xs tracking-[-0.015em] no-underline shadow-(--shadow-pop) transition-[transform,background] duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
							href="#"
						>
							<span>Download full CV</span>
							<span>↗</span>
						</Link>
					</div>
				</div>
			</div>
		</>
	);
}
