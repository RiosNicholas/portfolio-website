# DESIGN.md — Nicholas Rios · Portfolio

A handover spec for the portfolio site. Covers aesthetic, tokens, structure,
components, and the rules the site plays by.

---

## 1. Direction

**Streamtime-inspired warm paper with bold accent pops.** Soft warm cream
paper (light) or warm espresso (dark) with a low-contrast graph-paper grid
running edge to edge. Confident display type (Schibsted Grotesk), hot-pink
accent by default with swappable cobalt/lime/grape variants, geometric shapes
(rings, triangles, dots) floating in whitespace, marker-highlight emphasis on
one word per headline, yellow CTA buttons.

Primary goal: sell technical skills in UI + platform engineering. Clean,
minimal, no filler. Voice: confident, plain-spoken, dry wit allowed.

---

## 2. File map

```
index.html           · Home (hero · bento · work teaser · marquee · contact)
work.html            · Full case studies (04 projects)
about.html           · Bio + CV

styles/
  tokens.css         · Colors, type, radii, shadows, theme + accent variants, motion flag
  base.css           · Reset, shell, cursor, grid ambience, grain, reveals, geo shapes
  components.css     · Everything else (nav, bento, cards, marquee, tweaks, etc.)

scripts/
  cursor.js          · Dot + ring custom cursor (hover states: link, text)
  paper.js           · Cursor-reactive warm highlight over grid
  reveal.js          · IntersectionObserver for .reveal; years counter; smooth anchors
  tweaks.js          · Theme / accent / grid / motion toggles + localStorage + auto light/dark
```

Shared chrome (top nav, tweaks panel) is duplicated across the three HTML
pages on purpose — no build step, easy to edit.

---

## 3. Tokens (`styles/tokens.css`)

### Color — light (warm cream paper)
| Token              | Value                       | Use                              |
|--------------------|-----------------------------|-----------------------------------|
| `--paper`          | `#efe7d8`                   | Page background                   |
| `--paper-2`        | `#fbf7ef`                   | Cards, cells, endorsements        |
| `--paper-3`        | `#e6dac6`                   | Raised surfaces                   |
| `--ink`            | `#2a2520`                   | Primary text (charcoal)           |
| `--ink-2`          | `#4a433b`                   | Secondary text                    |
| `--ink-3`          | `#847b6e`                   | Tertiary / meta                   |
| `--ink-4`          | `#aa9f8d`                   | Disabled / footer                 |
| `--border`         | `rgba(42,37,32,0.13)`       | Hairlines                         |
| `--border-2`       | `rgba(42,37,32,0.22)`       | Stronger hairlines                |

### Color — dark (warm espresso)
`--paper: #1a1714`, `--paper-2: #241f1a`, `--paper-3: #2e2820`. Ink inverts
to warm off-white `#f3ece0`. Grain uses `screen` blend mode. Borders lighten
to maintain contrast. **Never cold black** — always warm espresso.

### Accent (default = pink, swappable)
| Token              | Default (pink)    | Use                              |
|--------------------|--------------------|-----------------------------------|
| `--accent`         | `#ff4dd5`          | Fills, markers, shapes           |
| `--accent-text`    | `#b81e94` (light)  | Readable text color on accent    |
|                    | `#ff8ae0` (dark)   | …on dark theme                   |
| `--accent-glow`    | `rgba(255,77,213,0.20)` | Soft halo behind shapes          |
| `--accent-glow-2`  | `rgba(255,77,213,0.34)` | Stronger glow (hover)            |
| `--marker-ink`     | `#2a0a22`          | Text sitting on marker block     |
| `--cta-bg`         | `#ffde3b`          | Yellow CTA button fill           |
| `--cta-bg-hover`   | `#f2ce1f`          | CTA hover                        |
| `--cta-ink`        | `#1a1206`          | CTA text (dark)                  |

### Secondary palette (geometric accents)
| Token       | Value     | Use                                    |
|-------------|-----------|----------------------------------------|
| `--c-pink`  | `#ff4dd5` | Default accent (also in geo shapes)    |
| `--c-lime`  | `#c1f32b` | Status dots, geo shapes                |
| `--c-cobalt`| `#6483ff` | Geo shapes, rings                      |
| `--c-grape` | `#7a3dff` | Geo shapes, dotted squares             |
| `--c-yellow`| `#ffde3b` | CTA buttons, geo shapes                |
| `--c-clay`  | `#d2691e` | Warm accent alternative (unused)       |

### Accent swaps (via `data-accent` on `<html>`)
- `pink`    — `#ff4dd5` *(default, streamtime signature)*
- `cobalt`  — `#6483ff`
- `lime`    — `#c1f32b`
- `grape`   — `#7a3dff`

Each swap includes a readable text variant (deeper on light, lighter on
dark) and a glow that coordinates with the fill.

### Type
- **Display** — `Schibsted Grotesk`, weight 600, letter-spacing **−0.04em**.
  Used for hero, section titles, bento values, case titles. `<em>` becomes
  a tilted marker block: `background: var(--accent); color: var(--marker-ink);
  padding: 0.01em 0.16em; border-radius: 6px; transform: rotate(-1.4deg)`.
