# How LinkedIn and YouTube posts embed from a pasted URL

Research for issue #61 (map #60). Run on 2026-11-27. "Verified" means I fetched a real public URL and saw the result. "Inferred" means it follows from verified facts but I did not test it. "Unverified" means I found no primary source.

## Short answer

- Both embed by converting the pasted URL to an iframe `src`. No API key, no script tag.
- YouTube: pull the 11-character video ID out of watch, youtu.be, shorts or live URLs. Embed `https://www.youtube-nocookie.com/embed/<id>`.
- LinkedIn: pull the URN type and numeric ID out of the URL. Embed `https://www.linkedin.com/embed/feed/update/urn:li:<type>:<id>`.
- LinkedIn's embed URL only works when the URN type matches the ID. The `activity`, `share` and `ugcPost` IDs of one post are different numbers. A `/posts/` URL only carries one of them.
- LinkedIn embeds do not resize. Pick a fixed height.
- Neither needs a Next.js config or CSP change today, because the repo sets no CSP.
- A generic oEmbed approach does not fit. LinkedIn has no oEmbed endpoint. One entry per source in `src/lib/sources.ts` is enough.

## YouTube

### URL shapes and conversion

All of these resolve to the same 11-character ID (`[A-Za-z0-9_-]{11}`).

| Shape | Example | ID source |
| --- | --- | --- |
| watch | `https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=5` | `v` query param |
| watch (mobile, music) | `https://m.youtube.com/watch?v=dQw4w9WgXcQ` | `v` query param |
| short link | `https://youtu.be/dQw4w9WgXcQ?t=43` | first path segment |
| shorts | `https://www.youtube.com/shorts/jNQXAC9IVRw` | segment after `/shorts/` |
| live | `https://www.youtube.com/live/jfKfPfyJRdk` | segment after `/live/` |
| embed (already) | `https://www.youtube.com/embed/dQw4w9WgXcQ` | segment after `/embed/` |

Hosts to accept: `youtube.com`, `www.`, `m.`, `music.` prefixes, `youtu.be`, `youtube-nocookie.com`. Parse with `new URL()`, check the hostname, then read the ID. Do not run one regex over the whole string, because `evil.com/watch?v=<id>` would pass.

```ts
const YT_HOST = /^(?:(?:www|m|music)\.)?youtube\.com$|^youtu\.be$|^(?:www\.)?youtube-nocookie\.com$/;
const YT_ID = /^[A-Za-z0-9_-]{11}$/;
const YT_PATH = /^\/(?:shorts|live|embed)\/([^/]+)/;
```

Conversion, run against the examples above (all returned the expected ID):

```
https://youtu.be/dQw4w9WgXcQ?t=43
  -> https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ
https://www.youtube.com/shorts/jNQXAC9IVRw
  -> https://www.youtube-nocookie.com/embed/jNQXAC9IVRw
```

Playlist URLs (`/playlist?list=`) and channel URLs have no 11-character video ID and should fall through as plain links.

YouTube's own oEmbed endpoint confirms the mapping. For a watch URL and a shorts URL it returned an iframe whose `src` is `https://www.youtube.com/embed/<id>?feature=oembed` (verified, `https://www.youtube.com/oembed?url=...&format=json`).

### Privacy and cookies

- YouTube Help documents privacy-enhanced mode: change the embed domain from `youtube.com` to `youtube-nocookie.com`. Views in this mode are not used to personalize the viewer's YouTube browsing or ads outside your site. Source: https://support.google.com/youtube/answer/171780
- Verified by request: loading `https://www.youtube.com/embed/<id>` set several cookies (`YSC`, `VISITOR_INFO1_LIVE`, `__Secure-YNID` and others) on the first response. Loading `https://www.youtube-nocookie.com/embed/<id>` set none. Cookies set later, after the viewer presses play, were not tested.
- Use `youtube-nocookie.com`. It is the lower-risk default. Whether a consent banner is legally needed is a legal question I did not research.
- The IFrame API reference says `origin` is optional and protects against third-party JS hijacking when `enablejsapi=1` is used. We do not use the JS API, so skip both parameters. Source: https://developers.google.com/youtube/iframe_api_reference

