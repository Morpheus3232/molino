"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal fetch-with-cache-and-retry hook. Extracted from the identical
 * Map-cache + useEffect + catch pattern that IdentityScreen, ConvergentSection
 * and IntelligenceScreen each hand-rolled independently — same shape, three
 * copies. Not a general data-fetching library: just removes the duplication
 * and gives every consumer the same retry-on-error behavior instead of a
 * silent console.error that leaves the UI stuck on "Cargando..." forever.
 *
 * `key === ""` disables fetching (mirrors the `if (!birthDate) return;`
 * guards some call sites already had) — data stays null, nothing is fetched.
 */
export function useCachedFetch<T>(
  cache: Map<string, T>,
  key: string,
  fetcher: () => Promise<T>
): { data: T | null; error: boolean; retry: () => void } {
  const [data, setData] = useState<T | null>(key ? cache.get(key) ?? null : null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const keyRef = useRef(key);
  keyRef.current = key;

  useEffect(() => {
    if (!key) return;

    if (cache.has(key)) {
      setData(cache.get(key) ?? null);
      setError(false);
      return;
    }

    let cancelled = false;
    setError(false);
    fetcher()
      .then((result) => {
        if (cancelled || keyRef.current !== key) return;
        cache.set(key, result);
        setData(result);
      })
      .catch((err) => {
        if (cancelled || keyRef.current !== key) return;
        console.error(`useCachedFetch(${key}):`, err);
        setError(true);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cache, key, attempt]);

  const retry = useCallback(() => {
    if (!key) return;
    cache.delete(key);
    setData(null);
    setError(false);
    setAttempt((a) => a + 1);
  }, [cache, key]);

  return { data, error, retry };
}
