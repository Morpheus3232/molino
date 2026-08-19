#!/usr/bin/env node
// Mark a run CLOSED — after this, write-artifact.mjs refuses all further
// writes into it (see the IMMUTABILITY check there). This is the only
// supported way to "freeze" a run; there is no separate chmod step,
// because a same-user chmod is not a real barrier (see
// scripts/artifacts/README.md, Limitations) — the enforcement lives in
// write-artifact.mjs itself, which every legitimate writer must go
// through.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { atomicWriteFileSync } from "./lib/atomic-write.mjs";
import { updateIndex } from "./lib/index-store.mjs";

// Same allowlist and same-shape guard as write-artifact.mjs — duplicated
// rather than factored into a shared module, to keep this task's change
// scoped to exactly the approved file list (no new files).
const SAFE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function assertSafeSegment(value, label) {
  if (!value || !SAFE_SEGMENT.test(value)) {
    throw new Error(
      `INVALID ${label}: "${value}" — must match ${SAFE_SEGMENT} (no "/", no "..", no path separators). ` +
        `Refusing to build a filesystem path from an unvalidated value.`
    );
  }
}

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

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    out[key] = argv[i + 1];
  }
  return out;
}

export function closeRun({ workflowId, sessionId, owner }) {
  if (!workflowId) throw new Error("closeRun requires --workflow-id");
  assertSafeSegment(workflowId, "workflowId");

  const manifestPath = resolveWithinRuns(workflowId, "manifest.json");
  if (!existsSync(manifestPath)) throw new Error(`No such run: ${workflowId}`);

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

  if (manifest.sessionId && sessionId && manifest.sessionId !== sessionId) {
    throw new Error(
      `COLLISION DETECTED: run ${workflowId} belongs to sessionId=${manifest.sessionId}, ` +
        `cannot be closed by sessionId=${sessionId}.`
    );
  }

  const now = new Date().toISOString();
  manifest.status = "CLOSED";
  manifest.stage = "CLOSED";
  manifest.updatedAt = now;
  manifest.transitions.push({ ts: now, stage: "CLOSED", actor: owner ?? manifest.owner, action: "run closed" });

  atomicWriteFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  updateIndex(owner ?? manifest.owner, (index) => {
    if (index.runs[workflowId]) {
      index.runs[workflowId].status = "CLOSED";
      index.runs[workflowId].stage = "CLOSED";
      index.runs[workflowId].updatedAt = now;
    }
    return index;
  });

  return { workflowId, status: "CLOSED" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const result = closeRun({ workflowId: args["workflow-id"], sessionId: args["session-id"], owner: args.owner });
  console.log(JSON.stringify(result, null, 2));
}
