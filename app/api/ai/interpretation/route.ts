import { NextRequest, NextResponse } from 'next/server';
import { generateWithOpenAI, generateWithClaude, generateFallbackInterpretation } from '@/lib/engines/aiEngine';

export async function POST(request: NextRequest) {
  try {
    const { user, target, result, provider = 'openai', template } = await request.json();

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
      const fallback = generateFallbackInterpretation(user, target, result);
      return NextResponse.json({
        interpretation: fallback,
        error: 'Usando interpretación local debido a un error en el servicio de IA',
      });
    }
  } catch (error) {
    console.error('Error en API route:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
