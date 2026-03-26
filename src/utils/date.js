/**
 * Parses "YYYY-MM-DD" as a local midnight date,
 * avoiding UTC timezone shift bugs.
 */
export function parseISODate(dateString) {
  if (!dateString) return null;
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/**
 * Returns the given date set to 00:00:00.000 (midnight).
 */
export function startOfDay(date) {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}
