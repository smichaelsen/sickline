---
id: task-2
title: Build SickPeriod component and Storybook stories
status: Done
assignee:
  - '@assistant'
created_date: '2025-12-28 18:17'
updated_date: '2025-12-28 18:25'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create a SickPeriod UI component to render a single sick period bar (used in a future timeline). It should render as a horizontal bar with rounded edges (no rounding on the right for open-ended periods), colored by severity (yellow/red) with short gradients when severity changes within the period. Title is bold and centered if present. Comments should render as dots aligned to their specific days. Component should honor a CSS custom property for pixels-per-day with a sensible default.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Implement SickPeriod component rendering a horizontal bar with rounded edges, except the right edge stays square for open-ended periods.
- [x] #2 Color the bar per severity (yellow/red) and render short gradients at severity change points within a single period.
- [x] #3 Display title bold and centered when provided.
- [x] #4 Render comment indicators as dots positioned per comment date within the period based on pixels-per-day scale (with a default custom property value and inherited override).
- [x] #5 Add Storybook stories covering red, yellow, mixed severityPeriods with gradients, open-ended shape, and comments markers.
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Define SickPeriod component API (start/end, severityPeriods, comments, title, open-ended) and derive layout math (days -> px) with CSS custom property fallback.
2. Implement rendering: bar with conditional right rounding for open-ended, severity color segments with small gradients at changes, title centered/bold, comment dots positioned by day.
3. Wire CSS variable default and width calculations; handle open-ended endDate optional.
4. Add Storybook stories: red, yellow, mixed severity with gradients, open-ended, comments markers.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added SickPeriod component rendering horizontal bar with rounded left edge and square right edge when open-ended, using CSS var --px-per-day (default 16px) for sizing.
- Severity colors (yellow/red) with gradient transitions across severityPeriods; title centered/bold; comments shown as per-day dots.
- Storybook stories: red, yellow, mixed severities with gradients, open-ended, and comments markers.
<!-- SECTION:NOTES:END -->
