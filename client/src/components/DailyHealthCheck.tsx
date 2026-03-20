import { useEffect, useState } from "react";
import { useMembers } from "../api/useMembers";
import { useStatus } from "../api/useStatus";
import { useUpsertStatus } from "../api/useUpsertStatus";
import { yesterdayInTz } from "../config";
import { shiftDate } from "../dateUtils";
import { MemberStatusRow, type MemberRowState } from "./MemberStatusRow";
import type { Member, StatusEntry } from "../api/types";

type FormState = Record<string, MemberRowState>;

function defaultRow(): MemberRowState {
  return { status: "green", title: "", comment: "" };
}

function entryToRow(entry: StatusEntry): MemberRowState {
  return {
    status: entry.status,
    title: entry.title ?? "",
    comment: entry.comment ?? "",
  };
}

function buildInitialForm(
  members: Member[],
  todayEntries: StatusEntry[],
  prevEntries: StatusEntry[]
): FormState {
  const todayMap = Object.fromEntries(todayEntries.map((e) => [e.memberId, e]));
  const prevMap = Object.fromEntries(prevEntries.map((e) => [e.memberId, e]));

  return Object.fromEntries(
    members.map((m) => {
      if (todayMap[m.id]) {
        return [m.id, entryToRow(todayMap[m.id])];
      }
      if (prevMap[m.id]) {
        // AC#5: prefill status + title from previous day; AC#6: comment stays empty
        return [
          m.id,
          {
            status: prevMap[m.id].status,
            title: prevMap[m.id].title ?? "",
            comment: "",
          },
        ];
      }
      return [m.id, defaultRow()];
    })
  );
}

export function DailyHealthCheck() {
  const [date, setDate] = useState<string>(yesterdayInTz);

  const members = useMembers();
  const currentStatus = useStatus(date);
  const prevStatus = useStatus(shiftDate(date, -1));
  const upsert = useUpsertStatus();

  const [form, setForm] = useState<FormState>({});
  const [saved, setSaved] = useState(false);

  // Re-initialise form whenever date or fetched data changes
  useEffect(() => {
    if (!members.data || currentStatus.loading || prevStatus.loading) return;

    setForm(
      buildInitialForm(
        members.data,
        currentStatus.data?.entries ?? [],
        prevStatus.data?.entries ?? []
      )
    );
    setSaved(false);
  }, [
    members.data,
    currentStatus.data,
    currentStatus.loading,
    prevStatus.data,
    prevStatus.loading,
  ]);

  function updateRow(memberId: string, next: MemberRowState) {
    setSaved(false);
    setForm((prev) => ({ ...prev, [memberId]: next }));
  }

  async function handleSave() {
    if (!members.data) return;
    await upsert.mutate({
      date,
      entries: members.data.map((m) => ({
        memberId: m.id,
        status: form[m.id]?.status ?? "green",
        title: form[m.id]?.title || null,
        comment: form[m.id]?.comment || null,
      })),
    });
    setSaved(true);
  }

  const loading = members.loading || currentStatus.loading || prevStatus.loading;
  const membersReady = !members.loading && !members.error;
  const noMembers = membersReady && (members.data?.length ?? 0) === 0;
  const statusError = currentStatus.error ?? prevStatus.error;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-10 space-y-6">
        {/* Header */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">
            Sickline
          </p>
          <h1 className="text-2xl font-bold">Daily health check</h1>
        </header>

        {/* Date navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setDate((d) => shiftDate(d, -1))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Previous day"
          >
            ‹
          </button>
          <span className="flex-1 text-center font-semibold text-slate-700">
            {new Date(`${date}T12:00:00Z`).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <button
            type="button"
            onClick={() => setDate((d) => shiftDate(d, 1))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-label="Next day"
          >
            ›
          </button>
        </div>

        {/* Content */}
        {members.loading && (
          <p className="text-slate-500 text-sm">Loading…</p>
        )}

        {(members.error || noMembers) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 space-y-2">
            <p className="font-semibold text-amber-800">No family members configured</p>
            <p className="text-sm text-amber-700">
              Create <code className="font-mono bg-amber-100 px-1 rounded">config/members.json</code> to get started.
              You can use the sample as a template:
            </p>
            <pre className="text-xs bg-white border border-amber-200 rounded-lg p-3 overflow-x-auto text-slate-700">{`cp config/members.sample.json config/members.json`}</pre>
            <p className="text-xs text-amber-600">Then restart the server.</p>
          </div>
        )}

        {statusError && !members.error && !noMembers && (
          <p className="text-red-600 text-sm">
            Failed to load status data: {statusError.message}
          </p>
        )}

        {!loading && !members.error && !noMembers && members.data && (
          <>
            <div className="space-y-3">
              {members.data.map((member) => (
                <MemberStatusRow
                  key={member.id}
                  name={member.name}
                  color={member.color}
                  value={form[member.id] ?? defaultRow()}
                  onChange={(next) => updateRow(member.id, next)}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={upsert.loading}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                {upsert.loading ? "Saving…" : "Save"}
              </button>
              {saved && (
                <span className="text-sm text-green-600 font-medium">Saved</span>
              )}
              {upsert.error && (
                <span className="text-sm text-red-600">
                  Save failed: {upsert.error.message}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
