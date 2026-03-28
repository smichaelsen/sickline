---
id: task-8
title: API client layer & data-fetching hooks
status: Done
assignee: []
created_date: '2026-03-20 14:06'
updated_date: '2026-03-28 09:13'
labels:
  - frontend
dependencies: []
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Before building the frontend screens, we need typed wrappers around all API endpoints to keep the UI layer clean and consistent.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 TypeScript types defined for all API response shapes (Member, DailyStatus, SickPeriod, etc.)
- [x] #2 Fetch utility/hook for GET /api/members
- [x] #3 Fetch utility/hook for GET /api/status?date=
- [x] #4 Fetch utility/hook for PUT /api/status (upsert)
- [x] #5 Fetch utility/hook for GET /api/sick-periods?from=&to=
- [x] #6 Loading and error states handled consistently across hooks
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create client/src/api/types.ts — shared TypeScript types for all API shapes
2. Create client/src/api/client.ts — base fetch utility with error handling
3. Create client/src/api/useMembers.ts — hook for GET /api/members
4. Create client/src/api/useStatus.ts — hook for GET /api/status?date=
5. Create client/src/api/useUpsertStatus.ts — hook for PUT /api/status (mutation)
6. Create client/src/api/useSickPeriods.ts — hook for GET /api/sick-periods?from=&to=
7. Export all from client/src/api/index.ts
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Created client/src/api/ with types.ts, client.ts, and four hooks
- All hooks share a consistent { data, loading, error } shape; useUpsertStatus adds a mutate() function
- Cancellation via AbortController pattern (cancelled flag) prevents stale state on unmount
- Fixed pre-existing tsconfig.json issue: added module/moduleResolution overrides (ESNext/bundler) so Vite client code does not require .js extensions — existing files (App.tsx, stories) had the same latent error
- No new runtime dependencies added
<!-- SECTION:NOTES:END -->
