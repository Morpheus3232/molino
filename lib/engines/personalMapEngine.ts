/**
 * Personal Map Engine — cruza el mapa de una persona contra el Atlas usando
 * EXCLUSIVAMENTE el zodíaco chino: tu signo contra el signo del año de
 * origen de cada entidad. Nada de numerología, nada de elementos, nada de
 * signo solar. Una sola regla, la del ciclo de doce.
 *
 * Y de ese ciclo se usa solo lo que la práctica sostiene: cada signo tiene
 * DOS AMIGOS y UN ENEMIGO.
 *
 *   本命  tu propio signo   — el año vuelve cada 12
 *   三合  tus dos amigos   — los separados por cuatro posiciones (San He)
 *   六冲  tu enemigo       — el opuesto directo, a seis posiciones (Liu Chong)
 *
 * Los pares Liu He y Liu Hai existen en la tradición pero NO entran acá: se
 * cuentan como el resto del ciclo. Menos categorías, más señal.
 *
 * La relación es CATEGÓRICA, no un puntaje continuo, así que el motor agrupa
 * en vez de rankear. Un ranking 84-83-82 sobre cuatro casillas discretas sería
 * precisión inventada. La lista agrupada dice la verdad del sistema.
 *
 * La única aritmética es la que ya hace el Atlas: año de origen → signo (con
 * el corte real del Año Nuevo chino). Todo verificable a mano.
 *
 * Función pura: mismos argumentos → mismo resultado. Sin I/O, sin Date.now(),
 * sin red. Client-safe (no toca `symbolic-entities`, que es server-only).
 */

import {
  ANIMALS,
  LIU_CHONG_CLASHES,
  RELATION_SCORES,
  SAN_HE_TRIADS,
  type Animal,
} from "@/lib/data/animalRelations";

// ════════════════════════════════════════════════════
// LAS CUATRO CASILLAS: MISMO, AMIGO, ENEMIGO, RESTO
// ════════════════════════════════════════════════════

export type MapRelation = "mismo" | "amigo" | "enemigo" | "otro";

export interface RelationMeta {
  /** Título de la agrupación, en la voz de la página. */
  title: string;
  /** Nombre tradicional + hanzi. Vacío para "otro", que no tiene nombre. */
  chinese: string;
  /** Puntaje canónico del sitio (RELATION_SCORES) — el mismo que usa el resto. */
  score: number;
}

const RELATION_META: Record<MapRelation, RelationMeta> = {
  mismo: { title: "Tu propio signo", chinese: "本命 · běnmìng", score: RELATION_SCORES.same.score },
  amigo: { title: "Tus dos amigos", chinese: "三合 · San He", score: RELATION_SCORES.triad.score },
  enemigo: { title: "Tu energía opuesta", chinese: "六冲 · Liu Chong", score: RELATION_SCORES.clash.score },
  otro: { title: "El resto del ciclo", chinese: "", score: RELATION_SCORES.neutral.score },
};

/**
 * Orden de lectura. `otro` queda afuera a propósito: son ocho de los doce
 * animales y no dicen nada — se cuentan, no se listan.
 */
const KIND_ORDER: MapRelation[] = ["mismo", "amigo", "enemigo"];

/**
 * Cuántas entidades mostrar por grupo. La energía opuesta lleva el mismo cupo
 * que el resto: es una recomendación tan concreta como las otras dos —qué
 * evitar— y esconderla detrás de un "ver 3 de 40" la volvería anecdótica.
 */
const TAKE_BY_KIND: Record<MapRelation, number> = {
  mismo: 8,
  amigo: 8,
  enemigo: 8,
  otro: 0,
};

function isAnimal(value: string): value is Animal {
  return (ANIMALS as readonly string[]).includes(value);
}

/** Los dos amigos: el resto del San He, los separados por cuatro posiciones. */
export function amigosDe(animal: Animal): Animal[] {
  const triad = SAN_HE_TRIADS.find((t) => t.animals.includes(animal));
  return triad ? triad.animals.filter((a) => a !== animal) : [];
}

/** El elemento oculto que comparten los tres — dato del grupo, no del usuario. */
export function elementoDeLosAmigos(animal: Animal): string {
  return SAN_HE_TRIADS.find((t) => t.animals.includes(animal))?.element ?? "";
}

/** El único enemigo: el signo opuesto directo del ciclo (Liu Chong). */
export function enemigoDe(animal: Animal): Animal | null {
  for (const [a, b] of LIU_CHONG_CLASHES) {
    if (a === animal) return b;
    if (b === animal) return a;
  }
  return null;
}

