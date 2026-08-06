# ARTIFACT INTEGRITY HARDENING

**Stage:** Security/integrity audit — READ-ONLY.
**No code, agent config, workflow state, or existing artifact was
modified to produce this document.** See Final Validation at the bottom.

---

## 1. Current Architecture

`.artifacts/` is a plain, flat-ish directory tree on the local filesystem,
written to directly (no intermediary API, no queue, no lock service) by
whichever process happens to be running at the time:

```
.artifacts/
├── workflow-state.md          # Claude's own state tracker (this session)
├── workflow-state.json        # OpenCode's own state tracker (separate file, separate schema)
├── workflow-architecture.md   # Shared/ambiguous — see §1.1, itself found mid-audit to be a partial/inconsistent document
├── discover/
├── audit/
│   └── evidence/              # screenshots (OpenCode-authored, this audit's only binary artifacts)
├── diagnose/
├── plan/
├── implementation/
├── qa/
└── final-review/
```

Two independent, unrelated agent orchestration systems currently target
this same directory:

- **Claude Code** (this session) — no formal on-disk protocol beyond a
  self-imposed convention (`WRITER-LOCK` file, described in this
  session's own understanding of `workflow-architecture.md` and reinforced
  ad hoc by direct user instruction each task).
- **OpenCode** (`.opencode/agents/*.md` + `.opencode/opencode.md`) — a
  **separate, live, currently-running CLI process** (confirmed via `ps
  aux`, PID 14797, running since 01:17, consuming 81.9% CPU at the moment
  of this audit — i.e. **not hypothetical, not a one-off, actively
  running right now**). It reads its own instructions from
  `.opencode/opencode.md`, which describes the `.artifacts/` structure
  and a `workflow-state.json`-based state model, and does **not**
  reference any `WRITER-LOCK` file convention at all.

### 1.1 The architecture document itself is not stable

`workflow-architecture.md`, read early in this session, was at that time
an ~816-line document (sections 1–18: OpenCode setup, available agents,
proposed routing, the full state machine including the `WRITER-LOCK`
protocol, motion safety, etc.). **As of this audit, the file on disk is
435 lines and starts at `## 6. Workflow State Machine`** — sections 1–5
(OpenCode setup discovery, available agents, proposed routing) are
**absent**, and the described state-persistence mechanism has changed
from a file-based `WRITER-LOCK` to a JSON field (`"lock": null` inside
`workflow-state.json`).

This means **the single document that was supposed to be the shared
source of truth for the safety protocol has itself been silently
rewritten mid-session**, and the new version describes a different,
incompatible protection mechanism than the one this session has been
operating under. This is not a hypothetical risk — it already happened,
during this same session, to the document that defines the rules.

---

## 2. Writers & Permissions

No OS-level access control separates these processes — both run as the
same local user, with full read/write on the entire repository. "Writer"
here means "any process capable of writing," not a permissions boundary.

| Writer | Mechanism | Can write `.artifacts/`? | Can write `app/`, `components/`, `lib/`? | Enforcement |
|---|---|---|---|---|
| **Claude (this session)** | Direct tool calls (Write/Edit) | Yes | Yes, when a Gate is granted | Self-imposed convention only — no filesystem restriction |
| **OpenCode `workflow-architect`** | `.opencode/agents/workflow-architect.md`, orchestrates other opencode agents | Yes — confirmed, it already has (root-cause.md, qa/, final-review/, implementation/) | Per its own agent's role restrictions (a social/prompt convention on their side, not inspected further here — those are their agent files, not this project's code) | None observed |
| **OpenCode `code-reviewer`, `evidence-collector`, `minimal-change-engineer`, `senior-developer`, `test-automation-engineer`, etc.** | Individual `.opencode/agents/*.md` files | Presumed yes (per their own agent definitions, e.g. `minimal-change-engineer` explicitly writes files) | Presumed yes for the writer-role agents | None observed |
| **`.claude/settings.local.json` hooks** | `PostToolUse` (Edit/Write/MultiEdit) and `Stop` hooks run `.claude/skills/impeccable/scripts/hook.mjs` | **No** — grepped `hook.mjs` for `artifacts`/file-write calls, no reference to `.artifacts/` found. This hook is the "impeccable" design-quality checker; unrelated to this collision surface. | N/A, read-only design checks | N/A |
| **Any human directly editing files** | Normal filesystem access | Yes | Yes | None — out of scope for agent tooling anyway |

