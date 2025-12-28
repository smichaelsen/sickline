# Sickline – Technical Concept

## Context and goals
- Internal family health tracker for a single household (6 people), low data volume (hundreds of records), self-hosted on this server behind Traefik.
- Simple, maintainable, flexible for future features; accessibility/SEO not critical; no reminders/analytics/exports for MVP.
- Authentication: HTTP Basic only (can be enforced at Traefik with middleware; app can also enforce as fallback).

## Proposed stack (lean, extensible)
- Backend API: Fastify (Node.js) with REST endpoints; request/response validation via Fastify JSON Schema.
- Persistence: SQLite (file-based, WAL enabled) using `better-sqlite3` with simple SQL migrations executed on boot; mounted volume for durability and backups.
- Frontend: React + Vite + Tailwind CSS; data fetching via lightweight fetch/SWR-style hooks; date-fns for date ops; lightweight timeline rendering via SVG/canvas (e.g., visx) or a minimal custom renderer.
- Auth: HTTP Basic at Traefik (preferred) with shared credentials stored as secrets; optional in-app basic auth middleware if desired.
- Containerization: Single Docker image containing API + static SPA served by the Fastify app; exposed through Traefik router.
- Testing: Vitest for units; Playwright smoke for main flows (optional later).
- Component development: Storybook with hot reload (or similar component gallery) for React components, used to build reusable UI pieces and run automated tests against them.

## Data model
- `familyMembers` (configuration file, JSON or env-provided): `id`, `name`, optional `color`/`avatar`. Loaded at startup; minimal admin surface.
- `daily_status` table:
  - `id` (uuid), `member_id` (FK to config id), `date` (date, unique per member), `status` (enum: green|yellow|red), `title` (string, nullable), `comment` (string, nullable), `created_at`, `updated_at`.
  - Unique constraint on `(member_id, date)`.
- Derived view (API-level): sequences of consecutive days per member with same `title` and `status` to support timeline merging.

## Core MVP features
- Daily health check screen (defaulting to yesterday):
  - Preselect yesterday’s status and title for each member; comment empty by default.
  - Adjust status (traffic light), optional title/comment; save for the selected day.
  - Navigate to past days to view/edit historical entries.
- Timeline view (Gantt-like):
  - One row per member; x-axis as calendar days.
  - Consecutive days with the same title render as a single bar labeled with the title; bar color reflects status (yellow/red; green optionally omitted/transparent to emphasize illness periods).
  - Days with comments show a dot marker; clicking reveals tooltip with comment.
- Family members setup: provided via JSON config file loaded on boot (no UI CRUD in MVP).

## API sketch
- `GET /api/members` → list configured members.
- `GET /api/status?date=YYYY-MM-DD` → daily statuses for all members (with prefill defaults from previous day when empty).
- `PUT /api/status` → upsert statuses for a day (payload: date, array of {memberId, status, title?, comment?}).
- `GET /api/timeline?from=YYYY-MM-DD&to=YYYY-MM-DD` → merged segments per member for rendering.

## Auth & security
- Enforce HTTP Basic at Traefik (recommended) with IP rate limiting; proxy only HTTPS.
- If in-app basic auth is added, require it on all `/api` and SPA routes; short-circuit unauthorized.
- No multi-tenant/accounts; single shared dataset.

## Deployment
- Docker image: Node 20-alpine, installs deps, builds Vite frontend, serves static assets + API via Fastify on one port.
- Volumes: `/data/sickline.sqlite` (database), `/config/members.json` (family config).
- Traefik: router to app container, basic auth middleware, TLS, healthcheck endpoint (`/health`).

## Future extensions (not in MVP)
- Reminders (email/push), CSV export, richer analytics, multi-family support, user roles, audit trails, offline-capable PWA, calendar (ICS) exports.
