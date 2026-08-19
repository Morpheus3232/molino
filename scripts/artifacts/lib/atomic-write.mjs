// Atomic write primitives for shared workflow state under .artifacts/.
//
// This is infrastructure for the .artifacts/ workflow system. It has no
// dependency on, and is not imported by, any Molino application code.

import { openSync, writeSync, fsyncSync, closeSync, renameSync, linkSync, unlinkSync } from "node:fs";
import { randomBytes } from "node:crypto";
import path from "node:path";

function writeTempFile(destPath, content) {
  const dir = path.dirname(destPath);
  const tmpPath = path.join(
    dir,
    `.${path.basename(destPath)}.tmp-${randomBytes(6).toString("hex")}`
  );

  const fd = openSync(tmpPath, "w");
  try {
    writeSync(fd, content);
    fsyncSync(fd);
  } catch (err) {
    closeSync(fd);
    try {
      unlinkSync(tmpPath);
    } catch {
      // best-effort cleanup — if this also fails there is nothing further
      // we can safely do; the original error is what the caller needs
    }
    throw err;
  }
  closeSync(fd);
  return tmpPath;
}

/**
 * Atomically write `content` (string) to `destPath`, REPLACING it if it
 * already exists. Use for files with a single logical owner (e.g. a run's
 * own manifest.json) where "last write from the owner wins" is correct.
 *
 * NOT exclusion-safe: rename() silently replaces an existing destPath.
 * Two concurrent callers targeting the same destPath will both "succeed"
 * and one will silently lose — this function does not detect that. For
 * artifact creation where exactly one writer must win, use
 * `atomicCreateFileSync` instead.
 *
 * Throws if the write or rename fails — callers must not treat a thrown
 * error as "written." On write failure, the orphaned temp file is
 * removed before re-throwing.
 */
export function atomicWriteFileSync(destPath, content) {
  const tmpPath = writeTempFile(destPath, content);
  // rename() is the atomic step: readers never observe a partially
  // written destPath. It also silently replaces an existing destPath —
  // see the exclusion caveat above.
  renameSync(tmpPath, destPath);
}

/**
 * Atomically CREATE `destPath` with `content`, failing if it already
 * exists — with no check-then-act window.
 *
 * Mechanism: write the full, fsynced content to a temp file first, then
 * `linkSync(tmpPath, destPath)`. Unlike `rename()`, POSIX `link()` fails
 * with EEXIST if the destination already exists, atomically — there is
 * no moment where a partially-written or empty destPath is visible, and
 * no moment where two concurrent callers can both believe they created
 * it: the kernel serializes the two `link()` calls and exactly one
 * succeeds.
 *
 * Throws `ArtifactExistsError` (with `.code === "EEXIST"`) if another
 * writer already created destPath first — callers must treat this as a
 * definitive loss, not a retry-with-overwrite signal.
 *
 * Requires destPath and its temp file to be on the same filesystem
 * (guaranteed here — the temp file is created in the same directory).
 */
export class ArtifactExistsError extends Error {
  constructor(destPath) {
    super(`ARTIFACT ALREADY EXISTS: ${destPath} was created by another writer — refusing to replace it.`);
    this.name = "ArtifactExistsError";
    this.code = "EEXIST";
    this.destPath = destPath;
  }
}

export function atomicCreateFileSync(destPath, content) {
  const tmpPath = writeTempFile(destPath, content);
  try {
    linkSync(tmpPath, destPath);
  } catch (err) {
    if (err.code === "EEXIST") {
      throw new ArtifactExistsError(destPath);
    }
    throw err;
  } finally {
    // The temp file's only purpose was to stage content for link(); once
    // link() has been attempted (won or lost), it must not linger.
    try {
      unlinkSync(tmpPath);
    } catch {
      // Already gone or never existed under this name — not an error.
    }
  }
}
