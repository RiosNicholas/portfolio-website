# DESIGN.md — Nicholas Rios · Portfolio

Design direction and token reference for the portfolio site. Implementation
lives in `src/styles/globals.css` (Tailwind v4 + OKLCH tokens) and
`src/components/`; see `README.md` for the file map and where content lives.

---

## 1. Direction

Clean and minimal, with some flair. It should read as a frontend engineer's
site, not a template. Every page opens on a full-width hero band with a
live ASCII field; below it, flat zinc surfaces, one typeface, rounded cards
and pill buttons. Blue is the brand. Amber shows up only in the hero.

The site used to be maximalist (graph-paper grid, floating geometric
shapes, marker highlights, a swappable accent, yellow CTAs, monospace
labels). All of that is gone. Don't bring it back.

Primary goal: sell frontend engineering — web apps, component libraries,
developer tools, and agentic AI tooling (agents, tools, MCPs, chat). Voice:
confident, plain-spoken, dry wit allowed.

## 2. Copy rules

- Headlines are plain sentences. No highlighted or marked-up words.
- Numbers: show them when real. Don't invent metrics. The seeded
  `CaseStudy` stats and `Endorsement` quotes are real (see README.md
  "Content & admin").
- No gerunds as sentence-starting nouns ("Building", "Shipping"). Lead with
  a verb or a statement.
- Avoid clichés: "passionate", "drives results", "craft at scale". Don't
  describe the work as "UI platforms" in the hero.
- "resume", no accents.
- Emphasis in running text is plain italic (`<em>`); key terms can carry
  `font-semibold text-ink` against muted surrounding text (see the Status
  cell).

## 3. Tokens (`src/styles/globals.css`)

All colours are OKLCH. Nothing invents a colour: every value is a Tailwind
swatch or a `color-mix` of two tokens. Three layers, each referencing only
the one below it:

1. **Primitives** — Tailwind's own scales (`--color-zinc-*`,
   `--color-blue-*`, `--color-amber-*`).
2. **Mode scale** — numbered steps that pick a swatch per theme
   (`--neutral-1` page … `--neutral-12` strongest text, plus `--blue-*` and
   `--amber-*` roles). Dark mode only redefines this layer.
3. **Semantic** — names a job and points at a step. Components use only
   these, through utilities registered in `@theme inline`.

| Semantic token     | Utility                | Light                | Dark                          |
|--------------------|------------------------|----------------------|-------------------------------|
| `--ground`         | `bg-ground`            | zinc-50              | zinc-950                      |
| `--surface`        | `bg-surface`           | zinc-100             | zinc-900                      |
| `--surface-hover`  | `bg-surface-hover`     | zinc-200             | zinc-800                      |
| `--surface-raised` | `bg-surface-raised`    | white                | zinc-800                      |
| `--ink`            | `text-ink`             | zinc-950             | zinc-100                      |
| `--ink-muted`      | `text-ink-muted`       | zinc-600             | zinc-400                      |
| `--brand`          | `bg-brand`             | blue-600             | blue-500                      |
| `--brand-hover`    | `bg-brand-hover`       | blue-700             | blue-400                      |
| `--brand-strong`   | `text-brand-strong`    | blue-700             | blue-300                      |
| `--brand-soft`     | `bg-brand-soft`        | blue-100             | blue-950                      |
| `--on-brand`       | `text-on-brand`        | white                | white                         |
| `--hero`           | `bg-hero`              | blue-700             | zinc-950 → 900, 25% mix       |
| `--hero-ink`       | `text-hero-ink`        | white                | zinc-100                      |
| `--hero-muted`     | `text-hero-muted`      | blue-100             | zinc-400                      |
| `--hero-subtle`    | `text-hero-subtle`     | blue-200             | slate-400                     |
| `--hero-glyph`     | (canvas only)          | blue-300             | blue-400                      |
| `--pop`            | `bg-pop` / `text-pop`  | amber-300            | amber-300                     |
| `--pop-hover`      | `bg-pop-hover`         | amber-200            | amber-200                     |
| `--pop-ink`        | `text-pop-ink`         | zinc-950             | zinc-950                      |
| `--focus`          | (focus ring)           | blue-600             | blue-500                      |

**Colour roles** — blue is the brand mark and anything interactive. Amber
(`pop`) is the hero's rotating phrase, its button, and the ASCII pointer
lens, nowhere else. In dark mode the hero is charcoal barely lifted off the
page, not a blue slab; the blue lives in the glyphs.

**Legacy aliases** — `--paper*`, `--ink-2/3/4`, `--accent*`, `--cta-*`,
`--frosted*`, `--border*` and `--shadow-*` still exist, mapped onto the
semantic tokens, for `/admin`, the login page, the OG image and shadcn
primitives. Don't use them in public pages.

