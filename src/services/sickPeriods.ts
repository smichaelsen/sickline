type StatusValue = "green" | "yellow" | "red";
export type SickStatus = Exclude<StatusValue, "green">;

// TODO: move to runtime configuration
const MAX_GAP_DAYS = 2;
const OPEN_ENDED_WINDOW_DAYS = 2;

export type DailyStatusEntry = {
  memberId: string;
  date: string; // YYYY-MM-DD
  status: StatusValue;
  title?: string | null;
  comment?: string | null;
};

export type SeverityPeriod = {
  startDate: string;
  endDate: string;
  status: SickStatus;
};

export type SickPeriod = {
  memberId: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // missing means open-ended (extends to today)
  status: SickStatus; // current/latest severity for the period
  title: string | null;
  severityPeriods: SeverityPeriod[];
  comments: Array<{ date: string; comment: string }>;
};

type Options = {
  today?: Date | string;
};

/**
 * Translates daily status entries into sick periods (yellow/red only).
 * Rules:
 * - Greens are ignored (healthy = no sick period).
 * - Consecutive entries (including missing days) with the same status + title merge into one period.
 * - Status or title changes, or explicit green entries, break the current period.
 * - The latest yellow/red period extends to today when its last entry is within 2 days of today (openEnded=true).
 */
export function computeSickPeriods(
  entries: DailyStatusEntry[],
  options?: Options
): SickPeriod[] {
  if (!entries.length) return [];

  const today = normalizeToday(options?.today);
  const todayStr = formatDate(today);

  const sorted = [...entries].sort((a, b) => {
    if (a.memberId !== b.memberId) return a.memberId.localeCompare(b.memberId);
    return a.date.localeCompare(b.date);
  });

  const periods: SickPeriod[] = [];
  let currentMember: string | null = null;
  let current: SickPeriod | null = null;
  let lastDate: string | null = null;

  const flush = () => {
    if (current) {
      periods.push(current);
      current = null;
    }
    lastDate = null;
  };

  const addComment = (period: SickPeriod, entry: DailyStatusEntry) => {
    if (entry.comment != null) {
      period.comments.push({ date: entry.date, comment: entry.comment });
    }
  };

  for (const entry of sorted) {
    const normalizedTitle = normalizeTitle(entry.title);
    const gapDays = lastDate ? diffInDays(parseDate(lastDate), parseDate(entry.date)) : 0;

    if (entry.memberId !== currentMember) {
      flush();
      currentMember = entry.memberId;
      lastDate = null;
    }

    if (entry.status === "green") {
      flush();
      continue;
    }

    if (entry.status !== "yellow" && entry.status !== "red") {
      continue;
    }

    if (
      current &&
      current.memberId === entry.memberId &&
      current.title === normalizedTitle &&
      gapDays <= MAX_GAP_DAYS
    ) {
      const lastSeverity = current.severityPeriods[current.severityPeriods.length - 1];

      if (entry.status === lastSeverity.status) {
        // same severity: extend through gap to new date
        lastSeverity.endDate = entry.date;
      } else {
        // different severity within the same period: close previous severity up to the day before new severity starts
        if (gapDays > 1 && lastDate) {
          lastSeverity.endDate = addDays(lastDate, gapDays - 1);
        }
        current.severityPeriods.push({
          startDate: entry.date,
          endDate: entry.date,
          status: entry.status
        });
      }

      current.endDate = entry.date;
      current.status = current.severityPeriods[current.severityPeriods.length - 1].status;
      addComment(current, entry);
      lastDate = entry.date;
      continue;
    }

    flush();
    current = {
      memberId: entry.memberId,
      status: entry.status,
      title: normalizedTitle,
      startDate: entry.date,
      endDate: entry.date,
      severityPeriods: [
        {
          startDate: entry.date,
          endDate: entry.date,
          status: entry.status
        }
      ],
      comments: []
    };
    addComment(current, entry);
    lastDate = entry.date;
  }

  flush();

  const byMember = new Map<string, SickPeriod[]>();
  for (const period of periods) {
    const list = byMember.get(period.memberId) ?? [];
    list.push(period);
    byMember.set(period.memberId, list);
  }

  for (const list of byMember.values()) {
    const last = list[list.length - 1];
    if (!last) continue;
    const endAnchor = last.endDate ?? last.startDate;
    const lastEnd = parseDate(endAnchor);
    if (diffInDays(lastEnd, today) <= OPEN_ENDED_WINDOW_DAYS) {
      last.endDate = undefined;
      const lastSeverity = last.severityPeriods[last.severityPeriods.length - 1];
      lastSeverity.endDate = todayStr;
      last.status = lastSeverity.status;
    }
  }

  return periods;
}

export function parseDate(date: string): Date {
  const [year, month, day] = date.split("-").map((v) => Number.parseInt(v, 10));
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function diffInDays(a: Date, b: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

function addDays(date: string, days: number): string {
  const d = parseDate(date);
  d.setUTCDate(d.getUTCDate() + days);
  return formatDate(d);
}

function normalizeToday(value?: Date | string): Date {
  if (!value) return todayUtc();
  if (typeof value === "string") return parseDate(value);
  return truncateToUtc(value);
}

function todayUtc(): Date {
  const now = new Date();
  return truncateToUtc(now);
}

function truncateToUtc(date: Date): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function normalizeTitle(title?: string | null): string | null {
  const normalized = title?.trim();
  return normalized ? normalized : null;
}
