/**
 * Daily Energy Engine
 *
 * Calculates daily energy based on user profile and target date.
 * All calculations are deterministic: same inputs = same outputs.
 *
 * Uses existing numerology, astrology, and cycle calculations.
 * No random values, no external APIs.
 */

import type { UserProfile } from '@/types/user';
import { getPersonalDayForDate, getPersonalYear, getMoonPhase, calculateLifePath, reduceToSingleDigit } from '@/lib/calculations';
import { getSunSign } from './astrologyEngine';
import { getChineseZodiac } from './chineseZodiacEngine';

export interface DailyEnergyResult {
  date: string;
  overallScore: number;
  theme: string;
  description: string;
  strengths: string[];
  cautions: string[];
  areas: {
    work: { score: number; label: string };
    relationships: { score: number; label: string };
    creativity: { score: number; label: string };
    decisions: { score: number; label: string };
  };
  moonPhase: { phase: string; emoji: string; description: string };
  personalDay: number;
  personalYear: number;
  personalMonth: number;
  elementInfluence: string;
  explanation: string;
}

const THEME_BY_PERSONAL_DAY: Record<number, { theme: string; description: string }> = {
  1: { theme: "Iniciación", description: "Un día para comenzar algo nuevo. Tu energía está orientada hacia la acción y la iniciativa." },
  2: { theme: "Cooperación", description: "Un día para conectar con otros. La paciencia y la escucha activa son tus mejores herramientas." },
  3: { theme: "Expresión", description: "Un día para comunicar y crear. Tu voz tiene poder especial hoy." },
  4: { theme: "Construcción", description: "Un día para organizar y trabajar. La disciplina te recompensará." },
  5: { theme: "Cambio", description: "Un día para adaptarse y explorar. Abríte a lo inesperado." },
  6: { theme: "Armonía", description: "Un día para cuidar de quienes te rodean. El equilibrio es la clave." },
  7: { theme: "Introspección", description: "Un día para mirar hacia adentro. La sabiduría viene del silencio." },
  8: { theme: "Manifestación", description: "Un día de poder personal. Asumí liderazgo en lo que importa." },
  9: { theme: "Cierre", description: "Un día para completar y soltar. Liberá lo que ya no te sirve." },
  11: { theme: "Iluminación", description: "Un día de intuición elevada. Prestá atención a las señales." },
  22: { theme: "Construcción Divina", description: "Un día de visión práctica. Soñá en grande, construí con determinación." },
  33: { theme: "Amor Universal", description: "Un día de servicio y compasión. Tu energía sanadora está al máximo." },
};

const STRENGTHS_BY_PERSONAL_DAY: Record<number, string[]> = {
  1: ["Iniciativa", "Claridad", "Coraje"],
  2: ["Diplomacia", "Paciencia", "Intuición"],
  3: ["Creatividad", "Comunicación", "Carisma"],
  4: ["Organización", "Disciplina", "Persistencia"],
  5: ["Adaptabilidad", "Curiosidad", "Entusiasmo"],
  6: ["Empatía", "Responsabilidad", "Armonía"],
  7: ["Análisis", "Observación", "Sabiduría"],
  8: ["Estrategia", "Liderazgo", "Visión"],
  9: ["Compasión", "Sabiduría", "Soltar"],
  11: ["Intuición", "Inspiración", "Conexión"],
  22: ["Organización", "Visión", "Manifestación"],
  33: ["Sanación", "Compasión", "Servicio"],
};

const CAUTIONS_BY_PERSONAL_DAY: Record<number, string[]> = {
  1: ["Impaciencia", "Ego", "Aislamiento"],
  2: ["Dependencia", "Indecisión", "Hipersensibilidad"],
  3: ["Dispersión", "Exageración", "Superficialidad"],
  4: ["Rigidez", "Terquedad", "Resistencia al cambio"],
  5: ["Inquietud", "Impulsividad", "Inconstancia"],
  6: ["Autosacrificio", "Control", "Culpa"],
  7: ["Aislamiento", "Escepticismo", "Perfeccionismo"],
  8: ["Materialismo", "Control", "Intimidación"],
  9: ["Apego", "Ego excesivo", "Dificultad para soltar"],
  11: ["Ansiedad", "Inseguridad", "Sobreestimulación"],
  22: ["Presión", "Perfeccionismo", "Rigidez"],
  33: ["Autosacrificio", "Carga emocional", "Agotamiento"],
};

