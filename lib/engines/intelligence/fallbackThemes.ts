/**
 * Generic day/year/timing/decision text-lookup helpers for the
 * deterministic fallback's non-personal_profile cases (daily_energy,
 * timing, decision, default). Pure Record-based lookups, no dependencies.
 * Only consumed by fallbackInterpretation.ts.
 */

export function getDayTheme(personalDay: number): string {
  const themes: Record<number, string> = {
    1: 'iniciación y acción',
    2: 'cooperación y conexión',
    3: 'expresión y creatividad',
    4: 'construcción y disciplina',
    5: 'cambio y aventura',
    6: 'armonía y cuidado',
    7: 'introspección y sabiduría',
    8: 'manifestación y poder',
    9: 'cierre y compasión',
    11: 'intuición elevada',
    22: 'construcción a gran escala',
    33: 'servicio y amor',
  };
  return themes[personalDay] || 'energía mixta';
}

export function getYearTheme(personalYear: number): string {
  const themes: Record<number, string> = {
    1: 'nuevos comienzos',
    2: 'cooperación y relaciones',
    3: 'expresión y creatividad',
    4: 'trabajo y estabilidad',
    5: 'cambio y aventura',
    6: 'responsabilidad y hogar',
    7: 'introspección y sabiduría',
    8: 'manifestación y poder',
    9: 'cierre y compasión',
    11: 'intuición elevada',
    22: 'construcción a gran escala',
    33: 'servicio y amor',
  };
  return themes[personalYear] || 'crecimiento';
}

export function getDayAlignment(personalDay: number): string {
  if ([1, 4, 8].includes(personalDay)) return 'constructiva';
  if ([2, 6].includes(personalDay)) return 'cooperativa';
  if ([3, 5].includes(personalDay)) return 'expresiva';
  if ([7, 9].includes(personalDay)) return 'reflectiva';
  return 'equilibrada';
}

export function getDayAction(personalDay: number): string {
  const actions: Record<number, string> = {
    1: 'comenzar algo nuevo',
    2: 'conectar con otros',
    3: 'comunicar y crear',
    4: 'organizar y trabajar',
    5: 'explorar y adaptarse',
    6: 'cuidar de quienes te rodean',
    7: 'mirar hacia adentro',
    8: 'asumir liderazgo',
    9: 'completar y soltar',
  };
  return actions[personalDay] || 'reflexionar y actuar con consciencia';
}

export function getTimingAdvice(personalDay: number, personalYear: number): string {
  if (personalDay === 1 || personalDay === 8) return 'un momento favorable para acciones importantes';
  if (personalDay === 7 || personalDay === 9) return 'un momento para reflexionar antes de actuar';
  if (personalDay === 5) return 'un momento de cambio e imprevisibilidad';
  return 'un momento equilibrado para avanzar';
}

export function getProfileTimingAlignment(personalDay: number): string {
  if ([1, 4, 8].includes(personalDay)) return 'alinea bien';
  if ([2, 6].includes(personalDay)) return 'necesita cooperación';
  if ([7, 9].includes(personalDay)) return 'requiere reflexión';
  return 'está en equilibrio';
}

export function getDecisionAdvice(lifePath: number, personalDay: number): string {
  if (lifePath === 1 || lifePath === 8) return 'confianza en tu capacidad de decisión';
  if (lifePath === 2 || lifePath === 6) return 'considerar a otros en tu proceso';
  if (lifePath === 7) return 'análisis profundo antes de decidir';
  return 'un enfoque equilibrado';
}

export function getDayDecisionTiming(personalDay: number): string {
  if ([1, 8].includes(personalDay)) return 'favorece las decisiones firmes';
  if ([2, 6].includes(personalDay)) return 'favorece las decisiones cooperativas';
  if ([7, 9].includes(personalDay)) return 'favorece la reflexión antes de decidir';
  return 'ofrece un equilibrio para decidir';
}
