"use client";

const PROFILE_SALT_KEY = 'molino-profile-salt';

/**
 * Read (and lazily create) the device-bound profile salt.
 *
 * A random UUID generated once and persisted in localStorage. It is prepended
 * to the birthDate before the profile HMAC in hashProfile(), so two people
 * who share the same birth date (and even the same normalized name) produce
 * DIFFERENT profile hashes — the hash is no longer a pure function of PII.
 *
 * Because it lives only in the paying device, every client call that computes
 * the profile hash (check/verify/recover/coupon/preference/interpret) must
 * send this same salt, and the server stores it alongside the hash in KV so
 * recovery can recompute it for ownership verification.
 */
export function getProfileSalt(): string {
  if (typeof window === 'undefined') return '';
  let salt: string | null = null;
  try {
    salt = window.localStorage.getItem(PROFILE_SALT_KEY);
  } catch {
    salt = null;
  }
  if (!salt) {
    salt = (window.crypto?.randomUUID && window.crypto.randomUUID()) || generateFallbackSalt();
    try {
      window.localStorage.setItem(PROFILE_SALT_KEY, salt);
    } catch {
      // Storage unavailable (private mode, quota) — return a session salt.
    }
  }
  return salt;
}

/** Persist a salt returned by the server (e.g. from recovery/verify) so this
 *  device keeps producing the same profile hash the paid hash used. */
export function setProfileSalt(salt: string | undefined | null): void {
  if (!salt || typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROFILE_SALT_KEY, salt);
  } catch {
    // Best-effort only.
  }
}

function generateFallbackSalt(): string {
  const bytes = new Uint8Array(16);
  if (window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