export interface PersonalYearMeaning {
  theme: string;
  focus: string;
  challenges: string;
  opportunities: string;
  keywords: string[];
}

/**
 * Ciclo de 9 años (más 11/22/33 como variantes intensificadas de 2/4/6) que
 * se repite mientras dura la vida — cada Año Personal retoma el tema del
 * mismo número anterior, con el acumulado de los ciclos previos.
 */
export const PERSONAL_YEAR_MEANINGS: Record<number, PersonalYearMeaning> = {
  1: {
    theme: "Año de Comienzos",
    focus: "Es el primer año del ciclo de nueve: lo que siembres ahora define el tono de los próximos ocho. Favorece decisiones propias, proyectos que arrancan de cero y cortar con lo que ya no tiene sentido continuar.",
    challenges: "La ansiedad por arrancar todo a la vez, o el miedo a moverte sin tener el camino completo resuelto de antemano — nunca lo vas a tener, y esperar a tenerlo es la forma más común de perder el año.",
    opportunities: "Cambios de rumbo (trabajo, ciudad, vínculo) que en otro momento del ciclo costarían más caro. La energía acompaña la iniciativa, no la espera.",
    keywords: ["inicio", "independencia", "coraje"],
  },
  2: {
    theme: "Año de Vínculos y Paciencia",
    focus: "Después de sembrar, toca esperar — un año de construir en sociedad, cuidar acuerdos y desarrollar lo que empezaste el año anterior sin forzar resultados inmediatos.",
    challenges: "La frustración de un ritmo que no depende solo de vos, y la tentación de sobreadaptarte para no generar fricción — ceder de más acá se paga en resentimiento acumulado.",
    opportunities: "Sociedades, negociaciones y vínculos (personales o de trabajo) que maduran mejor con tiempo que con apuro. Es un año fuerte para pedir ayuda sin que eso sea debilidad.",
    keywords: ["cooperación", "paciencia", "equilibrio"],
  },
  3: {
    theme: "Año de Expresión",
    focus: "La energía se vuelve social y creativa — hablar, escribir, mostrar trabajo, ampliar el círculo. Lo que en el 1 y el 2 se gestó en privado, ahora busca salida.",
    challenges: "Dispersar energía en demasiados frentes sociales o creativos a la vez, o usar la expresión para evitar temas de fondo que siguen sin resolverse.",
    opportunities: "Visibilidad: es un buen año para lanzar algo, aparecer, comunicar. La gente responde mejor a lo que decís este año que en otros del ciclo.",
    keywords: ["expresión", "creatividad", "sociabilidad"],
  },
  4: {
    theme: "Año de Estructura",
    focus: "El ciclo pide orden después de la expansión del 3 — trabajo metódico, organización de lo material (finanzas, salud, rutinas), bases que sostengan lo que sigue.",
    challenges: "La rigidez de querer controlar cada variable, o el desánimo de un año que se siente más lento y menos glamoroso que los anteriores — es lento porque es el que sostiene al resto.",
    opportunities: "Todo lo que necesita disciplina sostenida (estudio largo, ahorro, tratamiento de salud, reorganización real) rinde más este año que en cualquier otro del ciclo.",
    keywords: ["orden", "disciplina", "bases"],
  },
  5: {
    theme: "Año de Cambio",
    focus: "El punto medio del ciclo — la estructura del 4 se pone a prueba con movimiento: viajes, cambios de planes, oportunidades que no estaban en el guion.",
    challenges: "La inconstancia de abandonar compromisos reales por la novedad, o decisiones tomadas por impulso que comprometen la estabilidad recién construida en el año anterior.",
    opportunities: "Es el año más flexible del ciclo para probar algo distinto sin culpa — un cambio de trabajo, de ciudad, de forma de vivir, con menos costo que en un año 4 u 8.",
    keywords: ["libertad", "cambio", "adaptación"],
  },
  6: {
    theme: "Año de Responsabilidad y Cuidado",
    focus: "Después del movimiento del 5, la energía vuelve hacia el hogar y los vínculos cercanos — familia, pareja, compromisos que requieren presencia sostenida, no solo intención.",
    challenges: "El autosacrificio de cargar responsabilidades ajenas hasta el agotamiento, o el control disfrazado de cuidado — la diferencia entre las dos cosas se nota en si el otro pidió ayuda o no.",
    opportunities: "Fortalecer vínculos que venían descuidados, resolver temas familiares o del hogar pendientes, y — si corresponde — decisiones de largo plazo en pareja.",
    keywords: ["hogar", "compromiso", "armonía"],
  },
  7: {
    theme: "Año de Introspección",
    focus: "Un año menos orientado a resultados externos y más a comprensión — estudio, análisis, revisión honesta de en qué punto del camino estás realmente parado.",
    challenges: "El aislamiento que se vuelve evitación, o el escepticismo que impide confiar incluso en lo que sí funciona — la introspección sirve si vuelve a la acción, no si se queda dando vueltas.",
    opportunities: "Formación profunda, terapia, escritura, cualquier trabajo que requiera silencio sostenido rinde más este año — es el momento del ciclo para entender antes de decidir el próximo movimiento.",
    keywords: ["introspección", "análisis", "silencio"],
  },
  8: {
    theme: "Año de Poder Personal",
    focus: "La comprensión del año 7 se convierte en acción con peso real — dinero, autoridad, negociaciones, resultados materiales de lo que se viene construyendo desde el 1.",
    challenges: "El materialismo que pierde de vista para qué se buscaba el poder en primer lugar, o el uso de la autoridad para intimidar en vez de liderar.",
    opportunities: "Negociaciones salariales, inversiones, ascensos, cierre de proyectos grandes — este año recompensa la ambición ejecutada con estrategia, no solo con esfuerzo.",
    keywords: ["poder", "estrategia", "resultados"],
  },
  9: {
    theme: "Año de Cierre",
    focus: "El último del ciclo de nueve — soltar lo que ya cumplió su función, completar lo que quedó abierto, hacer lugar para que el próximo año 1 pueda arrancar de verdad.",
    challenges: "Aferrarte a algo (un vínculo, un trabajo, una identidad) que ya terminó su ciclo por miedo al vacío que deja soltarlo, o postergar despedidas necesarias.",
    opportunities: "Es el año más fértil del ciclo para terapia de cierre, mudanzas, finales de etapa, perdón — lo que se suelta bien acá no vuelve a pesar en el ciclo siguiente.",
    keywords: ["cierre", "soltar", "culminación"],
  },
  11: {
    theme: "Año Maestro de Intuición",
    focus: "Variante intensificada del 2: la cooperación y la paciencia del ciclo base se combinan con una sensibilidad elevada — percibís cambios y oportunidades antes de que sean evidentes para el resto.",
    challenges: "La misma intensidad que agudiza la percepción puede saturarla — ansiedad, sobreestimulación, dificultad para distinguir una corazonada real de un miedo proyectado.",
    opportunities: "Decisiones que dependen de leer una situación antes de tener todos los datos — negociaciones, vínculos, proyectos donde la intuición bien aterrizada vale más que el análisis exhaustivo.",
    keywords: ["intuición", "sensibilidad", "visión"],
  },
  22: {
    theme: "Año Maestro Constructor",
    focus: "Variante intensificada del 4: no es solo ordenar, es la capacidad de llevar una visión grande a una estructura real y duradera — la escala del proyecto importa este año.",
    challenges: "El peso de la propia ambición puede paralizar antes de empezar — la distancia entre lo que se imagina construir y el primer paso concreto se vuelve abrumadora si no se divide en partes ejecutables.",
    opportunities: "El mejor año del ciclo para lanzar algo que necesite fundamentos sólidos desde el día uno — un negocio, una obra, una organización pensada para durar, no para el corto plazo.",
    keywords: ["visión", "estructura", "manifestación"],
  },
  33: {
    theme: "Año Maestro de Servicio",
    focus: "Variante intensificada del 6: el cuidado del ciclo base se vuelve vocación — sostener, enseñar o sanar a otros ocupa un lugar central, más allá de lo que el año pediría en su forma reducida.",
    challenges: "El autosacrificio llevado al extremo — dar tanto que no queda margen para las propias necesidades, confundiendo servicio genuino con la obligación de resolver todo lo ajeno.",
    opportunities: "Roles de cuidado, enseñanza o acompañamiento (formales o no) rinden en un nivel distinto este año — pero solo si se sostienen con límites, no desde el vaciamiento.",
    keywords: ["servicio", "compasión", "sanación"],
  },
};

