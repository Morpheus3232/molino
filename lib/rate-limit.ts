/**
 * In-memory sliding-window rate limiter.
 *
 * Designed for serverless API routes (Next.js Edge / Node runtime).
 * Each route should call `checkRateLimit(key, opts)` at the top of its handler.
 *
 * Limitations (known and acceptable for this product stage):
 * - Resets on cold start (serverless) — not a security boundary, just abuse
 *   throttling.
 * - Per-instance only — two concurrent lambdas won't share state. Use
 *   Upstash/Redis for distributed limits if Molino outgrows a single region.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Evict stale entries every 5 minutes to bound memory.
let lastEviction = Date.now();
function evictExpired() {
  if (Date.now() - lastEviction < 300_000) return;
  lastEviction = Date.now();
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export interface RateLimitConfig {
  /** Maximum requests allowed within the window. */
  maxRequests: number;
  /** Window duration in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check (and increment) the rate limit for a given key.
 *
 * @param key   Unique identifier (e.g. IP + route, or profileHash + route).
 * @param config  { maxRequests, windowMs }.
 * @returns     { allowed, remaining, resetAt }.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
): RateLimitResult {
  evictExpired();

  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // New window
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs };
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt };
}

/** Convenience: build a key from IP + route. */
export function rateLimitKey(ip: string, route: string): string {
  return `${ip}:${route}`;
}

// ── Preset configs ────────────────────────────────────────────────

/** AI endpoints: 10 requests per minute (generous for single user). */
export const AI_RATE_LIMIT: RateLimitConfig = { maxRequests: 10, windowMs: 60_000 };

/** Payment endpoints: 5 requests per minute. */
export const PAYMENT_RATE_LIMIT: RateLimitConfig = { maxRequests: 5, windowMs: 60_000 };

/** Coupon endpoint: 3 attempts per 5 minutes (anti brute-force). */
export const COUPON_RATE_LIMIT: RateLimitConfig = { maxRequests: 3, windowMs: 300_000 };

/** Check/verify: 10 per minute (premium gate checks are frequent). */
export const CHECK_RATE_LIMIT: RateLimitConfig = { maxRequests: 10, windowMs: 60_000 };

// ── Next.js response helpers ──────────────────────────────────────

import { NextResponse } from "next/server";

/**
 * Build a 429 response with standard rate-limit headers.
 */
export function rateLimitResponse(resetAt: number): NextResponse {
  const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
  return NextResponse.json(
    { error: "Demasiadas solicitudes. Intentá de nuevo en unos segundos." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-RetryAfter": String(retryAfter),
      },
    },
  );
}

/**
 * Extract client IP from request headers (Vercel / Next.js).
 */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}
