import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import CoupleComparison from "@/components/couple/CoupleComparison";
import { calculateUserProfile } from "@/lib/engines/profileBuilder";

describe("CoupleComparison Component", () => {
  const profileA = calculateUserProfile("Alex", "1990-04-18");
  const profileB = calculateUserProfile("Sam", "1992-09-24");

  it("renders both profiles, score, connection points, and challenges", () => {
    render(<CoupleComparison profileA={profileA} profileB={profileB} />);

    expect(screen.getByText(/Resonancia de la Pareja/i)).toBeDefined();
    expect(screen.getAllByText("Alex").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Sam").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/Puntos de Conexión & Sinergia/i)).toBeDefined();
    expect(screen.getByText(/Puntos de Atención & Desafíos/i)).toBeDefined();
    expect(screen.getByText(/Síntesis para la Dinámica Cotidiana/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Compartir comparativa/i })).toBeDefined();
  });
});
