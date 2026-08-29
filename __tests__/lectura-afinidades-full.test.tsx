import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LecturaAfinidadesFull from "@/components/lectura/LecturaAfinidadesFull";
import type { LightweightEntity } from "@/types/atlas";

const mockCatalog: LightweightEntity[] = [
  // Caballo (Same)
  { id: "c1", name: "Argentina", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c2", name: "Buenos Aires", type: "city", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c3", name: "UBA", type: "university", animal: "Caballo", isApproximate: false, visualType: "logo" },
  { id: "c4", name: "Boca Juniors", type: "team", animal: "Caballo", isApproximate: false, visualType: "logo" },
  { id: "c5", name: "Lionel Messi", type: "football_player", animal: "Caballo", isApproximate: false, visualType: "portrait" },
  { id: "c6", name: "Charly García", type: "artist", animal: "Caballo", isApproximate: false, visualType: "portrait" },
  { id: "c7", name: "YPF", type: "brand", animal: "Caballo", isApproximate: false, visualType: "logo" },
  { id: "c8", name: "Spider-Man", type: "movie", animal: "Caballo", isApproximate: false, visualType: "album" },

  // Tigre (Triad - Ally 1)
  { id: "t1", name: "México", type: "country", animal: "Tigre", isApproximate: false, visualType: "flag" },
  { id: "t2", name: "Monterrey", type: "city", animal: "Tigre", isApproximate: false, visualType: "flag" },
  { id: "t3", name: "UNAM", type: "university", animal: "Tigre", isApproximate: false, visualType: "logo" },

  // Perro (Triad - Ally 2)
  { id: "p1", name: "España", type: "country", animal: "Perro", isApproximate: false, visualType: "flag" },
  { id: "p2", name: "Madrid", type: "city", animal: "Perro", isApproximate: false, visualType: "flag" },

  // Rata (Clash - Opposite)
  { id: "r1", name: "Francia", type: "country", animal: "Rata", isApproximate: false, visualType: "flag" },
  { id: "r2", name: "París", type: "city", animal: "Rata", isApproximate: false, visualType: "flag" },
  { id: "r3", name: "Nike", type: "brand", animal: "Rata", isApproximate: false, visualType: "logo" },
];

describe("LecturaAfinidadesFull Component (Sub-Fase 4.1)", () => {
  it("renderiza el encabezado editorial y los 3 selectores de relación", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    expect(screen.getByText("05 · Tu relación con el mundo")).toBeInTheDocument();
    expect(screen.getByText("Afinidades y Correspondencias")).toBeInTheDocument();

    // 3 pestañas principales de relación
    expect(screen.getByRole("tab", { name: /Alta compatibilidad/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Buena compatibilidad/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Energía opuesta/i })).toBeInTheDocument();
  });

  it("renderiza inicialmente un máximo de 6 entidades y muestra el botón 'Mostrar más'", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    // Hay 8 entidades Caballo en el mock. Inicialmente deben renderizarse 6.
    expect(screen.getByText("Argentina")).toBeInTheDocument();
    expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    expect(screen.getByText("UBA")).toBeInTheDocument();
    expect(screen.getByText("Boca Juniors")).toBeInTheDocument();
    expect(screen.getByText("Lionel Messi")).toBeInTheDocument();
    expect(screen.getByText("Charly García")).toBeInTheDocument();

    // Las siguientes 2 no deben estar visibles aún
    expect(screen.queryByText("YPF")).not.toBeInTheDocument();
    expect(screen.queryByText("Spider-Man")).not.toBeInTheDocument();

    // Botón Mostrar más visible con conteo restante
    const showMoreBtn = screen.getByRole("button", { name: /Mostrar más \(2 restantes\)/i });
    expect(showMoreBtn).toBeInTheDocument();

    // Al hacer clic, se revelan las 2 restantes
    fireEvent.click(showMoreBtn);
    expect(screen.getByText("YPF")).toBeInTheDocument();
    expect(screen.getByText("Spider-Man")).toBeInTheDocument();

    // Botón Mostrar más desaparece
    expect(screen.queryByRole("button", { name: /Mostrar más/i })).not.toBeInTheDocument();
  });

  it("filtra por categoría correctamente (ej. Fútbol agrupa equipos y jugadores)", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    // Seleccionar categoría Fútbol
    const futbolBtn = screen.getByRole("button", { name: /Fútbol/i });
    fireEvent.click(futbolBtn);

    expect(screen.getByText("Boca Juniors")).toBeInTheDocument();
    expect(screen.getByText("Lionel Messi")).toBeInTheDocument();
    expect(screen.queryByText("Argentina")).not.toBeInTheDocument();
  });

  it("cambia a Buena compatibilidad y muestra entidades aliadas (Tigre y Perro)", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    const buenaCompTab = screen.getByRole("tab", { name: /Buena compatibilidad/i });
    fireEvent.click(buenaCompTab);

    // Entidades de Tigre y Perro
    expect(screen.getByText("México")).toBeInTheDocument();
    expect(screen.getByText("España")).toBeInTheDocument();
    expect(screen.getByText("Monterrey")).toBeInTheDocument();
    expect(screen.queryByText("Argentina")).not.toBeInTheDocument();
  });

  it("cambia a Energía opuesta y muestra entidades de signo opuesto (Rata)", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    const opuestaTab = screen.getByRole("tab", { name: /Energía opuesta/i });
    fireEvent.click(opuestaTab);

    // Entidades de Rata
    expect(screen.getByText("Francia")).toBeInTheDocument();
    expect(screen.getByText("París")).toBeInTheDocument();
    expect(screen.getByText("Nike")).toBeInTheDocument();
    expect(screen.queryByText("Argentina")).not.toBeInTheDocument();
  });

  it("renderiza el puente de salida hacia el Atlas general", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    expect(screen.getByText("Explorá todo tu Atlas")).toBeInTheDocument();
    const atlasLink = screen.getByRole("link", { name: /Ir al Atlas/i });
    expect(atlasLink).toHaveAttribute("href", "/atlas");
  });
});
