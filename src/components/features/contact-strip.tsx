import { FileTextIcon, GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

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
			className="relative mt-[clamp(48px,7vw,88px)] border-border border-t pt-[clamp(72px,12vw,136px)] pb-6"
			id="contact"
		>
			<p className="reveal mb-5 font-medium font-mono text-(--accent-text) text-[11px] uppercase tracking-[0.04em]">
				03 — Let&apos;s talk
			</p>

			<h2 className="reveal m-0 font-display font-semibold text-(--ink) text-[clamp(50px,9.5vw,132px)] leading-[0.9] tracking-[-0.04em]">
				Let&apos;s build
				<br />
				something{" "}
				<em className="inline-block -rotate-[1.4deg] rounded-lg bg-(--accent) px-[0.14em] py-[0.01em] text-(--marker-ink) not-italic [-webkit-box-decoration-break:clone] [box-decoration-break:clone]">
					good
				</em>
				.
			</h2>

			<div className="reveal mt-12 grid grid-cols-[1fr_auto] items-end gap-6">
				<a
					className="border-(--accent) border-b-[3px] pb-0.5 font-display font-semibold text-(--ink) text-[clamp(22px,2vw,32px)] tracking-[-0.03em] no-underline transition-colors duration-200 hover:text-(--accent-text)"
					href="mailto:rios.nicholas@protonmail.com"
				>
					rios.nicholas@protonmail.com
				</a>

				<div className="flex flex-wrap gap-2 font-medium font-sans text-sm tracking-[-0.01em]">
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
			</div>

      {/* TODO: Move footer to core layout */}
			{/* Footer */}
			<div className="mt-16 grid grid-cols-[1fr_auto_1fr] items-center border-border border-t pt-10 pb-24 font-mono text-(--ink-4) text-[11px] tracking-normal">
				<div>© 2026 Nicholas Rios</div>
				<div className="font-medium text-(--accent-text)">
					✱ New York City Metropolitan Area
				</div>
				<div className="text-right">UI Development· Platform Engineering · Agentic Development</div>
			</div>
		</section>
	);
}
