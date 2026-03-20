---
id: task-16
title: >-
  Timeline view: scroll to rightmost (most recent) position on load and on time
  range change
status: Done
assignee: []
created_date: '2026-03-20 22:29'
updated_date: '2026-03-20 22:37'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The Timeline/Gantt view should always start scrolled all the way to the right so the most recent data is immediately visible, rather than showing the oldest end of the range.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Timeline is scrolled to the rightmost position when the view first renders
- [x] #2 Timeline scrolls back to the rightmost position whenever the time range (30/60/90 days) is changed
- [x] #3 The user can still scroll freely left after the initial/reset scroll
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Scroll to rightmost position implemented via a `useRef` on the `overflow-x-auto` container and a `useEffect` that sets `scrollLeft = scrollWidth` whenever `daysBack` or `loading` changes.

Validated with Playwright: 60d on load, 30d (fits viewport, no scroll needed), and 90d range switch all correctly land at the rightmost position.
<!-- SECTION:NOTES:END -->