export interface PersonalMonthMeaning {
  theme: string;
  energy: 'Alta' | 'Media' | 'Baja';
  advice: string;
}

/**
 * El Mes Personal aplica el mismo tema del número al recorte de un mes
 * dentro del Año Personal vigente — la energía del año se expresa distinto
 * mes a mes según en qué número del ciclo mensual (1-9, 11, 22, 33) caiga.
 */
export const PERSONAL_MONTH_MEANINGS: Record<number, PersonalMonthMeaning> = {
  1: {
    theme: "Mes de Impulso",
    energy: 'Alta',
    advice: "Es el mejor mes del ciclo para arrancar algo puntual — una conversación pendiente, un primer paso concreto. La energía acompaña, no esperes el momento perfecto.",
  },
  2: {
    theme: "Mes de Espera Activa",
    energy: 'Media',
    advice: "No es un mes para forzar decisiones — es para escuchar, ajustar acuerdos y dejar que lo que iniciaste el mes anterior encuentre su ritmo sin apurarlo.",
  },
  3: {
    theme: "Mes de Comunicación",
    energy: 'Alta',
    advice: "Buen momento para hablar de lo que venías postergando, mostrar un trabajo o ampliar contactos — la palabra tiene más peso de lo habitual este mes.",
  },
  4: {
    theme: "Mes de Orden",
    energy: 'Baja',
    advice: "Un mes menos vistoso, más de trabajo de base — ordenar finanzas, agenda o rutinas. Rinde más de lo que parece mientras lo estás haciendo.",
  },
  5: {
    theme: "Mes de Imprevistos",
    energy: 'Alta',
    advice: "Los planes tienden a cambiar — dejá margen en la agenda en vez de resistirte al cambio. Es un mes flexible, no uno para atarse a lo fijo.",
  },
  6: {
    theme: "Mes de Vínculos Cercanos",
    energy: 'Media',
    advice: "La atención se corre hacia el hogar y la gente cercana — buen mes para resolver un tema familiar pendiente, no tan bueno para aislarte en lo propio.",
  },
  7: {
    theme: "Mes de Pausa",
    energy: 'Baja',
    advice: "Bajá el ritmo social si podés — es un mes que rinde más en silencio (leer, estudiar, pensar) que en agenda llena. Forzar actividad social este mes suele salir caro en energía.",
  },
  8: {
    theme: "Mes de Resultados",
    energy: 'Alta',
    advice: "Buen mes para cerrar negociaciones, pedir lo que corresponde o tomar decisiones de peso económico — la energía sostiene la asertividad, no la pasividad.",
  },
  9: {
    theme: "Mes de Cierre",
    energy: 'Media',
    advice: "Terminá lo que quedó a medias antes de arrancar algo nuevo — este mes premia soltar, no acumular un proyecto más sobre los que ya están abiertos.",
  },
  11: {
    theme: "Mes Maestro de Intuición",
    energy: 'Alta',
    advice: "Prestá atención a corazonadas puntuales sobre decisiones concretas de este mes — pero contrastalas con algo tangible antes de actuar, la intensidad puede confundir percepción con ansiedad.",
  },
  22: {
    theme: "Mes Maestro de Construcción",
    energy: 'Alta',
    advice: "Si tenés un proyecto grande en marcha, este es el mes para darle estructura real — un plan concreto, no solo la visión. La ambición sin pasos ejecutables se estanca.",
  },
  33: {
    theme: "Mes Maestro de Cuidado",
    energy: 'Media',
    advice: "Es un mes fuerte para sostener a otros, pero cuidá no vaciarte en el intento — poner un límite este mes no es egoísmo, es lo que te permite seguir sosteniendo después.",
  },
};

