import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export type Db = Database.Database;

const defaultDbPath = process.env.DB_PATH ?? path.resolve("data/sickline.sqlite");
const migrationsDir = path.resolve("migrations");

export function initDb(): Db {
  ensureDir(path.dirname(defaultDbPath));
  const db = new Database(defaultDbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  runMigrations(db);
  return db;
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runMigrations(db: Db) {
  db.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at TEXT DEFAULT CURRENT_TIMESTAMP
    );`
  );

  if (!fs.existsSync(migrationsDir)) {
    return;
  }

  const rows = db.prepare("SELECT name FROM _migrations").all() as { name: string }[];
  const applied = new Set<string>(rows.map((row) => row.name));

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    const migrate = db.transaction(() => {
      db.exec(sql);
      db.prepare("INSERT INTO _migrations (name) VALUES (?)").run(file);
    });
    migrate();
  }
}
