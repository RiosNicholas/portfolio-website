"use client";

import { useEffect, useRef } from "react";

import { cn } from "~/lib/utils";

const CELL_CLASS =
	"relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-(--paper-2) p-6 shadow-(--shadow-card) transition duration-300 ease-[cubic-bezier(.2,.7,.2,1)] hover:border-(--border-2) hover:shadow-(--shadow-pop)";

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
		const target = 10;
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
								el.innerHTML = `${target}<sup class="align-super font-medium font-mono text-(--accent-text) text-[0.28em] tracking-normal">yrs</sup>`;
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
				<div className="font-display font-semibold text-[clamp(72px,9vw,124px)] text-foreground leading-none tracking-tighter">
					<span ref={numRef}>0</span>
				</div>
			</div>
			<CellSub>Building for the web since &apos;21</CellSub>
		</div>
	);
}

function SkillsCell() {
	const trackRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const track = trackRef.current;
		if (!track) return;
		track.innerHTML = track.innerHTML + track.innerHTML;
	}, []);

	return (
		<div className={cn(CELL_CLASS, "col-span-4 row-span-2 p-0")}>
			<div className="flex items-baseline justify-between px-6 pt-6 pb-2">
				<CellLabel>Skills</CellLabel>
				<span className="font-mono text-(--ink-3) text-xs">24 / ∞</span>
			</div>
			<div className="mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] relative flex-1 overflow-hidden">
				<div className="skills-reel-track" ref={trackRef}>
					{skills.map((skill, i) => (
						<div
							className="flex items-center gap-2.5 whitespace-nowrap px-6 py-1 font-display font-semibold text-[clamp(24px,2.4vw,34px)] text-foreground leading-tight tracking-tight"
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
		<div className="reveal my-[clamp(40px,7vw,84px)] grid auto-rows-[168px] grid-cols-6 gap-3">
			{/* Location */}
			<div
				className={cn(
					CELL_CLASS,
					"col-span-2 bg-[image:linear-gradient(to_right,var(--grid-minor)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-minor)_1px,transparent_1px)] bg-[length:22px_22px]",
				)}
			>
				<CellLabel>Based</CellLabel>
				<div>
					<div className="font-display font-semibold text-[clamp(28px,3vw,44px)] text-foreground leading-none tracking-tight">
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
					<div className="absolute -inset-4 animate-[ripple_2.4s_ease-out_infinite] rounded-full border border-(--accent) opacity-50" />
				</div>
			</div>

			{/* Years */}
			<YearsCell />

			{/* Status */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Status</CellLabel>
				<div className="flex flex-col gap-3">
					<div className="font-display font-semibold text-[clamp(18px,1.5vw,22px)] text-foreground leading-tight tracking-tight">
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
					{["Claude Code", "Copilot", "Emacs Org Mode", "Figma", "Raycast", "tmux"].map(
						(tool) => (
							<span
								className="rounded-full border border-(--border-2) bg-(--frosted) px-3 py-1.5 font-medium font-sans text-(--ink-2) text-xs"
								key={tool}
							>
								{tool}
							</span>
						),
					)}
				</div>
				<CellSub>Updated July 2026</CellSub>
			</div>

			{/* Now */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Currently</CellLabel>
				<div className="font-normal font-sans text-(--ink-2) text-sm leading-normal tracking-normal">
					Building an{" "}
					<strong className="font-semibold text-(--accent-text)">
						AI tooling platform
					</strong>{" "}
					for Software Engineers and Credit Risk Officers.
				</div>
			</div>
		</div>
	);
}
