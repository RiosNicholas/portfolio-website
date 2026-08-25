export function SiteFooter() {
	return (
		<footer className="shell pb-6">
			<div className="mt-16 flex flex-col gap-3 border-border border-t pt-10 pb-10 font-mono text-(--ink-4) text-xs tracking-normal md:flex-row md:items-center md:pb-16 lg:pb-24">
				<div className="md:flex-1">© 2026 Nicholas Rios</div>
				<div className="font-medium text-(--accent-text) md:flex-1 md:text-center">
					✱ New York City Metropolitan Area
				</div>
				<div className="md:flex-1 md:text-right">
					UI Development · Platform Engineering · Agentic Development
				</div>
			</div>
		</footer>
	);
}
