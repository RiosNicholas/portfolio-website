"use client";

import type { Marker } from "cobe";
import { Globe } from "~/components/ui/globe";
import { Marquee } from "~/components/ui/marquee";
import { NumberTicker } from "~/components/ui/number-ticker";
import { Reveal } from "~/components/ui/reveal";
import { languages } from "~/lib/languages";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";
import type { Skill } from "../../../generated/prisma";

const CELL_CLASS =
	"relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-(--paper-2) p-6 shadow-(--shadow-card) transition duration-300 ease-out hover:border-(--border-2) hover:shadow-(--shadow-pop)";

// Jersey City — kept in sync with the coordinate text rendered in the Based
// cell below.
const JERSEY_CITY_MARKERS: Marker[] = [
	{ location: [40.7248, -74.0347], size: 0.08 },
];

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

function SkillLabel({
	label,
	accent,
}: {
	label: string;
	accent?: string | null;
}) {
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

function SkillsCell({ skills }: { skills: Skill[] }) {
	const enabled = useAnimationsEnabled();

	return (
		<div
			className={cn(CELL_CLASS, "col-span-2 p-0 md:col-span-4 md:row-span-2")}
		>
			<div className="flex items-baseline justify-between px-6 pt-6 pb-2">
				<CellLabel>Skills</CellLabel>
				<span className="font-mono text-(--ink-3) text-xs">
					{skills.length} / ∞
				</span>
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
						key={skill.id}
					>
						<span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-(--accent)" />
						<SkillLabel accent={skill.accent} label={skill.label} />
					</div>
				))}
			</Marquee>
		</div>
	);
}

function LanguagesCell() {
	return (
		<div className={cn(CELL_CLASS, "col-span-2 md:col-span-4")}>
			<CellLabel>Languages</CellLabel>
			<div className="grid grid-cols-3 gap-3">
				{languages.map((language) => (
					<div key={language.name}>
						<div className="font-display font-semibold text-foreground text-lg leading-tight tracking-tight md:text-xl">
							{language.name}
						</div>
						<div className="font-mono text-(--ink-3) text-xs">
							{language.level}
						</div>
					</div>
				))}
			</div>
			<CellSub>Two native, one in progress</CellSub>
		</div>
	);
}

export function BentoGrid({
	skills,
	tools,
}: {
	skills: Skill[];
	tools: Skill[];
}) {
	return (
		<Reveal className="my-10 grid auto-rows-min grid-cols-2 gap-3 md:my-16 md:auto-rows-[168px] md:grid-cols-6 lg:my-20">
			{/* Location */}
			<div
				className={cn(
					CELL_CLASS,
					"col-span-2 bg-[linear-gradient(to_right,var(--grid-minor)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-minor)_1px,transparent_1px)] bg-size-[22px_22px]",
				)}
			>
				<div className="relative z-10 flex h-full flex-col justify-between">
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
				</div>
				<Globe
					className="absolute -right-20 -bottom-20 size-64 md:-right-36 md:-bottom-20 md:size-72 lg:-right-12"
					markers={JERSEY_CITY_MARKERS}
				/>
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
							full-time
						</strong>{" "}
						+{" "}
						<strong className="font-semibold text-(--accent-text)">
							consulting
						</strong>{" "}
						opportunities
					</div>
				</div>
				<CellSub>Reply within 48 hours</CellSub>
			</div>

			{/* Skills — spans 4 cols, 2 rows */}
			<SkillsCell skills={skills} />

			{/* Stack */}
			<div className={cn(CELL_CLASS, "col-span-2 md:row-span-2")}>
				<CellLabel>Favorite tools</CellLabel>
				<div className="flex flex-wrap gap-1.5">
					{tools.map((tool) => (
						<span
							className="rounded-full border border-(--border-2) bg-(--frosted) px-3 py-1.5 font-medium font-sans text-(--ink-2) text-xs"
							key={tool.id}
						>
							{tool.label}
						</span>
					))}
				</div>
				<CellSub>Updated August 2026</CellSub>
			</div>

			{/* Now */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Currently</CellLabel>
				<div className="font-display font-semibold text-3xl text-foreground leading-none tracking-tight md:text-4xl">
					JPMorgan
					<br />
					<em className="text-(--accent-text) not-italic">Chase</em>
				</div>
				<CellSub>Building UI platform infra &amp; agentic AI systems</CellSub>
			</div>

			{/* Languages — spans full width of row 4 to avoid an auto-placed hole */}
			<LanguagesCell />
		</Reveal>
	);
}
