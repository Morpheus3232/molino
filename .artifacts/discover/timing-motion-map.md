# DISCOVER — TIMING page motion map

**Stage:** DISCOVER (read-only)
**Task:** FASE 3A — POST-FIX QA / TIMING
**File:** `app/timing/page.tsx` (not modified — read only)

## What FASE 3A actually changed

`git diff app/timing/page.tsx` against `HEAD` shows **exactly one line
changed**: the `favorableDimensions` block converted from `whileInView` to
`animate` (removing `viewport={{ once: true }}`).

```diff
- <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }} ...>
+ <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} ...>
```

## Current state of every motion element inside the result panel

The result panel (`{result && showResults && (...)}`, mounts on a client
state change — date selection — not on page load) contains, in order:

| Line | Element | Directive | Converted in FASE 3A? |
|---|---|---|---|
| 153 | Main result container (holds `ReadingNumber`) | `whileInView` | **No — unchanged** |
| 171 | Favorable dimensions | `animate` | **Yes** |
| 185 | Challenging dimensions | `whileInView` | **No — unchanged** |
| 198 | Recommendation | `whileInView` | **No — unchanged** |
| 204 | Caveats | `whileInView` | **No — unchanged** |
| 214 | `MolinoInterpretation` wrapper | `whileInView` | **No — unchanged** |
| 227 | `bestDates` section wrapper | `whileInView` | **No — unchanged** |
| 234 | each `bestDates` card (mapped) | `whileInView` | **No — unchanged** |
| 254 | Button row (Ver energía / Ver perfil) | `whileInView` | **No — unchanged** |

Outside the result panel (grid of intentions, intention-selected header,
date input) also still use `whileInView` — out of scope for this QA task
(not part of the elements listed in the task's evidence checklist), noted
for completeness only.

## Why this matters for this QA task

The task explicitly asks to verify: main result container opacity,
`ReadingNumber` final state, `MolinoInterpretation` final state,
`bestDates` final state, and buttons reaching `opacity: 1` — i.e.
**exactly the elements that were NOT converted to `animate`**, still using
`whileInView` + `viewport={{ once: true }}`.

`whileInView` depends on `IntersectionObserver`. A known class of failure
for this pattern: when an element mounts **already inside the viewport**
as a result of a client-side state change (not a page-load scroll), some
browser/Framer Motion/React combinations don't reliably fire the
intersection callback until a real scroll or layout reflow occurs — this
matches the reported symptom ("scroll/reflow needed to unblock the
animation") precisely. This is the working hypothesis to test against in
AUDIT, not an assumed conclusion.

`components/ui/MolinoInterpretation.tsx` (protected, not modified, not
even opened for editing) uses `animate` internally for its own children —
so if its *wrapper* in `app/timing/page.tsx` (line 214, still
`whileInView`) never reaches `opacity: 1`, the component's own internal
animations are irrelevant: the wrapper's CSS `opacity: 0` would make
everything inside invisible regardless.

## Scope confirmation

No file was modified during DISCOVER. Files read (not edited):
`app/timing/page.tsx`, `components/ui/MolinoInterpretation.tsx` (grep only,
first 30 matches, to confirm its animation model — not analyzed further,
out of scope).
