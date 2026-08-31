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
  `Endorsement`, `CvEntry`, `Skill`, `Language` models) and the `/admin`
  surface. A username/password (Credentials) sign-in gates `/admin` — see
  [Content & admin](#content--admin) below.

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
npm run auth:hash      # generate an ADMIN_PASSWORD_HASH value for .env
```

`npm run build` requires `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`,
`ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH` to be set (`src/env.js`
validates these at build time) — `/`, `/work`, and `/about` are Server
Components that read from Postgres, and `/admin` needs a working NextAuth
Credentials session. See [Local setup](#local-setup).

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
                       data), avatar helpers, and shared utilities (cn,
                       use-animations-enabled)
  server/
    api/routers/       tRPC routers — one per content model, plus `post`
    api/schemas/       Zod input schemas shared between routers and
                       /admin's client-side forms
    data/               unstable_cache-wrapped Prisma reads, tagged per
                       model, invalidated by admin mutations
    auth/               NextAuth v5 config (Credentials provider, JWT
                       sessions) + scrypt password helpers
  styles/globals.css   Tailwind v4 entry point, OKLCH tokens, motion/
                       accessibility rules
prisma/
  schema.prisma        Post/Account/Session/User/VerificationToken (auth)
                       + CaseStudy/Endorsement/CvEntry/Skill/Language (content)
  seed.ts               one-time seed of the content that used to live in
                       src/lib/{work-data,about-data,bento-data}.ts
scripts/
  hash-password.ts      npm run auth:hash — generates ADMIN_PASSWORD_HASH
```

## Content & admin

Case studies, endorsements, CV entries (experience/education/activities),
skills/tools, and languages are Prisma models, read via
`src/server/data/*.ts` (`unstable_cache`-wrapped, tagged per model) and
edited through `/admin`:

| Section                | Public page(s)              |
|-------------------------|------------------------------|
| `/admin/case-studies`   | `/work`, home page teaser    |
| `/admin/endorsements`   | home page recommendation reel |
| `/admin/cv`             | `/about` Experience/Education/Activities |
| `/admin/skills`         | home page bento grid Skills reel & tools list |
| `/admin/languages`      | home page bento grid languages cell |

`/admin` is gated two ways: `src/app/admin/layout.tsx` redirects any visitor
who isn't signed in as the single credentials identity, and `adminProcedure`
(`src/server/api/trpc.ts`) rejects mutations from anyone else even if they
reach a form directly. Each admin mutation calls `revalidateTag(...)` after
writing, so an edit shows up on the public page on the next request — no
redeploy needed.

`src/lib/site-links.ts` (nav links, profile URLs, `siteUrl`) and
`src/lib/structured-data.ts` (Person JSON-LD) are **not** modeled — they're
low-churn structural/deploy config read by static route handlers
(`robots.ts`, `sitemap.ts`), kept as typed consts on purpose.

The `Endorsement` table is seeded with real LinkedIn recommendations
(`prisma/seed.ts`, upserted by `linkedinUrl`) — not the 12 fabricated
placeholders that used to live in `src/lib/endorsements.ts`. LinkedIn's API
doesn't expose recommendation data, so new ones get copy-pasted in by hand,
either by adding to the seed script and re-running it or directly via
`/admin/endorsements`.

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
   secret`), `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH` (see "Credentials-based
   admin access" below), and `DATABASE_URL`/`DIRECT_URL` (both can point at
   the same local Postgres — `start-database.sh` spins one up via
   Docker/Podman).
2. `npm install`
3. `npx prisma migrate dev --name add_content_models` — creates the DB
   schema (first run also generates the Prisma Client).
4. `npx prisma db seed` — seeds case studies, CV entries, skills/tools, and
   a handful of real LinkedIn endorsements.
5. `npm run auth:hash` (before first boot, if you haven't already), then
   `npm run dev`, sign in at `/api/auth/signin` with `ADMIN_USERNAME` and
   the password you hashed. `/admin` works immediately — no `db:studio`
   lookup, no restart-after-first-login. See "Credentials-based admin
   access" below for the full walkthrough.
6. Visit `/admin` — you should see the CRUD sections instead of being
   redirected.

### Credentials-based admin access

`/admin` is gated behind a username/password (Credentials) sign-in — no
OAuth app, no chicken-and-egg allowlist step:

1. **Pick a username.** Set `ADMIN_USERNAME` in `.env` to anything
   non-empty.
2. **Generate a password hash.** `npm run auth:hash`, enter a password at
   the prompt, and paste the printed line into `.env` as
   `ADMIN_PASSWORD_HASH`. Never put the plaintext password in `.env` —
   `src/env.js` validates the value against a `scrypt:<salt>:<key>` regex
   and fails the build if it looks like plaintext.
3. **Sign in.** `npm run dev`, visit `/api/auth/signin` (NextAuth's
   built-in page — this project has no custom sign-in UI by design), and
   sign in with `ADMIN_USERNAME` and the password you just hashed.
4. Visit `/admin` — it renders the hub immediately.

This replaces the previous Discord OAuth setup's three-restart
chicken-and-egg dance (sign in once, look up a DB-generated `User.id` with
`db:studio`, set it as an allowlist env var, restart). Credentials sessions
are JWT-only — Auth.js never writes a `User` row for them — so the identity
`authorize()` returns is a fixed code constant (`ADMIN_USER_ID` in
`src/server/auth/config.ts`), known at config time. That's also why there's
no allowlist env var to populate anymore: `isAdminUserId()`
(`src/server/api/trpc.ts`) just compares against that constant.

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

Also set `AUTH_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH` as real
project env vars — all are required at build time (`src/env.js`). Generate
the production hash from a *different* password than the local dev one
(`npm run auth:hash` locally, paste the result into Vercel — never the
plaintext). `package.json`'s `vercel-build` script (`prisma migrate deploy
&& next build`) runs migrations before building so schema changes ship
automatically on deploy — Vercel picks up a `vercel-build` script over
`build` automatically, no dashboard override needed.

`src/lib/site-links.ts`'s `siteUrl` constant feeds `metadataBase`, canonical
URLs, `robots.ts`, and `sitemap.ts` — it's currently a placeholder domain,
flagged with an `OWNER TODO` comment. Update it to the real production
domain before launch.