/**
 * La regla, escrita para poder comprobarla contra las tablas del ciclo.
 * Nombra a los animales concretos, no la categoría abstracta.
 */
function ruleFor(kind: MapRelation, animal: Animal, others: string[]): string {
  const lista = others.join(" y ");
  switch (kind) {
    case "mismo":
      return `Su año de origen es un año ${animal}, igual que el tuyo: el ciclo de doce los deja en la misma casilla.`;
    case "amigo":
      return `${animal}, ${lista}: los tres signos separados por cuatro posiciones del ciclo. Comparten el elemento oculto ${elementoDeLosAmigos(animal)}.`;
    case "enemigo":
      return `${lista} está a seis posiciones exactas de ${animal}: su único opuesto en el ciclo.`;
    default:
      return `Ni tu signo, ni tus dos amigos, ni tu enemigo. El ciclo no dice nada sobre estos.`;
  }
}

// ════════════════════════════════════════════════════
// TIPOS PÚBLICOS
// ════════════════════════════════════════════════════

/** Lo mínimo que el motor necesita de una entidad del Atlas. */
export interface MapEntityInput {
  id: string;
  name: string;
  animal: string;
  type: string;
  category?: string;
  country?: string;
  countryISO?: string;
  city?: string;
  emoji?: string;
  imageUrl?: string;
  visualType?: string;
  year?: number;
  isApproximate?: boolean;
  /** Gama alta según el propio registro. Acota cuántas caras entran al top. */
  premium?: boolean;
  /** Fecha exacta ISO del evento primario. Sin ella la entidad no entra. */
  originDate?: string;
}

export interface RelationGroup<E extends MapEntityInput = MapEntityInput> {
  kind: MapRelation;
  title: string;
  chinese: string;
  score: number;
  /** Los animales que caen en esta relación con el usuario. */
  animals: string[];
  /** La regla verificable contra las tablas del ciclo. */
  rule: string;
  /** Cuántas entidades del dominio caen acá en total. */
  total: number;
  /** Las primeras `TAKE_BY_KIND[kind]`, la más antigua primero. */
  entities: E[];
}

export type DomainId =
  | "territorio"
  | "vestimenta"
  | "autos"
  | "cancha"
  | "aula"
  | "gente"
  | "pantalla";

export interface MapDomain<E extends MapEntityInput = MapEntityInput> {
  id: DomainId;
  /** La pregunta que responde el dominio, en segunda persona. */
  question: string;
  /** Etiqueta corta. */
  label: string;
  /** Qué mide exactamente este dominio, sin adjetivos. */
  scope: string;
  /** Ruta del Atlas para ver el listado completo. */
  href: string;
  /** Entidades del dominio con fecha exacta — las únicas que entran al cruce. */
  evaluated: number;
  /** Cuántas se descartaron por no tener fecha exacta documentada. */
  descartadas: number;
  /**
   * El dominio existe en el atlas pero todavía no tiene suficientes entradas
   * verificadas para ofrecerle opciones a cualquier signo. La UI lo anuncia
   * como pendiente en vez de dibujar un bloque casi vacío.
   */
  insuficiente: boolean;
  /** Grupos con al menos una entidad, en orden de lectura. */
  groups: RelationGroup<E>[];
  /** Cuántas quedaron sin relación nombrada. */
  neutralCount: number;
  /** Lectura hecha solo con conteos de esta corrida. */
  reading: string;
}

/** Un signo del ciclo, leído desde el usuario. */
export interface AnimalRelationEntry extends RelationMeta {
  animal: string;
  kind: MapRelation;
}

export interface PersonalMap<E extends MapEntityInput = MapEntityInput> {
  /** El signo del usuario. Es la única entrada del cálculo. */
  animal: string;
  /** Elemento del año lunar. Se muestra en el encabezado; NO entra al cruce. */
  element: string;
  /** Los doce signos del ciclo leídos desde el usuario. */
  relationMap: AnimalRelationEntry[];
  /** ISO del país usado para priorizar el orden, si el perfil declara uno. */
  userCountryISO: string | null;
  domains: MapDomain<E>[];
}

export interface PersonalMapProfileInput {
  chineseZodiac?: string;
  chineseZodiacInfo?: { element?: unknown };
}

export interface PersonalMapOptions {
  /**
   * Año de nacimiento del usuario. Solo se usa en el dominio de personas, para
   * acercar primero a las de su misma generación — dato real (el año de
   * nacimiento está cargado), no una suposición sobre gustos por edad.
   */
  userBirthYear?: number | null;
  /**
   * ISO alpha-2 del país del usuario (de UserContext). Solo ordena: dentro de
   * cada casilla las entidades de ese país van primero. Nunca cambia la
   * afinidad ni de qué casilla es una entidad.
   */
  userCountryISO?: string | null;
}

