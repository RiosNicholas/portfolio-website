import { Reveal } from "~/components/ui/reveal";
import { formatDateRange } from "~/lib/dates";
import { cn } from "~/lib/utils";
import { getCvEntries } from "~/server/data/cv-entries";
import type { CvEntry } from "../../../generated/prisma";

function CvList({
	entries,
	className,
}: {
	entries: CvEntry[];
	className?: string;
}) {
	return (
		<ul className={cn("m-0 mt-4 flex list-none flex-col gap-4 p-0", className)}>
			{entries.map((entry) => (
				<li key={entry.id}>
					<span className="block font-medium">{entry.title}</span>
					<span className="block text-ink-muted text-sm">
						{entry.where} ·{" "}
						<span className="whitespace-nowrap tabular-nums">
							{formatDateRange(entry)}
						</span>
					</span>
				</li>
			))}
		</ul>
	);
}

const groupHeading = "m-0 font-semibold text-body";

export async function AboutBio() {
	const entries = await getCvEntries();
	const experience = entries.filter((e) => e.category === "EXPERIENCE");
	const education = entries.filter((e) => e.category === "EDUCATION");
	const activities = entries.filter((e) => e.category === "ACTIVITY");
	const awards = entries.filter((e) => e.category === "AWARD");

	return (
		<section aria-labelledby="summary" className="shell pt-24 md:pt-40">
			<div className="flex max-w-3xl flex-col gap-16 md:gap-20">
				<Reveal className="flex max-w-[34em] flex-col gap-5 text-lead">
					<h2 className="sr-only" id="summary">
						Summary
					</h2>
					<p className="m-0">
						I specialize in frontend development and platform engineering -
						design systems, developer tooling, and scalable frontend
						architecture. I enjoy building systems that improve developer
						experience and enable teams to move faster.
					</p>
					<p className="m-0">
						I'm currently in risk technology at JPMorganChase, where I build
						platform infrastructure on two fronts: the shared UI foundation
						(component libraries, design systems, architecture, and tooling)
						that product teams build on, and the agentic AI platform that's
						making AI a core part of how we ship.
					</p>
					<p className="m-0 text-ink-muted">
						Outside of engineering, I enjoy street photography and occasionally
						publish my work.
					</p>
				</Reveal>

				<Reveal>
					<h2 className="m-0 font-semibold text-lead">Experience</h2>
					<ul className="m-0 mt-4 list-none border-border border-b p-0">
						{experience.map((entry) => (
							<li
								className="flex flex-col gap-1 border-border border-t py-3 sm:flex-row sm:gap-6"
								key={entry.id}
							>
								<span className="shrink-0 pt-0.5 text-ink-muted text-sm tabular-nums sm:w-44">
									{formatDateRange(entry)}
								</span>
								<span className="min-w-0">
									<span className="font-semibold">{entry.title}</span>
									<span className="text-ink-muted"> · {entry.where}</span>
								</span>
							</li>
						))}
					</ul>
				</Reveal>

				<Reveal className="grid grid-cols-1 gap-x-10 gap-y-12 border-border border-t pt-10 md:grid-cols-2">
					<div>
						<h2 className={groupHeading}>Education</h2>
						<CvList entries={education} />
					</div>
					{awards.length > 0 && (
						<div>
							<h2 className={groupHeading}>Awards & certifications</h2>
							<CvList entries={awards} />
						</div>
					)}
					{activities.length > 0 && (
						<div className="md:col-span-2">
							<h2 className={groupHeading}>Activities</h2>
							<CvList
								className="grid grid-cols-1 gap-x-10 md:grid-cols-2"
								entries={activities}
							/>
						</div>
					)}
				</Reveal>
			</div>
		</section>
	);
}
