import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap rounded-full border border-transparent bg-clip-padding font-medium text-sm outline-none transition-all focus-visible:ring-2 focus-visible:ring-[#0099ff] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-white text-black hover:bg-white/90",
				frosted:
					"border-white/10 bg-white/8 text-white backdrop-blur-md hover:border-white/20",
				outline:
					"border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white",
				ghost: "text-white hover:bg-white/8 hover:text-white",
				destructive: "bg-red-500/10 text-red-400 hover:bg-red-500/20",
				link: "text-[#0099ff] underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 gap-1.5 px-4",
				xs: "h-6 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1 px-3",
				lg: "h-11 gap-1.5 px-6",
				icon: "size-9",
				"icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant = "default",
	size = "default",
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot.Root : "button";

	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			data-size={size}
			data-slot="button"
			data-variant={variant}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
