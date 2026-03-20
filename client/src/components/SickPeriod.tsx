import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import {
  BAR_HEIGHT_PX,
  buildGradient,
  diffDays,
  parseDate,
  severityColor
} from "./sickPeriodGradient";

export type { SeverityPeriod } from "./sickPeriodGradient";

export type SickPeriodProps = {
  startDate: string;
  endDate?: string;
  title?: string | null;
  severityPeriods: SeverityPeriod[];
  comments?: Array<{ date: string; comment: string }>;
  className?: string;
  pxPerDay?: number;
  onCommentClick?: (comment: { date: string; comment: string }, anchor: HTMLElement) => void;
};

const DEFAULT_PX_PER_DAY = 32;

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function SickPeriod({
  startDate,
  endDate,
  title,
  severityPeriods,
  comments = [],
  className,
  pxPerDay,
  onCommentClick
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

  const gradient = useMemo(
    () => buildGradient(severityPeriods, start, end, totalDays, effectiveScale),
    [severityPeriods, effectiveScale, start, end, totalDays]
  );

  const markers = comments.map((comment) => {
    const offsetDays = Math.max(0, Math.min(totalDays - 1, diffDays(start, parseDate(comment.date))));
    const leftPx = (offsetDays + 0.5) * effectiveScale;
    return { leftPx, comment };
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
            onCommentClick ? (
              <button
                key={index}
                type="button"
                aria-label={`Comment on ${marker.comment.date}`}
                className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-2 ring-slate-900/30 pointer-events-auto cursor-pointer hover:ring-blue-500 focus:outline-none focus:ring-blue-500 transition-shadow"
                style={{ left: `${marker.leftPx}px`, top: "80%" }}
                onClick={(e) => onCommentClick(marker.comment, e.currentTarget)}
              />
            ) : (
              <span
                key={index}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-2 ring-slate-900/30"
                style={{ left: `${marker.leftPx}px`, top: "80%" }}
              />
            )
          ))}
        </div>
      ) : null}
    </div>
  );
}
