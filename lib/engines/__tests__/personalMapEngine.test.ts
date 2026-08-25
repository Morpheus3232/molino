import { describe, it, expect } from "vitest";
import { ANIMALS } from "@/lib/data/animalRelations";
import {
  amigosDe,
  animalsByKind,
  buildPersonalMap,
  buildRelationMap,
  enemigoDe,
  relacionCon,
  type MapEntityInput,
} from "../personalMapEngine";

function entity(over: Partial<MapEntityInput> & { id: string }): MapEntityInput {
  const year = over.year ?? 1966;
  return {
    name: over.id,
    animal: "Caballo",
    type: "country",
    year,
    // Por defecto las entidades del fixture tienen fecha exacta: sin ella el
    // motor las descarta, que es justamente lo que prueba el test de abajo.
    originDate: `${year}-06-15`,
    isApproximate: false,
    ...over,
  };
}

describe("relaciones del ciclo de doce", () => {
  it("cada signo tiene exactamente dos amigos y un enemigo", () => {
    for (const animal of ANIMALS) {
      expect(amigosDe(animal)).toHaveLength(2);
      expect(enemigoDe(animal)).not.toBeNull();
      // El enemigo nunca puede ser también amigo.
      expect(amigosDe(animal)).not.toContain(enemigoDe(animal));
    }
  });

  it("resuelve amigos y enemigo de un animal concreto", () => {
    // Caballo: amigos Tigre y Perro (San He), enemigo Rata (a 6 posiciones).
    expect(amigosDe("Caballo").sort()).toEqual(["Perro", "Tigre"]);
    expect(enemigoDe("Caballo")).toBe("Rata");
  });

  it("deja Liu He y Liu Hai fuera del modelo, en el resto del ciclo", () => {
    // Cabra es el par Liu He del Caballo y Buey su Liu Hai: la tradición los
    // nombra, este mapa no los usa.
    expect(relacionCon("Caballo", "Cabra")).toBe("otro");
    expect(relacionCon("Caballo", "Buey")).toBe("otro");
  });

  it("clasifica en las cuatro casillas del mapa", () => {
    expect(relacionCon("Caballo", "Caballo")).toBe("mismo");
    expect(relacionCon("Caballo", "Tigre")).toBe("amigo");
    expect(relacionCon("Caballo", "Rata")).toBe("enemigo");
    expect(relacionCon("Caballo", "Dragón")).toBe("otro");
  });

  it("reparte los doce animales sin dejar ninguno afuera ni repetido", () => {
    const buckets = animalsByKind("Caballo");
    const todos = [...buckets.mismo, ...buckets.amigo, ...buckets.enemigo, ...buckets.otro];
    expect(todos).toHaveLength(12);
    expect(new Set(todos).size).toBe(12);
    expect(buckets.otro).toHaveLength(8); // 12 - 1 - 2 - 1
  });

  it("el mapa del ciclo trae los doce con su casilla", () => {
    const mapa = buildRelationMap("Caballo");
    expect(mapa).toHaveLength(12);
    expect(mapa.find((e) => e.animal === "Caballo")?.kind).toBe("mismo");
    expect(mapa.find((e) => e.animal === "Rata")?.kind).toBe("enemigo");
    expect(mapa.filter((e) => e.kind === "amigo")).toHaveLength(2);
  });

  it("trata un animal desconocido como resto en vez de romper", () => {
    expect(relacionCon("", "Caballo")).toBe("otro");
    expect(relacionCon("Caballo", "Unicornio")).toBe("otro");
  });
});

