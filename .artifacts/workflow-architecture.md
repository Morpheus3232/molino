# Molino Multi-Agent Engineering Workflow Architecture

## 6. Workflow State Machine

The workflow is a **linear pipeline with conditional branches**, orchestrated by the Workflow Architect agent. State is persisted in `/.artifacts/workflow-state.json`.

```
DISCOVER
   ↓  (no errors)
AUDIT
   ↓  (evidence collected)
DIAGNOSE
   ↓  (root cause confirmed)
PLAN
   ↓  (plan documented)
APPROVE SCOPE
   ↓  (human :white_check_mark:)
IMPLEMENT
   ↓  (git diff verified)
TYPECHECK → if fail → IMPLEMENT (fix)
TEST → if fail → IMPLEMENT (fix)
BUILD → if fail → IMPLEMENT (fix)
BROWSER QA
   ↓  (evidence collected)
REALITY CHECK
   ↓  (validated)
FINAL REVIEW
   ↓  (human :shipit:)
SHIP
```

### State Persistence

```json
{
  "task": "fix: timing page animation freeze",
  "stage": "DISCOVER",
  "agent": "workflow-architect",
  "startedAt": "2026-08-01T18:00:00Z",
  "lock": null,
  "artifacts": {
    "discover": ["repo-structure.md"],
    "audit": [],
    "diagnose": [],
    "plan": []
  },
  "gates": {
    "scopeApproved": false,
    "shipApproved": false
  }
}
```

**Enforcement:** Workflow Architect writes this file at each stage transition. Other agents read it to determine current state.

## 7. Implementation Protocol

### Pre-Implementation Checklist

Before `MINIMAL_CHANGE_ENGINEER` writes any code, the Workflow Architect verifies:

1. ✅ `.artifacts/plan/fix-proposal.md` exists with exact code change
2. ✅ `.artifacts/plan/affected-files.md` exists — explicit, exhaustive list
3. ✅ `.artifacts/plan/risk-assessment.md` exists
4. ✅ `.artifacts/plan/scope-approved.md` exists (human gate passed)
5. ✅ WRITER-LOCK is available (no conflicting writes)

### Write Lock Protocol

```
File: .artifacts/implementation/WRITER-LOCK

---
agent: minimal-change-engineer
file: app/timing/page.tsx
started: 2026-08-01T18:30:00Z
---
```

**Workflow Architect enforces:** Before any code-writing agent starts, checks for lock file existence. If exists, blocks the agent and reports conflict.

**Agent actions:**
1. Create lock file before editing
2. Update lock with `status: completed` after edits done
3. Workflow Architect removes lock file after verification

### Change Verification

After implementation:
1. `git diff --stat` — verify only approved files changed
2. `git diff <file>` — verify change matches plan exactly
3. If scope violation detected → Workflow Architect blocks → agent reverts

## 8. Motion Safety Protocol

### Classification Matrix

When the PLAN stage involves Framer Motion changes, the implementing agent must produce `.artifacts/plan/motion-safety.md`:

```markdown
## Motion Elements in app/example/page.tsx

| Element | Current | Proposed | Classification |
|---|---|---|---|
| Panel container | whileInView | animate | CRITICAL STATE |
| Result container | whileInView | animate | CRITICAL STATE |
| MolinoInterpretation | whileInView | animate | CRITICAL STATE |
| Favorable dimensions | whileInView | keep | SCROLL CONTEXT |
| ... | ... | ... | ... |
```

### Hard Rules

1. **AnimatePresence children** → **ALWAYS** `animate` (never `whileInView`)
2. **Dynamic result containers** → **ALWAYS** `animate`
3. **Nested AnimatePresence** → Must analyze; default to `animate` if parent also animates
4. **Secondary content after result** → May keep `whileInView` if isolated

### Verification Requirements

After any motion change:
- ✅ Dev server with `npm run dev`
- ✅ Production: `npm run build && npm start`
- ✅ Desktop 1440px
- ✅ Mobile 375px
- ✅ prefers-reduced-motion toggle
- ✅ Console errors checked

## 9. False Positive Handling

### Protocol

When an agent suspects a bug:

1. **Suspicion** → Evidence Collector captures initial screenshot/log
2. **Clean State Test** → `rm -rf .next && npm run build && npm test`
3. **Isolation** → Disable suspected feature, retest
4. **Reproduction** → Document exact steps
5. **Production Verification** → Test on `npm start` (port 3001)

### False Positive Report

If confirmed false positive:
```
.artifacts/false-positives/<slug>-<timestamp>.md
```
```markdown
---
title: "Bug: [description] — False Positive"
cause: "Stale .next cache / browser cache / CDN cache"
evidence: "Screenshots/sessions before/after cache clear"
resolution: "No code change needed. Cache reset resolved."
---
```
Workflow Architect closes the task.

