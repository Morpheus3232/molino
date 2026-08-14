/**
 * Viral invite links — build/parse round trip + PII-free resolution.
 */
import { describe, test, expect } from 'vitest';
import { buildInviteUrl, buildInviteMessage, parseInviteUrl } from '@/lib/viral/invite';

describe('buildInviteUrl', () => {
  test('builds a /pareja URL with the inviter birthDate prefilled', () => {
    const url = buildInviteUrl({ birthDate: '1990-03-15', name: 'Lucía' });
    expect(url).toContain('/pareja?a=1990-03-15');
    expect(url).toContain('na=');
    expect(decodeURIComponent(url)).toContain('na=Lucía');
  });

  test('omits name when not provided', () => {
    const url = buildInviteUrl({ birthDate: '1990-03-15' });
    expect(url).toContain('/pareja?a=1990-03-15');
    expect(url).not.toContain('na=');
  });
});

describe('parseInviteUrl', () => {
  test('round trips an invite', () => {
    const url = buildInviteUrl({ birthDate: '1990-03-15', name: 'Lucía Fernández' });
    const parsed = parseInviteUrl(url);
    expect(parsed).toEqual({ birthDate: '1990-03-15', name: 'Lucía Fernández' });
  });

  test('returns null for a URL without an `a` param', () => {
    expect(parseInviteUrl('https://molino.app/pareja?b=1990-03-15')).toBeNull();
  });

  test('returns null for a malformed date', () => {
    expect(parseInviteUrl('https://molino.app/pareja?a=15-03-1990')).toBeNull();
  });

  test('returns null for garbage', () => {
    expect(parseInviteUrl('not-a-url')).toBeNull();
  });
});

describe('buildInviteMessage', () => {
  test('produces a warm, private, non-urgent message', () => {
    const msg = buildInviteMessage({ birthDate: '1990-03-15', name: 'Lucía' });
    expect(msg).toContain('Lucía');
    expect(msg).toContain('/pareja?a=1990-03-15');
    expect(msg).toContain('100% privado');
    // No aggressive urgency/tracking language
    expect(msg).not.toMatch(/última oportunidad|últimos cupos|ahora o nunca|tracking/i);
  });
});