# File Structure

## Routing

`src/app/` follows Next.js App Router conventions — one folder per route,
`page.tsx` per route, shared `layout.tsx` and `not-found.tsx` at the root.

Current routes: `/` (`src/app/page.tsx`), `/about`, `/work`. `src/app/_components/`
holds route-local components that aren't reused elsewhere (prefixed `_` so
Next.js doesn't treat it as a route segment).

`src/app/api/` holds route handlers — `auth/` (NextAuth) and `trpc/` (the
tRPC fetch adapter). Don't add ad-hoc API routes here for things a tRPC
procedure could do instead.

## Components

```
src/components/
  features/   # full page sections — HeroSection, BentoGrid, WorkTeaser, etc.
  layout/     # structural wrappers — SectionPanel, SectionHeader
  theme/      # theme provider / toggle (next-themes)
  ui/         # primitives — shadcn/ui + Magic UI + custom (Button, Card, Marquee, Reveal)
```

The hierarchy is one-directional: pages compose `features/`, `features/`
compose `layout/` and `ui/`. A `ui/` component should never import from
`features/`. If a `features/` component is only ever used by one page,
it's still a `features/` component, not `_components/` — reserve
`app/_components` for things genuinely tied to route mechanics.

## Server

```
src/server/
  api/
    routers/   # one file per tRPC router
    root.ts    # merges routers into the app router (if present)
    trpc.ts    # context, procedure helpers (publicProcedure/protectedProcedure)
  auth/        # NextAuth config, providers
```

`src/trpc/` (client-side) wires the tRPC React Query client — don't
confuse it with `src/server/api/` (server-side router definitions).

## Data & content

There is no CMS. Static portfolio content — work items, nav links, etc. —
lives in `src/lib/` as plain TypeScript objects/arrays (e.g.
`site-links.ts`, `endorsements.ts`). New static content follows the same
pattern: a typed const export in `src/lib/`, imported directly into the
component that renders it. Don't reach for Prisma/tRPC for content that
isn't user-generated or persisted.

## Styling

`src/styles/globals.css` — Tailwind v4 entry point, OKLCH color tokens as
CSS variables, any global resets/animations. Component-level styling is
Tailwind utility classes via `cn()`, not CSS Modules — there are no
`*.module.css` files in this project and none should be added.

## Path alias

`~/` resolves to `src/`. Always use it for internal imports
(`~/components/ui/button`, `~/lib/utils`) instead of relative `../../..`
chains.

## Where new things go

| Adding a...                          | Goes in...                                  |
|---------------------------------------|----------------------------------------------|
| New route                             | `src/app/<route>/page.tsx`                   |
| New page section/feature              | `src/components/features/`                   |
| New structural/layout wrapper         | `src/components/layout/`                     |
| New stateless UI primitive            | `src/components/ui/`                         |
| New tRPC router                       | `src/server/api/routers/`, registered in the app router |
| New static content (copy, list data)  | `src/lib/`                                   |
| New env var                           | `.env` + `env.js` (validated schema)         |