export interface UniversalDailyEnergy {
  date: string;
  dailyNumber: number;
  overallScore: number;
  theme: string;
  description: string;
  strengths: string[];
  cautions: string[];
  areas: DailyEnergyResult['areas'];
  moonPhase: { phase: string; emoji: string; description: string };
}

/**
 * Número del día — sin fecha de nacimiento, igual para cualquier visitante
 * el mismo día calendario. Mismo algoritmo de reducción que calculateLifePath
 * (preserva 11/22/33), aplicado a la fecha de hoy en vez de a un nacimiento.
 * No confundir con getDailyNumber() en lib/calculations.ts — esa función
 * tiene un caso especial (28 = "riqueza") ajeno al resto del sitio, que
 * solo usa 1-9/11/22/33; esta se mantiene consistente con esa convención.
 */
function calculateDailyNumber(targetDate: Date): number {
  const dateStr = `${targetDate.getDate()}${targetDate.getMonth() + 1}${targetDate.getFullYear()}`;
  let sum = 0;
  for (const char of dateStr) sum += parseInt(char, 10);
  return reduceToSingleDigit(sum);
}

// Contenido propio, en voz colectiva ("hoy", no "tu día personal") — el
// mismo texto lo lee cualquier visitante sin perfil, así que no puede
// hablar de un patrón individual que no calculamos para esa persona.
const UNIVERSAL_DAY_THEMES: Record<number, { theme: string; description: string; strengths: string[]; cautions: string[] }> = {
  1: { theme: "Impulso", description: "Un día que favorece arrancar algo nuevo — la energía colectiva empuja hacia adelante, no hacia la espera.", strengths: ["Iniciativa", "Claridad", "Decisión"], cautions: ["Apuro", "Individualismo excesivo"] },
  2: { theme: "Cooperación", description: "Un día que rinde más en conjunto que en soledad — los acuerdos y la escucha activa tienen más peso de lo habitual.", strengths: ["Diplomacia", "Paciencia", "Escucha"], cautions: ["Indecisión", "Dependencia del otro"] },
  3: { theme: "Expresión", description: "Un día que favorece comunicar, mostrar trabajo y decir lo que se venía postergando.", strengths: ["Creatividad", "Comunicación", "Sociabilidad"], cautions: ["Dispersión", "Exageración"] },
  4: { theme: "Orden", description: "Un día menos vistoso pero de base sólida — rinde en tareas metódicas más que en golpes de efecto.", strengths: ["Disciplina", "Organización", "Constancia"], cautions: ["Rigidez", "Resistencia al cambio"] },
  5: { theme: "Movimiento", description: "Un día con más variables de las esperadas — mejor dejar margen en la agenda que forzar un plan cerrado.", strengths: ["Adaptabilidad", "Curiosidad", "Apertura"], cautions: ["Impulsividad", "Inconstancia"] },
  6: { theme: "Cuidado", description: "Un día que empuja la atención hacia el entorno cercano — vínculos, hogar, responsabilidades compartidas.", strengths: ["Empatía", "Responsabilidad", "Armonía"], cautions: ["Autosacrificio", "Control"] },
  7: { theme: "Pausa", description: "Un día que rinde más en silencio que en agenda llena — buen momento para pensar antes de decidir.", strengths: ["Análisis", "Introspección", "Sabiduría"], cautions: ["Aislamiento", "Escepticismo"] },
  8: { theme: "Resultados", description: "Un día con energía orientada a lo concreto — negociaciones, decisiones de peso, avances medibles.", strengths: ["Estrategia", "Liderazgo", "Determinación"], cautions: ["Materialismo", "Rigidez de control"] },
  9: { theme: "Cierre", description: "Un día que favorece terminar lo que quedó a medias antes de sumar algo nuevo a la lista.", strengths: ["Compasión", "Capacidad de soltar", "Perspectiva"], cautions: ["Apego al pasado", "Postergar despedidas"] },
  11: { theme: "Intuición elevada", description: "Un día donde señales sutiles pesan más de lo habitual — vale la pena prestarles atención, con los pies en la tierra.", strengths: ["Intuición", "Inspiración", "Sensibilidad"], cautions: ["Ansiedad", "Sobreestimulación"] },
  22: { theme: "Construcción a gran escala", description: "Un día que favorece dar estructura real a algo grande — un plan concreto rinde más que la sola intención.", strengths: ["Visión", "Capacidad de ejecución", "Ambición con método"], cautions: ["Perfeccionismo paralizante", "Presión autoimpuesta"] },
  33: { theme: "Servicio", description: "Un día donde sostener a otros ocupa un lugar central — con un límite claro para no vaciarse en el intento.", strengths: ["Compasión", "Sanación", "Generosidad"], cautions: ["Desgaste emocional", "Descuido propio"] },
};

