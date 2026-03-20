export const TIMEZONE: string =
  import.meta.env.VITE_TIMEZONE ?? "Europe/Berlin";

/** Returns today's date string (YYYY-MM-DD) in the configured timezone. */
export function todayInTz(): string {
  return new Date()
    .toLocaleDateString("sv-SE", { timeZone: TIMEZONE })
    .slice(0, 10);
}

/** Returns yesterday's date string (YYYY-MM-DD) in the configured timezone. */
export function yesterdayInTz(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("sv-SE", { timeZone: TIMEZONE }).slice(0, 10);
}

/** Adds `days` to a YYYY-MM-DD string and returns the new date string. */
export function shiftDate(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