- **Body** — `Hanken Grotesk`, 400/500, tracking **−0.005em**. Readable on
  warm backgrounds. Use for body copy, nav, UI labels, endorsements.
- **Mono** — `JetBrains Mono` for meta/labels/CV years. 11–13px. No uppercase
  tracking.

### Radii
`--r-sm 4 / --r-md 6 / --r-lg 10 / --r-xl 16 / --r-pill 999`. Cards use
`--r-lg`, buttons/chips use `--r-pill`.

### Shadows (warm drop shadows, no neon rings)
- `--shadow-card`  — subtle card lift
- `--shadow-pop`   — hover elevation (1–4px)
- `--shadow-hard`  — strong depth (case studies, modals)
- `--shadow-float` — frosted panels (nav, tweaks)

### Motion
`data-motion="low"` on `<html>` collapses all animation durations to ~0 and
hides `.no-low` nodes. Respect `prefers-reduced-motion: reduce`.

### Grid (paper background)
`.paper-bg` is a **two-layer graph-paper grid** that tiles the entire viewport
(no mask — the grid runs edge to edge, like a real notebook):

- **Minor lines** every `28px` at `--grid-minor` opacity
- **Major lines** every `140px` (5×28) at `--grid-major` opacity

Light theme uses charcoal lines (`rgba(42,37,32,0.055)` minor,
`rgba(42,37,32,0.10)` major). Dark theme uses warm-white lines. Behind the
hero on every page, `.paper-bg::after` paints a single soft accent halo so
the grid feels lit from above.

`data-grid` = `on` / `subtle` / `off` toggles `.paper-bg` opacity (`1` /
`0.5` / `0`). Defaults to `subtle`.

### Theme (light/dark auto-detect)
On first load, `theme` defaults to the OS preference (`prefers-color-scheme`).
User can toggle via the sun/moon button in the top nav; choice persists in
`localStorage`. The tweaks panel also exposes `theme: "auto" | "light" | "dark"`.

---

## 4. Page structure

Each page is:

```
<body>
  <div class="paper-bg"></div>     · ambient grid + accent halo
  <div class="grain"></div>         · subtle noise overlay
  <nav class="nav">…</nav>          · top bar: brand (left) + nav menu (center)
                                     + tweaks/theme toggle (right)
  <main class="shell">
    <section class="hero-min">…     · page hero (shorter on sub-pages)
    …page sections…
    <section class="contact-strip">…· shared close-out
  </main>
  <aside class="tweaks">…</aside>   · floating panel, hidden by default
</body>
```

`main.shell` is `max-width: 1280px` with fluid side padding
`clamp(24px, 4vw, 64px)`.

---

## 5. Top nav (`.nav`)

Horizontal bar, edge-to-edge, frosted backdrop. Layout:
- **Left**: `.mark` = brand glyph (rotating square, accent color) + name
- **Center**: `.nav-menu` = links (Home / Work / About / Contact)
- **Right**: `.nav-tools` = tweaks toggle (`✱`) + theme toggle (sun/moon SVG)

Active link gets a filled pill background (charcoal on light, off-white on
dark) with a leading accent dot. On narrow screens (≤640px) the brand name
collapses to just the glyph.

---

## 6. Signature components

### Bento (`.bento > .cell`)
6-column grid, `168px` auto rows, `12px` gap. Cells span with
`c-1-2` / `c-1-3` / `c-1-4` / `c-1-6` and rows with `r-1-2`. Anatomy:

```
.cell
  .label        (tiny caps, accent color, dot prefix)
  .v            (big display number / word)
  .sub          (mono micro line)
```

Specialized variants:
- `.cell-location` — grid background + animated accent pin + ripple
- `.cell-years` — oversized number, `data-count` + `data-sup="yrs"` triggers
  counter on scroll
- `.cell-status` — pulsing lime dot + availability line
- `.cell-skills` — vertical marquee, 24-row reel; duplicate `innerHTML` at
  runtime for seamless loop
- `.cell-stack` — chip cloud of tools (frosted pills)
- `.cell-now` — current projects (strong words use `<strong>`)

### Work list (`.case-row`)
Grid of `60px 1fr auto 24px`. Title, role label, year, arrow. On hover,
title color shifts to accent and the arrow slides 8px right. Used on home
for a teaser (3 rows + "view all" CTA).

### Case full (`.case-full`)
Two-column (1 : 2) block per project: left rail (num, title, meta), right
(paragraph, tag chips, 3-up stats). Hairlines separate entries. Use on
`work.html`.

### Endorsement marquee (`.marquee-wrap > .marquee`)
Two rows, one forward (80s) one reverse (70s). JS duplicates `innerHTML`
once for a seamless loop. Pause on hover. Cards (`.endorse`) are frosted
with subtle shadows; quote + 1-line attribution with small avatar disc.

