import type { CompatibilityResult, UserProfile } from './compatibilityEngine';
import type { CompatibilityTarget } from '@/types/compatibility';
import { generateWithOpenAI, generateWithClaude, generateWithOpenRouter } from './aiEngine';
import { generateWithOmniRoute, getOmniRouteRouter, getOmniRouteStatus, isOmniRouteConfigured } from './omnirouteRouter';

export type Provider = 'openai' | 'claude' | 'openrouter' | 'omniroute';

export interface ProviderConfig {
  primary: Provider;
  fallback: Provider;
  enableFallback: boolean;
  maxRetries: number;
  retryDelayMs: number;
}

export interface FreeTierLimits {
  requestsPerMinute: number;
  tokensPerMinute: number;
}

export function getProviderConfig(): ProviderConfig {
  const primary = (process.env.AI_PRIMARY_PROVIDER as Provider) || 'openrouter';
  const fallback = (process.env.AI_FALLBACK_PROVIDER as Provider) || 'openai';
  const enableFallback = process.env.AI_ENABLE_FALLBACK !== 'false';
  const maxRetries = parseInt(process.env.AI_MAX_RETRIES || '2', 10);
  const retryDelayMs = parseInt(process.env.AI_RETRY_DELAY_MS || '1000', 10);

  if (primary === fallback) {
    console.warn('[providerRouter] Primary and fallback are the same, disabling fallback');
    return { primary, fallback, enableFallback: false, maxRetries, retryDelayMs };
  }

  return { primary, fallback, enableFallback, maxRetries, retryDelayMs };
}

export function getFreeTierLimits(provider: Provider): FreeTierLimits {
  if (provider === 'openai') {
    return {
      requestsPerMinute: parseInt(process.env.OPENAI_FREE_RPM || '3', 10),
      tokensPerMinute: parseInt(process.env.OPENAI_FREE_TPM || '40000', 10),
    };
  }
  if (provider === 'openrouter') {
    return {
      requestsPerMinute: parseInt(process.env.OPENROUTER_FREE_RPM || '20', 10),
      tokensPerMinute: parseInt(process.env.OPENROUTER_FREE_TPM || '40000', 10),
    };
  }
  if (provider === 'omniroute') {
    return {
      requestsPerMinute: parseInt(process.env.OMNIROUTE_FREE_RPM || '60', 10),
      tokensPerMinute: parseInt(process.env.OMNIROUTE_FREE_TPM || '200000', 10),
    };
  }
  return {
    requestsPerMinute: parseInt(process.env.ANTHROPIC_FREE_RPM || '5', 10),
    tokensPerMinute: parseInt(process.env.ANTHROPIC_FREE_TPM || '40000', 10),
  };
}

function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('rate limit') ||
           message.includes('429') ||
           message.includes('quota') ||
           message.includes('insufficient_quota');
  }
  return false;
}

/**
 * Covers rate limits AND the transient failures fetchWithTimeout's removed
 * internal retry used to handle (timeout/abort, 5xx) — this is now the
 * ONLY retry layer, so it has to catch everything worth retrying, not just
 * 429s. Still excludes 4xx/parse/validation errors: retrying a wrong
 * request changes nothing but cost.
 */
function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (isRateLimitError(error)) return true;
  const message = error.message.toLowerCase();
  const name = 'name' in error ? String(error.name).toLowerCase() : '';
  return (
    message.includes('transient upstream error') ||
    name === 'aborterror' ||
    message.includes('abort') ||
    message.includes('timeout')
  );
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function tryLegacyProvider(
  provider: Exclude<Provider, 'omniroute'>,
  user: UserProfile,
  target: CompatibilityTarget,
  result: CompatibilityResult,
  template?: string,
  attempt: number = 1,
  maxRetries: number = 2,
  retryDelayMs: number = 1000,
  timeoutMs?: number,
  modelOverride?: string
): Promise<Awaited<ReturnType<typeof generateWithOpenAI>> | null> {
  try {
    const interpretation = provider === 'claude'
      ? await generateWithClaude(user, target, result, template, timeoutMs, modelOverride)
      : provider === 'openrouter'
        ? await generateWithOpenRouter(user, target, result, template, timeoutMs, modelOverride)
        : await generateWithOpenAI(user, target, result, template, timeoutMs, modelOverride);
    return interpretation;
  } catch (error) {
    const retryable = isRetryableError(error);
    const message = error instanceof Error ? error.message : String(error);
    // console.error, not .warn: this is the only place the real provider
    // failure reason (status/statusText/body, logged inside aiEngine.ts) is
    // one hop from being silently swallowed into the generic "All providers
    // failed" — Vercel's runtime log capture was observed dropping .warn
    // lines from this exact catch in production, so .error is what actually
    // reaches `vercel logs`.
    console.error(`[AI] provider=${provider} stage=attempt_failed attempt=${attempt} retryable=${retryable} message=${message}`);

    if (retryable && attempt < maxRetries) {
      const delay = retryDelayMs * attempt;
      console.log(`[AI] provider=${provider} stage=retry attempt=${attempt + 1} delayMs=${delay}`);
      await sleep(delay);
      return tryLegacyProvider(provider, user, target, result, template, attempt + 1, maxRetries, retryDelayMs, timeoutMs, modelOverride);
    }

    return null;
  }
}

