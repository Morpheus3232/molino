---
title: "PLAN: Home Page Architecture Evaluation"
stage: PLAN
agent: workflow-architect, minimal-change-engineer
timestamp: 2026-08-01T21:00:00Z
---

## Task

Evaluate the current architecture of Molino's Home page and detect possible UX, state, rendering, or motion risks.

## Analysis Results

### Finding 1: Home Page Bug Status

**Claim:** Both GenericHome and PersonalizedHome appear in DOM simultaneously.

**Status:** ❌ **NOT REPRODUCED**

Evidence:
- Audited on dev (port 3000) and prod (port 3001)
- Tested with and without profile in localStorage
- Screenshot evidence shows no dual-rendering
- Current implementation uses `motion.div` with keys, NOT `AnimatePresence`
- Comment in code explicitly documents this design choice

**Conclusion:** This appears to be either a false positive or a bug that has been resolved by the existing git diff.

### Finding 2: HOME Page Motion Architecture

Current state: `app/page.tsx` was modified to use:
- `motion.div key="personalized"` with `initial={{ opacity: 0, y: 8 }} animate={{...}}`
- `motion.div key="generic"` with `initial={false} animate={{...}}`

This is an **EXISTING change** (already in working tree git diff).

**Risk Assessment:**
- ✅ Safe: No AnimatePresence around the ternary
- ✅ Safe: `initial={false}` prevents generic animation
- ⚠️ Potential: If AnimatePresence is re-added, could cause dual render
- ⚠️ Potential: No exit animation between branches

### Finding 3: Timing Page Motion Changes

Current state: `app/timing/page.tsx` was modified to convert all `whileInView` to `animate`.

**Risk Assessment:**
- ✅ Fixed: Animation freeze resolved
- ⚠️ Concern: Over-conservative approach removed scroll-context animations
- ⚠️ Could have preserved `whileInView` on secondary, isolated elements

## Proposed Action

### For This Analysis Task

**NO CODE CHANGES NEEDED.**

The task was explicitly analysis-only:
- "Evaluar la arquitectura actual de Molino's Home page"
- "detectar posibles riesgos"

Actions:
1. ✅ Document current architecture
2. ✅ Identify potential risks (documented above)
3. ✅ Verify no bugs are currently present
4. ✅ Recommend motion safety improvements (for future reference)

### For Future Tasks (If Bugs Are Confirmed)

If a future task confirms a real HOME page bug, the minimum change would be:
```diff
// Add warning comment to app/page.tsx:
// WARNING: Do NOT wrap this ternary in AnimatePresence. The current key-based
// switching uses motion.div without AnimatePresence to prevent dual rendering
// of GenericHome and PersonalizedHome simultaneously.

// If scroll animations are desired for GenericHome/PersonalizedHome:
// Use <motion.div initial={false} animate={...}> (current approach)
// NOT <AnimatePresence><motion.div>...</motion.div></AnimatePresence>
```

### Affected Files

**NONE** for this analysis task.

If documentation changes are approved:
- `.artifacts/` (already created)
- `.opencode/opencode.md` (workflow instructions - optional)

## Risk Assessment

| Risk | Level | Mitigation |
|------|-------|-----------|
| No code changes | None | N/A |
| Workflow validation only | None | N/A |
| False positive confirmation | None | Report filed, no action taken |

## Scope

This task is **purely analytical**. No implementation is proposed.

The workflow system itself (agents, artifacts, state machine) is being validated.
