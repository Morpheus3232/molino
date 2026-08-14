/**
 * Test shim for the `server-only` package.
 *
 * `server-only` throws when imported outside a React Server Component runtime
 * (which is exactly what vitest is). In tests we want to exercise the data
 * layer directly, so this stub no-ops the guard — the actual server-only
 * enforcement still applies in the real Next.js build.
 */
export {};