### Contact strip (`.contact-strip`)
Oversized display headline with one tilted accent marker, email as a big
linked word (underlined in accent), social pill links on the right, footer
beneath. Shared across all pages.

**Social pills** — `.socials a` is a frosted pill with an inline SVG icon
(16px, `currentColor`) and a label. Icons live inline in the markup (not
in a sprite) and are sized by the `.ic` wrapper. On hover the pill border
and icon both swap to accent. Icon set: LinkedIn, GitHub, Instagram,
Read.cv, Are.na, X/Twitter, Dribbble, Email.

### Tweaks panel (`.tweaks`)
Floating panel, top-right above the main content. Toggled from the nav's `✱`
button or from the host edit-mode toggle. Lives behind
`/*EDITMODE-BEGIN*/{…}/*EDITMODE-END*/` in markup so changes persist on save.
Exposed keys: `theme` (auto/light/dark), `accent` (pink/cobalt/lime/grape),
`motion` (high/low), `grid` (on/subtle/off).

### Geometric shapes (`.geo`)
Decorative elements scattered in whitespace: circles (`.geo-circle`), rings
(`.geo-ring`), triangles (`.geo-tri`), squares (`.geo-square`), and dotted
grids (`.geo-dotsq`). Animated with `.float` (gentle vertical bob) or `.spin`
(360° rotation). Use `color:` to colorize (inherits from `--c-*` tokens).
Always set `pointer-events: none` and `aria-hidden="true"`. Optional
`--geo-rot` CSS var for initial tilt.

---

## 7. Interaction rules

- **Custom cursor** is subtle but present. Dot + ring + occasional trail.
  States: `hover-link` (enlarged ring), `hover-text` (I-beam). Fall back to
  system cursor on touch devices.
- **Reveals** — use `class="reveal"` on any section block. IntersectionObserver
  adds `.in` at 12% visibility; optional `data-delay="120"` staggers.
- **Years counter** — `data-count="10" data-sup="yrs"` on any element with a
  child `.v` counts up on first intersection.
- **Active nav link** — matches current page filename; for in-page anchors
  (`#contact`) the scroll observer flips the class.
- **Hover ≠ tap.** On `pointer:coarse` devices the custom cursor and hover
  states are bypassed; keep label text in markup, not just on hover.

---

## 8. Copy rules

- Always one `<em>` per headline — never two, never zero. The marker
  highlight should land on a 1-word concept ("interface", "platform",
  "craft").
- Numbers: show them when real (years, subscribers, completion rate). Leave
  placeholders as-is until you have real metrics; don't invent.
- Endorsements are placeholder quotes. Replace with real ones (LinkedIn,
  friends, former managers) before going live.
- No gerunds as nouns ("Building", "Shipping") as sentence starters. Lead
  with a verb or a statement.
- Avoid clichés: "passionate", "drives results", "craft at scale".

---

## 9. Known placeholders / pre-launch TODOs

1. **Real projects** — `work.html` currently has placeholder projects. Swap
   for your actual case studies (role, year, description, 3-4 stats per
   project, tags).
2. **Real endorsements** — update quote blocks in `index.html` (marquee
   section). Name, role, one-line quote; avatar is two initials or a
   monogram.
3. **Metrics** — bento cells and case stats have plausible numbers. Confirm
   or replace per project and role.
4. **CV download** — the "Download full CV" CTA on `about.html` is a stub.
   Link a PDF or a real document.
5. **Email** — `hello@nicholasrios.co` is a placeholder. Swap for the real
   address.
6. **Social links** — all `<a href="#">` in footers and social sections need
   real URLs (LinkedIn, GitHub, Read.cv, etc.).
7. **OG / favicon** — not yet wired. Add `/favicon.svg` and update the `<meta>`
   tags if deploying.
8. **Location** — "Jersey City" is hardcoded across nav, hero bento, and
   footer. Update if you relocate.

---

## 10. Tweakable keys (edit mode)

```json
{
  "theme":  "auto" | "light" | "dark",
  "accent": "pink" | "cobalt" | "lime" | "grape",
  "motion": "high" | "low",
  "grid":   "on" | "subtle" | "off"
}
```

These read on boot from `window.__TWEAKS__`, then fall back to
`localStorage`, and persist via the tweaks script. The `theme: "auto"` mode
follows the OS preference.

---

## 11. Don'ts

- Don't add a profile photo of yourself. Site stays about the work.
- Don't introduce gradients except the one accent halo on the hero.
- Don't paint UI surfaces in the secondary colors. They're for accents on
  labels, dots, tag chips, and geo shapes — not buttons, borders,
  backgrounds, or large fills (except geo shapes and markers).
- Don't add more than ~24 skills to the reel. If it scrolls too fast it
  becomes decoration, not communication.
- Don't bump font sizes to fill space. If a block looks empty, cut it.
- Don't emoji. The accent color is the only loud thing on the page.
- Don't tilt or rotate text except the marker `<em>` highlight (which rotates
  −1.4°) and geo shapes. Readability first.
