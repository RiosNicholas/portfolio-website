# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js + Turbo)
npm run build        # Production build
npm run check        # Lint/format with Biome
npm run check:write  # Auto-fix lint/format issues
npm run typecheck    # TypeScript type check (no emit)

npm run db:push      # Push Prisma schema changes to DB
npm run db:generate  # Run migrations in dev
npm run db:studio    # Open Prisma Studio GUI
```

No test suite is configured.

## Architecture

This is a **T3 Stack** portfolio site (Next.js 15 App Router, React 19, tRPC 11, Prisma 6, NextAuth v5, Tailwind v4), deployed on Vercel with Neon Postgres at https://nrios.dev.

### Routing & Pages

Pages live in `src/app/` and follow Next.js App Router conventions. Public routes: `/`, `/about`, `/projects` (`/work` redirects there). Admin: `/admin/**` (gated) and `/auth/login`.

### Component Hierarchy

```
src/components/
  admin/      # /admin form primitives, login form, session controls
  features/   # Full page sections (HeroSection, BentoGrid, CaseStudy, Endorsements, ContactCta, etc.)
  layout/     # Structural wrappers (SiteNav, SiteFooter, HeroField, JsonLd, SkipToContent)
  theme/      # Light/dark theme toggle
  ui/         # Primitives — shadcn/ui + custom (Globe, Marquee, Reveal, CustomCursor, NumberTicker)
```

Features are composed in pages; layout components provide scaffolding; UI components are stateless primitives.

### Content

Case studies, endorsements, CV entries, skills and languages are Prisma models in Postgres, read through `unstable_cache`-wrapped functions in `src/server/data/` and edited via `/admin`. Mutations call `revalidateTag()`. Only low-churn config (nav/profile links, `siteUrl`, JSON-LD) lives in `src/lib/site-links.ts` and `src/lib/structured-data.ts`.

### API Layer

tRPC routers are in `src/server/api/routers/` (one per content model, plus the scaffold `post`), with shared Zod input schemas in `src/server/api/schemas/`. Procedure types: `publicProcedure`, `protectedProcedure` (requires authenticated session), and `adminProcedure` (requires the admin identity). The tRPC context (`src/server/api/trpc.ts`) injects `db`, `session`, and request headers. Dev mode adds artificial latency (100–500ms) to surface waterfall issues.

### Auth

NextAuth v5 with a Credentials (username/password) provider (`src/server/auth/`), JWT sessions, no adapter. Single hardcoded admin identity (`ADMIN_USER_ID` in `src/server/auth/config.ts`) — password is scrypt-hashed via `src/server/auth/password.ts`. Session data flows into tRPC context via `auth()`.

### Styling

Tailwind CSS v4 via PostCSS. Global styles and CSS variables are in `src/styles/globals.css` using OKLch color tokens. Use the `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes. No CSS Modules.

### Path Alias

`~/` resolves to `src/` — use this for all internal imports.

### Environment Variables

Validated at build time via `env.js` (`@t3-oss/env-nextjs`). Required vars: `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `DATABASE_URL`, `DIRECT_URL`. Adding new env vars requires updating `env.js`.

## Code Quality

Biome handles both formatting and linting (not ESLint/Prettier). The `useSortedClasses` rule enforces Tailwind class ordering in `cn()`, `clsx()`, and `cva()` calls. Run `npm run check:write` to auto-fix.
