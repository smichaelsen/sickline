---
id: task-13
title: Extract and test SickPeriod gradient computation
status: Done
assignee: []
created_date: '2026-03-20 20:22'
updated_date: '2026-03-28 09:13'
labels:
  - frontend
dependencies: []
ordinal: 15000
---

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 buildGradient logic is extracted into a standalone, exported pure function
- [x] #2 Unit tests cover: basic single-segment gradient, multi-segment with fade, segment clamped to period bounds, last-segment fill-to-end rule, single-day period using BAR_HEIGHT_PX scale
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Extracted `buildGradient` into `client/src/components/sickPeriodGradient.ts` as a pure exported function
- Moved `SeverityPeriod` type, `severityColor`, `parseDate`, `diffDays`, `FADE_PX`, and `BAR_HEIGHT_PX` into the new module
- `SickPeriod.tsx` re-exports `SeverityPeriod` for backward compatibility and replaces the `useMemo` body with a single `buildGradient(...)` call
- 6 unit tests added in `test/sickPeriodGradient.test.ts` covering all 5 AC scenarios plus the empty-input guard; all 15 tests (new + existing) pass
<!-- SECTION:NOTES:END -->
