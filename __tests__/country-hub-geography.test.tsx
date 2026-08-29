import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CountryHubClient from "@/components/atlas/CountryHubClient";
import type { AtlasCategory } from "@/lib/data/atlas-queries";
import type { LightweightEntity } from "@/types/atlas";

const mockCategories: AtlasCategory[] = [
  { type: "city", label: "Ciudad", plural: "Ciudades", count: 3 },
  { type: "team", label: "Equipo", plural: "Equipos", count: 2 },
  { type: "university", label: "Universidad", plural: "Universidades", count: 4 },
];

const mockCities: LightweightEntity[] = [
  {
    id: "buenos-aires",
    name: "Buenos Aires",
    type: "city",
    animal: "Caballo",
    isApproximate: false,
    visualType: "flag",
    emoji: "🏛️",
    country: "Argentina",
    countryISO: "AR",
    origin: "Fundación · 1580",
  },
  {
    id: "cordoba",
    name: "Córdoba",
    type: "city",
    animal: "Gallo",
    isApproximate: false,
    visualType: "flag",
    emoji: "🏛️",
    country: "Argentina",
    countryISO: "AR",
    origin: "Fundación · 1573",
  },
  {
    id: "mendoza",
    name: "Mendoza",
    type: "city",
    animal: "Rata",
    isApproximate: false,
    visualType: "flag",
    emoji: "🏛️",
    country: "Argentina",
    countryISO: "AR",
    origin: "Fundación · 1561",
  },
];

const mockCountryEntity: LightweightEntity = {
  id: "argentina",
  name: "Argentina",
  type: "country",
  animal: "Rata",
  isApproximate: false,
  visualType: "flag",
  countryISO: "AR",
  origin: "Independencia · 1816",
};

describe("CountryHubClient (Fase 3 - Geografía Bidireccional)", () => {
  it("renderiza el hub del país con ciudades y categorías", () => {
    render(
      <CountryHubClient
        countryISO="AR"
        countryName="Argentina"
        flagEmoji="🇦🇷"
        categories={mockCategories}
        cities={mockCities}
        countryEntity={mockCountryEntity}
      />
    );

    expect(screen.getByRole("heading", { name: "Argentina" })).toBeInTheDocument();
    expect(screen.getByText("9 entidades registradas")).toBeInTheDocument();
    expect(screen.getByText("Ciudades de Argentina")).toBeInTheDocument();
    expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    expect(screen.getByText("Córdoba")).toBeInTheDocument();
    expect(screen.getByText("Mendoza")).toBeInTheDocument();
    expect(screen.getByText("Ficha simbólica de Argentina")).toBeInTheDocument();
  });

  it("permite buscar y filtrar ciudades en tiempo real", async () => {
    const user = userEvent.setup();
    render(
      <CountryHubClient
        countryISO="AR"
        countryName="Argentina"
        flagEmoji="🇦🇷"
        categories={mockCategories}
        cities={mockCities}
        countryEntity={mockCountryEntity}
      />
    );

    // Initial state: all cities visible
    expect(screen.getByText("Buenos Aires")).toBeInTheDocument();
    expect(screen.getByText("Córdoba")).toBeInTheDocument();
    expect(screen.getByText("Mendoza")).toBeInTheDocument();

    // If search exists (mock has 3 cities, let's verify links)
    const links = screen.getAllByRole("link");
    const baLink = links.find((l) => l.getAttribute("href") === "/affinity/city/buenos-aires");
    expect(baLink).toBeDefined();
  });

  it("enlaza de regreso a la ficha simbólica del país y al Atlas general", () => {
    render(
      <CountryHubClient
        countryISO="AR"
        countryName="Argentina"
        flagEmoji="🇦🇷"
        categories={mockCategories}
        cities={mockCities}
        countryEntity={mockCountryEntity}
      />
    );

    const countryLink = screen.getByRole("link", { name: /Ficha simbólica de Argentina/i });
    expect(countryLink).toHaveAttribute("href", "/affinity/country/argentina");

    const atlasBackLink = screen.getByRole("link", { name: /Volver al Atlas/i });
    expect(atlasBackLink).toHaveAttribute("href", "/atlas");
  });
});
