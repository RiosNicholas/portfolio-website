# DESIGN.md — Nicholas Rios · Portfolio

Design direction and token reference for the portfolio site. Implementation
lives in `src/styles/globals.css` (Tailwind v4 + OKLCH tokens) and
`src/components/`; see `README.md` for the file map and where content lives.

---

## 1. Direction

Warm paper with bold accent pops. Soft warm cream paper (light) or warm
espresso/stone (dark) with a low-contrast graph-paper grid running edge to
edge. Confident display type (Schibsted Grotesk), a swappable accent
(cobalt/pink/lime/grape — cobalt is the current default), geometric shapes
(rings, triangles, dots) floating in whitespace, marker-highlight emphasis
on one word per headline, yellow CTA buttons.

Primary goal: sell technical skills in UI + platform engineering. Clean,
minimal, no filler. Voice: confident, plain-spoken, dry wit allowed.

## 2. Copy rules

- One `<em className="mark">` per headline — never two, never zero. The
  marker highlight lands on a single 1-word concept.
- Numbers: show them when real. Don't invent metrics — the seeded
  `CaseStudy` stats and `Endorsement` quotes are both real (see README.md
  "Content & admin"), never invented placeholders.
- No gerunds as sentence-starting nouns ("Building", "Shipping"). Lead with
  a verb or a statement.
- Avoid clichés: "passionate", "drives results", "craft at scale".

## 3. Tokens (`src/styles/globals.css`)

All colors are OKLCH via Tailwind v4's `@theme` + CSS custom properties, not
hex. The values below are the underlying Tailwind palette names each token
resolves to — read `globals.css` for the actual `:root` block, don't
hand-copy hex here.

**Light** — `--paper: amber-50`, `--paper-2: white`, `--paper-3: amber-100`,
`--ink: stone-900`, `--ink-2: stone-700`, `--ink-3: stone-600`,
`--ink-4:` a stone-500/600 mix (footer/meta text — contrast-checked against
`--paper`, ~5.7:1, passes WCAG AA).

**Dark** (`:root[data-theme="dark"]`) — `--paper: stone-950`,
`--paper-2: stone-900`, `--paper-3: stone-800`, `--ink: amber-50`,
`--ink-2/3/4: stone-200/300/400`. Never cold black — always warm stone.

**Accent** (`data-accent` on `<html>`: `cobalt` default, plus `pink`,
`lime`, `grape`) — each sets `--accent`, `--accent-text` (readable on
`--paper`, distinct light/dark values), `--accent-glow`, `--marker-ink`.

**Secondary palette** (decorative only — geo shapes, status dots; never UI
surfaces) — `--c-pink`, `--c-lime`, `--c-cobalt`, `--c-yellow`, `--c-grape`,
`--c-clay`.

**CTA** — always yellow regardless of accent: `--cta-bg` (amber-300),
`--cta-bg-hover` (amber-400), `--cta-ink` (stone-950).

**Type** — Display/heading: Schibsted Grotesk (`font-display`/`font-heading`),
tight tracking, used for hero/section titles/bento values/case titles.
`<em className="mark">` renders as a tilted accent marker block. Body:
Hanken Grotesk (`font-sans`). Mono: JetBrains Mono (`font-mono`) for
meta/labels/CV years, small size, no forced uppercase (components opt in
with `uppercase tracking-wider` where wanted).

**Radii** — `--r-sm 4 / --r-md 6 / --r-lg 10 / --r-xl 16 / --r-pill 999`.
Cards use `--r-lg`, buttons/chips use `--r-pill` or `--r-md`.

**Shadows** — `--shadow-card` (subtle lift), `--shadow-pop` (hover
elevation), `--shadow-hard` (strong depth), `--shadow-float` (frosted
panels like the nav).

**Grid background** (`.paper-bg`) — two-layer graph-paper grid, minor lines
every 28px, major every 140px, plus a soft accent radial halo above the
hero. `data-grid="on" | "subtle" | "off"` on `<html>` controls opacity
(defaults to `subtle`).

**Theme** — defaults to OS `prefers-color-scheme` on first load, toggled via
`src/components/theme/theme-toggle.tsx`, persisted to `localStorage`. An
inline script in `layout.tsx` sets `data-theme`/`data-accent`/`data-grid`/
`data-motion` before paint to avoid a flash of the wrong theme.

## 4. Motion

`useAnimationsEnabled()` (`src/lib/use-animations-enabled.ts`) is the single
gate for all `motion`-driven animation — `false` when OS
`prefers-reduced-motion: reduce` is set or the site's `data-motion="low"`
toggle is active. Every animated component must render a complete,
non-animated resting state when it's `false` — see
`.claude/instructions/animation-accessibility.md` for the required pattern
and worked examples (`StatusDot`, `NumberTicker`, `Marquee`'s
scrollable-fallback behavior).

Plain CSS animations (not JS/`motion`-driven) are throttled separately via
`:root[data-motion="low"] * { animation-duration: 0.001s !important; ... }`
in `globals.css` — reserved for simple looping effects that don't need the
JS gate.

## 5. Signature components

- **Bento grid** (`BentoGrid`) — 6-col grid, 168px auto rows. Cells:
  location (animated pin + ping ring), years (in-view count-up via
  `NumberTicker`), status, skills (vertical `Marquee` reel), favorite
  tools (chip cloud), currently, languages (static, `src/lib/languages.ts`).
  Skills/tools data comes from the `Skill` model
  (`src/server/data/skills.ts`), edited via `/admin/skills`.
- **Work teaser / case studies** (`WorkTeaser`, `CaseStudy`) — home page
  shows the featured `CaseStudy` rows (`src/server/data/case-studies.ts`);
  `/work` renders every case in full (two-column: meta rail +
  description/tags/stats). Edited via `/admin/case-studies`.
- **Endorsement marquee** (`EndorsementMarquee`) — two opposing-direction
  rows built on the shared `Marquee` primitive (`src/components/ui/marquee.tsx`),
  which degrades to a single-copy, keyboard-scrollable container (not an
  animated one) when motion is disabled.
- **Contact CTA + footer** (`ContactCta`, `SiteFooter`) — oversized display
  headline with one tilted accent marker, email as a big linked word,
  social pill links. The CTA renders per-page (currently `/about`); the
  footer is global, rendered once in the root layout.
- **Custom cursor** (`CustomCursor`) — dot + spring-follow ring, states for
  link/text/photo hover. Only takes over (`data-custom-cursor="on"` on
  `<html>`) once it confirms a real pointer device and has mounted — native
  cursor is used on touch devices and whenever JavaScript hasn't run.
- **Geometric shapes** (`GeoDecoration`) — decorative circles/rings/
  triangles/dotted-squares in whitespace. `aria-hidden`, `pointer-events: none`,
  `float`/`spin` variants, `.no-low` to hide entirely under low motion.

## 6. Don'ts

- Don't add a profile photo. The site stays about the work.
- Don't introduce gradients beyond the one accent halo on the hero.
- Don't use the secondary palette (`--c-*`) for UI surfaces — accents,
  dots, and geo shapes only, never buttons/borders/backgrounds/large fills.
- Don't add more than ~24 skills to the reel — past that it's decoration,
  not communication.
- Don't emoji. The accent color is the only loud thing on the page.
- Don't ship placeholder endorsements or invented metrics as if they were
  real — see the copy rules above.
