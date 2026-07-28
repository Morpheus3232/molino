export function getPersonalNumber(day: number, month: number, year: number): number {
  let sum = day + month + year;
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum
      .toString()
      .split("")
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return sum;
}
