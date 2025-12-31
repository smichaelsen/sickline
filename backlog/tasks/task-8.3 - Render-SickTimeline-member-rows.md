---
id: task-8.3
title: Render SickTimeline member rows
status: To Do
assignee: []
created_date: '2025-12-31 07:21'
labels: []
dependencies: []
parent_task_id: task-8
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Once SickPeriod can show truncated bars (task-8.1) and the 8-week data loader exists (task-8.2), implement the SickTimeline rows: one row per entry from src/config/members.ts with its fetched periods rendered via SickPeriod components. Use the grouped data producer to supply only that member's periods, flag the ones starting before the window as , and ensure placements line up with the 8-week date scale.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Every member from src/config/members.ts has a dedicated row that renders only that member's periods via SickPeriod.
- [ ] #2 Periods whose start date lies before the 8-week window are passed with  so they draw without left rounding.
- [ ] #3 Rows align with the 8-week date scale so horizontal positions match actual dates, preparing the ground for the scrolling/marker layer.
<!-- AC:END -->
