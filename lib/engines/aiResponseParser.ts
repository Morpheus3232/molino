/**
 * Robust parsing for AI interpretation responses.
 *
 * The provider is asked for strict JSON, but in practice models wrap it in
 * code fences, double-encode it (a JSON string containing JSON), or trim/
 * indent it in ways that break naive JSON.parse. This module recovers only
 * clearly identifiable wrappers — it never tries to salvage arbitrary prose
 * or truncated JSON into a fake interpretation.
 *
 * Shared by:
 * - aiEngine.ts  → parseAIResponse() (legacy narrative shape + rawResponse)
 * - /api/intelligence/interpret → structural validation of the premium
 *   contract (summary/alignment/.../corePattern)
 */

export interface ParsedAIResponse {
  ok: true;
  data: Record<string, unknown>;
  /** The cleaned JSON text (wrappers removed) — safe to JSON.parse again. */
  jsonText: string;
}

export type AIResponseParseResult = ParsedAIResponse | { ok: false };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Extract a JSON object from the model's response, handling:
 * - whitespace-only padding
 * - ```json / ``` code fences
 * - a JSON string that contains the real JSON object (double-encoded)
 * - the observed production wrapper where the whole payload is nested inside
 *   the "summary" field with every other field empty
 *
 * Returns { ok: false } for anything that is not clearly recoverable JSON
 * (plain prose, truncated JSON, arrays, primitives).
 */
