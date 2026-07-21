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
  currentYear?: number
): number {
  const year = currentYear ?? new Date().getFullYear();
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

function calculateLifePath(day: number, month: number, year: number): number {
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
