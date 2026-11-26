# Article body storage and rendering

Research for issue #16. Question: how should long-form Articles, written in `/admin` and published at `/writing/<slug>`, be stored and rendered?

Package versions below come from `npm view` on 2026-11-26.

## Where the repo is today

- Every content model (`CaseStudy`, `Endorsement`, `CvEntry`, ...) is a Prisma row, read through `unstable_cache` in `src/server/data/*` with one tag per model, and written by `adminProcedure` mutations that call `revalidateTag()` (e.g. `src/server/api/routers/endorsement.ts`). Text fields are plain `String` columns.
- `@vercel/blob` (^2.8.0) is in `package.json` but nothing in `src/` imports it. There is no upload route and no `BLOB_*` var in `src/env.js`. `Endorsement.avatarUrl` is a pasted URL, and `testimonial-card.tsx` uses a raw `<img>` because `next.config.js` has no `images.remotePatterns`. So images would be new work under any option.
- `src/components/layout/json-ld.tsx` already renders JSON-LD safely (it escapes `<`). `src/lib/structured-data.ts` has a `Person` object that an article's `author` can reuse.

## Options

### A. Markdown string in Postgres, rendered on the server

Add `body String` (Postgres `text`) to an `Article` model and edit it in a `<textarea>` in admin. The data function caches the row, like the other models do. The page renders the Markdown in a Server Component.

Renderers:

