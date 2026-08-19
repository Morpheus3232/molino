#!/usr/bin/env node
// Create a new, isolated workflow run namespace under .artifacts/runs/,
// and register it in the single shared index (.artifacts/index.json)
// under the real lock.
//
// Usage:
//   node scripts/artifacts/new-run.mjs --owner claude --task "FASE 3C — X"
//
// Does NOT touch any historical artifact. Does NOT touch app/, components/,
// or lib/. This is workflow infrastructure only.

import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { updateIndex } from "./lib/index-store.mjs";
import { atomicWriteFileSync } from "./lib/atomic-write.mjs";

const STAGES = ["discover", "audit", "diagnose", "plan", "implementation", "qa", "final-review"];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i]?.replace(/^--/, "");
    out[key] = argv[i + 1];
  }
  return out;
}

function makeWorkflowId(owner) {
  const ts = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const shortUuid = randomUUID().split("-")[0];
  return `${owner}-${ts}-${shortUuid}`;
}

export function createRun({ owner, task, agent, sessionId }) {
  if (!owner) throw new Error("createRun requires --owner (e.g. claude, opencode)");
  if (!task) throw new Error("createRun requires --task (short description)");

  const workflowId = makeWorkflowId(owner);
  const artifactRoot = path.posix.join("runs", workflowId);
  const absoluteRoot = path.resolve(process.cwd(), ".artifacts", artifactRoot);

  for (const stage of STAGES) {
    mkdirSync(path.join(absoluteRoot, stage), { recursive: true });
  }

  const now = new Date().toISOString();
  const manifest = {
    workflowId,
    sessionId: sessionId ?? null,
    task,
    owner,
    agent: agent ?? null,
    stage: "DISCOVER",
    status: "ACTIVE",
    createdAt: now,
    updatedAt: now,
    pid: process.pid,
    artifactRoot: `.artifacts/${artifactRoot}`,
    transitions: [{ ts: now, stage: "DISCOVER", actor: owner, action: "run created" }],
  };

  // Write the manifest directly (not via the shared lock — this file
  // belongs exclusively to this run; no other process has any legitimate
  // reason to write it).
  atomicWriteFileSync(
    path.join(absoluteRoot, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  // Register in the shared index under the real lock.
  updateIndex(owner, (index) => {
    index.runs[workflowId] = {
      workflowId,
      sessionId: sessionId ?? null,
      task,
      owner,
      stage: "DISCOVER",
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      artifactRoot: `.artifacts/${artifactRoot}`,
      pid: process.pid,
    };
    return index;
  });

  return { workflowId, artifactRoot: `.artifacts/${artifactRoot}`, manifest };
}

// CLI entry point
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = parseArgs(process.argv.slice(2));
  const result = createRun(args);
  console.log(JSON.stringify(result, null, 2));
}
