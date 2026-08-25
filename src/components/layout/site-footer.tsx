import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";

import { profileLinks } from "~/lib/site-links";

const socialIconCls = "size-4 shrink-0";

const socialLinks = [
	{
		href: profileLinks.github,
		label: "Visit my GitHub profile",
		icon: <GitHubLogoIcon aria-hidden="true" className={socialIconCls} />,
	},
	{
		href: profileLinks.linkedin,
		label: "Visit my LinkedIn profile",
		icon: <LinkedInLogoIcon aria-hidden="true" className={socialIconCls} />,
	},
];

const socialLinkCls =
	"inline-flex size-7 items-center justify-center rounded-full text-(--ink-4) transition-colors hover:text-(--accent-text)";

export function SiteFooter() {
	return (
		<footer className="shell pb-6">
			<div className="mt-16 flex flex-col gap-3 border-border border-t pt-10 pb-10 font-mono text-(--ink-4) text-xs tracking-normal md:flex-row md:items-center md:pb-16 lg:pb-24">
				<div className="-ml-1.5 flex items-center gap-1 md:flex-1">
					<span className="ml-1.5">© 2026 Nicholas Rios</span>
					{socialLinks.map(({ href, label, icon }) => (
						<a
							aria-label={label}
							className={socialLinkCls}
							href={href}
							key={href}
							rel="noopener noreferrer"
							target="_blank"
						>
							{icon}
						</a>
					))}
				</div>
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
