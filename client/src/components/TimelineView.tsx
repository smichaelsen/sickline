import { useEffect, useRef, useState } from "react";
import { useMembers } from "../api/useMembers";
import { useSickPeriods } from "../api/useSickPeriods";
import { todayInTz } from "../config";
import { shiftDate } from "../dateUtils";
import type { SickPeriod as SickPeriodType } from "../api/types";
import { SickPeriod } from "./SickPeriod";
import { SickCommentTooltip } from "./SickCommentTooltip";

const PX_PER_DAY = 32;
const ROW_HEIGHT = 56;
const LABEL_COL_WIDTH = 128;
const DAY_RANGE_OPTIONS = [30, 60, 90] as const;

type DayRange = (typeof DAY_RANGE_OPTIONS)[number];

type ActiveTooltip = {
  comment: { date: string; comment: string };
  anchorRect: DOMRect;
};

function parseDate(value: string): Date {
  const [year, month, day] = value.split("-").map((v) => Number.parseInt(v, 10));
  return new Date(Date.UTC(year, month - 1, day));
}

function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function buildDays(from: string, to: string): Date[] {
  const start = parseDate(from);
  const end = parseDate(to);
  const count = diffDays(start, end) + 1;
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(start);
    d.setUTCDate(d.getUTCDate() + i);
    return d;
  });
}

function dayLabel(d: Date): { num: string; weekday: string; isWeekend: boolean; isSunday: boolean } {
  const num = String(d.getUTCDate());
  const weekday = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][d.getUTCDay()];
  const isWeekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
  const isSunday = d.getUTCDay() === 0;
  return { num, weekday, isWeekend, isSunday };
}

type TooltipOverlayProps = {
  tooltip: ActiveTooltip;
  onClose: () => void;
};

function TooltipOverlay({ tooltip, onClose }: TooltipOverlayProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Position below the anchor — fixed coords are already viewport-relative
  const { anchorRect } = tooltip;
  const top = anchorRect.bottom + 6;
  const left = anchorRect.left;

  return (
    <div
      ref={ref}
      className="fixed z-50"
      style={{ top, left }}
    >
      <SickCommentTooltip date={tooltip.comment.date} comment={tooltip.comment.comment} />
    </div>
  );
}

type GanttRowProps = {
  periods: SickPeriodType[];
  fromDate: Date;
  totalDays: number;
  todayOffset: number;
  onCommentClick: (comment: { date: string; comment: string }, anchor: HTMLElement) => void;
};

function GanttRow({ periods, fromDate, totalDays, todayOffset, onCommentClick }: GanttRowProps) {
  return (
    <div
      className="relative flex-shrink-0"
      style={{ height: `${ROW_HEIGHT}px`, width: `${totalDays * PX_PER_DAY}px` }}
    >
      {/* Today highlight */}
      {todayOffset >= 0 && todayOffset < totalDays && (
        <div
          className="absolute inset-y-0 w-px bg-blue-400/50"
          style={{ left: `${(todayOffset + 0.5) * PX_PER_DAY}px` }}
        />
      )}

      {/* Sick period bars */}
      {periods.map((period, i) => {
        const periodStart = parseDate(period.startDate);
        const offsetDays = diffDays(fromDate, periodStart);
        if (offsetDays >= totalDays) return null;

        const leftPx = Math.max(0, offsetDays) * PX_PER_DAY;

        return (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: `${leftPx}px`, "--px-per-day": `${PX_PER_DAY}px` } as React.CSSProperties}
          >
            <SickPeriod
              startDate={period.startDate}
              endDate={period.endDate ?? undefined}
              title={period.title}
              severityPeriods={period.severityPeriods}
              comments={period.comments}
              pxPerDay={PX_PER_DAY}
              onCommentClick={onCommentClick}
            />
          </div>
        );
      })}
    </div>
  );
}

