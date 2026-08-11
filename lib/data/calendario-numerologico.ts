/**
 * Calendario Numerológico — lógica y contenido del calendario mensual.
 *
 * Reducción numérica de cada día del mes:
 *  - Días 1-9: sin reducir.
 *  - Días 10-31: sumar dígitos hasta reducir a 1-9.
 *  - Excepciones (números maestros que NO se reducen): 11, 22, 28, 33.
 *  - Si la suma da 11, 22 o 33: queda como maestro.
 *
 * Interpretaciones simbólicas, no científicas.
 */

export const MASTER_DAYS = [11, 22, 28, 33];

export function reduceDayNumber(day: number): number {
  if (!Number.isInteger(day) || day <= 0) return day;
  if (MASTER_DAYS.includes(day)) return day;

  let n = day;
  while (n > 9) {
    n = String(n)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
    if (MASTER_DAYS.includes(n)) return n;
  }
  return n;
}

export function reductionSteps(day: number): number[] {
  const steps = [day];
  let n = day;
  while (n > 9 && !MASTER_DAYS.includes(n)) {
    n = String(n)
      .split("")
      .reduce((acc, d) => acc + Number(d), 0);
    steps.push(n);
    if (MASTER_DAYS.includes(n)) break;
  }
  return steps;
}

export interface CalendarioNumero {
  title: string;
  essence: string;
  description: string;
  tags: string[];
  master?: boolean;
}

export const CALENDARIO_NUMBERS: Record<number, CalendarioNumero> = {
  1: {
    title: "El Líder",
    essence: "Iniciar, decidir, independencia, acción directa",
    description:
      "Un día para dar el primer paso. La energía favorece decidir por vos, marcar dirección y actuar sin pedir permiso. Lo que hoy empieza se sostiene si lo empezás vos.",
    tags: ["Iniciar", "Decidir", "Independencia", "Acción"],
  },
  2: {
    title: "El Diplomático",
    essence: "Cooperar, escuchar, equilibrio, paciencia",
    description:
      "Un día para sumar antes que imponer. La energía premia la escucha, la negociación y los acuerdos que dejan conformes a todos. Lo que se construye con otros hoy es más estable.",
    tags: ["Cooperar", "Escuchar", "Equilibrio", "Paciencia"],
  },
  3: {
    title: "El Creativo",
    essence: "Crear, comunicar, socializar, expresar",
    description:
      "Un día para sacar afuera lo que tenés adentro. La palabra, la idea o el gesto que compartas hoy puede abrir puertas. Buen momento para presentar, proponer o simplemente decir lo que sentís.",
    tags: ["Crear", "Comunicar", "Socializar", "Expresar"],
  },
  4: {
    title: "El Constructor",
    essence: "Organizar, planificar, disciplina, base",
    description:
      "Un día de cimientos. La energía favorece ordenar, planificar y hacer el trabajo de base que después sostiene todo. Los avances lentos y firmes de hoy son los que duran.",
    tags: ["Organizar", "Planificar", "Disciplina", "Base"],
  },
  5: {
    title: "El Explorador",
    essence: "Viajar, explorar, adaptarse, libertad",
    description:
      "Un día para moverte. La energía favorece lo nuevo: salir, conocer, cambiar de aire o de plan. Lo que descubras hoy amplía tu mapa, aunque sea apenas un paso al costado.",
    tags: ["Viajar", "Explorar", "Adaptarse", "Libertad"],
  },
  6: {
    title: "El Cuidador",
    essence: "Cuidar, armonizar, responsabilidad, familia",
    description:
      "Un día para las personas que te rodean. La energía favorece cuidar, ordenar la casa o el vínculo y hacerse cargo de lo que sostiene a los tuyos. Lo que armonizás hoy se nota.",
    tags: ["Cuidar", "Armonizar", "Responsabilidad", "Familia"],
  },
  7: {
    title: "El Buscador",
    essence: "Reflexionar, analizar, meditar, investigar",
    description:
      "Un día de profundidad. La energía favorece la pregunta antes que la respuesta: analizar, estudiar, escribir y mirar hacia adentro. Lo que encuentres hoy te orienta.",
    tags: ["Reflexionar", "Analizar", "Meditar", "Investigar"],
  },
  8: {
    title: "El Poder",
    essence: "Emprender, gestionar, ambición, resultados",
    description:
      "Un día de resultados. La energía favorece gestionar, negociar y mover recursos hacia un objetivo concreto. Buen momento para decidir sobre trabajo, dinero o proyectos grandes.",
    tags: ["Emprender", "Gestionar", "Ambición", "Resultados"],
  },
  9: {
    title: "El Adaptable",
    essence: "Adaptarse, desapego, transformar, fluir",
    description:
      "Un día de fluidez. Tu fuerza es la adaptación: no tenés un camino fijo, y eso es una ventaja. Hoy favorece soltar el plan rígido, ajustarte a lo que aparece y unificar lo que otros separan. GG33: el 9 es swing path — su poder está en no tener origen ni destino fijo.",
    tags: ["Adaptarse", "Desapego", "Transformar", "Fluir"],
  },
  11: {
    title: "El Iluminado",
    essence: "Intuición, visión, inspiración, espiritualidad",
    description:
      "Un día maestro. La energía abre el canal de la intuición: prestá atención a las corazonadas, las imágenes y las señales que no podés explicar. Lo que se te revela hoy tiene peso.",
    tags: ["Intuición", "Visión", "Inspiración", "Espiritualidad"],
    master: true,
  },
  22: {
    title: "El Maestro Constructor",
    essence: "Manifestar, construir, visión, legado",
    description:
      "Un día maestro. La energía une visión y ejecución: lo que soñás a lo grande puede empezar a hacerse realidad hoy. Buen momento para estructurar proyectos que dejen huella.",
    tags: ["Manifestar", "Construir", "Visión", "Legado"],
    master: true,
  },
  28: {
    title: "Número Kármico",
    essence: "Karma, transformación, lección, cambio",
    description:
      "Un día de lección. La energía trae a la superficie aquello que se repite hasta que lo aprendés. La clave es no resistir el cambio: transformá el patrón en vez de repetirlo.",
    tags: ["Karma", "Transformación", "Lección", "Cambio"],
    master: true,
  },
  33: {
    title: "El Maestro Maestro",
    essence: "Sanar, enseñar, servir, amor",
    description:
      "Un día maestro. La energía alcanza su punto más alto en el dar: sanar, enseñar y servir con amor. Buen momento para acompañar a otros y poner lo mejor de vos al servicio de algo más grande.",
    tags: ["Sanar", "Enseñar", "Servir", "Amor"],
    master: true,
  },
};
