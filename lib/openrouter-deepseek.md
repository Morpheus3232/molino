# OpenRouter + DeepSeek v4 Integration

## Configuración

Tu proyecto ya está completamente configurado para usar OpenRouter con DeepSeek v4.

### Variables de entorno

```bash
# API Key (ya configurada en .env.local)
OPENROUTER_API_KEY=sk-or-v1-...

# Modelo a usar (ya configurado)
OPENROUTER_MODEL=deepseek/deepseek-v4

# Proveedor primario (puedes cambiar esto)
AI_PRIMARY_PROVIDER=omniroute           # Cambiar a "openrouter" para usar DeepSeek como primario
AI_FALLBACK_PROVIDER=openrouter

# Límites de rate (ajusta según tu plan)
OPENROUTER_FREE_RPM=20
OPENROUTER_FREE_TPM=40000
```

## Uso en tu código

### 1. Para interpretaciones de Molino (Premium)

El código ya lo usa automáticamente en `lib/engines/aiEngine.ts`:

```typescript
import { generateWithOpenRouter } from '@/lib/engines/aiEngine';

// Con template (retorna JSON estructurado)
const interpretation = await generateWithOpenRouter(
  userProfile,
  target,
  compatibilityResult,
  'intelligence'  // template para MolinoInterpretation
);
```

### 2. Para routeo automático con fallback

```typescript
import { generateWithRouting } from '@/lib/engines/providerRouter';

// Usa OpenRouter por defecto, fallback a otro si falla
const result = await generateWithRouting(
  user,
  target,
  compatibilityResult,
  template,
  'openrouter'  // especificar provider
);
```

### 3. Llamadas directas a OpenRouter (sin usar el router)

```typescript
// En una API route o Server Action
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4',
    messages: [
      {
        role: 'user',
        content: 'Tu pregunta aquí',
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);
```

## Modelos disponibles en OpenRouter

- `deepseek/deepseek-v4` - DeepSeek v4 (recomendado)
- `deepseek/deepseek-chat` - Chat model alternativo
- `deepseek/deepseek-v4-flash` - Versión más rápida

## Monitoreo y Logs

El sistema registra automáticamente:

```
[AI] provider=openrouter stage=request status=200 model=deepseek/deepseek-v4 duration=XXms
```

Revisa la consola Vercel para ver:
- Provider usado
- Duración de la request
- Tokens utilizados
- Fallbacks activados

## Costos

DeepSeek v4 en OpenRouter es mucho más económico que otros modelos:
- Input: $0.14 / 1M tokens
- Output: $0.28 / 1M tokens

(Precios actuales — verifica en OpenRouter.io)

## Cambiar a un proveedor diferente

Si en el futuro quieres usar otro modelo:

```bash
# Cambiar modelo
OPENROUTER_MODEL=deepseek/deepseek-chat

# O cambiar proveedor completamente
AI_PRIMARY_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

## Solución de problemas

### "OPENROUTER_API_KEY no configurada"
- Verifica que `.env.local` tiene `OPENROUTER_API_KEY=sk-or-v1-...`
- Reinicia el servidor de desarrollo

### 429 (Rate limit)
- El sistema reintenta automáticamente (configurable con `AI_MAX_RETRIES`)
- Aumenta `OPENROUTER_FREE_TPM` si tienes plan de pago

### JSON parsing error
- DeepSeek v4 soporta `response_format: json_schema`
- El código ya lo maneja en `MOLINO_INTERPRETATION_JSON_SCHEMA`

## Documentación oficial

- https://openrouter.ai/docs
- https://platform.openai.com/docs/api-reference/chat/create (API compatible)
