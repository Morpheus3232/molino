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
import AffinityTypeContent from "@/app/[locale]/affinity/[type]/AffinityTypeContent";
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

// Con Rata activa (default sin perfil): UADE como amiga (Dragón), UBA como
// enemiga (Caballo), una del mismo signo y una del resto del ciclo (Gallo),
// que no se lista: solo se muestran mismo signo, amigos y enemigo.
const UADE = university("uade", "Universidad Argentina de la Empresa (UADE)", 1952);
const UBA = university("uba", "Universidad de Buenos Aires (UBA)", 1954);
const SAME_ANIMAL_ENTITY = university("rata-u", "Universidad Rata", 1900);
const OTHER = university("gallo-u", "Universidad Gallo", 1957);

const SHOWN = [UADE, UBA, SAME_ANIMAL_ENTITY];
const ENTITIES = [...SHOWN, OTHER];

beforeEach(() => {
  localStorage.clear();
});

describe("AffinityTypeContent — sin perfil (animal activo por defecto: Rata)", () => {
  it('buscar "UADE" muestra la card de UADE (antes: contada pero invisible)', async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UADE");

    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
  });

  it('buscar "UBA" muestra la card de UBA (antes: contada pero invisible)', async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UBA");

    expect(await screen.findByText(UBA.name)).toBeInTheDocument();
  });

  it('búsqueda parcial ("UAD") sigue encontrando la entidad', async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UAD");

    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
  });

  it("búsqueda case-insensitive sigue funcionando", async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "uade");

    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
  });

  it("el contador de resultados coincide con la cantidad de cards renderizadas", async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "Universidad"); // matchea las 4; se muestran 3

    await waitFor(() => expect(screen.getByText(/3 resultados para/i)).toBeInTheDocument());
    for (const entity of SHOWN) {
      expect(screen.getByText(entity.name)).toBeInTheDocument();
    }
    expect(screen.queryByText(OTHER.name)).not.toBeInTheDocument();
  });

  it("limpiar la búsqueda vuelve a mostrar todas las entidades sin duplicados", async () => {
    const user = userEvent.setup();
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);

    const search = await screen.findByLabelText(/buscar universidades/i);
    await user.type(search, "UADE");
    await screen.findByText(UADE.name);
    await user.clear(search);

    for (const entity of SHOWN) {
      expect(await screen.findAllByText(entity.name)).toHaveLength(1);
    }
  });

  it("el mismo signo se agrupa bajo 'Tu propio signo'", async () => {
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);
    expect(await screen.findByText(SAME_ANIMAL_ENTITY.name)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Tu propio signo/ })).toBeInTheDocument();
  });

  it("solo lista mismo signo, amigos y enemigo: el resto del ciclo no aparece", async () => {
    render(<AffinityTypeContent meta={META} entities={ENTITIES} />);
    expect(await screen.findByText(UADE.name)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Tus dos amigos/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Tu enemigo/ })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /El resto del ciclo/ })).not.toBeInTheDocument();
    expect(screen.queryByText(OTHER.name)).not.toBeInTheDocument();
  });
});
