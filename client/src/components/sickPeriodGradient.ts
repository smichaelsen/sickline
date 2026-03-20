type Severity = "yellow" | "red";

export type SeverityPeriod = {
  startDate: string;
  endDate?: string;
  status: Severity;
};

export const FADE_PX = 8;
export const BAR_HEIGHT_PX = 40;

export const severityColor: Record<Severity, string> = {
  yellow: "#f59e0b",
  red: "#ef4444"
};

export function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map((v) => Number.parseInt(v, 10));
  return new Date(Date.UTC(year, month - 1, day));
}

export function diffDays(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function buildGradient(
  severityPeriods: SeverityPeriod[],
  start: Date,
  end: Date,
  totalDays: number,
  effectiveScale: number
): string | undefined {
  if (!severityPeriods.length) return undefined;

  const segments = severityPeriods.map((segment) => {
    const segStart = Math.max(0, diffDays(start, parseDate(segment.startDate)));
    const segEnd = segment.endDate
      ? diffDays(start, parseDate(segment.endDate))
      : diffDays(start, end);
    const clampedEnd = Math.min(totalDays - 1, Math.max(segStart, segEnd));
    return {
      start: segStart,
      end: clampedEnd,
      color: severityColor[segment.status]
    };
  });

  const totalPx = totalDays * effectiveScale;
  const fadePx = Math.min(FADE_PX, effectiveScale * 0.8);
  const stops: string[] = [];

  segments.forEach((seg, index) => {
    const next = segments[index + 1];
    const startPx = seg.start * effectiveScale;
    const endPx = (seg.end + 1) * effectiveScale;
    const effectiveFade = next ? Math.min(fadePx, Math.max(0, endPx - startPx)) : 0;
    const solidEnd = next ? endPx - effectiveFade : endPx;

    stops.push(`${seg.color} ${startPx}px`);
    stops.push(`${seg.color} ${solidEnd}px`);

    if (next) {
      stops.push(`${next.color} ${endPx}px`);
    }

    if (!next && endPx < totalPx) {
      stops.push(`${seg.color} ${totalPx}px`);
    }
  });

  return `linear-gradient(90deg, ${stops.join(", ")})`;
}
