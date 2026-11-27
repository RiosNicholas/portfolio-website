"use client";

import { useEffect, useState } from "react";
import { caseTitle } from "~/lib/case-study";
import { formatDateRange } from "~/lib/dates";
import type { CaseStudy as CaseStudyData } from "../../../generated/prisma";

export function CaseStudyIndex({ studies }: { studies: CaseStudyData[] }) {
	const [active, setActive] = useState<string>();

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries)
					if (entry.isIntersecting) setActive(entry.target.id);
			},
			{ rootMargin: "-20% 0px -70% 0px" },
		);
		for (const study of studies) {
			const section = document.getElementById(study.id);
			if (section) observer.observe(section);
		}
		return () => observer.disconnect();
	}, [studies]);

	return (
		<nav
			aria-label="Projects"
			className="lg:sticky lg:top-12 lg:col-span-3 lg:self-start"
		>
			<ol className="m-0 flex list-none flex-wrap gap-2 p-0 lg:flex-col lg:gap-1">
				{studies.map((study) => (
					<li key={study.id}>
						<a
							aria-current={active === study.id ? "location" : undefined}
							className="block rounded-full bg-surface px-4 py-2 font-medium text-base text-ink no-underline transition-colors duration-200 hover:bg-surface-hover aria-[current=location]:bg-brand-soft aria-[current=location]:text-brand-strong lg:rounded-3xl lg:bg-transparent lg:px-5 lg:py-3"
							href={`#${study.id}`}
						>
							{caseTitle(study)}
							<span className="hidden font-normal text-ink-muted lg:block">
								{formatDateRange(study) || study.year}
							</span>
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
