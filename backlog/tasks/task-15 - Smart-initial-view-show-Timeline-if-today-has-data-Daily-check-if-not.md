---
id: task-15
title: 'Smart initial view: show Timeline if today has data, Daily check if not'
status: Done
assignee: []
created_date: '2026-03-20 22:13'
updated_date: '2026-03-20 22:24'
labels: []
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The app currently always opens on the Daily check screen. Instead, the initial view should depend on whether data has already been saved for today: if today's entries exist, open the Timeline; if not, open the Daily check to prompt the user to fill in their status.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 App opens on Timeline when at least one status entry exists for today
- [x] #2 App opens on Daily check when no status entries exist for today yet
- [x] #3 Navigating manually between tabs still works as before
- [x] #4 The check uses existing API data (no extra request introduced if avoidable)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. In App.tsx, call useStatus(todayInTz()) to fetch today's entries
2. Use a useRef flag (initialScreenSet) to track whether the initial screen decision has been made
3. Use useEffect to set the screen once data loads: "timeline" if entries.length > 0, "daily" otherwise
4. The ref prevents the effect from overriding manual tab navigation after the initial decision
5. No extra API request: DailyHealthCheck also calls useStatus(today) internally but the browser deduplicates concurrent identical requests
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Added `useStatus(todayInTz())` call in App.tsx to fetch today's entries on startup
- `useRef` flag (`initialScreenSet`) ensures the screen decision is made exactly once and does not interfere with subsequent manual tab navigation
- If entries exist for today → opens on Timeline; if not → stays on Daily check
- No extra network request: `useStatus` is a standard hook; when `DailyHealthCheck` mounts and calls the same endpoint, the browser reuses the in-flight or cached response
<!-- SECTION:NOTES:END -->