// ════════════════════════════════════════════════════
// DOMINIOS
// ════════════════════════════════════════════════════

/** Categorías de marca que cuentan como automotriz en los datasets cargados. */
const AUTO_CATEGORIES = new Set(["autos", "Autos y Movilidad"]);
/** Categorías de marca que cuentan como indumentaria. */
const ROPA_CATEGORIES = new Set(["ropa", "Ropa y Moda"]);

interface DomainSpec {
  id: DomainId;
  question: string;
  label: string;
  scope: string;
  href: string;
  matches: (e: MapEntityInput) => boolean;
  /** El dominio son personas: se prioriza la generación del usuario. */
  generational?: boolean;
}

/**
 * Los ocho dominios cubren TODO lo que el atlas tiene fechado: países,
 * ciudades, las tres familias de marcas, equipos, universidades, personas y
 * películas. Un tipo de entidad que no aparezca acá es un tipo que el mapa
 * personal no está usando — y la idea es que no quede ninguno afuera.
 *
 * Territorio junta países y ciudades a propósito: "dónde estar" es una sola
 * pregunta, no dos.
 */
const DOMAIN_SPECS: DomainSpec[] = [
  {
    id: "territorio",
    question: "¿Dónde vivir y adónde ir?",
    label: "Territorio",
    scope:
      "Países fechados por su independencia o fundación, y ciudades por su fundación documentada. Van juntos: es una sola pregunta sobre dónde estar.",
    href: "/affinity/country",
    matches: (e) => e.type === "country" || e.type === "city",
  },
  {
    id: "vestimenta",
    question: "¿Cómo vestirte?",
    label: "Vestimenta",
    scope: "Marcas de indumentaria y calzado, fechadas por el año en que se fundaron.",
    href: "/affinity/brand",
    matches: (e) => e.type === "brand" && !!e.category && ROPA_CATEGORIES.has(e.category),
  },
  {
    id: "autos",
    question: "¿Qué manejar?",
    label: "Autos",
    scope: "Marcas automotrices, fechadas por el año en que se fundaron.",
    href: "/affinity/brand",
    matches: (e) => e.type === "brand" && !!e.category && AUTO_CATEGORIES.has(e.category),
  },
  {
    id: "cancha",
    question: "¿De qué equipo sentirte?",
    label: "Cancha",
    scope: "Clubes fechados por su fundación documentada.",
    href: "/affinity/team",
    matches: (e) => e.type === "team",
  },
  {
    id: "aula",
    question: "¿Dónde estudiar?",
    label: "Aula",
    scope: "Universidades fechadas por su fundación documentada.",
    href: "/affinity/university",
    matches: (e) => e.type === "university",
  },
  {
    id: "gente",
    question: "¿Con quién compartís el año?",
    label: "Gente",
    scope:
      "Personas del atlas — artistas y futbolistas — fechadas por su año de nacimiento, no por una obra.",
    href: "/affinity/artist",
    matches: (e) => e.type === "artist" || e.type === "football_player",
    generational: true,
  },
  {
    id: "pantalla",
    question: "¿Qué mirar?",
    label: "Pantalla",
    scope: "Películas fechadas por su año de estreno.",
    href: "/affinity/movie",
    matches: (e) => e.type === "movie",
  },
];


// ════════════════════════════════════════════════════
// CÁLCULO
// ════════════════════════════════════════════════════

/**
 * La relación entre el signo del usuario y el de una entidad, reducida a las
 * cuatro casillas que usa el mapa. `getRelation` del resto del sitio devuelve
 * seis tipos (suma Liu He y Liu Hai); acá esos dos caen en "otro" a propósito.
 */
export function relacionCon(userAnimal: string, entityAnimal: string): MapRelation {
  if (!isAnimal(userAnimal) || !isAnimal(entityAnimal)) return "otro";
  if (userAnimal === entityAnimal) return "mismo";
  if (amigosDe(userAnimal).includes(entityAnimal)) return "amigo";
  if (enemigoDe(userAnimal) === entityAnimal) return "enemigo";
  return "otro";
}

/** Qué signos caen en cada casilla para un signo dado. */
export function animalsByKind(animal: Animal): Record<MapRelation, string[]> {
  const amigos = amigosDe(animal);
  const enemigo = enemigoDe(animal);
  const nombrados = new Set<string>([animal, ...amigos, ...(enemigo ? [enemigo] : [])]);

  return {
    mismo: [animal],
    amigo: amigos,
    enemigo: enemigo ? [enemigo] : [],
    otro: ANIMALS.filter((a) => !nombrados.has(a)),
  };
}

