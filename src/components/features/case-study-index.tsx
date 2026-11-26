import { textLinkClass } from "~/components/ui/button-link";
import { caseTitle } from "~/lib/case-study";
import { cn } from "~/lib/utils";
import type { CaseStudy as CaseStudyData } from "../../../generated/prisma";

export function CaseStudyIndex({ studies }: { studies: CaseStudyData[] }) {
	return (
		<nav aria-label="Jump to a case study">
			<ol className="m-0 grid list-none grid-cols-1 gap-x-10 gap-y-2 p-0 md:grid-cols-2">
				{studies.map((study, index) => (
					<li className="flex items-baseline gap-4 text-body" key={study.id}>
						<span className="text-ink-muted tabular-nums">
							{String(index + 1).padStart(2, "0")}
						</span>
						<a
							className={cn(textLinkClass, "flex-1 py-3")}
							href={`#${study.id}`}
						>
							{caseTitle(study)}
						</a>
						<span className="shrink-0 text-ink-muted">{study.year}</span>
					</li>
				))}
			</ol>
		</nav>
	);
}
