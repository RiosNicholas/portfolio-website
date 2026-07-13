import Link from "next/link";

import { Reveal } from "~/components/ui/reveal";
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
			<Reveal
				as="p"
				className="max-w-[22ch] font-display font-semibold text-[clamp(32px,4vw,54px)] text-foreground leading-[1.06]"
			>
				I&apos;m Nick — a Platform Software Engineer focused on{" "}
				<em className="mark">UI</em> and <em className="mark">Agentic AI</em>.
				Based in Jersey City.
			</Reveal>

			<div className="grid grid-cols-1 gap-[clamp(32px,5vw,76px)] md:grid-cols-[1.4fr_1fr]">
				{/* Gist */}
				<Reveal>
					<h3 className="font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
						Summary
					</h3>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
						At about 3 years of building software, I specialize in UI platform engineering — design systems, developer tooling, and scalable frontend architecture. I enjoy building systems that improve developer experience and enable teams to move faster. 
					</p>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
				    I'm currently in risk technology at JPMorganChase, where I build platform infrastructure on two fronts: the shared UI foundation — component libraries, architecture, and tooling — that product teams build on, and the agentic AI platform that's making AI a core part of how we ship. 
					</p>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-[clamp(16px,1.3vw,18px)] leading-relaxed tracking-[-0.005em]">
					  Outside of engineering, I enjoy street photography and occasionally publish my work. 
					</p>
				</Reveal>

				{/* CV */}
				<Reveal>
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
				</Reveal>
			</div>
		</>
	);
}
