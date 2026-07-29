const SACRED_NUMBERS = [11, 22, 28, 33];

export function getDailyNumber(date: Date): number {
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const y = date.getFullYear();

  if (d === 28) return 28;

  let sum = d + m + y;
  while (sum > 9 && !SACRED_NUMBERS.includes(sum)) {
    sum = sum
      .toString()
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}

export interface Reflection {
  title: string;
  text: string;
  recommendation?: string;
}

export const REFLECTIONS: Record<number, Reflection> = {
  1: { title: "El Inicio", text: "Hoy es momento de plantar la semilla de tu próximo ciclo." },
  2: { title: "La Dualidad", text: "Encontrá el equilibrio entre lo que sos y lo que deseás ser." },
  3: { title: "La Expresión", text: "Comunicá tu verdad sin miedo. El mundo necesita escucharte." },
  4: { title: "La Estructura", text: "Construí sobre bases sólidas. La paciencia es tu aliada." },
  5: { title: "El Cambio", text: "La libertad te llama. Atrévete a soltar lo que ya no te sirve." },
  6: { title: "La Responsabilidad", text: "Cuidá de los tuyos y de vos mismo. El amor es la clave." },
  7: { title: "La Sabiduría", text: "Buscá respuestas en tu interior. La verdad te está esperando." },
  8: { title: "La Abundancia", text: "El poder y la prosperidad llegan cuando alineás tu propósito." },
  9: { title: "La Transformación", text: "Todo puede cambiar hoy. No resistas lo inevitable." },
  11: { title: "Maestro", text: "Tu intuición ilumina el camino. Confiá en tu visión." },
  22: { title: "Constructor", text: "Podés hacer realidad cualquier sueño. El momento es ahora." },
  33: { title: "Guía", text: "Tu misión es elevar a los demás. El amor universal te guía." },
  28: {
    title: "Riqueza, iniciativa y autoridad",
    text: "Es un gran día para salir adelante con autoridad y tomar decisiones como el dueño de tu camino.",
    recommendation: "Tomá iniciativa en dirección a tus decisiones económicas. Hacé que las cosas pasen sin esperar permiso para hacerlo.",
  },
};

const REFLECTION_VARIATIONS: Record<number, string[]> = {
  1: [
    "Mirá atrás y observá cuánto creciste.",
    "El primer paso ya lo diste. Ahora sostené el impulso.",
    "Hoy el universo te dice: comenzá de nuevo, sin miedo.",
  ],
  2: [
    "Escuchá más de lo que hablás. Ahí está la respuesta.",
    "La paciencia no es esperar, es confiar en el proceso.",
    "Buscá el punto medio entre el corazón y la razón.",
  ],
  3: [
    "Tus palabras tienen poder. Elegilas con conciencia.",
    "La creatividad no se fuerza, se permite.",
    "Hoy: reí, bailá, escribí. Expresate sin filtros.",
  ],
  4: [
    "Lo simple sostiene lo extraordinario. Ordená tu base.",
    "La disciplina es libertad disfrazada de rutina.",
    "Cada ladrillo cuenta. No saltees pasos.",
  ],
  5: [
    "Lo desconocido no es peligro, es posibilidad.",
    "La incomodidad es el precio de crecer.",
    "Decí que sí a lo que siempre postergaste.",
  ],
  6: [
    "El amor no se exige, se ofrece sin condiciones.",
    "Cuidar de otros empieza por cuidarte a vos.",
    "La familia no es solo sangre, es quien elige quedarse.",
  ],
  7: [
    "El silencio tiene más respuestas que el ruido.",
    "Confíá en tu intuición. Ella ya sabe el camino.",
    "Hoy el mejor plan es no tener plan. Escuchate.",
  ],
  8: [
    "La abundancia no es tener más, es sentir suficiente.",
    "Tu esfuerzo de ayer preparó tu victoria de hoy.",
    "El poder verdadero es servir con lo que sabés.",
  ],
  9: [
    "Soltar no es perder, es hacer espacio para lo nuevo.",
    "El final de un ciclo es el inicio de otro.",
    "Lo que termina hoy ya cumplió su propósito.",
  ],
  11: [
    "Tu luz interior es más fuerte que cualquier sombra.",
    "No necesitás explicar tu visión. Solo vivirla.",
    "La inspiración llega cuando estás en silencio.",
  ],
  22: [
    "Soñar es gratis. Construir es tu superpoder.",
    "El mundo necesita lo que solo vos podés crear.",
    "Todo lo que imaginás, lo podés materializar.",
  ],
  33: [
    "Enseñar es la forma más alta de aprender.",
    "Tu compasión transforma todo lo que toca.",
    "Elevá a los demás y te elevarás con ellos.",
  ],
  28: [
    "Tomá iniciativa en dirección a tus decisiones económicas. Hacé que las cosas pasen sin esperar permiso para hacerlo.",
    "El 28 es un día de autoridad silenciosa. Actuá con determinación sin pedir disculpas.",
    "La riqueza no es solo dinero: es la energía de avanzar sin dudar. Hoy es tu día.",
  ],
};

export function getDailyReflection(number: number, date: Date): Reflection {
  if (number === 28) {
    return REFLECTIONS[28];
  }

  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const base = REFLECTIONS[number] || REFLECTIONS[9];
  const variations = REFLECTION_VARIATIONS[number] || REFLECTION_VARIATIONS[9];
  const variation = variations[dayOfYear % variations.length];
  return {
    ...base,
    text: `${base.text} ${variation}`,
  };
}
