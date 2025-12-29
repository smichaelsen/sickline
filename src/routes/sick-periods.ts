import type { FastifyInstance } from "fastify";
import type { Db } from "../db.js";
import { computeSickPeriods, parseDate, type DailyStatusEntry, type SickPeriod } from "../services/sickPeriods.js";

const DATE_PATTERN = "^\\d{4}-\\d{2}-\\d{2}$";

type DailyStatusRow = DailyStatusEntry;

export async function registerSickPeriodsRoutes(app: FastifyInstance, db: Db) {
  const selectAll = db.prepare(
    `SELECT member_id as memberId, date, status, title, comment
     FROM daily_status
     ORDER BY member_id, date`
  );

  app.get(
    "/api/sick-periods",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            from: { type: "string", pattern: DATE_PATTERN },
            to: { type: "string", pattern: DATE_PATTERN }
          },
          additionalProperties: false
        },
        response: {
          200: {
            type: "object",
            properties: {
              periods: {
                type: "array",
                items: {
                  type: "object",
                  required: [
                    "memberId",
                    "startDate",
                    "status",
                    "severityPeriods",
                    "comments"
                  ],
                  properties: {
                    memberId: { type: "string" },
                    startDate: { type: "string" },
                    endDate: { type: "string", nullable: true },
                    status: { type: "string", enum: ["yellow", "red"] },
                    title: { type: "string", nullable: true },
                    severityPeriods: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["startDate", "endDate", "status"],
                        properties: {
                          startDate: { type: "string" },
                          endDate: { type: "string" },
                          status: { type: "string", enum: ["yellow", "red"] }
                        }
                      }
                    },
                    comments: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["date", "comment"],
                        properties: {
                          date: { type: "string" },
                          comment: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request) => {
      const { from, to } = request.query as { from?: string; to?: string };
      const rows = selectAll.all() as DailyStatusRow[];
      const periods = computeSickPeriods(rows, { today: new Date() });
      const filtered = filterByRange(periods, from, to);
      return { periods: filtered };
    }
  );
}

function filterByRange(periods: SickPeriod[], from?: string, to?: string): SickPeriod[] {
  if (!from && !to) return periods;

  const fromDate = from ? parseDate(from) : null;
  const toDate = to ? parseDate(to) : null;
  const todayStr = new Date().toISOString().slice(0, 10);
  const today = parseDate(todayStr);

  return periods.filter((period) => {
    const start = parseDate(period.startDate);
    const end = period.endDate ? parseDate(period.endDate) : today;
    if (fromDate && end < fromDate) return false;
    if (toDate && start > toDate) return false;
    return true;
  });
}
