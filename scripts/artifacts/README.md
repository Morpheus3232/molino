# Artifact Integrity Hardening

Workflow infrastructure for `.artifacts/`. Not part of the Molino
application — nothing in `app/`, `components/`, or `lib/` imports or
depends on anything in this directory.

## Why this exists

Two independent agent orchestration systems (this Claude Code session,
and a separately-operated OpenCode instance) both write to `.artifacts/`.
Without isolation, one has silently overwritten the other's evidence
(documented in `.artifacts/final-review/artifact-integrity-hardening.md`,
the design review this implements). This directory is the minimal,
surgical fix: session identity, namespacing, a real filesystem lock,
atomic writes, provenance, and fail-closed overwrite protection.

## What this does NOT do

- Does not touch, migrate, or reconcile any artifact that already existed
  before this was implemented. Everything under `.artifacts/discover/`,
  `audit/`, `diagnose/`, `plan/`, `implementation/`, `qa/`,
  `final-review/` (top-level, not under `runs/`), plus
  `.artifacts/workflow-state.md` and `.artifacts/workflow-state.json`,
  is **legacy** — left exactly as-is, read-only by convention only (see
  Limitations below).
- Does not require `.opencode/opencode.md` or anything under
  `.opencode/agents/` to change. If OpenCode is never updated to use this
  system, it simply keeps writing to the legacy top-level directories as
  before — which, going forward, is no longer where new Claude work lands,
  so the collision surface between the two systems for *new* work is
  eliminated even without OpenCode's cooperation. See Limitations.

## Usage

```bash
# Start a new run
node scripts/artifacts/new-run.mjs --owner claude --task "FASE 3C — example"
# → prints { workflowId, artifactRoot, manifest }

# Write an artifact into that run (fails closed on ownership/immutability
# violations — see below)
node scripts/artifacts/write-artifact.mjs \
  --workflow-id <id> --session-id <sid> --owner claude --agent minimal-change-engineer \
  --stage qa --file result.md --content-file /path/to/content.md

# Close the run (after this, further writes are refused)
node scripts/artifacts/close-run.mjs --workflow-id <id> --session-id <sid> --owner claude
```

## Mechanisms

| Requirement | Mechanism | File |
|---|---|---|
| Session/workflow identity | `workflowId` = `<owner>-<timestamp>-<uuid8>`, plus **required** `sessionId` recorded in the run's manifest at creation | `new-run.mjs` |
| Namespacing | Every run gets its own `runs/<workflowId>/{discover,audit,diagnose,plan,implementation,qa,final-review}/`, with `workflowId`/`file` validated against a strict allowlist and the resolved path re-checked to stay inside `.artifacts/runs/` before any filesystem call | `new-run.mjs`, `write-artifact.mjs`, `close-run.mjs` |
| Shared state | `.artifacts/index.json` — the single cross-run index. Everything else is per-run and needs no cross-process coordination | `lib/index-store.mjs` |
| Write protection (shared index) | Real filesystem lock (`open(O_CREAT\|O_EXCL)`) on `.artifacts/index.json.lock`, with two independent stale-lock reclaim conditions: age+pid-dead (30s), or age alone past a hard ceiling (10min) regardless of pid — the second condition exists specifically so PID reuse cannot deadlock the lock forever | `lib/lock.mjs` |
| Write protection (artifact creation) | `atomicCreateFileSync` — content is fully written and fsynced to a temp file, then `link()`ed into place. `link()` fails atomically (`EEXIST`) if the destination already exists — there is no check-then-act window between two concurrent creators of the same path | `lib/atomic-write.mjs`, used by `write-artifact.mjs` |
| Atomic writes (replace-in-place) | temp file → `fsync` → `rename()`, for single-owner files (e.g. a run's own `manifest.json`) where replacing is correct | `lib/atomic-write.mjs` |
| Provenance | YAML frontmatter (`workflowId`, `sessionId`, `owner`, `agent`, `stage`, `createdAt`) on every `.md` artifact; transition log in the run's `manifest.json` | `write-artifact.mjs` |
| Immutability | `write-artifact.mjs` refuses to write into a run whose manifest `status !== "ACTIVE"` | `write-artifact.mjs`, `close-run.mjs` |
| Fail-closed collision detection (ownership) | `sessionId` is **required**, not optional. `write-artifact.mjs` compares it against the run's recorded owner `sessionId`; a missing or mismatched `sessionId` throws and writes nothing | `write-artifact.mjs` |
| Fail-closed collision detection (concurrent same-path creation) | Two processes racing to create the exact same artifact path: exactly one `link()` call wins, the other gets `ArtifactExistsError` and writes nothing — demonstrated with two real OS processes, see the concurrency QA in this task's final report | `lib/atomic-write.mjs`, `write-artifact.mjs` |

## Limitations (stated plainly, not oversold)

- **Same-OS-user, no real access control.** Both Claude and OpenCode run
  as the same local user. Every guarantee here is *cooperative*: any
  process is technically capable of bypassing `write-artifact.mjs` and
  writing directly to a file with plain `fs.writeFileSync`. What this
  system actually provides is: (a) a structurally separate namespace per
  run, so accidental collisions require actively targeting someone else's
  `workflowId`, which is astronomically unlikely by chance; (b) for any
  writer that *does* go through `write-artifact.mjs`, a real, enforced,
  kernel-level check (`link()`'s `EEXIST`) that refuses to proceed rather
  than silently overwriting — not merely an application-level check that
  a concurrent process could race past.
- **No OS-level immutability.** "Immutable" here means
  `write-artifact.mjs` checks `manifest.status` and refuses — it is not a
  filesystem permission (`chmod`) or macOS `chflags uchg`. A process
  bypassing this script entirely could still edit a closed run's files
  directly.
- **OpenCode has not been updated to use this, and this task did not
  change that.** Until/unless `.opencode/opencode.md` is changed (a
  decision outside this session's authority), OpenCode will keep writing
  to the legacy top-level directories, and `.opencode/opencode.md` still
  documents `workflow-state.md` — the same filename Claude's own tracker
  uses — as OpenCode's own state file. That specific collision is
  **not** closed by this task; only the `runs/` namespace's own internal
  correctness was hardened.
- **The manifest's transition log is not yet given the same exclusion
  guarantee as artifact content.** Two concurrent writers targeting
  *different* files within the *same* run each win their own
  `atomicCreateFileSync` for their content (no data loss there), but both
  then read-modify-write the shared `manifest.json` via plain
  `atomicWriteFileSync` (replace, not exclusion-checked) — one transition
  log entry can still be silently lost in that narrow case. Out of this
  task's approved scope; flagged for a future pass if the transition log
  needs the same guarantee the artifact content now has.
- **Legacy artifacts remain exactly as vulnerable as before.** This
  system does not retroactively protect `.artifacts/workflow-state.md`,
  `workflow-state.json`, `workflow-architecture.md`, or any top-level
  stage directory. Nothing new should be written there again, but nothing
  technically prevents it.
