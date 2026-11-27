# Can the server fetch preview images for link Mentions?

Research for issue #62 (map #60). Date of tests: 2026-11-27.

## Answer

Yes for most sites, no for a few. A server-side fetch of the page HTML plus a parse of `og:image` worked on 9 of 13 realistic URLs. The failures were bot blocks (NYT, Medium) and LinkedIn post URLs. Copy the image into Vercel Blob at save time, and fall back to the bare Source label (no image) when anything fails. Preview is best effort and never blocks saving a Mention.

## Real fetch results

Command shape: `curl -sL --max-time 10 --max-filesize 2000000 -A "<Chrome UA>" -H 'Accept: text/html'`.

| URL | Status | og:image | Bot blocked |
| --- | --- | --- | --- |
| bbc.com/news/technology (news) | 200 (redirect to /technology) | yes (ichef.bbci.co.uk jpg) | no |
| theverge.com (news) | 200 | yes (png) | no |
| techcrunch.com (news) | 200 | yes (site logo, not article art) | no |
| nytimes.com/section/technology (news) | 403 | no | yes |
| medium.com/@karpathy | 403 | no | yes |
| medium.com/better-programming | 403 | no | yes |
| lennysnewsletter.com (Substack, redirects to www) | 200 | yes (substackcdn, 400x400 crop) | no |
| astralcodexten.com (Substack custom domain) | 200 | yes (substackcdn) | no |
| github.com/vercel/next.js | 200 | yes (repository-images) | no |
| github.com/RiosNicholas/portfolio-website | 200 | yes (generated opengraph.githubassets.com card) | no |
| nextjs.org/conf (conference) | 200 | yes (Vercel Blob URL) | no |
| youtube.com/watch?v=... | 200 | yes (i.ytimg.com maxresdefault) | no |
| linkedin.com/posts/... (made-up post id) | 404 | no | n/a |
| linkedin.com/in/satyanadella (profile, not a post) | 200 | yes (profile photo, 200x200) | no, but login-wall behavior varies |
| x.com/vercel | 200 | yes (profile image) | no |

Notes and caveats:

- Medium returned 403 for both a browser-like user agent and an honest bot user agent. Treat Medium as unfetchable.
- I did not get a real public LinkedIn post URL to test, so LinkedIn posts are unverified. LinkedIn is known to gate content from unauthenticated clients, and the settled decision is that LinkedIn is embed-only, so no preview is needed.
- Several results returned a site logo or avatar rather than article art (TechCrunch, X, LinkedIn). A fetched `og:image` is not always a good preview. The admin should show it and let the owner clear it.
- A second round of tests with crawler user agents (Facebook, Twitter) was not run. Impersonating another company's crawler to get past blocks is not appropriate for production code either.
- Image headers checked: the BBC image returned `200`, `content-type: image/jpeg`, `content-length: 21153`.

## What the fetch needs

