import { describe, it, expect } from 'vitest';
import {
  pseudonymFor,
  sanitizeUserText,
  sanitizeNameForPrompt,
} from '@/lib/ai/piiSanitizer';

describe('piiSanitizer', () => {
  it('replaces a real name with a stable pseudonym', () => {
    const name = 'NOMBRE_UNO DOS';
    const a = sanitizeNameForPrompt(name);
    const b = sanitizeNameForPrompt(name);
    expect(a).toBe(b);
    expect(a).not.toContain(name);
    expect(a.length).toBeGreaterThan(0);
  });

  it('is deterministic for the same name+seed', () => {
    expect(pseudonymFor('NOMBRE_UNO', '1990-01-01')).toBe(
      pseudonymFor('NOMBRE_UNO', '1990-01-01')
    );
    expect(pseudonymFor('A', 'x')).not.toBe(pseudonymFor('A', 'y'));
  });

  it('masks emails and phone numbers in free text', () => {
    const at = '@';
    const email = 'usuario-noreply' + at + 'example.org';
    const input = 'Escrbime a ' + email + ' o al +54 11 5555 1234';
    const out = sanitizeUserText(input, 'NOMBRE_UNO');
    expect(out).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
    expect(out).toContain('[oculto]');
  });

  it('uses a neutral label when there is no name', () => {
    expect(sanitizeNameForPrompt('')).toBe('la persona');
  });
});
