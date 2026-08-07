import { NextRequest, NextResponse } from 'next/server';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import {
  buildMolinoContext,
  buildIntelligencePrompt,
  generateFallbackInterpretation,
  type InterpretationType,
  type MolinoInterpretation,
  type ConversationTurn,
} from '@/lib/engines/intelligenceEngine';
import { generateWithOpenAI, generateWithClaude } from '@/lib/engines/aiEngine';
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
  provider?: 'openai' | 'claude' | 'openrouter';
  /** Prior Q&A turns from the current chat session only — never persisted server-side. */
  conversationHistory?: ConversationTurn[];
  /** Device-bound premium token: proves the request comes from a paying device. */
  premiumToken?: string;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'intelligence/interpret'), AI_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json();
    const { type, dob, name, dailyEnergy, timing, compatibility, entity, decision, question, provider = 'openai', conversationHistory, premiumToken } = body as RequestBody;

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
        }))
      : [];

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
      const prompt = buildIntelligencePrompt({ type, context, question, conversationHistory: safeHistory });

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
      let structured: Partial<MolinoInterpretation> | null = null;
      if (aiResponse.rawResponse) {
        try {
          structured = JSON.parse(aiResponse.rawResponse);
        } catch {
          structured = null;
        }
      }

      aiResult = structured?.summary
        ? {
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
          }
        : {
            // Legacy shape fallback, kept in case the model ever ignores the
            // requested JSON schema and free-forms prose instead.
            summary: aiResponse.narrative || '',
            alignment: aiResponse.detailedInsights?.[0] || '',
            timing: aiResponse.detailedInsights?.[1] || '',
            strengths: aiResponse.recommendations?.slice(1, 4) || [],
            tensions: aiResponse.reflectionQuestions?.slice(0, 2) || [],
            whatToConsider: aiResponse.detailedInsights?.slice(2, 5) || [],
            suggestedNextStep: aiResponse.recommendations?.[0] || '',
            confidence: 'Media',
            limitations: ['Interpretación generada con IA.'],
            rawContext: context,
          };
    } catch (err) {
      console.error('[/api/intelligence/interpret] AI error:', err);
      aiError = 'AI interpretation unavailable';
      await recordGeneration({
        type,
        provider,
        model: provider === 'claude' ? (process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022') : provider === 'openrouter' ? (process.env.OPENROUTER_MODEL || 'nvidia/nemotron-3-super-120b-a12b:free') : (process.env.OPENAI_MODEL || 'gpt-4o-mini'),
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
