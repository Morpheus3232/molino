import type { CompatibilityResult, UserProfile } from './compatibilityEngine';
import { generateWithOpenAI, generateWithClaude, generateWithOpenRouter } from './aiEngine';

export type Provider = 'openai' | 'claude' | 'openrouter';

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
  const enableFallback = process.env.AI_ENABLE_FALLBACK === 'true';
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

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateWithRouting(
  user: UserProfile,
  target: any,
  result: CompatibilityResult,
  template?: string,
  preferredProvider?: Provider
): Promise<{
  interpretation: Awaited<ReturnType<typeof generateWithOpenAI>>;
  providerUsed: Provider;
  fallbackUsed: boolean;
}> {
  const config = getProviderConfig();
  const primary = preferredProvider || config.primary;
  const fallback = config.fallback;

  async function tryProvider(provider: Provider, attempt: number = 1): Promise<Awaited<ReturnType<typeof generateWithOpenAI>> | null> {
    try {
      const interpretation = provider === 'claude'
        ? await generateWithClaude(user, target, result, template)
        : provider === 'openrouter'
          ? await generateWithOpenRouter(user, target, result, template)
          : await generateWithOpenAI(user, target, result, template);
      return interpretation;
    } catch (error) {
      const isRateLimit = isRateLimitError(error);
      console.warn(`[providerRouter] ${provider} attempt ${attempt} failed:`, error instanceof Error ? error.message : error, isRateLimit ? '(rate limit)' : '');
      
      if (isRateLimit && attempt < config.maxRetries) {
        const delay = config.retryDelayMs * attempt;
        console.log(`[providerRouter] Rate limited, retrying ${provider} in ${delay}ms (attempt ${attempt + 1}/${config.maxRetries})`);
        await sleep(delay);
        return tryProvider(provider, attempt + 1);
      }
      
      return null;
    }
  }

  const primaryResult = await tryProvider(primary);
  if (primaryResult) {
    return { interpretation: primaryResult, providerUsed: primary, fallbackUsed: false };
  }

  if (config.enableFallback) {
    console.log(`[providerRouter] Primary ${primary} failed, trying fallback ${fallback}`);
    const fallbackResult = await tryProvider(fallback);
    if (fallbackResult) {
      console.log(`[providerRouter] Fallback to ${fallback} succeeded`);
      return { interpretation: fallbackResult, providerUsed: fallback, fallbackUsed: true };
    }
  }

  throw new Error(`All providers failed (primary: ${primary}${config.enableFallback ? `, fallback: ${fallback}` : ''})`);
}

export function getProviderStatus(): { primary: Provider; fallback: Provider; fallbackEnabled: boolean; primaryConfigured: boolean; fallbackConfigured: boolean; freeTierLimits: Record<Provider, FreeTierLimits> } {
  const config = getProviderConfig();
  return {
    primary: config.primary,
    fallback: config.fallback,
    fallbackEnabled: config.enableFallback,
    primaryConfigured: !!process.env[config.primary === 'openai' ? 'OPENAI_API_KEY' : config.primary === 'openrouter' ? 'OPENROUTER_API_KEY' : 'ANTHROPIC_API_KEY'],
    fallbackConfigured: !!process.env[config.fallback === 'openai' ? 'OPENAI_API_KEY' : config.fallback === 'openrouter' ? 'OPENROUTER_API_KEY' : 'ANTHROPIC_API_KEY'],
    freeTierLimits: {
      openai: getFreeTierLimits('openai'),
      claude: getFreeTierLimits('claude'),
      openrouter: getFreeTierLimits('openrouter'),
    },
  };
}