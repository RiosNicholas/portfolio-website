# Serving the resume PDF

Issue #12. How to serve a static resume PDF from `public/` on Vercel so search engines, portfolio scorers and visitors all get a good result.

Today `profileLinks.resume` in `src/lib/site-links.ts` points at a Google Drive share URL. The scorer only credits links whose URL contains `resume`, `cv` or `.pdf`, and a Drive URL has none of them.

## File naming

- Anything in `public/` is served from the site root, so `public/<name>.pdf` is served at `/<name>.pdf` ([Next.js: public folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)).
- Google says URLs are case sensitive and recommends "using hyphens (`-`) instead of underscores (`_`) to separate words" ([Google: URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure)).
- The planned `Nicholas_Rios_Resume.pdf` works for the scorer (it contains `resume` and `.pdf`), but mixed case and underscores make it easy to mistype and go against Google's advice. A lowercase, hyphenated URL such as `/nicholas-rios-resume.pdf` meets both goals.
- The name people see when they save the file is set separately with `Content-Disposition: inline; filename="Nicholas_Rios_Resume.pdf"`. MDN: "A `filename` can also be provided with `Content-Disposition: inline`. Browsers may use it as the default name when the user saves the resource" ([MDN: Content-Disposition](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition)). So the URL and the downloaded filename don't have to match.
- Keep the URL stable across updates (don't put a version or date in it). Then every link already out there, including the JSON-LD and anything a scorer cached, keeps working.

## Headers

Set headers in `next.config.js` `headers()`. "Headers are checked before the filesystem which includes pages and `/public` files", so they apply to `public/` assets ([Next.js: headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers)). On Next.js projects, Vercel says to use `next.config.js` instead of `vercel.json` ([Vercel: CDN cache](https://vercel.com/docs/caching/cdn-cache)).

| Header | Value | Why |
| --- | --- | --- |
| `Content-Type` | `application/pdf` (served automatically from the extension) | No override needed. |
| `Content-Disposition` | `inline; filename="Nicholas_Rios_Resume.pdf"` | `inline` is already the default and means the browser displays the file. `attachment` would force a download ([MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition)). The point is the friendly save name. Quote it, since MDN says quotes are needed for special characters. |
| `Cache-Control` | leave the default | Next.js serves `public/` with `public, max-age=0` because "Next.js cannot safely cache assets in the `public` folder because they may change" ([Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)). On Vercel, static files are "automatically cached on Vercel's global network for the lifetime of the deployment", and you can't bypass that cache ([Vercel](https://vercel.com/docs/caching/cdn-cache)). The live site's static responses currently return `public, max-age=0, must-revalidate` with `x-vercel-cache: HIT`. In practice the CDN caches the file, the browser revalidates by ETag, and a new deploy publishes an updated resume right away. A long `max-age` on a stable URL would leave old copies in browsers, so don't add one. |
| `X-Robots-Tag` | omit (or `noindex` if you don't want the PDF in search results) | For PDFs, Google says to use the `X-Robots-Tag` header, since a PDF can't carry a meta tag ([Google: robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)). PDF is an indexable file type ([Google](https://developers.google.com/search/docs/crawling-indexing/indexable-file-types)). For a resume, indexing usually helps. |
| `Link` (optional) | `<https://nrios.dev/about>; rel="canonical"` | Google supports a canonical `Link` header for non-HTML documents like PDFs ([Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)). Use it only if you want the About page to rank instead of the PDF. It's a hint, and it competes with indexing the PDF itself, so pick one approach. |

Example:

```js
async headers() {
	return [
		{
			source: "/nicholas-rios-resume.pdf",
			headers: [
				{ key: "Content-Disposition", value: 'inline; filename="Nicholas_Rios_Resume.pdf"' },
			],
		},
	];
},
```

## Sitemap and robots

- `src/app/robots.ts` allows `/` and only disallows `/api/`, so the PDF can already be crawled. Nothing to change.
- `src/app/sitemap.ts` is built from `navLinks`. Google wants "fully-qualified, absolute URLs" in sitemaps, and a sitemap's job is to list indexable URLs ([Google: build a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)). PDF counts as indexable, so adding `${siteUrl}/nicholas-rios-resume.pdf` as one extra entry is valid. It's optional, since crawlers will find the PDF through the site's own links anyway. Leave it out if you choose `noindex` or the canonical header.

## JSON-LD `Person`

schema.org `Person` has no `resume` or `cv` property ([schema.org/Person](https://schema.org/Person)). The options:

- `subjectOf`: "A CreativeWork or Event about this Thing." This is the best fit for a standalone resume file:
  ```json
  "subjectOf": { "@type": "DigitalDocument", "name": "Nicholas Rios - Resume", "url": "https://nrios.dev/nicholas-rios-resume.pdf", "encodingFormat": "application/pdf" }
  ```
- `sameAs` is for identity pages (GitHub, LinkedIn), not documents, so don't put the PDF there.
- `mainEntityOfPage` points to the page that describes the person (for example `/about`), not the PDF.

Google has no rich result for this. The benefit is clearer data for scrapers and scorers that read JSON-LD, and it's one more place the URL with "resume" appears.

## Showing it on-site

### Native viewer (`<iframe>` / `<object>`)

- MDN: an `<iframe>` "can display a PDF using the browser's built-in PDF viewer. Unlike `<object>`, it does not support child content as a fallback ... Provide a link outside the `<iframe>`." Give the iframe a `title` so screen reader users know what it contains, and don't use `sandbox`, which "can prevent the built-in PDF viewer from loading" ([MDN: iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)).
- `navigator.pdfViewerEnabled` reports whether the browser can show PDFs inline. When it's false, "the PDF is downloaded" ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/pdfViewerEnabled)). The API is supported in Chrome 94+, Safari 16.4+ (including iOS) and Firefox 99+ (Firefox returns `true` even when set to open PDFs externally) ([MDN browser-compat-data](https://github.com/mdn/browser-compat-data)).
- **iOS Safari:** a WebKit bug that's still open means only the first page of an embedded PDF shows ([WebKit bug 253671](https://bugs.webkit.org/show_bug.cgi?id=253671)). Reports go back to iOS 8. Opening the PDF directly, as a full page, works fine.
- **Chrome on Android:** Google's help page says Chrome can now open PDFs from websites without downloading them on Android 12+, except in Incognito, where it asks to download ([Chrome Help: Manage PDFs](https://support.google.com/chrome/answer/16215622)). This rolled out around Chrome 135 (April 2025). Whether that viewer also works inside an embedded `<iframe>` isn't documented, so test it on a real device before relying on it.
- Costs nothing in bundle size. Accessibility depends on the PDF itself (tagged PDF, real text), and the browser's viewer exposes it.

### PDF.js / react-pdf

- `react-pdf` 11.1.0 requires React 19 (`peerDependencies: react ^19.0.0`) and pins `pdfjs-dist` 6.5.438 (`npm view react-pdf`). The README says it supports "the latest versions of all major modern browsers". Older browsers like Safari 18 (iOS 18) need the legacy PDF.js build plus polyfills ([react-pdf README](https://github.com/wojtekmaj/react-pdf/blob/main/packages/react-pdf/README.md)).
- Setup: you supply the worker file (`pdfjs.GlobalWorkerOptions.workerSrc`, set "in the same module" as the components, matching the exact `pdfjs-dist` version). In Next.js you also have to skip SSR (`next/dynamic` with `ssr: false`). For selectable text and working links, import the `TextLayer.css` and `AnnotationLayer.css` stylesheets.
- Size (measured from the `pdfjs-dist@6.5.438` tarball): `pdf.min.mjs` is 474 KB raw / 137 KB gzip, and the worker `pdf.worker.min.mjs` is 1.27 MB raw / 380 KB gzip. That's over 500 KB gzip of extra download to show a one or two page document, more than the rest of the site's client JS.
- Upside: rendering looks the same on every device, including the iOS multi-page case. Downside: weight, worker setup, keeping versions in sync, and it's on you to make the text and annotation layers accessible.

## Recommendation

1. Add the file as `public/nicholas-rios-resume.pdf` (lowercase and hyphenated, contains "resume" and ".pdf"). Point `profileLinks.resume` at `/nicholas-rios-resume.pdf` so both existing "View full resume" buttons pick it up. Open it in a new tab.
2. In `next.config.js`, add a single `headers()` entry: `Content-Disposition: inline; filename="Nicholas_Rios_Resume.pdf"`. Leave `Cache-Control` at the default so a redeploy updates it right away. Don't set `X-Robots-Tag`, so the PDF gets indexed.
3. Add `subjectOf` with a `DigitalDocument` pointing at the PDF to `personJsonLd`. Optionally add the PDF URL to the sitemap.
4. On-site, link straight to the PDF and let the browser's own viewer handle it. That has full support on mobile Safari and Chrome. Don't embed it: an inline `<iframe>` shows only page one on iOS. If an embed is wanted later, use a desktop-only `<iframe title="Resume">` with a visible link next to it. Skip react-pdf, since about 500 KB gzip isn't worth it for one file.
