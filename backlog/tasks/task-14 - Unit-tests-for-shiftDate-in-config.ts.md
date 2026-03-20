---
id: task-14
title: Unit tests for shiftDate in config.ts
status: Done
assignee: []
created_date: '2026-03-20 20:22'
updated_date: '2026-03-20 20:46'
labels:
  - frontend
dependencies: []
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 shiftDate tested for positive and negative offsets
- [x] #2 shiftDate tested across a DST boundary to verify the noon-UTC anchor prevents off-by-one errors
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Move shiftDate to client/src/dateUtils.ts (no import.meta.env dependency)
2. Remove shiftDate from config.ts
3. Update DailyHealthCheck.tsx and TimelineView.tsx imports
4. Write test/shiftDate.test.ts with positive, negative, and DST-boundary cases
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Moved `shiftDate` from `config.ts` to `client/src/dateUtils.ts` to eliminate the `import.meta.env` dependency that blocks Node-based testing
- Updated `DailyHealthCheck.tsx` and `TimelineView.tsx` to import from `../dateUtils`
- Added `test/shiftDate.test.ts` with 5 tests: positive offset, negative offset, zero offset, EU spring-forward DST boundary (2024-03-31), EU autumn fallback DST boundary (2024-10-27)
- All 20 tests (5 new + 15 existing) pass
<!-- SECTION:NOTES:END -->
