type SectionShellProps = {
	id: string;
	eyebrow: string;
	title: string;
	description: string;
	children?: React.ReactNode;
};

export function SectionShell({
	id,
	eyebrow,
	title,
	description,
	children,
}: SectionShellProps) {
	return (
		<section
			className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 md:p-8"
			id={id}
		>
			<p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-400">
				{eyebrow}
			</p>
			<h2 className="font-semibold text-2xl md:text-3xl">{title}</h2>
			<p className="mt-3 max-w-3xl text-zinc-300">{description}</p>
			{children ? <div className="mt-6">{children}</div> : null}
		</section>
	);
}