/** Los doce signos, en orden del ciclo, leídos desde el usuario. */
export function buildRelationMap(animal: Animal): AnimalRelationEntry[] {
  return ANIMALS.map((other) => {
    const kind = relacionCon(animal, other);
    return { animal: other, kind, ...RELATION_META[kind] };
  });
}

/**
 * Orden de lectura dentro de un grupo. Todas las entradas del grupo tienen
 * exactamente la misma relación con vos —el sistema no las distingue— así que
 * el orden no es un ranking y puede atender a otra cosa:
 *
 *   1. país antes que ciudad, persona antes que futbolista,
 *   2. la fundación más antigua,
 *   3. el id, como desempate estable.
 */
const TYPE_WEIGHT: Record<string, number> = { country: 0, city: 1, artist: 0, football_player: 1 };

function byTypeThenYear<E extends MapEntityInput>(a: E, b: E): number {
  const at = TYPE_WEIGHT[a.type] ?? 2;
  const bt = TYPE_WEIGHT[b.type] ?? 2;
  if (at !== bt) return at - bt;
  const ay = a.year ?? Number.MAX_SAFE_INTEGER;
  const by = b.year ?? Number.MAX_SAFE_INTEGER;
  return ay - by || a.id.localeCompare(b.id);
}

/**
 * Cuántas entradas del país del usuario se reservan al frente de cada grupo.
 * NO son "todas las locales primero": con un cupo de 8, un argentino vería
 * ocho entradas argentinas y ninguna del resto del mundo, que es lo contrario
 * de un mapa. Tres es suficiente para que lo propio se reconozca de entrada y
 * queden cinco lugares para el mundo. Mismo criterio (con 2) que
 * `curateCategory` en lib/affinity-light.ts.
 */
const MAX_LOCAL_POR_GRUPO = 3;

/**
 * Gama media primero. El público del sitio es mayoritariamente de clase media:
 * una lista encabezada por marcas de lujo no le sirve a casi nadie. Las de
 * gama alta van al final del grupo —no se esconden, se relegan— y entran solo
 * si sobran lugares después de las accesibles.
 *
 * `premium` no es un juicio de precio nuestro: es la etiqueta que el propio
 * registro trae (`category: "Lujo"` o un `keyThemes` con
 * Lujo/Exclusivo/Premium/Alta gama).
 */
function gamaMediaPrimero<E extends MapEntityInput>(a: E, b: E): number {
  return (a.premium ? 1 : 0) - (b.premium ? 1 : 0);
}

/**
 * Mínimo de entradas verificadas para que un dominio se muestre como tal. Con
 * menos, la mitad de los signos abriría un bloque numerado y vacío —peor que
 * no tenerlo—, así que el dominio se anuncia como pendiente en vez de
 * simularse. Doce es el piso natural: una por signo del ciclo.
 */
const MIN_PARA_MOSTRAR = 12;

/** Una generación = una vuelta completa del ciclo de doce. */
const GENERACION = 12;

/**
 * Arma la lista visible de un grupo: primero hasta tres del país del usuario,
 * después el mundo. El país NO toca el cálculo de afinidad —que es 100% signo
 * contra signo— ni mueve una entidad de casilla: solo decide qué se ve primero
 * dentro de una casilla que el signo ya resolvió. Un argentino y un japonés
 * con el mismo signo ven las mismas entidades en los mismos grupos.
 */
function curateGroup<E extends MapEntityInput>(
  pool: E[],
  take: number,
  { userCountryISO, userBirthYear, generational }: {
    userCountryISO?: string | null;
    userBirthYear?: number | null;
    generational?: boolean;
  },
): E[] {
  let ordenadas = [...pool].sort(byTypeThenYear);

  // En el dominio de personas, primero la propia generación: el año de
  // nacimiento está cargado para todas, así que "nació dentro de una vuelta
  // del ciclo de la tuya" es un hecho, no una suposición sobre gustos.
  if (generational && userBirthYear) {
    ordenadas = ordenadas.sort((a, b) => {
      const da = Math.abs((a.year ?? 0) - userBirthYear) <= GENERACION ? 0 : 1;
      const db = Math.abs((b.year ?? 0) - userBirthYear) <= GENERACION ? 0 : 1;
      return da - db || byTypeThenYear(a, b);
    });
  }

  // Gama media primero. Va después del orden generacional y antes del corte
  // por país, así que los hasta-3 locales que se eligen abajo también salen
  // de la franja accesible.
  ordenadas = ordenadas.sort((a, b) => gamaMediaPrimero(a, b) || 0);

  if (!userCountryISO) return ordenadas.slice(0, take);

  const locales = ordenadas.filter((e) => e.countryISO === userCountryISO);
  const mundo = ordenadas.filter((e) => e.countryISO !== userCountryISO);
  return [...locales.slice(0, MAX_LOCAL_POR_GRUPO), ...mundo, ...locales.slice(MAX_LOCAL_POR_GRUPO)]
    .slice(0, take);
}

