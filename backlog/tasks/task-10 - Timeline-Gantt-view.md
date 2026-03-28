---
id: task-10
title: Timeline / Gantt view
status: Done
assignee: []
created_date: '2026-03-20 14:07'
updated_date: '2026-03-28 09:13'
labels:
  - frontend
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The second core screen. Shows sick periods across all family members on a scrollable calendar grid, using the existing SickPeriod and SickCommentTooltip components.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 One row per family member, loaded from GET /api/members
- [x] #2 X-axis represents calendar days; grid is horizontally scrollable
- [x] #3 Sick periods rendered using the SickPeriod component from GET /api/sick-periods
- [x] #4 Comment dots shown on periods that have comments; clicking/hovering opens SickCommentTooltip
- [x] #5 Date range defaults to the last 60 days with a control to adjust it
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Modify SickPeriod: make comment dots interactive (onCommentClick callback, dots become buttons)
2. Create TimelineView component: Gantt grid with member rows, day labels, sick period bars positioned by date offset
3. Tooltip management: floating SickCommentTooltip anchored to clicked dot, dismiss on outside click
4. Update App.tsx: tab navigation between Daily Health Check and Timeline
5. Create TimelineView.stories.tsx with static mock stories
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Created TimelineView component: Gantt grid with fixed member label column and horizontally scrollable day grid
- Modified SickPeriod to accept onCommentClick callback; comment marker dots become interactive buttons when callback is provided
- Tooltip rendered in a floating overlay anchored to the clicked marker dot, dismissed on outside click
- Date range control: 30d/60d/90d toggle buttons, defaults to 60 days
- Today highlighted with a blue vertical line in each member row
- Weekend columns visually differentiated with subtle background
- Tab navigation added to App.tsx between Daily check and Timeline screens
- TimelineView.stories.tsx: WithData, Loading, Empty, SingleMember stories (all using static mock data, no API calls)
<!-- SECTION:NOTES:END -->
