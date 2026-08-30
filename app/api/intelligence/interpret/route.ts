import { NextRequest, NextResponse } from 'next/server';
import { calculateUserProfile } from '@/lib/engines/profileBuilder';
import { buildSynthesis } from '@/lib/engines/synthesisEngine';
import {
  buildMolinoContext,
  buildIntelligencePrompt,
  generateFallbackInterpretation,
  type InterpretationType,
  type MolinoInterpretation,
  type ConversationTurn,
  type ReadingContext,
} from '@/lib/engines/intelligenceEngine';
import { generateWithOpenAI, generateWithClaude, OPENROUTER_MODEL_DEFAULT, AI_TIMEOUT_MS, AI_HEAVY_TIMEOUT_MS } from '@/lib/engines/aiEngine';
import { extractJSON, isValidMolinoInterpretation, validateMolinoInterpretationSemantics } from '@/lib/engines/aiResponseParser';
import { generateWithRouting, getProviderStatus, type Provider } from '@/lib/engines/providerRouter';
import { hashProfile } from '@/lib/mercadopago';
import {
  hasPremiumAccess,
  verifyPremiumToken,
  getRegenerationCount,
  incrementRegenerationCount,
  REGENERATE_DAILY_LIMIT,
  getChatQuestionCount,
  incrementChatQuestionCount,
  CHAT_LIFETIME_LIMIT,
  getDailyCost,
} from '@/lib/kv';
import { recordGeneration } from '@/lib/ai/costTracking';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, AI_RATE_LIMIT } from '@/lib/rate-limit';
import { generatePromptHash, getCachedInterpretation, setCachedInterpretation, invalidateCache, getCacheExpiry } from '@/lib/cache/interpretationCache';

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

// Entitlement-dependent responses must never be cached by a shared CDN:
// a premium payload cached as `public` could be replayed to anonymous
// visitors. Every response in this route carries private, no-store.
const PRIVATE_NO_STORE = { 'Cache-Control': 'private, no-store, max-age=0' };

interface PremiumErrorResponse {
  error: { code: string; message: string };
}

