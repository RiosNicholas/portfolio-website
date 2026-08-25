# Nicholas Rios — Portfolio

Personal portfolio site: home, work (case studies), and about pages. Built
on the T3 Stack — content (case studies, endorsements, CV entries, skills)
lives in Postgres via Prisma and is edited through a gated `/admin` CRUD UI,
not in code.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5** (strict)
- **Tailwind CSS v4** via `@tailwindcss/postcss`, OKLCH design tokens in
  `src/styles/globals.css`
- **shadcn/ui** + **Magic UI** primitives, **motion** (Framer Motion
  successor) for scroll/interaction animation, **lucide-react** icons
- **Biome** for linting and formatting (not ESLint/Prettier)
- **tRPC 11 + Prisma 6 + NextAuth v5** — power content storage (`CaseStudy`,
  `Endorsement`, `CvEntry`, `Skill` models) and the `/admin` surface. Discord
  OAuth gates `/admin` to a hardcoded allowlist of `User.id`s
  (`ADMIN_USER_IDS`) — see [Content & admin](#content--admin) below.

## Commands

```bash
npm run dev           # start dev server (Next.js + Turbo)
npm run build          # production build
npm run check          # lint/format check (Biome)
npm run check:write    # auto-fix lint/format issues
npm run typecheck      # tsc --noEmit
npm run db:generate    # run migrations in dev (prisma migrate dev)
npm run db:migrate     # apply migrations in prod (prisma migrate deploy)
npm run db:push        # push schema changes without a migration (prototyping only)
npm run db:studio      # open Prisma Studio GUI
npx prisma db seed     # (re)run prisma/seed.ts against the current DATABASE_URL
```

`npm run build` requires `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
`AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, and `ADMIN_USER_IDS` to be set
(`src/env.js` validates these at build time) — `/`, `/work`, and `/about`
are Server Components that read from Postgres, and `/admin` needs a working
NextAuth session. See [Local setup](#local-setup).

## Where things live

```
src/
  app/                route pages: /, /about, /work, /admin/**, plus
                       error.tsx, not-found.tsx, robots.ts, sitemap.ts,
                       opengraph-image.tsx
  components/
    admin/             styled form primitives for /admin's CRUD pages
    features/          full page sections (HeroSection, BentoGrid,
                       CaseStudy, ContactCta, EndorsementMarquee, ...)
    layout/            structural wrappers (SiteNav, SiteFooter,
                       SectionHeader)
    theme/             theme provider / toggle
    ui/                primitives — shadcn/ui + Magic UI + custom
                       (Button, Card, Marquee, Reveal, CustomCursor)
  lib/                site-wide config consts (nav/profile links, structured
                       data), languages.ts, avatar helpers, and shared
                       utilities (cn, use-animations-enabled)
  server/
    api/routers/       tRPC routers — one per content model, plus `post`
    api/schemas/       Zod input schemas shared between routers and
                       /admin's client-side forms
    data/               unstable_cache-wrapped Prisma reads, tagged per
                       model, invalidated by admin mutations
    auth/               NextAuth v5 config (Discord provider)
  styles/globals.css   Tailwind v4 entry point, OKLCH tokens, motion/
                       accessibility rules
prisma/
  schema.prisma        Post/Account/Session/User/VerificationToken (auth)
                       + CaseStudy/Endorsement/CvEntry/Skill (content)
  seed.ts               one-time seed of the content that used to live in
                       src/lib/{work-data,about-data,bento-data}.ts
```

## Content & admin

Case studies, endorsements, CV entries (experience/education/activities),
and skills/tools are Prisma models, read via `src/server/data/*.ts`
(`unstable_cache`-wrapped, tagged per model) and edited through `/admin`:

| Section                | Public page(s)              |
|-------------------------|------------------------------|
| `/admin/case-studies`   | `/work`, home page teaser    |
| `/admin/endorsements`   | home page recommendation reel |
| `/admin/cv`             | `/about` Experience/Education/Activities |
| `/admin/skills`         | home page bento grid Skills reel & tools list |

`/admin` is gated two ways: `src/app/admin/layout.tsx` redirects any visitor
who isn't signed in and allowlisted, and `adminProcedure`
(`src/server/api/trpc.ts`) rejects mutations from anyone not in
`ADMIN_USER_IDS` even if they reach a form directly. Each admin mutation
calls `revalidateTag(...)` after writing, so an edit shows up on the public
page on the next request — no redeploy needed.

`src/lib/site-links.ts` (nav links, profile URLs, `siteUrl`) and
`src/lib/structured-data.ts` (Person JSON-LD) are **not** modeled — they're
low-churn structural/deploy config read by static route handlers
(`robots.ts`, `sitemap.ts`), kept as typed consts on purpose.
`src/lib/languages.ts` (the bento grid's Languages cell) is the same
carve-out — three rows that change roughly never, not worth a `Language`
model or a third `SkillKind`.

The `Endorsement` table ships **empty** by design — the 12 testimonials
that used to live in `src/lib/endorsements.ts` were fabricated placeholders
(LinkedIn's API doesn't expose recommendation data, so real ones have to be
hand-entered via `/admin/endorsements`, not synced).

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

## Local setup

1. Copy `.env.example` to `.env` and fill in `AUTH_SECRET` (`npx auth
   secret`), a Discord OAuth app's `AUTH_DISCORD_ID`/`AUTH_DISCORD_SECRET`,
   and `DATABASE_URL`/`DIRECT_URL` (both can point at the same local
   Postgres — `start-database.sh` spins one up via Docker/Podman).
2. `npm install`
3. `npx prisma migrate dev --name add_content_models` — creates the DB
   schema (first run also generates the Prisma Client).
4. `npx prisma db seed` — seeds case studies, CV entries, and skills/tools
   from their old static values. Endorsements are deliberately left empty.
5. `npm run dev`, sign in once via Discord at `/api/auth/signin`, then read
   your `User.id` with `npm run db:studio` and set it as `ADMIN_USER_IDS`
   in `.env` (comma-separated if there's ever more than one). Restart the
   dev server so the new env var is picked up.
6. Visit `/admin` — you should see the CRUD sections instead of being
   redirected.

## Deploying

Deployed on **Vercel Postgres** (Neon-backed), connected via the Vercel
dashboard integration. That integration auto-populates
`POSTGRES_PRISMA_URL` (pooled) and `POSTGRES_URL_NON_POOLING` (direct) as
project env vars — map those to this project's own names in Vercel's
project env var settings (one-time, after connecting the integration):

| This project's var | = Vercel Postgres var        |
|---------------------|-------------------------------|
| `DATABASE_URL`       | `POSTGRES_PRISMA_URL`         |
| `DIRECT_URL`         | `POSTGRES_URL_NON_POOLING`    |

Also set `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, and
`ADMIN_USER_IDS` as real project env vars — all are required at build time
(`src/env.js`). `package.json`'s `vercel-build` script (`prisma migrate
deploy && next build`) runs migrations before building so schema changes
ship automatically on deploy — Vercel picks up a `vercel-build` script over
`build` automatically, no dashboard override needed.

`src/lib/site-links.ts`'s `siteUrl` constant feeds `metadataBase`, canonical
URLs, `robots.ts`, and `sitemap.ts` — it's currently a placeholder domain,
flagged with an `OWNER TODO` comment. Update it to the real production
domain before launch.
