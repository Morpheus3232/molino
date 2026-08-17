import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PremiumGate from '@/components/profile/PremiumGate';

// Mock fetch globally
const originalFetch = global.fetch;

// jsdom doesn't implement these — framer-motion's whileInView and the
// reduced-motion hook (used by <Logo spinning> in the 'paying' state) both
// need them just to mount, unrelated to what these tests actually verify.
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

describe('PremiumGate', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // Helper to mock feature flags and premium check
  const setupMocks = (premiumResult: { premium: boolean } | Error, flags = { premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }) => {
    global.fetch = vi.fn(async (input: RequestInfo | URL, options?: RequestInit) => {
      const urlStr = input.toString();
      
      // Feature flags call
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify(flags), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Premium check call
      if (urlStr.includes('/api/mp/check')) {
        if (premiumResult instanceof Error) {
          throw premiumResult;
        }
        return new Response(JSON.stringify(premiumResult), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response('Not Found', { status: 404 });
    });
  };

  it('TEST 1: API check = false → PremiumGate locked → children NOT in DOM', async () => {
    setupMocks({ premium: false });

    const PremiumChild = () => <div data-testid="premium-child">PREMIUM CONTENT</div>;
    
    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <PremiumChild />
      </PremiumGate>
    );

    // Wait for check to complete and paywall to show
    await waitFor(() => {
      expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
    });
    
    // Should show paywall content
    expect(screen.getByText(/Pagar con Mercado Pago/i)).toBeInTheDocument();
  });

  it('TEST 2: API check = true → PremiumGate unlocked → children in DOM', async () => {
    setupMocks({ premium: true });

    const PremiumChild = () => <div data-testid="premium-child">PREMIUM CONTENT</div>;
    
    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <PremiumChild />
      </PremiumGate>
    );

    // Wait for check to complete and content to show
    await waitFor(() => {
      expect(screen.getByTestId('premium-child')).toBeInTheDocument();
    });
  });

  it('TEST 3: While check pending → children NOT in DOM (no flash)', async () => {
    let resolveCheck: (value: Response) => void;
    const checkPromise = new Promise<Response>((resolve) => { resolveCheck = resolve; });
    
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const urlStr = input.toString();
      
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      if (urlStr.includes('/api/mp/check')) {
        return checkPromise;
      }
      
      return new Response('Not Found', { status: 404 });
    });

    const PremiumChild = () => <div data-testid="premium-child">PREMIUM CONTENT</div>;
    
    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <PremiumChild />
      </PremiumGate>
    );

    // Immediately after render, before check resolves - children should NOT be in DOM
    expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
    
    // Resolve with false (not premium)
    resolveCheck!(new Response(JSON.stringify({ premium: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }));

    // Wait for state to update
    await waitFor(() => {
      expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
    });
  });

  it('TEST 4: API check fails → children NOT in DOM → error state shown', async () => {
    setupMocks(new Error('Network error'));

    const PremiumChild = () => <div data-testid="premium-child">PREMIUM CONTENT</div>;
    
    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <PremiumChild />
      </PremiumGate>
    );

    // Wait for error state
    await waitFor(() => {
      expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
    });
    
    // Should show error/paywall
    expect(screen.getByText(/Pagar con Mercado Pago/i)).toBeInTheDocument();
  });

  it('TEST 5: premiumEnabled = false flag → children render without paywall (bypass)', async () => {
    setupMocks({ premium: false }, { premiumEnabled: false, mercadoPagoEnabled: true, premiumPriceUsd: 8 });

    const PremiumChild = () => <div data-testid="premium-child">PREMIUM CONTENT</div>;
    
    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <PremiumChild />
      </PremiumGate>
    );

    // When premium disabled, children should render (feature flag bypass)
    await waitFor(() => {
      expect(screen.getByTestId('premium-child')).toBeInTheDocument();
    });
  });

  // ── Checkout ──────────────────────────────────────────────────────────

  it('TEST 6: checkout success → redirects to the checkoutUrl returned by /api/mp/preference', async () => {
    // jsdom doesn't implement real cross-origin navigation (setting
    // window.location.href to a different origin is a no-op with a console
    // warning) — replace location with a plain writable mock so the
    // assignment the component makes is actually observable.
    const originalLocation = window.location;
    const mockLocation = { ...originalLocation, href: originalLocation.href };
    Object.defineProperty(window, 'location', { value: mockLocation, writable: true, configurable: true });

    let preferenceBody: unknown = null;

    global.fetch = vi.fn(async (input: RequestInfo | URL, options?: RequestInit) => {
      const urlStr = input.toString();
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/check')) {
        return new Response(JSON.stringify({ premium: false }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/preference')) {
        preferenceBody = JSON.parse(options?.body as string);
        return new Response(JSON.stringify({ checkoutUrl: 'https://www.mercadopago.com/checkout/fake-pref' }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    });

    render(
      <PremiumGate name="Test" birthDate="1990-01-15" currencyId="USD">
        <div data-testid="premium-child">PREMIUM CONTENT</div>
      </PremiumGate>
    );

    const payButton = await screen.findByText(/Pagar con Mercado Pago/i);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(window.location.href).toBe('https://www.mercadopago.com/checkout/fake-pref');
    });
    expect(preferenceBody).toMatchObject({ name: 'Test', birthDate: '1990-01-15', currencyId: 'USD' });

    Object.defineProperty(window, 'location', { value: originalLocation, writable: true, configurable: true });
  });

  it('TEST 7: checkout failure → shows the pay_error state instead of redirecting', async () => {
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const urlStr = input.toString();
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/check')) {
        return new Response(JSON.stringify({ premium: false }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/preference')) {
        return new Response(JSON.stringify({ error: 'MP no disponible' }), {
          status: 500, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    });

    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <div data-testid="premium-child">PREMIUM CONTENT</div>
      </PremiumGate>
    );

    const payButton = await screen.findByText(/Pagar con Mercado Pago/i);
    fireEvent.click(payButton);

    await waitFor(() => {
      expect(screen.getByText('MP no disponible')).toBeInTheDocument();
    });
    expect(screen.getByText('No se pudo iniciar el pago')).toBeInTheDocument();
    expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
  });

  // ── Recuperar acceso ─────────────────────────────────────────────────

  it('TEST 8: recover with a valid payment id → unlocks and shows children', async () => {
    let recoverBody: unknown = null;

    global.fetch = vi.fn(async (input: RequestInfo | URL, options?: RequestInit) => {
      const urlStr = input.toString();
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/check')) {
        return new Response(JSON.stringify({ premium: false }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/recover')) {
        recoverBody = JSON.parse(options?.body as string);
        return new Response(JSON.stringify({ verified: true, premiumToken: 'a'.repeat(64) }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    });

    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <div data-testid="premium-child">PREMIUM CONTENT</div>
      </PremiumGate>
    );

    fireEvent.click(await screen.findByText(/Recuperar acceso/i));
    const input = await screen.findByLabelText(/Mercado Pago ID/i);
    fireEvent.change(input, { target: { value: '123456789' } });
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByTestId('premium-child')).toBeInTheDocument();
    });
    expect(recoverBody).toMatchObject({ paymentId: '123456789', name: 'Test', birthDate: '1990-01-15' });
  });

  it('TEST 9: recover with an invalid payment id → shows a recover error, children stay locked', async () => {
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const urlStr = input.toString();
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/check')) {
        return new Response(JSON.stringify({ premium: false }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/recover')) {
        return new Response(JSON.stringify({ verified: false, reason: 'No se encontró el pago' }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    });

    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <div data-testid="premium-child">PREMIUM CONTENT</div>
      </PremiumGate>
    );

    fireEvent.click(await screen.findByText(/Recuperar acceso/i));
    const input = await screen.findByLabelText(/Mercado Pago ID/i);
    fireEvent.change(input, { target: { value: '000000000' } });
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('No se encontró el pago')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
  });

  // ── Cupón ────────────────────────────────────────────────────────────

  it('TEST 10: applying a valid coupon → unlocks and shows children', async () => {
    let couponBody: unknown = null;

    global.fetch = vi.fn(async (input: RequestInfo | URL, options?: RequestInit) => {
      const urlStr = input.toString();
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/check')) {
        return new Response(JSON.stringify({ premium: false }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/coupon')) {
        couponBody = JSON.parse(options?.body as string);
        return new Response(JSON.stringify({ valid: true, premiumToken: 'b'.repeat(64) }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    });

    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <div data-testid="premium-child">PREMIUM CONTENT</div>
      </PremiumGate>
    );

    fireEvent.click(await screen.findByText(/Tengo un cupón/i));
    const input = await screen.findByLabelText(/Código de cupón/i);
    fireEvent.change(input, { target: { value: 'MOLINO2026' } });
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByTestId('premium-child')).toBeInTheDocument();
    });
    expect(couponBody).toMatchObject({ coupon: 'MOLINO2026', name: 'Test', birthDate: '1990-01-15' });
  });

  it('TEST 11: applying an invalid coupon → shows a coupon error, children stay locked', async () => {
    global.fetch = vi.fn(async (input: RequestInfo | URL) => {
      const urlStr = input.toString();
      if (urlStr.includes('/api/features/flags')) {
        return new Response(JSON.stringify({ premiumEnabled: true, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/check')) {
        return new Response(JSON.stringify({ premium: false }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      if (urlStr.includes('/api/mp/coupon')) {
        return new Response(JSON.stringify({ valid: false, reason: 'Código inválido' }), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('Not Found', { status: 404 });
    });

    render(
      <PremiumGate name="Test" birthDate="1990-01-15">
        <div data-testid="premium-child">PREMIUM CONTENT</div>
      </PremiumGate>
    );

    fireEvent.click(await screen.findByText(/Tengo un cupón/i));
    const input = await screen.findByLabelText(/Código de cupón/i);
    fireEvent.change(input, { target: { value: 'NOPE' } });
    fireEvent.click(screen.getByText('OK'));

    await waitFor(() => {
      expect(screen.getByText('Código inválido')).toBeInTheDocument();
    });
    expect(screen.queryByTestId('premium-child')).not.toBeInTheDocument();
  });
});