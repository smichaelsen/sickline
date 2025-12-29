import fastifyStatic from "@fastify/static";
import Fastify from "fastify";
import fs from "node:fs";
import path from "node:path";
import { initDb } from "./db.js";
import { registerMembersRoutes } from "./routes/members.js";
import { registerStatusRoutes } from "./routes/status.js";
import { registerSickPeriodsRoutes } from "./routes/sick-periods.js";

async function buildApp() {
  const app = Fastify({ logger: true });

  const db = initDb();
  app.decorate("db", db);

  const staticRoot = path.resolve("dist/client");
  const hasStatic = fs.existsSync(staticRoot);

  if (hasStatic) {
    app.register(fastifyStatic, {
      root: staticRoot,
      prefix: "/"
    });
    app.setNotFoundHandler((request, reply) => {
      const wantsHtml = request.headers.accept?.includes("text/html");
      if (wantsHtml && request.method === "GET") {
        return reply.sendFile("index.html");
      }
      return reply.status(404).send({ error: "Not Found" });
    });
  } else {
    app.log.warn(
      `Static assets not found at ${staticRoot}. Build the client before running in production.`
    );
  }

  app.get("/health", async () => ({ status: "ok" }));

  await registerMembersRoutes(app);
  await registerStatusRoutes(app, db);
  await registerSickPeriodsRoutes(app, db);

  return app;
}

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "0.0.0.0";

buildApp()
  .then((app) =>
    app
      .listen({ port, host })
      .then(() => {
        app.log.info(`Server listening on http://${host}:${port}`);
      })
      .catch((err) => {
        app.log.error(err, "Server failed to start");
        process.exit(1);
      })
  )
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize app", err);
    process.exit(1);
  });