function calculateUniversalScore(dailyNumber: number, moonPhase: string): number {
  let score = 50;
  if (dailyNumber >= 1 && dailyNumber <= 9) {
    score = 40 + dailyNumber * 6;
  } else if (dailyNumber === 11) {
    score = 85;
  } else if (dailyNumber === 22) {
    score = 90;
  } else if (dailyNumber === 33) {
    score = 95;
  }
  if (moonPhase === "Llena" || moonPhase === "Creciente") score += 5;
  else if (moonPhase === "Menguante" || moonPhase === "Cuarto Menguante") score -= 3;
  return Math.min(100, Math.max(1, score));
}

/**
 * Energía del día sin perfil — el único cálculo del motor que no depende
 * de una fecha de nacimiento. Mismo resultado para cualquier visitante en
 * la misma fecha calendario.
 */
export function calculateUniversalDailyEnergy(targetDate: Date = new Date()): UniversalDailyEnergy {
  const dailyNumber = calculateDailyNumber(targetDate);
  const moonPhase = getMoonPhase(targetDate);
  const themeData = UNIVERSAL_DAY_THEMES[dailyNumber] || UNIVERSAL_DAY_THEMES[1];
  const overallScore = calculateUniversalScore(dailyNumber, moonPhase.phase);

  return {
    date: targetDate.toISOString().split('T')[0],
    dailyNumber,
    overallScore,
    theme: themeData.theme,
    description: themeData.description,
    strengths: themeData.strengths,
    cautions: themeData.cautions,
    // Sin perfil no hay elemento natal — se computa igual con el resto de
    // señales del día (número + luna), solo se omite el bonus de elemento.
    areas: calculateAreaScores(dailyNumber, '', moonPhase.phase),
    moonPhase,
  };
}