### Performance

- The `youtube.com` embed page loads a full player. web.dev cites about 500 KB saved by lazy-loading a YouTube iframe. Source: https://web.dev/articles/iframe-lazy-loading
- Add `loading="lazy"` on the iframe. MDN: loading is deferred until the frame nears the viewport, and only when JavaScript is on. Source: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
- Always set a `title` on the iframe. MDN says screen reader users rely on it.
- A click-to-load facade (thumbnail `https://i.ytimg.com/vi/<id>/hqdefault.jpg`, iframe swapped in on click) avoids the player cost entirely. Not needed at launch. If used, `i.ytimg.com` needs an `images.remotePatterns` entry only if the thumbnail goes through `next/image`.

### Size and phones

- The IFrame API reference sets a minimum viewport of 200 by 200 px and recommends at least 480 by 270 px for 16:9 players. Source: https://developers.google.com/youtube/iframe_api_reference
- Use `w-full aspect-video`. It scales to 360-430 px phones with no JS. Shorts are portrait but play fine in a 16:9 frame (pillarboxed). A `aspect-[9/16]` frame for shorts is optional polish.
- Do not size from the oEmbed `width`/`height`. It returned 200 by 113, which is only a default.

### Deleted, private, or embedding off

- IFrame API error codes: 100 is removed or private, 101 and 150 mean the owner disallows embedding, 153 means the request has no Referer. Source: https://developers.google.com/youtube/iframe_api_reference
- Creators can switch embedding off in YouTube Studio. Viewers then see a "Watch on YouTube" link inside the player. Age-restricted videos usually cannot play on third-party sites. Source: https://support.google.com/youtube/answer/171780
- Verified: `https://www.youtube-nocookie.com/embed/<bogus id>` still returns HTTP 200. The error shows inside the player, so the host page cannot detect it from the iframe alone. The oEmbed endpoint returned HTTP 400 for a malformed ID (`aaaaaaaaaaa`). The oEmbed spec says 404 for no match and 401 for private. Source: https://oembed.com/
- Cost of a broken video is low: the viewer sees YouTube's own error. Show the Mention's title, date and a plain link next to the embed so the Mention still reads without the frame.

## LinkedIn

### What LinkedIn documents

