---
id: task-9
title: Daily health check screen
status: Done
assignee: []
created_date: '2026-03-20 14:06'
updated_date: '2026-03-20 18:36'
labels:
  - frontend
dependencies: []
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The primary user-facing feature. Allows each family member's daily health status to be viewed and edited for any given day.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Defaults to yesterday's date on load
- [x] #2 User can navigate backward and forward by day
- [x] #3 Each member shows a traffic light selector (green/yellow/red)
- [x] #4 Optional title and comment fields per member
- [x] #5 Previous day's status and title are prefilled when no entry exists for the selected day
- [x] #6 Comment field is empty by default (not prefilled)
- [x] #7 Saving calls PUT /api/status and reflects the updated state
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Add VITE_TIMEZONE to .env.example; create client/src/config.ts
2. Create MemberStatusRow component
3. Create DailyHealthCheck screen with date nav and save
4. Wire useMembers, useStatus, useUpsertStatus with prefill logic
5. Replace App.tsx scaffold with DailyHealthCheck
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- Created `client/src/config.ts` with `VITE_TIMEZONE` env var (default: `Europe/Berlin`); added to `.env.example`
- Created `MemberStatusRow` component: colored circle traffic light (green/yellow/red), title input, comment textarea
- Created `DailyHealthCheck` screen: tz-aware yesterday default, prev/next day nav, per-member form with prefill logic
- Prefill uses previous day's status + title; comment always starts empty
- Save calls `PUT /api/status` via `useUpsertStatus`; shows "Saved" confirmation or error inline
- Replaced App.tsx scaffold with `<DailyHealthCheck />`
<!-- SECTION:NOTES:END -->
