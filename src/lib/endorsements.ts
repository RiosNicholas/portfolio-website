/** Replace with real endorsement data. `avatarUrl` is optional — cards fall back to initials when omitted. */
export interface Endorsement {
	name: string;
	role: string;
	quote: string;
	linkedinUrl: string;
	avatarUrl?: string;
}

const AVATAR_PALETTE = [
	"#2f4a3a",
	"#a8433a",
	"#27477a",
	"#556b2f",
	"#b98a2e",
	"#b0613e",
] as const;

export function getInitials(name: string): string {
	return name
		.split(" ")
		.filter(Boolean)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

export function getAvatarColor(name: string): string {
	const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
	return AVATAR_PALETTE[hash % AVATAR_PALETTE.length] ?? AVATAR_PALETTE[0];
}

export const endorsements: Endorsement[] = [
	{
		name: "Maya Park",
		role: "Eng Mgr · Fintech",
		quote:
			"Nick shipped a design system that three teams adopted without a meeting. That never happens.",
		linkedinUrl: "https://www.linkedin.com/in/maya-park",
	},
	{
		name: "Devon Kaur",
		role: "Principal SWE",
		quote:
			"Rare combo: taste, rigor, and speed. His UI work raised the bar for the whole org.",
		linkedinUrl: "https://www.linkedin.com/in/devon-kaur",
	},
	{
		name: "Ravi Tanaka",
		role: "Director · Risk Tech",
		quote:
			"He made an agent feel like a teammate instead of a toy. Reviewers asked who designed it.",
		linkedinUrl: "https://www.linkedin.com/in/ravi-tanaka",
	},
	{
		name: "Sasha Lin",
		role: "Staff Engineer",
		quote:
			"The guy documents what he builds. I've onboarded two engineers off his READMEs alone.",
		linkedinUrl: "https://www.linkedin.com/in/sasha-lin",
	},
	{
		name: "Elena Vasquez",
		role: "Founder · Evangeliu",
		quote:
			"Our website doubled subscriptions in a quarter. He sweated every detail and then some.",
		linkedinUrl: "https://www.linkedin.com/in/elena-vasquez",
	},
	{
		name: "Jordan Fields",
		role: "CTO · Startup",
		quote:
			"Ships production-grade UI with a photographer's eye. My go-to for 0→1 interfaces.",
		linkedinUrl: "https://www.linkedin.com/in/jordan-fields",
	},
	{
		name: "Anaïs Clarke",
		role: "VP Engineering",
		quote:
			"Platform work that feels like product work. Engineers actually want to use what he builds.",
		linkedinUrl: "https://www.linkedin.com/in/anais-clarke",
	},
	{
		name: "Theo Mbeki",
		role: "Senior Designer",
		quote:
			"Calm under deadlines, opinionated in reviews — exactly what you want on a UI team.",
		linkedinUrl: "https://www.linkedin.com/in/theo-mbeki",
	},
	{
		name: "Yuna Kim",
		role: "Design Systems Lead",
		quote:
			"He rewrote our component library in a fortnight and nobody noticed — in the best way.",
		linkedinUrl: "https://www.linkedin.com/in/yuna-kim",
	},
	{
		name: "Priya Balan",
		role: "Head of Product",
		quote:
			"Nick treats interfaces like furniture — built to last, easy to live with.",
		linkedinUrl: "https://www.linkedin.com/in/priya-balan",
	},
	{
		name: "Marcus Rowe",
		role: "Friend + collaborator",
		quote:
			"Thoughtful engineer who cares about craft. Also throws a mean espresso.",
		linkedinUrl: "https://www.linkedin.com/in/marcus-rowe",
	},
	{
		name: "Claire Song",
		role: "Former Manager",
		quote: "I'd hire him tomorrow. I'll vouch — just send me an email.",
		linkedinUrl: "https://www.linkedin.com/in/claire-song",
	},
];
