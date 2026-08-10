import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI, generateWithClaude } from '@/lib/engines/aiEngine';
import { generateWithRouting, getProviderStatus } from '@/lib/engines/providerRouter';
import { buildIntelligencePrompt, generateFallbackInterpretation, type MolinoContext, type InterpretationType } from '@/lib/engines/intelligenceEngine';
import { checkRateLimit, rateLimitKey, rateLimitResponse, getClientIp, AI_RATE_LIMIT } from '@/lib/rate-limit';

const PREMIUM_TYPES = new Set<InterpretationType>(['personal_profile', 'question']);

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = checkRateLimit(rateLimitKey(ip, 'ai/interpretation'), AI_RATE_LIMIT);
  if (!rl.allowed) return rateLimitResponse(rl.resetAt);

  try {
    const body = await request.json();

    if (body.type && body.context) {
      return handleIntelligenceRequest(body);
    }

    return handleLegacyRequest(body);
  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

async function handleIntelligenceRequest(body: {
  type: InterpretationType;
  context: MolinoContext;
  question?: string;
  template?: string;
  provider?: 'openai' | 'claude' | 'openrouter';
}) {
  const { type, context, question, template, provider } = body;

  if (!context?.userProfile) {
    return NextResponse.json(
      { error: 'Faltan datos del usuario' },
      { status: 400 }
    );
  }

  if (PREMIUM_TYPES.has(type)) {
    // This legacy route only serves free product types (compatibility,
    // daily_energy, ...). Premium types are served exclusively by
    // /api/intelligence/interpret, which carries the birthDate needed to
    // derive the premium hash. Blocking here is fail-safe: no premium
    // content can ever leak through this route.
    return NextResponse.json(
      { error: { code: 'premium_required', message: 'Premium content is not served by this endpoint' } },
      { status: 403, headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
    );
  }

  try {
    const prompt = template || buildIntelligencePrompt({ type, context, question });

    const { interpretation, providerUsed, fallbackUsed } = await generateWithRouting(
      context.userProfile as any,
      context.entity || { name: 'Análisis' },
      context.compatibility as any,
      prompt,
      provider
    );

    return NextResponse.json({ interpretation, providerUsed, fallbackUsed });
  } catch (error) {
    console.error('Error en Intelligence Engine:', error);
    return NextResponse.json({
      interpretation: generateFallbackInterpretation({ type, context, question }),
      error: 'Usando interpretación local debido a un error en el servicio de IA',
    });
  }
}

async function handleLegacyRequest(body: {
  user: any;
  target: any;
  result: any;
  provider?: 'openai' | 'claude' | 'openrouter';
  template?: string;
}) {
  const { user, target, result, provider, template } = body;

  if (!user || !target || !result) {
    return NextResponse.json(
      { error: 'Faltan datos requeridos' },
      { status: 400 }
    );
  }

  try {
    // Template intentionally ignored — the server builds its own prompt
    // from user/target/result. Accepting a client-controlled template
    // would allow prompt injection (template replaces system prompt
    // verbatim in aiEngine.ts:222-231). The default prompt already
    // includes the entity context needed for compatibility analysis.
    const { interpretation, providerUsed, fallbackUsed } = await generateWithRouting(
      user,
      target,
      result,
      template,
      provider
    );

    return NextResponse.json({ interpretation, providerUsed, fallbackUsed });
  } catch (error) {
    console.error('Error en IA:', error);
    return NextResponse.json({
      interpretation: {
        narrative: 'Interpretación generada localmente.',
        detailedInsights: ['Los datos de tu perfil sugieren patrones únicos.'],
        recommendations: ['Explorá las diferentes dimensiones de tu perfil.'],
        reflectionQuestions: ['¿Qué parte de tu perfil resuena más con vos?'],
        poeticSummary: 'Tu perfil revela una historia de posibilidades.',
      },
      error: 'Usando interpretación local debido a un error en el servicio de IA',
    });
  }
}
