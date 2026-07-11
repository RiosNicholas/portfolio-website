# Conventions

## Formatting & linting

Biome is the only formatter/linter — never suggest ESLint or Prettier
config. Run `npm run check:write` before considering work done; don't
hand-format around what Biome would rewrite.

Tailwind classes inside `cn()`, `clsx()`, and `cva()` calls must be in the
order Biome's `useSortedClasses` rule expects — let `check:write` sort them
rather than hand-ordering.

## Components

- Function components, no class components.
- Before building a component (especially anything animated or
  decorative — marquees, reveals, hover effects, spotlight/glow
  treatments), check shadcn/ui and Magic UI first. Don't hand-roll what
  either library already solves.
- Co-locate variants with `cva()` when a component has more than a couple
  of style permutations (see `src/components/ui/button.tsx`,
  `card.tsx` for the pattern).
- Compose class names through `cn()` from `~/lib/utils`, not template
  literals or manual string concatenation.
- Server Components by default; add `"use client"` only when a component
  actually needs state, effects, or browser APIs.

## Styling & responsiveness

- Tailwind utility classes are the default for layout, spacing, color,
  and sizing. Inline `style={{}}` and hardcoded px values (including
  `clamp()` strings) are a last resort, not a convenience — if Tailwind's
  spacing/sizing/typography scale can express it, use the class, not the
  inline style.
- **Mobile-first, always.** Base (unprefixed) classes target mobile;
  `sm:`/`md:`/`lg:`/`xl:` layer on larger-viewport overrides. Never write
  desktop-first styles that get walked back with `max-width` queries.
  Every new page section or component gets checked at a mobile viewport
  before it's considered done, not just eyeballed at desktop width.
- Animation: use `motion` for anything scroll-triggered, interactive, or
  stateful (see `~/components/ui/reveal.tsx`), and Tailwind's built-in
  animation utilities / `tw-animate-css` for simple looping effects
  (pulse, spin, bounce). Don't add a new `@keyframes` block to
  `globals.css` if an existing utility or the `Reveal` pattern already
  covers it.

## Imports

- Always use the `~/` path alias for internal imports — no `../../../`
  chains.
- Group imports: external packages, then `~/` internal, then relative
  (rare). Biome's import sorting handles ordering within groups.

## Naming

- Components: `PascalCase` filenames matching the export
  (`HeroSection.tsx` → `export function HeroSection`), except existing
  kebab-case files in this repo (`hero-section.tsx`) — match whatever the
  surrounding directory already does rather than mixing conventions in the
  same folder.
- tRPC routers: `camelCase` procedure names, router file named after the
  domain it covers (`post.ts`, not `postRouter.ts`).
- Static data exports in `src/lib/`: `camelCase` const, typed explicitly
  (avoid relying on inference for exported data shapes consumed by
  multiple components).

## Types

- Prefer `type` for props and data shapes, `interface` only when
  declaration merging is actually needed.
- No `any`. If a type is genuinely unknown, use `unknown` and narrow.
- Let Prisma-generated types flow through rather than hand-rolling
  parallel types for DB rows.

## tRPC

- Mutations that change data the user doesn't own, or that require a
  session, use `protectedProcedure` — never gate that check inside the
  handler body with a manual `if (!session)`.
- Validate all procedure input with `zod` schemas; don't accept untyped
  `input` and trust the client.

## Commits

- Conventional-ish prefixes seen in history: `feat:`, `fix:`, `refactor:`,
  `chore:`. Follow whatever prefix matches the change. Keep the subject
  line under ~70 chars; body explains *why*, not a restatement of the diff.

## Things to avoid

- CSS Modules — don't add `*.module.css` files.
- New API routes under `src/app/api/` for things a tRPC procedure could
  do instead.
- Hand-authored SVG icons or a new icon package — `lucide-react` and
  `@radix-ui/react-icons` cover it. Don't use `@hugeicons/react`.
- Inline `style={{}}` or hardcoded px/`clamp()` values where a Tailwind
  utility class already expresses the same thing.
- New `@keyframes` in `globals.css` that duplicate a Tailwind animation
  utility or the `motion`-based `Reveal` pattern.
- Building a component from scratch (especially animated/decorative
  ones) before checking whether shadcn/ui or Magic UI already has it.
- Desktop-first styling — always start from the mobile/base styles and
  layer up with `sm:`/`md:`/`lg:`/`xl:`.
- Hardcoding content that belongs in `src/lib/` as static data.
