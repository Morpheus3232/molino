# Browser QA — TIMING post-fix verification (`whileInView` → `animate`)

**Stage:** BROWSER QA (post-IMPLEMENT)
**Scope of fix tested:** `app/timing/page.tsx`, 8 elements converted from
`whileInView` to `animate` (panel header, result container, challenging
dimensions, recommendation, caveats, `MolinoInterpretation` wrapper,
`bestDates` wrapper + cards, button row). `favorableDimensions` was
already `animate` from FASE 3A. Intention grid intentionally left as
`whileInView` (out of approved scope).

**Result: MIXED. The original, cleanly-characterized bug (IntersectionObserver
never firing for state-mounted `whileInView` content) no longer reproduces
in its original form. A separate, still-unresolved WAAPI stall reproduces
in 2 of 3 clean dev trials and in the 1 production trial run.**

## Protocol

Identical to the pre-fix audit: fresh `rm -rf .next` + server restart
before each round, hard reload, `getAnimations()` / `currentTime` /
`playState` / computed `opacity` as evidence — never `innerText` or a
semantic search tool.

## Trial 1 — dev, clean restart

Panel and result-child-0/1 (favorableDimensions) resolved to `opacity: 1`
within ~2s **without any scroll** — this is the exact scenario that was
100% reliably stuck pre-fix. `result-child-2/3/4` (Recomendación,
Aclaraciones, `MolinoInterpretation`) remained at `opacity: 0`,
`animCount: 0` for 10+ seconds. A subsequent scroll did **not** resolve
them (unlike the pre-fix behavior, where scroll reliably unblocked
everything).

## Trial 2 — dev, full clean restart (`rm -rf .next`, fresh server, fresh navigation)

All 5 result-panel elements identically stuck: `opacity: 0`, `animCount: 1`,
`playState: "running"`, **`currentTime: -11917.7`** — identical value
across all 5 elements, unchanged across a further 3-second recheck. A
scroll event **did** resolve all 5 to `opacity: 1` this time.

## Trial 3 — dev, same server, second interaction cycle

Same pattern as Trial 2: all 5 elements, identical frozen
`currentTime: -28213.1`, `playState: "running"`, `opacity: 0`. Not
independently re-tested for scroll-recovery (already established in
Trial 2).

## Trial 4 — production (standalone server, fresh `rm -rf .next && next build`)

Same pattern: all 5 elements, identical frozen `currentTime: -11656.9`,
`playState: "running"`, `opacity: 0`, after 5 seconds with no scroll.

## Pattern observed

- The specific, deterministic pre-fix bug (never-started animation,
  `animCount: 0`, requiring geometric+event scroll to ever begin) is
  **not reproduced** for the elements that resolved quickly in Trial 1.
- A **different** failure mode now dominates (3 of 4 trials, both dev and
  prod): every result-panel element gets an `Animation` object
  (`animCount: 1`) with **identical negative `currentTime`** across all
  siblings, `playState: "running"`, permanently not advancing until an
  external scroll event. This is not gated by `whileInView`/
  `IntersectionObserver` at all anymore (these elements are `animate`
  now) — so removing the observer dependency did not eliminate the
  stall, it changed its shape.
- The identical `currentTime` value shared by every sibling animation in
  the stuck trials suggests a single shared clock reference (likely the
  document's animation timeline, or a batched WAAPI scheduling call for
  all animations starting in the same React commit) that itself is not
  advancing correctly, independent of which Framer Motion trigger
  (`whileInView` or `animate`) requested the animation.

## Console

Clean in every trial, dev and prod — zero application errors.

## Regression

Not exhaustively re-checked in this round (already verified working
pre-implementation, and this fix did not touch `HOY`, `DECISIONES`,
`HOME`, or `MolinoInterpretation.tsx`'s own code).

## Verdict against the approved PASS criteria

| Criterion | Result |
|---|---|
| All elements reach final visual state | **NOT MET** — reproduces stuck at `opacity: 0` in 3 of 4 trials |
| No element left at `opacity: 0` | **NOT MET** |
| No `playState: "running"` with frozen `currentTime` | **NOT MET** — reproduced with a clearer, more identical signature than pre-fix |
| Timeline progresses normally | **NOT MET** in stuck trials |
| Works without scroll | **NOT MET** in stuck trials |
| No console errors | **MET** |
| Dev and prod show same behavior | **MET** — both show the same residual pattern |
| Stagger completes correctly | **NOT MET** in stuck trials |

**Per Gate 1 instructions, this is reported as a new finding. No second,
improvised code change was made.**
