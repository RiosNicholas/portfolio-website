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
	"inline-flex items-center text-(--ink-4) transition-colors hover:text-(--accent-text)";

export function SiteFooter() {
	return (
		<footer className="shell pb-6">
			<div className="mt-16 flex flex-col items-center gap-3 border-border border-t pt-10 pb-10 font-mono text-(--ink-4) text-xs tracking-normal md:flex-row md:pb-16 lg:pb-24">
				<div className="flex items-center gap-3 md:flex-1">
					<span>© 2026 Nicholas Rios</span>
					<div className="flex items-center gap-2.5">
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
				</div>
				<div className="text-center font-medium text-(--accent-text) md:flex-1">
					✱ New York City Metropolitan Area
				</div>
				<div className="text-balance text-center md:flex-1 md:text-right">
					UI Development · Platform Engineering · Agentic Development
				</div>
			</div>
		</footer>
	);
}
