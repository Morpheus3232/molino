import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, test, expect } from "vitest";
import LifePathGlyph from "@/components/ui/LifePathGlyph";

describe("LifePathGlyph", () => {
  test("renderiza un dígito simple (1-9) como glifo SVG accesible", () => {
    render(<LifePathGlyph value={7} />);
    expect(screen.getByRole("img", { name: "Camino de Vida 7" })).toBeInTheDocument();
  });

  test("compone los números maestros (11/22/33) como dos dígitos pareados", () => {
    render(<LifePathGlyph value={22} />);
    expect(screen.getByRole("img", { name: "Camino de Vida 22" })).toBeInTheDocument();
    const svg = screen.getByRole("img", { name: "Camino de Vida 22" });
    expect(svg.querySelectorAll("g[transform]").length).toBe(2);
  });

  test("acepta title y clase personalizada (acento por currentColor)", () => {
    render(<LifePathGlyph value={11} title="Maestro 11" className="text-accent" />);
    expect(screen.getByRole("img", { name: "Maestro 11" })).toHaveClass("text-accent");
  });
});