import { LinkedInLogoIcon } from "@radix-ui/react-icons";

import { ButtonLink, textLinkClass } from "~/components/ui/button-link";
import { Reveal } from "~/components/ui/reveal";
import { contactEmail, profileLinks } from "~/lib/site-links";
import { cn } from "~/lib/utils";

export function ContactCta() {
	return (
		<section
			aria-labelledby="contact-heading"
			className="shell pt-32 md:pt-48"
			id="contact"
		>
			<Reveal
				as="h2"
				className="m-0 font-semibold text-title"
				id="contact-heading"
			>
				Let&apos;s build something good.
			</Reveal>
			<div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
				<Reveal
					as="p"
					className="m-0 max-w-[32rem] text-lead lg:col-span-6"
					delay={0.08}
				>
					I&apos;m open to full-time and contract work. Connect on LinkedIn or
					send me an email, whichever you prefer.
				</Reveal>
				<Reveal
					className="flex flex-col gap-5 lg:col-span-6 lg:items-end"
					delay={0.16}
				>
					<div className="flex flex-wrap gap-3 lg:justify-end">
						<ButtonLink external href={profileLinks.linkedin}>
							<LinkedInLogoIcon aria-hidden className="size-5" />
							Connect on LinkedIn
						</ButtonLink>
						<ButtonLink href={`mailto:${contactEmail}`} variant="secondary">
							Email me
						</ButtonLink>
					</div>
					<a
						className={cn(textLinkClass, "text-body")}
						href={profileLinks.resume}
						rel="noopener noreferrer"
						target="_blank"
					>
						View full resume
					</a>
				</Reveal>
			</div>
		</section>
	);
}
