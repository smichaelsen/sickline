---
id: task-10
title: Timeline / Gantt view
status: To Do
assignee: []
created_date: '2026-03-20 14:07'
labels:
  - frontend
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The second core screen. Shows sick periods across all family members on a scrollable calendar grid, using the existing SickPeriod and SickCommentTooltip components.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 One row per family member, loaded from GET /api/members
- [ ] #2 X-axis represents calendar days; grid is horizontally scrollable
- [ ] #3 Sick periods rendered using the SickPeriod component from GET /api/sick-periods
- [ ] #4 Comment dots shown on periods that have comments; clicking/hovering opens SickCommentTooltip
- [ ] #5 Date range defaults to the last 60 days with a control to adjust it
<!-- AC:END -->
