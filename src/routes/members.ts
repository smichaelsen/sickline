import type { FastifyInstance } from "fastify";
import { loadMembers } from "../config/members.js";

export async function registerMembersRoutes(app: FastifyInstance) {
  app.get(
    "/api/members",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              required: ["id", "name"],
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                color: { type: "string", nullable: true },
                avatar: { type: "string", nullable: true }
              }
            }
          }
        }
      }
    },
    async () => loadMembers()
  );
}