## 10. Regression Baseline

### Routes to QA

Every task must verify these routes are unaffected:

**Primary:**
- `/` — Home (with and without profile)
- `/timing` — Full flow (intention → panel → result → date → back)
- `/decisions` — Form → result → back
- `/hoy` — Skeleton → content

**Secondary (if motion changes):**
- `/profile` — Tabs
- `/affinity` — Compatibility grid
- `/compatibility/[entity]` — Entity pages
- `/onboarding` — Onboarding flow

### Viewport Matrix

| Device | Viewport | Notes |
|---|---|---|
| Desktop | 1440×900 | Primary development target |
| Tablet | 768×1024 | Secondary |
| Mobile | 375×812 | Primary mobile target |
| Mobile | 390×844 | iPhone 12+ variant |

### Reduced Motion Testing

Toggle in Chrome DevTools:
1. Rendering tab → Emulate CSS media feature `prefers-reduced-motion`
2. Verify motion elements either: skip animation or show final state immediately
3. No layout shifts, no invisible content

## 11. Artifact Contracts

Each stage consumes the previous stage's artifacts.

### Discover → Audit Contract
Discovery output tells Audit what to look at:
- File paths from `repo-structure.md`
- Execution paths from `execution-paths.md`
- Component boundaries from `component-map.md`

### Audit → Diagnose Contract
Audit provides evidence for diagnosis:
- `current-behavior.md` — observed symptoms
- `evidence/` — screenshots, console logs, traces

### Diagnose → Plan Contract
Diagnosis provides the root cause:
- `root-cause.md` — confirmed root cause with evidence
- `reproduction.md` — reproducible steps
- `affected-elements.md` — exact files/lines involved

### Plan → Human Approval Contract
Plan provides the fix proposal:
- `fix-proposal.md` — exact code change
- `affected-files.md` — exhaustive file list
- `risk-assessment.md` — risk level and mitigation
- `motion-safety.md` — (if motion changes) classification

### Human Approval → Implement Contract
- `scope-approved.md` — human approval timestamp and signature

### Implement → Verify Contract
- `git diff` output — actual changes
- `changes.md` — summary of what changed

### Verify → Browser QA Contract
- `verify/tsc-*.md` — type check results
- `verify/test-*.md` — test results
- `verify/build-*.md` — build results

## 12. Recommended Implementation

### Step 1: Agent Installation
Agents are already installed in `.opencode/agents/` (11 agents).

### Step 2: Workflow Helper Scripts

Create `.opencode/workflows/` directory with:

```
.opencode/workflows/
├── clean-state.sh         # rm -rf .next && npm run build && npm test
├── verify-tsc.sh          # npx tsc --noEmit
├── verify-test.sh         # npm test
├── verify-build.sh        # npm run build
├── dev-server.sh          # npm run dev (port 3000)
├── prod-server.sh         # npm start (port 3001, after build)
├── qa-full.sh             # complete regression QA
├── qa-reduced-motion.sh   # reduced motion specific QA
├── artifact-check.sh      # verify required artifacts exist
├── lock-acquire.sh        # acquire write lock
├── lock-release.sh        # release write lock
├── state-transition.sh    # update workflow state
└── qa-desktop.sh          # desktop-specific QA
```

Example `clean-state.sh`:
```bash
#!/bin/bash
set -e
echo "🧹 Clean state: removing .next cache"
rm -rf .next
echo "✅ Building..."
npm run build
echo "✅ Running tests..."
npm test
echo "✅ Clean state verified"
```

Example `lock-acquire.sh`:
```bash
#!/bin/bash
LOCK_FILE=".artifacts/implementation/WRITER-LOCK"
if [ -f "$LOCK_FILE" ]; then
  echo "🔒 LOCK HELD by:"
  cat "$LOCK_FILE"
  exit 1
fi
echo "agent: $1
file: $2
started: $(date -u +%Y-%m-%dT%H:%M:%SZ)
status: active" > "$LOCK_FILE"
echo "🔒 Lock acquired for $1 on $2"
```

### Step 3: State Tracking

`.opencode/workflows/state.sh` — helper for updating workflow state:
```bash
#!/bin/bash
STATE_FILE=".artifacts/workflow-state.json"
update_state() {
  local stage="$1"
  local agent="$2"
  python3 -c "
import json, datetime
with open('$STATE_FILE', 'r') as f:
    state = json.load(f)
state['stage'] = '$stage'
state['agent'] = '$agent'
state['updatedAt'] = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
with open('$STATE_FILE', 'w') as f:
    json.dump(state, f, indent=2)
print(f'State updated: $stage')
"
}
```

### Step 4: AGENTS.md Update

Update `.opencode/opencode.md` with:
- Workflow pipeline description
- Agent activation instructions
- Human gate instructions
- Quick command reference
- Artifact location reference

