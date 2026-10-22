/**
 * Lectura de un par de signos para /compatibilidad/[par]. Determinista y
 * armada solo con reglas clásicas de la astrología (aspecto por distancia en
 * la rueda, elemento, modalidad, polaridad, regente) y con las fortalezas y
 * desafíos de cada signo que ya están en lib/data/astrologia-content. Nada
 * de prosa inventada por par: cada frase sale de un dato. Server-only.
 */

import { SIGN_FACTS, WESTERN_SIGNS, type WesternSign } from "@/lib/data/facts/astrology-facts";
import { ZODIAC_SIGNS } from "@/lib/data/astrologia-content";

export type ElementName = "Fuego" | "Tierra" | "Aire" | "Agua";

const has = (a: ElementName, b: ElementName, x: ElementName, y: ElementName) =>
  (a === x && b === y) || (a === y && b === x);

export function calculateElementSynergy(elA: ElementName, elB: ElementName): { level: string; desc: string } {
  if (elA === elB) {
    return { level: "Resonancia natural", desc: `Los dos son de ${elA}: se entienden por instinto, comparten motivaciones y no necesitan traducir lo que sienten.` };
  }
  if (has(elA, elB, "Fuego", "Aire")) {
    return { level: "Dinámica y expansión", desc: "El Aire aviva al Fuego y el Fuego le pone pasión a las ideas del Aire: se entusiasman juntos." };
  }
  if (has(elA, elB, "Tierra", "Agua")) {
    return { level: "Fertilidad y contención", desc: "La Tierra le da cauce al Agua y el Agua ablanda la firmeza de la Tierra: uno sostiene, el otro nutre." };
  }
  if (has(elA, elB, "Fuego", "Tierra")) {
    return { level: "Impulso y pragmatismo", desc: "El Fuego empuja a la Tierra a arriesgar; la Tierra ayuda al Fuego a concretar. Si no se respetan los tiempos, uno se siente frenado y el otro, apurado." };
  }
  if (has(elA, elB, "Aire", "Agua")) {
    return { level: "Mente y emoción", desc: "El Aire busca entender con la cabeza lo que el Agua siente sin palabras. Se enriquecen si uno escucha y el otro explica." };
  }
  if (has(elA, elB, "Aire", "Tierra")) {
    return { level: "Ideas y hechos", desc: "El Aire piensa en posibilidades y la Tierra en lo que se puede sostener. El Aire le da perspectiva a la Tierra y la Tierra le da forma a las ideas del Aire — o se impacientan mutuamente." };
  }
  return { level: "Vapor y transformación", desc: "El Fuego calienta al Agua y el Agua puede apagar al Fuego: magnetismo e intensidad, con el desafío de regular la temperatura." };
}

/** Aspecto clásico según la distancia en la rueda (0 a 6 signos). */
export const ASPECT_BY_DISTANCE = [
  { name: "conjunción", angle: 0, verdict: "Alta, en espejo", answer: "se reconocen enseguida: son el mismo signo. Comparten virtudes, gustos y ritmo — y también los mismos puntos ciegos, que nadie compensa.", advice: "Busquen afuera lo que ninguno de los dos trae: amistades, actividades o proyectos que los saquen del espejo." },
  { name: "semisextil", angle: 30, verdict: "Media", answer: "son vecinos en la rueda: distinto elemento, distinto ritmo y distinta polaridad. Al principio cuesta encontrarse; con el tiempo, cada uno le muestra al otro lo que no ve.", advice: "Dense tiempo para conocerse: lo que al principio parece incompatible suele ser justo lo que el otro tiene para enseñar." },
  { name: "sextil", angle: 60, verdict: "Alta", answer: "forman un sextil, el aspecto de la oportunidad: elementos que se complementan y la misma polaridad. Hay química fácil, pero rinde si la trabajan.", advice: "Aprovechen la facilidad para hacer cosas juntos: la química del sextil crece con proyectos compartidos, no sola." },
  { name: "cuadratura", angle: 90, verdict: "Desafiante", answer: "forman una cuadratura, el aspecto de la fricción: comparten modalidad pero no elemento, así que los dos quieren lo mismo de distinta manera. Hay chispa y hay choque; funciona si lo eligen.", advice: "Elijan las peleas y acuerden de antemano quién decide qué. Bien usada, la tensión de la cuadratura es motor; mal usada, desgaste." },
  { name: "trígono", angle: 120, verdict: "Muy alta", answer: "forman un trígono, el aspecto más fluido: comparten elemento y se entienden sin esfuerzo. El riesgo es la comodidad — lo fácil no siempre empuja a crecer.", advice: "No den la armonía por sentada: propónganse desafíos, porque el riesgo del trígono es acomodarse." },
  { name: "quincuncio", angle: 150, verdict: "Media-baja", answer: "forman un quincuncio: no comparten elemento, ritmo ni polaridad. No hay choque frontal sino malentendidos — hablan idiomas distintos y necesitan ajustar todo el tiempo.", advice: "Pregunten antes de suponer: lo que para uno es obvio, para el otro no lo es." },
  { name: "oposición", angle: 180, verdict: "Complementaria", answer: "están en lados opuestos de la rueda: lo que a uno le falta, al otro le sobra. Se atraen fuerte y se equilibran, o se polarizan si cada uno se queda en su punta.", advice: "Acérquense al centro: cada uno puede aprender del otro justo lo que le falta, en vez de reprochárselo." },
] as const;