export function extractJSON(content: string | undefined | null): AIResponseParseResult {
  if (typeof content !== 'string') return { ok: false };
  const trimmed = content.trim();
  if (!trimmed) return { ok: false };

  // Case B/C — strip fenced code blocks: ```json ... ``` or ``` ... ```
  let cleaned = trimmed;
  if (/^```/.test(cleaned)) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
  }
  if (!cleaned) return { ok: false };

  // Case D — double-encoded: the whole response is a JSON string whose value
  // is itself the JSON object ("{"summary":"..."}").
  if (cleaned.startsWith('"')) {
    try {
      const outer: unknown = JSON.parse(cleaned);
      if (typeof outer === 'string') {
        const inner: unknown = JSON.parse(outer);
        if (isPlainObject(inner)) {
          return { ok: true, data: inner, jsonText: outer };
        }
      }
    } catch {
      // fall through to invalid
    }
    return { ok: false };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return { ok: false };
  }

  if (!isPlainObject(parsed)) return { ok: false };

  // Production-observed wrapper: the model put the entire JSON payload inside
  // the "summary" field (a JSON string) and left the rest empty. Unwrap only
  // when the inner value is a plain object carrying the contract's mandatory
  // "summary" key — a legitimate Spanish summary is never itself valid JSON.
  if (typeof parsed.summary === 'string') {
    const nestedText = parsed.summary.trim();
    if (nestedText.startsWith('{')) {
      try {
        const nested: unknown = JSON.parse(nestedText);
        if (isPlainObject(nested) && typeof nested.summary === 'string') {
          return { ok: true, data: nested, jsonText: nestedText };
        }
      } catch {
        // not a nested payload — keep the outer object
      }
    }
  }

  return { ok: true, data: parsed, jsonText: cleaned };
}

/** Heuristic: does the content look like JSON (fenced, `{`, `[`, or `"`)? */
export function looksLikeJSON(content: string | undefined | null): boolean {
  if (typeof content !== 'string') return false;
  const trimmed = content.trim();
  if (!trimmed) return false;
  if (/^```/.test(trimmed)) return true;
  return trimmed.startsWith('{') || trimmed.startsWith('[') || trimmed.startsWith('"');
}

/**
 * The JSON shape of the premium interpretation contract as the model returns
 * it (the API route maps it into a MolinoInterpretation afterwards).
 */
export interface MolinoContractJSON {
  summary: string;
  alignment?: string;
  timing?: string;
  strengths?: string[];
  tensions?: string[];
  whatToConsider?: string[];
  suggestedNextStep?: string;
  confidence?: string;
  limitations?: string[];
  opening?: string;
  corePattern?: { what: string; source: string; whyItMatters: string };
  howYouOperate?: string;
  relationalNote?: string;
  closingSynthesis?: string;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isValidCorePatternShape(value: unknown): value is MolinoContractJSON['corePattern'] {
  if (!isPlainObject(value)) return false;
  const { what, source, whyItMatters } = value;
  return typeof what === 'string' && typeof source === 'string' && typeof whyItMatters === 'string';
}

/**
 * Structural validation of the premium interpretation contract.
 *
 * Not an exhaustive schema check — it protects the fields the UI actually
 * renders against the failure modes observed in production:
 * - summary must be present and a non-empty string (everything keys off it)
 * - corePattern must be an object with string what/source/whyItMatters; a
 *   string here means the model answered in the wrong shape → invalid
 * - every string field must be a string when present
 * - every expected array must be an array of strings when present
 */
export function isValidMolinoInterpretation(data: unknown): data is MolinoContractJSON {
  if (!isPlainObject(data)) return false;

  if (typeof data.summary !== 'string' || data.summary.trim() === '') return false;

  const stringFields: Array<keyof MolinoContractJSON> = [
    'alignment',
    'timing',
    'suggestedNextStep',
    'confidence',
    'opening',
    'howYouOperate',
    'relationalNote',
    'closingSynthesis',
  ];
  for (const field of stringFields) {
    if (data[field] !== undefined && typeof data[field] !== 'string') return false;
  }

  const arrayFields: Array<keyof MolinoContractJSON> = [
    'strengths',
    'tensions',
    'whatToConsider',
    'limitations',
  ];
  for (const field of arrayFields) {
    if (data[field] !== undefined && !isStringArray(data[field])) return false;
  }

  if (data.corePattern !== undefined && !isValidCorePatternShape(data.corePattern)) return false;

  return true;
}

/**
 * Reasoning models sometimes leak their chain-of-thought / task-planning
 * into the actual field VALUES instead of writing the interpretation —
 * observed in production as `"summary": "We need to produce JSON with
 * fields as specified. Use data from user context..."`. That text is
 * formally valid JSON (right types, right shape) so isValidMolinoInterpretation
 * accepts it — structural validation alone cannot catch this. These patterns
 * catch the model narrating its own instructions instead of writing Spanish
 * interpretive prose for the user.
 */
const META_LANGUAGE_PATTERNS: RegExp[] = [
  /\bwe need to\b/i,
  /\bproduce (the |a )?json\b/i,
  /\buse data from\b/i,
  /\bthe user\b/i,
  /\bthe model\b/i,
  /\bfields as specified\b/i,
  /\bsystem prompt\b/i,
  /\b(the )?instructions?\b/i,
  /\breasoning\b/i,
  /\banalysis\b/i,
  // The model echoing its own schema/field names back as prose ("summary:
  // connective synthesis...", "corePattern: object with what, source...") —
  // legitimate Spanish interpretive text never contains these as labels.
  /\b(summary|corepattern|alignment|tensions|opening|closingsynthesis|whyitmatters|suggestednextstep|whattoconsider)\s*:/i,
];

function containsMetaLanguageLeak(value: unknown): boolean {
  if (typeof value !== 'string' || !value) return false;
  return META_LANGUAGE_PATTERNS.some((pattern) => pattern.test(value));
}

export interface SemanticValidationResult {
  valid: boolean;
  /** Machine-readable reason for telemetry (e.g. "meta_language_leak:summary"). */
  reason?: string;
}

/**
 * Second validation layer, run only after isValidMolinoInterpretation
 * confirms the shape is structurally correct. Rejects content that is
 * technically well-formed but not an actual human interpretation: chain-of-
 * thought leaks, or a summary too short/long to be real prose.
 *
 * Deliberately NOT a giant keyword blocklist — combines meta-language
 * detection across every user-facing string field (top-level, nested
 * corePattern, and array items) with a plain length sanity check on the
 * mandatory summary field.
 */
export function validateMolinoInterpretationSemantics(data: MolinoContractJSON): SemanticValidationResult {
  const STRING_FIELDS: Array<keyof MolinoContractJSON> = [
    'summary',
    'alignment',
    'timing',
    'opening',
    'howYouOperate',
    'relationalNote',
    'closingSynthesis',
    'suggestedNextStep',
  ];
  for (const field of STRING_FIELDS) {
    if (containsMetaLanguageLeak(data[field])) {
      return { valid: false, reason: `meta_language_leak:${field}` };
    }
  }

  if (data.corePattern) {
    for (const sub of ['what', 'source', 'whyItMatters'] as const) {
      if (containsMetaLanguageLeak(data.corePattern[sub])) {
        return { valid: false, reason: `meta_language_leak:corePattern.${sub}` };
      }
    }
  }

  const ARRAY_FIELDS: Array<keyof MolinoContractJSON> = ['strengths', 'tensions', 'whatToConsider', 'limitations'];
  for (const field of ARRAY_FIELDS) {
    const arr = data[field];
    if (Array.isArray(arr) && arr.some((item) => containsMetaLanguageLeak(item))) {
      return { valid: false, reason: `meta_language_leak:${field}` };
    }
  }

  // Real interpretive prose reads as a sentence or two, never a one-word
  // stub nor a multi-thousand-character dump (the CoT leak observed in
  // production ran to several paragraphs).
  const summaryLength = data.summary.trim().length;
  if (summaryLength < 15) {
    return { valid: false, reason: 'summary_too_short' };
  }
  if (summaryLength > 3000) {
    return { valid: false, reason: 'summary_too_long' };
  }

  return { valid: true };
}
