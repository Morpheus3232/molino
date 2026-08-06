# AUDIT — FASE 3A / TIMING post-fix QA

**Stage:** AUDIT (read-only)
**Task:** FASE 3A — POST-FIX QA / TIMING
**Files under test:** `app/timing/page.tsx` (not modified — read only)
**Goal of this audit:** try to falsify the "FASE 3A closed" claim, not confirm it.

**Result: the claim does NOT hold. A real, reproducible stall exists,
confirmed in both dev and production, with direct WAAPI-level evidence.**

## Protocol

- Dev: `rm -rf .next && next dev` (port 3000), hard reload before testing.
- Prod: `rm -rf .next && next build`, then the Next.js **standalone**
  server (`node .next/standalone/server.js`, port 3001) — `next start`
  does not work with this project's `output: standalone` config (Next.js
  prints this warning explicitly); using `next start` alone would have
  silently tested nothing. Static assets (`.next/static`, `public/`) were
  copied into the standalone output first, as required for that mode.
- Evidence source: `Element.getAnimations()`, `Animation.currentTime`,
  `Animation.playState`, `getComputedStyle(el).opacity`,
  `getBoundingClientRect()` — never `innerText`, never a semantic/AI
  `find` tool (per explicit instruction, and per the false-positive
  history documented in the HOME investigation).
- Reproduction trigger: select an intention card (mounts the date panel),
  then change the date via keyboard (↑ on the focused day segment) to set
  `showResults = true` and mount the full result panel — this is a
  **client-side state change**, not a page-load scroll, which is the
  precondition for the suspected `whileInView` failure mode.

## DEV — findings

Fresh page load, intention selected, date changed, **zero scroll** for 8+
seconds:

| Element | `opacity` | `getAnimations().length` | Notes |
|---|---|---|---|
| Result main container (holds `ReadingNumber`) | `0` | `0` | No animation object ever created — trigger never fired |
| Favorable dimensions (the one block FASE 3A converted to `animate`) | `0` | `1`, `playState: running`, `currentTime: -13091.3` | **Negative currentTime** — an animation exists but in a pathological state |
| Recommendation | `0` | `0` | Never fired |
| Caveats | `0` | `0` | Never fired |
| `MolinoInterpretation` wrapper (1065px tall block) | `0` | `0` | Never fired — entire interpretation invisible |
| `bestDates` wrapper | `0` | `1`, `playState: running`, `currentTime: 287` (positive, plausibly in-flight) | |
| Button row (Ver energía / Ver perfil) | `0` | `0` | Never fired |

**Console:** clean — no errors, no warnings from the app.

**Scroll test:** a 1–2 tick scroll immediately resolved whichever elements
were within the new scroll position's viewport to `opacity: 1`; elements
still below the fold remained at `0` until genuinely scrolled past.
Elements already inside the *original* viewport bounding box (verified via
`getBoundingClientRect().top` < viewport height) still required a scroll
**event** to resolve — being geometrically visible was not sufficient on
its own.

## PRODUCTION — findings

Same protocol, same steps, standalone server (port 3001):

| Element | `opacity` (after 7s, no scroll) | `getAnimations()` |
|---|---|---|
| Panel header ("Iniciar un proyecto" / date input) | `0.469941` → unchanged after 7s | 1 animation, `playState: running` |
| Result main container | **`0.335199` → unchanged after 7s** | 1 animation, `playState: running`, **`currentTime: 259.5` frozen — confirmed unchanged across two separate re-checks 4 seconds apart, while `animation.timeline.currentTime` advanced normally (54176 → 54435+)** |
| Favorable dimensions (`animate`-converted) | `1` | resolved correctly, quickly — consistent with dev |
| Recommendation / Caveats / `MolinoInterpretation` | `0` | `0` animations — never fired |

**This is the literal WAAPI timeline stall the task asked to search for:**
an `Animation` object whose `playState` reads `"running"` while its
`currentTime` has permanently decoupled from the timeline clock. Not "an
animation that's slow" — an animation that will never finish on its own.

**Console:** clean of application errors. All console entries present
were from an unrelated browser extension
(`chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/...`, a wallet
extension by its `background-liveness`/`app-init-liveness` log
signatures) — zero messages originating from `localhost:3001`.

**Scroll test:** identical to dev — one scroll tick immediately resolved
the frozen element to `opacity: 1` (Framer Motion snaps to the final
state on the next intersection callback rather than resuming the stuck
animation's own clock).

## Viewport coverage

| Viewport | Status |
|---|---|
| ~1440–1501px (effective desktop width available this session) | **VERIFIED** — reproduced in both dev and prod |
| 375px / 390px (mobile) | **NOT VERIFIED — TOOL LIMITATION.** `resize_window` reported success but `window.innerWidth` read back as `1440` immediately after, for every requested size (375, 390, 1024 all tested) — same pre-existing tool limitation documented in the HOME investigation. No workaround attempted, per instruction. |
| Any width other than the session's default (~1440–1501px) | **NOT VERIFIED — TOOL LIMITATION.** Same as above; the tool would not honor any requested width this session, not just mobile ones. |

## Checklist results (against the task's 10 verification points)

| # | Check | Result |
|---|---|---|
| 1 | Result container reaches `opacity: 1` | **FAIL** — stuck at `0` (dev) / stuck mid-transition at `0.335` (prod), indefinitely, without scroll |
| 2 | `ReadingNumber` reaches final state | **FAIL** — it lives inside the result container (child-0); parent never reaches `opacity: 1` unassisted, so it's never visible regardless of its own internal state |
| 3 | `MolinoInterpretation` reaches final state | **FAIL** — wrapper stuck at `opacity: 0`, `animCount: 0`, in both dev and prod |
| 4 | `bestDates` reaches final state | **FAIL initially** — `opacity: 0` with either `animCount: 0` (dev, most runs) or an animation present but not completing without scroll |
| 5 | Buttons reach `opacity: 1` | **FAIL** — `opacity: 0`, `animCount: 0`, both dev and prod |
| 6 | Full stagger completes in expected time | **FAIL** — does not complete at all without a scroll event; not "slow," genuinely stalled indefinitely (waited up to 8s) |
| 7 | WAAPI timeline stall reproduced | **CONFIRMED** — production: `playState: "running"` with `currentTime` frozen across a 4s window while the timeline clock advanced; dev: a **negative** `currentTime` on one animation object |
| 8 | Scroll/reflow no longer required | **FAIL — still required.** A scroll event (not mere geometric visibility) is what unblocks every stuck element, in both dev and prod |
| 9 | No console errors | **PASS** — zero application-level console errors in either environment |
| 10 | Consistent across viewports | **NOT VERIFIED** — only one effective viewport width could be tested this session (tool limitation); not a claim of failure, but not a claim of consistency either |

## False-positive check

Per the HOME investigation's lessons, this audit explicitly checked
whether this could be a stale-cache artifact:

- Dev server was freshly restarted (`rm -rf .next && next dev`) before
  testing.
- Production was a genuinely fresh `rm -rf .next && next build`, run
  minutes before this audit, not a stale artifact.
- Hard reload (`Cmd+Shift+R`) was used before every dev test.
- The bug reproduced identically across **multiple separate page loads**
  in both environments (not a one-off).
- Evidence is `getAnimations()`/`currentTime`/computed `opacity` — not
  `innerText` or a semantic search tool, both of which produced false
  signals in the prior HOME investigation.

**Conclusion: this is not a false positive.** It is a real, consistently
reproducible defect.
