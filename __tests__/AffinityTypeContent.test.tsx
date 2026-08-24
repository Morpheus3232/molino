/**
 * AffinityTypeContent — search + visibility regression coverage.
 *
 * Before the fix: an entity whose relation to the active animal was
 * "harmonious" / "neutral" / "harm" was counted by the search subtitle
 * ("N resultados") but never rendered — groupByRelation() silently
 * dropped it. This reproduces the exact reported scenario: no profile
 * (active animal defaults to "Rata"), searching "UADE" / "UBA".
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AffinityTypeContent from "@/app/affinity/[type]/AffinityTypeContent";
import { getChineseAnimal } from "@/lib/engines/chineseZodiacEngine";
import type { LightweightEntity } from "@/types/atlas";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

if (typeof (global as unknown as { IntersectionObserver?: unknown }).IntersectionObserver === "undefined") {
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  (global as unknown as { IntersectionObserver: unknown }).IntersectionObserver = MockIntersectionObserver;
}

const META = { label: "Universidad", plural: "Universidades", icon: "🎓", description: "Universidades" };

function university(id: string, name: string, foundingYear: number): LightweightEntity {
  return {
    id,
    name,
    animal: getChineseAnimal(foundingYear),
    isApproximate: false,
    visualType: "logo",
    type: "university",
    country: "Argentina",
  };
}

// Con Rata activa (default sin perfil): UADE (1957→Gallo) y UBA (1821→Serpiente)
// son ambas "neutral" — exactamente el caso reportado.
const UADE = university("uade", "Universidad Argentina de la Empresa (UADE)", 1957);
const UBA = university("uba", "Universidad de Buenos Aires (UBA)", 1821);
// Control: misma relación "same" con Rata, para confirmar que ese grupo no cambia.
const SAME_ANIMAL_ENTITY = university("rata-u", "Universidad Rata", 1900);

const ENTITIES = [UADE, UBA, SAME_ANIMAL_ENTITY];

beforeEach(() => {
  localStorage.clear();
});

describe("AffinityTypeContent — sin perfil (animal activo por defecto: Rata)", () => {
  it('buscar "UADE" muestra la card de UADE (antes: contada pero invisible)', async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UADE");

    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
  });

  it('buscar "UBA" muestra la card de UBA (antes: contada pero invisible)', async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UBA");

    expect(await screen.findByText(UBA.name)).toBeInTheDocument();
  });

  it('búsqueda parcial ("UAD") sigue encontrando la entidad', async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UAD");

    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
  });

  it("búsqueda case-insensitive sigue funcionando", async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "uade");

    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
  });

  it("el contador de resultados coincide con la cantidad de cards renderizadas", async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "Universidad"); // matchea las 3

    await waitFor(() => expect(screen.getByText(/3 resultados para/i)).toBeInTheDocument());
    for (const entity of ENTITIES) {
      expect(screen.getByText(entity.name)).toBeInTheDocument();
    }
  });

  it("limpiar la búsqueda vuelve a mostrar todas las entidades sin duplicados", async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UADE");
    await screen.findByText(UADE.name);
    await user.clear(search);

    for (const entity of ENTITIES) {
      expect(await screen.findAllByText(entity.name)).toHaveLength(1);
    }
  });

  it("same/triad/opposite se agrupan con la nueva terminología: 'Alta compatibilidad'", async () => {
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);
    expect(await screen.findByText(SAME_ANIMAL_ENTITY.name)).toBeInTheDocument();
    expect(screen.getByText("Alta compatibilidad")).toBeInTheDocument();
  });

  it("las relaciones que no son same/triad/opposite aparecen bajo 'Otras conexiones'", async () => {
    render(<AffinityTypeContent type="university" meta={META} entities={ENTITIES} />);
    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
    expect(screen.getByText("Otras conexiones")).toBeInTheDocument();
  });
});
