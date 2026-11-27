"use client";

import type { Marker } from "cobe";
import { Globe } from "~/components/ui/globe";
import { Marquee } from "~/components/ui/marquee";
import { NumberTicker } from "~/components/ui/number-ticker";
import { Reveal } from "~/components/ui/reveal";
import { useAnimationsEnabled } from "~/lib/use-animations-enabled";
import { cn } from "~/lib/utils";
import type { Language, Profile, Skill } from "../../../generated/prisma";

// Every cell is a size container, so phone-only sizes can follow the
// card's width (cqw) instead of guessing from the viewport.
const CELL_CLASS =
	"@container relative flex flex-col justify-between gap-5 overflow-hidden rounded-3xl bg-surface p-4 transition-transform duration-300 ease-out hover:-translate-y-1 md:p-6";

// Jersey City, the Based cell's marker.
const JERSEY_CITY_MARKERS: Marker[] = [
	{ location: [40.7248, -74.0347], size: 0.06 },
];

function CellLabel({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex items-center gap-2 font-medium text-base text-ink-muted">
			{children}
		</div>
	);
}

function CellSub({ children }: { children: React.ReactNode }) {
	return <div className="text-base text-ink-muted">{children}</div>;
}

function YearsCell({ years }: { years: string }) {
	return (
		<div className={cn(CELL_CLASS, "col-span-1 md:col-span-2")}>
			<CellLabel>Experience</CellLabel>
			<div>
				{/* Phones: the number scales with the card so "3 yrs" spans its
				    width. */}
				<div className="font-semibold text-display text-ink max-md:text-[80cqw] max-md:leading-none">
					{years === "<1" ? years : <NumberTicker value={Number(years)} />}
					<sup className="ml-1 align-super font-medium text-ink-muted text-xl tracking-tight md:text-2xl">
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
				"col-span-2 justify-start p-0 md:col-span-4 md:row-span-2 md:p-0 lg:col-span-3 lg:row-span-3",
			)}
		>
			<div className="flex items-baseline justify-between px-4 pt-4 pb-2 md:px-6 md:pt-6">
				<CellLabel>Skills</CellLabel>
				<span className="text-base text-ink-muted">{skills.length} / ∞</span>
			</div>
			<Marquee
				aria-label="Skills"
				ariaHideDuplicates
				className={cn(
					"relative h-48 p-0 [--duration:28s] [--gap:0px] md:absolute md:inset-x-0 md:top-14 md:bottom-0 md:h-auto",
					enabled &&
						"mask-[linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)]",
				)}
				pauseOnHover
				repeat={2}
				vertical
			>
				{skills.map((skill) => (
					<div
						className="flex items-center gap-3 whitespace-nowrap px-4 py-1 font-semibold text-ink text-xl tracking-tight md:px-6 md:text-2xl"
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
			{/* Phones: one row per language (name, then level), so a long
			    name like Portuguese never truncates. sm and up: three columns. */}
			<div className="mt-4 grid flex-1 grid-cols-1 items-end gap-3 sm:grid-cols-3 sm:gap-4">
				{languages.map((language) => (
					<div
						className="flex items-baseline justify-between gap-4 sm:block"
						key={language.name}
					>
						<div className="font-semibold text-base text-ink md:text-lg">
							{language.name}
						</div>
						<div className="text-base text-ink-muted sm:mt-1">
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
	profile,
	years,
}: {
	skills: Skill[];
	tools: Skill[];
	languages: Language[];
	profile: Pick<Profile, "status" | "city" | "region" | "employer" | "team">;
	years: string;
}) {
	return (
		// Grid layout reference - the source order below (Based, Experience,
		// Status, Skills, Favorite tools, Currently, Languages) satisfies BOTH
		// row maps via CSS Grid auto-placement. Do not reorder these children,
		// and every row must total 6 columns at both breakpoints.
		//
		// phones (2 columns):
		//   row1  [Based 2                     ]
		//   row2  [Experience 1 ][Status 1     ]
		//   then one full-width row per cell
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
		<Reveal className="mt-8 grid auto-rows-min grid-cols-2 gap-3 md:mt-10 md:auto-rows-[minmax(9rem,auto)] md:grid-cols-6">
			{/* Location. A large globe centered on the card's bottom-right
			    corner, so only its top-left quarter (North America) pokes in.
			    --globe sets its size and the insets are half of it, so the
			    framing holds at every breakpoint. On phones the card gets the
			    full row and the globe scales with it. From md to lg the text
			    sits at the top to clear it. */}
			<div className={cn(CELL_CLASS, "col-span-2")}>
				<div className="relative z-10 flex h-full flex-col justify-between gap-5 md:justify-start md:pb-28 lg:justify-between lg:pb-0">
					<CellLabel>Based in</CellLabel>
					<div>
						<div className="font-semibold text-ink text-xl tracking-tight md:text-2xl">
							{profile.city}
						</div>
						<div className="mt-2 text-base text-ink-muted">
							{profile.region}
						</div>
					</div>
				</div>
				<Globe
					className="absolute -right-[calc(var(--globe)/2)] -bottom-[calc(var(--globe)/2)] size-(--globe) [--globe:150cqw] md:[--globe:300px] lg:[--globe:600px]"
					markers={JERSEY_CITY_MARKERS}
				/>
			</div>

			{/* Years */}
			<YearsCell years={years} />

			{/* Status - half width on phones, beside Experience */}
			<div className={cn(CELL_CLASS, "col-span-1 md:col-span-2")}>
				<CellLabel>Status</CellLabel>
				{/* One sentence; the two terms a recruiter scans for carry the
				    ink, the connecting words stay muted. */}
				{/* Phones: "opportunities" is about 6em wide, so 16cqw keeps it on
				    one line in any card width, capped at the text-xl size. */}
				<p className="m-0 max-w-[16ch] font-medium text-ink-muted text-xl tracking-tight max-md:text-[length:min(16cqw,var(--text-xl))] md:text-2xl">
					{profile.status.split(/\*\*(.+?)\*\*/).map((part, i) =>
						i % 2 ? (
							<strong
								className="whitespace-nowrap font-semibold text-ink"
								key={i}
							>
								{part}
							</strong>
						) : (
							part
						),
					)}
				</p>
			</div>

			{/* Skills - see grid layout reference above <Reveal> */}
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
							className="rounded-full bg-surface-raised px-3 py-1 font-medium text-ink text-sm"
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
					<div className="font-semibold text-ink text-xl tracking-tight md:text-2xl">
						{profile.employer}
					</div>
					<div className="mt-2 text-base text-ink-muted">{profile.team}</div>
				</div>
			</div>

			{/* Languages - see grid layout reference above <Reveal> */}
			<LanguagesCell languages={languages} />
		</Reveal>
	);
}
