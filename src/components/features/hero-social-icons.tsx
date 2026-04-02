import {
	FileTextIcon,
	GitHubLogoIcon,
	LinkedInLogoIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

import { profileLinks } from "~/lib/site-links";

const iconStyling = "size-5"
const linkStyling = "inline-flex size-11 items-center justify-center rounded-full border border-zinc-700/80 bg-zinc-900/50 text-zinc-300 transition hover:border-zinc-500 hover:bg-zinc-800 hover:text-white"

const socialIcons = [
	{
		ariaLabel: "GitHub profile",
		linkName: "github" as const,
		icon: <GitHubLogoIcon aria-hidden="true" className={iconStyling} />,
	},
	{
		ariaLabel: "LinkedIn profile",
		linkName: "linkedin" as const,
		icon: <LinkedInLogoIcon aria-hidden="true" className={iconStyling} />,
	},
	{
		ariaLabel: "Open resume PDF",
		linkName: "resume" as const,
		icon: <FileTextIcon aria-hidden="true" className={iconStyling} />,
	},
];

export function HeroSocialIcons() {
	return (
		<div className="flex items-center gap-2">
			{socialIcons.map((item) => (
				<Link
					aria-label={item.ariaLabel}
					className={linkStyling}
					href={profileLinks[item.linkName]}
					key={item.linkName}
					rel="noopener noreferrer"
					target="_blank"
				>
					{item.icon}
				</Link>
			))}
		</div>
	);
}