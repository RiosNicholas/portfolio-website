/** Where a Mention is published, recognized from its URL (see GLOSSARY.md).
 * Adding a Source is one entry here. */
type Source = {
	name: string;
	/** Bare domains. Subdomains (www., m., uk.) match too. */
	domains: string[];
	/** The iframe src for a URL on this Source, or null when that URL can't embed. */
	toEmbedUrl?: (url: URL) => string | null;
};

export type SourceMatch = { name: string; known: boolean };

// Each regex checks the host before the path, so evil.com/watch?v=<id> never embeds.
const YT_HOST =
	/^(?:(?:www|m|music)\.)?youtube\.com$|^youtu\.be$|^(?:www\.)?youtube-nocookie\.com$/;
const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const YT_PATH = /^\/(?:shorts|live|embed)\/([^/]+)/;
const LI_HOST = /^(?:www\.|[a-z]{2}\.)?linkedin\.com$/;
const LI_POSTS =
	/^\/posts\/[^/]+-(activity|share|ugcPost)-(\d{10,25})(?:-[A-Za-z0-9]{4})?\/?$/;
const LI_FEED =
	/^\/feed\/update\/urn(?::|%3A)li(?::|%3A)(activity|share|ugcPost)(?::|%3A)(\d{10,25})\/?$/;

const sources: Source[] = [
	{
		name: "LinkedIn",
		domains: ["linkedin.com", "lnkd.in"],
		// One post has a different ID per URN type, so keep the type from the URL.
		toEmbedUrl: (url) => {
			if (!LI_HOST.test(url.hostname)) return null;
			const [, type, id] =
				LI_POSTS.exec(url.pathname) ?? LI_FEED.exec(url.pathname) ?? [];
			return type && id
				? `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`
				: null;
		},
	},
	{
		name: "YouTube",
		domains: ["youtube.com", "youtu.be", "youtube-nocookie.com"],
		toEmbedUrl: (url) => {
			if (!YT_HOST.test(url.hostname)) return null;
			const id =
				url.hostname === "youtu.be"
					? url.pathname.split("/")[1]
					: url.pathname === "/watch"
						? url.searchParams.get("v")
						: YT_PATH.exec(url.pathname)?.[1];
			return id && YT_ID.test(id)
				? `https://www.youtube-nocookie.com/embed/${id}`
				: null;
		},
	},
];

function parse(url: string) {
	try {
		const parsed = new URL(url.trim());
		return parsed.protocol === "https:" || parsed.protocol === "http:"
			? parsed
			: null;
	} catch {
		return null;
	}
}

const findSource = ({ hostname }: URL) =>
	sources.find((s) =>
		s.domains.some((d) => hostname === d || hostname.endsWith(`.${d}`)),
	);

/** The Source for a URL. An unknown domain is named by `sourceName` when
 * admin gave one, else its bare host. Null when the URL doesn't parse. */
export function sourceFor(
	url: string,
	sourceName?: string | null,
): SourceMatch | null {
	const parsed = parse(url);
	if (!parsed) return null;
	const source = findSource(parsed);
	return source
		? { name: source.name, known: true }
		: {
				name: sourceName || parsed.hostname.replace(/^www\./, ""),
				known: false,
			};
}

export function embedUrlFor(url: string): string | null {
	const parsed = parse(url);
	return (parsed && findSource(parsed)?.toEmbedUrl?.(parsed)) ?? null;
}

/** lnkd.in links are redirects. The server resolves them on save. */
export const isShortLink = (url: string) => parse(url)?.hostname === "lnkd.in";

/** A link that embeds needs no title. A short link might embed once
 * resolved, so the server decides after resolving it. */
export const titleRequired = (url: string) =>
	!isShortLink(url) && embedUrlFor(url) === null;