describe("buildPersonalMap", () => {
  const catalog: MapEntityInput[] = [
    entity({ id: "pais-mismo", type: "country", animal: "Caballo", year: 1966 }),
    entity({ id: "pais-triada", type: "country", animal: "Tigre", year: 1962 }),
    entity({ id: "pais-choque", type: "country", animal: "Rata", year: 1960 }),
    entity({ id: "ciudad-misma", type: "city", animal: "Caballo", year: 1918 }),
    entity({ id: "ciudad-par", type: "city", animal: "Cabra", year: 1919 }),
    entity({ id: "auto-mismo", type: "brand", category: "autos", animal: "Caballo", year: 1930 }),
    entity({ id: "auto-mov", type: "brand", category: "Autos y Movilidad", animal: "Tigre", year: 1938 }),
    entity({ id: "ropa-misma", type: "brand", category: "ropa", animal: "Caballo", year: 1954 }),
    entity({ id: "ropa-moda", type: "brand", category: "Ropa y Moda", animal: "Buey", year: 1961 }),
    entity({ id: "equipo", type: "team", animal: "Caballo", year: 1906 }),
    entity({ id: "marca-suelta", type: "brand", category: "Tecnología", animal: "Caballo", year: 1978 }),
    entity({ id: "marca-sin-categoria", type: "brand", animal: "Perro", year: 1970 }),
    entity({ id: "uni", type: "university", animal: "Caballo", year: 1942 }),
    entity({ id: "artista", type: "artist", animal: "Tigre", year: 1974 }),
    entity({ id: "jugador", type: "football_player", animal: "Caballo", year: 1978 }),
    entity({ id: "peli", type: "movie", animal: "Cabra", year: 1979 }),
  ];

  const perfil = { chineseZodiac: "Caballo", chineseZodiacInfo: { element: "Fuego" } };

  it("cubre todos los tipos fechados del atlas, sin dejar ninguno afuera", () => {
    const map = buildPersonalMap(perfil, catalog);
    expect(map.domains.map((d) => d.id)).toEqual([
      "territorio",
      "vestimenta",
      "autos",
      "cancha",
      "aula",
      "gente",
      "pantalla",
    ]);
    // Todo el catálogo entra a algún dominio salvo las dos marcas que no son
    // ni ropa ni autos ("marca-suelta" de tecnología y "marca-sin-categoria"):
    // el bucket genérico de "marcas" se eliminó a propósito, no respondía
    // ninguna pregunta concreta del lector.
    const evaluadas = map.domains.reduce((sum, d) => sum + d.evaluated, 0);
    expect(evaluadas).toBe(catalog.length - 2);
  });

  it("territorio junta países y ciudades en un solo dominio", () => {
    const map = buildPersonalMap(perfil, catalog);
    const territorio = map.domains[0];
    expect(territorio.evaluated).toBe(5); // 3 países + 2 ciudades
    const mismos = territorio.groups.find((g) => g.kind === "mismo")!;
    expect(mismos.entities.map((e) => e.id)).toEqual(["pais-mismo", "ciudad-misma"]);
  });

  it("agrupa por relación en vez de rankear", () => {
    const map = buildPersonalMap(perfil, catalog);
    const territorio = map.domains[0];
    expect(territorio.groups.map((g) => g.kind)).toEqual(["mismo", "amigo", "enemigo"]);
    expect(territorio.groups.find((g) => g.kind === "mismo")!.total).toBe(2);
    expect(territorio.groups.find((g) => g.kind === "enemigo")!.total).toBe(1);
  });

  it("manda cada tipo a su dominio y no a otro", () => {
    const map = buildPersonalMap(perfil, catalog);
    const idsDe = (id: string) =>
      map.domains.find((d) => d.id === id)!.groups.flatMap((g) => g.entities.map((e) => e.id));
    expect(idsDe("cancha")).toEqual(["equipo"]);
    expect(idsDe("territorio")).not.toContain("equipo");
    expect(idsDe("vestimenta")).toContain("ropa-misma");
    expect(idsDe("autos")).toContain("auto-mismo");
    // Sin dominio "marcas": una marca de tecnología ya no tiene dónde caer, y
    // eso es deliberado — el bucket genérico no respondía ninguna pregunta.
    expect(map.domains.flatMap((d) => d.groups.flatMap((g) => g.entities.map((e) => e.id))))
      .not.toContain("marca-suelta");
  });

  it("acepta las dos formas en que los datasets etiquetan autos y ropa", () => {
    const map = buildPersonalMap(perfil, catalog);
    expect(map.domains.find((d) => d.id === "autos")!.evaluated).toBe(2);
    expect(map.domains.find((d) => d.id === "vestimenta")!.evaluated).toBe(2);
  });

  it("nunca lista el resto del ciclo, pero lo cuenta", () => {
    const territorio = buildPersonalMap(perfil, catalog).domains[0];
    expect(territorio.groups.some((g) => g.kind === "otro")).toBe(false);
    // ciudad-par (Cabra, Liu He) entra al resto: el modelo no la nombra.
    expect(territorio.neutralCount).toBe(1);
  });

  it("es determinista: mismo input, mismo resultado", () => {
    expect(buildPersonalMap(perfil, catalog)).toEqual(buildPersonalMap(perfil, catalog));
  });

  it("la lectura del dominio cita conteos reales, no frases genéricas", () => {
    const territorio = buildPersonalMap(perfil, catalog).domains[0];
    expect(territorio.reading).toContain("5");
    expect(territorio.reading).toContain("Caballo");
  });

  it("descarta toda entidad sin fecha exacta, y dice cuántas", () => {
    const conDudosas = [
      ...catalog,
      entity({ id: "pais-solo-año", type: "country", animal: "Caballo", originDate: undefined }),
      entity({ id: "pais-aproximado", type: "country", animal: "Caballo", isApproximate: true }),
    ];
    const territorio = buildPersonalMap(perfil, conDudosas).domains[0];
    const ids = territorio.groups.flatMap((g) => g.entities.map((e) => e.id));
    expect(ids).not.toContain("pais-solo-año");
    expect(ids).not.toContain("pais-aproximado");
    expect(territorio.descartadas).toBe(2);
    expect(territorio.evaluated).toBe(5); // las mismas 5 verificadas de siempre
  });

  it("prioriza el país del usuario dentro de cada casilla, sin cambiar la casilla", () => {
    const conPaises = [
      entity({ id: "jp-1", type: "city", animal: "Caballo", year: 1600, country: "Japón", countryISO: "JP" }),
      entity({ id: "ar-1", type: "city", animal: "Caballo", year: 1900, country: "Argentina", countryISO: "AR" }),
      entity({ id: "ar-2", type: "city", animal: "Tigre", year: 1910, country: "Argentina", countryISO: "AR" }),
      entity({ id: "us-1", type: "city", animal: "Tigre", year: 1700, country: "Estados Unidos", countryISO: "US" }),
    ];

    const sinPais = buildPersonalMap(perfil, conPaises).domains[0];
    // Sin país declarado manda la fundación más antigua.
    expect(sinPais.groups.find((g) => g.kind === "mismo")!.entities[0].id).toBe("jp-1");
    expect(sinPais.groups.find((g) => g.kind === "amigo")!.entities[0].id).toBe("us-1");

    const conPais = buildPersonalMap(perfil, conPaises, { userCountryISO: "AR" }).domains[0];
    expect(conPais.groups.find((g) => g.kind === "mismo")!.entities[0].id).toBe("ar-1");
    expect(conPais.groups.find((g) => g.kind === "amigo")!.entities[0].id).toBe("ar-2");

    // Y lo importante: el país NO movió ninguna entidad de casilla.
    const casillaDe = (d: typeof conPais, id: string) =>
      d.groups.find((g) => g.entities.some((e) => e.id === id))?.kind;
    for (const id of ["jp-1", "ar-1", "ar-2", "us-1"]) {
      expect(casillaDe(conPais, id)).toBe(casillaDe(sinPais, id));
    }
  });

  it("reserva 3 lugares para el país del usuario, no el grupo entero", () => {
    // 6 argentinas y 4 del resto del mundo, todas del mismo signo. Con un
    // cupo de 8, si "primero lo local" fuese absoluto el usuario vería 6
    // argentinas y solo 2 del mundo. La regla es 3 + mundo.
    const muchasLocales = [
      ...Array.from({ length: 6 }, (_, i) =>
        entity({ id: `ar-${i}`, type: "city", animal: "Caballo", year: 1900 + i, country: "Argentina", countryISO: "AR" }),
      ),
      ...Array.from({ length: 4 }, (_, i) =>
        entity({ id: `xx-${i}`, type: "city", animal: "Caballo", year: 1800 + i, country: "Japón", countryISO: "JP" }),
      ),
    ];
    const grupo = buildPersonalMap(perfil, muchasLocales, { userCountryISO: "AR" })
      .domains[0].groups.find((g) => g.kind === "mismo")!;

    const isos = grupo.entities.map((e) => e.countryISO);
    expect(grupo.entities).toHaveLength(8);
    expect(isos.slice(0, 3)).toEqual(["AR", "AR", "AR"]);
    expect(isos.filter((i) => i === "JP")).toHaveLength(4); // el mundo entra completo
    expect(grupo.total).toBe(10); // el conteo sigue siendo el real
  });

  it("pone la gama media antes que la de lujo", () => {
    const marcas = [
      ...Array.from({ length: 6 }, (_, i) =>
        entity({ id: `lujo-${i}`, type: "brand", category: "autos", animal: "Caballo", year: 1900 + i, premium: true }),
      ),
      ...Array.from({ length: 4 }, (_, i) =>
        entity({ id: `comun-${i}`, type: "brand", category: "autos", animal: "Caballo", year: 1950 + i }),
      ),
    ];
    const grupo = buildPersonalMap(perfil, marcas).domains
      .find((d) => d.id === "autos")!
      .groups.find((g) => g.kind === "mismo")!;

    // Gama media primero: las 4 accesibles encabezan, las caras van después.
    // Sin este orden las 6 de lujo (más antiguas) copaban el top.
    expect(grupo.entities.slice(0, 4).every((e) => !e.premium)).toBe(true);
    expect(grupo.entities.slice(4).every((e) => e.premium)).toBe(true);
    // Relega, no descarta: los lugares sobrantes se llenan y el conteo del
    // grupo sigue siendo el real.
    expect(grupo.entities).toHaveLength(8);
    expect(grupo.total).toBe(10);
  });

  it("acerca primero a las personas de la generación del usuario", () => {
    const gente = [
      entity({ id: "viejo", type: "artist", animal: "Caballo", year: 1930 }),
      entity({ id: "coetaneo", type: "artist", animal: "Caballo", year: 1988 }),
    ];
    const sinEdad = buildPersonalMap(perfil, gente).domains.find((d) => d.id === "gente")!;
    expect(sinEdad.groups[0].entities[0].id).toBe("viejo"); // manda el año más antiguo

    const conEdad = buildPersonalMap(perfil, gente, { userBirthYear: 1990 }).domains
      .find((d) => d.id === "gente")!;
    expect(conEdad.groups[0].entities[0].id).toBe("coetaneo");
  });

  it("marca insuficiente el dominio que no puede darle opciones a cada signo", () => {
    // El fixture tiene 2 entradas de vestimenta: seis de los doce signos no
    // verían ninguna. La UI lo anuncia pendiente en vez de abrir un bloque
    // numerado con nada adentro.
    const map = buildPersonalMap(perfil, catalog);
    expect(map.domains.find((d) => d.id === "vestimenta")!.insuficiente).toBe(true);
    expect(map.domains.find((d) => d.id === "gente")!.evaluated).toBeLessThan(12);

    const muchos = Array.from({ length: 14 }, (_, i) =>
      entity({ id: `r-${i}`, type: "brand", category: "ropa", animal: "Caballo", year: 1900 + i }),
    );
    expect(buildPersonalMap(perfil, muchos).domains.find((d) => d.id === "vestimenta")!.insuficiente)
      .toBe(false);
  });

  it("expone el país usado para ordenar", () => {
    expect(buildPersonalMap(perfil, catalog, { userCountryISO: "AR" }).userCountryISO).toBe("AR");
    expect(buildPersonalMap(perfil, catalog).userCountryISO).toBeNull();
  });

  it("sin animal resuelto no inventa un mapa", () => {
    const map = buildPersonalMap({}, catalog);
    expect(map.domains).toEqual([]);
    expect(map.relationMap).toEqual([]);
  });

  it("la regla de cada grupo nombra a los animales concretos del ciclo", () => {
    const territorio = buildPersonalMap(perfil, catalog).domains[0];
    expect(territorio.groups.find((g) => g.kind === "amigo")!.rule).toContain("Tigre");
    expect(territorio.groups.find((g) => g.kind === "enemigo")!.rule).toContain("Rata");
  });
});
