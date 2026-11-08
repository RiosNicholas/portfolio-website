import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom type scale in globals.css, otherwise it
// reads `text-body` as a colour and drops a real colour class beside it.
const twMerge = extendTailwindMerge({
	extend: {
		theme: { text: ["display", "title", "statement", "lead", "body"] },
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
