/**
 * PII sanitization for AI-bound prompts.
 *
 * OpenRouter's Guardrails apply PII detection and redaction to outbound
 * requests. When a prompt carries real personal data (a user's name, an
 * email, a phone number), the guardrail masks it — and if that masking
 * breaks the JSON body structure it blocks the request outright with:
 *
 *   {"code":403,"message":"Request blocked: PII detected
 *    (invalid_json_after_redaction)"}
 *
 * This module is the single choke point that keeps real PII out of prompts
 * BEFORE they reach any provider, so there is never anything for a guardrail
 * to redact (the request stays valid and is never blocked).
 *
 * Design:
 * - The user's real name is replaced with a stable, non-identifying
 *   pseudonym. Molino's onboarding only ever asks for birth date (bug/name
 *   field is optional and unused downstream — see types/user.ts), so no
 *   product value is lost: the model interprets symbolic data, not identity.
 * - Free-text fields the user can type (questions, conversation history,
 *   decision text) are scanned and masked for common PII shapes (emails,
 *   phone numbers, credit-card-like numbers).
 */
export type PIIMode = 'pseudonym' | 'mask' | 'passthrough';

/**
 * Stable, non-identifying pseudonyms, chosen so the same user always gets the
 * same alias across turns (deterministic on their input) without exposing
 * their real identity.
 */
const PSEUDONYM_POOL = [
  'Consultante',
  'Aurora',
  'Luz',
  'Río',
  'Zenith',
  'Amanecer',
];

/** Pick a stable pseudonym for a given seed string (name + birth date). */
export function pseudonymFor(name: string, seed = ''): string {
  const input = `${name}:${seed}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return PSEUDONYM_POOL[hash % PSEUDONYM_POOL.length];
}

/**
 * Emails, phone numbers (AR international format and domestic variants),
 * and long digit-run identifiers (credit-card / ID-like). Applied to
 * free-text the user controls.
 */
const PII_PATTERNS: RegExp[] = [
  /\b[\w.+-]+@[\w-]+\.[\w.]+/g,
  /\b(?:\+?\d{1,3}[-. ]?)?(?:\(?\d{2,4}\)?[-. ]?)\d{3,4}[-. ]?\d{3,4}\b/g,
  /\b(?:4\d{3}|5[1-5]\d{2}|3[47]\d{2}|6(?:011|5\d{2}))[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g,
];

/**
 * Replace the user's real name in any free text with their stable pseudonym,
 * then mask remaining PII shapes. Deterministic given the same name/seed.
 */
export function sanitizeUserText(text: string, name: string, seed = ''): string {
  if (!text) return text;
  let out = text;
  if (name) {
    const pseudonym = pseudonymFor(name, seed);
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRe = new RegExp(`\\b${escaped}\\b`, 'gi');
    out = out.replace(nameRe, pseudonym);
  }
  for (const pattern of PII_PATTERNS) {
    out = out.replace(pattern, '[oculto]');
  }
  return out;
}

/**
 * Sanitize a profile's display name for use in prompts.
 * mode 'pseudonym' (default) returns a stable alias; 'mask' returns a
 * literal token; 'passthrough' returns the raw name (testing only).
 */
export function sanitizeNameForPrompt(
  name: string,
  seed = '',
  mode: PIIMode = 'pseudonym'
): string {
  if (mode === 'passthrough') return name;
  if (mode === 'mask') return '[nombre]';
  return name ? pseudonymFor(name, seed) : 'la persona';
}
