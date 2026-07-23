import { CompatibilityResult, UserProfile } from './compatibilityEngine';

export interface AIInterpretation {
  narrative: string;
  detailedInsights: string[];
  recommendations: string[];
  reflectionQuestions: string[];
  poeticSummary: string;
  rawResponse?: string;
}

export async function generateAIInterpretation(
  user: UserProfile,
  target: any,
  result: CompatibilityResult,
  provider: 'openai' | 'claude' = 'openai',
  template?: string
): Promise<AIInterpretation> {
  try {
    const response = await fetch('/api/ai/interpretation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        target,
        result,
        provider,
        template,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.interpretation;
  } catch (error) {
    console.error('Error en API de IA:', error);
    return generateFallbackInterpretation(user, target, result);
  }
}

// NOTE: This function must only be called from server-side (API routes)
// It accesses process.env which should never be exposed to client-side code
export async function generateWithOpenAI(
  user: UserProfile,
  target: any,
  result: CompatibilityResult,
  template?: string
): Promise<AIInterpretation> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no configurada');
  }

  const prompt = buildPrompt(user, target, result, template);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: `Eres un experto en sistemas simbólicos (numerología, astrología, zodiaco chino) que ofrece interpretaciones profundas y reflexivas. Tu tono es serio, profesional y filosófico. No afirmas que los sistemas sean científicos, sino que son herramientas de reflexión. Hablas en español neutro.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  return parseAIResponse(content);
}

// NOTE: This function must only be called from server-side (API routes)
// It accesses process.env which should never be exposed to client-side code
export async function generateWithClaude(
  user: UserProfile,
  target: any,
  result: CompatibilityResult,
  template?: string
): Promise<AIInterpretation> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY no configurada');
  }

  const prompt = buildPrompt(user, target, result, template);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 800,
      temperature: 0.7,
      system: `Eres un experto en sistemas simbólicos (numerología, astrología, zodiaco chino) que ofrece interpretaciones profundas y reflexivas. Tu tono es serio, profesional y filosófico. No afirmas que los sistemas sean científicos, sino que son herramientas de reflexión. Hablas en español neutro.`,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.content?.[0]?.text || '';
  return parseAIResponse(content);
}

function buildPrompt(user: UserProfile, target: any, result: CompatibilityResult, template?: string): string {
  const base = `Usuario:
- Nombre: ${user.name}
- Life Path: ${user.lifePath}
- Arquetipo: ${user.archetype}
- Zodiaco Occidental: ${user.sunSign} (${user.sunSignInfo?.element || ''})
- Zodiaco Chino: ${user.chineseZodiac} (${user.chineseZodiacInfo?.element || ''})
- Elemento: ${user.element}

Entidad:
- Nombre: ${target.name}
- Categoría: ${target.category || 'entidad'}
- Descripción: ${target.context?.description || ''}
- Temas clave: ${target.context?.keyThemes?.join(', ') || ''}

Resultado de compatibilidad:
- Score total: ${result.scores.overall}%
- Numerología: ${result.scores.numerology}%
- Astrología: ${result.scores.westernAstrology}%
- Zodiaco Chino: ${result.scores.chineseAstrology}%
- Arquetipo: ${result.scores.archetype}%
- Elemento: ${result.scores.element}%

Fortalezas: ${result.strengths.join(', ')}
Desafíos: ${result.challenges.join(', ')}`;

  if (template) {
    return `${base}

Instrucción especial: ${template}

Genera una interpretación profunda que incluya:
1. Una narrativa principal (2-3 párrafos)
2. 3-4 insights detallados
3. 3 recomendaciones prácticas
4. 3 preguntas para la reflexión
5. Un resumen poético (1-2 líneas)

Formato de respuesta JSON:
{
  "narrative": "...",
  "detailedInsights": ["..."],
  "recommendations": ["..."],
  "reflectionQuestions": ["..."],
  "poeticSummary": "..."
}`;
  }

  return `${base}