### Step 5: Workflow Initiation

When a task is assigned:
```
@workflow-architect TASK: [description]
```

The Workflow Architect:
1. Creates `.artifacts/workflow-state.json` with task name
2. Activates Codebase Onboarding Engineer for DISCOVER
3. Progressively activates agents for each stage
4. Enforces human gates by stopping and asking user
5. Enforces single-writer via lock files
6. Enforces artifact contracts (checks required files exist)
7. Produces final summary report

## 13. OpenCode Limitations & Mitigations

| Limitation | Impact | Mitigation |
|---|---|---|
| No persistent conversation memory | Context lost between agent calls | Artifact files preserve all evidence/state |
| No native workflow state machine | Can drift from intended process | State JSON file + lock files enforce |
| No built-in single-writer lock | Multiple agents could write code | Lock file protocol + Workflow Architect enforcement |
| No human-in-loop gates | Risk of auto-committing | Workflow Architect explicitly stops at gates |
| No artifact contract enforcement | Stages could skip required inputs | `artifact-check.sh` validates before proceeding |
| Agent selection not programmable | Human must choose correct agent | Naming conventions + `.opencode/opencode.md` guidance |

## 14. Example: Home Page Bug Workflow

Using the current HOME page issue as an example:

```
1. @workflow-architect TASK: "Fix HOME page: both PersonalizedHome and GenericHome in DOM"
   → Creates workflow-state.json

2. @codebase-onboarding-engineer DISCOVER
   → Reads app/page.tsx, components/sections/*
   → Writes .artifacts/discover/home-render-investigation.md
   → State → AUDIT

3. @evidence-collector AUDIT
   → rm -rf .next && npm run build
   → Starts dev server + prod server
   → Screenshots / on both
   → Writes .artifacts/audit/home-audit-<timestamp>.md
   → State → DIAGNOSE

4. @code-reviewer DIAGNOSE
   → Analyzes app/page.tsx lines 168-175
   → Identifies AnimatePresence issue
   → Writes .artifacts/diagnose/home-diagnosis-<timestamp>.md
   → State → PLAN

5. @workflow-architect + @minimal-change-engineer PLAN
   → Designs minimal fix (restore AnimatePresence)
   → Writes .artifacts/plan/home-fix-<timestamp>.md
   → Writes .artifacts/plan/affected-files.md
   → Writes .artifacts/plan/risk-assessment.md
   → Stops: "## GATE: Scope Approval — Reply :white_check_mark: to approve"

6. User: :white_check_mark:

7. @minimal-change-engineer IMPLEMENT
   → lock-acquire.sh "minimal-change-engineer" "app/page.tsx"
   → Edits app/page.tsx
   → lock-release.sh
   → State → TYPECHECK

8. @test-automation-engineer TYPECHECK
   → npx tsc --noEmit (PASS)
   → npm test (PASS)
   → State → BUILD

9. @senior-developer BUILD
   → npm run build (PASS)
   → State → BROWSER QA

10. @evidence-collector + @reality-checker BROWSER QA
    → Tests / on dev + prod
    → Desktop 1440px + Mobile 375px + Reduced Motion
    → Writes .artifacts/qa/*
    → @reality-checker validates claims
    → State → FINAL REVIEW

11. @code-reviewer FINAL REVIEW
    → git diff review
    → Writes .artifacts/final-review/review-<timestamp>.md
    → Stops: "## GATE: Ship Approval — Reply :shipit: to commit"

12. User: :shipit:

13. @git-workflow-master SHIP
    → Creates branch, commits, opens PR
    → Reports PR link
    → Updates workflow-state.json: COMPLETE
```

## Current Repository Status

| Check | Status |
|---|---|
| Clean state | ✅ `.next` removed, builds and tests pass |
| Existing changes | 16 modified files (pre-existing, not from this workflow) |
| Agents installed | ✅ 11 agents in `.opencode/agents/` |
| Playwright config | ✅ `e2e/qa.spec.ts` exists, but has missing `path-to-regexp` module |
| Package scripts | ✅ dev, build, test, typecheck all defined |
| Git state | ⚠️ 16 uncommitted mods (pre-existing FASE 3A work) |

## Recommendation

This workflow is ready for deployment. The agent set and infrastructure are in place. The main remaining task is to install this architecture as a permanent fixture using:

1. ✅ Already done: 11 agents installed in `.opencode/agents/`
2. ✅ Already done: `.opencode/opencode.md` instructions file
3. ✅ Already done: `.artifacts/` directory structure
4. ⏳ Pending user review: This workflow-architecture.md document
5. ⏳ Optional: Add workflow helper scripts (`.opencode/workflows/`)
6. ⏳ Optional: Create initial workflow-state.json template