/**
 * 'omniroute' is only reachable through a local proxy (see
 * isOmniRouteConfigured) — never in the Vercel serverless runtime.
 * tryLegacyProvider has no 'omniroute' branch, so calling it with
 * 'omniroute' as `provider` silently executes generateWithOpenAI while
 * every log line still says `provider=omniroute` — a real request going
 * out under a fake label. Resolving to the actual legacy provider BEFORE
 * logging/calling is what makes `[AI] provider=...` trustworthy again.
 */
function resolveEffectiveProvider(provider: Provider): Exclude<Provider, 'omniroute'> {
  return provider === 'omniroute' ? 'openai' : provider;
}

export async function generateWithRouting(
  user: UserProfile,
  target: CompatibilityTarget,
  result: CompatibilityResult,
  template?: string,
  preferredProvider?: Provider,
  timeoutMs?: number,
  /**
   * Fuerza un modelo específico para esta llamada (independiente del env por
   * proveedor). La ruta lo setea desde AI_HEAVY_MODEL solo para los tipos
   * premium (personal_profile / question) — el centro intelectual de la
   * Lectura no debería correr en el modelo barato de los tipos gratuitos.
   */
  modelOverride?: string
): Promise<{
  interpretation: Awaited<ReturnType<typeof generateWithOpenAI>>;
  providerUsed: Provider;
  fallbackUsed: boolean;
}> {
  const config = getProviderConfig();
  const primary = preferredProvider || config.primary;

  if (primary === 'omniroute') {
    if (isOmniRouteConfigured()) {
      try {
        const { interpretation, modelUsed, fallbackUsed } = await generateWithOmniRoute(user, target, result, template);
        console.log(`[AI] result=success provider=omniroute model=${modelUsed} fallback=${fallbackUsed}`);
        return { interpretation, providerUsed: 'omniroute', fallbackUsed };
      } catch (error) {
        console.error('[AI] provider=omniroute stage=attempt_failed message=' + (error instanceof Error ? error.message : String(error)));
      }
    } else {
      const effective = resolveEffectiveProvider(primary);
      console.warn(`[AI] provider=omniroute stage=skipped reason=not_configured effectivePrimary=${effective}`);
    }
  }

  const effectivePrimary = resolveEffectiveProvider(primary);
  const primaryResult = await tryLegacyProvider(effectivePrimary, user, target, result, template, 1, config.maxRetries, config.retryDelayMs, timeoutMs, modelOverride);
  if (primaryResult) {
    console.log(`[AI] result=success provider=${effectivePrimary} fallback=false`);
    return { interpretation: primaryResult, providerUsed: effectivePrimary, fallbackUsed: false };
  }

  if (config.enableFallback) {
    const fallback = resolveEffectiveProvider(config.fallback);
    console.log(`[AI] provider=${fallback} stage=request reason=primary_failed primary=${effectivePrimary}`);
    const fallbackResult = await tryLegacyProvider(fallback, user, target, result, template, 1, config.maxRetries, config.retryDelayMs, timeoutMs, modelOverride);
    if (fallbackResult) {
      console.log(`[AI] result=success provider=${fallback} fallback=true`);
      return { interpretation: fallbackResult, providerUsed: fallback, fallbackUsed: true };
    }
  }

  const effectiveFallback = resolveEffectiveProvider(config.fallback);
  console.error(`[AI] result=local_fallback reason=all_providers_failed primary=${effectivePrimary} fallbackEnabled=${config.enableFallback}`);
  throw new Error(`All providers failed (primary: ${effectivePrimary}${config.enableFallback ? `, fallback: ${effectiveFallback}` : ''})`);
}

export function getProviderStatus(): { 
  primary: Provider; 
  fallback: Provider; 
  fallbackEnabled: boolean; 
  primaryConfigured: boolean; 
  fallbackConfigured: boolean; 
  freeTierLimits: Record<Provider, FreeTierLimits>;
  omniroute?: ReturnType<typeof getOmniRouteStatus>;
} {
  const config = getProviderConfig();
  const omniStatus = getOmniRouteStatus();
  
  return {
    primary: config.primary,
    fallback: config.fallback,
    fallbackEnabled: config.enableFallback,
    primaryConfigured: config.primary === 'omniroute' ? isOmniRouteConfigured() : !!process.env[config.primary === 'openai' ? 'OPENAI_API_KEY' : config.primary === 'openrouter' ? 'OPENROUTER_API_KEY' : 'ANTHROPIC_API_KEY'],
    fallbackConfigured: config.fallback === 'omniroute' ? isOmniRouteConfigured() : !!process.env[config.fallback === 'openai' ? 'OPENAI_API_KEY' : config.fallback === 'openrouter' ? 'OPENROUTER_API_KEY' : 'ANTHROPIC_API_KEY'],
    freeTierLimits: {
      openai: getFreeTierLimits('openai'),
      claude: getFreeTierLimits('claude'),
      openrouter: getFreeTierLimits('openrouter'),
      omniroute: getFreeTierLimits('omniroute'),
    },
    omniroute: omniStatus,
  };
}