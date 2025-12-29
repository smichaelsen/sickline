import React from "react";

export type SickCommentTooltipProps = {
  date: string;
  comment: string;
};

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
});

function formatTooltipDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return formatter.format(parsed);
}

export function SickCommentTooltip({ date, comment }: SickCommentTooltipProps) {
  return (
    <div className="inline-flex w-full max-w-xs flex-col gap-1 rounded-lg border border-slate-200 bg-white/95 p-3 text-sm text-slate-900 shadow-lg ring-1 ring-slate-900/10 backdrop-blur">
      <time className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {formatTooltipDate(date)}
      </time>
      <p className="text-sm leading-relaxed text-slate-900">
        {comment.split(/\r?\n/).map((line, index, arr) => (
          <React.Fragment key={index}>
            {line}
            {index < arr.length - 1 ? <br /> : null}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
