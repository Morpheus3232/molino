import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LecturaProfunda from '@/components/profile/LecturaProfunda';
import type { UserProfile } from '@/types/user';

const originalFetch = global.fetch;

// jsdom doesn't implement these — framer-motion's whileInView and the
// reduced-motion hook both need them just to mount, unrelated to what this
// test actually verifies.
// Plain functions, not vi.fn() — beforeEach's vi.resetAllMocks() would wipe
// a mocked implementation back to "returns undefined" on every test.
if (typeof window.matchMedia !== 'function') {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
if (typeof (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === 'undefined') {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}

const TEST_PROFILE: UserProfile = {
  name: 'Lucía Fernández',
  birthDate: '1990-03-15',
  birthPlace: 'Buenos Aires',
  birthTime: '14:30',
  goal: 'growth',
  interests: [],
  onboardingStep: 4,
  completedSections: ['identity'],
  theme: 'light',
  language: 'es',
  notifications: true,
  lifePath: 1,
  sunSign: 'Piscis',
  sunSignInfo: { sign: 'Piscis', element: 'Agua', modality: 'Mutable', symbol: '♓' },
  chineseZodiac: 'Caballo',
  chineseZodiacInfo: { animal: 'Caballo', element: 'Fuego', emoji: '🐴' },
  element: 'Agua',
  modality: 'Mutable',
  luckyNumber: 39,
  archetype: 'El Visionario',
  archetypeInfo: { name: 'El Visionario', color: '#4A6FA5', description: '', quote: '', keywords: ['visión'], strengths: ['Intuición'], challenges: ['Dispersión'] },
  expressionNumber: 3,
  soulNumber: 7,
  personalityNumber: 5,
  cycles: { personalYear: 3, personalMonth: 7, personalDay: 5 },
  recommendations: { strengths: [], challenges: [], practices: [] },
};

const FLAGS = { premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 };
const FALLBACK_INTERPRETATION = {
  summary: 'Síntesis de prueba.',
  alignment: 'Alineación de prueba.',
  timing: '',
  strengths: [],
  tensions: [],
  whatToConsider: [],
  suggestedNextStep: '',
  confidence: 'Media',
  limitations: [],
};

function mockFetch(premium: boolean) {
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = input.toString();
    if (url.includes('/api/features/flags')) {
      return new Response(JSON.stringify(FLAGS), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/api/mp/check')) {
      return new Response(JSON.stringify({ premium }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    if (url.includes('/api/intelligence/interpret')) {
      return new Response(JSON.stringify({ fallback: FALLBACK_INTERPRETATION, ai: null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response('Not Found', { status: 404 });
  });
}

describe('LecturaProfunda', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('when locked shows the free-moves masthead but hides the premium "04" header', async () => {
    mockFetch(false);
    render(<LecturaProfunda profile={TEST_PROFILE} />);

    // El masthead de movimientos gratis es la única bajada que se mantiene.
    expect(screen.getByText(/Hasta ahora viste las piezas/)).toBeInTheDocument();
    // "La Lectura" es contenido Premium: bloqueada.
    expect(screen.queryByText('La Lectura')).not.toBeInTheDocument();
  });

  it('usuario sin Premium: SÍ ve las piezas gratis (patrones/reglas/evolución), NO ve la interpretación ni el chat', async () => {
    mockFetch(false);
    render(<LecturaProfunda profile={TEST_PROFILE} />);

    // Piezas — determinísticas, nunca detrás del paywall. "Tus principios"
    // se movió a /lectura (ver app/lectura/LaLecturaExperience.tsx).
    expect(screen.getByText(/PATRÓN CENTRAL/)).toBeInTheDocument();
    expect(screen.getByText(/TU MOMENTO/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Pagar con Mercado Pago/i)).toBeInTheDocument();
    });

    // La Lectura (05, abre en pestaña propia) y chat (06) — pagas.
    expect(screen.queryByText('La Lectura')).not.toBeInTheDocument();
    expect(screen.queryByText(/preguntarle qué significa/)).not.toBeInTheDocument();
  });

  it('usuario con Premium: ve la interpretación (06) y el chat (07), además de las piezas gratis', async () => {
    mockFetch(true);
    render(<LecturaProfunda profile={TEST_PROFILE} />);

    // Piezas gratis, igual que sin Premium.
    expect(screen.getByText(/PATRÓN CENTRAL/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('La Lectura')).toBeInTheDocument();
    });
    expect(screen.getByText('Abrir mi lectura →')).toBeInTheDocument();
    expect(screen.getByText(/preguntarle qué significa/)).toBeInTheDocument();

    // La interpretación llega en segundo plano (sin renderizarse acá — vive
    // en /lectura) para alimentar el trazado "Ver conexiones" y el chat.
    await waitFor(() => {
      expect(screen.getByText('Ver conexiones')).toBeInTheDocument();
    });
  });

  it('"Ver conexiones" muestra la trazabilidad de la síntesis una vez resuelta', async () => {
    mockFetch(true);
    render(<LecturaProfunda profile={TEST_PROFILE} />);

    const toggle = await screen.findByText('Ver conexiones');
    toggle.click();

    expect(await screen.findByText(/Esta lectura conecta/)).toBeInTheDocument();
  });
});
