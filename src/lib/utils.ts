import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom text sizes in globals.css are display, lead and body. Without them
// tailwind-merge reads `text-body` as a color and drops a real color class.
const twMerge = extendTailwindMerge({
	extend: {
		theme: { text: ["display", "lead", "body"] },
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