export interface PersonalDayMeaning {
  theme: string;
  description: string;
  strengths: string[];
  cautions: string[];
}

/**
 * Wrapper público de las tablas THEME/STRENGTHS/CAUTIONS_BY_PERSONAL_DAY,
 * que quedan privadas — mantiene el mismo encapsulamiento que
 * PERSONAL_YEAR_MEANINGS/PERSONAL_MONTH_MEANINGS exponen directamente, sin
 * atar a los consumidores externos a la forma interna de 3 tablas separadas.
 */
export function getPersonalDayMeaning(dayNumber: number): PersonalDayMeaning | null {
  const themeData = THEME_BY_PERSONAL_DAY[dayNumber];
  if (!themeData) return null;
  return {
    theme: themeData.theme,
    description: themeData.description,
    strengths: STRENGTHS_BY_PERSONAL_DAY[dayNumber] || [],
    cautions: CAUTIONS_BY_PERSONAL_DAY[dayNumber] || [],
  };
}

/**
 * Calculate daily energy for a user on a specific date.
 * Deterministic: same inputs always produce the same output.
 */
export function calculateDailyEnergy(
  profile: UserProfile,
  targetDate: Date = new Date()
): DailyEnergyResult {
  const birthParts = profile.birthDate.split('-').map(Number);
  const birthDay = birthParts[2] || 1;
  const birthMonth = birthParts[1] || 1;
  const birthYear = birthParts[0] || 1990;

  // Base day number is aligned with the calendar day vibration (universal date reduction)
  const calendarDayNumber = calculateDailyNumber(targetDate);
  const personalYear = getPersonalYear(birthDay, birthMonth, birthYear, targetDate.getFullYear());
  const personalMonth = reduceToSingleDigit(personalYear + (targetDate.getMonth() + 1));
  const personalDay = calendarDayNumber;

  // Get moon phase
  const moonPhase = getMoonPhase(targetDate);

  // Get element influence based on sun sign
  const daySunSign = getSunSign(
    `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`
  );
  const elementInfluence = getElementInfluence(profile.element, daySunSign);

  // Calculate overall score (deterministic)
  const baseScore = calculateEnergyScore(personalDay, personalYear, personalMonth, moonPhase.phase, profile.element);
  const overallScore = Math.min(100, Math.max(1, baseScore));

  // Get theme and description based on day number
  const themeData = THEME_BY_PERSONAL_DAY[personalDay] || THEME_BY_PERSONAL_DAY[1];
  const strengths = STRENGTHS_BY_PERSONAL_DAY[personalDay] || ["Claridad", "Acción", "Conexión"];
  const cautions = CAUTIONS_BY_PERSONAL_DAY[personalDay] || ["Impaciencia", "Distracción"];

  // Calculate area scores (deterministic based on personal day and element)
  const areas = calculateAreaScores(personalDay, profile.element, moonPhase.phase);

  // Generate explanation
  const explanation = generateExplanation(profile, personalDay, personalYear, moonPhase.phase, overallScore);

  return {
    date: targetDate.toISOString().split('T')[0],
    overallScore,
    theme: themeData.theme,
    description: themeData.description,
    strengths,
    cautions,
    areas,
    moonPhase,
    personalDay,
    personalYear,
    personalMonth,
    elementInfluence,
    explanation,
  };
}

