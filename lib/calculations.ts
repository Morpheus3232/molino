export function calculateLifePath(day: number, month: number, year: number): number {
  const dateStr = `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${year}`;
  let sum = 0;
  for (const char of dateStr) {
    sum += parseInt(char, 10);
  }

  if (sum === 11 || sum === 22 || sum === 33) return sum;

  while (sum > 9) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
    if (sum === 11 || sum === 22 || sum === 33) return sum;
  }

  return sum;
}

export function getPersonalDay(
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  day?: number,
  month?: number,
  year?: number
): number {
  const d = day ?? new Date().getDate();
  const m = month ?? new Date().getMonth() + 1;
  const y = year ?? new Date().getFullYear();

  const lifePath = calculateLifePath(birthDay, birthMonth, birthYear);
  const dateSum = d + m + y;
  let sum = lifePath + dateSum;

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
  }

  return sum;
}

export function getPersonalYear(
  birthDay: number,
  birthMonth: number,
  _birthYear?: number,
  targetYear?: number,
  _b?: number,
  currentYear?: number
): number {
  // Prefer explicit currentYear (used by the personalMonth call hack), else the 4th positional arg every real caller passes.
  const year = currentYear ?? targetYear ?? new Date().getFullYear();
  let sum = birthDay + birthMonth + year;

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
  }

  return sum;
}

export function getDailyNumber(targetDate: Date = new Date()): number {
  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  const dateStr = `${String(day).padStart(2, '0')}${String(month).padStart(2, '0')}${year}`;
  let sum = 0;
  for (const char of dateStr) {
    sum += parseInt(char, 10);
  }

  // Excepciones: 11 y 22 son números maestros, 28 es la riqueza
  if (sum === 11 || sum === 22 || sum === 28) return sum;

  while (sum > 9) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
    if (sum === 11 || sum === 22 || sum === 28) return sum;
  }

  return sum;
}

export function getPersonalDayForDate(
  birthDay: number,
  birthMonth: number,
  birthYear: number,
  targetDate: Date
): number {
  const day = targetDate.getDate();
  const month = targetDate.getMonth() + 1;
  const year = targetDate.getFullYear();

  const lifePath = calculateLifePath(birthDay, birthMonth, birthYear);
  const dateSum = day + month + year;
  let sum = lifePath + dateSum;

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
  }

  return sum;
}

export function reduceToSingleDigit(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  let sum = num;
  while (sum > 9) {
    let temp = 0;
    for (const char of String(sum)) {
      temp += parseInt(char, 10);
    }
    sum = temp;
    if (sum === 11 || sum === 22 || sum === 33) return sum;
  }
  return sum;
}

export function getZodiacSign(day: number, month: number): string {
  const signs = [
    { sign: "Capricornio", start: [1, 19], end: [1, 19] },
    { sign: "Acuario", start: [1, 20], end: [2, 18] },
    { sign: "Piscis", start: [2, 19], end: [3, 20] },
    { sign: "Aries", start: [3, 21], end: [4, 19] },
    { sign: "Tauro", start: [4, 20], end: [5, 20] },
    { sign: "Géminis", start: [5, 21], end: [6, 20] },
    { sign: "Cáncer", start: [6, 21], end: [7, 22] },
    { sign: "Leo", start: [7, 23], end: [8, 22] },
    { sign: "Virgo", start: [8, 23], end: [9, 22] },
    { sign: "Libra", start: [9, 23], end: [10, 22] },
    { sign: "Escorpio", start: [10, 23], end: [11, 21] },
    { sign: "Sagitario", start: [11, 22], end: [12, 21] },
    { sign: "Capricornio", start: [12, 22], end: [12, 31] }
  ];

  for (const s of signs) {
    if (
      (month === s.start[0] && day >= s.start[1]) ||
      (month === s.end[0] && day <= s.end[1])
    ) {
      return s.sign;
    }
  }
  return "Capricornio";
}

export function getMoonPhase(date: Date): { phase: string; emoji: string; description: string } {
  const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
  const synodicMonth = 29.53058867;
  const diff = date.getTime() - knownNewMoon.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  const phase = ((days % synodicMonth) + synodicMonth) % synodicMonth;

  if (phase < 1.0) return { phase: "Nueva", emoji: "🌑", description: "Momento de intención y nuevos comienzos." };
  if (phase < 7.4) return { phase: "Creciente", emoji: "🌒", description: "Energía de crecimiento y acción." };
  if (phase < 8.4) return { phase: "Cuarto Creciente", emoji: "🌓", description: "Punto de decisión y compromiso." };
  if (phase < 13.8) return { phase: "Gibosa Creciente", emoji: "🌔", description: "Refinamiento y preparación." };
  if (phase < 15.0) return { phase: "Llena", emoji: "🌕", description: "Claridad máxima y manifestación." };
  if (phase < 22.1) return { phase: "Gibosa Menguante", emoji: "🌖", description: "Liberación y gratitud." };
  if (phase < 23.1) return { phase: "Cuarto Menguante", emoji: "🌗", description: "Reevaluación y ajuste." };
  return { phase: "Menguante", emoji: "🌘", description: "Descanso, introspección y cierre." };
}

/**
 * Calculate the Lucky Number (Número de la Suerte) from birth month and year.
 * Day does NOT participate.
 * Rules:
 *   1. Take the first digit of the birth month.
 *   2. From the birth year, take the last non-zero digit (ignore trailing zeros).
 *   3. Concatenate both digits to form the number.
 * Example: 18/04/1990 → month=04 → first digit=4, year=1990 → last non-zero=9 → 49.
 */
export function calculateLuckyNumber(month: number, year: number): number {
  const firstDigitOfMonth = Math.floor(month / 10) || month;
  const yearStr = String(year);
  let lastNonZeroDigit = 0;
  for (let i = yearStr.length - 1; i >= 0; i--) {
    const d = parseInt(yearStr[i], 10);
    if (d !== 0) {
      lastNonZeroDigit = d;
      break;
    }
  }
  if (lastNonZeroDigit === 0) lastNonZeroDigit = 1;
  return firstDigitOfMonth * 10 + lastNonZeroDigit;
}

export function getPlanetaryPositions(date: Date): { name: string; emoji: string; sign: string }[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));

  return [
    { 
      name: "Mercurio", 
      emoji: "☿", 
      sign: getZodiacSign(((dayOfYear + 80) % 365) + 1, ((dayOfYear + 80) % 12) + 1) 
    },
    { 
      name: "Venus", 
      emoji: "♀", 
      sign: getZodiacSign(((dayOfYear + 150) % 365) + 1, ((dayOfYear + 150) % 12) + 1) 
    },
    { 
      name: "Marte", 
      emoji: "♂", 
      sign: getZodiacSign(((dayOfYear + 220) % 365) + 1, ((dayOfYear + 220) % 12) + 1) 
    }
  ];
}