const MODALITY_ROLE: Record<string, string> = { Cardinal: "inicia", Fijo: "sostiene", Mutable: "adapta" };
const MODALITY_PLURAL: Record<string, string> = { Cardinal: "cardinales", Fijo: "fijos", Mutable: "mutables" };

/** Palabras clave tradicionales de cada regente. */
const PLANET_THEME: Record<string, string> = {
  Marte: "acción y deseo",
  Venus: "afecto y placer",
  Mercurio: "palabra e ideas",
  Luna: "emoción y cuidado",
  Sol: "identidad y brillo",
  Júpiter: "expansión y sentido",
  Saturno: "estructura y tiempo",
  Plutón: "transformación",
  Urano: "libertad y cambio",
  Neptuno: "sueño y sensibilidad",
};

/** Cómo se juega cada combinación de elementos en el vínculo de pareja. */
function loveByElements(a: ElementName, b: ElementName): string {
  if (a === b) {
    const same: Record<ElementName, string> = {
      Fuego: "Una pareja intensa y divertida, con mucha iniciativa y poca paciencia. Se encienden rápido; el trabajo está en no competir por quién lidera.",
      Tierra: "Una pareja estable, de hechos más que de palabras: construyen, cuidan lo material y lo cotidiano. El riesgo es la rutina.",
      Aire: "Una pareja de conversación infinita, con libertad y mucha vida social. El riesgo es quedarse en la cabeza y esquivar lo emocional.",
      Agua: "Una pareja de enorme profundidad emocional y empatía. El riesgo es que la sensibilidad de uno amplifique la del otro.",
    };
    return same[a];
  }
  if (has(a, b, "Fuego", "Aire")) return "En el amor hay entusiasmo, juego y planes: se divierten y se estimulan. Les cuesta más bajar a lo cotidiano y sostener cuando se apaga la novedad.";
  if (has(a, b, "Tierra", "Agua")) return "En el amor hay contención y lealtad: uno da seguridad, el otro ternura. Es de las combinaciones más sólidas para construir algo a largo plazo.";
  if (has(a, b, "Fuego", "Tierra")) return "En el amor hay atracción por lo distinto: el Fuego aporta pasión y aventura, la Tierra constancia. El desafío es el ritmo — uno quiere ya, el otro quiere seguro.";
  if (has(a, b, "Aire", "Agua")) return "En el amor se fascinan por lo que no entienden del otro. El Agua necesita sentirse acompañada; el Aire, espacio. Si eso se habla, se complementan.";
  if (has(a, b, "Aire", "Tierra")) return "En el amor, el Aire trae ideas y liviandad y la Tierra trae calma y presencia. Funciona cuando el Aire cumple lo que dice y la Tierra se abre a lo nuevo.";
  return "En el amor hay magnetismo y emociones fuertes: el Fuego quiere acción, el Agua, profundidad. Pueden apasionarse o herirse; la clave es cuidar las formas.";
}

/** Amistad y trabajo según la modalidad de cada uno. */
function sharedWork(ma: string, mb: string): string {
  if (ma === mb) {
    const same: Record<string, string> = {
      Cardinal: "En la amistad y el trabajo, los dos quieren arrancar y decidir: arman mucho, pero tienen que repartirse el mando o chocan.",
      Fijo: "En la amistad y el trabajo, los dos sostienen y no aflojan: lealtad total, pero si discrepan ninguno cede.",
      Mutable: "En la amistad y el trabajo, los dos se adaptan y cambian de plan con facilidad: mucha flexibilidad, poca dirección. Les conviene fijar metas.",
    };
    return same[ma];
  }
  const roles = [ma, mb].sort().join("+");
  const mixed: Record<string, string> = {
    "Cardinal+Fijo": "En la amistad y el trabajo se reparten bien: uno abre el camino y el otro lo sostiene hasta el final.",
    "Cardinal+Mutable": "En la amistad y el trabajo, uno arranca y el otro ajusta sobre la marcha: buen equipo para proyectos que cambian.",
    "Fijo+Mutable": "En la amistad y el trabajo, uno da estabilidad y el otro flexibilidad. Funciona si el fijo tolera los cambios y el mutable respeta lo acordado.",
  };
  return mixed[roles];
}

