/**
 * groupByRelation() — /affinity/[type] visibility fix.
 *
 * Root cause: the search-result counter was computed over ALL matched
 * entities, but only entities whose relation type was "same" / "triad" /
 * "clash" were placed into a renderable group — "harmonious" / "neutral" /
 * "harm" were silently dropped. An entity could be counted ("1 resultado")
 * without ever rendering a card (this is exactly what happened searching
 * "UADE" or "UBA" with the default/no-profile animal "Rata": both resolve
 * to a "neutral" relation with Rata).
 *
 * groupByRelation() must now be exhaustive: every entity that comes in
 * ends up in exactly one of its returned groups, so summing all group
 * lengths always equals the input length.
 */
import { describe, it, expect } from "vitest";
import { groupByRelation } from "@/app/affinity/[type]/AffinityTypeContent";
import { getChineseAnimal } from "@/lib/engines/chineseZodiacEngine";
import { getRelation, ANIMALS, type Animal } from "@/lib/data/animalRelations";
import type { LightAffinityResult } from "@/lib/affinity-light";

function fixture(id: string, name: string, animal: Animal): LightAffinityResult {
  return {
    id,
    name,
    animal,
    visualType: "logo",
    type: "university",
    score: getRelation("Rata", animal).score,
    tier: "afinidad-media",
    relationship: getRelation("Rata", animal).label,
    isApproximate: false,
  };
}

describe("groupByRelation — exhaustiveness (no entity dropped)", () => {
  it("UADE (1957 → Gallo, neutral con Rata) aparece en algún grupo", () => {
    const uadeAnimal = getChineseAnimal(1957);
    expect(getRelation("Rata", uadeAnimal).type).toBe("neutral"); // confirma la causa raíz
    const groups = groupByRelation("Rata", [fixture("uade", "UADE", uadeAnimal)]);
    const allRendered = [...groups.same, ...groups.triad, ...groups.opposite, ...groups.other];
    expect(allRendered).toHaveLength(1);
    expect(allRendered[0].id).toBe("uade");
    expect(groups.other.map(r => r.id)).toContain("uade");
  });

  it("UBA (1821 → Serpiente, neutral con Rata) aparece en algún grupo", () => {
    const ubaAnimal = getChineseAnimal(1821);
    expect(getRelation("Rata", ubaAnimal).type).toBe("neutral"); // confirma la causa raíz
    const groups = groupByRelation("Rata", [fixture("uba", "UBA", ubaAnimal)]);
    const allRendered = [...groups.same, ...groups.triad, ...groups.opposite, ...groups.other];
    expect(allRendered).toHaveLength(1);
    expect(groups.other.map(r => r.id)).toContain("uba");
  });

  it("una entidad con relación neutral queda contada Y visible (no descartada en silencio)", () => {
    const neutralAnimal = "Gato"; // Rata.neutralRelations incluye "Gato"
    expect(getRelation("Rata", neutralAnimal).type).toBe("neutral");
    const groups = groupByRelation("Rata", [fixture("x", "Entidad neutral", neutralAnimal)]);
    const total = groups.same.length + groups.triad.length + groups.opposite.length + groups.other.length;
    expect(total).toBe(1);
  });

  it("una entidad armoniosa (liu he) también queda visible, no descartada", () => {
    const harmoniousAnimal = "Buey"; // liuHePartner de Rata
    expect(getRelation("Rata", harmoniousAnimal).type).toBe("harmonious");
    const groups = groupByRelation("Rata", [fixture("y", "Entidad armoniosa", harmoniousAnimal)]);
    expect(groups.other.map(r => r.id)).toContain("y");
  });

  it("same/triad/opposite mantienen exactamente su agrupación de siempre", () => {
    const groups = groupByRelation("Rata", [
      fixture("same-1", "Misma", "Rata"),
      fixture("triad-1", "Triada", "Dragón"),
      fixture("clash-1", "Opuesta", "Caballo"),
    ]);
    expect(groups.same.map(r => r.id)).toEqual(["same-1"]);
    expect(groups.triad.map(r => r.id)).toEqual(["triad-1"]);
    expect(groups.opposite.map(r => r.id)).toEqual(["clash-1"]);
    expect(groups.other).toHaveLength(0);
  });

  it("contador = total renderizado para cualquier combinación de animales", () => {
    const entities = ANIMALS.map((a, i) => fixture(`e${i}`, `Entidad ${a}`, a));
    const groups = groupByRelation("Rata", entities);
    const rendered = groups.same.length + groups.triad.length + groups.opposite.length + groups.other.length;
    expect(rendered).toBe(entities.length);
  });

  it("no genera duplicados: cada entidad cae en exactamente un grupo", () => {
    const entities = ANIMALS.map((a, i) => fixture(`e${i}`, `Entidad ${a}`, a));
    const groups = groupByRelation("Caballo", entities);
    const ids = [...groups.same, ...groups.triad, ...groups.opposite, ...groups.other].map(r => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(entities.length);
  });
});