/**
 * Calculate energy score deterministically.
 * Based on personal day number, element harmony, and moon phase.
 */
function calculateEnergyScore(
  personalDay: number,
  personalYear: number,
  personalMonth: number,
  moonPhase: string,
  element: string
): number {
  // Base score from personal day (1-9, 11, 22, 33)
  let score = 50;

  // Personal day influence (1-9 scale, master numbers boost)
  if (personalDay >= 1 && personalDay <= 9) {
    score = 40 + (personalDay * 6);
  } else if (personalDay === 11) {
    score = 85;
  } else if (personalDay === 22) {
    score = 90;
  } else if (personalDay === 33) {
    score = 95;
  }

  // Year-Month harmony bonus
  if (personalYear === personalMonth) {
    score += 5;
  }

  // Moon phase influence
  if (moonPhase === "Llena" || moonPhase === "Creciente") {
    score += 5;
  } else if (moonPhase === "Menguante" || moonPhase === "Cuarto Menguante") {
    score -= 3;
  }

  // Element bonus (elements that are naturally energizing)
  if (element === "Fuego" || element === "Aire") {
    score += 3;
  }

  return Math.min(100, Math.max(1, score));
}

/**
 * Calculate area-specific scores (deterministic).
 */
function calculateAreaScores(
  personalDay: number,
  element: string,
  moonPhase: string
): DailyEnergyResult['areas'] {
  const base = 50;

  // Work: influenced by structured numbers (4, 8) and earth element
  let work = base;
  if ([4, 8].includes(personalDay)) work += 15;
  if (element === "Tierra") work += 10;
  if (moonPhase === "Creciente") work += 5;

  // Relationships: influenced by cooperative numbers (2, 6) and water element
  let relationships = base;
  if ([2, 6].includes(personalDay)) relationships += 15;
  if (element === "Agua") relationships += 10;
  if (moonPhase === "Llena") relationships += 5;

  // Creativity: influenced by expressive numbers (3, 5) and fire element
  let creativity = base;
  if ([3, 5].includes(personalDay)) creativity += 15;
  if (element === "Fuego") creativity += 10;
  if (moonPhase === "Creciente") creativity += 5;

  // Decisions: influenced by analytical numbers (7, 9) and air element
  let decisions = base;
  if ([7, 9].includes(personalDay)) decisions += 15;
  if (element === "Aire") decisions += 10;
  if (moonPhase === "Llena") decisions += 5;

  return {
    work: { score: Math.min(100, work), label: getAreaLabel(work) },
    relationships: { score: Math.min(100, relationships), label: getAreaLabel(relationships) },
    creativity: { score: Math.min(100, creativity), label: getAreaLabel(creativity) },
    decisions: { score: Math.min(100, decisions), label: getAreaLabel(decisions) },
  };
}

