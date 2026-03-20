---
id: task-9
title: Daily health check screen
status: To Do
assignee: []
created_date: '2026-03-20 14:06'
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
- [ ] #1 Defaults to yesterday's date on load
- [ ] #2 User can navigate backward and forward by day
- [ ] #3 Each member shows a traffic light selector (green/yellow/red)
- [ ] #4 Optional title and comment fields per member
- [ ] #5 Previous day's status and title are prefilled when no entry exists for the selected day
- [ ] #6 Comment field is empty by default (not prefilled)
- [ ] #7 Saving calls PUT /api/status and reflects the updated state
<!-- AC:END -->