- **Spec**: Open Graph requires `og:title`, `og:type`, `og:image`, `og:url`. `og:image` is a URL, with optional `og:image:width`, `og:image:height`, `og:image:alt`, `og:image:secure_url` ([ogp.me](https://ogp.me/)). The tag is in `<head>`, so only the first part of the HTML is needed.
- **User agent**: a browser-like UA got through everywhere that was fetchable. An honest bot UA is the better long-term choice, but it was also blocked by Medium, so it buys nothing there. Pick one descriptive UA with a contact URL and accept that some sites refuse it.
- **Timeout**: `fetch(url, { signal: AbortSignal.timeout(5000) })`. On timeout the signal aborts with a `TimeoutError` ([MDN AbortSignal.timeout](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static)). Use 5s for the page and 5s for the image. Test pages answered in 0.05 to 1.1s.
- **Redirects**: needed (BBC, Lenny's redirected). `fetch` follows by default. Cap the hop count and re-check each hop's host (see SSRF below). The fetch `redirect` option values were not covered by the MDN page I read, so confirm `redirect: "manual"` against the Fetch spec before relying on it.
- **Size limits**: pages were 0.1 to 1.5 MB. Stream the body and stop reading after about 256 KB or once `</head>` is seen. Cap the image at about 2 MB and check `content-type` starts with `image/`.
- **Parsing**: read `og:image`, fall back to `twitter:image`. Resolve relative URLs against the final page URL. A small HTML head parser is enough. Meta tags vary in attribute order and quoting (`property` vs `name`, `data-rh`, `data-next-head`), so do not use a single fragile regex.
- **SSRF**: the admin is a single trusted user, so risk is low, but block non-http(s) schemes and private, loopback and link-local addresses before fetching, and again after redirects.

## Hotlink or copy

- **Hotlink** is simplest, but images can vanish or change, some CDNs block cross-origin referrers, and `next/image` needs every host listed in `images.remotePatterns` ([Next.js Image](https://nextjs.org/docs/app/api-reference/components/image)). Mentions point to arbitrary sites, so the host list is unbounded. Next.js also notes that a remote pattern that redirects is followed without re-validating `remotePatterns`.
- **Copy** into Vercel Blob at save time removes those problems: one stable host (`*.public.blob.vercel-storage.com`) for a single `remotePatterns` entry, no dependence on the third party at render time, and no visitor requests to other sites. `put(pathname, body, { access: "public", addRandomSuffix: true })` returns `blob.url` ([Vercel Blob SDK](https://vercel.com/docs/vercel-blob/using-blob-sdk)). The cost is storage and a copy of someone else's image, which is a small, attributed preview and is the same thing link unfurlers do.
- **Recommendation: copy to Blob**, store the Blob URL on the Mention, and keep the original image URL in a field only if re-fetch is wanted. Re-fetch only when the owner clicks a button in admin.

## Is a Blob token configured?

- `@vercel/blob` `^2.8.0` is in `package.json`, but nothing under `src/` imports it.
- `BLOB_READ_WRITE_TOKEN` is not in `src/env.js` and not in `.env.example` (searched by name, exit 1). Variables in `.env.example`: `AUTH_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`.
- Whether the Vercel project has a Blob store or token was not checked, and no values were read.
- The SDK resolves credentials as: explicit `token` option, then OIDC (`VERCEL_OIDC_TOKEN` with `BLOB_STORE_ID`), then `BLOB_READ_WRITE_TOKEN`. Docs recommend OIDC on Vercel and the token for code outside Vercel. Locally `vercel env pull` fetches it.
- To adopt: create a public Blob store, connect it to the project, add `BLOB_READ_WRITE_TOKEN` (optional) to `src/env.js` and `.env.example`, and add one `remotePatterns` entry for `*.public.blob.vercel-storage.com`.
- Per-blob size limits were not found in the part of the docs I read. The 2 MB image cap here is our own choice.

## Failure modes and fallback

| Failure | Handling |
| --- | --- |
| 403/429/bot wall (NYT, Medium) | no image, continue |
| 404, DNS error, timeout | no image, continue |
| No `og:image` tag | try `twitter:image`, else no image |
| Image URL dead, not an image, too big, or SVG | no image. `next/image` rejects SVG by default (`dangerouslyAllowSVG: false`) |
| Logo or avatar instead of article art | owner can clear it in admin |
| Blob not configured or upload fails | save the Mention without an image |

Fallback display: a Source label (name or bare domain) with no image. Run the fetch inside the save action with a short total budget, or after save so a slow site never blocks the form. Embed-only Sources (LinkedIn, YouTube) do not need a fetched preview.

## Sources

- https://ogp.me/
- https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/timeout_static
- https://nextjs.org/docs/app/api-reference/components/image (remotePatterns, dangerouslyAllowSVG, unoptimized)
- https://vercel.com/docs/vercel-blob/using-blob-sdk
- Live `curl` tests above, run 2026-11-27
