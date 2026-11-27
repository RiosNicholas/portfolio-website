import Markdown from "react-markdown";
import { Reveal } from "~/components/ui/reveal";
import { formatDateRange } from "~/lib/dates";
import { getCvEntries } from "~/server/data/cv-entries";
import { getProfile } from "~/server/data/profile";
import type { CvEntry } from "../../../generated/prisma";

function CvRows({ entries }: { entries: CvEntry[] }) {
	return (
		<ul className="m-0 list-none p-0">
			{entries.map((entry) => {
				// `where` is stored as "Organization · Location".
				const [organization, ...rest] = entry.where.split(" · ");
				return (
					// Each row sizes to its own column, so dates and location only
					// move to the right when there is room for them.
					<li className="@container border-border border-t py-4" key={entry.id}>
						<div className="flex @lg:flex-row flex-col @lg:justify-between @lg:gap-6 gap-1">
							<div className="min-w-0">
								<span className="block font-bold">{entry.title}</span>
								<span className="block font-semibold text-ink-muted">
									{organization}
								</span>
							</div>
							<div className="shrink-0 @lg:text-right text-ink-muted">
								<span className="block tabular-nums">
									{formatDateRange(entry)}
								</span>
								{rest.length > 0 && (
									<span className="block">{rest.join(" · ")}</span>
								)}
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}

const sectionHeading = "m-0 mb-4 font-semibold text-lg";

export async function AboutBio() {
	const [entries, profile] = await Promise.all([getCvEntries(), getProfile()]);
	const byCategory = (category: CvEntry["category"]) =>
		entries.filter((e) => e.category === category);
	const secondary = [
		{ heading: "Education", entries: byCategory("EDUCATION") },
		{ heading: "Awards & certifications", entries: byCategory("AWARD") },
		{ heading: "Activities", entries: byCategory("ACTIVITY") },
	].filter((group) => group.entries.length > 0);

	return (
		<section aria-labelledby="summary" className="shell pt-10 md:pt-14">
			<div className="flex max-w-5xl flex-col gap-12">
				<Reveal>
					<h2 className={sectionHeading} id="summary">
						Summary
					</h2>
					<div className="flex max-w-prose flex-col gap-4">
						<Markdown
							components={{
								p: ({ node, ...props }) => <p className="m-0" {...props} />,
							}}
						>
							{profile.summary}
						</Markdown>
					</div>
				</Reveal>

				<Reveal>
					<h2 className={sectionHeading}>Experience</h2>
					<CvRows entries={byCategory("EXPERIENCE")} />
				</Reveal>

				<Reveal className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
					{secondary.map((group) => (
						<div key={group.heading}>
							<h2 className={sectionHeading}>{group.heading}</h2>
							<CvRows entries={group.entries} />
						</div>
					))}
				</Reveal>
			</div>
		</section>
	);
}
