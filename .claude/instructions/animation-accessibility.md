# Animation Accessibility

Every `motion`-driven component in this codebase reads
`useAnimationsEnabled()` and must render a **resting state that shows the
same content** as the animated state — never a state that only becomes
correct once the animation has run. `useAnimationsEnabled()` returns
`true` when `prefers-reduced-motion: reduce` is set (OS) or
`data-motion="low"` is active (site toggle); it's the single gate for both.

## The pattern

Read the hook, branch, and render a static-but-complete version when
`false`:

```tsx
// status-dot.tsx
const enabled = useAnimationsEnabled();

if (!enabled) {
  return <m.span className={cn(BASE_CLASS, className)} />;
}

return (
  <m.span
    animate={{ opacity: [1, 0.5, 1] }}
    className={cn(BASE_CLASS, className)}
    transition={{ duration: 2, ease: [0.4, 0, 0.6, 1], repeat: Infinity }}
  />
);
```

`geo-decoration.tsx` follows the same early-return shape — the disabled
branch renders the shape at its base rotation instead of skipping the
render.

Two variations on the same idea, for cases where an early return doesn't
fit:

- **`reveal.tsx`** — defaults to the `show` variant and only "arms" into
  the `hidden` state (to animate back in on scroll) when the element
  starts off-screen *and* animations are enabled. Content is never hidden
  by default; the hidden state is opt-in and gated by the same flag.
- **`number-ticker.tsx`** — no branch on what renders, only on what the
  effect does: `count.set(value)` jumps straight to the final number
  instead of animating toward it.

## Worked example: the marquee bug

`marquee.tsx` used to rely entirely on the animation `transform` to
*position* content — the track sat at `0%` and the animation moved it
sideways/up to reveal the rest. When `enabled` was `false`, the effect
returned early without ever calling `animate()`, so the track stayed at
`0%` while the parent kept `overflow-hidden`. Everything past the first
screenful was present in the DOM but permanently invisible and
unreachable.

The fix: when disabled, the marquee becomes a **user-scrollable
container** instead of an animated one, not a static one.

- Parent `overflow-hidden` becomes `overflow-y-auto`/`overflow-x-auto`
  (matching the marquee's axis) instead of trying to render everything
  statically in place.
- Render exactly **one** copy of the content, not the `repeat` copies used
  to make the animated loop seamless — a screen reader (or a scrolling
  user) shouldn't encounter the same list twice.
- The scroll container gets `tabIndex={0}` and `role="group"` plus an
  `aria-label` from the consumer, since a scrollable non-native element
  isn't reliably keyboard-focusable across browsers otherwise (WCAG
  2.1.1).
- Any leftover `transform` from a previous animated run must be reset
  explicitly (`animate(track, { x: "0%", y: "0%" }, { duration: 0 })`)
  after stopping the animation controls — if the motion preference flips
  at runtime rather than on load, the track can otherwise open pre-offset
  and clip content from the other end.
- Fade/mask gradients applied by a *consumer* (e.g. `bento-grid.tsx`'s
  skills cell, `endorsement-marquee.tsx`) exist to hide the seam of an
  infinitely animated loop. In the scrollable state they instead
  permanently fade out whatever content happens to sit at the scroll
  container's edges — drop them when `enabled` is `false`.

## Checklist for new animated components

- [ ] Content is fully visible and readable with the animation disabled —
      not just "eventually" visible once a transform completes.
- [ ] Nothing is clipped by a parent's `overflow-hidden` in the disabled
      state.
- [ ] If the disabled state is scrollable, it's keyboard-reachable
      (`tabIndex`, `role`, and an accessible name).
- [ ] No content is duplicated for assistive tech in the disabled state.
- [ ] Verified under both `prefers-reduced-motion: reduce` (OS-level) and
      `data-motion="low"` (site toggle) — they're independent code paths
      into the same `useAnimationsEnabled()` context.
- [ ] Verified after a **runtime** preference flip, not just on initial
      load — stopped animations can leave inline styles/transforms behind
      that a resting state must not depend on being absent.

## The immutable contract

`useAnimationsEnabled()` always returns a plain `boolean`, and its context
is seeded `true` so server-rendered HTML matches the animated branch.
Every consumer's disabled state must be reachable by changing only
props/classes on the *same* element tree the server already rendered —
never a different element tree — or client hydration breaks.
