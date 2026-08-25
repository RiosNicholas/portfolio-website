"use client";

import { m } from "motion/react";

import { Marquee } from "~/components/ui/marquee";
import { NumberTicker } from "~/components/ui/number-ticker";
import { Reveal } from "~/components/ui/reveal";
import { favouriteTools, skills } from "~/lib/bento-data";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
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

function SkillLabel({ label, accent }: { label: string; accent?: string }) {
	if (!accent) return <>{label}</>;
	const index = label.indexOf(accent);
	if (index === -1) return <>{label}</>;

	return (
		<>
			{label.slice(0, index)}
			<em className="text-(--accent-text) not-italic">{accent}</em>
			{label.slice(index + accent.length)}
		</>
	);
}

function YearsCell() {
	return (
		<div className={cn(CELL_CLASS, "col-span-2")}>
			<CellLabel>Experience</CellLabel>
			<div>
				<div className="font-display font-semibold text-6xl text-foreground leading-none tracking-tighter md:text-8xl">
					<NumberTicker value={3} />
					<sup className="align-super font-medium font-mono text-(--accent-text) text-lg tracking-normal md:text-2xl">
						yrs
					</sup>
				</div>
			</div>
			<CellSub>Building for the web since &apos;23</CellSub>
		</div>
	);
}

function SkillsCell() {
	const enabled = useAnimationsEnabled();

	return (
		<div
			className={cn(CELL_CLASS, "col-span-2 p-0 md:col-span-4 md:row-span-2")}
		>
			<div className="flex items-baseline justify-between px-6 pt-6 pb-2">
				<CellLabel>Skills</CellLabel>
				<span className="font-mono text-(--ink-3) text-xs">24 / ∞</span>
			</div>
			<Marquee
				aria-label="Skills"
				ariaHideDuplicates
				className={cn(
					"relative flex-1 p-0 [--duration:28s] [--gap:0px]",
					enabled &&
						"mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
				)}
				pauseOnHover
				repeat={2}
				vertical
			>
				{skills.map((skill) => (
					<div
						className="flex items-center gap-2.5 whitespace-nowrap px-6 py-1 font-display font-semibold text-2xl text-foreground leading-tight tracking-tight md:text-3xl"
						key={skill.label}
					>
						<span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-(--accent)" />
						<SkillLabel {...skill} />
					</div>
				))}
			</Marquee>
		</div>
	);
}

/**
 * Location cell's radar-style ping ring. Same shape as `StatusDot` —
 * `useAnimationsEnabled()` gate, `m.div` when enabled — translating
 * Tailwind's `animate-ping` exactly (including its final-25% hold).
 * File-local: it has exactly one call site.
 */
function PingRing() {
	const enabled = useAnimationsEnabled();

	if (!enabled) {
		return (
			<m.div className="absolute -inset-4 rounded-full border border-(--accent) opacity-50" />
		);
	}

	return (
		<m.div
			animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
			className="absolute -inset-4 rounded-full border border-(--accent) opacity-50"
			transition={{
				duration: 1,
				times: [0, 0.75, 1],
				ease: [0, 0, 0.2, 1],
				repeat: Infinity,
			}}
		/>
	);
}

export function BentoGrid() {
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
					<PingRing />
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
					{favouriteTools.map((tool) => (
						<span
							className="rounded-full border border-(--border-2) bg-(--frosted) px-3 py-1.5 font-medium font-sans text-(--ink-2) text-xs"
							key={tool}
						>
							{tool}
						</span>
					))}
				</div>
				<CellSub>Updated August 2026</CellSub>
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
