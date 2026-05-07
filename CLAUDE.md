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

This is a **T3 Stack** portfolio site (Next.js 15 App Router, tRPC, Prisma, NextAuth, Tailwind v4).

### Routing & Pages

Pages live in `src/app/` and follow Next.js App Router conventions. The site has routes for `/`, `/about`, `/work`, and `/photography`.

### Component Hierarchy

```
src/components/
  features/   # Full page sections (HeroSection, BentoGrid, PhotographySection, etc.)
  layout/     # Structural wrappers (FloatingHeader, SectionPanel, SectionHeader)
  ui/         # Primitives — shadcn/ui + custom (Globe, Marquee, Button, Card)
```

Features are composed in pages; layout components provide scaffolding; UI components are stateless primitives.

### Static Content

Portfolio content (work items, photography categories, nav links) lives in `src/lib/portfolio-data.ts` and `src/lib/site-links.ts` as plain TypeScript objects — no CMS.

### API Layer

tRPC routers are in `src/server/api/routers/`. Two procedure types exist: `publicProcedure` and `protectedProcedure` (requires authenticated session). The tRPC context (`src/server/api/trpc.ts`) injects `db`, `session`, and request headers. Dev mode adds artificial latency (100–500ms) to surface waterfall issues.

### Auth

NextAuth v5 with Discord OAuth provider (`src/server/auth/`). Session data flows into tRPC context via `auth()`.

### Styling

Tailwind CSS v4 via PostCSS. Global styles and CSS variables are in `src/styles/globals.css` using OKLch color tokens. Use the `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) for conditional classes. No CSS Modules.

### Path Alias

`~/` resolves to `src/` — use this for all internal imports.

### Environment Variables

Validated at build time via `env.js` (`@t3-oss/env-nextjs`). Required vars: `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET`, `DATABASE_URL`. Adding new env vars requires updating `env.js`.

## Code Quality

Biome handles both formatting and linting (not ESLint/Prettier). The `useSortedClasses` rule enforces Tailwind class ordering in `cn()`, `clsx()`, and `cva()` calls. Run `npm run check:write` to auto-fix.
