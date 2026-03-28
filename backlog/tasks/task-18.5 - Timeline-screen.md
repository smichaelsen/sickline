---
id: task-18.5
title: Timeline screen
status: Done
assignee: []
created_date: '2026-03-28 07:51'
updated_date: '2026-03-28 09:13'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: medium
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the Timeline tab: fetches sick periods and renders them as a native Swift Charts Gantt chart with horizontal scrolling, a range picker, and a tap-to-comment detail sheet.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 TimelineViewModel (@Observable) fetches GET /api/timeline for the selected date range (30/60/90 days)
- [x] #2 TimelineView renders sick periods as BarMark(xStart:xEnd:y:) with foregroundStyle matching member color
- [x] #3 Chart uses chartScrollableAxes(.horizontal) for native momentum scrolling (iOS 17)
- [x] #4 Segmented Picker in toolbar for 30/60/90 day range selection; changing range re-fetches data
- [x] #5 Tapping a bar detects the period via chartOverlay + SpatialTapGesture and presents a sheet with period comments and details
- [x] #6 Each member row label uses their configured color
- [x] #7 Loading and error states are handled gracefully in the UI
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create TimelineViewModel (@Observable) — fetch members + sick periods, range picker state, selected period for sheet
2. Create TimelineView — lazy VM pattern, NavigationStack, Chart with BarMark, chartOverlay tap detection, sheet
3. Create PeriodDetailSheet — title, date range, status, comments list
4. Wire TimelineView into SicklineApp.swift TabView
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- TimelineViewModel (@Observable): fetches /api/members + /api/sick-periods?from=&to= for selected day range (30/60/90)
- SickPeriodsResponse wrapper struct decodes { periods: [...] } response shape
- TimelineView uses same lazy-VM outer shell pattern as DailyCheckView to avoid URLError.cancelled
- Chart uses BarMark(xStart:xEnd:y:) with date x-axis and member name y-axis
- Severity sub-periods rendered as color-coded sub-bars when present; falls back to overall status color
- chartScrollableAxes(.horizontal) for native iOS 17 momentum scrolling
- chartXScale clamps visible domain to rangeStart...today; bars outside window are clipped to range
- chartOverlay + onTapGesture detects tapped bar via proxy.value(atX:) / proxy.value(atY:) coordinate lookup
- PeriodDetailSheet: member name (in color), date range, status, title, chronological comments list
- Segmented Picker in toolbar (30/60/90d); .task(id: vm.dayRange) re-fetches on change
- ContentUnavailableView shown when no sick periods exist for the selected range
- Y-axis labels rendered in member color via custom AxisMarks

- Fixed Config actor-isolation warnings by injecting baseURL/authHeader into APIClient init (accessed from @MainActor SicklineApp)
- chartScrollPosition(initialX:) used instead of binding to avoid Metal rendering errors
- simultaneousGesture for tap detection preserves chartScrollableAxes pan gesture
- RuleMark anchors force all members onto y-axis regardless of sick period data
<!-- SECTION:NOTES:END -->
