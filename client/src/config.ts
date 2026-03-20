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