export function TimelineView() {
  const [daysBack, setDaysBack] = useState<DayRange>(60);
  const [activeTooltip, setActiveTooltip] = useState<ActiveTooltip | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const today = todayInTz();
  const from = shiftDate(today, -(daysBack - 1));

  const membersResult = useMembers();
  const periodsResult = useSickPeriods(from, today);

  const members = membersResult.data ?? [];
  const allPeriods = periodsResult.data?.periods ?? [];
  const loading = membersResult.loading || periodsResult.loading;
  const error = membersResult.error ?? periodsResult.error;

  const fromDate = parseDate(from);
  const toDate = parseDate(today);
  const totalDays = diffDays(fromDate, toDate) + 1;
  const days = buildDays(from, today);
  const todayOffset = diffDays(fromDate, toDate);

  const gridWidth = totalDays * PX_PER_DAY;

  useEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [daysBack, loading]);

  function handleCommentClick(comment: { date: string; comment: string }, anchor: HTMLElement) {
    const rect = anchor.getBoundingClientRect();
    setActiveTooltip((prev) =>
      prev?.comment === comment ? null : { comment, anchorRect: rect }
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="px-4 py-10 space-y-6 max-w-screen-xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">Sickline</p>
            <h1 className="text-2xl font-bold">Timeline</h1>
          </div>

          {/* Date range control */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Show last</span>
            <div className="flex rounded-lg border border-slate-200 bg-white overflow-hidden">
              {DAY_RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setDaysBack(opt)}
                  className={`px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    daysBack === opt
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt}d
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Grid */}
        {loading && <p className="text-slate-500 text-sm">Loading…</p>}

        {error && !loading && (
          <p className="text-red-600 text-sm">Failed to load data: {error.message}</p>
        )}

        {!loading && !error && (
          <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {/* Left label column */}
            <div
              className="flex-shrink-0 border-r border-slate-200 bg-slate-50 z-10"
              style={{ width: `${LABEL_COL_WIDTH}px` }}
            >
              {/* Header spacer matching the day-label row */}
              <div
                className="border-b border-slate-200"
                style={{ height: `${ROW_HEIGHT}px` }}
              />
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center px-3 gap-2 border-b border-slate-100 last:border-b-0"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {member.color && (
                    <span
                      className="h-3 w-3 rounded-full flex-shrink-0"
                      style={{ background: member.color }}
                    />
                  )}
                  <span className="text-sm font-medium text-slate-700 truncate">{member.name}</span>
                </div>
              ))}
            </div>

            {/* Scrollable grid */}
            <div ref={scrollRef} className="overflow-x-auto flex-1">
              <div style={{ width: `${gridWidth}px`, minWidth: "100%" }}>
                {/* Day labels row */}
                <div
                  className="flex border-b border-slate-200 bg-slate-50"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  {days.map((day, i) => {
                    const { num, weekday, isWeekend, isSunday } = dayLabel(day);
                    return (
                      <div
                        key={i}
                        className={`flex-shrink-0 flex flex-col items-center justify-center border-r border-slate-100 last:border-r-0 ${
                          isSunday ? "border-l border-slate-200" : ""
                        } ${isWeekend ? "bg-slate-100/60" : ""}`}
                        style={{ width: `${PX_PER_DAY}px` }}
                      >
                        <span className="text-[10px] font-medium text-slate-400 leading-none">{weekday}</span>
                        <span className={`text-xs font-semibold leading-none mt-0.5 ${isWeekend ? "text-slate-500" : "text-slate-600"}`}>
                          {num}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Member rows */}
                {members.map((member) => {
                  const memberPeriods = allPeriods.filter((p) => p.memberId === member.id);
                  return (
                    <div
                      key={member.id}
                      className="border-b border-slate-100 last:border-b-0 flex"
                    >
                      {/* Day background bands */}
                      <div className="absolute flex" style={{ width: `${gridWidth}px`, height: `${ROW_HEIGHT}px` }}>
                        {days.map((day, i) => {
                          const { isWeekend, isSunday } = dayLabel(day);
                          return (
                            <div
                              key={i}
                              className={`flex-shrink-0 h-full border-r border-slate-50 last:border-r-0 ${
                                isSunday ? "border-l border-slate-100" : ""
                              } ${isWeekend ? "bg-slate-50/80" : ""}`}
                              style={{ width: `${PX_PER_DAY}px` }}
                            />
                          );
                        })}
                      </div>

                      <GanttRow
                        periods={memberPeriods}
                        fromDate={fromDate}
                        totalDays={totalDays}
                        todayOffset={todayOffset}
                        onCommentClick={handleCommentClick}
                      />
                    </div>
                  );
                })}

                {members.length === 0 && (
                  <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
                    No family members configured.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTooltip && (
        <TooltipOverlay tooltip={activeTooltip} onClose={() => setActiveTooltip(null)} />
      )}
    </main>
  );
}
