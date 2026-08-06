// Real filesystem lock for the single shared mutable file in the
// .artifacts/ workflow system (.artifacts/index.json).
//
// Mechanism: open(path, O_CREAT|O_EXCL) — atomic at the OS level. A second
// process attempting the same call gets EEXIST, guaranteed by POSIX, not
// by convention. This is the same primitive git uses for `.git/index.lock`.
//
// Chosen over `flock(1)`/`shlock`: neither ships with macOS by default
// (flock(1) is util-linux/Linux-only; shlock is not guaranteed present).
// O_CREAT|O_EXCL is a POSIX syscall available on every platform Node runs
// on, with no external dependency.
//
// Scope: this lock protects ONLY the shared index file. It must never be
// used to gate writes inside a run's own namespace (those need no lock —
// namespacing already makes them exclusive).

import { openSync, writeSync, closeSync, readFileSync, unlinkSync } from "node:fs";

const DEFAULT_TTL_MS = 30_000; // stale-lock reclaim threshold, when combined with a dead pid
const DEFAULT_HARD_TTL_MS = 10 * 60_000; // reclaim regardless of pid liveness — see acquireLock() doc
const DEFAULT_RETRY_MS = 50;
const DEFAULT_MAX_WAIT_MS = 5_000;

function isPidAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0); // signal 0: existence check, doesn't actually kill
    return true;
  } catch {
    return false;
  }
}

function tryCreateLock(lockPath, holder) {
  try {
    const fd = openSync(lockPath, "wx"); // O_CREAT | O_EXCL | O_WRONLY
    try {
      writeSync(fd, JSON.stringify(holder, null, 2));
    } finally {
      closeSync(fd);
    }
    return true;
  } catch (err) {
    if (err.code === "EEXIST") return false;
    throw err;
  }
}

function readLockHolder(lockPath) {
  try {
    return JSON.parse(readFileSync(lockPath, "utf-8"));
  } catch {
    return null; // unreadable/corrupt lock — treated as unknown, not alive
  }
}

/**
 * Acquire an exclusive lock at `lockPath`. Reclaims a stale lock via two
 * independent conditions (either is sufficient once age is past ttlMs):
 *
 *   1. `ttlMs` (default 30s) elapsed AND the recorded pid is no longer
 *      alive — the common case (holder crashed).
 *   2. `hardTtlMs` (default 10min) elapsed, regardless of pid liveness —
 *      the safety-net case. Without this, a dead holder whose pid number
 *      gets reused by an unrelated live process would make condition 1
 *      permanently false (`isPidAlive` would report "alive" forever),
 *      deadlocking the shared resource indefinitely. hardTtlMs bounds
 *      that failure mode: PID reuse can delay reclaim, never prevent it
 *      forever. A genuinely live holder (see `withLock`'s intended usage
 *      — short CLI operations, seconds not minutes) will always finish
 *      and release well within hardTtlMs, so this does not weaken
 *      protection against real concurrent holders.
 *
 * Otherwise retries with backoff up to maxWaitMs, then throws — it never
 * silently proceeds without the lock.
 *
 * Returns a `release()` function. Caller MUST call it in a `finally`.
 */
export function acquireLock(
  lockPath,
  { owner, ttlMs = DEFAULT_TTL_MS, hardTtlMs = DEFAULT_HARD_TTL_MS, maxWaitMs = DEFAULT_MAX_WAIT_MS } = {}
) {
  const holder = {
    pid: process.pid,
    owner: owner ?? "unknown",
    acquiredAt: new Date().toISOString(),
  };

  const deadline = Date.now() + maxWaitMs;

  for (;;) {
    if (tryCreateLock(lockPath, holder)) {
      return () => {
        try {
          unlinkSync(lockPath);
        } catch {
          // Already gone (e.g. reclaimed by someone else after our TTL
          // expired) — releasing a lock we no longer effectively hold is
          // not an error.
        }
      };
    }

    const existing = readLockHolder(lockPath);
    const ageMs = existing?.acquiredAt ? Date.now() - Date.parse(existing.acquiredAt) : Infinity;
    const staleByAge = ageMs > ttlMs;
    const staleByLiveness = existing ? !isPidAlive(existing.pid) : true;
    const staleByHardTtl = ageMs > hardTtlMs;

    if ((staleByAge && staleByLiveness) || staleByHardTtl) {
      // Reclaim: remove the dead (or unconditionally too-old) lock and
      // retry immediately. Do not assume success — another process may
      // reclaim first; loop will simply retry.
      try {
        unlinkSync(lockPath);
      } catch {
        // Someone else reclaimed it first — fine, loop retries.
      }
      continue;
    }

    if (Date.now() > deadline) {
      throw new Error(
        `Could not acquire lock at ${lockPath}: held by pid=${existing?.pid ?? "unknown"} ` +
          `owner=${existing?.owner ?? "unknown"} acquiredAt=${existing?.acquiredAt ?? "unknown"} ` +
          `(age ${Math.round(ageMs / 1000)}s, ttl ${Math.round(ttlMs / 1000)}s, hardTtl ${Math.round(hardTtlMs / 1000)}s, ` +
          `pid alive=${!staleByLiveness}). Refusing to proceed without the lock — this is fail-closed by design.`
      );
    }

    // Busy-wait with backoff (synchronous by design — this is a short-lived
    // CLI operation, not a long-running server; a blocking wait keeps the
    // implementation simple and dependency-free).
    const until = Date.now() + DEFAULT_RETRY_MS;
    while (Date.now() < until) {
      /* spin */
    }
  }
}

/**
 * Convenience wrapper: acquire, run `fn`, always release.
 */
export function withLock(lockPath, opts, fn) {
  const release = acquireLock(lockPath, opts);
  try {
    return fn();
  } finally {
    release();
  }
}
