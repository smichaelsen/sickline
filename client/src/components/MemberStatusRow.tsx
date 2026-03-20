import clsx from "clsx";
import type { StatusValue } from "../api/types";

export type MemberRowState = {
  status: StatusValue;
  title: string;
  comment: string;
};

type Props = {
  name: string;
  color?: string | null;
  value: MemberRowState;
  onChange: (next: MemberRowState) => void;
};

const LIGHTS: { value: StatusValue; label: string; bg: string; ring: string }[] = [
  { value: "green",  label: "Healthy",  bg: "bg-green-500",  ring: "ring-green-600" },
  { value: "yellow", label: "Unwell",   bg: "bg-yellow-400", ring: "ring-yellow-500" },
  { value: "red",    label: "Sick",     bg: "bg-red-500",    ring: "ring-red-600" },
];

export function MemberStatusRow({ name, color, value, onChange }: Props) {
  function set<K extends keyof MemberRowState>(key: K, val: MemberRowState[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      {/* Header: name + traffic light on same row */}
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color ?? "#94a3b8" }}
        />
        <span className="font-semibold text-slate-800 flex-1">{name}</span>
        <div className="flex gap-1.5">
          {LIGHTS.map((light) => {
            const selected = value.status === light.value;
            return (
              <button
                key={light.value}
                type="button"
                title={light.label}
                onClick={() => set("status", light.value)}
                className={clsx(
                  "h-6 w-6 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1",
                  light.bg,
                  light.ring,
                  selected
                    ? "ring-2 ring-offset-1 scale-110 shadow-md"
                    : "opacity-35 hover:opacity-65"
                )}
                aria-pressed={selected}
                aria-label={light.label}
              />
            );
          })}
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Title (optional)"
        value={value.title}
        onChange={(e) => set("title", e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Comment */}
      <textarea
        placeholder="Comment (optional)"
        value={value.comment}
        onChange={(e) => set("comment", e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
    </div>
  );
}
