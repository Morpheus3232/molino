import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RelationBar from "@/components/affinity/RelationBar";

describe("RelationBar component", () => {
  it("renderiza correctamente para Alta compatibilidad (score 95)", () => {
    render(<RelationBar score={95} label="Alta compatibilidad" />);
    expect(screen.getByText("Alta compatibilidad")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Alta compatibilidad \(95\/100\)/i })).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
  });

  it("renderiza correctamente para Buena compatibilidad (score 85)", () => {
    render(<RelationBar score={85} label="Buena compatibilidad" />);
    expect(screen.getByText("Buena compatibilidad")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Buena compatibilidad \(85\/100\)/i })).toBeInTheDocument();
    expect(screen.getByText("Buena")).toBeInTheDocument();
  });

  it("renderiza correctamente para Energía opuesta (score 30)", () => {
    render(<RelationBar score={30} label="Energía opuesta" />);
    expect(screen.getByText("Energía opuesta")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Energía opuesta \(30\/100\)/i })).toBeInTheDocument();
    expect(screen.getByText("Opuesta")).toBeInTheDocument();
  });
});