function getAreaLabel(score: number): string {
  if (score >= 80) return "Muy favorable";
  if (score >= 65) return "Favorable";
  if (score >= 50) return "Neutral";
  if (score >= 35) return "Desafiante";
  return "Muy desafiante";
}

/**
 * Get element influence description.
 */
function getElementInfluence(userElement: string, dayElement: string): string {
  if (userElement === dayElement) {
    return `Tu elemento ${userElement} resuena con el elemento del día. Energía alineada.`;
  }
  if (
    (userElement === "Fuego" && dayElement === "Aire") ||
    (userElement === "Aire" && dayElement === "Fuego") ||
    (userElement === "Tierra" && dayElement === "Agua") ||
    (userElement === "Agua" && dayElement === "Tierra")
  ) {
    return `Tu elemento ${userElement} se complementa con el elemento del día (${dayElement}). Energía armoniosa.`;
  }
  return `Tu elemento ${userElement} entra en tensión con el elemento del día (${dayElement}). Momento de equilibrio.`;
}

/**
 * Generate a personalized explanation.
 */
function generateExplanation(
  profile: UserProfile,
  personalDay: number,
  personalYear: number,
  moonPhase: string,
  score: number
): string {
  const theme = THEME_BY_PERSONAL_DAY[personalDay]?.theme || "Energía mixta";
  const yearTheme = getYearTheme(personalYear);

  let explanation = `Hoy es un día de energía ${theme.toLowerCase()}. `;
  explanation += `Tu año personal (${personalYear}) indica ${yearTheme}. `;
  explanation += `La fase lunar ${moonPhase.toLowerCase()} agrega una cualidad específica a tu día.`;

  if (score >= 75) {
    explanation += " Es un día favorable para acciones importantes.";
  } else if (score >= 50) {
    explanation += " Es un día equilibrado. Ideal para planificar y reflexionar.";
  } else {
    explanation += " Es un día de mayor intensidad. Conocé tus límites y actuá con consciencia.";
  }

  return explanation;
}

export function getYearTheme(year: number): string {
  const themes: Record<number, string> = {
    1: "un año de nuevos comienzos",
    2: "un año de cooperación y relaciones",
    3: "un año de expresión y creatividad",
    4: "un año de trabajo y estabilidad",
    5: "un año de cambio y aventura",
    6: "un año de responsabilidad y hogar",
    7: "un año de introspección y sabiduría",
    8: "un año de manifestación y poder",
    9: "un año de cierre y compasión",
    11: "un año de intuición elevada",
    22: "un año de construcción a gran escala",
    33: "un año de servicio y amor",
  };
  return themes[year] || "un año de crecimiento";
}