LinkedIn Help "Embed a post" (https://www.linkedin.com/help/linkedin/answer/a529065):

- Desktop only. Menu on the post, "Embed this post", then choose less text, full post, or (for video posts) video only. Copy the code.
- Only posts whose audience is "Anyone" can embed.
- Embeddable: text posts, first-party or third-party articles, images, videos and live videos, document posts.
- Not embeddable: multi-photo posts, reposts with commentary.
- If the author deletes the post, the embed is also deleted.
- The page does not show the embed code and does not mention company page posts.

LinkedIn's public docs never describe the iframe URL. The URL shape below comes from fetching real pages, not from a doc. That makes it stable in practice but not a promised contract.

### URN types

LinkedIn names the same post with up to three URN types. The Posts API docs list `urn:li:share`, `urn:li:ugcPost` and `urn:li:groupPost` (https://learn.microsoft.com/en-us/linkedin/dma/content/posts). Feed URLs use `urn:li:activity`. I tested all of them against `https://www.linkedin.com/embed/feed/update/urn:li:<type>:<id>`.

| URN type | Embeds | Evidence |
| --- | --- | --- |
| `activity` | Yes | HTTP 200 for a `/posts/...-activity-<id>` post and for an older post |
| `share` | Yes | HTTP 200 using the share ID found in the post's page source |
| `ugcPost` | Yes | HTTP 200 using the ugcPost ID of a post whose page lists `urn:li:ugcPost:<id>` |
| `groupPost` | No | HTTP 404 (tested with a made-up ID only, so inferred) |
| `linkedInArticle` / `/pulse/` | No | Not a feed URN, no embed path found |

Important: the IDs differ per type for the same post. In the tested posts, the `activity` ID in the `/posts/` URL was not the post's `share` or `ugcPost` ID. Using the wrong type with a real ID returned HTTP 404 (verified: `urn:li:share:` and `urn:li:activity:` with a ugcPost ID, and `urn:li:ugcPost:` with an activity ID). So the converter must keep the type from the URL and never swap it.

### URL shapes and conversion

| Shape | Example | Type | Embed type |
| --- | --- | --- | --- |
| `/posts/` slug | `https://www.linkedin.com/posts/jaindl_i-analyzed-my-450-linkedin-posts-the-winners-activity-7356652126309130242-uAKZ` | `activity` | `activity` |
| `/posts/` slug, share form | `.../posts/<user>_<slug>-share-<id>-xxxx` | `share` | `share` (inferred, same slug pattern) |
| `/posts/` slug, ugcPost form | `.../posts/<user>_<slug>-ugcPost-<id>-xxxx` | `ugcPost` | `ugcPost` (inferred) |
| feed update | `https://www.linkedin.com/feed/update/urn:li:activity:7356652126309130242/` | `activity` | `activity` |
| feed update, ugcPost | `https://www.linkedin.com/feed/update/urn:li:ugcPost:7446757689596059648` | `ugcPost` | `ugcPost` |
| feed update, encoded | `https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7356451998470217730` | `share` | `share` |

Also seen: tracking params such as `?utm_source=share&utm_medium=member_desktop` after the slug. The path regex below ignores the query. `lnkd.in` short links are redirects, cannot be resolved without a fetch, and should be rejected.

```ts
const LI_HOST = /^(?:www\.|[a-z]{2}\.)?linkedin\.com$/;
const LI_POSTS = /^\/posts\/[^/]+-(activity|share|ugcPost)-(\d{10,25})(?:-[A-Za-z0-9]{4})?\/?$/;
const LI_FEED = /^\/feed\/update\/urn(?::|%3A)li(?::|%3A)(activity|share|ugcPost)(?::|%3A)(\d{10,25})\/?$/;
// embed: `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`
```

Tested conversions (output of the regexes above run in Node):

```
https://www.linkedin.com/posts/jaindl_i-analyzed-...-activity-7356652126309130242-uAKZ
  -> https://www.linkedin.com/embed/feed/update/urn:li:activity:7356652126309130242
https://www.linkedin.com/feed/update/urn:li:ugcPost:7446757689596059648
  -> https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7446757689596059648
https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7356451998470217730
  -> https://www.linkedin.com/embed/feed/update/urn:li:share:7356451998470217730
https://www.linkedin.com/pulse/some-article-abc            -> null (not a post)
https://www.linkedin.com/feed/update/urn:li:groupPost:123  -> null
```

The two LinkedIn URL families that users copy ("Copy link to post" gives `/posts/`, the address bar gives `/feed/update/`) both reduce to the same two-part key: type and ID.

An `?collapsed=1` query also returned HTTP 200, but I could not confirm what it controls. Omit it.

### Size and phones

- The embed document has no `viewport` meta and no `postMessage` or resize code (verified in the fetched HTML). It does not report its height to the parent. The height has to be fixed by us.
- LinkedIn's generated snippet uses fixed `height`/`width` attributes, but its values are not in LinkedIn's docs. Unverified. A post with an image or document is taller than a text-only post.
- Plan: `w-full` iframe with a fixed height from one named constant, set by looking at real posts at 360, 390 and 430 px. Text posts will leave blank space and long ones will scroll inside the frame. Both are acceptable. Put the real measurement in the build ticket.
- "Embed video only" and "less text" are generator choices, not documented URL parameters. We always embed the default view.

### Privacy and performance

- Verified: requesting the embed document set `bcookie`, `bscookie`, `lidc`, `JSESSIONID`, `lang` and a Cloudflare `__cf_bm` cookie on `.linkedin.com`. There is no `nocookie` variant. A LinkedIn embed is a tracking surface.
- The document is about 25 KB. It pulls assets from `static.licdn.com` and `media.licdn.com`, plus scripts, inside the iframe only. Avatar and reaction images use LinkedIn's `lazy-load` / `data-delayed-url` pattern.
- Its response CSP says `frame-ancestors *`, so any site can frame it (verified). Its own `frame-src` allows `www.youtube-nocookie.com` and `player.vimeo.com`, which covers video posts, and applies inside LinkedIn's frame, not ours.
- Use `loading="lazy"` and a `title`. Because of the cookies, a click-to-load placeholder for LinkedIn (a card with the title, date and "Load post" button) is worth considering for a privacy-minded site. It is a design choice, not a requirement.

### Deleted or private posts

- Verified: a non-existent or mismatched URN returns HTTP 404 with a generic LinkedIn page. Inside an iframe the host page cannot see the status, because `onload` fires either way.
- Per LinkedIn Help, a deleted post's embed is also deleted. A non-public post cannot be embedded in the first place. Both end as a broken or empty frame (inferred for non-public; I had no private post to test).
- Admin-time check, if wanted: a server-side `fetch` of the embed URL returns 200 or 404, which tells you at save time that the post exists and is public. This needs no title fetching, so it does not break the "no automatic title fetching" decision. It will not catch posts deleted later.
- Keep a text fallback beside the frame: the Mention's title or the bare Source, the date, and a "View on LinkedIn" link to the original pasted URL.

## Next.js config and CSP

- `next.config.js` sets only a `/work` redirect and a resume `Content-Disposition` header. The repo sets no CSP or `X-Frame-Options`. Plain iframes need no config change.
- Next.js documents CSP headers in `next.config.js` `headers()` and in the CSP guide (https://nextjs.org/docs/app/api-reference/config/next-config-js/headers). If a CSP is added later, allow:
  - `frame-src https://www.linkedin.com https://www.youtube-nocookie.com`
  - add `https://www.youtube.com` only if a YouTube URL is ever embedded without the nocookie host
  - `img-src https://i.ytimg.com` only if thumbnails are used
- Do not use `next/script` or a third-party widget script. Iframes are enough.
- The iframe `src` is derived from the stored URL at render time, with no fetch.

## SEO: iframe versus link

- I found no primary source (Google Search Central) that says how an iframe's content is indexed for the embedding page. Treat the claim below as unverified general knowledge: embedded content is generally attributed to the source URL, not to our page.
- Practical rule: the page's own text must stand alone. Render the Mention's title (or Source name), date and topic tags as real HTML text, and a real `<a href>` to the original URL, outside the iframe. The iframe adds the visual, the text and link carry the SEO.
- Iframes cost load time. Lazy loading and a `title` limit that (MDN, web.dev above).

## Is a generic oEmbed approach viable?

No, not for this project.

- The oEmbed spec (https://oembed.com/) needs a per-provider endpoint, either found by `<link rel="alternate" type="application/json+oembed">` in the page or from the registry at https://oembed.com/providers.json.
- Verified: the registry lists YouTube, Vimeo, Spotify, Twitter and X, but not LinkedIn. `https://www.linkedin.com/oembed` returned 404 for a real post.
- It needs a server fetch per URL, which conflicts with "no automatic fetching from links" and adds a runtime dependency on a third party for every render, or a cache.
- The spec warns that provider-supplied `html` is an XSS risk and suggests an off-domain iframe. We would have to sanitize it. Building the `src` ourselves from an ID is safer.
- Verdict: one entry per source in `src/lib/sources.ts`, each with its own small `toEmbedUrl(url)` function and its own regex. Adding a Source stays one entry. X stays a plain link (out of scope).

## Suggested shape for `src/lib/sources.ts` (for the build ticket)

Each embeddable entry carries a `toEmbedUrl(url: URL): string | null`. Return `null` for URLs on the domain that are not embeddable (a LinkedIn profile, a `/pulse/` article, a YouTube playlist). Those render as plain links. The admin form can show "Embeds" or "Link only" as soon as the URL is pasted, since the conversion is pure and needs no network.

## Open items for the build

- Measure the LinkedIn iframe height on real posts at 360, 390 and 430 px, and name it once.
- Decide between always-live iframes and click-to-load placeholders (LinkedIn cookies are the reason).
- Confirm the `-share-` and `-ugcPost-` `/posts/` slug forms with a real copied link. They are inferred from the pattern.
