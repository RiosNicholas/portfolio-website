import Link from "next/link";

const sections = [
	{
		href: "/admin/case-studies",
		title: "Case studies",
		description: "Work page projects — /work and the home page teaser.",
	},
	{
		href: "/admin/endorsements",
		title: "Endorsements",
		description: "Home page recommendation cards.",
	},
	{
		href: "/admin/cv",
		title: "Experience, education & activities",
		description: "About page CV rows.",
	},
	{
		href: "/admin/skills",
		title: "Skills & tools",
		description: "Home page bento grid skills reel and tools list.",
	},
	{
		href: "/admin/languages",
		title: "Languages",
		description: "Home page bento grid languages cell.",
	},
];

export default function AdminPage() {
	return (
		<div>
			<h1 className="m-0 font-display font-semibold text-4xl text-foreground leading-none tracking-tighter md:text-5xl">
				Admin
			</h1>
			<p className="mt-3 max-w-prose font-normal font-sans text-(--ink-2) text-base leading-relaxed">
				Content lives in Postgres now — edits here show up on the public site on
				the next request, no redeploy needed.
			</p>

			<div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
				{sections.map((section) => (
					<Link
						className="group flex flex-col gap-1.5 rounded-(--r-lg) border border-border bg-(--paper-2) p-5 no-underline shadow-(--shadow-card) transition duration-200 ease-out hover:border-(--border-2) hover:shadow-(--shadow-pop)"
						href={section.href}
						key={section.href}
					>
						<span className="font-display font-semibold text-foreground text-lg transition-colors group-hover:text-(--accent-text)">
							{section.title}
						</span>
						<span className="font-mono text-(--ink-3) text-xs">
							{section.description}
						</span>
					</Link>
				))}
			</div>
		</div>
	);
}
