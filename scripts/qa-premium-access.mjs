#!/usr/bin/env node
/**
 * Local-only QA helper: check or revoke Premium access for a test profile,
 * bypassing the UI. Uses the exact same server-side functions
 * (hashProfile, hasPremiumAccess, revokeAccess) as the real Mercado Pago
 * webhook and the coupon route — this does not grant access on its own,
 * it only inspects/resets state already granted via the coupon UI.
 *
 * Usage (must run through tsx so the .ts imports below resolve):
 *   npx tsx scripts/qa-premium-access.mjs status "Nombre" 1990-03-15
 *   npx tsx scripts/qa-premium-access.mjs revoke "Nombre" 1990-03-15
 *
 * Requires the same .env.local used by `next dev` (KV + MP_WEBHOOK_SECRET).
 */
import { readFileSync, existsSync } from 'node:fs';

// Minimal .env.local loader — avoids adding a `dotenv` dependency for a
// QA-only script. Doesn't touch process.env if a var is already set.
function loadEnvLocal() {
  const path = '.env.local';
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^"(.*)"$/, '$1');
  }
}
loadEnvLocal();

const [, , action, name = '', birthDate] = process.argv;

if (!action || !birthDate || !['status', 'revoke'].includes(action)) {
  console.error('Usage: node scripts/qa-premium-access.mjs <status|revoke> "<name>" <YYYY-MM-DD>');
  process.exit(1);
}

const { hashProfile } = await import('../lib/mercadopago.ts');
const { hasPremiumAccess, revokeAccess } = await import('../lib/kv.ts');

const profileHash = hashProfile(name, birthDate);
console.log(`Profile hash: ${profileHash}`);

if (action === 'status') {
  const has = await hasPremiumAccess(profileHash);
  console.log(has ? 'Premium: UNLOCKED' : 'Premium: locked');
} else {
  await revokeAccess(profileHash, `coupon_${profileHash}`); // paymentId prefix match not required — premium:<hash> key is what matters
  const has = await hasPremiumAccess(profileHash);
  console.log(has ? 'Revoke did not take effect (still unlocked)' : 'Revoked — Premium is now locked for this profile.');
}
