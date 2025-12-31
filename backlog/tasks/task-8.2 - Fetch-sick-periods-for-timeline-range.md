---
id: task-8.2
title: Fetch sick periods for timeline range
status: To Do
assignee: []
created_date: '2025-12-31 07:19'
updated_date: '2025-12-31 07:20'
labels: []
dependencies: []
parent_task_id: task-8
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the SickTimeline-side data fetching that queries `/api/sick-periods` with a from/to covering the past 8 weeks plus a small buffer so every period intersecting the range is returned (e.g., from one week earlier or simply rely on the API filtering by start/end). Ensure the component stores periods grouped by member and passes them down to the rows.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Timeline data loader requests `/api/sick-periods` with the calculated 8-week window and keeps every period that intersects the window.
- [ ] #2 Fetched periods are grouped by memberId so each row can render only that member's data.
<!-- AC:END -->
