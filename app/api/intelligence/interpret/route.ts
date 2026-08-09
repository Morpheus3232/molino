import { NextRequest, NextResponse } from 'next/server';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import {
  buildMolinoContext,
  buildIntelligencePrompt,
  generateFallbackInterpretation,
  type InterpretationType,
  type MolinoInterpretation,
  type ConversationTurn,
  type ReadingContext,
} from '@/lib/engines/intelligenceEngine';
import { generateWithOpenAI, generateWithClaude, OPENROUTER_MODEL_DEFAULT } from '@/lib/engines/aiEngine';
import { extractJSON, isValidMolinoInterpretation, validateMolinoInterpretationSemantics } from '@/lib/engines/aiResponseParser';
import { generateWithRouting, getProviderStatus, type Provider } from '@/lib/engines/providerRouter';
import { hashProfile } from '@/lib/mercadopago';
import { hasPremiumAccess, verifyPremiumToken } from '@/lib/kv';
import { recordGeneration } from '@/lib/ai/costTracking';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, AI_RATE_LIMIT } from '@/lib/rate-limit';

// "personal_profile" is the paid synthesis shown behind PremiumGate on
// /profile (Intelligence). The gate in PremiumGate.tsx only controls whether
// the component mounts — it's a UI convenience, not a security boundary. A
// direct POST to this route could otherwise read the full paid interpretation
// for any birth date without paying. Every other InterpretationType (timing,
// compatibility, daily_energy, ...) is free product content and stays open.
// "question" (the grounded chat) is gated the same way — each turn is a real
// AI call, so an ungated chat would be an open-ended cost sink, not just a
// content leak.
const PREMIUM_INTERPRETATION_TYPES = new Set<InterpretationType>(['personal_profile', 'question']);

