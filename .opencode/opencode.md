# Molino Multi-Agent Workflow System

## Overview

This project implements a disciplined multi-agent workflow for engineering tasks. The Workflow Architect (orchestrator) assigns tasks to specialized agents that work **sequentially** through a defined pipeline, sharing evidence via `/.artifacts/` files, respecting human gates, and never writing code outside approved scope.

## Workflow Pipeline

```
DISCOVER → AUDIT → DIAGNOSE → PLAN → [HUMAN GATE 1] → IMPLEMENT → TYPECHECK → TEST → BUILD → BROWSER QA → REALITY CHECK → FINAL REVIEW → [HUMAN GATE 2] → SHIP
```

## Available Agents

All agents are in `.opencode/agents/`. Invoke with `@agent-name` prefix.

### Permanent Team

| Agent | Role |
|---|---|
| `@workflow-architect` | Orchestrator. Enforces workflow, assigns stages, validates handoffs, enforces gates. Never writes production code. |
| `@codebase-onboarding-engineer` | DISCOVER: Maps repo, traces execution paths. |
| `@evidence-collector` | AUDIT + BROWSER QA: Captures screenshots, console logs, traces. |
| `@reality-checker` | AUDIT + REALITY CHECK: Validates claims against browser evidence. |
| `@code-reviewer` | DIAGNOSE + FINAL REVIEW: Code analysis, reviews changes. |
| `@codebase-archaeologist` | DIAGNOSE: Finds drift, dead code, memory/schemas. |

### On-Demand Team

| Agent | Activate When |
|---|---|
| `@minimal-change-engineer` | IMPLEMENT: Surgical code fixes (primary writer). |
| `@senior-developer` | IMPLEMENT (complex changes): Complex implementation work. |
| `@test-automation-engineer` | VERIFY: typegen, tests, build automation. |
| `@sprint-prioritizer` | PLAN: Scope/priority decisions. |
| `@git-workflow-master` | SHIP: Commit and PR (with human approval). |

## Starting a Workflow

```
@workflow-architect TASK: [brief description]
```

## Human Gates

### Gate 1: Scope Approval (before code changes)
The Workflow Architect will present:
- Fix proposal
- Affected files list
- Risk assessment
And wait for your explicit `:white_check_mark:` before allowing IMPLEMENT.

### Gate 2: Ship Approval (before commit/PR)
The Workflow Architect will present:
- Summary of changes
- QA results
And wait for your explicit `:shipit:` before allowing SHIP.

## Artifact Structure

```
.artifacts/
├── workflow-state.md          # Current state tracker
├── workflow-architecture.md   # This file reference documentation
├── discover/                  # Discovery reports
├── audit/                     # Audit evidence
├── diagnose/                  # Root cause analysis
├── plan/                      # Fix proposals
├── implementation/            # Implementation tracking
├── verify/                    # tsc/test/build results
├── qa/                        # Browser QA evidence
└── final-review/              # Code review results
```

## Safety Rules

1. **Single Writer:** Only `@minimal-change-engineer`, `@senior-developer`, or `@test-automation-engineer` (tests only) can write code at any time.
2. **No Scope Creep:** Only files listed in `.artifacts/plan/affected-files.md` can be modified.
3. **No Code Before Plan:** DISCOVER → AUDIT → DIAGNOSE → PLAN are read-only.
4. **Evidence First:** Every bug must have reproduction + evidence before changes.
5. **Clean State:** Before validation: `rm -rf .next && npm run build && npm test`.
6. **Production Verification:** Visual bugs must be tested on production build, not just dev.
7. **Motion Safety:** Changes to Framer Motion must follow motion safety protocol.

## Motion Safety Protocol

For any motion changes, classify each element:

1. **CRITICAL STATE** → `animate` (animates on state change)
2. **SCROLL CONTEXT** → `whileInView` only if safe
3. **STATIC** → no motion wrapper needed

**Hard Rules:**
- Never use `whileInView` inside `AnimatePresence`
- Dynamic result containers must use `animate`
- Elements with nested `AnimatePresence` need individual analysis

## Quick Commands

```bash
# Clean state for testing
rm -rf .next && npm run build && npm test

# Type check
npx tsc --noEmit

# Run all unit tests
npm test

# Run Playwright e2e
npx playwright test

# Start dev server
npm run dev

# Start production server (for QA)
npm run build && npm start
```
