type SectionHeaderProps = {
	num: string;
	title: React.ReactNode;
	meta?: React.ReactNode;
};

export function SectionHeader({ num, title, meta }: SectionHeaderProps) {
	return (
		<div className="mb-[clamp(28px,3.5vw,44px)] flex items-baseline justify-between gap-6 border-border border-b pb-4">
			<span className="font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
				{num}
			</span>
			<h2 className="m-0 flex-1 font-display font-semibold text-[clamp(32px,4vw,58px)] text-foreground leading-none tracking-[-0.04em]">
				{title}
			</h2>
			{meta && (
				<span className="font-medium font-sans text-(--ink-3) text-[13px] tracking-[-0.01em]">
					{meta}
				</span>
			)}
		</div>
	);
}