Genera una interpretación profunda que incluya:
1. Una narrativa principal (2-3 párrafos)
2. 3-4 insights detallados
3. 3 recomendaciones prácticas
4. 3 preguntas para la reflexión
5. Un resumen poético (1-2 líneas)

Formato de respuesta JSON:
{
  "narrative": "...",
  "detailedInsights": ["..."],
  "recommendations": ["..."],
  "reflectionQuestions": ["..."],
  "poeticSummary": "..."
}`;
}

function parseAIResponse(content: string): AIInterpretation {
  try {
    const parsed = JSON.parse(content);
    return {
      narrative: parsed.narrative || '',
      detailedInsights: parsed.detailedInsights || [],
      recommendations: parsed.recommendations || [],
      reflectionQuestions: parsed.reflectionQuestions || [],
      poeticSummary: parsed.poeticSummary || '',
      rawResponse: content,
    };
  } catch {
    const sections = content.split(/\n\n/);
    return {
      narrative: sections[0] || 'Una conexión profunda y significativa.',
      detailedInsights: sections.slice(1, 4).filter(s => s.length > 20),
      recommendations: sections.slice(4, 7).filter(s => s.length > 20),
      reflectionQuestions: sections.slice(7, 10).filter(s => s.length > 20),
      poeticSummary: sections[sections.length - 1]?.slice(0, 100) || 'El encuentro revela una historia de posibilidades.',
      rawResponse: content,
    };
  }
}

export function generateFallbackInterpretation(
  user: UserProfile,
  target: any,
  result: CompatibilityResult
): AIInterpretation {
  const score = result.scores.overall;
  const level = score >= 80 ? 'muy alta' : score >= 60 ? 'alta' : score >= 40 ? 'moderada' : 'baja';
  const archetype = user.archetype;
  const targetName = target.name || 'esta entidad';

  return {
    narrative: `Cuando tu energía de ${archetype} se encuentra con ${targetName}, emerge un patrón de ${level} compatibilidad. 
    ${score >= 70 ? 'Hay una alineación natural en la forma en que ambos abordan el mundo.' : 
      score >= 50 ? 'Existen puntos de conexión genuina, aunque también espacios de diferencia.' : 
      'Las diferencias aquí son significativas, pero no necesariamente un obstáculo.'}`,
    detailedInsights: [
      `Tu ${archetype} encuentra en ${targetName} un espejo de ciertas cualidades que valoras.`,
      `La compatibilidad sugiere ${score >= 70 ? 'un lenguaje común' : 'áreas de crecimiento potencial'}.`,
      `Esta conexión te invita a explorar cómo tu energía se manifiesta en relación con ${targetName}.`,
    ],
    recommendations: [
      `Explora más sobre ${targetName} desde la perspectiva de tu ${archetype}.`,
      `Reflexiona sobre cómo esta conexión puede aplicarse en tu vida cotidiana.`,
      `Considera qué aspectos de ${targetName} te atraen y cuáles te desafían.`,
    ],
    reflectionQuestions: [
      `¿Qué parte de ${targetName} resuena más con tu ${archetype}?`,
      `¿Cómo cambiaría tu percepción si adoptaras una cualidad de ${targetName}?`,
      `¿Qué aprendizajes puede ofrecerte esta conexión?`,
    ],
    poeticSummary: `En el encuentro entre tu ${archetype} y ${targetName}, se teje una historia de ${score >= 70 ? 'armonía' : 'contraste'}.`,
  };
}

export function generateSEOInterpretation(
  user: UserProfile,
  target: any,
  result: CompatibilityResult
): string {
  const score = result.scores.overall;
  const level = score >= 80 ? 'excelente' : score >= 60 ? 'buena' : score >= 40 ? 'moderada' : 'baja';
  return `Descubrí tu compatibilidad con ${target.name}. Score: ${score}% (${level}). Análisis basado en numerología, astrología y zodiaco chino.`;
}