interface RequestBody {
  type: InterpretationType;
  dob: string;
  name?: string;
  dailyEnergy?: any;
  timing?: any;
  compatibility?: any;
  entity?: any;
  decision?: any;
  question?: string;
  provider?: 'openai' | 'claude' | 'openrouter' | 'omniroute';
  /** Prior Q&A turns from the current chat session only — never persisted server-side. */
  conversationHistory?: ConversationTurn[];
  /** Compact structural context from the premium reading (type=personal_profile)
   * the user already read — grounds chat answers without re-sending the full
   * interpretation. Never persisted server-side. */
  readingContext?: ReadingContext;
  /** Device-bound premium token: proves the request comes from a paying device. */
  premiumToken?: string;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'intelligence/interpret'), AI_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json();
    const { type, dob, name, dailyEnergy, timing, compatibility, entity, decision, question, provider, conversationHistory, readingContext, premiumToken } = body as RequestBody;

    if (!dob) {
      return NextResponse.json({ error: 'Missing birth date' }, { status: 400 });
    }

    // Cap conversationHistory: max 8 turns, max 500 chars per turn.
    // Prevents token-inflation attacks from oversized client payloads.
    const MAX_HISTORY_TURNS = 8;
    const MAX_TURN_CHARS = 500;
    const safeHistory: ConversationTurn[] = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-MAX_HISTORY_TURNS).map((t) => ({
          question: String(t.question || '').slice(0, MAX_TURN_CHARS),
          answer: String(t.answer || '').slice(0, MAX_TURN_CHARS),
          answerHighlights: t.answerHighlights ? String(t.answerHighlights).slice(0, MAX_TURN_CHARS) : undefined,
        }))
      : [];

    // Cap readingContext: the chat grounds on the premium reading's structural
    // fields only, never the raw payload — small, bounded, compact.
    const safeReadingContext: ReadingContext | undefined = readingContext
      ? {
          summary: readingContext.summary ? String(readingContext.summary).slice(0, MAX_TURN_CHARS) : undefined,
          corePattern: readingContext.corePattern
            ? {
                what: String(readingContext.corePattern.what || '').slice(0, MAX_TURN_CHARS),
                source: String(readingContext.corePattern.source || '').slice(0, 200),
              }
            : undefined,
          howYouOperate: readingContext.howYouOperate ? String(readingContext.howYouOperate).slice(0, MAX_TURN_CHARS) : undefined,
          closingSynthesis: readingContext.closingSynthesis ? String(readingContext.closingSynthesis).slice(0, MAX_TURN_CHARS) : undefined,
          tensions: Array.isArray(readingContext.tensions)
            ? readingContext.tensions.slice(0, 3).map((t) => String(t).slice(0, MAX_TURN_CHARS))
            : undefined,
          alignment: readingContext.alignment ? String(readingContext.alignment).slice(0, MAX_TURN_CHARS) : undefined,
          timing: readingContext.timing ? String(readingContext.timing).slice(0, MAX_TURN_CHARS) : undefined,
          strengths: Array.isArray(readingContext.strengths)
            ? readingContext.strengths.slice(0, 3).map((t) => String(t).slice(0, MAX_TURN_CHARS))
            : undefined,
          whatToConsider: Array.isArray(readingContext.whatToConsider)
            ? readingContext.whatToConsider.slice(0, 2).map((t) => String(t).slice(0, MAX_TURN_CHARS))
            : undefined,
          suggestedNextStep: readingContext.suggestedNextStep ? String(readingContext.suggestedNextStep).slice(0, MAX_TURN_CHARS) : undefined,
          opening: readingContext.opening ? String(readingContext.opening).slice(0, MAX_TURN_CHARS) : undefined,
          relationalNote: readingContext.relationalNote ? String(readingContext.relationalNote).slice(0, MAX_TURN_CHARS) : undefined,
        }
      : undefined;

    if (PREMIUM_INTERPRETATION_TYPES.has(type)) {
      // Device-bound token verification: prevents share-URL bypass.
      // hasPremiumAccess alone is NOT enough — it only proves the profile
      // has been paid for, not that THIS device paid. The token lives
      // exclusively in localStorage of the paying device and never travels
      // in shareable URLs.
      const profileHash = hashProfile(name || '', dob);
      let premium = false;
      try {
        premium = await hasPremiumAccess(profileHash);
      } catch (err) {
        console.error('[/api/intelligence/interpret] Premium check failed:', err);
      }
      if (!premium) {
        return NextResponse.json({ error: 'Premium required' }, { status: 403 });
      }

      if (!premiumToken) {
        return NextResponse.json({ error: 'Premium token required' }, { status: 403 });
      }

      const tokenValid = await verifyPremiumToken(profileHash, premiumToken);
      if (!tokenValid) {
        return NextResponse.json({ error: 'Invalid premium token' }, { status: 403 });
      }
    }

    const profile = calculateUserProfile(name || '', dob);
    const context = buildMolinoContext(profile, {
      dailyEnergy,
      timing,
      compatibility: compatibility || undefined,
      entity,
      decision,
    });

    const fallback = generateFallbackInterpretation({ type, context, question });

    let aiResult: MolinoInterpretation | null = null;
    let aiError: string | null = null;
    let providerUsed: Provider = 'openai';
    let fallbackUsed = false;
    const generationStartedAt = Date.now();

    try {
      const prompt = buildIntelligencePrompt({ type, context, question, conversationHistory: safeHistory, readingContext: safeReadingContext });

      const compatResult = compatibility || {
        user: profile,
        target: {},
        scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
        strengths: [],
        challenges: [],
        narrative: '',
        insight: '',
      };

      const { interpretation: aiResponse, providerUsed: usedProvider, fallbackUsed: usedFallback } = await generateWithRouting(
        profile,
        entity || { name: 'Análisis' },
        compatResult,
        prompt,
        provider
      );
      providerUsed = usedProvider;
      fallbackUsed = usedFallback;

      await recordGeneration({
        type,
        provider: providerUsed,
        model: aiResponse.model || 'unknown',
        usage: aiResponse.usage,
        durationMs: Date.now() - generationStartedAt,
        status: 'ai',
      });

      // buildIntelligencePrompt's template dictates its own JSON schema
      // (summary/alignment/timing/... — matching MolinoInterpretation
      // directly, plus opening/corePattern/howYouOperate/relationalNote/
      // closingSynthesis for personal_profile). aiEngine now sends that
      // template verbatim, so the model's raw JSON already has these keys —
      // parse it straight instead of shuffling it through the old
      // narrative/detailedInsights/recommendations/reflectionQuestions shape,
      // which was a different (compatibility-only) schema than what we asked for.
      //
      // Models don't always return clean JSON: some wrap it in ```json fences,
      // some double-encode it, and some nest the whole payload inside
      // "summary". extractJSON recovers those known-safe wrappers only — never
      // arbitrary prose.
      let structured: Partial<MolinoInterpretation> | null = null;
      let aiInvalidReason: string | undefined;
      if (aiResponse.rawResponse) {
        const extracted = extractJSON(aiResponse.rawResponse);
        if (extracted.ok) {
          const data: Record<string, unknown> = { ...extracted.data };
          // OpenRouter's json_schema structured output (strict mode) requires
          // every property present, so optional fields the model has nothing
          // to say about come back as explicit `null` instead of omitted.
          // Normalize null → absent so isValidMolinoInterpretation and
          // validateMolinoInterpretationSemantics see the same optional-field
          // shape they always have (both treat "present but wrong type" as
          // invalid, and null !== undefined).
          const NULLABLE_OPTIONAL_FIELDS = [
            'opening', 'alignment', 'howYouOperate', 'relationalNote',
            'timing', 'suggestedNextStep', 'closingSynthesis', 'confidence', 'corePattern',
          ] as const;
          for (const field of NULLABLE_OPTIONAL_FIELDS) {
            if (data[field] === null) delete data[field];
          }
          // Some models return corePattern as a JSON-string instead of an
          // object. Recover it only when it unambiguously parses to the
          // expected shape; otherwise drop the field rather than fabricate
          // one — the rest of the reading (summary/alignment/...) still
          // renders fine with corePattern absent (UI guards on its presence).
          if (typeof data.corePattern === 'string') {
            let recovered: unknown;
            try {
              recovered = JSON.parse(data.corePattern);
            } catch {
              recovered = null;
            }
            const isCorePatternShape =
              recovered !== null &&
              typeof recovered === 'object' &&
              typeof (recovered as Record<string, unknown>).what === 'string' &&
              typeof (recovered as Record<string, unknown>).source === 'string' &&
              typeof (recovered as Record<string, unknown>).whyItMatters === 'string';
            if (isCorePatternShape) {
              data.corePattern = recovered;
            } else {
              delete data.corePattern;
            }
          }
          if (isValidMolinoInterpretation(data)) {
            // Structurally valid JSON is not the same as a real interpretation:
            // reasoning models sometimes leak their chain-of-thought into the
            // field VALUES ("summary": "We need to produce JSON with fields as
            // specified..."), which passes the shape check above. This second
            // pass rejects that content instead of presenting it as Molino's
            // voice.
            const semantic = validateMolinoInterpretationSemantics(data);
            if (semantic.valid) {
              structured = data;
            } else {
              aiInvalidReason = semantic.reason;
            }
          } else {
            aiInvalidReason = 'structural_validation_failed';
          }
        } else {
          aiInvalidReason = 'unparseable_response';
        }
      } else {
        aiInvalidReason = 'empty_response';
      }

      // Invalid AI must never masquerade as a valid interpretation: no
      // legacy narrative-shape fallback here anymore. If the model didn't
      // produce a semantically sound MolinoInterpretation, aiResult stays
      // null and the caller gets the honest deterministic `fallback` instead
      // — never a placeholder string laundered through the `ai` field.
      if (structured) {
        aiResult = {
          summary: structured.summary || '',
          alignment: structured.alignment || '',
          timing: structured.timing || '',
          strengths: structured.strengths || [],
          tensions: structured.tensions || [],
          whatToConsider: structured.whatToConsider || [],
          suggestedNextStep: structured.suggestedNextStep || '',
          confidence: structured.confidence || 'Alta',
          limitations: structured.limitations?.length ? structured.limitations : ['Interpretación generada con IA.'],
          opening: structured.opening,
          corePattern: structured.corePattern,
          howYouOperate: structured.howYouOperate,
          relationalNote: structured.relationalNote,
          closingSynthesis: structured.closingSynthesis,
          rawContext: context,
        };
      } else {
        console.warn('[premium_ai_invalid]', JSON.stringify({
          type,
          provider: providerUsed,
          model: aiResponse.model || 'unknown',
          reason: aiInvalidReason,
        }));
      }
    } catch (err) {
      console.error('[/api/intelligence/interpret] AI error:', err);
      aiError = 'AI interpretation unavailable';
      await recordGeneration({
        type,
        provider: providerUsed,
        model: providerUsed === 'claude' ? (process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022') : providerUsed === 'openrouter' ? (process.env.OPENROUTER_MODEL || OPENROUTER_MODEL_DEFAULT) : (process.env.OPENAI_MODEL || 'gpt-4o-mini'),
        durationMs: Date.now() - generationStartedAt,
        status: 'error',
        errorReason: err instanceof Error ? err.message : String(err),
      });
    }

    // Telemetry: how often does the paid synthesis actually fall back to the
    // templated local copy instead of the real AI interpretation? This has
    // no dashboard yet — it's a structured log line so exposure can be
    // measured (grep/aggregate in the hosting provider's log viewer) before
    // deciding whether it needs a proper metric.
    if (PREMIUM_INTERPRETATION_TYPES.has(type)) {
      console.log('[premium_interpretation_served]', JSON.stringify({
        type,
        source: aiResult ? 'ai' : 'fallback',
        aiError: aiError || undefined,
      }));
    }

    return NextResponse.json({
      fallback: sanitizeInterpretation(fallback),
      ai: aiResult ? sanitizeInterpretation(aiResult) : null,
      // Explicit status so callers never have to infer "was this real AI?"
      // from ai being truthy alone: 'valid' (aiResult is real), 'error' (the
      // provider call threw), or 'invalid' (the provider responded but the
      // content failed structural/semantic validation — see aiInvalidReason
      // above / [premium_ai_invalid] log).
      aiStatus: aiResult ? 'valid' : aiError ? 'error' : 'invalid',
      ...(aiError && { error: aiError }),
    });
  } catch (error) {
    console.error('[/api/intelligence/interpret] Error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

function sanitizeInterpretation(interp: MolinoInterpretation) {
  return {
    summary: interp.summary,
    alignment: interp.alignment,
    timing: interp.timing,
    strengths: interp.strengths,
    tensions: interp.tensions,
    whatToConsider: interp.whatToConsider,
    suggestedNextStep: interp.suggestedNextStep,
    confidence: interp.confidence,
    limitations: interp.limitations,
    opening: interp.opening,
    corePattern: interp.corePattern,
    howYouOperate: interp.howYouOperate,
    relationalNote: interp.relationalNote,
    closingSynthesis: interp.closingSynthesis,
  };
}
