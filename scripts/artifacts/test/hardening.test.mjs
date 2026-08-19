#!/usr/bin/env node
// Minimal, dependency-free smoke tests for the artifact hardening
// mechanism. Not a full suite — just enough to demonstrate the specific
// guarantees this task required: isolation, fail-closed overwrite
// protection (including under REAL concurrency, not simulation), atomic
// writes, immutability, and stale-lock reclaim.
//
// Run: node scripts/artifacts/test/hardening.test.mjs
//
// This creates real (small, clearly-labeled owner:"test") runs under
// .artifacts/runs/ to validate the real mechanism end-to-end — it does
// NOT touch any file outside .artifacts/runs/ and .artifacts/index.json,
// and never touches any pre-existing/historical artifact.

import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync, readdirSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { createRun } from "../new-run.mjs";
import { writeArtifact } from "../write-artifact.mjs";
import { closeRun } from "../close-run.mjs";
import { atomicWriteFileSync } from "../lib/atomic-write.mjs";
import { acquireLock } from "../lib/lock.mjs";
import { readIndex } from "../lib/index-store.mjs";

const REPO_ROOT = path.resolve(fileURLToPath(new URL("../../../", import.meta.url)));

let passed = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(`        ${err.message}`);
    process.exitCode = 1;
  }
}

async function checkAsync(name, fn) {
  try {
    await fn();
    console.log(`  PASS  ${name}`);
    passed++;
  } catch (err) {
    console.error(`  FAIL  ${name}`);
    console.error(`        ${err.message}`);
    process.exitCode = 1;
  }
}

console.log("== 1. Atomic write ==");
check("writes content that reads back identical, no stray temp file", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "molino-atomic-"));
  const target = path.join(dir, "file.txt");
  atomicWriteFileSync(target, "hello world");
  assert.equal(readFileSync(target, "utf-8"), "hello world");
  const leftovers = readdirSync(dir).filter((f) => f.includes(".tmp-"));
  assert.equal(leftovers.length, 0, "no temp file should remain after a successful write");
  rmSync(dir, { recursive: true, force: true });
});

console.log("== 2. Real filesystem lock (mutual exclusion) ==");
check("a second acquire on the same lock path fails fast instead of silently succeeding", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "molino-lock-"));
  const lockPath = path.join(dir, "test.lock");
  const release1 = acquireLock(lockPath, { owner: "test-holder", maxWaitMs: 100 });
  assert.throws(
    () => acquireLock(lockPath, { owner: "test-contender", maxWaitMs: 200 }),
    /Could not acquire lock/,
    "second acquire must throw, not silently proceed"
  );
  release1();
  const release2 = acquireLock(lockPath, { owner: "test-after-release", maxWaitMs: 100 });
  release2();
  rmSync(dir, { recursive: true, force: true });
});

console.log("== 2b. Stale lock reclaim: dead pid within ttlMs ==");
check("a lock held by a pid that no longer exists is reclaimed", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "molino-lock-stale-"));
  const lockPath = path.join(dir, "test.lock");
  // A pid essentially guaranteed not to exist, with an old acquiredAt.
  writeFileSync(
    lockPath,
    JSON.stringify({ pid: 999999, owner: "dead-holder", acquiredAt: new Date(Date.now() - 60_000).toISOString() })
  );
  const release = acquireLock(lockPath, { owner: "test-reclaimer", ttlMs: 1000, maxWaitMs: 500 });
  release();
  rmSync(dir, { recursive: true, force: true });
});

console.log("== 2c. Stale lock reclaim: PID-reuse simulation (alive pid, past hard TTL) ==");
check(
  "a lock whose recorded pid is genuinely alive (simulating PID reuse by an unrelated process) is still reclaimed once it exceeds the hard TTL — this is the fix for the confirmed permanent-deadlock finding",
  () => {
    const dir = mkdtempSync(path.join(os.tmpdir(), "molino-lock-pidreuse-"));
    const lockPath = path.join(dir, "test.lock");
    // process.pid is guaranteed alive (it's us) — this simulates a dead
    // original holder whose pid number got reused by this unrelated,
    // very-much-alive process. Before the fix, staleByLiveness would be
    // false forever here, deadlocking the lock permanently.
    writeFileSync(
      lockPath,
      JSON.stringify({
        pid: process.pid,
        owner: "reused-pid-holder",
        acquiredAt: new Date(Date.now() - 20 * 60_000).toISOString(), // 20 min old
      })
    );
    // ttlMs alone would never reclaim this (pid is "alive"); hardTtlMs
    // (default 10min) must be what reclaims it.
    const release = acquireLock(lockPath, { owner: "test-reclaimer", ttlMs: 1000, hardTtlMs: 5 * 60_000, maxWaitMs: 500 });
    release();
    rmSync(dir, { recursive: true, force: true });
  }
);

