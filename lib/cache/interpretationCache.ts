import { getKvClient } from '@/lib/kv';
import type { InterpretationType } from '@/lib/engines/intelligenceEngine';

// Cache de interpretaciones ya generadas — evita repetir una llamada real
// (y paga) a IA en cada visita al mapa/perfil. Ver
// .claude/execution-logs/interpretation-cache-design.md para el diseño.
//
// Key: interp:${profileHash}:${type}:${version}:${promptHash}
// - profileHash: identidad pseudónima ya usada en todo lib/kv.ts.
// - promptHash: hash del prompt YA construido — si cambia cualquier input
//   (entity/question/dailyEnergy/...) o el propio prompt builder, el hash
//   cambia solo y el cache no matchea, sin invalidación manual por campo.
// - version: contador por profileHash+type, incrementado por invalidateCache
//   (usado en "Regenerar") — permite tirar el cache vigente sin depender de
//   conocer el promptHash exacto que hay que borrar.

export interface CachedInterpretation {
  profileHash: string;
  interpretationType: InterpretationType;
  promptHash: string;
  response: string;
  createdAt: number;
  expiresAt: number | null;
}

const crypto = typeof globalThis.crypto !== 'undefined'
  ? globalThis.crypto
  : require('crypto').webcrypto;

export function generatePromptHash(prompt: string, model?: string): string {
  // Sync, no I/O — sha256 vía Node's require('crypto') (no expuesto en
  // globalThis.crypto.subtle de forma síncrona). Determinístico, suficiente
  // para una clave de cache (no es un secreto ni una firma de seguridad).
  // El modelo se incluye en el hash: si cambia el proveedor/modelo sin
  // cambiar el prompt, el hash cambia y la respuesta cacheada del modelo
  // anterior no se sirve.
  const nodeCrypto = require('crypto');
  const input = model ? `${model}:${prompt}` : prompt;
  return nodeCrypto.createHash('sha256').update(input).digest('hex').slice(0, 32);
}

/** TTL en segundos, o null si el tipo no expira por tiempo (solo por promptHash/versión). */
export function getCacheExpiry(type: InterpretationType): number | null {
  if (type === 'daily_energy') {
    const now = new Date();
    const nextMidnightUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    return Math.max(60, Math.floor((nextMidnightUtc - now.getTime()) / 1000));
  }
  if (type === 'timing') {
    return 24 * 60 * 60;
  }
  return null;
}

export function isCacheExpired(cached: CachedInterpretation): boolean {
  return cached.expiresAt !== null && cached.expiresAt < Date.now();
}

async function getVersion(profileHash: string, type: InterpretationType): Promise<number> {
  try {
    const kv = await getKvClient();
    if (!kv) return 0;
    return (await kv.get<number>(`interp_version:${profileHash}:${type}`)) || 0;
  } catch (error) {
    console.error('[interpretationCache] Error in getVersion:', error);
    return 0;
  }
}

function cacheKey(profileHash: string, type: InterpretationType, version: number, promptHash: string): string {
  return `interp:${profileHash}:${type}:${version}:${promptHash}`;
}

export async function getCachedInterpretation(
  profileHash: string,
  type: InterpretationType,
  promptHash: string
): Promise<CachedInterpretation | null> {
  try {
    const kv = await getKvClient();
    if (!kv) return null;
    const version = await getVersion(profileHash, type);
    const raw = await kv.get<string>(cacheKey(profileHash, type, version, promptHash));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedInterpretation;
    if (isCacheExpired(parsed)) return null;
    return parsed;
  } catch (error) {
    console.error('[interpretationCache] Error in getCachedInterpretation:', error);
    return null;
  }
}

export async function setCachedInterpretation(data: CachedInterpretation): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;
    const version = await getVersion(data.profileHash, data.interpretationType);
    const key = cacheKey(data.profileHash, data.interpretationType, version, data.promptHash);
    const ttl = getCacheExpiry(data.interpretationType);
    await kv.set(key, JSON.stringify(data), ttl ? { ex: ttl } : undefined);
  } catch (error) {
    console.error('[interpretationCache] Error in setCachedInterpretation:', error);
  }
}

/** Tira el cache vigente para profileHash+type (usado por "Regenerar"), sin
 * necesitar conocer el promptHash exacto guardado: sube la versión, así la
 * próxima lectura/escritura usa una key nueva y la vieja simplemente queda
 * huérfana hasta expirar sola (o para siempre si el tipo no expira — mismo
 * costo de storage aceptado ya en incrementDailyCost/regen_count: no es un
 * store de billing crítico). */
export async function invalidateCache(profileHash: string, type: InterpretationType): Promise<void> {
  try {
    const kv = await getKvClient();
    if (!kv) return;
    const current = await getVersion(profileHash, type);
    await kv.set(`interp_version:${profileHash}:${type}`, current + 1);
  } catch (error) {
    console.error('[interpretationCache] Error in invalidateCache:', error);
  }
}
