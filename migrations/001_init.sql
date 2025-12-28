PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS daily_status (
  id TEXT PRIMARY KEY NOT NULL,
  member_id TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('green', 'yellow', 'red')),
  title TEXT NULL,
  comment TEXT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(member_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_status_member_date ON daily_status(member_id, date);
