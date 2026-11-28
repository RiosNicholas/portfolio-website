import "server-only";
import { lookup } from "node:dns/promises";
import { BlockList } from "node:net";
import { isShortLink } from "~/lib/sources";

const USER_AGENT = "nrios.dev link preview (+https://nrios.dev)";
const TIMEOUT_MS = 5000;
const MAX_REDIRECTS = 5;
const MAX_HTML_BYTES = 256 * 1024;

// Loopback, private, CGNAT, link-local (cloud metadata), multicast and reserved.
// BlockList also matches IPv4-mapped IPv6 (::ffff:10.0.0.1) against the IPv4 rules.
const privateRanges = new BlockList();
for (const [address, prefix] of [
	["0.0.0.0", 8],
	["10.0.0.0", 8],
	["100.64.0.0", 10],
	["127.0.0.0", 8],
	["169.254.0.0", 16],
	["172.16.0.0", 12],
	["192.168.0.0", 16],
	["224.0.0.0", 3],
] as const) {
	privateRanges.addSubnet(address, prefix, "ipv4");
}
for (const [address, prefix] of [
	["::", 127],
	["fc00::", 7],
	["fe80::", 10],
	["ff00::", 8],
] as const) {
	privateRanges.addSubnet(address, prefix, "ipv6");
}

async function isPublic(url: URL) {
	if (url.protocol !== "https:" && url.protocol !== "http:") return false;
	const addresses = await lookup(url.hostname, { all: true }).catch(() => []);
	return (
		addresses.length > 0 &&
		addresses.every(
			({ address, family }) =>
				!privateRanges.check(address, family === 6 ? "ipv6" : "ipv4"),
		)
	);
}

/** Follows redirects by hand so every hop passes the private-address check. */
async function fetchPublic(start: string, signal: AbortSignal) {
	let url = new URL(start);
	for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
		if (!(await isPublic(url))) return null;
		const res = await fetch(url, {
			headers: { "user-agent": USER_AGENT, accept: "text/html" },
			redirect: "manual",
			signal,
		});
		const location = res.headers.get("location");
		if (res.status < 300 || res.status >= 400 || !location) return { res, url };
		await res.body?.cancel();
		url = new URL(location, url);
	}
	return null;
}

/** Reads until </head> or MAX_HTML_BYTES, whichever comes first. */
async function readHead(res: Response) {
	const reader = res.body?.getReader();
	if (!reader) return "";
	const decoder = new TextDecoder();
	let html = "";
	let bytes = 0;
	while (bytes < MAX_HTML_BYTES && !/<\/head>/i.test(html)) {
		const { done, value } = await reader.read();
		if (done) break;
		bytes += value.byteLength;
		html += decoder.decode(value, { stream: true });
	}
	await reader.cancel();
	return html;
}

const META_TAG = /<meta\b[^>]*>/gi;
const ATTR = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

// Attribute order, quoting and property-vs-name vary by site, so each tag's
// attributes are parsed on their own instead of one regex over the page.
function metaContent(html: string, key: string) {
	for (const [tag] of html.matchAll(META_TAG)) {
		const attrs: Record<string, string> = Object.fromEntries(
			[...tag.matchAll(ATTR)].map(([, name = "", d, s, u]) => [
				name.toLowerCase(),
				d ?? s ?? u ?? "",
			]),
		);
		if (
			(attrs.property ?? attrs.name)?.toLowerCase() === key &&
			attrs.content
		) {
			return attrs.content.replaceAll("&amp;", "&");
		}
	}
	return null;
}

/** Best-effort og:image, then twitter:image. Null on any failure, so a broken
 * site never blocks saving for longer than TIMEOUT_MS. */
export async function fetchPreviewImage(
	pageUrl: string,
): Promise<string | null> {
	try {
		const hit = await fetchPublic(pageUrl, AbortSignal.timeout(TIMEOUT_MS));
		if (!hit) return null;
		if (
			!hit.res.ok ||
			!hit.res.headers.get("content-type")?.includes("text/html")
		) {
			await hit.res.body?.cancel();
			return null;
		}
		const html = await readHead(hit.res);
		const content =
			metaContent(html, "og:image") ?? metaContent(html, "twitter:image");
		if (!content) return null;
		const image = new URL(content, hit.url);
		// next/image only loads https remotes and rejects SVG by default.
		return image.protocol === "https:" && !image.pathname.endsWith(".svg")
			? image.href
			: null;
	} catch {
		return null;
	}
}

/** Follows lnkd.in redirects without fetching the target, and drops
 * LinkedIn's query string (its `rcm` param identifies whoever shared the
 * link). Keeps the last URL reached if anything fails. */
export async function resolveUrl(input: string): Promise<string> {
	let url = new URL(input);
	try {
		const signal = AbortSignal.timeout(TIMEOUT_MS);
		for (let hop = 0; hop < MAX_REDIRECTS && isShortLink(url.href); hop++) {
			const res = await fetch(url, {
				method: "HEAD",
				headers: { "user-agent": USER_AGENT },
				redirect: "manual",
				signal,
			});
			const location = res.headers.get("location");
			if (!location) break;
			url = new URL(location, url);
		}
	} catch {
		// Saving never waits on lnkd.in. The title rule still applies.
	}
	if (/(^|\.)linkedin\.com$/.test(url.hostname)) {
		url.search = "";
		url.hash = "";
	}
	return url.href;
}
