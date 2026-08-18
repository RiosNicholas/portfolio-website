"use client";

import { useContext } from "react";

import { AnimationsEnabledContext } from "~/components/ui/motion-provider";

/**
 * Single source of truth for "should rich motion play."
 *
 * Returns `false` when the user prefers reduced motion OR the site's
 * `data-motion="low"` setting is active; `true` otherwise. Framer Motion
 * animates via JS, so the existing `:root[data-motion="low"] * { … }` CSS
 * throttle does not affect it — every migrated animation must route through
 * this hook instead.
 *
 * Reads from `AnimationsEnabledContext`, provided once by `MotionProvider`
 * (which already wraps the whole tree) — this used to create its own
 * `matchMedia` listener and `MutationObserver` per call site (20+ per page);
 * now there's a single shared subscription.
 *
 * Hydration-safe: the context is seeded `true` (matching the server's
 * "assume motion is on" render) and only corrected in an effect, never
 * during render. Name, signature, and the `true` seed are unchanged — don't
 * touch either, call sites depend on this exact contract.
 */
export function useAnimationsEnabled(): boolean {
	return useContext(AnimationsEnabledContext);
}
