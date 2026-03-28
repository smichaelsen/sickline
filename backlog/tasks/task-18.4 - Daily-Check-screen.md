---
id: task-18.4
title: Daily Check screen
status: Done
assignee: []
created_date: '2026-03-28 07:51'
updated_date: '2026-03-28 08:40'
labels:
  - ios
dependencies: []
parent_task_id: task-18
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement the Daily Health Check tab: fetches yesterday's entries to prefill, lets the user set status/title/comment per member, and saves via PUT /api/status.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 DailyCheckViewModel (@Observable) fetches GET /api/status for yesterday to prefill status and title; comments always start empty
- [x] #2 DailyCheckViewModel exposes saveAll() calling PUT /api/status for all members
- [x] #3 DailyCheckView uses Form with one Section per family member
- [x] #4 Each section shows member name as header in their color, three tappable status buttons (green/yellow/red) with SF Symbols, TextField for title, TextEditor for comment
- [x] #5 Toolbar contains date navigation (prev/next chevrons or DatePicker) and a Save button
- [x] #6 Navigation title shows Today, Yesterday, or formatted date string
- [x] #7 Loading and error states are handled gracefully in the UI
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Create DailyCheckViewModel (@Observable) — fetch members + prefill from yesterday, saveAll() via PUT
2. Create DailyCheckView — NavigationStack, Form with MemberSection per member, toolbar with date nav + Save
3. Wire DailyCheckView into SicklineApp.swift TabView
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
- DailyCheckViewModel (@Observable): fetches /api/members once, then /api/status?date=<yesterday> to prefill status+title; comments always empty
- saveAll() builds StatusPayload and calls PUT /api/status with the selected date
- guard !isLoading prevents double-load when DailyCheckContent appears while the initial load is in flight
- DailyCheckView lazily creates the VM (needs @Environment apiClient) then hands off to DailyCheckContent
- DailyCheckContent: NavigationStack > Form > MemberSection per member; @Bindable for two-way bindings
- MemberSection: colored section header, 3 tappable circle buttons (green/yellow/red) with selection highlight, TextField for title, TextEditor for comment
- Toolbar: prev/next chevrons (forward disabled on today), Save button with ProgressView while saving
- .task(id: vm.selectedDate) on DailyCheckContent triggers reload on date change
- Error shown via .alert; loading shown via full-screen overlay

- Root cause of initial "cancelled" error: .task was attached to ProgressView branch which SwiftUI cancelled when viewModel was set; fixed by moving .task to the outer Group
- 401 was due to Config.swift containing the bcrypt hash instead of the plaintext password — user corrected it
- Confirmed working: member data loads from server
<!-- SECTION:NOTES:END -->
