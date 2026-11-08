"use client";

import type { Marker } from "cobe";
import { Globe } from "~/components/ui/globe";
import { Marquee } from "~/components/ui/marquee";
import { NumberTicker } from "~/components/ui/number-ticker";
import { Reveal } from "~/components/ui/reveal";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";
import type { Language, Skill } from "../../../generated/prisma";

const CELL_CLASS =
	"relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-surface p-6 transition-transform duration-300 ease-out hover:-translate-y-1 md:p-7";

// Jersey City, the Based cell's marker.
const JERSEY_CITY_MARKERS: Marker[] = [
	{ location: [40.7248, -74.0347], size: 0.08 },
];

function CellLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2 font-medium text-body text-ink-muted">
			{children}
		</div>
	);
}

function CellSub({ children }: { children: React.ReactNode }) {
	return <div className="text-body text-ink-muted">{children}</div>;
}

function YearsCell() {
	return (
		<div className={cn(CELL_CLASS, "col-span-2")}>
			<CellLabel>Experience</CellLabel>
			<div>
				<div className="font-semibold text-display text-ink">
					<NumberTicker value={3} />
					<sup className="ml-1 align-super font-medium text-ink-muted text-statement">
						yrs
					</sup>
				</div>
			</div>
		</div>
	);
}

function SkillsCell({ skills }: { skills: Skill[] }) {
	const enabled = useAnimationsEnabled();

	return (
		<div
			className={cn(
				CELL_CLASS,
				"col-span-2 justify-start p-0 md:col-span-4 md:row-span-2 md:min-h-[22rem] md:p-0 lg:col-span-3 lg:row-span-3",
			)}
		>
			<div className="flex items-baseline justify-between px-6 pt-6 pb-2 md:px-7 md:pt-7">
				<CellLabel>Skills</CellLabel>
				<span className="text-body text-ink-muted">{skills.length} / ∞</span>
			</div>
			<Marquee
				aria-label="Skills"
				ariaHideDuplicates
				className={cn(
					"relative h-64 p-0 [--duration:28s] [--gap:0px] md:absolute md:inset-x-0 md:top-18 md:bottom-0 md:h-auto",
					enabled &&
						"mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
				)}
				pauseOnHover
				repeat={2}
				vertical
			>
				{skills.map((skill) => (
					<div
						className="flex items-center gap-3 whitespace-nowrap px-6 py-1 font-semibold text-ink text-statement md:px-7"
						key={skill.id}
					>
						{skill.label}
					</div>
				))}
			</Marquee>
		</div>
	);
}

function LanguagesCell({ languages }: { languages: Language[] }) {
	return (
		<div className={cn(CELL_CLASS, "col-span-2 md:col-span-4 lg:col-span-3")}>
			<CellLabel>Languages</CellLabel>
			<div className="mt-4 grid flex-1 grid-cols-3 items-end gap-4">
				{languages.map((language) => (
					<div key={language.name}>
						<div className="truncate font-semibold text-ink text-lead">
							{language.name}
						</div>
						<div className="mt-1 text-body text-ink-muted">
							{language.level}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function BentoGrid({
	skills,
	tools,
	languages,
}: {
	skills: Skill[];
	tools: Skill[];
	languages: Language[];
}) {
	return (
		// Grid layout reference — the source order below (Based, Experience,
		// Status, Skills, Favorite tools, Currently, Languages) satisfies BOTH
		// row maps via CSS Grid auto-placement. Do not reorder these children,
		// and every row must total 6 columns at both breakpoints.
		//
		// md (768–1023px):
		//   row1  [Based 2      ][Experience 2 ][Status 2     ]
		//   row2  [Skills 4, row-span-2        ][Tools 2, rs2 ]
		//   row3  [ ...                        ][ ...         ]
		//   row4  [Currently 2  ][Languages 4                 ]
		//
		// lg (≥1024px):
		//   row1  [Based 2      ][Experience 2 ][Status 2     ]
		//   row2  [Skills 3,    ][Favorite tools 3            ]
		//   row3  [ row-span-3  ][Currently 3                 ]
		//   row4  [ ...         ][Languages 3                 ]
		<Reveal className="mt-10 grid auto-rows-min grid-cols-2 gap-3 md:mt-14 md:auto-rows-[minmax(11rem,auto)] md:grid-cols-6">
			{/* Location */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<div className="relative z-10 flex h-full flex-col justify-between gap-5">
					<CellLabel>Based in</CellLabel>
					<div>
						<div className="font-semibold text-ink text-statement">
							Jersey
							<br />
							City
						</div>
						<div className="mt-2 text-body text-ink-muted">New Jersey</div>
					</div>
				</div>
				<Globe
					className="absolute -right-24 -bottom-24 size-56 md:-right-28 md:-bottom-24 md:size-64 lg:-right-20"
					markers={JERSEY_CITY_MARKERS}
				/>
			</div>

			{/* Years */}
			<YearsCell />

			{/* Status */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<CellLabel>Status</CellLabel>
				{/* One sentence; the two terms a recruiter scans for carry the
				    ink, the connecting words stay muted. */}
				<p className="m-0 max-w-[16ch] font-medium text-ink-muted text-statement">
					Open to <strong className="font-semibold text-ink">full-time</strong>{" "}
					+&nbsp;<strong className="font-semibold text-ink">freelance</strong>{" "}
					opportunities
				</p>
			</div>

			{/* Skills — see grid layout reference above <Reveal> */}
			<SkillsCell skills={skills} />

			{/* Stack */}
			<div
				className={cn(
					CELL_CLASS,
					"col-span-2 md:row-span-2 lg:col-span-3 lg:row-span-1",
				)}
			>
				<CellLabel>Favorite tools</CellLabel>
				<div className="my-4 flex flex-wrap gap-1.5">
					{tools.map((tool) => (
						<span
							className="rounded-full bg-surface-raised px-3 py-1 font-medium text-body text-ink"
							key={tool.id}
						>
							{tool.label}
						</span>
					))}
				</div>
				<CellSub>Updated August 2026</CellSub>
			</div>

			{/* Now */}
			<div className={cn(CELL_CLASS, "col-span-2 lg:col-span-3")}>
				<CellLabel>Currently</CellLabel>
				<div>
					<div className="font-semibold text-ink text-statement">
						JPMorgan
						<br />
						Chase
					</div>
					<div className="mt-2 text-body text-ink-muted">
						Credit Risk Technology (Core UI Platform)
					</div>
				</div>
			</div>

			{/* Languages — see grid layout reference above <Reveal> */}
			<LanguagesCell languages={languages} />
		</Reveal>
	);
}
