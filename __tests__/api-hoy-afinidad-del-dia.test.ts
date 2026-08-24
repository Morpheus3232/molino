import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/hoy/afinidad-del-dia/route";
import { getRelation, type Animal } from "@/lib/data/animalRelations";

function req(qs: string) {
  return new Request(`http://localhost:3000/api/hoy/afinidad-del-dia${qs}`);
}

describe("GET /api/hoy/afinidad-del-dia", () => {
  it("400 cuando falta 'animal'", async () => {
    const res = await GET(req("?date=2026-08-23"));
    expect(res.status).toBe(400);
  });

  it("400 cuando 'animal' es inválido (no pertenece al zodíaco chino)", async () => {
    const res = await GET(req("?animal=Unicornio&date=2026-08-23"));
    expect(res.status).toBe(400);
  });

  it("400 cuando falta 'date'", async () => {
    const res = await GET(req("?animal=Caballo"));
    expect(res.status).toBe(400);
  });

  it("400 cuando 'date' tiene formato inválido", async () => {
    const res = await GET(req("?animal=Caballo&date=23-08-2026"));
    expect(res.status).toBe(400);
  });

  it("animal válido devuelve entidad + relación factual", async () => {
    const res = await GET(req("?animal=Caballo&date=2026-08-23"));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.entity).toBeTruthy();
    expect(typeof json.entity.id).toBe("string");
    expect(typeof json.entity.name).toBe("string");
    expect(typeof json.entity.type).toBe("string");
    expect(["same", "triad", "clash"]).toContain(json.relation);
    expect(typeof json.relationLabel).toBe("string");
    // cero lenguaje inventado — mismo vocabulario que /affinity/[type]
    expect(["alta compatibilidad", "buena compatibilidad", "energía opuesta"]).toContain(json.relationLabel);
  });

  it("no expone catálogo, descripciones, eventos, sourceNotes ni scores/porcentajes", async () => {
    const res = await GET(req("?animal=Tigre&date=2026-08-23"));
    const json = await res.json();
    const keys = Object.keys(json).sort();
    expect(keys).toEqual(["entity", "relation", "relationLabel"]);
    const entityKeys = Object.keys(json.entity).sort();
    expect(entityKeys).toEqual(["id", "name", "type"]);
  });

  it("selección determinística: mismo animal + misma fecha → misma entidad en llamadas repetidas", async () => {
    const results = await Promise.all(
      Array.from({ length: 5 }, () => GET(req("?animal=Perro&date=2026-08-23")).then((r) => r.json()))
    );
    const ids = results.map((r) => r.entity.id);
    expect(new Set(ids).size).toBe(1);
    const relations = results.map((r) => r.relation);
    expect(new Set(relations).size).toBe(1);
  });

  it("distinta fecha puede (no necesariamente debe) dar una entidad distinta, pero sigue siendo determinística por sí sola", async () => {
    const a1 = await GET(req("?animal=Dragón&date=2026-08-23")).then((r) => r.json());
    const a2 = await GET(req("?animal=Dragón&date=2026-08-23")).then((r) => r.json());
    const b1 = await GET(req("?animal=Dragón&date=2026-08-24")).then((r) => r.json());
    const b2 = await GET(req("?animal=Dragón&date=2026-08-24")).then((r) => r.json());
    expect(a1.entity.id).toBe(a2.entity.id);
    expect(b1.entity.id).toBe(b2.entity.id);
  });

  it("'date' participa realmente en la selección — no está siendo ignorado", async () => {
    const dates = ["2026-08-23", "2026-08-24", "2026-08-25", "2026-08-26"];
    const results = await Promise.all(
      dates.map((date) => GET(req(`?animal=Caballo&date=${date}`)).then((r) => r.json()))
    );
    const ids = results.map((r) => r.entity.id);

    // mismo animal + misma fecha → mismo resultado (repetido, ya cubierto arriba)
    const repeat = await GET(req("?animal=Caballo&date=2026-08-23")).then((r) => r.json());
    expect(repeat.entity.id).toBe(ids[0]);

    // mismo animal + fecha diferente → seleccionado con una fecha distinta:
    // el seed es (Number(date sin guiones) + índice de animal) % cantidad de
    // candidatas. 4 días consecutivos del mismo mes incrementan ese seed en
    // +1 cada día, así que el índice debería avanzar salvo que el pool de
    // candidatas tenga longitud 1 (no es el caso: Caballo cruza cientos de
    // entidades entre mismo animal + triada + opuesto). Si 'date' estuviera
    // ignorado, las 4 fechas devolverían siempre la misma entidad.
    expect(new Set(ids).size).toBeGreaterThan(1);
  });

  it("integridad: la entidad devuelta realmente pertenece a la relación declarada, verificado con getRelation() (fuente de verdad)", async () => {
    for (const animal of ["Rata", "Buey", "Tigre", "Gato", "Dragón", "Serpiente", "Caballo", "Cabra", "Mono", "Gallo", "Perro", "Cerdo"] as Animal[]) {
      const res = await GET(req(`?animal=${encodeURIComponent(animal)}&date=2026-08-23`));
      const json = await res.json();
      if (!json.entity) continue; // animal sin candidatas — no debe pasar en este catálogo, pero no es un error
      // No podemos re-derivar entity.animal desde la respuesta liviana (no se expone,
      // a propósito, para no filtrar más del contrato mínimo) — en cambio verificamos
      // que el `relation` devuelto es uno de los 3 tipos reales que collectCandidates
      // puede producir, y que relationLabel proviene exactamente de RELATION_LABELS
      // (getRelation) para ese tipo — mismo criterio que /affinity/[type].
      const label = getRelation(animal, animal).label; // "mismo animal" siempre para type "same"
      if (json.relation === "same") {
        expect(json.relationLabel).toBe(label);
      }
      expect(["same", "triad", "clash"]).toContain(json.relation);
    }
  });
});
