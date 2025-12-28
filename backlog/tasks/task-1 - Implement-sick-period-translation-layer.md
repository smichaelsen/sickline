---
id: task-1
title: Implement sick-period translation layer
status: Done
assignee:
  - '@assistant'
created_date: '2025-12-28 15:56'
updated_date: '2025-12-28 16:54'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Build the translation layer between per-day health entries and sick-period API responses, including defining the initial DB schema for daily sick data and the API schema for sick periods. This layer merges yellow/red streaks (with gap handling) into periods for the client and leaves greens implicit (healthy = no period). Apply the 2-day open-ended rule for the latest yellow/red entry.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Define sick-period data shape for API responses (fields like memberId, startDate, endDate, status, title?, segments/comments if needed) and keep greens implicit (no period).
- [x] #2 Implement conversion logic from daily_status rows to sick periods, merging consecutive (or gap-bridged) yellow/red days with same status/title and applying the 2-day open-ended rule for the latest period.
- [x] #3 Add unit tests covering single/merged periods, gaps of 1-2 days vs >2 days, title/status changes, green-only days, and the open-ended extension to today.
- [x] #4 Document the behavior/edge cases in code or a short note for API consumers (based on the concept) without adding an implementation plan.

- [x] #5 Define initial DB schema for storing daily health entries relevant to sick periods (fields, enums, constraints) and an API schema for sick periods that the client will consume.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Finalize DB schema for daily_status (member_id, date, status enum green|yellow|red, title?, comment?, created_at/updated_at, unique member+date) aligned with concept and migration scaffold.
2. Define sick-period API schema (OpenAPI component) with fields like memberId, startDate, endDate, status (yellow|red), title?, comments presence, openEnded flag when extended to today, etc., ensuring greens stay implicit.
3. Implement translation logic that ingests daily entries per member sorted by date, merges consecutive (including missing-day bridges when status/title match) yellow/red entries into periods, splits on status/title changes, ignores greens, and applies the 2-day open-ended extension rule to the latest yellow/red entry.
4. Add unit tests covering single and multiple members, missing-day bridging vs >2-day gaps, status/title changes, all-green data yielding no periods, and open-ended extension scenarios.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added sick-period translation service producing severityPeriods within each sick period (non-overlapping, contiguous, covering the period), merging yellow/red under same title even across gaps; greens break periods; title change splits.
- GET /api/sick-periods returns {memberId,startDate,endDate,status,title?,openEnded,severityPeriods[]} schema; status reflects current/latest severity, and last segment extends to today when last sick entry is within 2 days.
- Tests: npm test (tsx test/sickPeriods.test.ts) covering merges, splits, green breaks, open-ended, and mixed severities with gap fill.

- Added gap handling: gaps >2 days split sick periods; <=2 days stay in same period with filled severity spans; title changes or nulls split periods.
- Expanded tests to cover >2-day gaps, title-to-null/title changes, stale periods not open-ended, and mixed severities coverage.
<!-- SECTION:NOTES:END -->
