import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FeatureComparison from "@/components/premium/FeatureComparison";
import PremiumPreview from "@/components/premium/PremiumPreview";
import PremiumTestimonials from "@/components/premium/PremiumTestimonials";
import PremiumCheckout from "@/components/premium/PremiumCheckout";

describe("Premium Experience Components", () => {
  it("renders FeatureComparison with Free vs Premium features", () => {
    render(<FeatureComparison />);

    expect(screen.getByText(/Gratis vs Premium/i)).toBeDefined();
    expect(screen.getAllByText(/Síntesis profunda cruzada/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Detección de patrones y tensiones ocultas/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Calendario de energía diaria/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Acceso permanente de por vida/i).length).toBeGreaterThanOrEqual(1);
  });

  it("renders PremiumPreview with interactive taste of the reading", () => {
    render(<PremiumPreview />);

    expect(screen.getByText(/Así se ve tu lectura desbloqueada/i)).toBeDefined();
    expect(screen.getByText(/Vista Premium \(Desbloqueada\)/i)).toBeDefined();
    expect(screen.getByText(/Vista Gratis \(Bloqueada\)/i)).toBeDefined();
    expect(screen.getByText(/Síntesis de Convergencia/i)).toBeDefined();
  });

  it("renders PremiumTestimonials with realistic user reviews", () => {
    render(<PremiumTestimonials />);

    expect(screen.getByText(/Qué dicen quienes ya desbloquearon su mapa/i)).toBeDefined();
    expect(screen.getByText(/Sofía R./i)).toBeDefined();
    expect(screen.getByText(/El Modo Pareja nos cambió la mirada/i)).toBeDefined();
    expect(screen.getAllByText(/Cliente Premium/i).length).toBeGreaterThanOrEqual(2);
  });

  it("renders PremiumCheckout with 7-day guarantee and payment options", () => {
    render(<PremiumCheckout name="Franco" birthDate="1990-04-18" />);

    expect(screen.getAllByText(/\$8/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Garantía de Satisfacción de 7 Días/i)).toBeDefined();
    expect(screen.getByText(/Pagar con Mercado Pago/i)).toBeDefined();
  });
});
