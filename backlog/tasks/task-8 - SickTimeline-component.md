---
id: task-8
title: SickTimeline component
status: In Progress
assignee:
  - '@myself'
created_date: '2025-12-31 07:05'
updated_date: '2025-12-31 07:23'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add a SickTimeline component that renders a horizontal timeline showing an 8-week window of sick-period data per member (one row per entry in src/config/members.ts). The component should render SickPeriod rows, fetch the data relevant for the date range, show a date-range reflector for the past 8 weeks, keep the view scrolled right to today/the latest day with a solid black vertical line marking today, and allow the client-side SickCommentTooltip to open/close when users click the comment dots. The sick-period API must supply every period intersecting the visible range (e.g., a period starting just before the 8-week window is included fully so hover can reveal its actual start), and the SickPeriod component should honor a new boolean `truncated` prop to render periods that extend beyond the left edge with unrounded corners and a truncated start indicator.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Each member defined in src/config/members.ts has its own horizontal row that renders the past 8 weeks of sick periods via client/src/components/SickPeriod.tsx components.
- [ ] #2 Sick-period data for the displayed date range is fetched and passed to the SickPeriod components, and the timeline always starts scrolled to the right to reveal today or the latest available day.
- [ ] #3 Clicking a SickPeriod comment dot opens SickCommentTooltip and clicking again or elsewhere closes it so comment tooltips match user interaction.
- [ ] #4 Today stays marked with a solid black vertical line through the chart and the timeline area is smoothly scrollable on both desktop and mobile screens.
- [ ] #5 A date range reflector shows the past 8 weeks, with an explicit note that the date selector will come later.

- [ ] #6 Sick-period API returns every period that intersects the 8-week window so the visible timeline can render truncated bars while hover displays their actual start/end dates.
- [ ] #7 SickPeriod accepts a boolean `truncated` prop that disables left-corner rounding so bars clipped by the date range look explicitly truncated.
<!-- AC:END -->
