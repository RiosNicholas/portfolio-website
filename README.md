# Nicholas Rios — Portfolio

Personal portfolio site: home, work (case studies), and about pages. Built
as a statically-prerendered marketing site on top of the T3 Stack — the
backend scaffolding (tRPC/Prisma/NextAuth) is present but unused by any
page today (see [Backend scaffolding](#backend-scaffolding) below).

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss`, OKLCH design tokens in
  `src/styles/globals.css`
- **shadcn/ui** + **Magic UI** primitives, **motion** (Framer Motion
  successor) for scroll/interaction animation, **lucide-react** icons
- **Biome** for linting and formatting (not ESLint/Prettier)
- tRPC 11 + Prisma 6 + NextAuth v5 exist under `src/server/` and `src/trpc/`
  but are not wired into any page — see below

## Commands

```bash
npm run dev          # start dev server (Next.js + Turbo)
npm run build         # production build
npm run check         # lint/format check (Biome)
npm run check:write   # auto-fix lint/format issues
npm run typecheck     # tsc --noEmit
```

`npm run build` succeeds with no `.env` file present — none of the
prerendered routes read database or auth env vars at build time.

## Where things live

```
src/
  app/                route pages: /, /about, /work, plus error.tsx,
                       not-found.tsx, robots.ts, sitemap.ts,
                       opengraph-image.tsx
  components/
    features/         full page sections (HeroSection, BentoGrid,
                       CaseStudy, ContactCta, EndorsementMarquee, ...)
    layout/            structural wrappers (SiteNav, SiteFooter,
                       SectionHeader)
    theme/             theme provider / toggle
    ui/                primitives — shadcn/ui + Magic UI + custom
                       (Button, Card, Marquee, Reveal, CustomCursor)
  lib/                static content + typed data (see below) and shared
                       utilities (cn, use-animations-enabled)
  server/              tRPC routers + NextAuth config (currently unused
                       by any page — see Backend scaffolding)
  styles/globals.css   Tailwind v4 entry point, OKLCH tokens, motion/
                       accessibility rules
```

## Editing content

There's no CMS — copy and structured data live as typed consts in
`src/lib/` and get imported directly into the components that render them:

| To change...                        | Edit...                          |
|---------------------------------------|-----------------------------------|
| Nav links, profile links, site URL    | `src/lib/site-links.ts`           |
| About page bio / CV rows              | `src/lib/about-data.ts`           |
| Work page case studies                | `src/lib/work-data.ts`            |
| Home page endorsement cards           | `src/lib/endorsements.ts`         |
| Bento grid skills / favorite tools    | `src/lib/bento-data.ts`           |
| Schema.org structured data            | `src/lib/structured-data.ts`      |

> `src/lib/endorsements.ts` currently ships **placeholder testimonials** —
> invented names, quotes, and LinkedIn URLs. Replace with real endorsement
> data before treating the site as launch-ready; see the file's header
> comment.

## Design system

See `DESIGN.md` for the visual direction, token tables, motion rules, and
component inventory.

## Accessibility & motion

- `useAnimationsEnabled()` (`src/lib/use-animations-enabled.ts`) is the
  single source of truth for whether rich motion should play — it's `true`
  unless the OS `prefers-reduced-motion` or the site's `data-motion="low"`
  toggle is active. Every `motion`-driven component reads it and renders a
  complete, non-animated resting state when `false`; see
  `.claude/instructions/animation-accessibility.md` for the pattern.
- The custom cursor (`src/components/ui/custom-cursor.tsx`) only replaces
  the native cursor once it confirms a real pointer device and has actually
  mounted (`data-custom-cursor="on"` on `<html>`) — with JavaScript
  disabled, or on touch devices, the native cursor is used throughout.
- A skip link (`#main-content`) precedes the fixed nav in `layout.tsx` for
  keyboard users.

## Backend scaffolding

`src/server/` (tRPC routers, NextAuth, Prisma) and `src/trpc/` (client
wiring) are retained but not imported by any current page — no prerendered
route reads `DATABASE_URL`, `AUTH_DISCORD_ID`, or `AUTH_DISCORD_SECRET`, all
three are `.optional()` in `src/env.js`, and the two live API routes
(`/api/trpc`, `/api/auth`) are dynamic so they're never evaluated during
`next build`. This is scaffolding kept for a possible future admin surface
(see `agentWork/prod-readiness-audit/SCALING.md` for the migration plan) —
not dead code to delete casually, but also not something any page depends
on today.

## Deploying

Any Next.js host (Vercel, etc.) works out of the box — no environment
variables are required for a build to succeed. If the backend scaffolding
above is ever wired up for real, add `DATABASE_URL`, `AUTH_DISCORD_ID`, and
`AUTH_DISCORD_SECRET` to the deploy environment at that point.

`src/lib/site-links.ts`'s `siteUrl` constant feeds `metadataBase`, canonical
URLs, `robots.ts`, and `sitemap.ts` — it's currently a placeholder domain,
flagged with an `OWNER TODO` comment. Update it to the real production
domain before launch.