function domainReading(
  animal: string,
  evaluated: number,
  groups: RelationGroup[],
  restoCount: number,
): string {
  if (evaluated === 0) return "Todavía no hay entidades cargadas para este dominio.";

  const totalOf = (kind: MapRelation) => groups.find((g) => g.kind === kind)?.total ?? 0;
  const mismo = totalOf("mismo");
  const amigo = totalOf("amigo");
  const enemigo = totalOf("enemigo");
  const afines = mismo + amigo;

  if (afines === 0) {
    return `De ${evaluated}, ninguna nació en un año ${animal} ni en los de tus dos amigos. El ciclo no te ancla en este dominio, y eso también es información.`;
  }

  const partes = [
    mismo > 0 ? `${mismo} en años ${animal}` : null,
    amigo > 0 ? `${amigo} en los de tus amigos` : null,
  ].filter(Boolean);

  const cierre =
    enemigo > 0
      ? ` En la casilla opuesta, ${enemigo} nacieron en tu año enemigo.`
      : " Ninguna nació en tu año enemigo.";

  return `De ${evaluated}, ${afines} caen en tu grupo: ${partes.join(" y ")}.${cierre} Las otras ${restoCount} pertenecen al resto del ciclo.`;
}

/**
 * Construye el mapa aplicado completo: cuatro dominios, cada uno agrupado por
 * la relación del ciclo de doce entre tu signo y el del año de origen.
 */
export function buildPersonalMap<E extends MapEntityInput>(
  profile: PersonalMapProfileInput,
  entities: E[],
  options: PersonalMapOptions = {},
): PersonalMap<E> {
  const { userCountryISO = null, userBirthYear = null } = options;
  const raw = profile.chineseZodiac || "";
  const element =
    typeof profile.chineseZodiacInfo?.element === "string" ? profile.chineseZodiacInfo.element : "";

  // Sin signo no hay cruce posible: el signo es la única entrada. Se
  // devuelve la forma vacía en vez de inventar un neutro para todo.
  if (!isAnimal(raw)) {
    return { animal: raw, element, relationMap: [], domains: [], userCountryISO };
  }
  const animal: Animal = raw;
  const buckets = animalsByKind(animal);

  const domains = DOMAIN_SPECS.map<MapDomain<E>>((spec) => {
    const candidatas = entities.filter(spec.matches);
    // Regla dura del producto: si no se puede afirmar a qué signo del zodíaco
    // chino corresponde el origen, la entidad no se muestra. El Año Nuevo
    // chino cae entre el 21 de enero y el 21 de febrero, así que un evento
    // fechado solo por año podría pertenecer al signo anterior — y una
    // recomendación construida sobre esa duda no es una recomendación.
    const pool = candidatas.filter((e) => !e.isApproximate && Boolean(e.originDate));
    const descartadas = candidatas.length - pool.length;

    const byKind = new Map<MapRelation, E[]>();
    for (const entity of pool) {
      const kind = relacionCon(animal, entity.animal);
      const list = byKind.get(kind);
      if (list) list.push(entity);
      else byKind.set(kind, [entity]);
    }

    const groups: RelationGroup<E>[] = [];
    for (const kind of KIND_ORDER) {
      const list = byKind.get(kind);
      if (!list || list.length === 0) continue;
      groups.push({
        kind,
        ...RELATION_META[kind],
        animals: buckets[kind],
        rule: ruleFor(kind, animal, buckets[kind]),
        total: list.length,
        entities: curateGroup(list, TAKE_BY_KIND[kind], {
          userCountryISO,
          userBirthYear,
          generational: spec.generational,
        }),
      });
    }

    const neutralCount = byKind.get("otro")?.length ?? 0;

    return {
      id: spec.id,
      question: spec.question,
      label: spec.label,
      scope: spec.scope,
      href: spec.href,
      evaluated: pool.length,
      descartadas,
      insuficiente: pool.length < MIN_PARA_MOSTRAR,
      groups,
      neutralCount,
      reading: domainReading(animal, pool.length, groups, neutralCount),
    };
  });

  return { animal, element, relationMap: buildRelationMap(animal), domains, userCountryISO };
}
