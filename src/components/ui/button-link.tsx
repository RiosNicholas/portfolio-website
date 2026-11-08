import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { cn } from "~/lib/utils";

/**
 * The site's one button. Variants map to semantic tokens only; every state
 * (hover, press, keyboard focus, disabled) is styled here so call sites
 * never re-describe them.
 */
export const buttonVariants = cva(
	"group/button inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold text-body no-underline transition-[background-color,color,transform] duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-3 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 motion-reduce:active:scale-100",
	{
		variants: {
			variant: {
				primary: "bg-brand text-on-brand hover:bg-brand-hover",
				secondary: "bg-surface text-ink hover:bg-surface-hover",
				pop: "bg-pop text-pop-ink hover:bg-pop-hover focus-visible:outline-pop",
				"on-hero":
					"bg-hero-ink/12 text-hero-ink hover:bg-hero-ink/22 focus-visible:outline-hero-ink",
			},
			size: {
				md: "h-12 px-6",
				icon: "size-12",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

/** Inline text link: underlined in the brand colour. */
export const textLinkClass =
	"font-medium underline decoration-2 decoration-brand underline-offset-[0.25em] transition-colors duration-200 hover:text-brand-strong";

type ButtonLinkProps = VariantProps<typeof buttonVariants> & {
	href: string;
	children: React.ReactNode;
	className?: string;
	/** Opens in a new tab and shows the outbound arrow. */
	external?: boolean;
	/** Accessible name for icon-only buttons. */
	label?: string;
};

export function ButtonLink({
	href,
	children,
	className,
	external,
	label,
	variant,
	size,
}: ButtonLinkProps) {
	const classes = cn(buttonVariants({ variant, size }), className);
	const arrow = external && size !== "icon" && (
		<ArrowUpRight
			aria-hidden
			className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
		/>
	);

	if (external || href.startsWith("mailto:")) {
		return (
			<a
				aria-label={label}
				className={classes}
				href={href}
				{...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
			>
				{children}
				{arrow}
			</a>
		);
	}
	return (
		<Link aria-label={label} className={classes} href={href}>
			{children}
		</Link>
	);
}
