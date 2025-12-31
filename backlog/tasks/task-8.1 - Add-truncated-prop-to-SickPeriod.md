---
id: task-8.1
title: Add truncated prop to SickPeriod
status: Done
assignee:
  - '@myself'
created_date: '2025-12-31 07:19'
updated_date: '2025-12-31 07:55'
labels: []
dependencies: []
parent_task_id: task-8
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Allow SickPeriod to render a truncated bar when the displayed range cuts off its start. Introduce a boolean  prop that disables left-corner rounding and ensures hover still shows the actual start date. This will let the SickTimeline paint truncated periods for entries that began before the 8-week window.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 SickPeriod accepts a  boolean that, when true, removes left rounding so the bar looks clipped.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Extend `SickPeriodProps` with an optional `truncated` boolean, defaulting to false so rows can flag bars that start before the visible window.
2. Build the gradient/bar CSS class list so that when `truncated` is true we drop left-side rounding while preserving the existing ending logic for open-ended bars.
3. Keep the existing gradient/marker positioning intact so truncated bars still show severity and comments correctly, then verify the prop is forwarded from the SickTimeline rows.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added optional  prop to , defaulting to false, so callers can signal that the bar should be clipped when its start is outside the visible range.\n- Left rounding and ending styles now depend on the new prop while gradients/markers remain untouched so truncation only affects the cap visuals.\n
<!-- SECTION:NOTES:END -->
