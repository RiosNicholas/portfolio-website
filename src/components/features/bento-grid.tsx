"use client";

import { useEffect, useRef } from "react";

import { Reveal } from "~/components/ui/reveal";
import { cn } from "~/lib/utils";

const CELL_CLASS =
	"relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-(--paper-2) p-6 shadow-(--shadow-card) transition duration-300 ease-out hover:border-(--border-2) hover:shadow-(--shadow-pop)";

function CellLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
			<span className="size-2 shrink-0 rounded-sm bg-(--accent)" />
			{children}
		</div>
	);
}

function CellSub({ children }: { children: React.ReactNode }) {
	return (
		<div className="font-mono text-(--ink-3) text-xs tracking-normal">
			{children}
		</div>
	);
}

const skills = [
	"TypeScript",
	<>
		React · <em className="text-(--accent-text) not-italic">Next.js</em>
	</>,
	"Design systems",
	<>
		Tailwind · <em className="text-(--accent-text) not-italic">shadcn/ui</em>
	</>,
	"Framer Motion",
	"Node · Python · Go",
	<>
		Agents · <em className="text-(--accent-text) not-italic">LLM UX</em>
	</>,
	"Postgres · Redis",
	"Platform engineering",
	"Observability",
	"CI / CD",
	"Animation & motion",
];

function YearsCell() {
	const numRef = useRef<HTMLSpanElement>(null);
	const observed = useRef(false);

	useEffect(() => {
		const el = numRef.current;
		if (!el) return;
		const target = 4;
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !observed.current) {
						observed.current = true;
						const start = performance.now();
						const dur = 900;
						const tick = (t: number) => {
							const k = Math.min(1, (t - start) / dur);
							const eased = 1 - (1 - k) ** 3;
							el.textContent = String(Math.round(target * eased));
							if (k < 1) requestAnimationFrame(tick);
							else
								el.innerHTML = `${target}<sup class="align-super font-medium font-mono text-(--accent-text) text-lg tracking-normal md:text-2xl">yrs</sup>`;
						};
						requestAnimationFrame(tick);
						io.disconnect();
					}
				}
			},
			{ threshold: 0.5 },
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	return (
		<div className={cn(CELL_CLASS, "col-span-2")}>
			<CellLabel>Experience</CellLabel>
			<div>
				<div className="font-display font-semibold text-6xl text-foreground leading-none tracking-tighter md:text-8xl">
					<span ref={numRef}>0</span>
				</div>
			</div>
			<CellSub>Building for the web since &apos;21</CellSub>
		</div>
	);
}

function SkillsCell() {
	// Rendered twice in markup (not via `innerHTML` duplication in an effect)
	// so the loop is seamless without re-parsing the subtree on every mount
	// or hiding the duplicate nodes from React. The `skills-reel-track` CSS
	// keyframe translates `-50%`, so two copies keep the scroll gapless; the
	// second copy is `aria-hidden` so screen readers don't announce it twice.
	const doubledSkills = [...skills, ...skills];

	return (
		<div
			className={cn(CELL_CLASS, "col-span-2 p-0 md:col-span-4 md:row-span-2")}
		>
			<div className="flex items-baseline justify-between px-6 pt-6 pb-2">
				<CellLabel>Skills</CellLabel>
				<span className="font-mono text-(--ink-3) text-xs">24 / ∞</span>
			</div>
			<div className="mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] relative flex-1 overflow-hidden">
				<div className="skills-reel-track">
					{doubledSkills.map((skill, i) => (
						<div
							aria-hidden={i >= skills.length}
							className="flex items-center gap-2.5 whitespace-nowrap px-6 py-1 font-display font-semibold text-2xl text-foreground leading-tight tracking-tight md:text-3xl"
							key={i}
						>
							<span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-(--accent)" />
							{skill}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default function BentoGrid() {
	return (
		<Reveal className="my-10 grid auto-rows-min grid-cols-2 gap-3 md:my-16 md:auto-rows-[168px] md:grid-cols-6 lg:my-20">
			{/* Location */}
			<div
				className={cn(
					CELL_CLASS,
					"col-span-2 bg-[linear-gradient(to_right,var(--grid-minor)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-minor)_1px,transparent_1px)] bg-size-[22px_22px]",
				)}
			>
				<CellLabel>Based</CellLabel>
				<div>
					<div className="font-display font-semibold text-3xl text-foreground leading-none tracking-tight md:text-4xl">
						Jersey
						<br />
						<em className="text-(--accent-text) not-italic">City</em>
					</div>
					<div className="mt-2 font-mono text-(--ink-3) text-xs">
						40.7248° N · -74.0347° W
					</div>
				</div>
				{/* Animated pin */}
				<div className="absolute top-[38%] left-[58%] h-3 w-3 rounded-full bg-(--accent) shadow-[0_0_0_4px_var(--accent-glow)]">
					<div className="absolute -inset-4 animate-ping rounded-full border border-(--accent) opacity-50" />
				</div>
			</div>

			{/* Years */}
			<YearsCell />

			{/* Status */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Status</CellLabel>
				<div className="flex flex-col gap-3">
					<div className="font-display font-semibold text-foreground text-lg leading-tight tracking-tight md:text-xl">
						Open to{" "}
						<strong className="font-semibold text-(--accent-text)">
							consulting
						</strong>
						+ full-time opportunities
					</div>
				</div>
				<CellSub>Reply within 48 hours</CellSub>
			</div>

			{/* Skills — spans 4 cols, 2 rows */}
			<SkillsCell />

			{/* Stack */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Favourite tools</CellLabel>
				<div className="flex flex-wrap gap-1.5">
					{[
						"Claude Code",
						"GitHub Copilot",
						"Vim",
						"Raycast",
            "Ghosty",
						"Figma",
            "Fish Shell"
					].map((tool) => (
						<span
							className="rounded-full border border-(--border-2) bg-(--frosted) px-3 py-1.5 font-medium font-sans text-(--ink-2) text-xs"
							key={tool}
						>
							{tool}
						</span>
					))}
				</div>
				<CellSub>Updated July 2026</CellSub>
			</div>

			{/* Now */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Currently</CellLabel>
				<div className="font-normal font-sans text-(--ink-2) text-sm leading-normal tracking-normal">
					Building{" "}
					<strong className="font-semibold text-(--accent-text)">
						UI platform infra
					</strong>{" "}
					and agentic AI systems at JPMorganChase.
				</div>
			</div>
		</Reveal>
	);
}
