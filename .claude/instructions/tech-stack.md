# Tech Stack

T3 Stack portfolio site. Next.js App Router on top, tRPC + Prisma for data,
Tailwind v4 for styling.

## Core

- **Next.js 15** (App Router, Turbo dev server) — `next@^15.2.3`
- **React 19** — `react@^19.0.0`, `react-dom@^19.0.0`
- **TypeScript 5.8**, strict, `noEmit` typecheck only (`npm run typecheck`)

## Data & API

- **tRPC 11** — routers in `src/server/api/routers/`, client wiring in
  `src/trpc/`. Two procedure types: `publicProcedure` and
  `protectedProcedure` (requires an authenticated session).
- **Prisma 6** — schema-first ORM. `npm run db:push` for dev schema sync,
  `npm run db:generate` (`prisma migrate dev`) for migrations,
  `npm run db:studio` for the GUI.
- **@t3-oss/env-nextjs** — env vars are validated at build time in
  `env.js`. Adding a new env var means updating `env.js`, not just
  reading `process.env` directly.
- **superjson** — tRPC transformer, handles Date/Map/Set etc. across the
  client/server boundary.

## Auth

- **NextAuth v5 (beta)** with a Credentials (username/password) provider —
  `src/server/auth/`. JWT sessions (`strategy: "jwt"`), no adapter — the
  single admin identity is a code constant (`ADMIN_USER_ID`), not a
  database row. Password hashing/verification (scrypt via `node:crypto`)
  lives in `src/server/auth/password.ts`. Session flows into tRPC context
  via `auth()` in `src/server/api/trpc.ts`.
- **@auth/prisma-adapter** is still installed but not wired into
  `authConfig` — Credentials-provider sessions are JWT-only and Auth.js
  never persists them to the database, so the adapter has nothing to do
  under the current single-provider config. Kept installed (and the
  `Account`/`Session`/`User`/`VerificationToken` Prisma models kept in the
  schema) so re-adding an OAuth-style provider later is config-only.

## Styling & UI

- **Tailwind CSS v4** via PostCSS (`@tailwindcss/postcss`), not the v3
  config-file model. Tokens live in `src/styles/globals.css` as OKLCH CSS
  variables — reserve that file for true global tokens/resets, not
  one-off component sizing or animation.
- Default to Tailwind's utility classes and spacing/sizing scale first.
  Reach for arbitrary values (`w-[...]`), inline `style={{}}`, or a new
  hand-rolled CSS rule only when the scale genuinely can't express what's
  needed — not as a first move.
- **Mobile-first is mandatory.** Write unprefixed (base) classes for
  mobile, then layer `sm:`/`md:`/`lg:`/`xl:` for larger viewports. Every
  new UI surface must be checked at a mobile width, not just desktop.
- **shadcn/ui** and **Magic UI** for components — check both before
  building anything from scratch, including animated/decorative pieces
  (marquees, reveals, spotlight effects, etc.) that feel like they need
  custom code.
- **class-variance-authority (cva)** for component variants, **clsx** +
  **tailwind-merge** combined into the `cn()` helper in `src/lib/utils.ts`.
- **motion** (Framer Motion successor) for animation, plus Tailwind's
  built-in animation utilities and **tw-animate-css** (already imported
  in `globals.css`) for simpler cases. Prefer these over adding new
  `@keyframes` to `globals.css`. See `src/components/ui/reveal.tsx` for
  the pattern scroll-triggered animation should follow — it replaced an
  older manual IntersectionObserver + CSS class-toggle approach on
  purpose; don't reintroduce that pattern elsewhere.
- **lucide-react** (primary) and **@radix-ui/react-icons** (for
  Radix-primitive-specific icons) — the only icon sources. No
  hand-authored SVG icons. `@hugeicons/react` is listed as a dependency
  but has zero actual usage in the codebase; don't use it, and it's a
  candidate for removal from `package.json`.
- **next-themes** for light/dark theme switching.
- **cobe** for the interactive globe (if reintroduced — it was removed
  from the photography section per recent commits, check before assuming
  it's wired up).

## Tooling

- **Biome** (`@biomejs/biome`) does both linting and formatting — not
  ESLint/Prettier. `npm run check` / `npm run check:write`. Its
  `useSortedClasses` rule enforces Tailwind class ordering inside `cn()`,
  `clsx()`, and `cva()` calls specifically.
- **npm** as package manager (`packageManager: npm@10.8.0` in
  `package.json`), no yarn/pnpm lockfiles.
- No test runner is configured. Verification is typecheck + lint + build
  + manual exercise of the feature, not a test suite.

## Commands

```bash
npm run dev          # Next.js + Turbo dev server
npm run build         # production build
npm run check         # Biome lint/format check
npm run check:write   # Biome auto-fix
npm run typecheck     # tsc --noEmit
npm run db:push       # push Prisma schema to DB
npm run db:generate   # run Prisma migrations in dev
npm run db:studio     # Prisma Studio GUI
```
