import Link from "next/link";

import { SectionShell } from "~/components/ui/section-shell";

export function ContactSection() {
	return (
		<SectionShell
			description="Open to conversations around UI platform strategy, frontend architecture consulting, and selected collaborations."
			eyebrow="Connect"
			id="contact"
			title="Contact"
		>
			<div className="flex flex-wrap gap-3">
				<Link
					className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
					href="mailto:hello@example.com"
				>
					Email
				</Link>
				<Link
					className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
					href="https://www.linkedin.com"
					target="_blank"
				>
					LinkedIn
				</Link>
				<Link
					className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
					href="https://github.com"
					target="_blank"
				>
					GitHub
				</Link>
			</div>
		</SectionShell>
	);
}