function premiumError(code: string, message: string): NextResponse<PremiumErrorResponse> {
  return NextResponse.json(
    { error: { code, message } },
    { status: 403, headers: PRIVATE_NO_STORE }
  );
}

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
  /** Device-bound random salt used to compute the profile HMAC. */
  salt?: string;
  /** True only for an explicit "Regenerar" click on the premium synthesis —
   * never set on the automatic first generation. Only this flag consumes
   * the daily regenerate quota (see REGENERATE_DAILY_LIMIT below). */
  isRegenerate?: boolean;
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = checkRateLimit(rateLimitKey(ip, 'intelligence/interpret'), AI_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await req.json();
    const { type, dob, name, dailyEnergy, timing, compatibility, entity, decision, question, provider, conversationHistory, readingContext, premiumToken, salt, isRegenerate } = body as RequestBody;

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

    let regenerateStatus: { used: number; limit: number; remaining: number } | null = null;
    let chatStatus: { used: number; limit: number; remaining: number } | null = null;

    // Computed for every type (not just premium): also the cache key's
    // identity — see lib/cache/interpretationCache.ts.
    const profileHash = hashProfile(name || '', dob, salt);

    if (PREMIUM_INTERPRETATION_TYPES.has(type)) {
      // Device-bound token verification: prevents share-URL bypass.
      // hasPremiumAccess alone is NOT enough — it only proves the profile
      // has been paid for, not that THIS device paid. The token lives
      // exclusively in localStorage of the paying device and never travels
      // in shareable URLs.
      let premium = false;
      try {
        premium = await hasPremiumAccess(profileHash);
      } catch (err) {
        console.error('[/api/intelligence/interpret] Premium check failed:', err);
      }
      if (!premium) {
        return premiumError('premium_required', 'Premium required');
      }

      if (!premiumToken) {
        return premiumError('premium_token_required', 'Premium token required');
      }

      const tokenValid = await verifyPremiumToken(profileHash, premiumToken);
      if (!tokenValid) {
        return premiumError('premium_token_invalid', 'Invalid premium token');
      }

      // Regenerate quota: only the explicit "Regenerar" click on the premium
      // synthesis consumes it — the automatic first generation (isRegenerate
      // unset) never counts, it only reads the current count so the client
      // can render "Regenerar (2/5 hoy)" from the very first load.
      if (type === 'personal_profile') {
        const currentCount = await getRegenerationCount(profileHash);
        if (isRegenerate) {
          if (currentCount >= REGENERATE_DAILY_LIMIT) {
            return NextResponse.json(
              {
                error: {
                  code: 'regenerate_limit_reached',
                  message: `Ya usaste tus ${REGENERATE_DAILY_LIMIT} regeneraciones de hoy — mañana tenés ${REGENERATE_DAILY_LIMIT} más.`,
                },
                regenerateStatus: { used: currentCount, limit: REGENERATE_DAILY_LIMIT, remaining: 0 },
              },
              { status: 429, headers: PRIVATE_NO_STORE }
            );
          }
          const used = await incrementRegenerationCount(profileHash);
          regenerateStatus = { used, limit: REGENERATE_DAILY_LIMIT, remaining: Math.max(0, REGENERATE_DAILY_LIMIT - used) };
        } else {
          regenerateStatus = { used: currentCount, limit: REGENERATE_DAILY_LIMIT, remaining: Math.max(0, REGENERATE_DAILY_LIMIT - currentCount) };
        }
      }

      // Cupo de chat: cada turno es una llamada real a la IA, con costo por
      // token, contra un pago único. El contador de localStorage
      // (lib/session/chatCredits.ts) es la UI; este es el que decide.
      if (type === 'question') {
        const used = await getChatQuestionCount(profileHash);
        if (used >= CHAT_LIFETIME_LIMIT) {
          return NextResponse.json(
            {
              error: {
                code: 'chat_limit_reached',
                message: `Usaste las ${CHAT_LIFETIME_LIMIT} preguntas incluidas en tu acceso.`,
              },
              chatStatus: { used, limit: CHAT_LIFETIME_LIMIT, remaining: 0 },
            },
            { status: 429, headers: PRIVATE_NO_STORE }
          );
        }
        const nowUsed = await incrementChatQuestionCount(profileHash);
        chatStatus = { used: nowUsed, limit: CHAT_LIFETIME_LIMIT, remaining: Math.max(0, CHAT_LIFETIME_LIMIT - nowUsed) };
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

    // Modelo personal unificado (buildSynthesis) computado del UserProfile
    // completo — la fuente canónica que también consumen /profile y /lectura.
    // El prompt lo usa en vez de re-derivar patrones/tensiones/convergencias.
    const synthesis = buildSynthesis(profile);

    const fallback = generateFallbackInterpretation({ type, context, question });
    const prompt = buildIntelligencePrompt({ type, context, question, conversationHistory: safeHistory, readingContext: safeReadingContext, synthesis });
    const promptHash = generatePromptHash(prompt);

    if (isRegenerate) {
      // "Regenerar" siempre debe producir contenido nuevo: tira el cache
      // vigente en vez de servir lo mismo que ya se le mostró al usuario.
      await invalidateCache(profileHash, type);
    } else {
      const cached = await getCachedInterpretation(profileHash, type, promptHash);
      if (cached) {
        const cachedBody = JSON.parse(cached.response);
        return NextResponse.json(
          { ...cachedBody, cached: true, ...(regenerateStatus && { regenerateStatus }), ...(chatStatus && { chatStatus }) },
          { headers: PRIVATE_NO_STORE }
        );
      }
    }

    let aiResult: MolinoInterpretation | null = null;
    let aiError: string | null = null;
    let providerUsed: Provider = 'openai';
    let fallbackUsed = false;
    const generationStartedAt = Date.now();

    // Techo de gasto diario. incrementDailyCost ya venía acumulando el costo
    // estimado de cada generación, pero nadie leía el total: era telemetría,
    // no un límite. Si AI_DAILY_BUDGET_USD no está seteada no hay techo, o
    // sea que el comportamiento por defecto no cambia; con la variable puesta,
    // pasado el techo se sirve el fallback determinista (que ya está armado
    // acá abajo) en vez de seguir llamando al proveedor.
    const dailyBudgetUsd = Number(process.env.AI_DAILY_BUDGET_USD) || 0;
    let overBudget = false;
    if (dailyBudgetUsd > 0) {
      try {
        overBudget = (await getDailyCost(new Date().toISOString().slice(0, 10))) >= dailyBudgetUsd;
      } catch {
        overBudget = false;
      }
    }

    if (overBudget) {
      console.warn('[/api/intelligence/interpret] daily AI budget reached — serving local fallback');
    }

    try {
      if (overBudget) throw new Error('daily_budget_reached');
      const compatResult = compatibility || {
        user: profile,
        target: {},
        scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
        strengths: [],
        challenges: [],
        narrative: '',
        insight: '',
      };

      // personal_profile/question demandan una síntesis con razonamiento
      // multi-sistema mucho más pesada (prompt ~4x más largo, ver
      // .claude/execution-logs/latency-comparison.md) — el timeout de 20s
      // pensado para los demás tipos las aborta antes de tiempo la mayoría
      // de las veces, disparando reintentos que no hacían falta.
      const timeoutMs = PREMIUM_INTERPRETATION_TYPES.has(type) ? AI_HEAVY_TIMEOUT_MS : AI_TIMEOUT_MS;

      // Techo duro de espera para el usuario, independiente de cuántos
      // proveedores/reintentos queden por debajo: si generateWithRouting no
      // resolvió a tiempo, esta carrera gana y cae al catch de abajo, que ya
      // sirve el fallback local determinista. GLOBAL_AI_TIMEOUT_MS > timeoutMs
      // (con margen) para no cortar un único intento que iba a completar bien
      // — ver la nota sobre PASO 4 en latency-fixes-validation.md: un techo
      // fijo de 30-40s para TODOS los tipos habría anulado el aumento de
      // timeout que este mismo cambio le acaba de dar a personal_profile/
      // question en el paso anterior, así que el techo también es por tipo.
      const globalTimeoutMs = PREMIUM_INTERPRETATION_TYPES.has(type) ? 65_000 : 35_000;

      // El centro intelectual de la Lectura (personal_profile) y el chat
      // anclado (question) piden síntesis multi-sistema y prosa cuidada en
      // español rioplatense — no el mismo modelo barato que sirve daily/
      // timing/compatibility. AI_HEAVY_MODEL (sin default en código: lo setea
      // ops, así no sube el gasto solo) fuerza un modelo de gama alta para
      // esos dos tipos. Si no está seteada, no cambia nada.
      const modelOverride = PREMIUM_INTERPRETATION_TYPES.has(type)
        ? (process.env.AI_HEAVY_MODEL || undefined)
        : undefined;

      const routingPromise = generateWithRouting(
        profile,
        entity || { name: 'Análisis' },
        compatResult,
        prompt,
        provider,
        timeoutMs,
        modelOverride
      );
      const globalTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('global_ai_timeout')), globalTimeoutMs);
      });
      const { interpretation: aiResponse, providerUsed: usedProvider, fallbackUsed: usedFallback } =
        await Promise.race([routingPromise, globalTimeoutPromise]);
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
            'timing', 'suggestedNextStep', 'suggestedQuestions', 'closingSynthesis', 'confidence', 'corePattern',
            'blindSpot', 'lifeAreas',
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
          suggestedQuestions: Array.isArray(structured.suggestedQuestions)
            ? structured.suggestedQuestions.filter((q): q is string => typeof q === 'string')
            : undefined,
          confidence: structured.confidence || 'Alta',
          limitations: structured.limitations?.length ? structured.limitations : ['Interpretación generada con IA.'],
          opening: structured.opening,
          corePattern: structured.corePattern,
          howYouOperate: structured.howYouOperate,
          relationalNote: structured.relationalNote,
          closingSynthesis: structured.closingSynthesis,
          // ⚠️ Esta proyección es una whitelist explícita: un campo que el
          // modelo devuelve y que NO esté listado acá se descarta en silencio,
          // sin error ni log. Agregar un campo al contrato son 7 lugares
          // (types, json schema en aiEngine, MolinoContractJSON en el parser,
          // NULLABLE_OPTIONAL_FIELDS de arriba, esta lista, el fallback y la
          // UI) — este es el que se olvida, porque los otros seis fallan
          // ruidosamente y este no.
          blindSpot: structured.blindSpot,
          lifeAreas: structured.lifeAreas,
          rawContext: context,
        };
      } else {
        // console.error, not .warn: same production log-capture gap found
        // and fixed in providerRouter.ts's attempt_failed log — .warn lines
        // were observed to never reach `vercel logs` in this runtime.
        console.error('[premium_ai_invalid]', JSON.stringify({
          type,
          provider: providerUsed,
          model: aiResponse.model || 'unknown',
          reason: aiInvalidReason,
        }));
      }
    } catch (err) {
      const isGlobalTimeout = err instanceof Error && err.message === 'global_ai_timeout';
      if (isGlobalTimeout) {
        // Separado de la traza genérica de abajo para poder medir en
        // producción con qué frecuencia el techo duro entra en juego (grep
        // por esta línea) — sirve el fallback local igual, no un error.
        console.error(`[ai_global_timeout] type=${type} durationMs=${Date.now() - generationStartedAt}`);
      } else {
        console.error('[/api/intelligence/interpret] AI error:', err);
      }
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
        provider: providerUsed,
        fallbackUsed,
        durationMs: Date.now() - generationStartedAt,
        aiError: aiError || undefined,
      }));
    }

    const responseBody = {
      fallback: sanitizeInterpretation(fallback),
      ai: aiResult ? sanitizeInterpretation(aiResult) : null,
      // Explicit status so callers never have to infer "was this real AI?"
      // from ai being truthy alone: 'valid' (aiResult is real), 'error' (the
      // provider call threw), or 'invalid' (the provider responded but the
      // content failed structural/semantic validation — see aiInvalidReason
      // above / [premium_ai_invalid] log).
      aiStatus: aiResult ? 'valid' : aiError ? 'error' : 'invalid',
      ...(aiError && { error: aiError }),
    };

    // Solo se cachea una interpretación real: un error transitorio del
    // proveedor o contenido inválido no debe quedar pegado sirviéndose por
    // el resto del TTL — la próxima visita reintenta contra IA de nuevo.
    if (aiResult) {
      const ttl = getCacheExpiry(type);
      await setCachedInterpretation({
        profileHash,
        interpretationType: type,
        promptHash,
        response: JSON.stringify(responseBody),
        createdAt: Date.now(),
        expiresAt: ttl ? Date.now() + ttl * 1000 : null,
      });
    }

    return NextResponse.json(
      { ...responseBody, ...(regenerateStatus && { regenerateStatus }), ...(chatStatus && { chatStatus }) },
      { headers: PRIVATE_NO_STORE }
    );
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
    // ⚠️ SEGUNDA whitelist explícita en este mismo archivo (la primera es la
    // proyección de `structured` a `aiResult`, ~90 líneas arriba). Un campo
    // nuevo del contrato tiene que agregarse a AMBAS o se pierde en silencio
    // entre `aiResult` (que sí lo tiene) y la respuesta HTTP (que no) — así
    // se perdieron blindSpot/lifeAreas la primera vez: se arregló la
    // proyección de arriba y esta, idéntica, se pasó por alto.
    blindSpot: interp.blindSpot,
    lifeAreas: interp.lifeAreas,
    relationalNote: interp.relationalNote,
    closingSynthesis: interp.closingSynthesis,
  };
}
