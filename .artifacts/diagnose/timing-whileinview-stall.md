# DIAGNOSE — TIMING result panel `whileInView` stall

**Stage:** DIAGNOSE (read-only, no code changes)
**Status:** Root cause identified with high confidence. **Not fixed.**
**Depends on:** `.artifacts/audit/timing-postfix-audit.md` (evidence)

## What FASE 3A's "fix" actually covered

`git diff app/timing/page.tsx` shows exactly one converted element
(`favorableDimensions`, `whileInView` → `animate`). Every other motion
element inside the result panel — the main container (`ReadingNumber`'s
parent), `challengingDimensions`, the recommendation block, caveats, the
`MolinoInterpretation` wrapper, the `bestDates` wrapper and its mapped
cards, and the button row — **still uses `whileInView` +
`viewport={{ once: true }}`**. FASE 3A's earlier closure record described
this as resolving "the freeze issue" in general terms; the evidence in
this audit shows it resolved it for exactly one of nine affected elements.

## Root cause

All of the still-failing elements share the same shape:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, delay: ... }}
>
```

They are children of `{result && showResults && (...)}` — a block that
mounts as a result of a **client-side state change** (the user picks an
intention, then changes the date, which sets `showResults = true`). This
is fundamentally different from the normal `whileInView` use case: content
appearing as the page loads and the user scrolls down through it.

`whileInView` is implemented on top of `IntersectionObserver`. When an
element that uses it is inserted into the DOM **already positioned inside
the current viewport** (no scroll happens, because the user didn't
scroll — they clicked a button and used the keyboard to change a date),
the observer's initial callback does not reliably fire in this app/browser
combination. The audit's evidence shows this is not just "slow to start":

- In dev, most stuck elements never get a `getAnimations()` entry at
  all (`animCount: 0`) — Framer Motion never started the animation, i.e.
  the intersection callback never fired.
- In production, one element (the result container) **did** get an
  `Animation` object, reporting `playState: "running"`, but its
  `currentTime` was measured identical across a 4-second window while the
  page's timeline clock kept advancing — a genuine stuck/desynced Web
  Animation, not merely "hasn't started yet."
- In dev, another element (`favorableDimensions` before being scrolled)
  showed a **negative** `currentTime`, another signature of an animation
  whose clock never validly started relative to its `delay`.

In every case, the *only* thing that reliably unblocks the stuck
element is a genuine scroll **event** — not the element merely being
present within the viewport's bounding box (confirmed: an element
positioned well within the 812px-tall viewport, per
`getBoundingClientRect()`, remained stuck at `opacity: 0` for a full
second after settling, and only resolved once an actual `scroll` event
fired). This matches a known class of `IntersectionObserver` behavior:
some observer implementations only evaluate newly-observed targets on
their *next* recalculation pass, which for `once: true` viewport
detection can require a triggering event (scroll, resize, or a forced
layout) rather than firing purely from the element's insertion into the
DOM.

## Why the one converted element (`favorableDimensions`) still showed a
negative `currentTime` in dev

Converting `whileInView` → `animate` removes the `IntersectionObserver`
dependency entirely — the animation should start unconditionally on
mount. The negative `currentTime` observed for this element in the dev
run is a separate, narrower anomaly worth flagging for whoever picks up
PLAN/IMPLEMENT next: it may be an artifact of the animation's `delay`
(`0.2s`) combined with how the browser reports `currentTime` for an
animation captured a few milliseconds after its `startTime` was
scheduled but before the delay has elapsed (a *negative* `currentTime`
during the delay phase is actually valid, documented WAAPI behavior —
Chrome can report `currentTime` as negative before playback formally
begins if measured relative to a `startTime` in the future). This is
**not** the same failure as the `whileInView` stall on the other
elements — it did not require a scroll to resolve in the audit's
timeline (its final resolved state, `opacity: 1`, was confirmed once the
page was scrolled for other reasons, but this element's own transition
appears to complete correctly without an unbounded stall, unlike its
siblings). Flagged for completeness, not presented as a second bug of the
same severity.

## Root cause statement (single sentence)

**`whileInView` + `viewport={{ once: true }}`, applied to content that
mounts via a client-side state change rather than page-load scroll, does
not reliably trigger its `IntersectionObserver` callback in this app —
leaving the element permanently at `opacity: 0` (or, in one observed
production case, permanently stuck mid-transition) until an unrelated
scroll event forces a re-evaluation — and this affects 8 of the 9 motion
elements inside the TIMING result panel, all of which still use
`whileInView` after FASE 3A's fix, which only converted one.**

## VERIFIED / NOT VERIFIED / NOT APPLICABLE

- **VERIFIED** — root cause mechanism, via direct `getAnimations()` /
  `currentTime` / `playState` evidence in both dev and production (see
  `audit/timing-postfix-audit.md`).
- **VERIFIED** — the fix scope gap: only 1 of 9 `whileInView` occurrences
  in the result panel was converted by FASE 3A.
- **NOT VERIFIED** — behavior on mobile/narrow viewports (tool
  limitation, not a claim either way).
- **NOT APPLICABLE** — no alternative root cause (state-management bug,
  console exception, missing profile/data, network issue) was found; the
  business logic (`ReadingNumber`'s value, `MolinoInterpretation`'s
  content) computes and renders correctly — it is purely an
  animation-trigger problem, confirmed by the fact that scrolling reveals
  fully correct, fully computed content instantly.

## Explicitly NOT done in this stage

No code was modified. `app/timing/page.tsx` and
`components/ui/MolinoInterpretation.tsx` were read-only for this task. No
`AnimatePresence`, `motion`, engine, or dependency was touched. No test
files were modified.
