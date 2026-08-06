---
title: "DIAGNOSE: Home Page Architecture"
stage: DIAGNOSE
agent: code-reviewer
timestamp: 2026-08-01T20:45:00Z
---

## Findings from Audit

The AUDIT stage did not reproduce the "both GenericHome and PersonalizedHome in DOM" bug. However, code analysis reveals POTENTIAL RISKS in the current implementation.

## Root Cause Analysis

### Current Implementation (from git diff)

`app/page.tsx` lines 82-100:
```tsx
{mounted && profile ? (
  // PersonalizedHome branch
  <motion.div key="personalized" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
    <PersonalizedHome profile={profile} />
  </motion.div>
) : (
  // GenericHome branch  
  <motion.div key="generic" initial={false} animate={{ opacity: 1, y: 0 }}>
    <GenericHome />
  </motion.div>
)}
```

### Key Observations

1. **No AnimatePresence:** The code explicitly does NOT use AnimatePresence. The comment states: "al ser una rama condicional simple (no AnimatePresence), React jamás mantiene esta rama montada en paralelo."

2. **Intentional `initial={false}`:** The GenericHome branch uses `initial={false}` to skip animation, preventing fade-in.

3. **Potential Risk:** If a future refactor reintroduces AnimatePresence around this ternary, both branches could render simultaneously, causing the GenericHome/PersonalizedHome dual-render bug.

### Potential Risks Identified

| # | Risk | Severity | Likelihood | Mitigation |
|---|------|----------|-----------|------------|
| 1 | Adding AnimatePresence around ternary would cause dual render | High | Medium | Add warning comment |
| 2 | `initial={false}` on generic branch means no animation - inconsistent UX | Low | High | May be intentional |
| 3 | No exit animation when switching branches | Low | High | May be acceptable for performance |
| 4 | Key-based switching relies on React reconciliation | Medium | Medium | Verified working in current tests |

### Timing Page Motion Analysis

The timing page (`app/timing/page.tsx`) currently has 10 `whileInView` patterns converted to `animate`. This is a pre-existing change.

**Classification of timing page elements:**
- CRITICAL STATE (animate): panel, result container, buttons, MolinoInterpretation
- SCROLL CONTEXT (could keep whileInView): favorable/challenging dimensions, recommendation, caveats, BestDates cards, button row

**Potential risk:** Removing ALL `whileInView` from timing page removes scroll-context animations, which may not be the desired UX. Some secondary elements might be safe to keep `whileInView`.

## Reproduction

Cannot reproduce the original HOME bug in current state. The bug may have been:
1. Fixed by the existing git diff (motion.div replacing AnimatePresence)
2. A false positive from stale cache

## Recommendation

This is an ANALYSIS-only task. No implementation is needed unless specific bugs are confirmed.

For the timing page, a more surgical approach could preserve `whileInView` on safe secondary elements while keeping immediate `animate` on critical state-driven elements.
