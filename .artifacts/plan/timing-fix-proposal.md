# PLAN — TIMING result panel stall (PROPOSAL ONLY — NOT IMPLEMENTED)

**Stage:** PLAN
**Status:** Awaiting **HUMAN GATE 1**. Nothing in this document has been
applied to any file.

## Proposed minimal fix (for future approval — not authorized yet)

Convert the remaining 8 `whileInView` occurrences inside the TIMING result
panel (`app/timing/page.tsx`, the block gated by
`{result && showResults && (...)}`, plus the panel header block gated by
`{selectedIntention && (...)}` which showed the same pathology in the
audit) to `animate`, mirroring exactly the pattern already applied to
`favorableDimensions` in FASE 3A and already used throughout `HOY` and
`DECISIONES` for their own state-driven (not scroll-driven) reveals. This
would be the same class of change already reviewed and approved in this
project for exactly this situation (client-side-state-triggered content),
just applied completely instead of partially.

**Affected elements** (all in `app/timing/page.tsx`):
1. Panel header (`{selectedIntention && (...)}` wrapper)
2. Result main container (holds `ReadingNumber`)
3. Challenging dimensions
4. Recommendation
5. Caveats
6. `MolinoInterpretation` wrapper
7. `bestDates` section wrapper
8. Each mapped `bestDates` card
9. Button row

(`favorableDimensions` — already `animate`, no change needed.)

**Not proposed:** touching `components/ui/MolinoInterpretation.tsx` — its
own internal animations already use `animate`, confirmed correct in
DISCOVER; only its *wrapper* in `timing/page.tsx` is implicated.

**Explicitly out of scope for this proposal:** the intention-grid section
above the panel (`{!selectedIntention && (...)}`) — it renders on true
page load, which is the scenario `whileInView` is designed for and where
it was not observed to fail in this audit. Converting it was not tested
and is not proposed without separate evidence.

## Why this is a proposal, not an action

Per this task's explicit instructions: **READ ONLY. NO CODE CHANGES. NO
TEST CHANGES. NO WRITER LOCK.** This document exists so that, if and when
a human issues Gate 1 approval, the next session/agent has a precise,
pre-reviewed scope to implement — not so that implementation starts now.

## Risk assessment (for the eventual Gate 1 decision, not a self-approval)

- **Low structural risk** — this is the exact same one-line-per-element
  change pattern FASE 3A already made once successfully, and the same
  pattern already shipped and verified working in `HOY`/`DECISIONES`.
- **No new dependency, no new abstraction, no business-logic change.**
- **Verification burden:** would need the same dev+prod, `getAnimations()`
  -based re-audit this task performed, repeated post-fix, plus a real
  mobile-viewport pass once tooling allows it (currently blocked
  identically to the HOME investigation).

## Gate 1 status

**NOT GRANTED.** This plan is presented for review only. No implementation
agent should act on it without an explicit human approval message.
