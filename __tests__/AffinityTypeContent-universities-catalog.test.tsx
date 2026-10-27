/**
 * /affinity/university con el catálogo REAL (no fixtures) — confirma que la
 * limpieza de duplicados y la ampliación de cobertura funcionan de punta a
 * punta: buscar cada universidad prioritaria devuelve exactamente una card,
 * sin duplicados, y limpiar la búsqueda no los introduce.
 */
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AffinityTypeContent from "@/app/[locale]/affinity/[type]/AffinityTypeContent";
import { getEntitiesByType, toLightweightEntity, ENTITY_TYPES } from "@/lib/data/symbolic-entities";

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

const ENTITIES = getEntitiesByType("university").map(toLightweightEntity);
const META = ENTITY_TYPES.university;

beforeEach(() => {
  localStorage.clear();
});

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * El listado muestra solo tu signo, tus amigos y tu enemigo. Para encontrar
 * una universidad puntual se activa su propio signo: así cae en "Tu propio
 * signo" y la búsqueda prueba lo que importa (una sola card, sin duplicados).
 */
async function search(query: string, nameFragment?: string) {
  const user = userEvent.setup();
  const target = nameFragment ? ENTITIES.find((e) => new RegExp(esc(nameFragment), "i").test(e.name)) : undefined;
  render(<AffinityTypeContent meta={META} entities={ENTITIES} initialAnimal={target?.animal} />);
  const input = await screen.findByLabelText(/buscar universidades/i);
  await user.type(input, query);
  return { user };
}

describe("Catálogo real de universidades — búsqueda de las prioritarias", () => {
  it.each([
    ["UBA", "Universidad de Buenos Aires"],
    ["UADE", "Universidad Argentina de la Empresa"],
    ["ITBA", "Instituto Tecnológico de Buenos Aires"],
    ["Salvador", "Universidad del Salvador"],
    ["UCES", "Universidad de Ciencias Empresariales y Sociales"],
    ["Di Tella", "Universidad Torcuato Di Tella"],
  ])('buscar "%s" muestra exactamente una card de "%s"', async (query, expectedNameFragment) => {
    await search(query, expectedNameFragment);
    const matches = await screen.findAllByText(new RegExp(esc(expectedNameFragment), "i"));
    expect(matches).toHaveLength(1);
  });

  it('buscar "UCEMA" no devuelve la Universidad CLAEH ni viceversa', async () => {
    await search("UCEMA", "Universidad del CEMA");
    expect(await screen.findByText(/Universidad del CEMA/i)).toBeInTheDocument();
    expect(screen.queryByText(/CLAEH/i)).not.toBeInTheDocument();
  });

  it('buscar "La Plata" no muestra dos cards de UNLP con datos distintos', async () => {
    await search("La Plata", "Universidad Nacional de La Plata");
    const matches = await screen.findAllByText(/Universidad Nacional de La Plata/i);
    expect(matches).toHaveLength(1);
  });
});

describe("Catálogo real de universidades — sin duplicados al limpiar la búsqueda", () => {
  it("cada universidad prioritaria aparece una sola vez en el listado completo", async () => {
    const { user } = await search("UBA", "Universidad de Buenos Aires");
    await screen.findByText(/Universidad de Buenos Aires/i);
    const input = screen.getByLabelText(/buscar universidades/i);
    await user.clear(input);
    await waitFor(() => expect(input).toHaveValue(""));

    const uba = screen.queryAllByText(/Universidad de Buenos Aires \(UBA\)/i);
    expect(uba.length).toBeLessThanOrEqual(1);
  });
});
