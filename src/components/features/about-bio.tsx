import Link from "next/link";

import { Reveal } from "~/components/ui/reveal";
import {
	activities,
	type CvEntry,
	education,
	experience,
} from "~/lib/about-data";

function AccentedTitle({
	title,
	accents,
}: {
	title: string;
	accents: string[];
}) {
	const pattern = new RegExp(
		`(${accents.map((accent) => accent.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
	);
	return (
		<>
			{title.split(pattern).map((part, index) =>
				accents.includes(part) ? (
					<em
						className="text-(--accent-text) not-italic"
						// biome-ignore lint/suspicious/noArrayIndexKey: parts are derived from a static string, order never changes
						key={index}
					>
						{part}
					</em>
				) : (
					part
				),
			)}
		</>
	);
}

function CvRow({ years, title, titleAccent, where }: CvEntry) {
	return (
		<div className="flex flex-col gap-1 border-border border-b py-3.5 sm:flex-row sm:gap-4">
			<div className="shrink-0 font-mono text-(--ink-3) text-xs sm:w-36">
				{years}
			</div>
			<div className="grow">
				<div className="font-display font-semibold text-foreground text-xl">
					{titleAccent?.length ? (
						<AccentedTitle accents={titleAccent} title={title} />
					) : (
						title
					)}
				</div>
				<div className="font-mono text-(--ink-3) text-base">{where}</div>
			</div>
		</div>
	);
}

export function AboutBio() {
	return (
		<section className="relative flex flex-col gap-8">
			<Reveal
				as="p"
				className="max-w-2xl font-display font-semibold text-3xl text-foreground leading-none md:text-5xl"
			>
				I&apos;m Nicholas — a Platform Software Engineer focused on{" "}
				<em className="mark">UI</em> and <em className="mark">Agentic AI</em>.
				Based in Jersey City.
			</Reveal>

			<div className="grid grid-cols-1 gap-16 md:grid-cols-[1.4fr_1fr]">
				{/* Gist */}
				<Reveal>
					<h3 className="font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
						Summary
					</h3>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-base leading-relaxed tracking-normal">
						At about 3 years of building software, I specialize in frontend
						development and platform engineering — design systems, developer
						tooling, and scalable frontend architecture. I enjoy building
						systems that improve developer experience and enable teams to move
						faster.
					</p>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-base leading-relaxed tracking-normal">
						I'm currently in risk technology at JPMorganChase, where I build
						platform infrastructure on two fronts: the shared UI foundation
						(component libraries, design systems, architecture, and tooling)
						that product teams build on, and the agentic AI platform that's
						making AI a core part of how we ship.
					</p>
					<p className="mt-4 font-normal font-sans text-(--ink-2) text-base leading-relaxed tracking-normal">
						Outside of engineering, I enjoy street photography and occasionally
						publish my work.
					</p>
				</Reveal>

				{/* CV */}
				<Reveal>
					<h3 className="font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
						Experience
					</h3>
					<div className="mt-4">
						{experience.map((entry) => (
							<CvRow key={`${entry.title}-${entry.where}`} {...entry} />
						))}
					</div>

					<h3 className="mt-8 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
						Education
					</h3>
					<div className="mt-4">
						{education.map((entry) => (
							<CvRow key={`${entry.title}-${entry.where}`} {...entry} />
						))}
					</div>

					<h3 className="mt-8 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
						Activities
					</h3>
					<div className="mt-4">
						{activities.map((entry) => (
							<CvRow key={`${entry.title}-${entry.where}`} {...entry} />
						))}
					</div>

					<div className="mt-6">
						{/* TODO(pre-launch): stub — do not wire to /resume.pdf yet per intake */}
						<Link
							className="inline-flex cursor-none items-center gap-2 whitespace-nowrap rounded-(--r-md) bg-(--cta-bg) px-4 py-2.5 font-display font-semibold text-(--cta-ink) text-xs tracking-tight no-underline shadow-(--shadow-pop) transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--cta-bg-hover)"
							href="#"
						>
							<span>Download full CV</span>
							<span>↗</span>
						</Link>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
