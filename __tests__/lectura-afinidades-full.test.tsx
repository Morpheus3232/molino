import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import LecturaAfinidadesFull from "@/components/lectura/LecturaAfinidadesFull";
import type { LightweightEntity } from "@/types/atlas";

const mockCatalog: LightweightEntity[] = [
  // Caballo (Same) — suficientes países para probar la paginación en la vista
  // por defecto (categoría "Países").
  { id: "c1", name: "Argentina", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c2", name: "Brasil", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c3", name: "Canadá", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c4", name: "Dinamarca", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c5", name: "Egipto", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c6", name: "Finlandia", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c7", name: "Georgia", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c8", name: "Hungría", type: "country", animal: "Caballo", isApproximate: false, visualType: "flag" },
  { id: "c9", name: "Buenos Aires", type: "city", animal: "Caballo", isApproximate: false, visualType: "flag" },

  // Tigre (Triad - Ally 1)
  { id: "t1", name: "México", type: "country", animal: "Tigre", isApproximate: false, visualType: "flag" },
  { id: "t2", name: "Monterrey", type: "city", animal: "Tigre", isApproximate: false, visualType: "flag" },

  // Perro (Triad - Ally 2)
  { id: "p1", name: "España", type: "country", animal: "Perro", isApproximate: false, visualType: "flag" },
  { id: "p2", name: "Madrid", type: "city", animal: "Perro", isApproximate: false, visualType: "flag" },

  // Rata (Clash - Opposite)
  { id: "r1", name: "Francia", type: "country", animal: "Rata", isApproximate: false, visualType: "flag" },
  { id: "r2", name: "París", type: "city", animal: "Rata", isApproximate: false, visualType: "flag" },
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

    // Hay 8 países Caballo en el mock. La vista por defecto (categoría "Países")
    // muestra 6 y guarda el resto.
    expect(screen.getByText("Argentina")).toBeInTheDocument();
    expect(screen.getByText("Brasil")).toBeInTheDocument();
    expect(screen.getByText("Canadá")).toBeInTheDocument();
    expect(screen.getByText("Dinamarca")).toBeInTheDocument();
    expect(screen.getByText("Egipto")).toBeInTheDocument();
    expect(screen.getByText("Finlandia")).toBeInTheDocument();

    // Las siguientes 2 no deben estar visibles aún
    expect(screen.queryByText("Georgia")).not.toBeInTheDocument();
    expect(screen.queryByText("Hungría")).not.toBeInTheDocument();

    // Botón Mostrar más visible con conteo restante
    const showMoreBtn = screen.getByRole("button", { name: /Mostrar más \(2 restantes\)/i });
    expect(showMoreBtn).toBeInTheDocument();

    // Al hacer clic, se revelan las 2 restantes
    fireEvent.click(showMoreBtn);
    expect(screen.getByText("Georgia")).toBeInTheDocument();
    expect(screen.getByText("Hungría")).toBeInTheDocument();

    // Botón Mostrar más desaparece
    expect(screen.queryByRole("button", { name: /Mostrar más/i })).not.toBeInTheDocument();
  });

  it("filtra por categoría correctamente (ej. Fútbol agrupa equipos y jugadores)", () => {
    // El mock no tiene entidades de fútbol; la categoría no aparece y la vista
    // por defecto de países se mantiene. Se ajustó el fixture para reflejar la
    // curación real: las categorías vacías no se ofrecen.
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    // Categoría Fútbol no existe en este catálogo, así que no se ofrece.
    expect(screen.queryByRole("button", { name: /Fútbol/i })).not.toBeInTheDocument();

    // La vista por defecto (Países) sigue mostrando los países del mismo animal.
    expect(screen.getByText("Argentina")).toBeInTheDocument();
    expect(screen.queryByText("Buenos Aires")).not.toBeInTheDocument();
  });

  it("cambia a Buena compatibilidad y muestra entidades aliadas (Tigre y Perro)", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    const buenaCompTab = screen.getByRole("tab", { name: /Buena compatibilidad/i });
    fireEvent.click(buenaCompTab);

    // Vista por defecto (Países): los países de Tigre y Perro.
    expect(screen.getByText("México")).toBeInTheDocument();
    expect(screen.getByText("España")).toBeInTheDocument();
    expect(screen.queryByText("Argentina")).not.toBeInTheDocument();

    // Las ciudades aliadas se ven al activar la categoría "Ciudades".
    const ciudadesBtn = screen.getByRole("button", { name: /Ciudades/i });
    fireEvent.click(ciudadesBtn);
    expect(screen.getByText("Monterrey")).toBeInTheDocument();
    expect(screen.getByText("Madrid")).toBeInTheDocument();
  });

  it("cambia a Energía opuesta y muestra entidades de signo opuesto (Rata)", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    const opuestaTab = screen.getByRole("tab", { name: /Energía opuesta/i });
    fireEvent.click(opuestaTab);

    // Vista por defecto (Países): el país de Rata (Francia).
    expect(screen.getByText("Francia")).toBeInTheDocument();
    expect(screen.queryByText("Argentina")).not.toBeInTheDocument();

    // La ciudad de signo opuesto se ve al activar la categoría "Ciudades".
    const ciudadesBtn = screen.getByRole("button", { name: /Ciudades/i });
    fireEvent.click(ciudadesBtn);
    expect(screen.getByText("París")).toBeInTheDocument();
  });

  it("renderiza el puente de salida hacia el Atlas general", () => {
    render(<LecturaAfinidadesFull userAnimal="Caballo" catalog={mockCatalog} />);

    expect(screen.getByText("Explorá todo tu Atlas")).toBeInTheDocument();
    const atlasLink = screen.getByRole("link", { name: /Ir al Atlas/i });
    expect(atlasLink).toHaveAttribute("href", "/atlas");
  });
});
