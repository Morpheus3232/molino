# DIAGNOSE — Residual TIMING animation stall — RESOLVED (Conclusion C)

**Stage:** DIAGNOSE (root-cause investigation, no code changes)
**Status:** **Root cause determined.** See `.artifacts/diagnose/reproduction.md`
for the full experimental record.

## Conclusion

**C. Artefacto del entorno de QA — confirmado con evidencia de que
desaparece en contexto limpio.**

The residual stall reported after the `whileInView` → `animate` fix
(IMPLEMENT stage) is **not** a bug in Molino's architecture (A) and **not**
a bug in Framer Motion/WAAPI triggered by multiple simultaneous animations
(B). It is caused by the specific browser context this investigation's
QA was performed in — a single, very long-lived Chrome tab running the
`claude-in-chrome` extension's continuous DOM/accessibility
instrumentation across a multi-hour session.

## How each of the four candidate explanations was tested

| # | Hypothesis | Test | Result |
|---|---|---|---|
| 1 | Framer Motion/WAAPI bug from multiple simultaneous mounts | 10 trials (5 dev + 5 prod) in a fresh, isolated, extension-free Playwright context, same code, same profile, same interaction | **Ruled out.** 10/10 clean completions, zero stalls |
| 2 | `app/timing/page.tsx` architecture-specific bug | Same 10 trials — if the architecture itself were the cause, it would fail regardless of browser context | **Ruled out.** The exact same component tree, same simultaneous-mount pattern, completes correctly every time outside the contaminated tab |
| 3 | `motion`/`AnimatePresence`/stagger/spring interaction | No `AnimatePresence` is used in this code path (confirmed by reading the file — only plain conditional rendering + `motion.div` with `animate`); no springs are used (all `transition`s in the affected elements are `tween`-implicit, i.e. `duration`+`delay`, no `type: "spring"`). This candidate does not apply to the code as written | **Not applicable** — the code doesn't contain the ingredients this hypothesis requires |
| 4 | QA environment interference (long-lived tab, extension instrumentation) | Same 10 clean trials (negative) **plus** a direct, same-server, same-code, back-to-back comparison: clean Playwright → 0 stalls; immediately after, the contaminated extension tab against the *same still-running server* → stall reproduced, with `Animation.startTime` (45681) captured **ahead of** `document.timeline.currentTime` (24335.8), mathematically producing the exact negative `currentTime` observed (`-21345.2`) | **Confirmed**, with a precise mechanism: the animation is correctly scheduled but the tab's timeline has not advanced far enough to reach its `startTime` within the observation window — consistent with main-thread/compositor contention specific to that tab |

## Why this is not just "blaming the tool" without proof

Per the task's explicit requirement, hypothesis C was not accepted without
demonstrating disappearance in a clean context:

- **10/10** trials clean (not 1, not "mostly") — 5 against dev, 5 against
  a genuinely fresh production build, run with `rm -rf .next && next build`
  minutes before testing.
- The clean tool (Playwright) is not "friendlier" by construction — it
  runs the exact same Chromium engine (`chromium-1234`, same major version
  family as the user's own Chrome), the exact same app code, the exact
  same profile data, and the exact same click/keyboard interaction
  sequence as the contaminated-tab tests.
- A **direct, immediate, same-server** A/B was captured: clean → pass,
  contaminated → fail, no server restart in between, ruling out any
  server-state explanation.
- The mechanism (`startTime` scheduled ahead of `timeline.currentTime`) is
  not a hand-wave — it is the literal arithmetic that produces the
  observed negative `currentTime`, captured directly from
  `Animation.startTime` and `document.timeline.currentTime`.

## Is the earlier IMPLEMENT-stage fix still correct and worth keeping?

**Yes.** The `whileInView` → `animate` conversion (already applied and
approved under the prior Gate 1) removed a *separate, real* defect: the
`IntersectionObserver`-based trigger that, pre-fix, was reproducibly
100%-broken for content mounted via client-state change, in every context
tested including clean ones (this was never re-tested clean because the
pre-fix behavior was already deterministic and well-evidenced before the
fix). The residual stall investigated here is a distinct issue, downstream
of an already-correct fix, caused by this session's specific QA
environment rather than the code the fix touched.

## VERIFIED / NOT VERIFIED / NOT APPLICABLE

- **VERIFIED** — Conclusion C, via 10/10 clean-context trials plus a
  direct mechanistic capture of the `startTime`/`currentTime` relationship.
- **VERIFIED** — the `whileInView`/`IntersectionObserver` original defect
  remains fixed; not implicated in the residual stall (the fixed elements
  use `animate`, no observer involved).
- **NOT APPLICABLE** — hypothesis 3 (AnimatePresence/spring/stagger
  interaction): the code contains none of these in the affected path.
- **NOT VERIFIED** — the exact internal Chrome mechanism by which the
  extension's instrumentation delays the timeline (would require Chrome's
  own tracing tools, unavailable in this session). The *effect* is fully
  demonstrated; the deepest *internal* explanation is not, and is not
  necessary to close this investigation.

## No `plan/timing-next-fix.md` produced

Per the task's own instruction (*"solo si existe una causa suficientemente
demostrada"* that implicates the codebase) — the demonstrated cause here
is environmental, not a codebase defect. **No further code change to
`app/timing/page.tsx` is proposed or justified by this investigation.**
The already-implemented and approved `animate` conversion stands as-is.

## Recommendation

- Treat this investigation as closed for the codebase side.
- For any *future* QA on this app (not just TIMING), prefer a fresh
  Playwright context (as demonstrated here, `probe-clean-context.mjs` is
  a disposable, non-project script — not proposed for adoption into the
  repo, just documented as the method that worked) over a long-lived,
  heavily-instrumented Chrome-extension tab when precise WAAPI/animation
  timing evidence is needed. Visual/interaction QA (screenshots, clicks,
  navigation) is unaffected by this finding and can continue via the
  extension tab as before.
- No mobile/reduced-motion re-test is warranted by this specific finding
  (unrelated dimension); those remain `NOT VERIFIED — TOOL LIMITATION`
  from the prior stage, unchanged.
