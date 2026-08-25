/** Static content for the home page's `BentoGrid` skills reel and tools
 * list. `accent` marks the substring rendered as an accented `<em>` inside
 * the skills marquee — kept as data (not JSX) so this file stays plain `.ts`. */
export type Skill = {
	label: string;
	accent?: string;
};

export const skills: Skill[] = [
	{ label: "TypeScript" },
	{ label: "React · Next.js", accent: "Next.js" },
	{ label: "Design systems" },
	{ label: "Tailwind · shadcn/ui", accent: "shadcn/ui" },
	{ label: "Framer Motion" },
	{ label: "Node · Python · Go" },
	{ label: "Agents · LLM UX", accent: "LLM UX" },
	{ label: "Postgres · Redis" },
	{ label: "Platform engineering" },
	{ label: "Observability" },
	{ label: "CI / CD" },
	{ label: "Animation & motion" },
];

export const favouriteTools: string[] = [
	"Claude Code",
	"GitHub Copilot",
	"Vim",
	"Raycast",
	"Ghosty",
	"Figma",
	"Fish Shell",
];
