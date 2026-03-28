---
id: task-18.5
title: Timeline screen
status: To Do
assignee: []
created_date: '2026-03-28 07:51'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the Timeline tab: fetches sick periods and renders them as a native Swift Charts Gantt chart with horizontal scrolling, a range picker, and a tap-to-comment detail sheet.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 TimelineViewModel (@Observable) fetches GET /api/timeline for the selected date range (30/60/90 days)
- [ ] #2 TimelineView renders sick periods as BarMark(xStart:xEnd:y:) with foregroundStyle matching member color
- [ ] #3 Chart uses chartScrollableAxes(.horizontal) for native momentum scrolling (iOS 17)
- [ ] #4 Segmented Picker in toolbar for 30/60/90 day range selection; changing range re-fetches data
- [ ] #5 Tapping a bar detects the period via chartOverlay + SpatialTapGesture and presents a sheet with period comments and details
- [ ] #6 Each member row label uses their configured color
- [ ] #7 Loading and error states are handled gracefully in the UI
<!-- AC:END -->