- **react-markdown 10.1.0** (peer `react >=18`). It is "secure by default (no `dangerouslySetInnerHTML` or XSS attacks)", and raw HTML is ignored unless you add `rehype-raw`. `Markdown` is synchronous. `MarkdownAsync` supports async plugins ("components returning promises are supported on the server"), and you need it for Shiki. It renders to React elements, so you can map `a`, `img`, `pre` and headings to design-system components. [README](https://github.com/remarkjs/react-markdown)
- **A unified pipeline to an HTML string** (`remark-parse` -> `remark-rehype` -> `rehype-sanitize` -> `@shikijs/rehype` -> `rehype-stringify`). This is the pipeline the Next.js docs walk through. [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx#deep-dive-how-do-you-transform-markdown-into-html) The output is a string, so you could render it once on save and store it in a column. The cost is that you then output it with `dangerouslySetInnerHTML`, and you lose the component mapping.
- **next-mdx-remote 6.0.0**. Don't use it. The README says "This project is archived and is no longer supported", and it warns: "Do not pass user input into `<MDXRemote />`." [README](https://github.com/hashicorp/next-mdx-remote) MDX compiles to JS, so content stored in the DB becomes code that runs. That is the wrong trust model even with a single admin. The community fork `next-mdx-remote-client` 2.1.12 needs `react >= 19.1.0`.

Tradeoffs: there is no editor bundle, only a textarea. Content is portable, diffable and easy to seed. Admin has no WYSIWYG unless you add a preview pane that reuses the same Server Component renderer. Total client JS for the public page is zero.

### B. MDX files in the repo (`@next/mdx`)

`.mdx` files under `content/`, loaded by dynamic import plus `generateStaticParams`. You need `mdx-components.tsx` at the root, "required to use `@next/mdx` with App Router". [Next.js MDX guide](https://nextjs.org/docs/app/guides/mdx)

- Works against the issue's premise. Articles are "written in admin", but MDX files are written in an editor and published by a git push and deploy. That breaks the DB + `/admin` + `revalidateTag` model every other content type uses.
- The upside is full JSX in posts (live demos, custom components), compiled at build time. It is trusted code, so XSS is not a concern.
- Turbopack friction (the repo runs `next dev --turbo`): "remark and rehype plugins without serializable options cannot be used yet with Turbopack", so you configure plugins by string name.
- `@next/mdx` has no frontmatter support out of the box. You use `export const metadata` or add a plugin, and the index page has to glob the filesystem.

### C. Rich-text editor storing JSON (Tiptap or Lexical)

Store the editor document as `Json` (Prisma `Json` maps to Postgres `jsonb`), which is how `CaseStudy.stats` already works.

- **Tiptap 3.35.0** (peer React 17, 18 or 19). `@tiptap/static-renderer` "doesn't require a browser, DOM or even an editor instance to render the content". `renderToReactElement` (`@tiptap/static-renderer/pm/react`) turns JSON into React elements in a Server Component, and it can also render to HTML or Markdown. [Static renderer docs](https://tiptap.dev/docs/editor/api/utilities/static-renderer) Code highlighting needs a node-view mapping for `codeBlock` that calls Shiki yourself.
- **Lexical 0.53.0** (still 0.x, peer `react >=18.x`). Server-side HTML goes through `@lexical/headless` plus `$generateHtmlFromNodes`, which needs a DOM shim such as JSDOM. [@lexical/html](https://lexical.dev/docs/packages/lexical-html) That is a heavy dependency for a serverless render.
- Tradeoffs: you get a WYSIWYG for admin, and the output is structurally safe because only known node types render. On the other hand, the admin bundle gains ProseMirror or Lexical plus extensions, which is the largest client cost of the three options. The JSON schema couples content to the editor version, migrations between editors are painful, and diffs or seeds are unreadable.

## Cross-cutting concerns

| Concern | A. Markdown in DB | B. MDX files | C. Editor JSON |
| --- | --- | --- | --- |
| XSS | Safe by default with react-markdown. Add `rehype-sanitize` only if raw HTML is ever enabled | N/A (trusted code) | Safe if rendering through the static renderer, not stored HTML |
| Shiki | `@shikijs/rehype` as a rehype plugin via `MarkdownAsync` | Same plugin, by string name under Turbopack | Custom code-block mapping |
| Images | Markdown `![](blob-url)` plus `img` component mapping | Files in `public/` or imports | Image node with Blob URL |
| Admin bundle | Textarea (about 0 KB) | None (no admin) | Largest (editor core plus extensions) |
| Public page JS | 0 (RSC) | 0 (RSC) | 0 with the static renderer |
| Fits repo pattern | Yes | No | Yes, but heavier |

**Sanitization order.** If you use `rehype-sanitize`, put it "after the last unsafe thing" and "highlight afterwards", so Shiki's inline styles are not stripped. [rehype-sanitize README](https://github.com/rehypejs/rehype-sanitize) Its default is "GitHub style sanitation", which prefixes `id`/`name` with `user-content-`. That matters for heading anchor links.

**Shiki.** The default `@shikijs/rehype` import pulls "the full bundle of `shiki`" through a shared singleton highlighter. Use `@shikijs/rehype/core` with a fine-grained highlighter so only the needed languages and themes load. Pass `themes: { light, dark }` to match the site's theme toggle. [Shiki rehype docs](https://shiki.style/packages/rehype) It runs on the server, so no highlighter ships to the browser.

**Caching.** Follow the existing pattern. `getArticleBySlug = unstable_cache(fn, ["article:<slug>"], { tags: ["articles"] })` returns the row, including the Markdown string. Article mutations call `revalidateTag("articles")`, which also re-renders pages that read the tag, so Markdown parsing and Shiki run once per revalidation and not per request. Next.js now recommends `use cache` over `unstable_cache` "in Next.js 16", but says to keep `unstable_cache` "for non-`fetch` data that must persist across deployments". The repo is on Next 15, so `unstable_cache` stays consistent. [unstable_cache docs](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)

**Images via Vercel Blob.** Client uploads go browser -> Blob through a token route, which avoids the 4.5 MB server body limit. The route's `onBeforeGenerateToken` must check auth ("Without authentication, anyone can upload files"). Here that means checking `auth()` for the admin user id and setting `allowedContentTypes: ['image/jpeg','image/png','image/webp']`. It needs `BLOB_READ_WRITE_TOKEN`, which must be added to `src/env.js`. [Vercel Blob client uploads](https://vercel.com/docs/vercel-blob/client-upload) The admin inserts the returned URL as Markdown. Rendering through `next/image` needs a `remotePatterns` entry for the Blob host. The same route would also unblock real `Endorsement` avatars.

**React 19.** Every candidate's peer range accepts React 19: react-markdown (`>=18`), Tiptap (`^19.0.0`) and @lexical/react (`>=18.x`). The one to avoid is next-mdx-remote, which is archived.

**JSON-LD.** Google lists no required properties for `Article`/`BlogPosting`. The recommended ones are `headline`, `image` (multiple high-res images at 16x9, 4x3 and 1x1), `datePublished` and `dateModified` with timezone, and `author` as a `Person` with `url`. [Google Search Central: Article](https://developers.google.com/search/docs/appearance/structured-data/article) All of these map to columns: `title`, `coverImageUrl`, `publishedAt`, `updatedAt`. `author` can reuse `personJsonLd`. Render it with the existing `<JsonLd>`, which is format-independent.

## Recommendation

Use option A. Store Markdown in a `text` column on a new `Article` model (`slug @unique`, `title`, `description`, `body`, `coverImageUrl?`, `published`, `publishedAt?`, timestamps), cached with `unstable_cache` under an `articles` tag like the other models. Render in a Server Component with `react-markdown`'s `MarkdownAsync` plus `remark-gfm` and `@shikijs/rehype/core` (dual themes), and map `img`, `a` and headings to design-system components. Keep raw HTML off, so `rehype-sanitize` is not needed. Add an admin-only Vercel Blob client-upload route for images, plus `BlogPosting` JSON-LD through `<JsonLd>`. This adds zero client JS on the public page and almost none in admin, and it matches the existing data flow. Revisit Tiptap (static renderer, JSON in `jsonb`) only if a textarea with a preview pane proves too painful. Rule out next-mdx-remote (archived, runs content as code) and repo MDX files (bypasses admin).
