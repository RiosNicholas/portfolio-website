type SectionHeaderProps = {
	num: string;
	title: React.ReactNode;
	meta?: React.ReactNode;
};

export function SectionHeader({ num, title, meta }: SectionHeaderProps) {
	return (
		<div className="mb-4 flex items-baseline justify-between gap-4 border-border border-b pb-3 md:mb-9 md:gap-6 md:pb-4 lg:mb-11">
			<span className="font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider">
				{num}
			</span>
			<h2 className="m-0 flex-1 font-display font-semibold text-3xl text-foreground leading-none tracking-tighter md:text-5xl lg:text-6xl">
				{title}
			</h2>
			{meta && (
				<span className="font-medium font-sans text-(--ink-3) text-sm tracking-normal">
					{meta}
				</span>
			)}
		</div>
	);
}
