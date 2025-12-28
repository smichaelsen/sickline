import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { Db } from "../db";

type StatusValue = "green" | "yellow" | "red";

type StatusRecord = {
  id: string;
  member_id: string;
  date: string;
  status: StatusValue;
  title: string | null;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

const DATE_PATTERN = "^\\d{4}-\\d{2}-\\d{2}$";

export async function registerStatusRoutes(app: FastifyInstance, db: Db) {
  const selectByDate = db.prepare(
    `SELECT id, member_id, date, status, title, comment, created_at, updated_at
     FROM daily_status
     WHERE date = ?
     ORDER BY member_id`
  );

  const upsert = db.prepare(
    `INSERT INTO daily_status (id, member_id, date, status, title, comment, created_at, updated_at)
     VALUES (@id, @member_id, @date, @status, @title, @comment, @created_at, @updated_at)
     ON CONFLICT(member_id, date) DO UPDATE SET
       status = excluded.status,
       title = excluded.title,
       comment = excluded.comment,
       updated_at = excluded.updated_at`
  );

  app.get(
    "/api/status",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["date"],
          properties: {
            date: { type: "string", pattern: DATE_PATTERN }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              date: { type: "string" },
              entries: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    memberId: { type: "string" },
                    status: { type: "string", enum: ["green", "yellow", "red"] },
                    title: { type: "string", nullable: true },
                    comment: { type: "string", nullable: true },
                    createdAt: { type: "string" },
                    updatedAt: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request) => {
      const { date } = request.query as { date: string };
      const rows = selectByDate.all(date) as StatusRecord[];
      return {
        date,
        entries: rows.map((row) => ({
          id: row.id,
          memberId: row.member_id,
          status: row.status,
          title: row.title,
          comment: row.comment,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }))
      };
    }
  );

  app.put(
    "/api/status",
    {
      schema: {
        body: {
          type: "object",
          required: ["date", "entries"],
          properties: {
            date: { type: "string", pattern: DATE_PATTERN },
            entries: {
              type: "array",
              items: {
                type: "object",
                required: ["memberId", "status"],
                properties: {
                  memberId: { type: "string" },
                  status: { type: "string", enum: ["green", "yellow", "red"] },
                  title: { type: "string", nullable: true },
                  comment: { type: "string", nullable: true }
                }
              }
            }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              updated: { type: "number" }
            }
          }
        }
      }
    },
    async (request) => {
      const { date, entries } = request.body as {
        date: string;
        entries: Array<{
          memberId: string;
          status: StatusValue;
          title?: string | null;
          comment?: string | null;
        }>;
      };

      let count = 0;
      const now = new Date().toISOString();

      const tx = db.transaction(() => {
        for (const entry of entries) {
          upsert.run({
            id: randomUUID(),
            member_id: entry.memberId,
            date,
            status: entry.status,
            title: entry.title ?? null,
            comment: entry.comment ?? null,
            created_at: now,
            updated_at: now
          });
          count += 1;
        }
      });

      tx();

      return { updated: count };
    }
  );
}
