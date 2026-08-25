/** Static content for the home page's `BentoGrid` skills reel and tools
 * list. `accent` marks the substring rendered as an accented `<em>` inside
 * the skills marquee — kept as data (not JSX) so this file stays plain `.ts`. */
export type Skill = {
	label: string;
	accent?: string;
};

export const skills: Skill[] = [
	{ label: "React · Next.js", accent: "Next.js" },
	{ label: "TypeScript" },
	{ label: "Design systems" },
	{ label: "Tailwind · shadcn/ui", accent: "shadcn/ui" },
	{ label: "Framer Motion" },
	{ label: "Agents · LLM UX", accent: "LLM UX" },
	{ label: "Node · Python · Go" },
	{ label: "Postgres · Redis" },
	{ label: "Platform engineering" },
	{ label: "Observability" },
	{ label: "CI / CD" },
	{ label: "Animation & motion" },
];

export const favoriteTools: string[] = [
	"Claude Code",
	"GitHub Copilot",
	"VS Code",
	"Vim",
	"Raycast",
	"Rectangle",
	"Ghostty",
	"Figma",
	"Fish Shell",
];
