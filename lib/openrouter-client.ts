/**
 * OpenRouter + DeepSeek v4 Client
 * Ejemplo de uso directo de OpenRouter sin necesidad del router
 */

export interface DeepSeekMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface DeepSeekRequest {
  model?: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  response_format?: {
    type: 'json_object' | 'json_schema';
    json_schema?: {
      name: string;
      description?: string;
      schema: Record<string, unknown>;
      strict?: boolean;
    };
  };
}

export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Cliente simple para OpenRouter + DeepSeek v4
 * Uso:
 *   const client = createDeepSeekClient();
 *   const response = await client.chat([
 *     { role: 'user', content: 'Hola' }
 *   ]);
 */
export function createDeepSeekClient(apiKey?: string) {
  const key = apiKey || process.env.OPENROUTER_API_KEY;
  const model = process.env.OPENROUTER_MODEL || 'deepseek/deepseek-v4';

  if (!key) {
    throw new Error('OPENROUTER_API_KEY is required');
  }

  return {
    /**
     * Chat básico
     */
    async chat(
      messages: DeepSeekMessage[],
      options?: Partial<DeepSeekRequest>
    ): Promise<string> {
      const response = await this.request({
        messages,
        ...options,
      });
      return response.choices[0]?.message?.content || '';
    },

    /**
     * Request completa con control total
     */
    async request(body: DeepSeekRequest): Promise<DeepSeekResponse> {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'User-Agent': 'molino-deepseek-client/1.0',
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 2000,
          ...body,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(
          `OpenRouter API error ${response.status}: ${error}`
        );
      }

      return (await response.json()) as DeepSeekResponse;
    },

    /**
     * Chat con soporte de JSON (para structured output)
     */
    async chatJSON<T = unknown>(
      messages: DeepSeekMessage[],
      schema: Record<string, unknown>,
      schemaName: string = 'response'
    ): Promise<T> {
      const response = await this.request({
        messages,
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: schemaName,
            schema,
            strict: false,
          },
        },
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('Empty response from DeepSeek');

      try {
        return JSON.parse(content) as T;
      } catch (e) {
        throw new Error(`Failed to parse JSON response: ${content}`);
      }
    },

    /**
     * Stream de tokens (para experiencia real-time)
     * Nota: Requiere manejo especial en rutas API
     */
    async *stream(
      messages: DeepSeekMessage[],
      options?: Partial<DeepSeekRequest>
    ): AsyncGenerator<string> {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.7,
          max_tokens: 2000,
          stream: true,
          ...options,
          messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const token = parsed.choices?.[0]?.delta?.content;
                if (token) yield token;
              } catch {
                // Ignorar líneas que no sean JSON válido
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },

    /**
     * Información del cliente
     */
    info() {
      return {
        provider: 'OpenRouter',
        model,
        apiKeyConfigured: !!key,
      };
    },
  };
}

/**
 * Ejemplo de uso en una API route
 *
 * ```typescript
 * // app/api/deepseek/route.ts
 * import { createDeepSeekClient } from '@/lib/openrouter-client';
 *
 * export async function POST(req: Request) {
 *   const { messages } = await req.json();
 *   const client = createDeepSeekClient();
 *
 *   const response = await client.chat(messages, {
 *     temperature: 0.5,
 *     max_tokens: 1000,
 *   });
 *
 *   return Response.json({ response });
 * }
 * ```
 */

/**
 * Ejemplo con JSON estructurado
 *
 * ```typescript
 * const client = createDeepSeekClient();
 * const result = await client.chatJSON(
 *   [{ role: 'user', content: 'Analiza este perfil: ...' }],
 *   {
 *     type: 'object',
 *     properties: {
 *       name: { type: 'string' },
 *       analysis: { type: 'string' },
 *       score: { type: 'number' }
 *     },
 *     required: ['name', 'analysis', 'score']
 *   }
 * );
 * ```
 */