console.log("== 3. Session isolation: two runs get distinct namespaces ==");
let runA, runB;
check("createRun twice yields two different workflowIds and directories", () => {
  runA = createRun({ owner: "test", task: "hardening-test-run-A", sessionId: "session-A" });
  runB = createRun({ owner: "test", task: "hardening-test-run-B", sessionId: "session-B" });
  assert.notEqual(runA.workflowId, runB.workflowId);
  assert.notEqual(runA.artifactRoot, runB.artifactRoot);
  assert.ok(existsSync(path.resolve(process.cwd(), runA.artifactRoot, "manifest.json")));
  assert.ok(existsSync(path.resolve(process.cwd(), runB.artifactRoot, "manifest.json")));
});

console.log("== 4. Provenance recorded ==");
check("a written artifact carries workflowId/sessionId/owner/stage/createdAt frontmatter", () => {
  const { targetPath } = writeArtifact({
    workflowId: runA.workflowId,
    sessionId: "session-A",
    owner: "test",
    agent: "hardening-test",
    stage: "qa",
    file: "probe.md",
    content: "# probe content\n",
  });
  const written = readFileSync(targetPath, "utf-8");
  assert.match(written, new RegExp(`workflowId: ${runA.workflowId}`));
  assert.match(written, /sessionId: session-A/);
  assert.match(written, /owner: test/);
  assert.match(written, /stage: qa/);
  assert.match(written, /createdAt: \d{4}-\d{2}-\d{2}T/);
  assert.match(written, /# probe content/);
});

console.log("== 5. Fail-closed: missing --session-id ==");
check("writeArtifact with no sessionId throws and writes nothing (previously this silently succeeded)", () => {
  const before = existsSync(path.resolve(process.cwd(), runA.artifactRoot, "qa", "no-session.md"));
  assert.equal(before, false);
  assert.throws(
    () =>
      writeArtifact({
        workflowId: runA.workflowId,
        // sessionId intentionally omitted
        owner: "test",
        stage: "qa",
        file: "no-session.md",
        content: "should never land",
      }),
    /requires --session-id/
  );
  const after = existsSync(path.resolve(process.cwd(), runA.artifactRoot, "qa", "no-session.md"));
  assert.equal(after, false, "the file must not have been created");
});

console.log("== 6. Fail-closed: cross-session write hijack (wrong session-id supplied) ==");
check("writeArtifact into runA with sessionId=session-B throws COLLISION DETECTED and writes nothing", () => {
  const before = existsSync(path.resolve(process.cwd(), runA.artifactRoot, "qa", "hijacked.md"));
  assert.equal(before, false);
  assert.throws(
    () =>
      writeArtifact({
        workflowId: runA.workflowId,
        sessionId: "session-B", // NOT the owner of runA
        owner: "test",
        stage: "qa",
        file: "hijacked.md",
        content: "should never land",
      }),
    /COLLISION DETECTED/
  );
  const after = existsSync(path.resolve(process.cwd(), runA.artifactRoot, "qa", "hijacked.md"));
  assert.equal(after, false, "the file must not have been created");
});

console.log("== 7. Fail-closed: path traversal via --workflow-id and --file ==");
check("a crafted workflowId is rejected before any path is touched", () => {
  assert.throws(
    () =>
      writeArtifact({
        workflowId: "../../../../tmp/molino-traversal-attempt",
        sessionId: "session-A",
        owner: "test",
        stage: "qa",
        file: "evil.md",
        content: "should never land anywhere",
      }),
    /INVALID workflowId/
  );
});
check("a crafted --file is rejected before any path is touched", () => {
  assert.throws(
    () =>
      writeArtifact({
        workflowId: runA.workflowId,
        sessionId: "session-A",
        owner: "test",
        stage: "qa",
        file: "../../../../implementation/WRITER-LOCK",
        content: "should never land anywhere",
      }),
    /INVALID file/
  );
  // Confirm the real, protected file was not touched.
  const writerLock = readFileSync(path.resolve(process.cwd(), ".artifacts/implementation/WRITER-LOCK"), "utf-8");
  assert.match(writerLock, /agent: claude/, "WRITER-LOCK must be unmodified");
});

console.log("== 8. Fail-closed: existing artifact cannot be silently replaced ==");
check("writing the same --file twice into the same run throws ARTIFACT ALREADY EXISTS on the second attempt", () => {
  writeArtifact({
    workflowId: runA.workflowId,
    sessionId: "session-A",
    owner: "test",
    stage: "qa",
    file: "once-only.md",
    content: "first write",
  });
  assert.throws(
    () =>
      writeArtifact({
        workflowId: runA.workflowId,
        sessionId: "session-A",
        owner: "test",
        stage: "qa",
        file: "once-only.md",
        content: "second write attempt",
      }),
    /ARTIFACT ALREADY EXISTS/
  );
  const finalContent = readFileSync(
    path.resolve(process.cwd(), runA.artifactRoot, "qa", "once-only.md"),
    "utf-8"
  );
  assert.match(finalContent, /first write/, "content must still be the first writer's");
  assert.doesNotMatch(finalContent, /second write attempt/);
});

console.log("== 9. Immutability after close ==");
check("closeRun then writeArtifact into the same run throws ARTIFACT IMMUTABLE", () => {
  closeRun({ workflowId: runB.workflowId, sessionId: "session-B", owner: "test" });
  assert.throws(
    () =>
      writeArtifact({
        workflowId: runB.workflowId,
        sessionId: "session-B",
        owner: "test",
        stage: "qa",
        file: "too-late.md",
        content: "should be refused",
      }),
    /ARTIFACT IMMUTABLE/
  );
  const exists = existsSync(path.resolve(process.cwd(), runB.artifactRoot, "qa", "too-late.md"));
  assert.equal(exists, false);
});

console.log("== 10. Shared index reflects both runs, closed status recorded ==");
check("index.json has entries for runA (ACTIVE) and runB (CLOSED)", () => {
  const index = readIndex();
  assert.ok(index.runs[runA.workflowId], "runA missing from index");
  assert.ok(index.runs[runB.workflowId], "runB missing from index");
  assert.equal(index.runs[runA.workflowId].status, "ACTIVE");
  assert.equal(index.runs[runB.workflowId].status, "CLOSED");
});

console.log("== 11. REAL two-process concurrent creation of the SAME artifact path ==");
await checkAsync(
  "exactly one of two real, simultaneously-spawned OS processes wins atomicCreateFileSync; the other gets EEXIST; no mixed content; the loser's content never lands",
  async () => {
    const runC = createRun({ owner: "test", task: "hardening-test-concurrency", sessionId: "session-C" });
    const targetPath = path.resolve(process.cwd(), runC.artifactRoot, "qa", "race-target.md");

    // Two genuinely separate `node` child processes, both racing to
    // create the exact same path via the exact same primitive under
    // test. Spawned with `spawn` (async, non-blocking) and started back
    // to back so their filesystem calls actually overlap, not
    // `spawnSync` (which would serialize them and prove nothing).
    const atomicWriteModulePath = path.join(REPO_ROOT, "scripts/artifacts/lib/atomic-write.mjs");

    function raceChild(label) {
      const script = `
        import(${JSON.stringify(atomicWriteModulePath)}).then(({ atomicCreateFileSync }) => {
          try {
            atomicCreateFileSync(${JSON.stringify(targetPath)}, "CONTENT FROM ${label}");
            console.log("RESULT:${label}:created");
          } catch (e) {
            console.log("RESULT:${label}:failed:" + e.code);
          }
        });
      `;
      return new Promise((resolve) => {
        const child = spawn(process.execPath, ["--input-type=module", "-e", script], { cwd: REPO_ROOT });
        let out = "";
        child.stdout.on("data", (d) => (out += d.toString()));
        child.on("close", () => resolve(out));
      });
    }

    const [outA, outB] = await Promise.all([raceChild("WRITER1"), raceChild("WRITER2")]);

    const created = [outA, outB].filter((o) => o.includes(":created")).length;
    const failed = [outA, outB].filter((o) => o.includes(":failed:EEXIST")).length;

    assert.equal(created, 1, `expected exactly 1 winner, got ${created}. outA=${outA.trim()} outB=${outB.trim()}`);
    assert.equal(failed, 1, `expected exactly 1 EEXIST loser, got ${failed}. outA=${outA.trim()} outB=${outB.trim()}`);

    const finalContent = readFileSync(targetPath, "utf-8");
    const isWriter1 = finalContent === "CONTENT FROM WRITER1";
    const isWriter2 = finalContent === "CONTENT FROM WRITER2";
    assert.ok(isWriter1 || isWriter2, "final content must be exactly one writer's content, not mixed/empty/corrupt");
    assert.notEqual(finalContent, "", "final content must not be empty");

    console.log(`        winner: ${isWriter1 ? "WRITER1" : "WRITER2"} | outA="${outA.trim()}" outB="${outB.trim()}"`);
  }
);

console.log(`\n${passed} check(s) passed${process.exitCode ? ", failures above" : ""}.`);
