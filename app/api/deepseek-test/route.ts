/**
 * Test endpoint para OpenRouter + DeepSeek v4
 * GET  /api/deepseek-test?prompt=tu+pregunta
 * POST /api/deepseek-test { "messages": [...] }
 */

import { createDeepSeekClient } from '@/lib/openrouter-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt') || 'Hola, ¿quién eres?';

    const client = createDeepSeekClient();
    const response = await client.chat([
      {
        role: 'user',
        content: prompt,
      },
    ]);

    return Response.json({
      success: true,
      prompt,
      response,
      client: client.info(),
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages, options } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        {
          success: false,
          error: 'messages array is required',
        },
        { status: 400 }
      );
    }

    const client = createDeepSeekClient();
    const response = await client.chat(messages, options || {});

    return Response.json({
      success: true,
      messages,
      response,
      client: client.info(),
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * Ejemplos de uso:
 *
 * 1. GET simple:
 *    curl "http://localhost:3000/api/deepseek-test?prompt=Hola"
 *
 * 2. POST con múltiples mensajes:
 *    curl -X POST http://localhost:3000/api/deepseek-test \
 *      -H "Content-Type: application/json" \
 *      -d '{
 *        "messages": [
 *          {"role": "system", "content": "Eres un experto en astrología"},
 *          {"role": "user", "content": "¿Qué características tiene un Libra?"}
 *        ],
 *        "options": {
 *          "temperature": 0.8,
 *          "max_tokens": 1000
 *        }
 *      }'
 *
 * 3. En TypeScript:
 *    const res = await fetch('/api/deepseek-test', {
 *      method: 'POST',
 *      headers: { 'Content-Type': 'application/json' },
 *      body: JSON.stringify({
 *        messages: [{ role: 'user', content: 'tu pregunta' }]
 *      })
 *    });
 *    const data = await res.json();
 *    console.log(data.response);
 */
