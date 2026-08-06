// Read/update helper for the single shared cross-run index:
//   .artifacts/index.json
//
// This is the ONLY file two independent workflow systems (Claude,
// OpenCode, or any future one) are expected to both touch. Every write
// goes through the real lock (lock.mjs) + atomic write (atomic-write.mjs).
//
// Race-freedom here comes from lock serialization, not optimistic
// concurrency: `mutate()` always runs against the index as it exists at
// the moment the lock is held (re-read fresh under the lock, not the
// caller's possibly-stale earlier snapshot), so no update is ever lost —
// two concurrent `updateIndex()` calls simply queue behind the lock.
// `cas` is kept as a monotonic version counter for provenance/audit (“this
// index has been written N times”), not as a stale-read detector.
//
// The "don't silently overwrite someone else's work" guarantee this
// system provides lives one level down, in write-artifact.mjs: writing an
// artifact file explicitly checks whether the target run belongs to the
// caller's own workflowId before writing, and fails closed
// ("COLLISION DETECTED") if it doesn't.

import { existsSync, readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { atomicWriteFileSync } from "./atomic-write.mjs";
import { withLock } from "./lock.mjs";

const INDEX_PATH = path.resolve(process.cwd(), ".artifacts/index.json");
const LOCK_PATH = `${INDEX_PATH}.lock`;

function emptyIndex() {
  return { version: 1, cas: 0, updatedAt: null, runs: {} };
}

/** Read the current index. Returns an empty-but-valid shape if the file
 * does not exist yet (first-ever call in a fresh checkout) — this NEVER
 * creates the file itself; only a write does that. */
export function readIndex() {
  if (!existsSync(INDEX_PATH)) return emptyIndex();
  const raw = readFileSync(INDEX_PATH, "utf-8");
  if (!raw.trim()) return emptyIndex();
  return JSON.parse(raw);
}

/**
 * Apply `mutate(indexCopy) -> indexCopy` under the real lock. Serialized
 * by the lock, so concurrent callers queue rather than race — no update
 * is ever lost.
 *
 * This is intentionally synchronous/blocking (see lock.mjs) — these are
 * short CLI operations, not a long-running service.
 */
export function updateIndex(owner, mutate) {
  mkdirSync(path.dirname(INDEX_PATH), { recursive: true });

  return withLock(LOCK_PATH, { owner }, () => {
    const current = readIndex(); // fresh read, taken while holding the lock
    const next = mutate(structuredClone(current));
    next.cas = current.cas + 1;
    next.updatedAt = new Date().toISOString();

    atomicWriteFileSync(INDEX_PATH, JSON.stringify(next, null, 2) + "\n");
    return next;
  });
}

export { INDEX_PATH, LOCK_PATH };
