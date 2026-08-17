import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import PremiumGate from '@/components/profile/PremiumGate';

// Mock fetch globally
const originalFetch = global.fetch;

describe('PremiumGate', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // Helper to mock feature flags and premium check
  const setupMocks = (premiumResult: { premium: boolean } | Error, flags = { premiumEnabled: true, paypalEnabled: false, mercadoPagoEnabled: true, premiumPriceUsd: 8 }) => {
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
        return new Response(JSON.stringify({ premiumEnabled: true, paypalEnabled: false, mercadoPagoEnabled: true, premiumPriceUsd: 8 }), {
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
    setupMocks({ premium: false }, { premiumEnabled: false, paypalEnabled: false, mercadoPagoEnabled: true, premiumPriceUsd: 8 });

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
});