**No git hook, no CI job, no cron/scheduled task, no file watcher was
found** that writes to `.artifacts/` (checked `.git/hooks/` — only
`.sample` templates, none executable/active; no crontab inspected —
out of scope/inaccessible from this session — but no in-repo automation
does it).

---

## 3. Collision Surface

| Path | Claude | OpenCode | Other agents | Risk |
|---|---|---|---|---|
| `.artifacts/discover/` | writes freely | writes freely | via workflow-architect delegation | **HIGH** — no filename convention prevents two systems choosing the same name (e.g. both could write `repo-structure.md`) |
| `.artifacts/audit/` (+ `evidence/`) | writes freely | writes freely, including binary screenshots | same | **HIGH** |
| `.artifacts/diagnose/` | writes freely | writes freely — **already collided once** (`root-cause.md` overwritten) | same | **CRITICAL** (demonstrated, not theoretical) |
| `.artifacts/plan/` | writes freely | writes freely | same | **MEDIUM** (no collision observed yet, but same lack of protection) |
| `.artifacts/implementation/` | writes freely, including `WRITER-LOCK` | writes freely — **nothing stops it from deleting or replacing `WRITER-LOCK` itself** | same | **CRITICAL** — this is the one path that is supposed to be the safety mechanism, and it has no protection of its own |
| `.artifacts/qa/` | writes freely | writes freely — **already collided** (7 files wiped) | same | **CRITICAL** (demonstrated) |
| `.artifacts/final-review/` | writes freely | writes freely — **already collided** (2 files wiped/replaced) | same | **CRITICAL** (demonstrated) |
| `.artifacts/workflow-state.md` (Claude's) | writes freely | does not appear to target this filename, but nothing prevents it | — | **MEDIUM** — different filename than OpenCode's own tracker avoided a direct collision so far, by luck of naming, not by design |
| `.artifacts/workflow-state.json` (OpenCode's) | not written by Claude (different tracker), but nothing prevents it | writes freely | — | **MEDIUM**, same reasoning |
| `.artifacts/workflow-architecture.md` | was written/relied upon by Claude early this session | **confirmed overwritten** — content structurally changed mid-session | — | **CRITICAL** (demonstrated) |

---

## 4. WRITER-LOCK Analysis

**Where it's created:** `.artifacts/implementation/WRITER-LOCK`, a plain
Markdown/YAML-frontmatter file, created by whichever agent begins an
IMPLEMENT stage (this session created one for the TIMING fix:
`agent: claude (single writer, this session)`, `status: in-progress` →
`completed`).

**Who creates it:** Whatever agent is about to write code — by
*convention only*. Nothing on disk enforces that only one such file can
exist, that it must be checked before writing, or that it is even
required. Its presence is advisory text.

**Who removes/updates it:** The same agent, at the end of its own
IMPLEMENT stage, editing the `status` field. No external process verifies
this happened correctly.

**What process actually verifies it before writing:** **None, as
observed.** `.opencode/opencode.md` — the file OpenCode's own
`workflow-architect` reads for instructions — does not mention
`WRITER-LOCK` at all. It describes its own "Single Writer" rule purely in
terms of *which agent role* may write code (`@minimal-change-engineer`,
`@senior-developer`, `@test-automation-engineer`), with zero reference to
checking a lock file before touching `.artifacts/`. There is no code in
either system that opens, `stat()`s, or otherwise inspects `WRITER-LOCK`
before writing elsewhere in the tree.

**What happens if another process ignores the lock:** Nothing prevents
it, and nothing detects it happened, beyond a human noticing missing
files later — exactly what occurred with the HOME artifacts.

**Does the lock have real filesystem protection?** **No.** There is no
`O_EXCL`/atomic-create-if-not-exists semantics in use, no file lock
(`flock`/advisory lock), no lockfile-with-PID-and-liveness-check pattern.
It is a plain file that any process can create, ignore, overwrite, or
delete with a normal write call.

**Can two processes write simultaneously?** Yes — nothing serializes
access. Two `Write` calls to the same path from two different processes
at the same moment would race at the OS level (last writer wins, no
corruption of a *single* file expected on macOS's local filesystem for
whole-file writes, but no coordination between *which* files get written
at all).

**Race condition?** Yes, structurally: check-then-act (an agent could in
principle check for `WRITER-LOCK`, see none, and start writing — but
between the check and the write, another process could do the same) —
though in practice the *observed* failures this session were not a tight
race, they were simply **no check ever being performed at all** by the
OpenCode side.

**Protocol enforcement vs. actual enforcement — explicit distinction:**

| | Protocol (what the docs say) | Actual (what the filesystem allows) |
|---|---|---|
| Single writer | "Only one agent writes code at a time" | Any process can write any file at any time |
| WRITER-LOCK | "Written before IMPLEMENT, removed after" | A plain file with no read/verify step enforced anywhere, and not referenced by the other system's own instructions at all |
| No scope creep | "Only files in `affected-files.md`/plan can be touched" | Nothing technically prevents any process from writing outside that list — this session self-enforced it via `git status` checks before/after; OpenCode's own instructions do not describe an equivalent check |

**Verdict: WRITER-LOCK is 100% protocol enforcement, 0% filesystem/process
enforcement, and it is not even part of the protocol the other live
system follows.**

---

## 5. Workflow State Analysis

Two files, two schemas, two owners, no reconciliation:

- `.artifacts/workflow-state.md` — Markdown, free-form, written and read
  by this session only.
- `.artifacts/workflow-state.json` — structured JSON
  (`task`/`stage`/`agent`/`gates`/`lock`), written by OpenCode's
  `workflow-architect`, describing **only the HOME investigation** task
  (`"stage": "COMPLETE"`, `"conclusion": {"bugReproduced": false, ...}"`)
  — it has no knowledge of FASE 3A/TIMING, the residual-stall
  investigation, or anything this session did afterward.

**Who can modify state:** Both systems can write either file; nothing
enforces which one "owns" which file. In practice they happened not to
target the same filename, which is why no direct overwrite of a state
file was observed — but this is incidental, not designed.

**Can Claude and OpenCode have different states?** **Yes, confirmed
right now.** `workflow-state.json` says `"stage": "COMPLETE"` for a task
called "Evaluar la arquitectura actual de Molino's Home page..." with no
mention of TIMING at all. `workflow-state.md` (this session's) describes
FASE 3B/HOME as `CLOSED — APPROVED WITH LIMITATIONS — NOT SHIPPED` and
FASE 3A/TIMING as `CLOSED / VERIFIED`. **Neither file is aware of the
other's existence or content.**

**Is there a single source of truth?** **No.** There are two,
disagreeing in scope and in outcome detail (OpenCode's JSON never
recorded a `NOT SHIPPED` qualifier or any TIMING work at all; it simply
doesn't know that happened).

**Can split-brain occur?** It has already occurred, in the mild sense
described above (two trackers, two partial views). A more severe
split-brain — e.g., one system believing SHIP was approved while the
other doesn't — is entirely possible under the current architecture,
since neither system reads the other's state file at all (nothing in
`.opencode/opencode.md` references `workflow-state.md`, and this
session's own convention never reads `workflow-state.json`).

**Can one process advance a phase while another thinks it's elsewhere?**
Yes — directly demonstrated: OpenCode's JSON believes the HOME
investigation is `COMPLETE` with no bug found and no further action
needed, which is *compatible* with but entirely independent of this
session's own FASE 3B closure (`APPROVED WITH LIMITATIONS`) — they
reached compatible conclusions this time, but nothing in the architecture
guaranteed that; it was coincidence that both investigations converged on
similar findings.

---

## 6. Phase Ownership Analysis

**No explicit phase/task ownership exists in the current architecture.**
Every directory (`qa/`, `diagnose/`, `plan/`, `implementation/`,
`final-review/`) is a flat namespace shared by every task, past and
future, from either system. Ownership is implied only by filename choice
(`timing-*.md` vs `home-*.md`), which:

- Worked *this time* because this session happened to prefix its TIMING
  files distinctly (`timing-motion-map.md`, `timing-postfix-audit.md`,
  etc.) after the HOME collision was discovered and the phase changed —
  but the HOME-phase files were **not** prefixed (`review.md`,
  `changes.md`, `desktop-home.md` — some prefixed, some not), which is
  exactly why they were collidable.
- **Is not a system.** It is an accidental, inconsistently-applied naming
  habit, not an enforced convention.

**Can the system distinguish FASE 3A from FASE 3B from a future task?**
Only by a human (or an agent) reading file *names* and inferring intent.
There is no manifest, index, or metadata file mapping
`artifact → phase → owning agent → timestamp`. `workflow-state.json` and
`workflow-state.md` each track *one* task's view of state, not a registry
of all phases and their artifact ownership.

**Can two workflows write simultaneously to `qa/`, `diagnose/`, `plan/`,
`implementation/`, `final-review/`?** Yes, with zero technical barrier —
already demonstrated for `qa/`, `implementation/`, and `final-review/`.

---

## 7. Collision Scenarios

| # | Scenario | Possible? | Why | Existing protection | Missing protection | Severity |
|---|---|---|---|---|---|---|
| A | Claude and OpenCode both write `final-review/review.md` simultaneously | **Yes** | Same shared namespace, no filename reservation, no lock | None | Namespacing, lock, or atomic create-exclusive | **CRITICAL** |
| B | Claude is mid-FASE-3B while OpenCode starts an unrelated task | **Yes — already happened** | OpenCode's own trigger is independent of this session's task boundaries; it has no visibility into what Claude is doing | None | Cross-system state visibility, at minimum a "task in progress" marker OpenCode's own instructions would respect | **CRITICAL** (demonstrated) |
| C | Two OpenCode workflows run simultaneously | **Plausible, not directly observed this session** | `.opencode/opencode.md` describes sequential single-workflow operation but nothing in this repo enforces that only one OpenCode workflow run exists at a time; that enforcement, if any, would live in OpenCode's own runtime (outside this repo, not inspectable from here) | Unknown — outside this session's visibility | Same-system concurrency control is OpenCode's responsibility, not verifiable from this audit | **MEDIUM** (unverified, plausible) |
| D | An agent ignores `WRITER-LOCK` | **Yes — already happened** | The lock is a file nobody but this session's own convention reads | None, beyond social convention | An actual check step, and ideally a mechanism that makes ignoring it hard rather than merely against instructions | **CRITICAL** (demonstrated) |
| E | A process dies leaving a stale lock | **Possible, not yet observed** | `WRITER-LOCK`'s `status` field would remain `in-progress` forever if the writing agent crashed before updating it | None — no TTL, no PID/liveness check, no staleness detection | A staleness check (age, PID-alive check, or a run-scoped lock that a fresh process can safely reclaim) | **MEDIUM** |
| F | `workflow-state.json` and `workflow-state.md` diverge | **Yes — already true right now** (see §5) | Two independent files, two independent owners, no reconciliation step | None | A single canonical state file, or an explicit cross-reference/merge step | **HIGH** |

---

## 8. Recovery / Git Analysis

- `.artifacts/` is **entirely untracked**: `git log -- .artifacts/`
  returns nothing, `git ls-files .artifacts/` returns nothing,
  `git check-ignore -v .artifacts` returns nothing (it is not listed in
  `.gitignore` either — it is simply in an untracked limbo, neither
  deliberately excluded nor ever added).
- **Consequence:** git provides **zero recovery capability** for
  anything written to `.artifacts/`, by either system. Every overwrite is
  permanent and unrecoverable through git, full stop.
- **What is recoverable, and how:** only the *code* changes are safe,
  because they land in tracked files (`app/timing/page.tsx` etc.) and
  `git diff`/`git status` remain a reliable, independent record of what
  actually changed in the application, regardless of what `.artifacts/`
  claims. The *narrative* (why, what evidence, what was tried) has no
  fallback once a file is overwritten, other than an agent's own
  conversation transcript (not durable outside that session) or a
  human's memory.
- No `.gitignore` change is proposed or was made by this audit (per
  instruction).

---

## 9. Hardening Options (comparison only — none implemented)

| Option | What it does | Solves collision? | Solves split-brain? | Complexity | Downside |
|---|---|---|---|---|---|
| **A. Filesystem lock** (e.g. `flock`, or atomic `O_EXCL` create of a lock file, checked by *both* systems) | A real, kernel-enforced lock that a second writer cannot silently bypass | Yes, for the moment-of-write race | No, on its own (doesn't fix diverging state files) | Medium — requires **both** systems to implement the same check, which means editing OpenCode's own instructions/tooling too (outside this repo's control) | If one system doesn't honor it (as observed), it does nothing — same fundamental gap as today's `WRITER-LOCK` unless BOTH sides are updated |
| **B. Workflow ownership / run-id namespace** (`.artifacts/runs/<run-id>/...`) | Every workflow run gets its own isolated directory; nothing is shared, so nothing can collide | Yes, structurally — no shared path, no possible overwrite | Partially — state files would also be per-run, removing the *file*-level collision, but a human/agent still needs to reconcile multiple runs' conclusions | Medium — requires a run-id generation convention and a way to find "the latest/current" run | Loses the simple "one shared `final-review/`" mental model; needs an index/registry to find things later |
| **C. Phase namespaces** (`.artifacts/phase-3a/`, `.artifacts/phase-3b/`, `.artifacts/home-investigation/`) | Similar to B but keyed by human-meaningful phase name instead of an opaque run-id | Yes, if consistently applied | Partially, same caveat as B | Low — this session already started doing this informally (`timing-*.md` prefixes) | Relies on discipline to pick non-colliding phase names; doesn't stop two systems from choosing the *same* phase name for unrelated work |
| **D. Append-only evidence** (never overwrite, only add new timestamped files; e.g. `root-cause-2026-08-01T0448.md`) | Old evidence is never destroyed, only superseded | Prevents *data loss*, does not prevent *confusion* (many files, unclear which is current) | No, doesn't touch state files directly | Low | Directory growth over time; still needs an index to know "which is authoritative" |
| **E. Git-backed artifacts** (`git add .artifacts/` + commits, possibly on a dedicated branch) | Every write becomes a recoverable, diffable, blameable commit | Doesn't prevent the *overwrite event*, but makes it **fully recoverable** and **visible** (`git log` would show both systems' commits) | No, doesn't fix diverging state *content*, but makes divergence visible/diffable | Low–Medium — needs a decision on whether both systems commit, and commit-message/authorship conventions | Commit noise if every intermediate agent scratch-file gets committed; needs `.gitignore` discipline for genuinely disposable output |
| **F. Atomic writes** (write to a temp file, `rename()` into place) | Prevents any reader from ever seeing a half-written file | Solves a *different* problem (partial-write corruption), not the overwrite-by-another-process problem | No | Low, if adopted per-writer | Doesn't address the actual observed failure mode (clean, complete overwrites — not partial writes) — the `workflow-architecture.md` truncation (§1.1) *might* be an atomic-write gap, but is equally explainable as a deliberate partial rewrite by OpenCode |
| **G. Manifest / checksum** (a tracked index recording expected files + hash, checked periodically) | Detects *that* something changed unexpectedly, after the fact | Detects, does not prevent | Detects, does not prevent | Medium | Reactive, not preventive — would have told us about the HOME loss sooner, but wouldn't have stopped it |

**None of these, alone, is sufficient.** B/C (namespacing) is the only
category that structurally *prevents* the collision rather than merely
detecting or recovering from it, but it doesn't fix split-brain in
*conclusions*. E (git-backed) is the only category that makes *any* past
state recoverable, which today is completely absent. A (real lock) only
works if every writer honors it — and the evidence here is that the two
systems don't currently share a protocol at all.

---

## 10. Recommended Minimum Safe Architecture

Combine the two options that are structurally preventive and require the
**least** cross-system coordination to be effective even if OpenCode's
own instructions are never updated:

1. **Namespace by phase, not by convention** (Option C, refined toward B):
   `.artifacts/<phase-slug>/{discover,audit,diagnose,plan,implementation,qa,final-review}/`
   instead of one shared set of top-level directories. A phase slug like
   `2026-08-01-fase-3a-timing` is human-readable *and* collision-resistant
   (a second system starting unrelated work would need to actively choose
   the exact same slug to collide — astronomically less likely than
   colliding on `review.md`).
2. **Git-track `.artifacts/`** (Option E), even without changing
   `.gitignore` today's audit scope excludes — just note it as the
   recommendation: this is the only option that makes an overwrite
   *recoverable* rather than merely *less likely*. It also makes
   cross-system interference **visible** via `git log`/`git blame`,
   which today is invisible until a human notices missing content days
   later, as happened here.
3. **One canonical state file, cross-referenced, not duplicated:**
   either both systems agree to read/write the same
   `workflow-state.json` (schema negotiated), or — more realistically,
   since this session cannot change OpenCode's own instructions — each
   system keeps its own state file **inside its own phase namespace**
   (`<phase-slug>/workflow-state.md`), and a lightweight top-level
   `INDEX.md` (append-only, one line per phase) is the only shared file,
   listing `phase-slug → owner-system → status → last-updated`. This
   keeps single-writer simplicity within a phase while making
   cross-system visibility possible without requiring OpenCode to change
   anything about how it already writes JSON.
4. **A real lock, scoped to the shared `INDEX.md` only** (Option A,
   narrowly applied): since `INDEX.md` is the *only* file both systems
   would touch, it is the only place a real lock (atomic
   create-exclusive, e.g. `INDEX.lock` via `open(..., 'wx')`/`O_EXCL`,
   with a PID + timestamp inside, and a staleness TTL of a few minutes)
   is worth the complexity of getting both systems to honor. Everything
   else lives inside a phase namespace nobody else would write to, so it
   needs no lock at all.

This is deliberately **not** a rewrite of the whole system: it keeps
multi-agent workflows, human gates, the single-writer social convention
for code, and the existing artifact *stage* subfolder structure — it just
moves that structure one level deeper, under a phase namespace, and adds
one small shared, git-tracked, append-only index with a narrowly-scoped
real lock.

---

## 11. Migration Risk

- **Low risk to already-closed phases:** FASE 0–3A's artifacts can be
  left exactly where they are (moving them retroactively risks *causing*
  the very data loss this hardening is meant to prevent). A migration
  should apply going forward only.
- **Requires a decision this session cannot make alone:** whether
  OpenCode's own `.opencode/opencode.md` gets updated to follow the same
  namespacing convention. If it is not updated, the risk is only
  *reduced* (collision requires an exact phase-slug match instead of a
  filename match) not *eliminated* — OpenCode would still default to
  writing at the top level of `.artifacts/` per its current instructions,
  which under a namespaced world would itself become the new collision
  surface (everything OpenCode writes lands outside any phase namespace,
  back in one shared bucket).
- **Git-tracking `.artifacts/` retroactively** is a one-time decision
  with its own small risk: some existing content (screenshots, verbose
  JSON) may be noisy in history; worth scoping what's tracked (e.g. `.md`
  files yes, `evidence/*.png` maybe not) rather than a blanket `git add`.
  Not a reason to avoid it, just a detail for whoever implements this.

---

## 12. Implementation Plan (DESIGN ONLY — not authorized, not started)

1. Agree on a phase-slug format (e.g. `YYYY-MM-DD-<short-name>`).
2. Update **this session's own** convention (Claude-side only, since
   OpenCode's instructions are outside this repo's authority from this
   session) to write all new-phase artifacts under
   `.artifacts/<phase-slug>/...` starting with the *next* phase, not
   retroactively.
3. Create `.artifacts/INDEX.md` (append-only) with one row per phase this
   session has closed so far, as a starting baseline.
4. Propose (to the human, and ideally reflected back into
   `.opencode/opencode.md` if the user or OpenCode's own operator wants
   parity) that OpenCode's `workflow-architect` adopt the same
   `<phase-slug>/` convention and read/append to the same `INDEX.md`
   before writing.
5. Decide and execute the `git add .artifacts/**/*.md` (scoped) tracking
   decision, as a separate, explicit, human-approved step.
6. Only after 1–5 are approved and scoped: implement the narrow
   `INDEX.lock` mechanism described in §10.4.

**None of steps 1–6 were performed by this audit.**

---

## 13. Open Risks

- **OpenCode is a live process this session cannot control or even pause.**
  Any hardening confined to how *Claude* writes to `.artifacts/` reduces
  but does not eliminate the risk, since OpenCode's own instructions
  (`.opencode/opencode.md`) would need a matching update to fully close
  the gap, and that update is outside this session's authority to make
  unilaterally without the user's separate decision on that system.
- **`workflow-architecture.md` itself is proven unstable mid-session**
  (§1.1) — any hardening design that itself lives in `.artifacts/` (this
  document included) is subject to the exact same risk it describes. This
  document could itself be overwritten or partially replaced before it is
  acted on.
- **No visibility into OpenCode's internal concurrency model** — whether
  it can run multiple workflows at once (Collision C) cannot be verified
  from this repository; it would need to be asked of whoever operates
  that system.
- **No audit trail exists for *when* each overwrite happened** beyond
  filesystem mtimes, which are not cryptographically trustworthy and
  could themselves be altered by a future write. This is precisely the
  gap Option G (manifest/checksum) or Option E (git) would close, and
  neither exists today.

---

## FINAL VERDICT

**HARDENING REQUIRED BEFORE NEXT PHASE**

Not because FASE 3A's own work is in question — it isn't; its code and
artifacts are verified and intact (see the prior Global Review). This
verdict is about **whether `.artifacts/` can be trusted as the record of
truth for a SHIP decision**, and right now it cannot: a live, independent
process has already overwritten this session's evidence once, has full
ability to do so again at any moment (confirmed running, high CPU, right
now), the two systems' state trackers already disagree in scope, and even
the shared architecture specification has been found mid-audit to be
internally inconsistent with what this session was told to rely on. None
of this is theoretical — every failure mode described above except
Collision C and Collision E has already been directly observed.

---

## Final Validation

```
git status --short
```
Result: identical to the baseline recorded at the end of the FASE 3A
global review — no new `M` entries. The only new filesystem change from
this task is the creation of this document itself:

```
?? .artifacts/final-review/artifact-integrity-hardening.md
```

**Confirmed NOT modified during this task:**
- `app/`, `components/`, `lib/`, `__tests__/`, `e2e/` — no changes.
- `.opencode/`, `.opencode/agents/` — read only (`workflow-architect.md`,
  `opencode.md` were read, not edited).
- `.claude/` — read only (`settings.json`, `settings.local.json`,
  `launch.json` were read, not edited).
- `.artifacts/workflow-state.md`, `.artifacts/workflow-state.json` — read
  only, not edited.
- No existing artifact, historical or otherwise, was modified, deleted,
  or restored.
- No lock file was created.
- No commit, push, or PR was made.