/** "Plutón (moderno) / Marte (tradicional)" → "Plutón y Marte (transformación; acción y deseo)". */
function ruler(raw: string): string {
  const planets = raw.split(" / ").map((p) => p.replace(/ \(.*\)$/, ""));
  return `${planets.join(" y ")} (${planets.map((p) => PLANET_THEME[p]).join("; ")})`;
}

const SIGN_DATA = Object.fromEntries(ZODIAC_SIGNS.map((s) => [s.name, s]));

export interface PairReading {
  aspect: (typeof ASPECT_BY_DISTANCE)[number];
  /** Respuesta directa a "¿son compatibles?" en una oración. */
  answer: string;
  element: { level: string; desc: string };
  rhythm: string;
  polarity: string;
  rulers: string;
  love: string;
  work: string;
  bring: { sign: string; items: string[] }[];
  clash: { sign: string; items: string[] }[];
}

export function pairReading(nameA: WesternSign, nameB: WesternSign): PairReading {
  const fa = SIGN_FACTS[nameA];
  const fb = SIGN_FACTS[nameB];
  const sa = SIGN_DATA[nameA];
  const sb = SIGN_DATA[nameB];
  const raw = Math.abs(WESTERN_SIGNS.indexOf(nameA) - WESTERN_SIGNS.indexOf(nameB));
  const aspect = ASPECT_BY_DISTANCE[Math.min(raw, 12 - raw)];
  const same = nameA === nameB;

  const rhythm = same
    ? `Los dos son ${MODALITY_PLURAL[fa.modality]} — ${MODALITY_ROLE[fa.modality]}n — y tienen exactamente el mismo ritmo.`
    : fa.modality === fb.modality
      ? `Los dos son ${MODALITY_PLURAL[fa.modality]}: los dos ${MODALITY_ROLE[fa.modality]}n. Se entienden en el modo de moverse, pero ninguno compensa lo que al otro le falta.`
      : `${nameA} es ${fa.modality.toLowerCase()} — ${MODALITY_ROLE[fa.modality]} — y ${nameB} es ${fb.modality.toLowerCase()} — ${MODALITY_ROLE[fb.modality]}. Ritmos distintos: lo que uno no hace, lo puede hacer el otro.`;

  const polarity =
    sa.polarity === sb.polarity
      ? `Comparten polaridad ${sa.polarity} (${sa.polarity === "Yang" ? "energía hacia afuera, expresiva" : "energía hacia adentro, receptiva"}): van en la misma dirección.`
      : `${nameA} es ${sa.polarity} y ${nameB} es ${sb.polarity}: uno va hacia afuera y el otro hacia adentro, y eso los equilibra o los desencuentra.`;

  const rulers =
    sa.rulingPlanet === sb.rulingPlanet
      ? `Comparten regente: ${ruler(sa.rulingPlanet)}. Les importa lo mismo.`
      : `A ${nameA} lo rige ${ruler(sa.rulingPlanet)}; a ${nameB}, ${ruler(sb.rulingPlanet)}.`;

  return {
    aspect,
    answer: `${nameA} y ${nameB} ${aspect.answer}`,
    element: calculateElementSynergy(fa.element, fb.element),
    rhythm,
    polarity,
    rulers,
    love: loveByElements(fa.element, fb.element),
    work: sharedWork(fa.modality, fb.modality),
    bring: same
      ? [{ sign: nameA, items: sa.strengths.slice(0, 4) }]
      : [{ sign: nameA, items: sa.strengths.slice(0, 3) }, { sign: nameB, items: sb.strengths.slice(0, 3) }],
    clash: same
      ? [{ sign: nameA, items: sa.challenges.slice(0, 4) }]
      : [{ sign: nameA, items: sa.challenges.slice(0, 3) }, { sign: nameB, items: sb.challenges.slice(0, 3) }],
  };
}

/** Signos en trígono o sextil con `name`: las afinidades clásicas. */
export function harmoniousSigns(name: WesternSign): WesternSign[] {
  const i = WESTERN_SIGNS.indexOf(name);
  return [2, 4, 8, 10].map((d) => WESTERN_SIGNS[(i + d) % 12]);
}
