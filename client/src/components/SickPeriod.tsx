import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

type Severity = "yellow" | "red";

export type SeverityPeriod = {
  startDate: string;
  endDate?: string;
  status: Severity;
};

export type SickPeriodProps = {
  startDate: string;
  endDate?: string;
  title?: string | null;
  severityPeriods: SeverityPeriod[];
  comments?: Array<{ date: string; comment: string }>;
  className?: string;
  pxPerDay?: number;
};

const DEFAULT_PX_PER_DAY = 32;
const FADE_PX = 8;
const BAR_HEIGHT_PX = 40;

const severityColor: Record<Severity, string> = {
  yellow: "#f59e0b",
  red: "#ef4444"
};

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map((v) => Number.parseInt(v, 10));
  return new Date(Date.UTC(year, month - 1, day));
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function diffDays(a: Date, b: Date): number {
  const msPerDay = 86_400_000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function SickPeriod({
  startDate,
  endDate,
  title,
  severityPeriods,
  comments = [],
  className,
  pxPerDay
}: SickPeriodProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inheritedPxPerDay, setInheritedPxPerDay] = useState(DEFAULT_PX_PER_DAY);

  useLayoutEffect(() => {
    if (pxPerDay != null) {
      setInheritedPxPerDay(pxPerDay);
      return;
    }
    if (containerRef.current) {
      const computed = getComputedStyle(containerRef.current).getPropertyValue("--px-per-day");
      const parsed = Number.parseFloat(computed);
      if (!Number.isNaN(parsed)) {
        setInheritedPxPerDay(parsed);
      } else {
        setInheritedPxPerDay(DEFAULT_PX_PER_DAY);
      }
    }
  }, [pxPerDay]);

  const resolvedEndDate = endDate ?? formatDate(new Date());
  const start = parseDate(startDate);
  const end = parseDate(resolvedEndDate);
  const totalDays = Math.max(1, diffDays(start, end) + 1);
  const scale = pxPerDay ?? inheritedPxPerDay;
  const effectiveScale = totalDays === 1 ? BAR_HEIGHT_PX : scale;

  const gradient = useMemo(() => {
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

      // Ensure the gradient fills the full width for the last segment
      if (!next && endPx < totalPx) {
        stops.push(`${seg.color} ${totalPx}px`);
      }
    });

    return `linear-gradient(90deg, ${stops.join(", ")})`;
  }, [severityPeriods, effectiveScale, start, end, totalDays]);

  const markers = comments.map((comment) => {
    const offsetDays = Math.max(0, Math.min(totalDays - 1, diffDays(start, parseDate(comment.date))));
    const leftPx = (offsetDays + 0.5) * effectiveScale;
    return { leftPx };
  });

  return (
    <div
      ref={containerRef}
      className={clsx("relative", className)}
      style={{
        width:
          totalDays === 1
            ? `${BAR_HEIGHT_PX}px`
            : `calc(var(--px-per-day, ${DEFAULT_PX_PER_DAY}px) * ${totalDays})`,
        ...(pxPerDay != null ? { ["--px-per-day" as const]: `${pxPerDay}px` } : undefined)
      }}
    >
      <div
        className={clsx("w-full", endDate ? "rounded-full" : "rounded-l-full rounded-r-none")}
        style={{
          height: `${BAR_HEIGHT_PX}px`,
          background: gradient ?? severityColor[severityPeriods[0]?.status ?? "yellow"]
        }}
      />

      {title ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow-sm">
          {title}
        </div>
      ) : null}

      {markers.length > 0 ? (
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker, index) => (
            <span
              key={index}
              className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-2 ring-slate-900/30"
              style={{ left: `${marker.leftPx}px`, top: "80%" }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
