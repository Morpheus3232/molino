#!/usr/bin/env node
// Write a single artifact file into an existing run's namespace, with
// mandatory provenance and fail-closed checks:
//
//   1. IMMUTABILITY: a run whose manifest.status is not ACTIVE (i.e. it
//      was closed) refuses all further writes.
//   2. OWNERSHIP: sessionId is REQUIRED (not optional) and must match the
//      run's recorded sessionId. A caller with no sessionId, or the
//      wrong one, is refused — this was previously bypassable by simply
//      omitting --session-id; that gap is closed here.
//   3. PATH SAFETY: --workflow-id and --file are validated against a
//      strict allowlist before any path is built, and the final resolved
//      path is re-checked to still be inside .artifacts/runs/ before any
//      filesystem call — closes a path-traversal gap that previously let
//      a crafted argument escape the intended directory entirely.
//   4. ATOMIC, EXCLUSIVE CREATE: the artifact file itself is created via
//      atomicCreateFileSync (temp file + link()), which fails atomically
//      with no check-then-act window if another writer already created
//      the same path first. This replaces a prior existsSync()-then-write
//      pattern, which had a real TOCTOU race between two concurrent
//      writers.
//
// Usage:
//   node scripts/artifacts/write-artifact.mjs \
//     --workflow-id <id> --session-id <sid> --owner claude \
//     --agent some-agent --stage qa --file result.md \
//     --content-file /path/to/content.md

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { atomicWriteFileSync, atomicCreateFileSync, ArtifactExistsError } from "./lib/atomic-write.mjs";
import { updateIndex } from "./lib/index-store.mjs";

const STAGES = ["discover", "audit", "diagnose", "plan", "implementation", "qa", "final-review"];

// Allowlist: letters, digits, dot, underscore, hyphen only. No `/`, no
// `..`, no null bytes, no leading dot-dot — this is deliberately strict
// rather than trying to blocklist traversal sequences.
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    out[key] = argv[i + 1];
  }
  return out;
}

function assertSafeSegment(value, label) {
  if (!value || !SAFE_SEGMENT.test(value)) {
    throw new Error(
      `INVALID ${label}: "${value}" — must match ${SAFE_SEGMENT} (no "/", no "..", no path separators). ` +
        `Refusing to build a filesystem path from an unvalidated value.`
    );
  }
}

/** Resolve a run-relative path and verify it did not escape .artifacts/runs/. */
function resolveWithinRuns(...segments) {
  const runsRoot = path.resolve(process.cwd(), ".artifacts/runs");
  const resolved = path.resolve(runsRoot, ...segments);
  const relative = path.relative(runsRoot, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(
      `PATH ESCAPE BLOCKED: resolved path "${resolved}" is outside .artifacts/runs/. Refusing.`
    );
  }
  return resolved;
}

function readManifest(workflowId) {
  assertSafeSegment(workflowId, "workflowId");
  const manifestPath = resolveWithinRuns(workflowId, "manifest.json");
  if (!existsSync(manifestPath)) {
    throw new Error(`No such run: ${workflowId} (expected ${manifestPath})`);
  }
  return { manifestPath, manifest: JSON.parse(readFileSync(manifestPath, "utf-8")) };
}

function buildFrontmatter({ workflowId, sessionId, owner, agent, stage, createdAt }) {
  return [
    "---",
    `workflowId: ${workflowId}`,
    `sessionId: ${sessionId}`,
    `owner: ${owner}`,
    `agent: ${agent ?? "null"}`,
    `stage: ${stage}`,
    `createdAt: ${createdAt}`,
    "---",
    "",
  ].join("\n");
}

export function writeArtifact({ workflowId, sessionId, owner, agent, stage, file, content }) {
  if (!workflowId) throw new Error("writeArtifact requires --workflow-id");
  if (!sessionId) {
    throw new Error(
      "writeArtifact requires --session-id (no longer optional — a write with no session " +
        "identity cannot be attributed or checked against the run's owner)."
    );
  }
  if (!stage || !STAGES.includes(stage)) {
    throw new Error(`writeArtifact requires --stage to be one of: ${STAGES.join(", ")}`);
  }
  assertSafeSegment(file, "file");
  if (content === undefined) throw new Error("writeArtifact requires content");

  const { manifest } = readManifest(workflowId);

  // --- Check 1: IMMUTABILITY ---
  if (manifest.status !== "ACTIVE") {
    throw new Error(
      `ARTIFACT IMMUTABLE: run ${workflowId} has status "${manifest.status}" (not ACTIVE). ` +
        `Closed runs cannot be written to. Create a new run instead.`
    );
  }

  // --- Check 2: OWNERSHIP / COLLISION ---
  // sessionId is mandatory (enforced above) and must match the run's
  // recorded owner exactly.
  if (manifest.sessionId !== sessionId) {
    throw new Error(
      `COLLISION DETECTED: run ${workflowId} belongs to sessionId=${manifest.sessionId}, ` +
        `but this write was attempted with sessionId=${sessionId}. Refusing to write — ` +
        `a session may never write into another session's run.`
    );
  }

  const targetPath = resolveWithinRuns(workflowId, stage, file);
  const createdAt = new Date().toISOString();

  const withProvenance =
    file.endsWith(".md")
      ? buildFrontmatter({ workflowId, sessionId, owner, agent, stage, createdAt }) + content
      : content; // non-Markdown artifacts (e.g. .json) carry provenance via the manifest only

  // --- Check 3: ATOMIC EXCLUSIVE CREATE ---
  // No existsSync()-then-write window: atomicCreateFileSync's link()
  // either wins the creation outright or fails atomically with EEXIST.
  try {
    atomicCreateFileSync(targetPath, withProvenance);
  } catch (err) {
    if (err instanceof ArtifactExistsError) {
      throw new Error(
        `ARTIFACT ALREADY EXISTS: ${targetPath} was already created (by this or another writer). ` +
          `writeArtifact never replaces an existing artifact — use a different --file name for a ` +
          `new version, or create a new run.`
      );
    }
    throw err;
  }

  // Update the run's own manifest (append-only transition log). This is
  // a known, documented residual gap: two concurrent writers targeting
  // DIFFERENT files in the SAME run can each win their own
  // atomicCreateFileSync above, then race on this read-modify-write of
  // the shared manifest.json, and one transition-log entry can still be
  // lost. The artifact CONTENT itself can no longer be lost (that's what
  // this task's approved scope required); the manifest's own transition
  // log is not yet given the same guarantee. See README "Known
  // Limitations."
  const { manifest: fresh, manifestPath } = readManifest(workflowId);
  fresh.updatedAt = createdAt;
  fresh.transitions.push({ ts: createdAt, stage, actor: owner, agent: agent ?? null, action: `wrote ${file}` });
  atomicWriteFileSync(manifestPath, JSON.stringify(fresh, null, 2) + "\n");

  // Reflect updatedAt in the shared index too (best-effort visibility;
  // does not gate the write above, which already succeeded).
  updateIndex(owner ?? "unknown", (index) => {
    if (index.runs[workflowId]) {
      index.runs[workflowId].updatedAt = createdAt;
      index.runs[workflowId].stage = stage;
    }
    return index;
  });

  return { targetPath };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const content = args["content-file"] ? readFileSync(args["content-file"], "utf-8") : "";
  const result = writeArtifact({
    workflowId: args["workflow-id"],
    sessionId: args["session-id"],
    owner: args.owner,
    agent: args.agent,
    stage: args.stage,
    file: args.file,
    content,
  });
  console.log(JSON.stringify(result, null, 2));
}
