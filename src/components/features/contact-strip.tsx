import {
	FileTextIcon,
	GitHubLogoIcon,
	LinkedInLogoIcon,
} from "@radix-ui/react-icons";

import { Reveal } from "~/components/ui/reveal";
import { profileLinks } from "~/lib/site-links";

const iconCls = "size-4 shrink-0";

const socials: { href: string; label: string; icon: React.ReactNode }[] = [
	{
		href: profileLinks.linkedin,
		label: "LinkedIn",
		icon: <LinkedInLogoIcon aria-hidden="true" className={iconCls} />,
	},
	{
		href: profileLinks.github,
		label: "GitHub",
		icon: <GitHubLogoIcon aria-hidden="true" className={iconCls} />,
	},
	{
		href: profileLinks.resume,
		label: "Resume",
		icon: <FileTextIcon aria-hidden="true" className={iconCls} />,
	},
];

export function ContactStrip() {
	return (
		<section
			className="relative mt-10 border-border border-t pt-16 pb-6 md:mt-12 md:pt-20 lg:mt-16 lg:pt-28"
			id="contact"
		>
			<Reveal
				as="p"
				className="mb-5 font-medium font-mono text-(--accent-text) text-xs uppercase tracking-wider"
			>
				03 — Let&apos;s talk
			</Reveal>

			<Reveal
				as="h2"
				className="m-0 font-display font-semibold text-(--ink) text-5xl leading-none tracking-tighter md:text-7xl lg:text-9xl"
			>
				Let&apos;s build
				<br />
				something{" "}
				<em className="inline-block -rotate-1 rounded-lg bg-(--accent) box-decoration-clone px-2 py-px text-(--marker-ink) not-italic md:px-3 lg:px-3.5">
					good
				</em>
				.
			</Reveal>

			<Reveal className="mt-12 flex flex-wrap items-end justify-between gap-6">
				<a
					className="border-(--accent) border-b-2 pb-0.5 font-display font-semibold text-(--ink) text-2xl tracking-tight no-underline transition-colors duration-200 hover:text-(--accent-text) md:text-3xl"
					href="mailto:rios.nicholas@protonmail.com"
				>
					rios.nicholas@protonmail.com
				</a>

				<div className="flex flex-wrap gap-2 font-medium font-sans text-sm tracking-normal">
					{socials.map(({ href, label, icon }) => (
						<a
							className="inline-flex cursor-none items-center gap-2 rounded-full border border-(--border-2) bg-(--paper-2) py-2 pr-4 pl-3 text-(--ink-2) no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-(--accent) hover:bg-(--paper) hover:text-(--accent-text)"
							href={href}
							key={href}
							rel="noopener noreferrer"
							target="_blank"
						>
							{icon}
							{label}
						</a>
					))}
				</div>
			</Reveal>

			{/* TODO: Move footer to core layout */}
			{/* Footer */}
			<div className="mt-16 flex flex-col gap-3 border-border border-t pt-10 pb-10 font-mono text-(--ink-4) text-xs tracking-normal md:flex-row md:items-center md:pb-16 lg:pb-24">
				<div className="md:flex-1">© 2026 Nicholas Rios</div>
				<div className="font-medium text-(--accent-text) md:flex-1 md:text-center">
					✱ New York City Metropolitan Area
				</div>
				<div className="md:flex-1 md:text-right">
					UI Development· Platform Engineering · Agentic Development
				</div>
			</div>
		</section>
	);
}
