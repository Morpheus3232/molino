# Reproduction — TIMING residual stall (root-cause investigation)

**Stage:** DIAGNOSE
**Status:** Root cause determined — **Conclusion C** (environment
artifact), with a precise mechanistic explanation. No code was modified
to reach this conclusion.

## Two protocols, deliberately compared head-to-head

### Protocol 1 — "contaminated" session (this session's Chrome-in-Claude extension tab)

- Tab `958319459`, open and in continuous use for this entire multi-hour
  investigation (HOME fix, TIMING fix, and this diagnosis).
- The `claude-in-chrome` extension injects content scripts into every
  page load, continuously reads the accessibility tree, renders an
  overlay badge, and responds to dozens of `computer`/`javascript_tool`
  calls per minute throughout the session.
- Protocol: `Cmd+Shift+R` hard reload → click intention card → click date
  input → `ArrowUp` → poll `getAnimations()`.

### Protocol 2 — clean, isolated context (Playwright, zero extensions)

- Script: `probe-clean-context.mjs` (kept entirely outside the repository,
  in the session scratchpad — **not added to the project, not committed,
  not part of `e2e/`**).
- Launches a **brand-new Chromium process** via Playwright for every
  single trial (`chromium.launch()` + `context.newPage()`), no extensions,
  no prior navigation history, no shared state between trials.
- Seeds `localStorage` with the exact same profile object used throughout
  this investigation (`molino.user-profile.v1`, copied verbatim from the
  Chrome-extension tab) via `context.addInitScript`, so the app behaves
  identically — same profile, same computed `result`, same number of
  motion elements.
- Identical interaction: navigate → wait for the intention grid → click
  "Iniciar un proyecto" → click the date input → `ArrowUp` → poll
  `getAnimations()` at 100ms / 1000ms / 2000ms / 5000ms, then a scroll
  test.
- Run with: `node probe-clean-context.mjs <baseUrl> <trialCount>`.

## Results

| Protocol | Environment | Trials | Stalls observed |
|---|---|---|---|
| 1 (extension tab) | dev | 4+ (across this and the prior IMPLEMENT session) | **Reproduced in the large majority** — either partial (2-3 elements) or total (all 5), always with the signature `playState: "running"`, `currentTime` frozen |
| 1 (extension tab) | prod (standalone) | 2 | **Reproduced both times**, same signature |
| 2 (clean Playwright) | dev | **5** | **0 stalls.** Every element: `animCount: 1` at t=100ms (animation actively running), `opacity: 1, animCount: 0` (finished and removed) by t=1000ms, stable through t=5000ms |
| 2 (clean Playwright) | prod (standalone) | **5** | **0 stalls.** Identical clean pattern to dev |
| 2 (clean Playwright, 4 concurrent processes — CPU contention, still zero extensions) | dev | 3 of 4 completed (1 hit an unrelated Playwright actionability timeout, not a WAAPI stall) | **0 permanent stalls.** One element in one trial was still at `opacity: 0.999981` at t=1000ms (i.e., ~99.998% done, just slightly slower under 4x concurrent load) but fully resolved to `1` by t=2000ms — bounded slowdown, not a freeze |

**10 out of 10 trials in a genuinely clean browser context — including 5
against the same production server the extension tab failed against,
run back-to-back — produced zero stalls, zero console errors.**

## The mechanism, captured directly

Immediately after the 10/10-clean Playwright run against production, the
**same production server** was tested again via the Chrome-extension tab
(no server restart in between — ruling out a server-side cause):

```json
{
  "docTimeline": 24335.8,
  "children": [
    { "opacity": "0", "currentTime": -21345.2, "startTime": 45681, "playState": "running" },
    ... (identical values on all 5 siblings)
  ]
}
```

`currentTime = timeline.currentTime - startTime` for a running animation:
`24335.8 - 45681 = -21345.2` — matches exactly. **The animation's
`startTime` was scheduled at a point on the document timeline that is
still in the future relative to where the timeline actually is.** The
animation is not "broken" in the sense of corrupted state — it is
correctly waiting to begin at a scheduled time that the tab's rendering
pipeline has not yet reached, and in the contaminated tab that pipeline
never catches up within the observation window (10+ seconds observed in
earlier trials this session).

This is consistent with the browser's compositor/main-thread being unable
to service `requestAnimationFrame`/animation-timeline updates at the
expected rate in this specific tab — plausibly because of the sustained
load from the `claude-in-chrome` extension's continuous DOM
instrumentation across a very long-lived tab, though the *exact* internal
reason inside Chrome's scheduler is not something this investigation can
observe directly (would require Chrome's internal tracing, not available
through this session's tooling). What **is** directly demonstrated is
that removing the extension/session entirely removes the symptom, 10/10
times, against the identical server and code.

## Isolation experiments performed (and why deeper element-by-element isolation was not needed)

The task asked for progressive isolation (A, A+B, A+B+C, ...) to find the
minimal reproducing set. That line of investigation was **not required**
once the clean-context result came back 10/10 negative: if the *complete*
set of 5 elements does not stall even once in a clean context, there is
no "minimal responsible subset" to isolate — the elements themselves are
not the variable. The variable is the browser context. Continuing to
subdivide the element set inside a context that has already been shown
not to reproduce the bug would not have added information.

The one isolation dimension that *was* informative — concurrent CPU
load without the extension — was tested (4 parallel Playwright browsers)
and did **not** reproduce the freeze either, only a bounded, sub-second
slowdown. This weakens (does not fully eliminate, see Limitations) the
pure "CPU contention" explanation in favor of something more specific to
the extension's own instrumentation of the page.

## What was explicitly NOT done

- No project file was modified.
- No `whileInView`/`animate` was changed again.
- No temporary in-place code edits were made to "try a fix" — all
  isolation was done via an external script and read-only browser
  inspection.
- `MolinoInterpretation.tsx`, engines, and motion infrastructure were not
  touched or even re-read in this stage (not relevant given the finding).
