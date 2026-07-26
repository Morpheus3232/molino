import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI, generateWithClaude } from '@/lib/engines/aiEngine';
import { buildIntelligencePrompt, generateFallbackInterpretation, type MolinoContext, type InterpretationType } from '@/lib/engines/intelligenceEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Support both legacy format and new Intelligence Engine format
    if (body.type && body.context) {
      // New Intelligence Engine format
      return handleIntelligenceRequest(body);
    }

    // Legacy format (backward compatibility)
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
  provider?: 'openai' | 'claude';
}) {
  const { type, context, question, template, provider = 'openai' } = body;

  if (!context?.userProfile) {
    return NextResponse.json(
      { error: 'Faltan datos del usuario' },
      { status: 400 }
    );
  }

  try {
    const prompt = template || buildIntelligencePrompt({ type, context, question });

    const interpretation = provider === 'claude'
      ? await generateWithClaude(context.userProfile as any, context.entity || { name: 'Análisis' }, context.compatibility as any, prompt)
      : await generateWithOpenAI(context.userProfile as any, context.entity || { name: 'Análisis' }, context.compatibility as any, prompt);

    return NextResponse.json({ interpretation });
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
  provider?: 'openai' | 'claude';
  template?: string;
}) {
  const { user, target, result, provider = 'openai', template } = body;

  if (!user || !target || !result) {
    return NextResponse.json(
      { error: 'Faltan datos requeridos' },
      { status: 400 }
    );
  }

  try {
    const interpretation = provider === 'claude'
      ? await generateWithClaude(user, target, result, template)
      : await generateWithOpenAI(user, target, result, template);

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Error en IA:', error);
    // For legacy format, return a simple fallback
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
