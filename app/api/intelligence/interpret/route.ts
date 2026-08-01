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
  provider?: 'openai' | 'claude';
  /** Prior Q&A turns from the current chat session only — never persisted server-side. */
  conversationHistory?: ConversationTurn[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, dob, name, dailyEnergy, timing, compatibility, entity, decision, question, provider = 'openai', conversationHistory } = body as RequestBody;

    if (!dob) {
      return NextResponse.json({ error: 'Missing birth date' }, { status: 400 });
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

    try {
      const prompt = buildIntelligencePrompt({ type, context, question, conversationHistory });

      const compatResult = compatibility || {
        user: profile,
        target: {},
        scores: { numerology: 50, westernAstrology: 50, chineseAstrology: 50, archetype: 50, element: 50, overall: 50 },
        strengths: [],
        challenges: [],
        narrative: '',
        insight: '',
      };

      const aiResponse = provider === 'claude'
        ? await generateWithClaude(profile, entity || { name: 'Análisis' }, compatResult, prompt)
        : await generateWithOpenAI(profile, entity || { name: 'Análisis' }, compatResult, prompt);

      aiResult = {
        summary: aiResponse.narrative || '',
        alignment: aiResponse.detailedInsights?.[0] || '',
        timing: aiResponse.detailedInsights?.[1] || '',
        strengths: aiResponse.recommendations?.slice(1, 4) || [],
        tensions: aiResponse.reflectionQuestions?.slice(0, 2) || [],
        whatToConsider: aiResponse.detailedInsights?.slice(2, 5) || [],
        suggestedNextStep: aiResponse.recommendations?.[0] || '',
        confidence: 'Alta',
        limitations: ['Interpretación generada con IA.'],
        rawContext: context,
      };
    } catch (err) {
      console.error('[/api/intelligence/interpret] AI error:', err);
      aiError = 'AI interpretation unavailable';
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
  };
}
