import "@testing-library/jest-dom/vitest";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import PersonalAtlasPilot from "../PersonalAtlasPilot";
import type { PersonalAtlasGroup } from "@/lib/data/atlas-queries";
import type { LightweightEntity } from "@/types/atlas";

// framer-motion's whileInView (fadeUp) needs IntersectionObserver — jsdom doesn't provide it.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
});

// PersonalAtlasPilot agrupa Equipos y Jugadores bajo "Fútbol", y dentro de
// Jugadores separa por category ("actual"/"historico") sin introducir un
// EntityType nuevo ni tocar el motor — ver getPersonalAtlas en atlas-queries.ts.

function player(id: string, category: "actual" | "historico"): LightweightEntity {
  return {
    id,
    name: id,
    animal: "Caballo",
    isApproximate: false,
    visualType: "portrait",
    type: "football_player",
    category,
  };
}

function team(id: string): LightweightEntity {
  return { id, name: id, animal: "Caballo", isApproximate: false, visualType: "logo", type: "team" };
}

function artist(id: string): LightweightEntity {
  return { id, name: id, animal: "Caballo", isApproximate: false, visualType: "portrait", type: "artist" };
}

function city(id: string): LightweightEntity {
  return { id, name: id, animal: "Caballo", isApproximate: false, visualType: "flag", type: "city" };
}

const GROUPS: PersonalAtlasGroup[] = [
  { category: "team", level: "country-animal", entities: [team("River")], totalAvailable: 1 },
  {
    category: "football_player",
    level: "region-animal",
    entities: [player("Actual1", "actual"), player("Actual2", "actual"), player("Historico1", "historico")],
    totalAvailable: 3,
  },
  { category: "artist", level: "world-animal", entities: [artist("ArtistaX")], totalAvailable: 1 },
  { category: "university", level: "country-animal", entities: [], totalAvailable: 0 },
  { category: "city", level: "country-animal", entities: [city("CiudadX")], totalAvailable: 1 },
];

async function renderWithGroups(groups: PersonalAtlasGroup[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ groups, usedCountry: true }) })
  );
  render(<PersonalAtlasPilot animal="Caballo" countryISO="AR" />);
  await waitFor(() => expect(screen.getByText("Actualidad")).toBeInTheDocument());
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("PersonalAtlasPilot — Fútbol: Equipos / Jugadores (Actualidad + Referentes históricos)", () => {
  test("football_player con category=actual aparece bajo Actualidad", async () => {
    await renderWithGroups(GROUPS);
    const actualidad = screen.getByText("Actualidad").closest("div")!;
    expect(actualidad.parentElement).toHaveTextContent("Actual1");
    expect(actualidad.parentElement).toHaveTextContent("Actual2");
  });

  test("football_player con category=historico aparece bajo Referentes históricos", async () => {
    await renderWithGroups(GROUPS);
    const historicos = screen.getByText("Referentes históricos").closest("div")!;
    expect(historicos.parentElement).toHaveTextContent("Historico1");
  });

  test("ningún histórico aparece en el bloque Actualidad", async () => {
    await renderWithGroups(GROUPS);
    const actualidad = screen.getByText("Actualidad").closest("div")!;
    expect(actualidad.parentElement).not.toHaveTextContent("Historico1");
  });

  test("ningún actual aparece en el bloque Referentes históricos", async () => {
    await renderWithGroups(GROUPS);
    const historicos = screen.getByText("Referentes históricos").closest("div")!;
    expect(historicos.parentElement).not.toHaveTextContent("Actual1");
    expect(historicos.parentElement).not.toHaveTextContent("Actual2");
  });

  test("Equipos sigue mostrándose separado de Jugadores", async () => {
    await renderWithGroups(GROUPS);
    expect(screen.getByText("Equipos")).toBeInTheDocument();
    expect(screen.getByText("River")).toBeInTheDocument();
  });

  test("Famosos sigue fuera de Fútbol", async () => {
    await renderWithGroups(GROUPS);
    const futbolHeading = screen.getByText("Fútbol");
    const futbolSection = futbolHeading.parentElement!;
    expect(futbolSection).not.toHaveTextContent("ArtistaX");
    expect(screen.getByText("ArtistaX")).toBeInTheDocument();
  });

  test("City sigue funcionando", async () => {
    await renderWithGroups(GROUPS);
    expect(screen.getByText("CiudadX")).toBeInTheDocument();
  });

  test("los badges de fallback siguen usando group.level (region-animal → En tu región)", async () => {
    await renderWithGroups(GROUPS);
    // El grupo football_player tiene level "region-animal" — ambos subgrupos
    // (Actualidad y Referentes históricos) heredan el mismo badge del group.
    const badges = screen.getAllByText("En tu región");
    expect(badges.length).toBe(2);
  });

  test("football_player no genera link/404: la card se muestra sin <a>", async () => {
    await renderWithGroups(GROUPS);
    const card = screen.getByText("Actual1").closest("a, div")!;
    expect(card.tagName).not.toBe("A");
  });
});
