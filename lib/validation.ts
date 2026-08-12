/** True if `date` is a well-formed, real calendar date in YYYY-MM-DD form, not in the future, and year >= 1900. */
export function isValidDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  const year = d.getFullYear();
  if (year < 1900) return false;
  if (d > new Date()) return false;
  return true;
}
