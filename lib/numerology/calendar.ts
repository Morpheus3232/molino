export const MASTER_NUMBERS = [11, 22, 28, 33] as const;

export interface CalendarDayContent {
  number: number;
  title: string;
  purpose: string;
  description: string;
  tags: string[];
  master: boolean;
}

const CONTENT: Record<number, Omit<CalendarDayContent, "number" | "master">> = {
  1: {
    title: "El Líder",
    purpose: "Iniciar, decidir, independencia, acción directa",
    description: "Un día para dar el primer paso sin pedir permiso. La energía favorece decisiones rápidas y el arranque de lo que venías postergando.",
    tags: ["Iniciar", "Decidir", "Independencia", "Acción directa"],
  },
  2: {
    title: "El Diplomático",
    purpose: "Cooperar, escuchar, equilibrio, paciencia",
    description: "La balanza se inclina hacia lo relacional. Escuchar rinde más que hablar, y el punto medio es más valioso que tener razón.",
    tags: ["Cooperar", "Escuchar", "Equilibrio", "Paciencia"],
  },
  3: {
    title: "El Creativo",
    purpose: "Crear, comunicar, socializar, expresar",
    description: "Día para decir lo que llevás adentro. Escribir, hablar, mostrar el trabajo: la expresión abre puertas que el silencio no abre.",
    tags: ["Crear", "Comunicar", "Socializar", "Expresar"],
  },
  4: {
    title: "El Constructor",
    purpose: "Organizar, planificar, disciplina, base",
    description: "Lo simple sostiene lo extraordinario. Es momento de ordenar, consolidar y poner bases firmes con paciencia y método.",
    tags: ["Organizar", "Planificar", "Disciplina", "Base"],
  },
  5: {
    title: "El Explorador",
    purpose: "Viajar, explorar, adaptarse, libertad",
    description: "Lo que ya no sirve se cae solo. No conviene resistir el cambio: el movimiento y la apertura a lo imprevisto traen lo nuevo.",
    tags: ["Viajar", "Explorar", "Adaptarse", "Libertad"],
  },
  6: {
    title: "El Cuidador",
    purpose: "Cuidar, armonizar, responsabilidad, familia",
    description: "El día pone en primer plano lo que cuidás y lo que descuidás. Cuidar a otros empieza por cuidarte a vos mismo primero.",
    tags: ["Cuidar", "Armonizar", "Responsabilidad", "Familia"],
  },
  7: {
    title: "El Buscador",
    purpose: "Reflexionar, analizar, meditar, investigar",
    description: "Día para la introspección y el estudio. Alejarse un poco del ruido externo deja escuchar con claridad la voz interior.",
    tags: ["Reflexionar", "Analizar", "Meditar", "Investigar"],
  },
  8: {
    title: "El Poder",
    purpose: "Emprender, gestionar, ambición, resultados",
    description: "El poder viene de la acción, no del deseo. Alinear el propósito con lo que se hace es lo que abre paso a los resultados.",
    tags: ["Emprender", "Gestionar", "Ambición", "Resultados"],
  },
  9: {
    title: "El Adaptable",
    purpose: "Adaptarse, desapego, transformar, fluir",
    description: "Todo ciclo tiene un cierre. Es momento de soltar lo que ya cumplió su propósito y fluir con lo que se abre a continuación.",
    tags: ["Adaptarse", "Desapego", "Transformar", "Fluir"],
  },
  11: {
    title: "El Iluminado",
    purpose: "Intuición, visión, inspiración, espiritualidad",
    description: "Número maestro. La intuición está al máximo — no hace falta explicar lo que se siente, solo confiar en la visión que llega en silencio.",
    tags: ["Intuición", "Visión", "Inspiración", "Espiritualidad"],
  },
  22: {
    title: "El Maestro Constructor",
    purpose: "Manifestar, construir, visión, legado",
    description: "Número maestro. Un día con la estructura para materializar sueños grandes y dejar algo que perdure más allá del momento.",
    tags: ["Manifestar", "Construir", "Visión", "Legado"],
  },
  28: {
    title: "Número Kármico",
    purpose: "Karma, transformación, lección, cambio",
    description: "Número maestro. Día de autoridad silenciosa: tomar la iniciativa en las decisiones importantes sin esperar permiso de nadie.",
    tags: ["Karma", "Transformación", "Lección", "Cambio"],
  },
  33: {
    title: "El Maestro Maestro",
    purpose: "Sanar, enseñar, servir, amor",
    description: "Número maestro de maestros. La misión del día es elevar a los demás — la compasión transforma todo lo que toca.",
    tags: ["Sanar", "Enseñar", "Servir", "Amor"],
  },
};

function sumDigits(n: number): number {
  return String(n)
    .split("")
    .reduce((acc, d) => acc + Number(d), 0);
}

/** Reduces a day-of-month (1-31) to its numerology number, keeping master numbers 11, 22, 28, 33 unreduced. */
export function reduceDayNumber(day: number): number {
  if ((MASTER_NUMBERS as readonly number[]).includes(day)) return day;
  let n = day;
  while (n > 9) {
    n = sumDigits(n);
    if ((MASTER_NUMBERS as readonly number[]).includes(n)) return n;
  }
  return n;
}

export interface DateNumberBreakdown {
  /** Cada dígito de la fecha completa (YYYYMMDD), en orden. */
  digits: number[];
  /** Suma de todos los dígitos — primer paso de la reducción. */
  total: number;
  /** Sumas intermedias sucesivas hasta llegar a un solo dígito o a un número maestro. */
  reductions: number[];
  /** Resultado final: 1-9, o el maestro (11/22/28/33) donde se frenó la reducción. */
  final: number;
  isMaster: boolean;
}

/**
 * Desglosa paso a paso cómo se reduce una fecha completa (YYYY-MM-DD) a su
 * número pitagórico, preservando los maestros 11, 22, 28 y 33 sin reducir.
 * `reduceDateNumber` es un atajo sobre esto — una sola fuente de verdad para
 * el algoritmo, para poder mostrar la cuenta además de solo el resultado.
 */
export function getDateNumberBreakdown(dateStr: string): DateNumberBreakdown {
  const digits = dateStr.replace(/\D/g, "").split("").map(Number);
  const total = digits.reduce((acc, d) => acc + d, 0);
  const reductions: number[] = [];
  let n = total;
  if (!(MASTER_NUMBERS as readonly number[]).includes(n)) {
    while (n > 9) {
      n = sumDigits(n);
      reductions.push(n);
      if ((MASTER_NUMBERS as readonly number[]).includes(n)) break;
    }
  }
  return { digits, total, reductions, final: n, isMaster: (MASTER_NUMBERS as readonly number[]).includes(n) };
}

/**
 * Reduces a full date (YYYY-MM-DD) to its Pythagorean numerology number:
 * sums all the digits of the complete date and reduces to a single digit,
 * preserving master numbers 11, 22, 28, 33 unreduced.
 */
export function reduceDateNumber(dateStr: string): number {
  return getDateNumberBreakdown(dateStr).final;
}

export function getCalendarDayContent(dateStr: string): CalendarDayContent {
  const number = reduceDateNumber(dateStr);
  const content = CONTENT[number];
  return { number, master: (MASTER_NUMBERS as readonly number[]).includes(number), ...content };
}