**Type** — one typeface: Schibsted Grotesk (`next/font`, `--font-schibsted`)
for display, headings and body. Mono is the system stack, rarely used.
Public pages use a five-step scale and nothing in between (admin keeps
Tailwind's defaults):

| Utility          | Size                               | Used for                          |
|------------------|------------------------------------|-----------------------------------|
| `text-display`   | `clamp(2rem, …, 7.5rem)`, lh 0.95  | page hero headlines, Experience number |
| `text-title`     | `clamp(2rem, …, 4rem)`, lh 1       | section headings, case study titles |
| `text-statement` | `clamp(1.5rem, …, 2.25rem)`, lh 1.2| hero subcopy, bento values, About headings |
| `text-lead`      | 1.25rem, lh 1.5                    | intro paragraphs, case descriptions |
| `text-body`      | 1.0625rem, lh 1.55                 | everything else                   |

Headlines are `font-semibold` with tight negative tracking baked into the
scale.

**Radii** — cards and media are `rounded-3xl`; buttons, chips and avatars
are `rounded-full`. The `--r-*` vars are legacy.

**Shadows** — none on public pages. Depth comes from surface steps and a
small `hover:-translate-y-1` on cards.

**Layout** — `.shell` is the page container: max 1440px, gutter
`clamp(20px, 4vw, 64px)`. Sections are spaced with `pt-24 md:pt-40` (or
`pt-32 md:pt-48` for endorsements and contact). Two-column layouts use a
12-col grid at `lg` (5 + 7 or 6 + 6). Mobile first, always.

**Theme** — follows OS `prefers-color-scheme` on first load, toggled via
`src/components/theme/theme-toggle.tsx`, persisted to `localStorage`.
`ThemeInitScript` sets `data-theme` and `data-motion` on `<html>` before
paint so there's no flash of the wrong theme. The `dark:` variant keys off
`[data-theme="dark"]`.

## 4. Motion

`useAnimationsEnabled()` (`src/lib/use-animations-enabled.ts`) is the
single gate for all `motion`-driven animation — `false` when OS
`prefers-reduced-motion: reduce` is set or `data-motion="low"` is on
`<html>`. Every animated component must render a complete, non-animated
resting state when it's `false` — see
`.claude/instructions/animation-accessibility.md` for the pattern.

- **Reveal** (`ui/reveal.tsx`) — fade + 18px rise on scroll, only for
  elements that start below the fold. Server HTML always ships visible.
- **Word rise** (`.word-rise`, `RisingWords`) — pure-CSS word-by-word
  entrance on hero headlines, staggered 90ms. Off under reduced motion.
- **Rotating phrase** — swaps every 2.4s (last phrase holds 3.6s); frozen
  on a complete phrase under reduced motion.
- **Motion fallback** (`.motion-fallback`) — content that only shows when
  motion is reduced, e.g. the hero description that stands in for the
  rotating line.
- **Marquee** — CSS keyframes (`animate-marquee-vertical`), not `motion`,
  so it can pause and resume in place. Degrades to a static, scrollable
  list when motion is off.

Plain CSS animations are throttled via `:root[data-motion="low"] *` and the
`prefers-reduced-motion` block in `globals.css`. Easing is
`cubic-bezier(0.2, 0.7, 0.2, 1)` throughout.

## 5. Signature components

- **Hero field** (`layout/hero-field.tsx` + `ui/ascii-field.tsx`) — the
  full-width band every page opens on. A canvas draws a drifting ASCII wave
  (` .·:-=+*#%@`) in `--hero-glyph`, with an amber lens that follows the
  pointer. 30fps from a pre-rendered glyph atlas, paused off-screen; one
  still frame under reduced motion. Inner pages share `pageHeroClass` so
  every hero is the same height.
- **Home hero** (`HeroSection`) — one sentence across four lines:
  *Software Engineer / building / [rotating phrase] / @JPMorganChase.* The
  phrase is amber, the employer line is `hero-subtle`, and the only button
  is a `pop` "See my experience" linking to About.
- **At a glance** (`BentoGrid`) — 6-col grid of `bg-surface` cards that
  share one label/value rhythm (muted label on top, value in
  `text-statement` below). Cells: Based in (with a `cobe` globe peeking off
  the corner), Experience (`NumberTicker`), Status, Skills (vertical
  marquee), Favorite tools (pill chips on `surface-raised`), Currently,
  Languages. Skills, tools and languages come from the database, edited via
  `/admin`.
- **Endorsements** (`Endorsements` + `TestimonialCard`) — up to three
  static cards: quote first, then avatar, name (links to LinkedIn) and
  role. A three-column grid at `lg`; below that, a swipeable snap row with
  the next card peeking in.
- **Case studies** (`CaseStudy`) — on `/projects`, one per row: optional
  large screenshot, then a 5 + 7 split with title/role/org/year on the left
  and the description, one key stat and a muted "Built with …" line on the
  right.
- **Buttons** (`ui/button-link.tsx`) — the site's one button, `rounded-full`
  and `h-12`. Variants: `primary` (brand), `secondary` (surface), `pop`
  (amber, hero only), `on-hero` (translucent white). External links get an
  up-right arrow that nudges on hover. Inline links use `textLinkClass`: a
  2px brand-coloured underline.
- **Nav** (`SiteNav`) — wordmark with a small blue square that rotates on
  hover, then **About · Projects** and the theme toggle. The current page
  gets a brand underline.
- **Contact + footer** (`ContactCta`, `SiteFooter`) — "Let's build
  something good." with LinkedIn and email; the footer is one centred
  muted line: © 2026 Nicholas Rios · New York City Metropolitan Area.
- **Custom cursor** (`CustomCursor`) — dot + spring-follow ring, states for
  link/text/photo hover. Only takes over (`data-custom-cursor="on"`) once
  it confirms a real pointer device and has mounted.

## 6. Don'ts

- Don't bring back the old system: no graph-paper grid, geometric shapes,
  marker highlights, swappable accents, yellow CTAs or monospace labels.
- Don't use amber outside the hero, and don't add a third accent colour.
- Don't hard-code colours or reach for Tailwind palette classes in
  components — use the semantic utilities.
- Don't add type sizes outside the five-step scale on public pages.
- Don't add gradients or drop shadows. The only gradient is the fade mask
  on the skills marquee.
- Don't add a profile photo. The site stays about the work.
- Don't add stand-in images. `src/lib/media.ts` stays empty until there's a
  real photo or screenshot.
- Don't add more than ~24 skills to the reel — past that it's decoration,
  not communication.
- Don't use emoji.
- Don't duplicate links or accents within a section.
- Don't ship placeholder endorsements or invented metrics as if they were
  real.
